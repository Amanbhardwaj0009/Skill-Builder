import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Quest } from '../models/Quest.js';
import { QuestProgress } from '../models/QuestProgress.js';
import { Submission } from '../models/Submission.js';
import { Project } from '../models/Project.js';
import { XPTransaction } from '../models/XPTransaction.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { GamificationService } from '../services/gamification.service.js';

export class DashboardController {
  static async getOverview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Calculate level metrics
      const currentLevel = user.currentLevel || 1;
      const currentLevelStartXP = GamificationService.xpForCurrentLevel(currentLevel);
      const nextLevelXP = GamificationService.xpForNextLevel(currentLevel);
      const levelProgressXP = Math.max(0, user.currentXP - currentLevelStartXP);
      const levelNeededXP = Math.max(1, nextLevelXP - currentLevelStartXP);
      const levelProgressPercentage = Math.min(100, Math.round((levelProgressXP / levelNeededXP) * 100));

      // Quests in progress and completed
      const progressDocs = await QuestProgress.find({ userId }).populate('questId');
      const completedCount = progressDocs.filter((p) => p.isCompleted).length;
      const inProgressQuests = progressDocs
        .filter((p) => !p.isCompleted && p.questId)
        .map((p: any) => {
          const totalStages = p.questId?.stages?.length || 1;
          const completedCount = p.completedStages?.length || 0;
          return {
            id: p.questId._id,
            slug: p.questId.slug,
            title: p.questId.title,
            category: p.questId.category,
            difficulty: p.questId.difficulty,
            progressPercentage: Math.round((completedCount / totalStages) * 100),
            currentStage: p.currentStage,
            totalStages,
            xpReward: p.questId.xpReward,
            estimatedDuration: p.questId.estimatedDuration,
          };
        });

      // Coding challenges count
      const challengesCompleted = await Submission.countDocuments({ userId, status: 'accepted' });

      // Projects completed count
      const projectsCompleted = await Project.countDocuments({ ownerId: userId, status: { $in: ['submitted', 'approved'] } });

      // Today's date for daily challenges check
      const today = new Date().toISOString().split('T')[0];
      const dailyTransactions = await XPTransaction.find({
        userId,
        referenceType: 'daily_challenge',
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      });

      const claimedDailyIds = new Set(dailyTransactions.map((t) => t.referenceId));

      const dailyChallenges = [
        {
          id: 'dc_quiz_1',
          title: 'Knowledge Checkpoint',
          description: 'Complete any concept quiz in a quest today',
          xpReward: 20,
          completed: claimedDailyIds.has('dc_quiz_1'),
        },
        {
          id: 'dc_code_1',
          title: 'Algorithmic Spark',
          description: 'Solve one coding challenge in the Coding Arena',
          xpReward: 30,
          completed: claimedDailyIds.has('dc_code_1'),
        },
        {
          id: 'dc_ai_1',
          title: 'Consult the Oracle',
          description: 'Ask the AI Mentor to explain a concept or debug code',
          xpReward: 15,
          completed: claimedDailyIds.has('dc_ai_1'),
        },
      ];

      // Recommended Quests (matching student interests or beginner friendly)
      const userInterests = user.interests || ['Web Development'];
      const recommendedQuests = await Quest.find({
        published: true,
        $or: [{ category: { $in: userInterests } }, { difficulty: user.skillLevel || 'beginner' }],
      })
        .limit(4)
        .select('title slug description category difficulty xpReward estimatedDuration');

      // Recent Achievements
      const userAchievements = await UserAchievement.find({ userId })
        .populate('achievementId')
        .sort({ unlockedAt: -1 })
        .limit(5);

      res.json({
        player: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          level: currentLevel,
          totalXP: user.currentXP,
          nextLevelXP,
          levelProgressXP,
          levelNeededXP,
          levelProgressPercentage,
          streak: user.streak,
          stats: {
            questsCompleted: completedCount,
            challengesCompleted,
            projectsCompleted,
            skillsPracticed: Math.max(userInterests.length, 3),
          },
        },
        inProgressQuests,
        dailyChallenges,
        recommendedQuests,
        recentAchievements: userAchievements.map((ua: any) => ({
          id: ua.achievementId?._id,
          code: ua.achievementId?.code,
          title: ua.achievementId?.title,
          description: ua.achievementId?.description,
          icon: ua.achievementId?.icon,
          unlockedAt: ua.unlockedAt,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to load dashboard overview', error: err.message });
    }
  }

  static async getAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;

      // Weekly activity: last 7 days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyActivity = [];
      const now = new Date();

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const start = new Date(d.setHours(0, 0, 0, 0));
        const end = new Date(d.setHours(23, 59, 59, 999));

        const transactions = await XPTransaction.find({
          userId,
          createdAt: { $gte: start, $lte: end },
        });

        const dayXP = transactions.reduce((acc, curr) => acc + curr.amount, 0);
        weeklyActivity.push({
          day: days[start.getDay()],
          date: start.toISOString().split('T')[0],
          xp: dayXP,
          activities: transactions.length,
        });
      }

      // Skill progression breakdown
      const progressDocs = await QuestProgress.find({ userId }).populate('questId');
      const categoryMap: Record<string, number> = {
        'Web Development': 20,
        'JavaScript': 15,
        'Python': 10,
        'Data Structures': 10,
        'Artificial Intelligence': 10,
      };

      progressDocs.forEach((p: any) => {
        if (p.questId && p.questId.category) {
          categoryMap[p.questId.category] = (categoryMap[p.questId.category] || 0) + (p.completedStages?.length || 1) * 15;
        }
      });

      const skillBreakdown = Object.entries(categoryMap).map(([subject, score]) => ({
        subject,
        score: Math.min(100, score),
        fullMark: 100,
      }));

      res.json({
        weeklyActivity,
        skillBreakdown,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
    }
  }

  static async claimDailyChallenge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const { challengeId } = req.body;

      const validChallenges: Record<string, { title: string; xp: number }> = {
        dc_quiz_1: { title: 'Knowledge Checkpoint', xp: 20 },
        dc_code_1: { title: 'Algorithmic Spark', xp: 30 },
        dc_ai_1: { title: 'Consult the Oracle', xp: 15 },
      };

      const selected = validChallenges[challengeId];
      if (!selected) {
        res.status(400).json({ message: 'Invalid daily challenge ID' });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const idempotencyKey = `daily_${challengeId}_${userId}_${today}`;

      const result = await GamificationService.awardXP({
        userId,
        amount: selected.xp,
        reason: `Completed Daily Challenge: ${selected.title}`,
        referenceType: 'daily_challenge',
        referenceId: challengeId,
        idempotencyKey,
      });

      if (!result.awarded) {
        res.status(400).json({ message: 'Daily challenge already claimed for today!' });
        return;
      }

      res.json({
        message: `Claimed +${selected.xp} XP for ${selected.title}!`,
        xpAwarded: selected.xp,
        currentXP: result.currentXP,
        currentLevel: result.currentLevel,
        leveledUp: result.leveledUp,
        unlockedAchievements: result.unlockedAchievements,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to claim daily challenge', error: err.message });
    }
  }
}

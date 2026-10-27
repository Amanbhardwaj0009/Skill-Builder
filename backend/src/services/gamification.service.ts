import mongoose from 'mongoose';
import { User, IUser } from '../models/User.js';
import { XPTransaction } from '../models/XPTransaction.js';
import { Achievement, IAchievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { QuestProgress } from '../models/QuestProgress.js';
import { Submission } from '../models/Submission.js';
import { Project } from '../models/Project.js';
import { Team } from '../models/Team.js';

export class GamificationService {
  /**
   * Calculate level based on XP: Level = floor(sqrt(XP / 100)) + 1
   */
  static calculateLevel(xp: number): number {
    if (xp < 0) return 1;
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  /**
   * Calculate XP needed for next level
   */
  static xpForNextLevel(level: number): number {
    return Math.pow(level, 2) * 100;
  }

  /**
   * Calculate XP needed for current level start
   */
  static xpForCurrentLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.pow(level - 1, 2) * 100;
  }

  /**
   * Award XP safely with anti-abuse idempotency and level up detection
   */
  static async awardXP(params: {
    userId: string | mongoose.Types.ObjectId;
    amount: number;
    reason: string;
    referenceType: 'quest' | 'challenge' | 'project' | 'streak' | 'daily_challenge' | 'admin_bonus';
    referenceId?: string;
    idempotencyKey: string;
  }): Promise<{
    awarded: boolean;
    currentXP: number;
    currentLevel: number;
    leveledUp: boolean;
    unlockedAchievements: IAchievement[];
  }> {
    const { userId, amount, reason, referenceType, referenceId, idempotencyKey } = params;

    // Check if this idempotency key was already processed
    const existing = await XPTransaction.findOne({ idempotencyKey });
    if (existing) {
      const user = await User.findById(userId);
      return {
        awarded: false,
        currentXP: user?.currentXP || 0,
        currentLevel: user?.currentLevel || 1,
        leveledUp: false,
        unlockedAchievements: [],
      };
    }

    // Record the XP transaction
    await XPTransaction.create({
      userId,
      amount,
      reason,
      referenceType,
      referenceId,
      idempotencyKey,
    });

    // Update user's XP and recalculate level
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const previousLevel = user.currentLevel || 1;
    user.currentXP = (user.currentXP || 0) + amount;
    const newLevel = this.calculateLevel(user.currentXP);
    const leveledUp = newLevel > previousLevel;
    user.currentLevel = newLevel;

    // Update streak if not active today
    await this.updateStreak(user);
    await user.save();

    // Check and trigger achievements
    const unlockedAchievements = await this.evaluateAchievements(user._id.toString());

    return {
      awarded: true,
      currentXP: user.currentXP,
      currentLevel: user.currentLevel,
      leveledUp,
      unlockedAchievements,
    };
  }

  /**
   * Update daily learning streak using UTC date comparison
   */
  static async updateStreak(user: IUser): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = user.streak?.lastActiveDate;

    if (!lastActive) {
      user.streak = {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
      };
      return;
    }

    if (lastActive === today) {
      // Already recorded for today
      return;
    }

    const lastDate = new Date(lastActive);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day!
      const current = (user.streak.currentStreak || 0) + 1;
      const longest = Math.max(current, user.streak.longestStreak || 0);
      user.streak.currentStreak = current;
      user.streak.longestStreak = longest;
      user.streak.lastActiveDate = today;
    } else if (diffDays > 1) {
      // Streak broken, reset to 1
      user.streak.currentStreak = 1;
      user.streak.lastActiveDate = today;
    }
  }

  /**
   * Check all achievement criteria for a user
   */
  static async evaluateAchievements(userId: string): Promise<IAchievement[]> {
    const allAchievements = await Achievement.find();
    const userAchievements = await UserAchievement.find({ userId });
    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId.toString()));

    const newlyUnlocked: IAchievement[] = [];
    const user = await User.findById(userId);
    if (!user) return [];

    // Pre-calculate user milestones
    const completedQuestsCount = await QuestProgress.countDocuments({ userId, isCompleted: true });
    const acceptedChallengesCount = await Submission.countDocuments({ userId, status: 'accepted' });
    const completedProjectsCount = await Project.countDocuments({ ownerId: userId, status: { $in: ['submitted', 'approved'] } });
    const isMemberOfTeam = await Team.exists({ memberIds: user._id });

    for (const ach of allAchievements) {
      if (unlockedIds.has(ach._id.toString())) continue;

      let satisfied = false;

      switch (ach.conditionType) {
        case 'quest_count':
          satisfied = completedQuestsCount >= ach.threshold;
          break;
        case 'streak_days':
          satisfied = (user.streak?.currentStreak || 0) >= ach.threshold;
          break;
        case 'challenge_count':
          satisfied = acceptedChallengesCount >= ach.threshold;
          break;
        case 'project_count':
          satisfied = completedProjectsCount >= ach.threshold;
          break;
        case 'xp_earned':
          satisfied = user.currentXP >= ach.threshold;
          break;
        case 'team_joined':
          satisfied = !!isMemberOfTeam;
          break;
      }

      if (satisfied) {
        await UserAchievement.create({
          userId: user._id,
          achievementId: ach._id,
        });

        // Award achievement reward XP
        if (ach.xpReward > 0) {
          await this.awardXP({
            userId: user._id,
            amount: ach.xpReward,
            reason: `Unlocked achievement: ${ach.title}`,
            referenceType: 'admin_bonus',
            referenceId: ach._id.toString(),
            idempotencyKey: `ach_${ach._id}_${user._id}`,
          });
        }

        newlyUnlocked.push(ach);
      }
    }

    return newlyUnlocked;
  }
}

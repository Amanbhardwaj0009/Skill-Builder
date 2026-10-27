import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { XPTransaction } from '../models/XPTransaction.js';
import { Achievement } from '../models/Achievement.js';
import { UserAchievement } from '../models/UserAchievement.js';

export class GamificationController {
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const userAchievements = await UserAchievement.find({ userId }).populate('achievementId');
      const allAchievements = await Achievement.find();

      const unlockedSet = new Map();
      userAchievements.forEach((ua: any) => {
        if (ua.achievementId) {
          unlockedSet.set(ua.achievementId._id.toString(), ua.unlockedAt);
        }
      });

      const achievementsList = allAchievements.map((ach) => ({
        id: ach._id,
        code: ach.code,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        category: ach.category,
        xpReward: ach.xpReward,
        isUnlocked: unlockedSet.has(ach._id.toString()),
        unlockedAt: unlockedSet.get(ach._id.toString()) || null,
      }));

      res.json({
        user,
        achievements: achievementsList,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch gamification profile', error: err.message });
    }
  }

  static async getXpHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const history = await XPTransaction.find({ userId })
        .sort({ createdAt: -1 })
        .limit(30);

      res.json({ history });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch XP history', error: err.message });
    }
  }

  static async getAchievements(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const allAchievements = await Achievement.find().sort({ threshold: 1 });

      let unlockedMap = new Map();
      if (userId) {
        const userAchs = await UserAchievement.find({ userId });
        userAchs.forEach((ua) => unlockedMap.set(ua.achievementId.toString(), ua.unlockedAt));
      }

      const results = allAchievements.map((ach) => ({
        id: ach._id,
        code: ach.code,
        title: ach.title,
        description: ach.description,
        icon: ach.icon,
        category: ach.category,
        threshold: ach.threshold,
        conditionType: ach.conditionType,
        xpReward: ach.xpReward,
        isUnlocked: unlockedMap.has(ach._id.toString()),
        unlockedAt: unlockedMap.get(ach._id.toString()) || null,
      }));

      res.json({ achievements: results });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch achievements', error: err.message });
    }
  }

  static async getLeaderboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const timeframe = (req.query.timeframe as string) || 'all'; // 'weekly' | 'monthly' | 'all'
      const currentUserId = req.user?._id?.toString();

      let leaderboardUsers: any[] = [];

      if (timeframe === 'weekly' || timeframe === 'monthly') {
        const days = timeframe === 'weekly' ? 7 : 30;
        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - days);

        // Aggregate XP earned within the timeframe
        const xpAgg = await XPTransaction.aggregate([
          { $match: { createdAt: { $gte: sinceDate } } },
          { $group: { _id: '$userId', totalPeriodXP: { $sum: '$amount' } } },
          { $sort: { totalPeriodXP: -1 } },
          { $limit: 50 },
        ]);

        const userIds = xpAgg.map((x) => x._id);
        const userDocs = await User.find({ _id: { $in: userIds }, 'privacy.showOnLeaderboard': true })
          .select('name avatar currentLevel currentXP');

        const userMap = new Map(userDocs.map((u) => [u._id.toString(), u]));

        leaderboardUsers = xpAgg
          .filter((x) => userMap.has(x._id.toString()))
          .map((x, index) => {
            const u = userMap.get(x._id.toString())!;
            return {
              rank: index + 1,
              userId: u._id,
              name: u.name,
              avatar: u.avatar,
              level: u.currentLevel,
              periodXP: x.totalPeriodXP,
              totalXP: u.currentXP,
              isCurrentUser: currentUserId ? u._id.toString() === currentUserId : false,
            };
          });
      } else {
        // All-time leaderboard based on total XP
        const topUsers = await User.find({ 'privacy.showOnLeaderboard': true })
          .sort({ currentXP: -1 })
          .limit(50)
          .select('name avatar currentLevel currentXP');

        leaderboardUsers = topUsers.map((u, index) => ({
          rank: index + 1,
          userId: u._id,
          name: u.name,
          avatar: u.avatar,
          level: u.currentLevel,
          periodXP: u.currentXP,
          totalXP: u.currentXP,
          isCurrentUser: currentUserId ? u._id.toString() === currentUserId : false,
        }));
      }

      // Find current user's specific rank
      let currentUserRank = null;
      if (currentUserId) {
        const existingInTop = leaderboardUsers.find((u) => u.userId.toString() === currentUserId);
        if (existingInTop) {
          currentUserRank = existingInTop.rank;
        } else {
          // If not in top 50, count users with higher XP
          const higherUsersCount = await User.countDocuments({
            'privacy.showOnLeaderboard': true,
            currentXP: { $gt: req.user?.currentXP || 0 },
          });
          currentUserRank = higherUsersCount + 1;
        }
      }

      res.json({
        timeframe,
        leaderboard: leaderboardUsers,
        currentUserRank,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to load leaderboard', error: err.message });
    }
  }
}

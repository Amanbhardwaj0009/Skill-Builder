import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Quest } from '../models/Quest.js';
import { Challenge } from '../models/Challenge.js';
import { QuestProgress } from '../models/QuestProgress.js';
import { Submission } from '../models/Submission.js';
import { Conversation } from '../models/Conversation.js';

export class AdminController {
  static async getAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const totalUsers = await User.countDocuments();
      const totalQuests = await Quest.countDocuments();
      const totalChallenges = await Challenge.countDocuments();
      const completedQuests = await QuestProgress.countDocuments({ isCompleted: true });
      const totalSubmissions = await Submission.countDocuments();
      const acceptedSubmissions = await Submission.countDocuments({ status: 'accepted' });
      const totalAiConversations = await Conversation.countDocuments();

      // Recent registered users
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('name email role currentXP currentLevel createdAt');

      res.json({
        metrics: {
          totalUsers,
          totalQuests,
          totalChallenges,
          completedQuests,
          totalSubmissions,
          acceptedSubmissions,
          totalAiConversations,
        },
        recentUsers,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch admin analytics', error: err.message });
    }
  }

  static async createQuest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const questData = req.body;
      const quest = await Quest.create(questData);
      res.status(201).json({ message: 'Quest created successfully', quest });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to create quest', error: err.message });
    }
  }

  static async updateQuest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { questId } = req.params;
      const updates = req.body;
      const quest = await Quest.findByIdAndUpdate(questId, { $set: updates }, { new: true });
      if (!quest) {
        res.status(404).json({ message: 'Quest not found' });
        return;
      }
      res.json({ message: 'Quest updated successfully', quest });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to update quest', error: err.message });
    }
  }

  static async deleteQuest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { questId } = req.params;
      await Quest.findByIdAndDelete(questId);
      res.json({ message: 'Quest deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to delete quest', error: err.message });
    }
  }

  static async createChallenge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const challengeData = req.body;
      const challenge = await Challenge.create(challengeData);
      res.status(201).json({ message: 'Challenge created successfully', challenge });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to create challenge', error: err.message });
    }
  }

  static async updateChallenge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { challengeId } = req.params;
      const updates = req.body;
      const challenge = await Challenge.findByIdAndUpdate(challengeId, { $set: updates }, { new: true });
      if (!challenge) {
        res.status(404).json({ message: 'Challenge not found' });
        return;
      }
      res.json({ message: 'Challenge updated successfully', challenge });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to update challenge', error: err.message });
    }
  }

  static async getUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await User.find().sort({ createdAt: -1 }).select('-passwordHash');
      res.json({ users });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
  }

  static async updateUserRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['student', 'administrator'].includes(role)) {
        res.status(400).json({ message: 'Invalid role' });
        return;
      }

      const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-passwordHash');
      res.json({ message: 'User role updated', user });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to update user role', error: err.message });
    }
  }
}

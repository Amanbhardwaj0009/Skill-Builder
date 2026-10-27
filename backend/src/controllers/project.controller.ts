import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { QuestProgress } from '../models/QuestProgress.js';
import { UserAchievement } from '../models/UserAchievement.js';
import { GamificationService } from '../services/gamification.service.js';

export class ProjectController {
  static async getProjects(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { visibility } = req.query;

      const query: any = {};
      if (visibility === 'public') {
        query.visibility = 'public';
      } else if (userId) {
        query.ownerId = userId;
      }

      const projects = await Project.find(query).sort({ updatedAt: -1 });
      res.json({ projects });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
    }
  }

  static async createProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const { title, description, category, difficulty, learningObjectives, tasks, repositoryUrl, liveDemoUrl } = req.body;

      const project = await Project.create({
        ownerId: userId,
        title,
        description,
        category,
        difficulty,
        learningObjectives: learningObjectives || [],
        tasks: tasks || [
          { id: 't1', title: 'Setup repository and project dependencies', completed: true },
          { id: 't2', title: 'Implement core functionality & components', completed: false },
          { id: 't3', title: 'Write tests & verify edge cases', completed: false },
          { id: 't4', title: 'Deploy live preview & document README', completed: false },
        ],
        repositoryUrl,
        liveDemoUrl,
        status: 'in_progress',
      });

      res.status(201).json({ project });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to create project', error: err.message });
    }
  }

  static async getProjectById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const project = await Project.findById(projectId).populate('ownerId', 'name avatar');
      if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
      }

      res.json({ project });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch project', error: err.message });
    }
  }

  static async updateProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = req.user!._id;

      const project = await Project.findOne({ _id: projectId, ownerId: userId });
      if (!project) {
        res.status(404).json({ message: 'Project not found or unauthorized' });
        return;
      }

      const { title, description, tasks, repositoryUrl, liveDemoUrl, status, submissionNotes } = req.body;

      if (title) project.title = title;
      if (description) project.description = description;
      if (tasks) project.tasks = tasks;
      if (repositoryUrl !== undefined) project.repositoryUrl = repositoryUrl;
      if (liveDemoUrl !== undefined) project.liveDemoUrl = liveDemoUrl;
      if (submissionNotes !== undefined) project.submissionNotes = submissionNotes;

      // Check if all tasks completed and user wants to submit/complete
      const allTasksDone = project.tasks.length > 0 && project.tasks.every((t) => t.completed);
      if (allTasksDone && status === 'submitted' && project.status !== 'approved') {
        project.status = 'submitted';

        // Award completion XP idempotently
        await GamificationService.awardXP({
          userId,
          amount: 100,
          reason: `Project Milestone: Shipped ${project.title}`,
          referenceType: 'project',
          referenceId: project._id.toString(),
          idempotencyKey: `project_ship_${project._id}_${userId}`,
        });
      } else if (status) {
        project.status = status;
      }

      await project.save();

      res.json({ message: 'Project updated', project });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to update project', error: err.message });
    }
  }

  static async getPortfolio(req: AuthRequest, res: Response): Promise<void> {
    try {
      const targetUserId = req.params.userId || req.user?._id;
      if (!targetUserId) {
        res.status(400).json({ message: 'User ID required' });
        return;
      }

      const user = await User.findById(targetUserId).select('-passwordHash');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Check privacy if looking at another user
      if (req.user && req.user._id.toString() !== targetUserId.toString() && !user.privacy?.isPublic) {
        res.status(403).json({ message: 'This portfolio is private' });
        return;
      }

      // Completed verified quests
      const verifiedQuests = await QuestProgress.find({ userId: targetUserId, isCompleted: true })
        .populate('questId', 'title category difficulty xpReward');

      // Verified achievements
      const achievements = await UserAchievement.find({ userId: targetUserId })
        .populate('achievementId', 'title description icon category');

      // Published projects
      const projects = await Project.find({
        ownerId: targetUserId,
        visibility: 'public',
      });

      // Distinguish self-reported skills from verified skills backed by completed quests
      const verifiedSkills = Array.from(
        new Set(
          verifiedQuests.map((vq: any) => vq.questId?.category).filter(Boolean)
        )
      );

      res.json({
        user: {
          name: user.name,
          avatar: user.avatar,
          level: user.currentLevel,
          totalXP: user.currentXP,
          streak: user.streak,
          interests: user.interests,
        },
        verifiedSkills,
        selfReportedInterests: user.interests,
        completedQuests: verifiedQuests.map((vq: any) => ({
          title: vq.questId?.title,
          category: vq.questId?.category,
          difficulty: vq.questId?.difficulty,
          xpReward: vq.questId?.xpReward,
          completedAt: vq.completedAt,
        })),
        achievements: achievements.map((a: any) => ({
          title: a.achievementId?.title,
          description: a.achievementId?.description,
          icon: a.achievementId?.icon,
          category: a.achievementId?.category,
          unlockedAt: a.unlockedAt,
        })),
        projects,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to load portfolio', error: err.message });
    }
  }
}

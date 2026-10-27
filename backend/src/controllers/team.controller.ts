import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Team } from '../models/Team.js';
import { GamificationService } from '../services/gamification.service.js';

export class TeamController {
  static async getUserTeam(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const team = await Team.findOne({ memberIds: userId })
        .populate('leaderId', 'name avatar')
        .populate('memberIds', 'name avatar currentLevel currentXP');

      if (!team) {
        res.json({ team: null });
        return;
      }

      res.json({ team });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch team', error: err.message });
    }
  }

  static async createTeam(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const { name, challengeTitle } = req.body;

      // Check if user is already in a team
      const existing = await Team.findOne({ memberIds: userId });
      if (existing) {
        res.status(400).json({ message: 'You are already a member of a team. Leave your current squad first.' });
        return;
      }

      // Generate random unique invite code
      const invitationCode = `SQUAD-${Math.floor(1000 + Math.random() * 9000)}`;

      const team = await Team.create({
        name,
        invitationCode,
        leaderId: userId,
        memberIds: [userId],
        challengeTitle: challengeTitle || 'Full-Stack Gamified App Challenge',
        challengeDescription: 'Collaborate with your squad to complete milestones, write tests, and deploy a mini feature.',
        progress: 25,
        tasks: [
          { id: 'task-1', title: 'Assemble squad & assign mission roles', completed: true, assignedTo: req.user!.name },
          { id: 'task-2', title: 'Design component hierarchy & data flow', completed: false },
          { id: 'task-3', title: 'Implement full-stack challenge solution', completed: false },
          { id: 'task-4', title: 'Code review & squad verification run', completed: false },
        ],
        score: 50,
      });

      // Award XP for forming team
      await GamificationService.awardXP({
        userId,
        amount: 30,
        reason: `Squad Commander: Formed team ${name}`,
        referenceType: 'admin_bonus',
        idempotencyKey: `team_create_${team._id}_${userId}`,
      });

      res.status(201).json({ team });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to create team', error: err.message });
    }
  }

  static async joinTeam(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const { invitationCode } = req.body;

      // Check if user is already in a team
      const existing = await Team.findOne({ memberIds: userId });
      if (existing) {
        res.status(400).json({ message: 'You are already a member of a team' });
        return;
      }

      const team = await Team.findOne({ invitationCode: invitationCode.toUpperCase().trim() });
      if (!team) {
        res.status(404).json({ message: 'Invalid squad invitation code. No team found.' });
        return;
      }

      team.memberIds.push(userId);
      await team.save();

      // Award XP for joining team
      await GamificationService.awardXP({
        userId,
        amount: 25,
        reason: `Squad Recruit: Joined team ${team.name}`,
        referenceType: 'admin_bonus',
        idempotencyKey: `team_join_${team._id}_${userId}`,
      });

      const populated = await Team.findById(team._id)
        .populate('leaderId', 'name avatar')
        .populate('memberIds', 'name avatar currentLevel currentXP');

      res.json({ message: `Successfully joined ${team.name}!`, team: populated });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to join team', error: err.message });
    }
  }

  static async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const { teamId, taskId } = req.params;
      const { completed } = req.body;

      const team = await Team.findOne({ _id: teamId, memberIds: userId });
      if (!team) {
        res.status(403).json({ message: 'You are not a member of this team' });
        return;
      }

      const task = team.tasks.find((t) => t.id === taskId);
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      task.completed = completed;
      if (completed && !task.assignedTo) {
        task.assignedTo = req.user!.name;
      }

      const completedCount = team.tasks.filter((t) => t.completed).length;
      team.progress = Math.round((completedCount / team.tasks.length) * 100);
      team.score = completedCount * 50;

      await team.save();

      res.json({ team });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to update squad task', error: err.message });
    }
  }

  static async getLeaderboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const teams = await Team.find()
        .sort({ score: -1, progress: -1 })
        .limit(10)
        .populate('leaderId', 'name avatar')
        .populate('memberIds', 'name avatar');

      const formatted = teams.map((t, index) => ({
        rank: index + 1,
        id: t._id,
        name: t.name,
        membersCount: t.memberIds.length,
        score: t.score,
        progress: t.progress,
        leaderName: (t.leaderId as any)?.name || 'Squad Leader',
      }));

      res.json({ teams: formatted });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to load team leaderboard', error: err.message });
    }
  }
}

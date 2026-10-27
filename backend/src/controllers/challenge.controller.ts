import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Challenge } from '../models/Challenge.js';
import { Submission } from '../models/Submission.js';
import { CodeExecutionService } from '../services/codeExecution.service.js';
import { GamificationService } from '../services/gamification.service.js';

export class ChallengeController {
  static async getChallenges(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { category, difficulty, language } = req.query;
      const query: any = { published: true };

      if (category && category !== 'All') query.category = category;
      if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
      if (language && language !== 'All') query.supportedLanguage = language;

      const challenges = await Challenge.find(query).select(
        'title slug description category difficulty supportedLanguage xpReward sampleTestCases'
      );

      // Check user completions
      const userId = req.user?._id;
      let completedIds = new Set<string>();

      if (userId) {
        const userSubs = await Submission.find({ userId, status: 'accepted' });
        completedIds = new Set(userSubs.map((s) => s.challengeId.toString()));
      }

      const formatted = challenges.map((c) => ({
        id: c._id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        category: c.category,
        difficulty: c.difficulty,
        supportedLanguage: c.supportedLanguage,
        xpReward: c.xpReward,
        testCasesCount: c.sampleTestCases.length,
        isCompleted: completedIds.has(c._id.toString()),
      }));

      res.json({ challenges: formatted });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch challenges', error: err.message });
    }
  }

  static async getChallengeById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const challengeId = String(req.params.challengeId || '');
      const isObjectId = challengeId.match(/^[0-9a-fA-F]{24}$/);
      const query = isObjectId ? { _id: challengeId } : { slug: challengeId };

      const challenge = await Challenge.findOne(query);
      if (!challenge) {
        res.status(404).json({ message: 'Challenge not found' });
        return;
      }

      // Safe test cases: only expose sample tests
      res.json({
        id: challenge._id,
        title: challenge.title,
        slug: challenge.slug,
        description: challenge.description,
        category: challenge.category,
        difficulty: challenge.difficulty,
        supportedLanguage: challenge.supportedLanguage,
        starterCode: challenge.starterCode,
        evaluationRules: challenge.evaluationRules,
        xpReward: challenge.xpReward,
        sampleTestCases: challenge.sampleTestCases,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to get challenge', error: err.message });
    }
  }

  static async runCode(req: AuthRequest, res: Response): Promise<void> {
    try {
      const challengeId = String(req.params.challengeId || '');
      const { code, language } = req.body;

      const isObjectId = challengeId.match(/^[0-9a-fA-F]{24}$/);
      const challenge = await Challenge.findOne(isObjectId ? { _id: challengeId } : { slug: challengeId });
      if (!challenge) {
        res.status(404).json({ message: 'Challenge not found' });
        return;
      }

      // Execute only against sample test cases for immediate user playground test
      const results = await CodeExecutionService.evaluateSolution(
        language || challenge.supportedLanguage,
        code,
        challenge.sampleTestCases
      );

      res.json({
        summary: results,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Code execution failed', error: err.message });
    }
  }

  static async submitCode(req: AuthRequest, res: Response): Promise<void> {
    try {
      const challengeId = String(req.params.challengeId || '');
      const { code, language } = req.body;
      const userId = req.user!._id;

      const isObjectId = challengeId.match(/^[0-9a-fA-F]{24}$/);
      const challenge = await Challenge.findOne(isObjectId ? { _id: challengeId } : { slug: challengeId });
      if (!challenge) {
        res.status(404).json({ message: 'Challenge not found' });
        return;
      }

      // Combine sample and private test cases for full verification
      const allTests = [...challenge.sampleTestCases, ...challenge.privateTestCases];
      const results = await CodeExecutionService.evaluateSolution(
        language || challenge.supportedLanguage,
        code,
        allTests
      );

      const status = results.allPassed ? 'accepted' : 'wrong_answer';

      // Save submission record
      const submission = await Submission.create({
        userId,
        challengeId: challenge._id,
        code,
        language: language || challenge.supportedLanguage,
        status,
        testResults: results.results,
        executionTimeMs: results.executionTimeMs,
      });

      let awardResult = {
        awarded: false,
        currentXP: req.user!.currentXP,
        currentLevel: req.user!.currentLevel,
        leveledUp: false,
        unlockedAchievements: [] as any[],
      };

      if (results.allPassed) {
        // Award XP for solving challenge (only once per challenge)
        awardResult = await GamificationService.awardXP({
          userId,
          amount: challenge.xpReward,
          reason: `Arena Victory: Solved ${challenge.title}`,
          referenceType: 'challenge',
          referenceId: challenge._id.toString(),
          idempotencyKey: `challenge_solve_${challenge._id}_${userId}`,
        });
      }

      res.json({
        submissionId: submission._id,
        status,
        results,
        xpAwarded: awardResult.awarded ? challenge.xpReward : 0,
        currentXP: awardResult.currentXP,
        currentLevel: awardResult.currentLevel,
        leveledUp: awardResult.leveledUp,
        unlockedAchievements: awardResult.unlockedAchievements,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Submission failed', error: err.message });
    }
  }

  static async getSubmissions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const { challengeId } = req.query;

      const query: any = { userId };
      if (challengeId) query.challengeId = challengeId;

      const submissions = await Submission.find(query)
        .sort({ submittedAt: -1 })
        .limit(20)
        .populate('challengeId', 'title slug difficulty xpReward');

      res.json({ submissions });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
    }
  }
}

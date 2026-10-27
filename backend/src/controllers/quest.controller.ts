import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Quest, IQuest } from '../models/Quest.js';
import { QuestProgress } from '../models/QuestProgress.js';
import { GamificationService } from '../services/gamification.service.js';
import { CodeExecutionService } from '../services/codeExecution.service.js';

export class QuestController {
  static async getQuests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { category, difficulty, search, status, sort } = req.query;
      const query: any = { published: true };

      if (category && category !== 'All') {
        query.category = category;
      }

      if (difficulty && difficulty !== 'All') {
        query.difficulty = difficulty;
      }

      if (search) {
        query.$or = [
          { title: { $regex: String(search), $options: 'i' } },
          { description: { $regex: String(search), $options: 'i' } },
        ];
      }

      let sortOptions: any = { createdAt: -1 };
      if (sort === 'xp_desc') sortOptions = { xpReward: -1 };
      if (sort === 'xp_asc') sortOptions = { xpReward: 1 };
      if (sort === 'title') sortOptions = { title: 1 };

      const quests = await Quest.find(query).sort(sortOptions);

      // Attach user-specific progress if authenticated
      const userId = req.user?._id;
      let userProgressMap: Record<string, { isCompleted: boolean; currentStage: number; completedStagesCount: number }> = {};

      if (userId) {
        const progressList = await QuestProgress.find({ userId });
        progressList.forEach((p) => {
          userProgressMap[p.questId.toString()] = {
            isCompleted: p.isCompleted,
            currentStage: p.currentStage,
            completedStagesCount: p.completedStages.length,
          };
        });
      }

      let formattedQuests = quests.map((q) => {
        const prog = userProgressMap[q._id.toString()];
        const totalStages = q.stages?.length || 1;
        const completedCount = prog?.completedStagesCount || 0;
        const progressPercentage = Math.round((completedCount / totalStages) * 100);

        let userStatus = 'not_started';
        if (prog?.isCompleted) userStatus = 'completed';
        else if (prog && completedCount > 0) userStatus = 'in_progress';

        return {
          id: q._id,
          title: q.title,
          slug: q.slug,
          description: q.description,
          category: q.category,
          difficulty: q.difficulty,
          learningObjectives: q.learningObjectives,
          estimatedDuration: q.estimatedDuration,
          xpReward: q.xpReward,
          totalStages,
          prerequisites: q.prerequisites,
          userStatus,
          progressPercentage,
          currentStage: prog?.currentStage || 1,
        };
      });

      if (status && status !== 'All') {
        formattedQuests = formattedQuests.filter((q) => q.userStatus === status);
      }

      res.json({ quests: formattedQuests });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch quests', error: err.message });
    }
  }

  static async getQuestById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const questId = String(req.params.questId || '');
      const isObjectId = questId.match(/^[0-9a-fA-F]{24}$/);
      const query = isObjectId ? { _id: questId } : { slug: questId };

      const quest = await Quest.findOne(query);
      if (!quest) {
        res.status(404).json({ message: 'Quest not found' });
        return;
      }

      let userProgress = null;
      if (req.user) {
        userProgress = await QuestProgress.findOne({
          userId: req.user._id,
          questId: quest._id,
        });

        if (!userProgress) {
          // Auto-initialize quest progress on first view
          userProgress = await QuestProgress.create({
            userId: req.user._id,
            questId: quest._id,
            currentStage: 1,
            completedStages: [],
          });
        }
      }

      // Hide secret solutions / correct answers from stages before client solves them
      const safeStages = quest.stages.map((stage) => {
        const stageObj: any = (stage as any).toObject ? (stage as any).toObject() : { ...stage };
        if (stageObj.quiz) {
          // Do not send correctOptionIndex directly to prevent cheating
          const { correctOptionIndex, explanation, ...quizRest } = stageObj.quiz;
          const isCompleted = userProgress?.completedStages?.includes(stage.stageNumber);
          return {
            ...stageObj,
            quiz: isCompleted
              ? stageObj.quiz // If already passed, full explanation is allowed
              : quizRest,
          };
        }
        if (stageObj.challenge) {
          const { solutionStub, ...challengeRest } = stageObj.challenge;
          return {
            ...stageObj,
            challenge: {
              ...challengeRest,
              // Only expose sample test cases, hide private
              testCases: stageObj.challenge.testCases.filter((tc: any) => !tc.isHidden),
            },
          };
        }
        return stageObj;
      });

      res.json({
        quest: {
          id: quest._id,
          title: quest.title,
          slug: quest.slug,
          description: quest.description,
          category: quest.category,
          difficulty: quest.difficulty,
          learningObjectives: quest.learningObjectives,
          estimatedDuration: quest.estimatedDuration,
          xpReward: quest.xpReward,
          prerequisites: quest.prerequisites,
          stages: safeStages,
        },
        progress: userProgress
          ? {
              currentStage: userProgress.currentStage,
              completedStages: userProgress.completedStages,
              isCompleted: userProgress.isCompleted,
            }
          : null,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to retrieve quest', error: err.message });
    }
  }

  static async submitStageQuiz(req: AuthRequest, res: Response): Promise<void> {
    try {
      const questId = String(req.params.questId || '');
      const { stageNumber, selectedOption } = req.body;
      const userId = req.user!._id;

      const isObjectId = questId.match(/^[0-9a-fA-F]{24}$/);
      const quest = await Quest.findOne(isObjectId ? { _id: questId } : { slug: questId });
      if (!quest) {
        res.status(404).json({ message: 'Quest not found' });
        return;
      }

      const stage = quest.stages.find((s) => s.stageNumber === stageNumber);
      if (!stage || !stage.quiz) {
        res.status(400).json({ message: 'Stage does not have an active quiz' });
        return;
      }

      const isCorrect = stage.quiz.correctOptionIndex === selectedOption;

      let progress = await QuestProgress.findOne({ userId, questId: quest._id });
      if (!progress) {
        progress = new QuestProgress({ userId, questId: quest._id });
      }

      progress.quizAnswers.push({ stageNumber, selectedOption, isCorrect });

      if (isCorrect) {
        if (!progress.completedStages.includes(stageNumber)) {
          progress.completedStages.push(stageNumber);
        }
        // Advance current stage if needed
        if (progress.currentStage === stageNumber && stageNumber < quest.stages.length) {
          progress.currentStage = stageNumber + 1;
        }
      }

      await progress.save();

      res.json({
        isCorrect,
        explanation: stage.quiz.explanation,
        correctOptionIndex: isCorrect ? stage.quiz.correctOptionIndex : undefined,
        currentStage: progress.currentStage,
        completedStages: progress.completedStages,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Quiz evaluation failed', error: err.message });
    }
  }

  static async submitStageChallenge(req: AuthRequest, res: Response): Promise<void> {
    try {
      const questId = String(req.params.questId || '');
      const { stageNumber, code, language } = req.body;
      const userId = req.user!._id;

      const isObjectId = questId.match(/^[0-9a-fA-F]{24}$/);
      const quest = await Quest.findOne(isObjectId ? { _id: questId } : { slug: questId });
      if (!quest) {
        res.status(404).json({ message: 'Quest not found' });
        return;
      }

      const stage = quest.stages.find((s) => s.stageNumber === stageNumber);
      if (!stage || !stage.challenge) {
        res.status(400).json({ message: 'Stage does not have an interactive challenge' });
        return;
      }

      // Execute code securely against all test cases
      const testCasesFormatted = stage.challenge.testCases.map((tc: any) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: !!tc.isHidden,
      }));

      const executionResult = await CodeExecutionService.evaluateSolution(
        language || stage.challenge.language,
        code,
        testCasesFormatted
      );

      let progress = await QuestProgress.findOne({ userId, questId: quest._id });
      if (!progress) {
        progress = new QuestProgress({ userId, questId: quest._id });
      }

      progress.codeSubmissions.push({
        stageNumber,
        code,
        passed: executionResult.allPassed,
      });

      if (executionResult.allPassed) {
        if (!progress.completedStages.includes(stageNumber)) {
          progress.completedStages.push(stageNumber);
        }
        if (progress.currentStage === stageNumber && stageNumber < quest.stages.length) {
          progress.currentStage = stageNumber + 1;
        }
      }

      await progress.save();

      res.json({
        success: executionResult.allPassed,
        executionResult,
        currentStage: progress.currentStage,
        completedStages: progress.completedStages,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Challenge evaluation failed', error: err.message });
    }
  }

  static async advanceConceptStage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const questId = String(req.params.questId || '');
      const { stageNumber } = req.body;
      const userId = req.user!._id;

      const isObjectId = questId.match(/^[0-9a-fA-F]{24}$/);
      const quest = await Quest.findOne(isObjectId ? { _id: questId } : { slug: questId });
      if (!quest) {
        res.status(404).json({ message: 'Quest not found' });
        return;
      }

      let progress = await QuestProgress.findOne({ userId, questId: quest._id });
      if (!progress) {
        progress = new QuestProgress({ userId, questId: quest._id });
      }

      if (!progress.completedStages.includes(stageNumber)) {
        progress.completedStages.push(stageNumber);
      }

      if (progress.currentStage === stageNumber && stageNumber < quest.stages.length) {
        progress.currentStage = stageNumber + 1;
      }

      await progress.save();

      res.json({
        success: true,
        currentStage: progress.currentStage,
        completedStages: progress.completedStages,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to advance stage', error: err.message });
    }
  }

  static async completeQuest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const questId = String(req.params.questId || '');
      const userId = req.user!._id;

      const isObjectId = questId.match(/^[0-9a-fA-F]{24}$/);
      const quest = await Quest.findOne(isObjectId ? { _id: questId } : { slug: questId });
      if (!quest) {
        res.status(404).json({ message: 'Quest not found' });
        return;
      }

      const progress = await QuestProgress.findOne({ userId, questId: quest._id });
      if (!progress) {
        res.status(400).json({ message: 'Quest has not been started yet' });
        return;
      }

      // Verify all stages are completed
      const totalStages = quest.stages.length;
      const isAllDone = quest.stages.every((s) => progress.completedStages.includes(s.stageNumber));

      if (!isAllDone) {
        res.status(400).json({
          message: 'All stages must be completed before completing the quest',
          completedStages: progress.completedStages,
          totalStages,
        });
        return;
      }

      progress.isCompleted = true;
      progress.completedAt = new Date();
      await progress.save();

      // Award Quest Completion XP idempotently
      const awardResult = await GamificationService.awardXP({
        userId,
        amount: quest.xpReward,
        reason: `Quest Victory: Completed ${quest.title}`,
        referenceType: 'quest',
        referenceId: quest._id.toString(),
        idempotencyKey: `quest_complete_${quest._id}_${userId}`,
      });

      res.json({
        message: `Congratulations! You conquered ${quest.title}!`,
        questTitle: quest.title,
        xpAwarded: awardResult.awarded ? quest.xpReward : 0,
        currentXP: awardResult.currentXP,
        currentLevel: awardResult.currentLevel,
        leveledUp: awardResult.leveledUp,
        unlockedAchievements: awardResult.unlockedAchievements,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Quest completion failed', error: err.message });
    }
  }
}

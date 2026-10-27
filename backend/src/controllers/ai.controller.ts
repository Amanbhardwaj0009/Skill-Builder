import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { AIService } from '../services/ai.service.js';
import { Conversation } from '../models/Conversation.js';

export class AIController {
  static async chat(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { messages, language, topicContext, conversationId } = req.body;
      const userId = req.user!._id;

      const aiReply = await AIService.chat(messages, language || req.user?.preferredLanguage, topicContext);

      // Persist to user's conversation history
      let conv = conversationId ? await Conversation.findOne({ _id: conversationId, userId }) : null;
      if (!conv) {
        const title = messages[0]?.content.slice(0, 30) + '...' || 'New Conversation';
        conv = await Conversation.create({
          userId,
          title,
          messages: [],
        });
      }

      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg) {
        conv.messages.push({
          role: lastUserMsg.role,
          content: lastUserMsg.content,
          timestamp: new Date(),
        });
      }

      conv.messages.push({
        role: 'assistant',
        content: aiReply,
        timestamp: new Date(),
      });

      await conv.save();

      res.json({
        reply: aiReply,
        conversationId: conv._id,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'AI chat error', error: err.message });
    }
  }

  static async explain(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { concept, language, skillLevel } = req.body;
      const userLang = language || req.user?.preferredLanguage || 'English';
      const userLevel = skillLevel || req.user?.skillLevel || 'beginner';

      const explanation = await AIService.explainConcept(concept, userLang, userLevel);
      res.json(explanation);
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to generate explanation', error: err.message });
    }
  }

  static async hint(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { prompt, code, hintLevel } = req.body;
      const hintData = await AIService.getHint(prompt, code, hintLevel || 1);
      res.json(hintData);
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to generate hint', error: err.message });
    }
  }

  static async generateQuiz(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { topic, difficulty } = req.body;
      const quiz = await AIService.generateQuiz(topic, difficulty || req.user?.skillLevel || 'beginner');
      res.json(quiz);
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to generate quiz', error: err.message });
    }
  }

  static async feedback(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { code, errorOrOutput, language } = req.body;
      const analysis = await AIService.analyzeMistake(code, errorOrOutput || '', language || 'javascript');
      res.json(analysis);
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to analyze code', error: err.message });
    }
  }

  static async learningPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      const interest = req.body.interest || req.user?.interests?.[0] || 'Web Development';
      const level = req.body.level || req.user?.skillLevel || 'beginner';
      const dailyMinutes = req.body.dailyMinutes || req.user?.dailyStudyMinutes || 30;
      const goals = req.body.goals || req.user?.learningGoals || ['Build projects', 'Get certified'];
      const language = req.body.language || req.user?.preferredLanguage || 'English';

      const plan = await AIService.generateLearningPlan({
        interest,
        level,
        dailyMinutes,
        goals,
        language,
      });

      res.json({ plan });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to generate learning plan', error: err.message });
    }
  }

  static async getConversations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const conversations = await Conversation.find({ userId })
        .sort({ updatedAt: -1 })
        .select('title createdAt updatedAt')
        .limit(15);
      res.json({ conversations });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to load conversations', error: err.message });
    }
  }
}

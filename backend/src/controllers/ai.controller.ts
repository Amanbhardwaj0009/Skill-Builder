import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { AIService } from '../services/ai.service.js';
import { Conversation } from '../models/Conversation.js';
import { RAGService } from '../services/rag.service.js';
import { AiUsageModel, DAILY_AI_REQUEST_LIMIT, MAX_DOCUMENTS_PER_USER } from '../models/AiUsage.js';
import { config } from '../config/env.js';

export class AIController {
  /**
   * Check LLM configuration status
   */
  static async getStatus(req: Request, res: Response): Promise<void> {
    res.json({
      hasServerKey: Boolean(config.llm.apiKey),
      provider: config.llm.provider,
      model: config.llm.model,
      baseUrl: config.llm.baseUrl || undefined,
    });
  }

  static async chat(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        messages,
        language,
        topicContext,
        conversationId,
        enableRag,
        documentIds,
        apiKey,
        provider,
        model,
        baseUrl,
      } = req.body;
      const userId = req.user!._id;

      const chatResult = await AIService.chat(messages, {
        userId: userId.toString(),
        language: language || req.user?.preferredLanguage,
        topicContext,
        enableRag: enableRag !== false,
        documentIds,
        apiKey,
        provider,
        model,
        baseUrl,
      });

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
        content: chatResult.reply,
        timestamp: new Date(),
      });

      await conv.save();

      res.json({
        reply: chatResult.reply,
        conversationId: conv._id,
        sources: chatResult.sources,
        routingMode: chatResult.routingMode,
        multiQuestionHandled: chatResult.multiQuestionHandled,
      });
    } catch (err: any) {
      const isQuota = err.message?.includes('limit reached');
      const isKeyMissing = err.message?.includes('not configured');
      const isAuthError = err.message?.includes('Invalid') || err.message?.includes('Unauthorized');
      const statusCode = isQuota ? 429 : isKeyMissing ? 503 : isAuthError ? 401 : 500;

      res.status(statusCode).json({
        message: err.message,
        error: err.message,
        code: isKeyMissing ? 'LLM_KEY_REQUIRED' : isQuota ? 'QUOTA_EXCEEDED' : 'PROVIDER_ERROR',
        canRetry: !isQuota,
      });
    }
  }

  /**
   * Server-Sent Events (SSE) streaming chat endpoint
   */
  static async chatStream(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        messages,
        language,
        topicContext,
        conversationId,
        enableRag,
        documentIds,
        apiKey,
        provider,
        model,
        baseUrl,
      } = req.body;
      const userId = req.user!._id;

      // Set headers for SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();

      const chatResult = await AIService.chat(messages, {
        userId: userId.toString(),
        language: language || req.user?.preferredLanguage,
        topicContext,
        enableRag: enableRag !== false,
        documentIds,
        apiKey,
        provider,
        model,
        baseUrl,
      });

      // Stream out the response tokens/chunks
      const words = chatResult.reply.split(/(\s+)/);
      for (let i = 0; i < words.length; i++) {
        const chunk = words[i];
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        if (i % 8 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      }

      // Persist to conversation
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
        content: chatResult.reply,
        timestamp: new Date(),
      });
      await conv.save();

      // Final event with sources & metadata
      res.write(
        `data: ${JSON.stringify({
          done: true,
          conversationId: conv._id,
          sources: chatResult.sources,
          routingMode: chatResult.routingMode,
          multiQuestionHandled: chatResult.multiQuestionHandled,
        })}\n\n`
      );
      res.end();
    } catch (err: any) {
      if (!res.headersSent) {
        res.status(500).json({ message: 'Streaming error', error: err.message });
      } else {
        res.write(`data: ${JSON.stringify({ error: err.message, canRetry: true })}\n\n`);
        res.end();
      }
    }
  }

  /**
   * Upload and index course/knowledge documents for RAG
   */
  static async uploadDocument(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      let filename = '';
      let buffer: Buffer | null = null;
      let fileType: 'pdf' | 'docx' | 'txt' | 'md' = 'txt';

      if ((req as any).file) {
        const file = (req as any).file;
        filename = file.originalname;
        buffer = file.buffer;
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') fileType = 'pdf';
        else if (ext === 'docx') fileType = 'docx';
        else if (ext === 'md' || ext === 'markdown') fileType = 'md';
        else fileType = 'txt';
      } else if (req.body.filename && req.body.content) {
        filename = req.body.filename;
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') fileType = 'pdf';
        else if (ext === 'docx') fileType = 'docx';
        else if (ext === 'md' || ext === 'markdown') fileType = 'md';
        else fileType = 'txt';

        if (req.body.isBase64) {
          buffer = Buffer.from(req.body.content, 'base64');
        } else {
          buffer = Buffer.from(req.body.content, 'utf-8');
        }
      } else {
        res.status(400).json({ message: 'No file provided. Upload a file or provide filename and content in JSON.' });
        return;
      }

      if (!buffer || buffer.length === 0) {
        res.status(400).json({ message: 'Uploaded file is empty.' });
        return;
      }

      const indexedDoc = await RAGService.ingestDocument(userId, filename, buffer, fileType);

      res.status(201).json({
        message: 'Document successfully indexed for RAG retrieval',
        document: indexedDoc,
      });
    } catch (err: any) {
      res.status(400).json({ message: 'Failed to process document', error: err.message });
    }
  }

  /**
   * List user's indexed documents
   */
  static async getDocuments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const documents = await RAGService.getUserDocuments(userId);
      res.json({ documents });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to retrieve documents', error: err.message });
    }
  }

  /**
   * Delete document and chunks
   */
  static async deleteDocument(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const id = req.params.id as string;
      const success = await RAGService.deleteDocument(userId, id);
      if (!success) {
        res.status(404).json({ message: 'Document not found or unauthorized' });
        return;
      }
      res.json({ message: 'Document removed successfully' });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to delete document', error: err.message });
    }
  }

  /**
   * Get user AI usage and daily quotas
   */
  static async getUsage(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id;
      const today = new Date().toISOString().split('T')[0];
      const usage = await AiUsageModel.findOne({ userId, date: today });
      const documentsCount = await (await import('../models/Document.js')).DocumentModel.countDocuments({ userId });

      res.json({
        date: today,
        requestsCount: usage?.requestsCount || 0,
        requestsLimit: DAILY_AI_REQUEST_LIMIT,
        tokensUsed: usage?.tokensUsed || 0,
        ragQueriesCount: usage?.ragQueriesCount || 0,
        documentsCount,
        documentsLimit: MAX_DOCUMENTS_PER_USER,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to retrieve AI usage', error: err.message });
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

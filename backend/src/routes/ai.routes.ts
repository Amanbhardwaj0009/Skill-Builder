import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import {
  aiChatSchema,
  aiExplainSchema,
  aiHintSchema,
  aiGenerateQuizSchema,
  aiFeedbackSchema,
} from '../validators/schemas.js';

const router = Router();

router.post('/chat', authenticate, validateRequest(aiChatSchema), AIController.chat);
router.post('/explain', authenticate, validateRequest(aiExplainSchema), AIController.explain);
router.post('/hint', authenticate, validateRequest(aiHintSchema), AIController.hint);
router.post('/generate-quiz', authenticate, validateRequest(aiGenerateQuizSchema), AIController.generateQuiz);
router.post('/feedback', authenticate, validateRequest(aiFeedbackSchema), AIController.feedback);
router.post('/learning-plan', authenticate, AIController.learningPlan);
router.get('/conversations', authenticate, AIController.getConversations);

export default router;

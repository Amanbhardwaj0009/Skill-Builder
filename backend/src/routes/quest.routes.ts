import { Router } from 'express';
import { QuestController } from '../controllers/quest.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { quizSubmitSchema, challengeSubmitSchema } from '../validators/schemas.js';

const router = Router();

// Allow optional auth on quests list so public visitors can browse
router.get('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) return authenticate(req, res, next);
  next();
}, QuestController.getQuests);

router.get('/:questId', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) return authenticate(req, res, next);
  next();
}, QuestController.getQuestById);

router.post('/:questId/quiz', authenticate, validateRequest(quizSubmitSchema), QuestController.submitStageQuiz);
router.post('/:questId/challenge', authenticate, validateRequest(challengeSubmitSchema), QuestController.submitStageChallenge);
router.post('/:questId/advance', authenticate, QuestController.advanceConceptStage);
router.post('/:questId/complete', authenticate, QuestController.completeQuest);

export default router;

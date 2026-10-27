import { Router } from 'express';
import { ChallengeController } from '../controllers/challenge.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { challengeRunSchema, challengeSubmitSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) return authenticate(req, res, next);
  next();
}, ChallengeController.getChallenges);

router.get('/submissions', authenticate, ChallengeController.getSubmissions);
router.get('/:challengeId', ChallengeController.getChallengeById);
router.post('/:challengeId/run', authenticate, validateRequest(challengeRunSchema), ChallengeController.runCode);
router.post('/:challengeId/submit', authenticate, validateRequest(challengeSubmitSchema), ChallengeController.submitCode);

export default router;

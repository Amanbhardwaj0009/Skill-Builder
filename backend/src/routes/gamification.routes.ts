import { Router } from 'express';
import { GamificationController } from '../controllers/gamification.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/profile', authenticate, GamificationController.getProfile);
router.get('/xp-history', authenticate, GamificationController.getXpHistory);
router.get('/achievements', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) return authenticate(req, res, next);
  next();
}, GamificationController.getAchievements);
router.get('/leaderboard', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) return authenticate(req, res, next);
  next();
}, GamificationController.getLeaderboard);

export default router;

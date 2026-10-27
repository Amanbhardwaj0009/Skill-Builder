import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, DashboardController.getOverview);
router.get('/analytics', authenticate, DashboardController.getAnalytics);
router.post('/claim-daily', authenticate, DashboardController.claimDailyChallenge);

export default router;

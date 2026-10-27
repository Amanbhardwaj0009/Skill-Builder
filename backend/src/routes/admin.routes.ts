import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = Router();

// Protect all admin routes
router.use(authenticate, requireAdmin);

router.get('/analytics', AdminController.getAnalytics);
router.post('/quests', AdminController.createQuest);
router.patch('/quests/:questId', AdminController.updateQuest);
router.delete('/quests/:questId', AdminController.deleteQuest);

router.post('/challenges', AdminController.createChallenge);
router.patch('/challenges/:challengeId', AdminController.updateChallenge);

router.get('/users', AdminController.getUsers);
router.patch('/users/:userId/role', AdminController.updateUserRole);

export default router;

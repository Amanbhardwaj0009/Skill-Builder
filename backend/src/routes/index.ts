import { Router } from 'express';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import questRoutes from './quest.routes.js';
import challengeRoutes from './challenge.routes.js';
import aiRoutes from './ai.routes.js';
import gamificationRoutes from './gamification.routes.js';
import projectRoutes from './project.routes.js';
import teamRoutes from './team.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/quests', questRoutes);
router.use('/challenges', challengeRoutes);
router.use('/ai', aiRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/projects', projectRoutes);
router.use('/teams', teamRoutes);
router.use('/admin', adminRoutes);

// System health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'SkillQuest AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

export default router;

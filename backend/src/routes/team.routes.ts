import { Router } from 'express';
import { TeamController } from '../controllers/team.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { teamCreateSchema, teamJoinSchema } from '../validators/schemas.js';

const router = Router();

router.get('/my', authenticate, TeamController.getUserTeam);
router.get('/leaderboard', TeamController.getLeaderboard);
router.post('/', authenticate, validateRequest(teamCreateSchema), TeamController.createTeam);
router.post('/join', authenticate, validateRequest(teamJoinSchema), TeamController.joinTeam);
router.patch('/:teamId/tasks/:taskId', authenticate, TeamController.updateTask);

export default router;

import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { projectCreateSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) return authenticate(req, res, next);
  next();
}, ProjectController.getProjects);

router.post('/', authenticate, validateRequest(projectCreateSchema), ProjectController.createProject);
router.get('/portfolio/:userId?', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) return authenticate(req, res, next);
  next();
}, ProjectController.getPortfolio);

router.get('/:projectId', ProjectController.getProjectById);
router.patch('/:projectId', authenticate, ProjectController.updateProject);

export default router;

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { registerSchema, loginSchema, onboardingSchema, updateProfileSchema } from '../validators/schemas.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/demo-login', AuthController.demoLogin);
router.get('/me', authenticate, AuthController.me);
router.post('/onboarding', authenticate, validateRequest(onboardingSchema), AuthController.completeOnboarding);
router.patch('/profile', authenticate, validateRequest(updateProfileSchema), AuthController.updateProfile);

export default router;

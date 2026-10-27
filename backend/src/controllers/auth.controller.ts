import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { config } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';
import { GamificationService } from '../services/gamification.service.js';

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
};

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, preferredLanguage, mainInterest } = req.body;

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists with this email address' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        preferredLanguage: preferredLanguage || 'English',
        interests: mainInterest ? [mainInterest] : ['Web Development'],
        currentXP: 50, // Starting bonus XP
        currentLevel: 1,
        streak: {
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
        },
      });

      // Award initial signup XP transaction
      await GamificationService.awardXP({
        userId: user._id,
        amount: 50,
        reason: 'Recruit Bonus: Signed up to SkillQuest AI',
        referenceType: 'admin_bonus',
        idempotencyKey: `signup_${user._id}`,
      });

      const token = generateToken(user._id.toString());

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          currentXP: user.currentXP,
          currentLevel: user.currentLevel,
          streak: user.streak,
          preferredLanguage: user.preferredLanguage,
          interests: user.interests,
          onboardingCompleted: user.onboardingCompleted,
        },
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      // Check streak update upon login
      await GamificationService.updateStreak(user);
      await user.save();

      const token = generateToken(user._id.toString());

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          currentXP: user.currentXP,
          currentLevel: user.currentLevel,
          streak: user.streak,
          preferredLanguage: user.preferredLanguage,
          interests: user.interests,
          onboardingCompleted: user.onboardingCompleted,
        },
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Login failed', error: err.message });
    }
  }

  static async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      const user = req.user;
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        currentXP: user.currentXP,
        currentLevel: user.currentLevel,
        streak: user.streak,
        preferredLanguage: user.preferredLanguage,
        interests: user.interests,
        skillLevel: user.skillLevel,
        currentCareer: user.currentCareer || 'Manufacturing Engineer',
        careerCluster: user.careerCluster || 'Manufacturing',
        learningGoals: user.learningGoals,
        dailyStudyMinutes: user.dailyStudyMinutes,
        privacy: user.privacy,
        onboardingCompleted: user.onboardingCompleted,
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to fetch user', error: err.message });
    }
  }

  static async completeOnboarding(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      const { interests, skillLevel, dailyStudyMinutes, learningGoals, preferredLanguage } = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      user.interests = interests || user.interests;
      user.skillLevel = skillLevel || user.skillLevel;
      user.dailyStudyMinutes = dailyStudyMinutes || user.dailyStudyMinutes;
      user.learningGoals = learningGoals || user.learningGoals;
      user.preferredLanguage = preferredLanguage || user.preferredLanguage;
      user.onboardingCompleted = true;

      await user.save();

      // Award onboarding completion XP
      await GamificationService.awardXP({
        userId: user._id,
        amount: 25,
        reason: 'Mission Briefing Completed: Profile Calibration',
        referenceType: 'admin_bonus',
        idempotencyKey: `onboarding_${user._id}`,
      });

      res.json({
        message: 'Onboarding completed successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          currentXP: user.currentXP,
          currentLevel: user.currentLevel,
          streak: user.streak,
          preferredLanguage: user.preferredLanguage,
          interests: user.interests,
          skillLevel: user.skillLevel,
          learningGoals: user.learningGoals,
          dailyStudyMinutes: user.dailyStudyMinutes,
          onboardingCompleted: true,
        },
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to complete onboarding', error: err.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      const updates = req.body;
      const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).select('-passwordHash');

      res.json({ message: 'Profile updated successfully', user });
    } catch (err: any) {
      res.status(500).json({ message: 'Failed to update profile', error: err.message });
    }
  }

  static async demoLogin(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.body; // 'student' or 'admin'
      const email = role === 'admin' ? 'admin@skillquest.ai' : 'student@skillquest.ai';

      let user = await User.findOne({ email });
      if (!user) {
        // Create if doesn't exist yet
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('DemoPass123!', salt);
        user = await User.create({
          name: role === 'admin' ? 'Commander Admin' : 'Alex Mercer',
          email,
          passwordHash,
          role: role === 'admin' ? 'administrator' : 'student',
          avatar: role === 'admin' ? 'https://api.dicebear.com/7.x/bottts/svg?seed=Commander' : 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
          currentXP: role === 'admin' ? 1200 : 350,
          currentLevel: role === 'admin' ? 4 : 2,
          interests: ['Web Development', 'Artificial Intelligence', 'Data Structures and Algorithms'],
          skillLevel: 'intermediate',
          onboardingCompleted: true,
          streak: {
            currentStreak: 5,
            longestStreak: 12,
            lastActiveDate: new Date().toISOString().split('T')[0],
          },
        });
      }

      const token = generateToken(user._id.toString());
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          currentXP: user.currentXP,
          currentLevel: user.currentLevel,
          streak: user.streak,
          preferredLanguage: user.preferredLanguage,
          interests: user.interests,
          onboardingCompleted: user.onboardingCompleted,
        },
      });
    } catch (err: any) {
      res.status(500).json({ message: 'Demo login failed', error: err.message });
    }
  }
}

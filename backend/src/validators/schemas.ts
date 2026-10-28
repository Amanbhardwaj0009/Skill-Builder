import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  preferredLanguage: z.string().optional().default('English'),
  mainInterest: z.string().optional().default('Web Development'),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const onboardingSchema = z.object({
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  dailyStudyMinutes: z.number().min(5).max(480).default(30),
  learningGoals: z.array(z.string()).default([]),
  preferredLanguage: z.string().default('English'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
  preferredLanguage: z.string().optional(),
  interests: z.array(z.string()).optional(),
  currentCareer: z.string().optional(),
  careerCluster: z.string().optional(),
  learningGoals: z.array(z.string()).optional(),
  dailyStudyMinutes: z.number().optional(),
  privacy: z.object({
    isPublic: z.boolean().optional(),
    showOnLeaderboard: z.boolean().optional(),
  }).optional(),
});

export const quizSubmitSchema = z.object({
  stageNumber: z.number(),
  selectedOption: z.number(),
});

export const challengeRunSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.enum(['javascript', 'python', 'html']),
});

export const challengeSubmitSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.enum(['javascript', 'python', 'html']),
});

export const aiChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1),
    })
  ),
  language: z.string().optional().default('English'),
  topicContext: z.string().optional(),
  conversationId: z.string().optional(),
  enableRag: z.boolean().optional().default(true),
  documentIds: z.array(z.string()).optional(),
});

export const aiExplainSchema = z.object({
  concept: z.string().min(1, 'Concept is required'),
  language: z.string().optional().default('English'),
  skillLevel: z.string().optional().default('beginner'),
});

export const aiHintSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  code: z.string().optional(),
  hintLevel: z.number().optional().default(1),
});

export const aiGenerateQuizSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  difficulty: z.string().optional().default('beginner'),
});

export const aiFeedbackSchema = z.object({
  code: z.string().min(1),
  errorOrOutput: z.string().default(''),
  language: z.string().default('javascript'),
});

export const projectCreateSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  learningObjectives: z.array(z.string()).default([]),
  tasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean().default(false),
  })).default([]),
  repositoryUrl: z.string().url().optional().or(z.literal('')),
  liveDemoUrl: z.string().url().optional().or(z.literal('')),
});

export const teamCreateSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters'),
  challengeTitle: z.string().optional(),
});

export const teamJoinSchema = z.object({
  invitationCode: z.string().min(4, 'Valid invite code required'),
});

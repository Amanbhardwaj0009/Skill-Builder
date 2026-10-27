import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatar: string;
  role: 'student' | 'administrator';
  preferredLanguage: string;
  interests: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  learningGoals: string[];
  dailyStudyMinutes: number;
  currentXP: number;
  currentLevel: number;
  currentCareer: string;
  careerCluster: string;
  streak: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null; // YYYY-MM-DD
  };
  privacy: {
    isPublic: boolean;
    showOnLeaderboard: boolean;
  };
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: 'https://api.dicebear.com/7.x/bottts/svg?seed=SkillQuest' },
    role: { type: String, enum: ['student', 'administrator'], default: 'student', index: true },
    preferredLanguage: { type: String, default: 'English' },
    interests: [{ type: String }],
    skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    learningGoals: [{ type: String }],
    dailyStudyMinutes: { type: Number, default: 30 },
    currentXP: { type: Number, default: 0, index: true },
    currentLevel: { type: Number, default: 1 },
    currentCareer: { type: String, default: 'Manufacturing Engineer' },
    careerCluster: { type: String, default: 'Manufacturing' },
    streak: {
      currentStreak: { type: Number, default: 0 },
      longestStreak: { type: Number, default: 0 },
      lastActiveDate: { type: String, default: null },
    },
    privacy: {
      isPublic: { type: Boolean, default: true },
      showOnLeaderboard: { type: Boolean, default: true },
    },
    onboardingCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

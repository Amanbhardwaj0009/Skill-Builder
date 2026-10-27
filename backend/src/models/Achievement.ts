import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  code: string;
  title: string;
  description: string;
  icon: string;
  category: 'quest' | 'streak' | 'challenge' | 'project' | 'team';
  conditionType: 'quest_count' | 'streak_days' | 'challenge_count' | 'project_count' | 'xp_earned' | 'team_joined';
  threshold: number;
  xpReward: number;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    code: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Trophy' },
    category: {
      type: String,
      enum: ['quest', 'streak', 'challenge', 'project', 'team'],
      required: true,
    },
    conditionType: {
      type: String,
      enum: ['quest_count', 'streak_days', 'challenge_count', 'project_count', 'xp_earned', 'team_joined'],
      required: true,
    },
    threshold: { type: Number, required: true },
    xpReward: { type: Number, default: 50 },
  },
  { timestamps: true }
);

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);

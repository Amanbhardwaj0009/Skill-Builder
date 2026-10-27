import mongoose, { Document, Schema } from 'mongoose';

export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface IChallenge extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  supportedLanguage: 'javascript' | 'python' | 'html';
  starterCode: string;
  sampleTestCases: ITestCase[];
  privateTestCases: ITestCase[];
  evaluationRules?: string;
  xpReward: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema = new Schema<ITestCase>({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  explanation: { type: String },
});

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true, index: true },
    supportedLanguage: { type: String, enum: ['javascript', 'python', 'html'], required: true },
    starterCode: { type: String, required: true },
    sampleTestCases: [TestCaseSchema],
    privateTestCases: [TestCaseSchema],
    evaluationRules: { type: String },
    xpReward: { type: Number, default: 25 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Challenge = mongoose.model<IChallenge>('Challenge', ChallengeSchema);

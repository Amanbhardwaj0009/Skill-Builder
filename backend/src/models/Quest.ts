import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizStage {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface IChallengeStage {
  prompt: string;
  starterCode: string;
  language: string;
  solutionStub?: string;
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }[];
}

export interface IQuestStage {
  stageNumber: number;
  title: string;
  type: 'concept' | 'example' | 'quiz' | 'challenge';
  content: string;
  codeExample?: string;
  quiz?: IQuizStage;
  challenge?: IChallengeStage;
}

export interface IQuest extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningObjectives: string[];
  estimatedDuration: string;
  xpReward: number;
  prerequisites: string[]; // slugs
  stages: IQuestStage[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StageSchema = new Schema<IQuestStage>({
  stageNumber: { type: Number, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['concept', 'example', 'quiz', 'challenge'], required: true },
  content: { type: String, required: true },
  codeExample: { type: String },
  quiz: {
    question: { type: String },
    options: [{ type: String }],
    correctOptionIndex: { type: Number },
    explanation: { type: String },
  },
  challenge: {
    prompt: { type: String },
    starterCode: { type: String },
    language: { type: String },
    solutionStub: { type: String },
    testCases: [
      {
        input: { type: String },
        expectedOutput: { type: String },
        isHidden: { type: Boolean, default: false },
      },
    ],
  },
});

const QuestSchema = new Schema<IQuest>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true, index: true },
    learningObjectives: [{ type: String }],
    estimatedDuration: { type: String, default: '30 mins' },
    xpReward: { type: Number, default: 50 },
    prerequisites: [{ type: String }],
    stages: [StageSchema],
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Quest = mongoose.model<IQuest>('Quest', QuestSchema);

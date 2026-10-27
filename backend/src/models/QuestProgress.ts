import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestProgress extends Document {
  userId: mongoose.Types.ObjectId;
  questId: mongoose.Types.ObjectId;
  currentStage: number;
  completedStages: number[];
  isCompleted: boolean;
  startedAt: Date;
  completedAt?: Date;
  quizAnswers: { stageNumber: number; selectedOption: number; isCorrect: boolean }[];
  codeSubmissions: { stageNumber: number; code: string; passed: boolean }[];
}

const QuestProgressSchema = new Schema<IQuestProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    questId: { type: Schema.Types.ObjectId, ref: 'Quest', required: true, index: true },
    currentStage: { type: Number, default: 1 },
    completedStages: [{ type: Number }],
    isCompleted: { type: Boolean, default: false, index: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    quizAnswers: [
      {
        stageNumber: { type: Number },
        selectedOption: { type: Number },
        isCorrect: { type: Boolean },
      },
    ],
    codeSubmissions: [
      {
        stageNumber: { type: Number },
        code: { type: String },
        passed: { type: Boolean },
      },
    ],
  },
  { timestamps: true }
);

QuestProgressSchema.index({ userId: 1, questId: 1 }, { unique: true });

export const QuestProgress = mongoose.model<IQuestProgress>('QuestProgress', QuestProgressSchema);

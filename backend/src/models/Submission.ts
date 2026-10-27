import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded';
  testResults: {
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    error?: string;
    isHidden?: boolean;
  }[];
  executionTimeMs: number;
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    status: {
      type: String,
      enum: ['accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded'],
      required: true,
    },
    testResults: [
      {
        passed: { type: Boolean, required: true },
        input: { type: String },
        expected: { type: String },
        actual: { type: String },
        error: { type: String },
        isHidden: { type: Boolean, default: false },
      },
    ],
    executionTimeMs: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);

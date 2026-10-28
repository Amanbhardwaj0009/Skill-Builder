import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IAiUsage extends MongooseDocument {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  requestsCount: number;
  tokensUsed: number;
  ragQueriesCount: number;
  documentsUploaded: number;
  createdAt: Date;
  updatedAt: Date;
}

const AiUsageSchema = new Schema<IAiUsage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    requestsCount: { type: Number, default: 0 },
    tokensUsed: { type: Number, default: 0 },
    ragQueriesCount: { type: Number, default: 0 },
    documentsUploaded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AiUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DAILY_AI_REQUEST_LIMIT = 100;
export const MAX_DOCUMENTS_PER_USER = 10;

export const AiUsageModel = mongoose.model<IAiUsage>('AiUsage', AiUsageSchema);

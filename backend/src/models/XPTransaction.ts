import mongoose, { Document, Schema } from 'mongoose';

export interface IXPTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  reason: string;
  referenceType: 'quest' | 'challenge' | 'project' | 'streak' | 'daily_challenge' | 'admin_bonus';
  referenceId?: string;
  idempotencyKey: string;
  createdAt: Date;
}

const XPTransactionSchema = new Schema<IXPTransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    referenceType: {
      type: String,
      enum: ['quest', 'challenge', 'project', 'streak', 'daily_challenge', 'admin_bonus'],
      required: true,
    },
    referenceId: { type: String },
    idempotencyKey: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const XPTransaction = mongoose.model<IXPTransaction>('XPTransaction', XPTransactionSchema);

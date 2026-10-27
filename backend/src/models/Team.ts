import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamTask {
  id: string;
  title: string;
  assignedTo?: string;
  completed: boolean;
}

export interface ITeam extends Document {
  name: string;
  invitationCode: string;
  leaderId: mongoose.Types.ObjectId;
  memberIds: mongoose.Types.ObjectId[];
  challengeTitle: string;
  challengeDescription: string;
  progress: number;
  tasks: ITeamTask[];
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true },
    invitationCode: { type: String, required: true, unique: true, index: true },
    leaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    challengeTitle: { type: String, default: 'Full-Stack Gamified App Challenge' },
    challengeDescription: { type: String, default: 'Collaborate with your squad to complete milestones, write tests, and deploy a mini feature.' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    tasks: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        assignedTo: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Team = mongoose.model<ITeam>('Team', TeamSchema);

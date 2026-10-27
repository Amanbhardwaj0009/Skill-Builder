import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface IProject extends Document {
  ownerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningObjectives: string[];
  tasks: IProjectTask[];
  status: 'in_progress' | 'submitted' | 'approved';
  visibility: 'public' | 'private';
  repositoryUrl?: string;
  liveDemoUrl?: string;
  submissionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    learningObjectives: [{ type: String }],
    tasks: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    status: { type: String, enum: ['in_progress', 'submitted', 'approved'], default: 'in_progress' },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    repositoryUrl: { type: String },
    liveDemoUrl: { type: String },
    submissionNotes: { type: String },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

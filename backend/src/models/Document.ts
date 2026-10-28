import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  userId: mongoose.Types.ObjectId;
  title: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'md';
  fileSize: number;
  status: 'processing' | 'indexed' | 'failed';
  chunkCount: number;
  summary?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    filename: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'docx', 'txt', 'md'], required: true },
    fileSize: { type: Number, required: true },
    status: { type: String, enum: ['processing', 'indexed', 'failed'], default: 'processing' },
    chunkCount: { type: Number, default: 0 },
    summary: { type: String, default: '' },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);

export interface IDocumentChunk extends MongooseDocument {
  userId: mongoose.Types.ObjectId;
  documentId: mongoose.Types.ObjectId;
  filename: string;
  chunkIndex: number;
  pageNumber: number;
  text: string;
  vector: number[];
  keywords: string[];
  createdAt: Date;
}

const DocumentChunkSchema = new Schema<IDocumentChunk>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
    filename: { type: String, required: true },
    chunkIndex: { type: Number, required: true },
    pageNumber: { type: Number, default: 1 },
    text: { type: String, required: true },
    vector: { type: [Number], default: [] },
    keywords: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  }
);

DocumentChunkSchema.index({ userId: 1, documentId: 1 });
DocumentChunkSchema.index({ userId: 1, keywords: 1 });

export const DocumentChunkModel = mongoose.model<IDocumentChunk>('DocumentChunk', DocumentChunkSchema);

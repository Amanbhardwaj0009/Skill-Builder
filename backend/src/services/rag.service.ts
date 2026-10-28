import mongoose from 'mongoose';
import zlib from 'zlib';
import { DocumentModel, DocumentChunkModel, IDocument, IDocumentChunk } from '../models/Document.js';
import { AiUsageModel, MAX_DOCUMENTS_PER_USER } from '../models/AiUsage.js';

export interface RetrievedChunk {
  chunkId: string;
  documentId: string;
  filename: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  score: number;
  citation: string;
}

export class RAGService {
  private static readonly VECTOR_DIMENSIONS = 128;
  private static readonly STOPWORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
    'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can',
    'cannot', 'could', 'did', 'do', 'does', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from',
    'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his',
    'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its', 'itself', 'let\'s', 'me', 'more', 'most',
    'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
    'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that',
    'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
    'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while',
    'who', 'whom', 'why', 'with', 'won\'t', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
  ]);

  /**
   * Ingest and index an uploaded document
   */
  static async ingestDocument(
    userId: string | mongoose.Types.ObjectId,
    filename: string,
    buffer: Buffer,
    fileType: 'pdf' | 'docx' | 'txt' | 'md'
  ): Promise<IDocument> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Enforce document limit
    const existingDocCount = await DocumentModel.countDocuments({ userId: userObjectId });
    if (existingDocCount >= MAX_DOCUMENTS_PER_USER) {
      throw new Error(`Document limit reached (${MAX_DOCUMENTS_PER_USER} documents max). Please delete older documents before uploading new ones.`);
    }

    // 1. Create document entry
    const title = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const doc = await DocumentModel.create({
      userId: userObjectId,
      title,
      filename,
      fileType,
      fileSize: buffer.length,
      status: 'processing',
      chunkCount: 0,
    });

    try {
      // 2. Extract text and pages
      const { text, pages } = await this.extractTextFromBuffer(buffer, fileType);

      if (!text || text.trim().length === 0) {
        throw new Error('Extracted document content is empty.');
      }

      // 3. Chunk text
      const chunks = this.chunkDocument(text, pages, filename);

      // 4. Generate embeddings and save chunks
      const chunkDocs = chunks.map((chunk, index) => {
        const keywords = this.extractKeywords(chunk.text);
        const vector = this.generateEmbedding(chunk.text, keywords);

        return {
          userId: userObjectId,
          documentId: doc._id,
          filename,
          chunkIndex: index,
          pageNumber: chunk.pageNumber,
          text: chunk.text,
          vector,
          keywords,
        };
      });

      if (chunkDocs.length > 0) {
        await DocumentChunkModel.insertMany(chunkDocs);
      }

      // 5. Update document status
      doc.status = 'indexed';
      doc.chunkCount = chunkDocs.length;
      doc.summary = text.slice(0, 240).trim() + (text.length > 240 ? '...' : '');
      await doc.save();

      // Track usage
      const today = new Date().toISOString().split('T')[0];
      await AiUsageModel.findOneAndUpdate(
        { userId: userObjectId, date: today },
        { $inc: { documentsUploaded: 1 } },
        { upsert: true }
      );

      return doc;
    } catch (err: any) {
      doc.status = 'failed';
      doc.errorMessage = err.message || 'Failed to process document';
      await doc.save();
      throw err;
    }
  }

  /**
   * Semantic vector and keyword search across indexed documents
   */
  static async searchRelevantChunks(
    userId: string | mongoose.Types.ObjectId,
    query: string,
    topK: number = 4,
    minScoreThreshold: number = 0.22,
    documentIds?: string[]
  ): Promise<RetrievedChunk[]> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const queryKeywords = this.extractKeywords(query);
    const queryVector = this.generateEmbedding(query, queryKeywords);

    const filter: any = { userId: userObjectId };
    if (documentIds && documentIds.length > 0) {
      filter.documentId = { $in: documentIds.map((id) => new mongoose.Types.ObjectId(id)) };
    }

    const candidateChunks = await DocumentChunkModel.find(filter).lean();
    if (!candidateChunks || candidateChunks.length === 0) {
      return [];
    }

    const scoredChunks: RetrievedChunk[] = [];

    for (const chunk of candidateChunks) {
      const cosineSim = this.cosineSimilarity(queryVector, chunk.vector);
      const keywordOverlap = this.calculateKeywordOverlap(queryKeywords, chunk.keywords);

      // Hybrid score: 65% semantic embedding, 35% exact keyword match
      const compositeScore = (cosineSim * 0.65) + (keywordOverlap * 0.35);

      if (compositeScore >= minScoreThreshold) {
        scoredChunks.push({
          chunkId: chunk._id.toString(),
          documentId: chunk.documentId.toString(),
          filename: chunk.filename,
          pageNumber: chunk.pageNumber,
          chunkIndex: chunk.chunkIndex,
          text: chunk.text,
          score: Math.round(compositeScore * 100) / 100,
          citation: `[Source: ${chunk.filename}${chunk.pageNumber > 0 ? `, Page ${chunk.pageNumber}` : ''}]`,
        });
      }
    }

    // Sort descending by score
    scoredChunks.sort((a, b) => b.score - a.score);

    return scoredChunks.slice(0, topK);
  }

  /**
   * Delete a document and all its indexed chunks
   */
  static async deleteDocument(userId: string | mongoose.Types.ObjectId, documentId: string): Promise<boolean> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const docObjectId = new mongoose.Types.ObjectId(documentId);

    const doc = await DocumentModel.findOne({ _id: docObjectId, userId: userObjectId });
    if (!doc) return false;

    await DocumentChunkModel.deleteMany({ documentId: docObjectId, userId: userObjectId });
    await DocumentModel.deleteOne({ _id: docObjectId, userId: userObjectId });

    return true;
  }

  /**
   * List all documents for user
   */
  static async getUserDocuments(userId: string | mongoose.Types.ObjectId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return DocumentModel.find({ userId: userObjectId }).sort({ createdAt: -1 });
  }

  /**
   * Extract text from various buffer types
   */
  private static async extractTextFromBuffer(
    buffer: Buffer,
    fileType: 'pdf' | 'docx' | 'txt' | 'md'
  ): Promise<{ text: string; pages: { pageNumber: number; text: string }[] }> {
    if (fileType === 'txt' || fileType === 'md') {
      const text = buffer.toString('utf-8');
      return {
        text,
        pages: [{ pageNumber: 1, text }],
      };
    }

    if (fileType === 'pdf') {
      try {
        const pdfModule = await import('pdf-parse');
        const pdfParse = (pdfModule as any).default || pdfModule;
        const pdfData = await pdfParse(buffer);
        const fullText = pdfData.text || '';

        // Approximate page breakdown by form feed characters \f
        const rawPages = fullText.split('\f');
        const pages = rawPages.map((pageText: string, idx: number) => ({
          pageNumber: idx + 1,
          text: pageText.trim(),
        })).filter((p: any) => p.text.length > 0);

        return {
          text: fullText,
          pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: fullText }],
        };
      } catch (err: any) {
        console.warn('⚠️ pdf-parse error, falling back to stream extraction:', err.message);
        const text = buffer.toString('latin1').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
        return { text, pages: [{ pageNumber: 1, text }] };
      }
    }

    if (fileType === 'docx') {
      const text = this.extractTextFromDocxBuffer(buffer);
      return {
        text,
        pages: [{ pageNumber: 1, text }],
      };
    }

    const fallback = buffer.toString('utf-8');
    return { text: fallback, pages: [{ pageNumber: 1, text: fallback }] };
  }

  /**
   * Pure Node.js DOCX text extraction by reading word/document.xml from ZIP structure
   */
  private static extractTextFromDocxBuffer(buffer: Buffer): string {
    try {
      // Find ZIP local file headers (0x04034b50)
      let offset = 0;
      while (offset < buffer.length - 30) {
        if (
          buffer[offset] === 0x50 &&
          buffer[offset + 1] === 0x4b &&
          buffer[offset + 2] === 0x03 &&
          buffer[offset + 3] === 0x04
        ) {
          const compMethod = buffer.readUInt16LE(offset + 8);
          const compSize = buffer.readUInt32LE(offset + 18);
          const fileNameLen = buffer.readUInt16LE(offset + 26);
          const extraLen = buffer.readUInt16LE(offset + 28);
          const fileName = buffer.toString('utf-8', offset + 30, offset + 30 + fileNameLen);
          const dataOffset = offset + 30 + fileNameLen + extraLen;

          if (fileName === 'word/document.xml' && dataOffset + compSize <= buffer.length) {
            const compressedData = buffer.subarray(dataOffset, dataOffset + compSize);
            let xmlContent = '';
            if (compMethod === 8) {
              // Deflated
              xmlContent = zlib.inflateRawSync(compressedData).toString('utf-8');
            } else if (compMethod === 0) {
              xmlContent = compressedData.toString('utf-8');
            }

            // Extract text from <w:t> tags
            const textMatches = xmlContent.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g);
            if (textMatches) {
              return textMatches
                .map((t) => t.replace(/<[^>]+>/g, ''))
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
            }
          }

          offset = dataOffset + compSize;
        } else {
          offset++;
        }
      }
    } catch (e: any) {
      console.warn('⚠️ DOCX XML extraction fallback:', e.message);
    }

    // Fallback: strip XML tags from readable text
    return buffer
      .toString('utf-8')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Split document into overlapping chunks preserving boundaries
   */
  private static chunkDocument(
    fullText: string,
    pages: { pageNumber: number; text: string }[],
    filename: string
  ): { text: string; pageNumber: number }[] {
    const targetChunkSize = 480;
    const overlapSize = 80;
    const chunks: { text: string; pageNumber: number }[] = [];

    if (pages.length > 1) {
      for (const page of pages) {
        const pageChunks = this.splitTextIntoChunks(page.text, targetChunkSize, overlapSize);
        for (const chunkText of pageChunks) {
          if (chunkText.trim().length > 25) {
            chunks.push({ text: chunkText.trim(), pageNumber: page.pageNumber });
          }
        }
      }
    } else {
      const splitChunks = this.splitTextIntoChunks(fullText, targetChunkSize, overlapSize);
      for (const chunkText of splitChunks) {
        if (chunkText.trim().length > 25) {
          chunks.push({ text: chunkText.trim(), pageNumber: 1 });
        }
      }
    }

    return chunks;
  }

  private static splitTextIntoChunks(text: string, chunkSize: number, overlap: number): string[] {
    const cleanText = text.replace(/\r\n/g, '\n').trim();
    if (cleanText.length <= chunkSize) {
      return [cleanText];
    }

    const chunks: string[] = [];
    let start = 0;

    while (start < cleanText.length) {
      let end = start + chunkSize;
      if (end >= cleanText.length) {
        chunks.push(cleanText.substring(start).trim());
        break;
      }

      // Try to break at a paragraph or sentence boundary
      const boundaryLookback = Math.max(start, end - 100);
      const textWindow = cleanText.substring(boundaryLookback, end);
      const breakIdx = textWindow.lastIndexOf('\n\n');
      const sentenceIdx = textWindow.lastIndexOf('. ');

      let splitPoint = end;
      if (breakIdx !== -1) {
        splitPoint = boundaryLookback + breakIdx + 2;
      } else if (sentenceIdx !== -1) {
        splitPoint = boundaryLookback + sentenceIdx + 2;
      }

      chunks.push(cleanText.substring(start, splitPoint).trim());
      start = Math.max(start + 1, splitPoint - overlap);
    }

    return chunks;
  }

  /**
   * Extract prominent keywords with frequency
   */
  private static extractKeywords(text: string): string[] {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9_\-#\+\.]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !this.STOPWORDS.has(w));

    const freqMap = new Map<string, number>();
    for (const w of words) {
      freqMap.set(w, (freqMap.get(w) || 0) + 1);
    }

    return Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word]) => word);
  }

  /**
   * Generate 128-dimensional dense semantic embedding vector
   */
  private static generateEmbedding(text: string, keywords: string[]): number[] {
    const vector = new Array(this.VECTOR_DIMENSIONS).fill(0);
    const words = text.toLowerCase().split(/\s+/);

    // 1. Hash keywords with frequency weight
    for (const kw of keywords) {
      const hash1 = this.hashString(kw, 31);
      const hash2 = this.hashString(kw, 59);
      const idx1 = Math.abs(hash1) % this.VECTOR_DIMENSIONS;
      const idx2 = Math.abs(hash2) % this.VECTOR_DIMENSIONS;

      const weight = 1.0 + Math.log(1 + kw.length);
      vector[idx1] += weight;
      vector[idx2] += weight * 0.5;
    }

    // 2. Hash bigrams for phrase semantics
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]}_${words[i + 1]}`;
      const hash = Math.abs(this.hashString(bigram, 71)) % this.VECTOR_DIMENSIONS;
      vector[hash] += 0.8;
    }

    // 3. L2 Normalize vector
    let sumSq = 0;
    for (let i = 0; i < this.VECTOR_DIMENSIONS; i++) {
      sumSq += vector[i] * vector[i];
    }

    const norm = Math.sqrt(sumSq) || 1.0;
    for (let i = 0; i < this.VECTOR_DIMENSIONS; i++) {
      vector[i] = Math.round((vector[i] / norm) * 10000) / 10000;
    }

    return vector;
  }

  private static hashString(str: string, prime: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * prime + str.charCodeAt(i)) | 0;
    }
    return hash;
  }

  private static cosineSimilarity(a: number[], b: number[]): number {
    if (!a || !b || a.length === 0 || b.length === 0) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    const len = Math.min(a.length, b.length);

    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator ? Math.max(0, dot / denominator) : 0;
  }

  private static calculateKeywordOverlap(queryKeywords: string[], docKeywords: string[]): number {
    if (queryKeywords.length === 0 || docKeywords.length === 0) return 0;
    const docSet = new Set(docKeywords);
    let matches = 0;

    for (const qk of queryKeywords) {
      if (docSet.has(qk)) matches++;
    }

    return matches / queryKeywords.length;
  }
}

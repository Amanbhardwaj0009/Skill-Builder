import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Bot,
  Send,
  Sparkles,
  Globe,
  RotateCcw,
  Copy,
  Check,
  FileText,
  UploadCloud,
  Trash2,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Layers,
  Database,
  Info,
  X,
  FileCode,
  FileCheck,
  Flame,
} from 'lucide-react';

interface RetrievedSource {
  chunkId: string;
  documentId: string;
  filename: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  score: number;
  citation: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: RetrievedSource[];
  routingMode?: 'rag' | 'general' | 'hybrid';
  multiQuestionHandled?: boolean;
}

interface DocumentItem {
  _id: string;
  title: string;
  filename: string;
  fileType: string;
  fileSize: number;
  status: 'processing' | 'indexed' | 'failed';
  chunkCount: number;
  summary?: string;
  createdAt: string;
}

interface UsageInfo {
  requestsCount: number;
  requestsLimit: number;
  tokensUsed: number;
  ragQueriesCount: number;
  documentsCount: number;
  documentsLimit: number;
}

export const MentorPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Greetings Explorer ${user?.name || ''}! 🛡️ I am your **SkillQuest AI Mentor & Knowledge Assistant**.

I am fully open-ended and ready to explore any question:
- Demystify algorithms, data structures (DSA), architectures, and system design.
- Answer compound questions broken down into structured, numbered sections.
- Retrieve and cite information from your **uploaded course documents (RAG)**.
- Explain code line-by-line, debug syntax and logical errors, or convert code across languages.
- Break down concepts in **English** or **Hindi (हिंदी)**.

What challenge or document would you like to explore today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'English');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // RAG & Knowledge Base State
  const [enableRag, setEnableRag] = useState(true);
  const [isKnowledgeDrawerOpen, setIsKnowledgeDrawerOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeCitation, setActiveCitation] = useState<RetrievedSource | null>(null);

  // Usage Quota State
  const [usage, setUsage] = useState<UsageInfo>({
    requestsCount: 0,
    requestsLimit: 100,
    tokensUsed: 0,
    ragQueriesCount: 0,
    documentsCount: 0,
    documentsLimit: 10,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load documents and usage info on mount
  useEffect(() => {
    fetchDocuments();
    fetchUsage();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/ai/documents');
      if (res.data?.documents) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.warn('Could not fetch documents:', err);
    }
  };

  const fetchUsage = async () => {
    try {
      const res = await api.get('/ai/usage');
      if (res.data) {
        setUsage(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch usage:', err);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        language,
        topicContext: user?.interests?.[0] || 'Computer Science',
        enableRag,
      });

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: res.data.reply,
          sources: res.data.sources || [],
          routingMode: res.data.routingMode,
          multiQuestionHandled: res.data.multiQuestionHandled,
        },
      ]);
      fetchUsage();
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        '⚠️ I encountered an interruption in our neural connection. Please verify your connection or try again shortly.';
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: errMsg,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadStatus('Reading file bytes...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      setUploadStatus('Extracting text & generating vector embeddings...');
      await api.post('/ai/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadStatus('Document indexed successfully!');
      setTimeout(() => setUploadStatus(null), 3000);
      fetchDocuments();
      fetchUsage();
    } catch (err: any) {
      const message = err.response?.data?.error || err.response?.data?.message || 'Failed to upload document.';
      setUploadError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!window.confirm('Delete this document and all its indexed embeddings?')) return;
    try {
      await api.delete(`/ai/documents/${id}`);
      fetchDocuments();
      fetchUsage();
    } catch (err: any) {
      alert('Failed to delete document: ' + (err.response?.data?.message || err.message));
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const suggestedPrompts = [
    'Explain HTML, compare it with CSS, and provide a practical code example.',
    'What are the key concepts in my uploaded document?',
    'Explain how Hash Maps achieve O(1) lookup in Hindi (हिंदी).',
    'How does Binary Search work and what is its logarithmic time complexity?',
    'Convert this solution to Python and explain the syntax differences.',
  ];

  return (
    <div className="relative flex h-[calc(100vh-7rem)] flex-col rounded-3xl border border-purple-500/20 bg-[#121B2D]/90 shadow-2xl backdrop-blur overflow-hidden animate-fade-in">
      {/* Top Mentor Control Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-800 bg-[#101626] px-4 md:px-6 py-3.5 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px] shadow-glow-cyan">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#080B14]">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">AI Mentor & RAG Assistant</h2>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-semibold hidden sm:inline">Active & Synchronized</span>
            </div>
            <p className="text-[11px] text-gray-400">Open-Ended Guidance & Course Knowledge Base</p>
          </div>
        </div>

        {/* Quota Counter & Controls */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Daily Quota Indicator */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#080B14] px-3 py-1.5 text-[11px] text-gray-300">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>
              <strong className="text-white">{usage.requestsCount}</strong> / {usage.requestsLimit} Quota
            </span>
          </div>

          {/* Knowledge Base Drawer Toggle */}
          <button
            onClick={() => setIsKnowledgeDrawerOpen(!isKnowledgeDrawerOpen)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              isKnowledgeDrawerOpen || documents.length > 0
                ? 'border-purple-500/50 bg-purple-950/40 text-purple-300 hover:bg-purple-900/50'
                : 'border-gray-800 bg-[#080B14] text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-purple-400" />
            <span>Knowledge Base</span>
            {documents.length > 0 && (
              <span className="ml-1 rounded-full bg-purple-600/80 px-1.5 py-0.2 text-[10px] font-bold text-white">
                {documents.length}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-gray-800 bg-[#080B14] px-2.5 py-1 text-xs">
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs text-gray-200 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Hinglish">Hinglish</option>
            </select>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  content: 'Neural memory reset. What new problem or topic shall we tackle?',
                },
              ])
            }
            className="flex items-center gap-1 rounded-xl border border-gray-800 bg-[#080B14] px-2.5 py-1.5 text-xs text-gray-400 hover:text-white transition"
            title="Start new conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Main Chat Messages Feed */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-cyan-400 border border-purple-500/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-3xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple/20'
                      : 'border border-gray-800 bg-[#101626] text-gray-200 shadow-md'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800/60">
                      <div className="flex items-center gap-2">
                        {msg.routingMode === 'rag' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-purple-950/80 border border-purple-600/40 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                            <BookOpen className="h-3 w-3 text-purple-400" />
                            RAG Document Synthesis
                          </span>
                        )}
                        {msg.multiQuestionHandled && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-cyan-950/80 border border-cyan-600/40 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                            <Sparkles className="h-3 w-3 text-cyan-400" />
                            Multi-Part Analysis
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => copyToClipboard(msg.content, index)}
                        className="text-gray-500 hover:text-white transition"
                        title="Copy message"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Render Message Content with Code block formatting */}
                  <div className="space-y-3 whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Source Citations Drawer if available */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-purple-500/20">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-400 mb-2">
                        <Database className="h-3.5 w-3.5" />
                        <span>Verified Knowledge Sources ({msg.sources.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => setActiveCitation(src)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-[#080B14] px-2.5 py-1 text-[11px] text-purple-300 hover:border-purple-400 hover:text-white transition"
                          >
                            <FileCheck className="h-3 w-3 text-cyan-400" />
                            <span>{src.filename}</span>
                            <span className="text-[10px] text-gray-400">P.{src.pageNumber}</span>
                            <span className="rounded bg-purple-900/60 px-1 text-[9px] text-purple-200">
                              {Math.round(src.score * 100)}%
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                    <span className="text-xs font-bold">{user?.name?.[0] || 'U'}</span>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-cyan-400 border border-purple-500/30">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2.5 rounded-2xl border border-gray-800 bg-[#101626] px-4 py-3 text-xs text-gray-300 shadow-lg">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-cyan-300 font-medium">Retrieving knowledge & synthesizing answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Slide-out Knowledge Base (RAG) Drawer */}
        {isKnowledgeDrawerOpen && (
          <div className="w-80 md:w-96 border-l border-gray-800 bg-[#0c101c] p-4 flex flex-col z-20 shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Course Documents (RAG)</h3>
              </div>
              <button
                onClick={() => setIsKnowledgeDrawerOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:text-white hover:bg-gray-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[11px] text-gray-400 mt-2">
              Upload PDF, DOCX, TXT, or Markdown notes. The AI will semantically index and cite them in your answers.
            </p>

            {/* Document Upload Area */}
            <div className="mt-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx,.txt,.md,.markdown"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || documents.length >= usage.documentsLimit}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-purple-500/40 bg-purple-950/20 p-4 hover:border-purple-400 hover:bg-purple-950/30 transition disabled:opacity-40"
              >
                <UploadCloud className="h-6 w-6 text-purple-400" />
                <span className="text-xs font-semibold text-white">
                  {isUploading ? 'Processing File...' : 'Upload Notes / Syllabus'}
                </span>
                <span className="text-[10px] text-gray-400">PDF, DOCX, TXT, MD (Max 10MB)</span>
              </button>

              {uploadStatus && (
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-purple-900/30 border border-purple-500/40 p-2.5 text-xs text-purple-200">
                  <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping" />
                  <span>{uploadStatus}</span>
                </div>
              )}

              {uploadError && (
                <div className="mt-2 rounded-xl bg-red-950/40 border border-red-500/40 p-2 text-xs text-red-300">
                  {uploadError}
                </div>
              )}
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto mt-4 space-y-2.5 pr-1">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold mb-1">
                <span>Indexed Documents ({documents.length}/{usage.documentsLimit})</span>
              </div>

              {documents.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-[#101626]/60 p-4 text-center">
                  <FileText className="mx-auto h-8 w-8 text-gray-600 mb-1" />
                  <p className="text-xs text-gray-400">No documents uploaded yet.</p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Upload course notes or syllabus files to test RAG retrieval!
                  </p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#101626] p-2.5 hover:border-purple-500/40 transition"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600/20 text-purple-300">
                        <FileCode className="h-4 w-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-white truncate">{doc.title}</p>
                        <p className="text-[10px] text-gray-400">
                          {doc.chunkCount} chunks • {Math.round(doc.fileSize / 1024)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteDocument(doc._id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 transition"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Citation Preview Modal */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-purple-500/40 bg-[#101626] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Source Document Citation</h3>
              </div>
              <button
                onClick={() => setActiveCitation(null)}
                className="rounded-lg p-1 text-gray-400 hover:text-white hover:bg-gray-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span>
                  <strong>Document:</strong> {activeCitation.filename}
                </span>
                <span>
                  <strong>Page:</strong> {activeCitation.pageNumber}
                </span>
                <span className="rounded bg-purple-900/60 px-2 py-0.5 text-xs text-purple-200">
                  Semantic Score: {Math.round(activeCitation.score * 100)}%
                </span>
              </div>

              <div className="rounded-xl border border-gray-800 bg-[#080B14] p-4 text-xs text-gray-200 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap font-mono">
                {activeCitation.text}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setActiveCitation(null)}
                className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 transition"
              >
                Close Citation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Quick Prompts Pills */}
      <div className="border-t border-gray-800/80 bg-[#101626]/60 px-4 py-2 overflow-x-auto scrollbar-none flex gap-2">
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="rounded-xl border border-purple-500/20 bg-[#080B14] px-3 py-1.5 text-[11px] text-gray-300 hover:border-purple-400 hover:text-white whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="border-t border-gray-800 bg-[#101626] p-3 md:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex flex-col sm:flex-row items-center gap-2 md:gap-3"
        >
          {/* RAG Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setEnableRag(!enableRag)}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-semibold transition ${
                enableRag
                  ? 'border-purple-500/50 bg-purple-950/40 text-purple-300'
                  : 'border-gray-800 bg-[#080B14] text-gray-500'
              }`}
              title="Toggle RAG retrieval from uploaded documents"
            >
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              <span>RAG: {enableRag ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask anything in ${language}... (e.g. "Explain HTML vs CSS with code", or "According to my syllabus...")`}
            className="w-full flex-1 rounded-2xl border border-gray-800 bg-[#080B14] px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 transition focus:border-purple-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-3 text-xs md:text-sm font-bold text-white shadow-glow-purple hover:opacity-95 disabled:opacity-40 transition"
          >
            <Send className="h-4 w-4" />
            <span className="sm:hidden">Send Question</span>
          </button>
        </form>
      </div>
    </div>
  );
};

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
  Database,
  X,
  FileCode,
  FileCheck,
  Flame,
  Settings,
  KeyRound,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ChevronRight,
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
  isError?: boolean;
  canRetry?: boolean;
  retryQuery?: string;
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

interface LlmSettings {
  provider: 'gemini' | 'openai' | 'custom';
  apiKey: string;
  model: string;
  baseUrl: string;
}

const STORAGE_SETTINGS_KEY = 'skillquest_llm_settings';

export const MentorPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello ${user?.name || 'Explorer'}! 👋 I am **SkillQuest AI**, your general-purpose conversational assistant.

You can talk to me about anything:
- 💬 **Casual conversation & Greetings:** "Hi", "How are you?", brainstorming, writing stories.
- 🌍 **General Knowledge & Science:** Quantum computing, history, astronomy, mathematics, geography.
- 💻 **Coding & Debugging:** Writing Python, JavaScript, HTML/CSS, algorithms, analyzing errors.
- 📑 **Course Knowledge Base (RAG):** Upload syllabus, notes, or PDFs, and I will retrieve and cite them.
- 🎯 **Multi-question requests:** Ask complex questions with multiple parts, and I'll answer each thoroughly.

What would you like to explore or discuss today?`,
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

  // LLM Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<{
    hasServerKey: boolean;
    provider: string;
    model: string;
  } | null>(null);

  const [llmSettings, setLlmSettings] = useState<LlmSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      provider: 'gemini',
      apiKey: '',
      model: 'gemini-1.5-flash',
      baseUrl: '',
    };
  });

  const [tempApiKey, setTempApiKey] = useState(llmSettings.apiKey);
  const [tempProvider, setTempProvider] = useState(llmSettings.provider);
  const [tempModel, setTempModel] = useState(llmSettings.model);
  const [tempBaseUrl, setTempBaseUrl] = useState(llmSettings.baseUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  useEffect(() => {
    fetchDocuments();
    fetchUsage();
    fetchServerStatus();
  }, []);

  const fetchServerStatus = async () => {
    try {
      const res = await api.get('/ai/status');
      if (res.data) {
        setServerStatus(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch server AI status:', err);
    }
  };

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

  const saveSettings = () => {
    const updated: LlmSettings = {
      provider: tempProvider,
      apiKey: tempApiKey.trim(),
      model: tempModel.trim() || (tempProvider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash'),
      baseUrl: tempBaseUrl.trim(),
    };
    setLlmSettings(updated);
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(updated));
    } catch {}
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    // Remove any previous trailing error retry banner
    const filteredHistory = messages.filter((m) => !m.isError);
    const newMessages: Message[] = [...filteredHistory, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        language,
        enableRag,
        apiKey: llmSettings.apiKey || undefined,
        provider: llmSettings.provider || undefined,
        model: llmSettings.model || undefined,
        baseUrl: llmSettings.baseUrl || undefined,
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
      const errResponse = err.response?.data;
      const errorMessage =
        errResponse?.error ||
        errResponse?.message ||
        err.message ||
        'Connection interrupted. Unable to reach the AI model endpoint.';

      const isKeyRequired = errResponse?.code === 'LLM_KEY_REQUIRED' || err.response?.status === 503;

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: errorMessage,
          isError: true,
          canRetry: true,
          retryQuery: query,
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
    'Hello! How are you doing today?',
    'Explain quantum computing in simple terms.',
    'Write a romantic short story set in Kyoto.',
    'Write a Python program to sort a list using quicksort.',
    'Explain HTML versus CSS, provide an example, and explain the output.',
    'What is the capital of Japan?',
    'Help me debug this code: for i in range(len(arr)): print(arr[i+1])',
  ];

  const hasConfiguredKey = Boolean(llmSettings.apiKey || serverStatus?.hasServerKey);

  return (
    <div className="relative flex h-[calc(100vh-7rem)] flex-col rounded-3xl border border-purple-500/20 bg-[#121B2D]/90 shadow-2xl backdrop-blur overflow-hidden animate-fade-in">
      {/* Top AI Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-800 bg-[#101626] px-4 md:px-6 py-3.5 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px] shadow-glow-cyan">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#080B14]">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">SkillQuest AI Assistant</h2>
              <span
                className={`flex h-2 w-2 rounded-full ${
                  hasConfiguredKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-[10px] text-gray-400 font-semibold hidden sm:inline">
                {hasConfiguredKey ? 'General-Purpose LLM Ready' : 'Key Setup Available'}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Open-Ended Conversational AI & Document Knowledge</p>
          </div>
        </div>

        {/* Quota Counter & Control Actions */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Daily Quota Indicator */}
          <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#080B14] px-3 py-1.5 text-[11px] text-gray-300">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>
              <strong className="text-white">{usage.requestsCount}</strong> / {usage.requestsLimit} Quota
            </span>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              hasConfiguredKey
                ? 'border-gray-800 bg-[#080B14] text-gray-300 hover:text-white'
                : 'border-amber-500/50 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 animate-pulse'
            }`}
            title="Configure LLM Provider & API Key"
          >
            <KeyRound className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI Settings</span>
          </button>

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
              <option value="Spanish">Español</option>
              <option value="French">Français</option>
            </select>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  content: 'New chat started. What would you like to discuss?',
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
        {/* Main Chat Feed */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                      msg.isError
                        ? 'bg-red-950/40 border-red-500/40 text-red-400'
                        : 'bg-purple-600/20 border-purple-500/30 text-cyan-400'
                    }`}
                  >
                    {msg.isError ? <AlertCircle className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                )}

                <div
                  className={`relative max-w-3xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple/20'
                      : msg.isError
                      ? 'border border-red-500/40 bg-red-950/20 text-red-200'
                      : 'border border-gray-800 bg-[#101626] text-gray-200 shadow-md'
                  }`}
                >
                  {!isUser && !msg.isError && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800/60">
                      <div className="flex items-center gap-2">
                        {msg.routingMode === 'rag' && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-purple-950/80 border border-purple-600/40 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                            <BookOpen className="h-3 w-3 text-purple-400" />
                            RAG Document Excerpts
                          </span>
                        )}
                        {msg.multiQuestionHandled && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-cyan-950/80 border border-cyan-600/40 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                            <Sparkles className="h-3 w-3 text-cyan-400" />
                            Multi-Question Breakdown
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

                  {/* Message Content */}
                  <div className="space-y-3 whitespace-pre-wrap font-sans">{msg.content}</div>

                  {/* Retry & Settings Controls on Error */}
                  {msg.isError && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-red-500/20">
                      {msg.canRetry && msg.retryQuery && (
                        <button
                          onClick={() => handleSend(msg.retryQuery)}
                          className="flex items-center gap-1.5 rounded-lg bg-red-600/30 border border-red-500/50 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-600/50 transition"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Retry Question</span>
                        </button>
                      )}
                      <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-1.5 rounded-lg bg-purple-600/30 border border-purple-500/50 px-3 py-1.5 text-xs font-semibold text-purple-200 hover:bg-purple-600/50 transition"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        <span>Configure API Key</span>
                      </button>
                    </div>
                  )}

                  {/* Source Citations Drawer */}
                  {!isUser && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-purple-500/20">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-400 mb-2">
                        <Database className="h-3.5 w-3.5" />
                        <span>Document References ({msg.sources.length}):</span>
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
                <span className="text-cyan-300 font-medium">Generating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Slide-out Knowledge Base Drawer */}
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
              Upload PDF, DOCX, TXT, or Markdown notes. The assistant will retrieve relevant sections when answering
              questions about them.
            </p>

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

            <div className="flex-1 overflow-y-auto mt-4 space-y-2.5 pr-1">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold mb-1">
                <span>
                  Indexed Documents ({documents.length}/{usage.documentsLimit})
                </span>
              </div>

              {documents.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-[#101626]/60 p-4 text-center">
                  <FileText className="mx-auto h-8 w-8 text-gray-600 mb-1" />
                  <p className="text-xs text-gray-400">No documents uploaded yet.</p>
                  <p className="text-[10px] text-gray-500 mt-1">General chat works independently without any documents.</p>
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

      {/* LLM Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-purple-500/40 bg-[#101626] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">General-Purpose LLM Settings</h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:text-white hover:bg-gray-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {serverStatus?.hasServerKey ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>
                    Server environment key active (<strong>{serverStatus.provider}</strong> / {serverStatus.model}). You
                    can override it below if desired.
                  </span>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300">
                  <p>
                    No server API key found in <code>backend/.env</code>. Enter your API key below to connect SkillQuest AI
                    to a live model.
                  </p>
                </div>
              )}

              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">AI Provider</label>
                <select
                  value={tempProvider}
                  onChange={(e) => {
                    const p = e.target.value as any;
                    setTempProvider(p);
                    if (p === 'gemini') setTempModel('gemini-1.5-flash');
                    if (p === 'openai') setTempModel('gpt-4o-mini');
                  }}
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="gemini">Google Gemini (Recommended, fast & free tier available)</option>
                  <option value="openai">OpenAI (ChatGPT models)</option>
                  <option value="custom">Custom Endpoint / Local Ollama (OpenAI compatible)</option>
                </select>
              </div>

              {/* API Key Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-300">
                    {tempProvider === 'gemini' ? 'Gemini API Key' : 'API Key'}
                  </label>
                  {tempProvider === 'gemini' && (
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                    >
                      Get Gemini Key <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder={
                    tempProvider === 'gemini'
                      ? 'AIzaSy...'
                      : tempProvider === 'openai'
                      ? 'sk-proj-...'
                      : 'Optional or provider key'
                  }
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Model Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Model Name</label>
                <input
                  type="text"
                  value={tempModel}
                  onChange={(e) => setTempModel(e.target.value)}
                  placeholder={tempProvider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash'}
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Custom Base URL */}
              {tempProvider === 'custom' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Base URL (e.g. http://localhost:11434/v1 for Ollama)
                  </label>
                  <input
                    type="text"
                    value={tempBaseUrl}
                    onChange={(e) => setTempBaseUrl(e.target.value)}
                    placeholder="http://localhost:11434/v1"
                    className="w-full rounded-xl border border-gray-800 bg-[#080B14] px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}

              {saveSuccess && (
                <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-2.5 text-xs text-emerald-300 text-center font-semibold">
                  ✓ Settings saved successfully!
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-xl border border-gray-800 px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2 text-xs font-bold text-white shadow-glow-purple hover:opacity-95 transition"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}

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
                  Match: {Math.round(activeCitation.score * 100)}%
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
            placeholder={`Ask SkillQuest AI anything in ${language}... (e.g. "What is quantum computing?", "Write a Python script", "Explain HTML vs CSS")`}
            className="w-full flex-1 rounded-2xl border border-gray-800 bg-[#080B14] px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 transition focus:border-purple-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-3 text-xs md:text-sm font-bold text-white shadow-glow-purple hover:opacity-95 disabled:opacity-40 transition"
          >
            <Send className="h-4 w-4" />
            <span className="sm:hidden">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

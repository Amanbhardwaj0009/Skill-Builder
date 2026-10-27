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
  Code2,
  BookOpen,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const MentorPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Greetings Explorer ${user?.name || ''}! 🛡️ I am your **SkillQuest AI Mentor**.

I'm ready to guide your journey:
- Demystify complex algorithms and system architectures.
- Provide graduated step-by-step hints when you are stuck.
- Break down concepts in **English** or **Hindi (हिंदी)**.
- Analyze your code errors and suggest precise fixes.

What challenge shall we conquer together today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState(user?.preferredLanguage || 'English');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        messages: newMessages,
        language,
        topicContext: user?.interests?.[0] || 'Computer Science',
      });

      setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '⚠️ I encountered an interruption in our neural connection. Please verify your connection or try again shortly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const suggestedPrompts = [
    'Explain recursion using a simple real-world analogy.',
    'Help me debug an array index error in JavaScript.',
    'Explain how Hash Maps achieve O(1) lookup in Hindi.',
    'Create a beginner-friendly coding challenge for me.',
    'Give me a graduated hint without spoiling the full solution.',
  ];

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col rounded-3xl border border-purple-500/20 bg-[#121B2D]/90 shadow-2xl backdrop-blur overflow-hidden animate-fade-in">
      {/* Top Mentor Control Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-800 bg-[#101626] px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px] shadow-glow-cyan">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#080B14]">
              <Bot className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">AI Learning Mentor</h2>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-semibold">Online & Synchronized</span>
            </div>
            <p className="text-[11px] text-gray-400">Contextual Coding Tutor & Algorithmic Guide</p>
          </div>
        </div>

        {/* Language & Reset Controls */}
        <div className="flex items-center gap-3">
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

          <button
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  content: 'Neural buffer cleared. What new topic shall we explore together?',
                },
              ])
            }
            className="flex items-center gap-1 rounded-xl border border-gray-800 bg-[#080B14] px-3 py-1.5 text-xs text-gray-400 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Feed */}
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
                className={`relative max-w-2xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple/20'
                    : 'border border-gray-800 bg-[#101626] text-gray-200'
                }`}
              >
                {!isUser && (
                  <button
                    onClick={() => copyToClipboard(msg.content, index)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-white"
                    title="Copy message"
                  >
                    {copiedIndex === index ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                )}

                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.content}
                </div>
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
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-cyan-400 border border-purple-500/30">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-gray-800 bg-[#101626] px-4 py-3 text-xs text-gray-400">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Synthesizing guidance and analogies...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

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
      <div className="border-t border-gray-800 bg-[#101626] p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask your AI mentor in ${language}... (e.g., "Give me a hint on binary search")`}
            className="flex-1 rounded-2xl border border-gray-800 bg-[#080B14] px-4 py-3 text-xs text-white placeholder-gray-500 transition focus:border-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-glow-purple hover:opacity-95 disabled:opacity-40 transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

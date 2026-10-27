import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Bot,
  X,
  Send,
  RotateCcw,
  Sparkles,
  Play,
  ArrowRight,
  Compass,
  CheckCircle2,
  Briefcase,
  Layers,
} from 'lucide-react';

interface CareerCoachPanelProps {
  careerName: string;
  onClose: () => void;
  onSelectCareer: (career: string) => void;
}

export const CareerCoachPanel: React.FC<CareerCoachPanelProps> = ({
  careerName = 'Manufacturing Engineer',
  onClose,
  onSelectCareer,
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hello! I am your **SkillQuest Career Coach**. Welcome to your **${careerName}** path! How can I guide your skill progression today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const careerIntroductions: Record<string, { intro: string; mediaTitle: string; mediaDesc: string }> = {
    'Manufacturing Engineer': {
      intro: 'Welcome to your manufacturing engineering journey! You will design automated cell lines, calibrate robotic arms, and optimize lean production pipelines for zero downtime.',
      mediaTitle: 'Automated Cell Operations',
      mediaDesc: 'Interactive simulator inspecting PLC logic, cycle bottlenecks, and conveyor synchronization in high-tech plants.',
    },
    'Industrial Engineer': {
      intro: 'Welcome to industrial systems optimization! Analyze human-machine ergonomic interfaces, inventory buffers, and queueing models.',
      mediaTitle: 'Throughput Optimization Simulation',
      mediaDesc: 'Model factory logistics, inventory flow rates, and factory layout diagrams for maximum efficiency.',
    },
    'Process Engineer': {
      intro: 'Welcome to chemical & material process engineering! Monitor pressure, temperature, and reaction tolerances.',
      mediaTitle: 'Process Control Loops',
      mediaDesc: 'Simulate continuous batch feedback loops and industrial quality telemetry.',
    },
    'Quality Control Engineer': {
      intro: 'Welcome to Quality Assurance & Six Sigma! Master statistical process control, defect tolerance, and computer vision validation.',
      mediaTitle: 'Automated Optical Inspection',
      mediaDesc: 'Train machine learning models to detect micro-defects in high-speed manufacturing lines.',
    },
    'Operations Manager': {
      intro: 'Welcome to Operations Leadership! Coordinate cross-functional engineering squads, supply logistics, and safety protocols.',
      mediaTitle: 'Plant Command Telemetry',
      mediaDesc: 'Direct plant-wide resource dispatch and emergency contingency protocols in real time.',
    },
  };

  const currentInfo = careerIntroductions[careerName] || careerIntroductions['Manufacturing Engineer'];

  const similarCareers = [
    'Manufacturing Engineer',
    'Industrial Engineer',
    'Process Engineer',
    'Quality Control Engineer',
    'Operations Manager',
  ];

  const suggestedQuests = [
    {
      title: 'Python Problem Solver',
      reason: 'Automates sensor log parsing & telemetry analysis.',
      slug: 'python-problem-solver',
      xp: 80,
    },
    {
      title: 'DSA Dungeon: Algorithms',
      reason: 'Essential for optimal conveyor queueing & scheduling.',
      slug: 'dsa-dungeon',
      xp: 120,
    },
    {
      title: 'AI Explorer',
      reason: 'Powers computer vision quality inspection in smart plants.',
      slug: 'ai-explorer',
      xp: 110,
    },
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatLoading) return;

    const userText = input.trim();
    const updated = [...messages, { role: 'user' as const, text: userText }];
    setMessages(updated);
    setInput('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        messages: updated.map((m) => ({ role: m.role, content: m.text })),
        topicContext: `${careerName} Career Guidance & Manufacturing Skills`,
      });
      setMessages([...updated, { role: 'assistant', text: res.data.reply }]);
    } catch {
      // Smart local fallback
      let fallback = `For a **${careerName}**, focus on mastering both algorithmic logic and automated systems. Would you like me to recommend a foundational quest or debug code with you?`;
      if (userText.toLowerCase().includes('salary') || userText.toLowerCase().includes('career')) {
        fallback = `**${careerName}s** are in high demand across automotive, aerospace, and semiconductor manufacturing facilities worldwide!`;
      }
      setMessages([...updated, { role: 'assistant', text: fallback }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="w-full h-full max-h-[82vh] overflow-y-auto rounded-3xl border border-purple-500/30 bg-[#101626]/85 p-5 md:p-6 shadow-2xl backdrop-blur-xl text-white scrollbar-thin scrollbar-thumb-purple-900/50">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Career Coach</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-[10px] text-gray-400">Personalized Industry Mentor</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-xl p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition"
          title="Close Coach Panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Career Introduction */}
      <div className="mb-4 rounded-2xl border border-purple-500/20 bg-[#080B14]/80 p-3.5 text-xs text-gray-300 leading-relaxed">
        <p className="font-semibold text-purple-300 mb-1">Career Briefing:</p>
        <p>{currentInfo.intro}</p>
      </div>

      {/* Career Media Card */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#080B14] shadow-glow-cyan/5">
        <div className="relative h-28 w-full bg-gradient-to-tr from-purple-900 via-indigo-950 to-slate-900 flex items-center justify-center overflow-hidden">
          {/* Cyber SVG graphic inside card */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-glow-cyan">
              <Play className="h-5 w-5 fill-cyan-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
              Virtual Lab Simulation
            </span>
          </div>
        </div>
        <div className="p-3 text-xs">
          <p className="font-bold text-white text-xs">{currentInfo.mediaTitle}</p>
          <p className="text-[11px] text-gray-400 mt-1 leading-snug">{currentInfo.mediaDesc}</p>
          <button
            onClick={() => alert(`Launching virtual ${currentInfo.mediaTitle} interactive sandbox...`)}
            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-600/40 transition"
          >
            <span>Launch Virtual Lab</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Similar Careers */}
      <div className="mb-5">
        <span className="block text-[11px] font-black uppercase tracking-wider text-purple-400 mb-2">
          Similar Pathways & Roles
        </span>
        <div className="space-y-1">
          {similarCareers.map((item) => {
            const isCurrent = careerName === item;
            return (
              <button
                key={item}
                onClick={() => onSelectCareer(item)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                  isCurrent
                    ? 'border border-cyan-400/80 bg-cyan-500/20 text-cyan-200 font-bold'
                    : 'border border-gray-800 bg-[#080B14]/60 text-gray-300 hover:bg-[#080B14] hover:text-white'
                }`}
              >
                <span>{item}</span>
                {isCurrent ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                ) : (
                  <span className="text-[10px] text-gray-500">Switch →</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Learning Missions */}
      <div className="mb-5">
        <span className="block text-[11px] font-black uppercase tracking-wider text-purple-400 mb-2">
          Recommended Missions
        </span>
        <div className="space-y-2">
          {suggestedQuests.map((q) => (
            <Link
              key={q.slug}
              to={`/quests/${q.slug}`}
              className="block rounded-xl border border-gray-800 bg-[#080B14]/60 p-2.5 text-xs transition hover:border-purple-500/50 hover:bg-[#080B14]"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{q.title}</span>
                <span className="font-extrabold text-amber-400 text-[10px]">+{q.xp} XP</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{q.reason}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Interactive Coach Chat Interface */}
      <div className="border-t border-gray-800 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Bot className="h-3.5 w-3.5 text-cyan-400" /> Coach Uplink
          </span>
          <button
            onClick={() =>
              setMessages([
                {
                  role: 'assistant',
                  text: `Buffer refreshed. What questions do you have about the **${careerName}** trajectory?`,
                },
              ])
            }
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white"
          >
            <RotateCcw className="h-3 w-3" /> Clear Chat
          </button>
        </div>

        {/* Message Feed */}
        <div className="max-h-36 overflow-y-auto space-y-2 rounded-2xl border border-gray-800 bg-[#080B14] p-3 text-xs mb-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-xl p-2 text-[11px] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30 ml-4'
                  : 'bg-[#121B2D] text-gray-300 mr-2'
              }`}
            >
              <span className="font-bold block text-[10px] text-cyan-400 mb-0.5">
                {m.role === 'user' ? 'You:' : 'Coach:'}
              </span>
              <div>{m.text}</div>
            </div>
          ))}
          {chatLoading && (
            <div className="text-[10px] text-cyan-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing career roadmap...</span>
            </div>
          )}
        </div>

        {/* Input form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${careerName}...`}
            className="flex-1 rounded-xl border border-gray-800 bg-[#080B14] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || chatLoading}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-glow-purple disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

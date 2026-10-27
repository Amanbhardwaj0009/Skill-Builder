import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  Terminal,
  Eye,
  Award,
  ChevronDown,
  Globe,
  Building2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { LevelUpModal } from '../../components/LevelUpModal';

export const CodingArenaPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [code, setCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tests' | 'preview'>('tests');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);

  // Level up modal
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [unlockedAchs, setUnlockedAchs] = useState<any[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await api.get('/challenges');
        setChallenges(res.data.challenges || []);
        if (res.data.challenges?.length > 0) {
          loadChallenge(res.data.challenges[0].id);
        }
      } catch (err) {
        console.error('Failed to load challenges:', err);
      }
    };
    fetchChallenges();
  }, []);

  const loadChallenge = async (id: string) => {
    try {
      const res = await api.get(`/challenges/${id}`);
      setSelectedChallenge(res.data);
      setCode(res.data.starterCode);
      setRunResult(null);
      if (res.data.supportedLanguage === 'html') {
        setActiveTab('preview');
      } else {
        setActiveTab('tests');
      }
    } catch (err) {
      console.error('Failed to load challenge details:', err);
    }
  };

  const handleRunCode = async () => {
    if (!selectedChallenge) return;
    setRunning(true);
    try {
      const res = await api.post(`/challenges/${selectedChallenge.id}/run`, {
        code,
        language: selectedChallenge.supportedLanguage,
      });
      setRunResult(res.data.summary);
      setActiveTab('tests');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Execution failed');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!selectedChallenge) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/challenges/${selectedChallenge.id}/submit`, {
        code,
        language: selectedChallenge.supportedLanguage,
      });
      setRunResult(res.data.results);
      if (res.data.leveledUp) {
        setNewLevel(res.data.currentLevel);
        setUnlockedAchs(res.data.unlockedAchievements || []);
        setLevelUpOpen(true);
      }
      if (res.data.status === 'accepted') {
        await refreshUser();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-glow-purple">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">Coding Arena</h1>
            <p className="text-[11px] text-gray-400">Battle-tested Algorithmic & Web Challenges</p>
          </div>
        </div>

        {/* Challenge Dropdown Selector */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedChallenge?.id || ''}
              onChange={(e) => loadChallenge(e.target.value)}
              className="appearance-none rounded-xl border border-purple-500/30 bg-[#121B2D] px-4 py-2 pr-9 text-xs font-semibold text-white focus:outline-none"
            >
              {challenges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.difficulty.toUpperCase()} • +{c.xpReward} XP)
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400">
            <Zap className="h-4 w-4 fill-amber-400" /> +{selectedChallenge?.xpReward || 25} XP
          </div>
        </div>
      </div>

      {/* Prominent Entry Card: Build Your Own World */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0C1222] via-[#121B2D] to-[#10182E] p-4 sm:p-5 shadow-xl transition hover:border-cyan-400/50">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-purple-600/10 blur-[80px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            {/* World Thumbnail / Vector Mini Isometric Preview */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-glow-purple">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0A0E1A]">
                <Globe className="h-7 w-7 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded bg-gradient-to-r from-purple-500 to-cyan-400 px-2 py-0.5 text-[9px] font-black uppercase text-black">
                  New Interactive World Game
                </span>
                <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Live City Sandbox
                </span>
              </div>
              <h2 className="text-base font-bold text-white">Build Your Own World</h2>
              <p className="text-xs text-gray-400 max-w-xl">
                Learn new skills, complete missions, and build a city that grows with you.
              </p>
            </div>
          </div>

          {/* Stats & Continue Building Action */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-gray-800 bg-[#080B14]/80 px-3 py-1.5 text-center">
                <span className="block text-[9px] text-gray-400 uppercase font-semibold">World Level</span>
                <span className="text-xs font-bold text-purple-300">Level 1</span>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#080B14]/80 px-3 py-1.5 text-center">
                <span className="block text-[9px] text-gray-400 uppercase font-semibold">Structures</span>
                <span className="text-xs font-bold text-cyan-300">1 Unlocked</span>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#080B14]/80 px-3 py-1.5 text-center">
                <span className="block text-[9px] text-gray-400 uppercase font-semibold">Missions</span>
                <span className="text-xs font-bold text-emerald-300">7 Available</span>
              </div>
            </div>

            <Link
              to="/build-world"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-purple hover:brightness-110 transition shrink-0"
            >
              <span>Continue Building</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-14rem)]">
        {/* Left Column: Problem Spec & Test Explorer (Col 5) */}
        <div className="lg:col-span-5 flex flex-col rounded-3xl border border-gray-800 bg-[#121B2D]/90 p-5 shadow-xl backdrop-blur overflow-y-auto space-y-4">
          {selectedChallenge ? (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-300">
                    {selectedChallenge.category}
                  </span>
                  <span className="rounded-lg bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-cyan-300">
                    {selectedChallenge.difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{selectedChallenge.title}</h2>
                <p className="mt-2 text-xs text-gray-300 leading-relaxed">
                  {selectedChallenge.description}
                </p>
              </div>

              {/* Sample Test Cases */}
              <div className="space-y-2 border-t border-gray-800 pt-3">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Sample Test Bench</p>
                {selectedChallenge.sampleTestCases?.map((tc: any, i: number) => (
                  <div key={i} className="rounded-xl border border-gray-800 bg-[#080B14] p-3 text-xs font-mono">
                    <div className="flex justify-between text-gray-400 text-[11px] mb-1">
                      <span>Input:</span>
                      <span className="text-cyan-400">{tc.input}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-[11px]">
                      <span>Expected Output:</span>
                      <span className="text-emerald-400 font-bold">{tc.expectedOutput}</span>
                    </div>
                    {tc.explanation && (
                      <p className="mt-1.5 text-[10px] text-gray-500 font-sans">{tc.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Execution Status / Console Output */}
              {runResult && (
                <div className="border-t border-gray-800 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-cyan-400" /> Execution Results
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {runResult.totalPassed} / {runResult.totalTests} passed ({runResult.executionTimeMs}ms)
                    </span>
                  </div>

                  <div className="space-y-2">
                    {runResult.results?.map((res: any, idx: number) => (
                      <div
                        key={idx}
                        className={`rounded-xl border p-2.5 text-xs font-mono ${
                          res.passed
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                            : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">Test #{idx + 1}</span>
                          <span>{res.passed ? 'PASSED ✅' : 'FAILED ❌'}</span>
                        </div>
                        {!res.isHidden && (
                          <div className="mt-1 text-[11px] text-gray-400 space-y-0.5">
                            <div>Input: {res.input}</div>
                            <div>Expected: {res.expected}</div>
                            <div>Actual: {res.actual}</div>
                          </div>
                        )}
                        {res.error && <div className="mt-1 text-rose-400">{res.error}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500 text-xs">
              Loading Challenge...
            </div>
          )}
        </div>

        {/* Right Column: Monaco Editor & Output Runner (Col 7) */}
        <div className="lg:col-span-7 flex flex-col rounded-3xl border border-gray-800 bg-[#080B14] overflow-hidden shadow-2xl">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between border-b border-gray-800 bg-[#101626] px-4 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-purple-400 font-bold">solution.{selectedChallenge?.supportedLanguage === 'javascript' ? 'js' : selectedChallenge?.supportedLanguage === 'python' ? 'py' : 'html'}</span>
              {selectedChallenge?.supportedLanguage === 'html' && (
                <div className="flex rounded-lg bg-gray-900 p-0.5 text-[10px]">
                  <button
                    onClick={() => setActiveTab('tests')}
                    className={`rounded px-2 py-0.5 ${activeTab === 'tests' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400'}`}
                  >
                    Code & Tests
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`rounded px-2 py-0.5 flex items-center gap-1 ${activeTab === 'preview' ? 'bg-cyan-600 text-white font-bold' : 'text-gray-400'}`}
                  >
                    <Eye className="h-3 w-3" /> Live Render
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => selectedChallenge && setCode(selectedChallenge.starterCode)}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white"
            >
              <RotateCcw className="h-3 w-3" /> Reset Code
            </button>
          </div>

          {/* Editor Area / Live HTML Preview */}
          <div className="flex-1 relative">
            {activeTab === 'preview' && selectedChallenge?.supportedLanguage === 'html' ? (
              <div className="h-full w-full bg-white p-6 overflow-auto text-black">
                <div dangerouslySetInnerHTML={{ __html: code }} />
              </div>
            ) : (
              <Editor
                height="100%"
                theme="vs-dark"
                language={selectedChallenge?.supportedLanguage || 'javascript'}
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />
            )}
          </div>

          {/* Bottom Execution Action Bar */}
          <div className="flex items-center justify-between border-t border-gray-800 bg-[#101626] px-4 py-3">
            <span className="text-[11px] text-gray-400">
              Evaluated with time limit of 2.5s in sandboxed VM
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRunCode}
                disabled={running || submitting}
                className="flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-xs font-bold text-gray-200 hover:bg-gray-700 transition disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" />
                <span>{running ? 'Running...' : 'Run Sample Tests'}</span>
              </button>

              <button
                onClick={handleSubmitSolution}
                disabled={running || submitting}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-5 py-2 text-xs font-bold text-white shadow-glow-purple hover:opacity-95 transition disabled:opacity-50"
              >
                <Award className="h-3.5 w-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Final Solution'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <LevelUpModal
        isOpen={levelUpOpen}
        onClose={() => setLevelUpOpen(false)}
        level={newLevel}
        unlockedAchievements={unlockedAchs}
      />
    </div>
  );
};

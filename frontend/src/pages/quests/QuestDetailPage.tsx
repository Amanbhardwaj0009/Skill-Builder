import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Bot,
  Code2,
  Lightbulb,
  Play,
  RotateCcw,
  Zap,
  HelpCircle,
  FileCode,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { LevelUpModal } from '../../components/LevelUpModal';

export const QuestDetailPage: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const { refreshUser } = useAuth();

  const [quest, setQuest] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [activeStageNum, setActiveStageNum] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Challenge code editor state
  const [code, setCode] = useState<string>('');
  const [challengeRunning, setChallengeRunning] = useState(false);
  const [challengeResult, setChallengeResult] = useState<any>(null);

  // AI Mentor panel state
  const [hintLevel, setHintLevel] = useState<number>(1);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);

  // Level Up Modal
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [unlockedAchs, setUnlockedAchs] = useState<any[]>([]);
  const [questCompleteMessage, setQuestCompleteMessage] = useState<string | null>(null);

  const fetchQuest = async () => {
    try {
      const res = await api.get(`/quests/${questId}`);
      setQuest(res.data.quest);
      setProgress(res.data.progress);

      const curStage = res.data.progress?.currentStage || 1;
      setActiveStageNum(curStage);

      // Initialize challenge code if current stage has challenge
      const stage = res.data.quest.stages.find((s: any) => s.stageNumber === curStage);
      if (stage?.challenge?.starterCode) {
        setCode(stage.challenge.starterCode);
      }
    } catch (err) {
      console.error('Failed to load quest:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuest();
  }, [questId]);

  const activeStage = quest?.stages?.find((s: any) => s.stageNumber === activeStageNum);

  // When changing stages, reset stage-specific states
  const switchStage = (stageNum: number) => {
    setActiveStageNum(stageNum);
    setSelectedOption(null);
    setQuizResult(null);
    setChallengeResult(null);
    setCurrentHint(null);
    setHintLevel(1);

    const stage = quest?.stages?.find((s: any) => s.stageNumber === stageNum);
    if (stage?.challenge?.starterCode) {
      setCode(stage.challenge.starterCode);
    }
  };

  // Submit quiz answer
  const handleQuizSubmit = async () => {
    if (selectedOption === null) return;
    setSubmittingQuiz(true);
    try {
      const res = await api.post(`/quests/${questId}/quiz`, {
        stageNumber: activeStageNum,
        selectedOption,
      });
      setQuizResult(res.data);
      if (res.data.isCorrect) {
        await refreshUser();
        setProgress((prev: any) => ({
          ...prev,
          completedStages: [...(prev?.completedStages || []), activeStageNum],
          currentStage: res.data.currentStage,
        }));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Run challenge code
  const handleChallengeSubmit = async () => {
    setChallengeRunning(true);
    try {
      const res = await api.post(`/quests/${questId}/challenge`, {
        stageNumber: activeStageNum,
        code,
        language: activeStage.challenge.language,
      });
      setChallengeResult(res.data.executionResult);
      if (res.data.success) {
        await refreshUser();
        setProgress((prev: any) => ({
          ...prev,
          completedStages: [...(prev?.completedStages || []), activeStageNum],
          currentStage: res.data.currentStage,
        }));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Challenge verification failed');
    } finally {
      setChallengeRunning(false);
    }
  };

  // Advance concept / example stage
  const handleAdvanceStage = async () => {
    try {
      const res = await api.post(`/quests/${questId}/advance`, {
        stageNumber: activeStageNum,
      });
      setProgress((prev: any) => ({
        ...prev,
        completedStages: [...(prev?.completedStages || []), activeStageNum],
        currentStage: res.data.currentStage,
      }));
      if (activeStageNum < quest.stages.length) {
        switchStage(activeStageNum + 1);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Complete entire quest
  const handleCompleteQuest = async () => {
    try {
      const res = await api.post(`/quests/${questId}/complete`);
      setQuestCompleteMessage(res.data.message);
      if (res.data.leveledUp) {
        setNewLevel(res.data.currentLevel);
        setUnlockedAchs(res.data.unlockedAchievements || []);
        setLevelUpOpen(true);
      }
      await refreshUser();
      setProgress((prev: any) => ({ ...prev, isCompleted: true }));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to complete quest');
    }
  };

  // Request hint from AI Mentor
  const handleRequestHint = async () => {
    setHintLoading(true);
    try {
      const res = await api.post('/ai/hint', {
        prompt: activeStage?.title || quest.title,
        code,
        hintLevel,
      });
      setCurrentHint(res.data.hint);
      setHintLevel((prev) => Math.min(prev + 1, 3));
    } catch (err) {
      console.error('Failed to get hint:', err);
    } finally {
      setHintLoading(false);
    }
  };

  if (loading || !quest) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const isStageCompleted = progress?.completedStages?.includes(activeStageNum);
  const allStagesCompleted = quest.stages.every((s: any) => progress?.completedStages?.includes(s.stageNumber));

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Quest Meta Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1">
            <Link to="/quests" className="hover:underline">Quests</Link>
            <span>/</span>
            <span>{quest.category}</span>
            <span>•</span>
            <span className="capitalize">{quest.difficulty}</span>
          </div>
          <h1 className="font-display text-xl md:text-2xl font-extrabold text-white flex items-center gap-3">
            {quest.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-black text-amber-400">
            <Zap className="h-4 w-4 fill-amber-400" /> +{quest.xpReward} XP Bounty
          </div>
          {progress?.isCompleted ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Quest Conquered
            </span>
          ) : allStagesCompleted ? (
            <button
              onClick={handleCompleteQuest}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-1.5 text-xs font-bold text-black shadow-glow-emerald hover:opacity-95"
            >
              <Award className="h-4 w-4" /> Claim Victory XP!
            </button>
          ) : null}
        </div>
      </div>

      {questCompleteMessage && (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-center text-sm font-bold text-emerald-300 shadow-glow-emerald">
          🎉 {questCompleteMessage}
        </div>
      )}

      {/* 3-Column Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mission Stages Navigation (Col 3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/90 p-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Mission Directives
            </h2>
            <div className="space-y-2">
              {quest.stages.map((stage: any) => {
                const isDone = progress?.completedStages?.includes(stage.stageNumber);
                const isActive = stage.stageNumber === activeStageNum;

                return (
                  <button
                    key={stage.stageNumber}
                    onClick={() => switchStage(stage.stageNumber)}
                    className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left text-xs transition ${
                      isActive
                        ? 'border border-purple-500 bg-purple-500/20 text-white font-bold shadow-glow-purple/20'
                        : isDone
                        ? 'text-gray-300 hover:bg-[#101626]'
                        : 'text-gray-500 hover:bg-[#101626]'
                    }`}
                  >
                    <div className="shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {stage.stageNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="truncate">{stage.title}</p>
                      <span className="text-[10px] capitalize text-gray-400">{stage.type}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Learning Objectives Card */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/70 p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Target Objectives
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-300">
              {quest.learningObjectives?.map((obj: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Column: Stage Content / Interactive Quiz / Code Challenge (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/90 p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                  Stage {activeStage.stageNumber}: {activeStage.type}
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">{activeStage.title}</h2>
              </div>
              {isStageCompleted && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Stage Cleared
                </span>
              )}
            </div>

            {/* Markdown / Stage Content */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-gray-300 leading-relaxed space-y-3">
              {activeStage.content.split('\n\n').map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Code Example if present */}
            {activeStage.codeExample && (
              <div className="mt-4 rounded-2xl border border-gray-800 bg-[#080B14] p-4 font-mono text-xs text-gray-200 overflow-x-auto">
                <div className="flex items-center justify-between text-gray-500 text-[10px] mb-2 border-b border-gray-800 pb-1">
                  <span>CODE SPECIMEN</span>
                  <span>Read Only</span>
                </div>
                <pre>{activeStage.codeExample}</pre>
              </div>
            )}

            {/* Knowledge Check Quiz Engine */}
            {activeStage.type === 'quiz' && activeStage.quiz && (
              <div className="mt-6 rounded-2xl border border-purple-500/30 bg-[#101626] p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-3">
                  <HelpCircle className="h-4 w-4 text-cyan-400" />
                  <span>Knowledge Checkpoint</span>
                </div>
                <p className="text-sm font-semibold text-white mb-4">{activeStage.quiz.question}</p>

                <div className="space-y-2.5">
                  {activeStage.quiz.options.map((opt: string, idx: number) => {
                    const isSelected = selectedOption === idx;
                    const showCorrect = quizResult && quizResult.isCorrect && isSelected;
                    const showWrong = quizResult && !quizResult.isCorrect && isSelected;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedOption(idx)}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs transition ${
                          showCorrect
                            ? 'border-emerald-500 bg-emerald-500/20 text-white font-bold'
                            : showWrong
                            ? 'border-rose-500 bg-rose-500/20 text-white'
                            : isSelected
                            ? 'border-purple-500 bg-purple-500/20 text-white font-semibold'
                            : 'border-gray-800 bg-[#121B2D] text-gray-300 hover:border-gray-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {showCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                        {showWrong && <AlertTriangle className="h-4 w-4 text-rose-400" />}
                      </button>
                    );
                  })}
                </div>

                {quizResult && (
                  <div
                    className={`mt-4 rounded-xl border p-3 text-xs ${
                      quizResult.isCorrect
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                    }`}
                  >
                    <p className="font-bold">{quizResult.isCorrect ? '✅ Correct Answer!' : '❌ Not quite right'}</p>
                    <p className="mt-1">{quizResult.explanation}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedOption === null || submittingQuiz}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-glow-purple disabled:opacity-50"
                  >
                    <span>{submittingQuiz ? 'Evaluating...' : 'Confirm Answer'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Coding Challenge / Monaco Arena */}
            {activeStage.type === 'challenge' && activeStage.challenge && (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-cyan-500/30 bg-[#101626] p-4">
                  <p className="text-xs font-bold text-cyan-300 mb-1">Challenge Prompt:</p>
                  <p className="text-xs text-gray-200">{activeStage.challenge.prompt}</p>
                </div>

                {/* Monaco Editor */}
                <div className="rounded-2xl border border-gray-800 overflow-hidden bg-[#080B14]">
                  <div className="flex items-center justify-between border-b border-gray-800 bg-[#101626] px-4 py-2 text-xs">
                    <span className="font-mono text-purple-400">solution.{activeStage.challenge.language === 'javascript' ? 'js' : activeStage.challenge.language === 'python' ? 'py' : 'html'}</span>
                    <button
                      onClick={() => setCode(activeStage.challenge.starterCode)}
                      className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset
                    </button>
                  </div>
                  <Editor
                    height="260px"
                    theme="vs-dark"
                    language={activeStage.challenge.language}
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 12,
                      scrollBeyondLastLine: false,
                      tabSize: 2,
                    }}
                  />
                </div>

                {/* Live HTML Preview if language is html */}
                {activeStage.challenge.language === 'html' && (
                  <div className="rounded-2xl border border-gray-800 bg-white p-4 text-black">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Live DOM Render</p>
                    <div dangerouslySetInnerHTML={{ __html: code }} />
                  </div>
                )}

                {/* Run / Verify Controls */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-gray-400">
                    Runs against test suites in isolated sandbox
                  </span>
                  <button
                    onClick={handleChallengeSubmit}
                    disabled={challengeRunning || !code.trim()}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-2.5 text-xs font-bold text-black shadow-glow-cyan hover:opacity-95 disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5 fill-black" />
                    <span>{challengeRunning ? 'Verifying Test Suite...' : 'Submit Code for Verification'}</span>
                  </button>
                </div>

                {/* Test Suite Verification Output */}
                {challengeResult && (
                  <div
                    className={`rounded-2xl border p-4 text-xs font-mono ${
                      challengeResult.allPassed
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">
                        {challengeResult.allPassed ? '🚀 All Tests Passed!' : '⚠️ Test Assertions Failed'}
                      </span>
                      <span>
                        {challengeResult.totalPassed} / {challengeResult.totalTests} Passed ({challengeResult.executionTimeMs}ms)
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-2">
                      {challengeResult.results.map((res: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between rounded bg-[#080B14]/80 p-1.5 text-[11px]">
                          <span>Test #{idx + 1}: {res.input}</span>
                          <span className={res.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {res.passed ? 'PASSED' : res.error || 'FAILED'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Advance Button for Concept / Example Stages */}
            {(activeStage.type === 'concept' || activeStage.type === 'example') && (
              <div className="mt-8 flex justify-end border-t border-gray-800/80 pt-4">
                <button
                  onClick={handleAdvanceStage}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-glow-purple hover:opacity-95"
                >
                  <span>Mark Stage Complete & Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Mentor Hints & Mission Intelligence (Col 3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-cyan-500/30 bg-[#121B2D]/90 p-5 shadow-glow-cyan/5">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2">
              <Bot className="h-4 w-4" />
              <span>AI Mentor Uplink</span>
            </div>
            <p className="text-xs text-gray-400">
              Stuck on this stage? Your AI mentor provides graduated hints without spoiling the solution.
            </p>

            <button
              onClick={handleRequestHint}
              disabled={hintLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition disabled:opacity-50"
            >
              <Lightbulb className="h-4 w-4" />
              <span>{hintLoading ? 'Decoding Hint...' : `Request Hint (Level ${hintLevel})`}</span>
            </button>

            {currentHint && (
              <div className="mt-4 rounded-xl border border-cyan-500/20 bg-[#080B14] p-3 text-xs text-gray-300 leading-relaxed font-sans">
                <p className="font-semibold text-cyan-400 mb-1">Mentor Transmission:</p>
                <div dangerouslySetInnerHTML={{ __html: currentHint.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            )}

            <div className="mt-6 border-t border-gray-800 pt-3 text-[11px] text-gray-500">
              <Link to="/mentor" className="text-purple-400 hover:underline flex items-center gap-1 font-bold">
                Open Full AI Mentor Chat →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Level Up Modal */}
      <LevelUpModal
        isOpen={levelUpOpen}
        onClose={() => setLevelUpOpen(false)}
        level={newLevel}
        unlockedAchievements={unlockedAchs}
      />
    </div>
  );
};

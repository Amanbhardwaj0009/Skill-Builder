import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  Trophy,
  Flame,
  Zap,
  Target,
  Compass,
  Code2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { LevelUpModal } from '../../components/LevelUpModal';

export const DashboardPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  // Level Up Modal State
  const [levelUpModalOpen, setLevelUpModalOpen] = useState(false);
  const [newLevel, setNewLevel] = useState(user?.currentLevel || 1);
  const [unlockedAchs, setUnlockedAchs] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, analyticsRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/dashboard/analytics'),
      ]);
      setData(overviewRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleClaimDaily = async (challengeId: string) => {
    setClaiming(challengeId);
    try {
      const res = await api.post('/dashboard/claim-daily', { challengeId });
      if (res.data.leveledUp) {
        setNewLevel(res.data.currentLevel);
        setUnlockedAchs(res.data.unlockedAchievements || []);
        setLevelUpModalOpen(true);
      }
      await refreshUser();
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to claim daily reward');
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-glow-purple" />
          <p className="text-xs font-semibold tracking-wider text-purple-300 uppercase">Loading Mission Command...</p>
        </div>
      </div>
    );
  }

  const player = data?.player || {};
  const stats = player.stats || {};
  const inProgressQuests = data?.inProgressQuests || [];
  const dailyChallenges = data?.dailyChallenges || [];
  const recommendedQuests = data?.recommendedQuests || [];
  const recentAchievements = data?.recentAchievements || [];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Welcome Banner & Level Progression Header */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-r from-[#121B2D] via-[#101626] to-[#080B14] p-6 md:p-8 shadow-glow-purple/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" /> Ready for deployment
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">{user?.name}</span>!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-400 max-w-xl">
              Ready to conquer today's missions? You're only{' '}
              <span className="font-bold text-purple-300">{player.levelNeededXP - player.levelProgressXP} XP</span> away from ascending to{' '}
              <span className="font-bold text-cyan-400">Level {(player.level || 1) + 1}</span>.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/mentor"
              className="flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition shadow-glow-cyan/20"
            >
              <Bot className="h-4 w-4" /> Consult AI Mentor
            </Link>
            <Link
              to="/coding-arena"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-purple hover:scale-105 transition"
            >
              <Code2 className="h-4 w-4" /> Coding Arena
            </Link>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="mt-6 pt-6 border-t border-gray-800/80">
          <div className="flex justify-between items-center text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-600 text-[10px] font-black text-white">
                L{player.level || 1}
              </span>
              <span className="font-bold text-gray-200">Level {player.level || 1} Mastery</span>
            </div>
            <span className="text-gray-400 text-[11px]">
              <strong className="text-purple-300">{player.levelProgressXP}</strong> / {player.levelNeededXP} XP ({player.levelProgressPercentage}%)
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-gray-900 overflow-hidden border border-gray-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${player.levelProgressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Player Statistics Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { label: 'Total XP', val: `${player.totalXP || 0}`, icon: Zap, color: 'text-purple-400', border: 'border-purple-500/30' },
          { label: 'Current Level', val: `Level ${player.level || 1}`, icon: Trophy, color: 'text-amber-400', border: 'border-amber-500/30' },
          { label: 'Active Streak', val: `${player.streak?.currentStreak || 1} Days`, icon: Flame, color: 'text-rose-400', border: 'border-rose-500/30' },
          { label: 'Quests Conquered', val: stats.questsCompleted || 0, icon: Compass, color: 'text-cyan-400', border: 'border-cyan-500/30' },
          { label: 'Code Solved', val: stats.challengesCompleted || 0, icon: Code2, color: 'text-emerald-400', border: 'border-emerald-500/30' },
          { label: 'Projects Shipped', val: stats.projectsCompleted || 0, icon: Layers, color: 'text-blue-400', border: 'border-blue-500/30' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`rounded-2xl border ${stat.border} bg-[#121B2D]/80 p-4 backdrop-blur transition hover:scale-102`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-400">{stat.label}</span>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className={`text-lg font-black ${stat.color}`}>{stat.val}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Active Missions & Daily Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Continue Learning */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-purple-400" /> Continue Learning
            </h2>
            <Link to="/quests" className="text-xs font-semibold text-cyan-400 hover:underline">
              View All Quests →
            </Link>
          </div>

          {inProgressQuests.length > 0 ? (
            <div className="space-y-3">
              {inProgressQuests.map((quest: any) => (
                <div
                  key={quest.id}
                  className="rounded-2xl border border-gray-800 bg-[#121B2D]/90 p-5 transition hover:border-purple-500/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-1">
                        <span className="text-purple-400">{quest.category}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400">{quest.difficulty}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-amber-400">+{quest.xpReward} XP</span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{quest.title}</h3>
                    </div>
                    <Link
                      to={`/quests/${quest.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-glow-purple/50 hover:bg-purple-500 transition shrink-0"
                    >
                      <span>Resume Stage {quest.currentStage}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>Stage {quest.currentStage} of {quest.totalStages}</span>
                      <span className="text-cyan-400 font-bold">{quest.progressPercentage}% Complete</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-900 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                        style={{ width: `${quest.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/50 p-8 text-center">
              <Compass className="h-10 w-10 text-gray-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-300">No active quest in progress</p>
              <p className="text-xs text-gray-500 mt-1">Jump into a quest from the explorer to embark on your next adventure.</p>
              <Link
                to="/quests"
                className="mt-4 inline-block rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 transition"
              >
                Browse Quests
              </Link>
            </div>
          )}

          {/* Recommended Quests */}
          <div className="pt-4">
            <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-cyan-400" /> Recommended For You
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedQuests.map((q: any) => (
                <Link
                  key={q._id}
                  to={`/quests/${q.slug}`}
                  className="rounded-2xl border border-gray-800 bg-[#101626] p-4 transition hover:border-cyan-500/40 hover:bg-[#121B2D]"
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span className="text-cyan-400 font-bold uppercase">{q.category}</span>
                    <span className="text-amber-400 font-bold">+{q.xpReward} XP</span>
                  </div>
                  <p className="text-xs font-bold text-white">{q.title}</p>
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-1">{q.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Daily Challenges & Recent Achievements */}
        <div className="space-y-6">
          {/* Daily Challenges */}
          <div className="rounded-2xl border border-purple-500/30 bg-[#121B2D]/90 p-5 shadow-glow-purple/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
                <h3 className="text-sm font-bold text-white">Daily Directives</h3>
              </div>
              <span className="text-[10px] text-gray-400">Resets Daily</span>
            </div>

            <div className="space-y-3">
              {dailyChallenges.map((dc: any) => (
                <div
                  key={dc.id}
                  className={`rounded-xl border p-3 transition ${
                    dc.completed
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-gray-800 bg-[#101626]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-xs font-bold ${dc.completed ? 'text-emerald-300 line-through' : 'text-gray-200'}`}>
                        {dc.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{dc.description}</p>
                    </div>
                    <span className="text-xs font-extrabold text-amber-400 shrink-0">+{dc.xpReward} XP</span>
                  </div>

                  <div className="mt-3 flex justify-end">
                    {dc.completed ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimDaily(dc.id)}
                        disabled={claiming === dc.id}
                        className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-[10px] font-bold text-white hover:opacity-90 disabled:opacity-50"
                      >
                        {claiming === dc.id ? 'Verifying...' : 'Complete & Claim'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/80 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" /> Recent Achievements
              </h3>
              <Link to="/leaderboard" className="text-[11px] text-cyan-400 hover:underline">
                View All
              </Link>
            </div>

            {recentAchievements.length > 0 ? (
              <div className="space-y-2">
                {recentAchievements.map((ach: any) => (
                  <div key={ach.id} className="flex items-center gap-3 rounded-xl bg-[#101626] p-2.5 border border-gray-800">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{ach.title}</p>
                      <p className="text-[10px] text-gray-400">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 text-center py-4">Complete missions to unlock your first trophy!</p>
            )}
          </div>
        </div>
      </div>

      {/* Learning Analytics: Weekly XP Activity & Skill Breakdown */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          {/* Weekly Activity Area Chart */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Weekly XP Velocity</h3>
                <p className="text-[11px] text-gray-400">XP gained over the last 7 days</p>
              </div>
              <span className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300">
                Live Telemetry
              </span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.weeklyActivity}>
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#101626', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="xp" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#xpGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Breakdown Bar Chart */}
          <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Domain Competency</h3>
                <p className="text-[11px] text-gray-400">Proficiency by technical subject</p>
              </div>
              <span className="rounded-lg bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300">
                Skills Engine
              </span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.skillBreakdown} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="subject" type="category" stroke="#94A3B8" fontSize={11} width={110} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#101626', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="score" fill="#38BDF8" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpModalOpen}
        onClose={() => setLevelUpModalOpen(false)}
        level={newLevel}
        unlockedAchievements={unlockedAchs}
      />
    </div>
  );
};

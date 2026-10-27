import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  Shield,
  Zap,
  Flame,
  CheckCircle2,
  Github,
  Compass,
  Trophy,
  ExternalLink,
  Lock,
  Sparkles,
} from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const { user: currentUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const targetId = userId || currentUser?.id;
        const res = await api.get(`/projects/portfolio/${targetId || ''}`);
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [userId, currentUser]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/40 p-12 text-center">
        <Lock className="h-10 w-10 text-gray-500 mx-auto mb-2" />
        <h2 className="text-base font-bold text-white">Portfolio Inaccessible</h2>
        <p className="text-xs text-gray-400 mt-1">{error || 'This portfolio is private or does not exist.'}</p>
        <Link to="/dashboard" className="mt-4 inline-block text-xs font-bold text-cyan-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { user, verifiedSkills, selfReportedInterests, completedQuests, achievements, projects } = data;

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-r from-[#121B2D] via-[#101626] to-[#080B14] p-8 shadow-2xl backdrop-blur">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-24 w-24 rounded-3xl border-2 border-purple-500/50 bg-[#080B14] object-cover shadow-glow-purple"
          />

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="font-display text-2xl font-extrabold text-white">{user.name}</h1>
              <span className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300">
                Level {user.level || 1}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Verified SkillQuest AI Student Portfolio
            </p>

            {/* Quick Metrics */}
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-purple-400">
                <Zap className="h-4 w-4 fill-purple-400" />
                <span>{user.totalXP || 0} XP Earned</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Flame className="h-4 w-4 fill-amber-400" />
                <span>{user.streak?.currentStreak || 1}-Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>{completedQuests?.length || 0} Quests Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix (Verified vs Self-Reported) */}
      <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/80 p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-cyan-400" /> Technical Competencies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Verified Skills */}
          <div className="rounded-2xl border border-emerald-500/20 bg-[#101626] p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
              <CheckCircle2 className="h-4 w-4" /> Verified Credentials (Quest Backed)
            </div>
            <p className="text-[11px] text-gray-400 mb-3">
              Validated through successfully passed code submissions and knowledge checkpoints.
            </p>
            <div className="flex flex-wrap gap-2">
              {verifiedSkills?.length > 0 ? (
                verifiedSkills.map((s: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300"
                  >
                    ✓ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500 italic">No verified skills completed yet</span>
              )}
            </div>
          </div>

          {/* Self-Reported Interests */}
          <div className="rounded-2xl border border-purple-500/20 bg-[#101626] p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 mb-2">
              <Sparkles className="h-4 w-4" /> Focus Areas & Learning Interests
            </div>
            <p className="text-[11px] text-gray-400 mb-3">
              Domains currently being pursued by the student.
            </p>
            <div className="flex flex-wrap gap-2">
              {selfReportedInterests?.map((interest: string, i: number) => (
                <span
                  key={i}
                  className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completed Projects Showcase */}
      <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/80 p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Award className="h-4 w-4 text-purple-400" /> Shipped Projects & Repositories
        </h2>

        {projects?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj: any) => (
              <div key={proj._id} className="rounded-2xl border border-gray-800 bg-[#101626] p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                    {proj.category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400">Verified Milestone</span>
                </div>
                <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                <p className="mt-1 text-xs text-gray-400 line-clamp-2">{proj.description}</p>

                {proj.repositoryUrl && (
                  <div className="mt-4 border-t border-gray-800 pt-3">
                    <a
                      href={proj.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline"
                    >
                      <Github className="h-3.5 w-3.5" /> View Source Code
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-4 text-center">No public projects published yet.</p>
        )}
      </div>

      {/* Verified Achievements */}
      <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/80 p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" /> Trophies & Milestones
        </h2>

        {achievements?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {achievements.map((ach: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-[#101626] p-3 shadow-glow-amber/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{ach.title}</p>
                  <p className="text-[10px] text-gray-400 line-clamp-1">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-4 text-center">No achievements unlocked yet.</p>
        )}
      </div>
    </div>
  );
};

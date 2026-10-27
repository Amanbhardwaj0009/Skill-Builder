import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Trophy,
  Crown,
  Medal,
  Zap,
  Flame,
  User,
  ArrowUp,
  Sparkles,
} from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gamification/leaderboard', {
        params: { timeframe },
      });
      setLeaderboard(res.data.leaderboard || []);
      setCurrentUserRank(res.data.currentUserRank);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <Trophy className="h-7 w-7 text-amber-400" /> Global Leaderboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Compete against learners worldwide, conquer quests, and claim the podium.
          </p>
        </div>

        {/* Timeframe Switcher Tabs */}
        <div className="flex rounded-2xl border border-gray-800 bg-[#121B2D] p-1 text-xs">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`rounded-xl px-4 py-1.5 font-bold transition ${
              timeframe === 'weekly'
                ? 'bg-purple-600 text-white shadow-glow-purple/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Weekly Velocity
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`rounded-xl px-4 py-1.5 font-bold transition ${
              timeframe === 'monthly'
                ? 'bg-purple-600 text-white shadow-glow-purple/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly Trial
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`rounded-xl px-4 py-1.5 font-bold transition ${
              timeframe === 'all'
                ? 'bg-purple-600 text-white shadow-glow-purple/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All-Time Pantheon
          </button>
        </div>
      </div>

      {/* Current User Standing Banner */}
      {currentUserRank && (
        <div className="flex items-center justify-between rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4 shadow-glow-purple/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-sm font-black text-white">
              #{currentUserRank}
            </div>
            <div>
              <p className="text-xs font-bold text-white">Your Current Position</p>
              <p className="text-[11px] text-purple-300">
                You are ranked #{currentUserRank} in the {timeframe} arena.
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-amber-400">
            {user?.currentXP || 0} XP
          </span>
        </div>
      )}

      {/* Podium for Top 3 */}
      {!loading && leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 md:gap-6 pt-4 pb-2 items-end max-w-2xl mx-auto">
          {/* 2nd Place */}
          <div className="rounded-3xl border border-gray-700 bg-[#121B2D]/80 p-4 text-center order-1 h-44 flex flex-col justify-end">
            <Medal className="h-6 w-6 text-gray-300 mx-auto mb-1" />
            <span className="text-xs font-black text-gray-300">#2 Rank</span>
            <p className="text-xs font-bold text-white truncate mt-1">{leaderboard[1]?.name}</p>
            <p className="text-[11px] font-extrabold text-amber-400 mt-1">{leaderboard[1]?.periodXP} XP</p>
          </div>

          {/* 1st Place */}
          <div className="rounded-3xl border border-amber-500/50 bg-gradient-to-b from-amber-500/20 to-[#121B2D] p-5 text-center order-2 h-52 flex flex-col justify-end shadow-glow-amber">
            <Crown className="h-8 w-8 text-amber-400 mx-auto mb-1 animate-bounce" />
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Champion</span>
            <p className="text-sm font-extrabold text-white truncate mt-1">{leaderboard[0]?.name}</p>
            <p className="text-xs font-black text-amber-400 mt-1">{leaderboard[0]?.periodXP} XP</p>
          </div>

          {/* 3rd Place */}
          <div className="rounded-3xl border border-amber-800/40 bg-[#121B2D]/80 p-4 text-center order-3 h-40 flex flex-col justify-end">
            <Medal className="h-6 w-6 text-amber-600 mx-auto mb-1" />
            <span className="text-xs font-black text-amber-600">#3 Rank</span>
            <p className="text-xs font-bold text-white truncate mt-1">{leaderboard[2]?.name}</p>
            <p className="text-[11px] font-extrabold text-amber-400 mt-1">{leaderboard[2]?.periodXP} XP</p>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-3xl border border-gray-800 bg-[#121B2D]/90 shadow-xl backdrop-blur">
        <div className="grid grid-cols-12 border-b border-gray-800 bg-[#101626] p-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <div className="col-span-2 sm:col-span-1">Rank</div>
          <div className="col-span-6 sm:col-span-7">Player</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-2 text-right">XP</div>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="divide-y divide-gray-800/60">
            {leaderboard.map((item) => (
              <div
                key={item.userId}
                className={`grid grid-cols-12 items-center p-4 text-xs transition ${
                  item.isCurrentUser
                    ? 'bg-purple-600/15 border-l-4 border-l-purple-500 font-semibold'
                    : 'hover:bg-[#101626]'
                }`}
              >
                <div className="col-span-2 sm:col-span-1">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-lg font-black text-[11px] ${
                      item.rank === 1
                        ? 'bg-amber-400 text-black'
                        : item.rank === 2
                        ? 'bg-gray-300 text-black'
                        : item.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    #{item.rank}
                  </span>
                </div>

                <div className="col-span-6 sm:col-span-7 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-8 w-8 rounded-xl bg-purple-900/30 object-cover"
                  />
                  <div>
                    <Link
                      to={`/portfolio/${item.userId}`}
                      className="font-bold text-white hover:text-cyan-400 transition"
                    >
                      {item.name}
                    </Link>
                    {item.isCurrentUser && (
                      <span className="ml-2 rounded bg-purple-500/20 px-1.5 py-0.2 text-[9px] font-bold text-purple-300">
                        YOU
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-2 text-center text-gray-300 font-semibold">
                  L{item.level || 1}
                </div>

                <div className="col-span-2 text-right font-black text-amber-400">
                  {item.periodXP} XP
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">
            No rankings recorded for this timeframe yet.
          </div>
        )}
      </div>
    </div>
  );
};

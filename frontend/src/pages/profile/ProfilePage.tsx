import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  User as UserIcon,
  Zap,
  Flame,
  Trophy,
  Shield,
  Settings,
  Compass,
  Layers,
  Award,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/gamification/profile');
        setProfileData(res.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const achievements = profileData?.achievements || [];
  const unlockedCount = achievements.filter((a: any) => a.isUnlocked).length;

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-[#121B2D]/90 p-8 shadow-2xl backdrop-blur">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="h-24 w-24 rounded-3xl border-2 border-purple-500/50 bg-[#080B14] object-cover shadow-glow-purple"
          />

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="font-display text-2xl font-extrabold text-white">{user?.name}</h1>
              <span className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300">
                Level {user?.currentLevel || 1}
              </span>
              {user?.role === 'administrator' && (
                <span className="rounded-lg bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300">
                  Commander Admin
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{user?.email}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-purple-400">
                <Zap className="h-4 w-4 fill-purple-400" />
                <span>{user?.currentXP || 0} Total XP</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Flame className="h-4 w-4 fill-amber-400" />
                <span>{user?.streak?.currentStreak || 1}-Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Trophy className="h-4 w-4" />
                <span>{unlockedCount} / {achievements.length} Achievements</span>
              </div>
            </div>
          </div>

          <Link
            to="/settings"
            className="flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800/80 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:border-gray-600 transition"
          >
            <Settings className="h-4 w-4" /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/80 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" /> Trophies & Accomplishments
          </h2>
          <span className="text-xs text-gray-400">
            {unlockedCount} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((ach: any) => (
            <div
              key={ach.id}
              className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
                ach.isUnlocked
                  ? 'border-amber-500/40 bg-amber-500/10 text-white shadow-glow-amber/5'
                  : 'border-gray-800 bg-[#101626]/50 opacity-40'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  ach.isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-600'
                }`}
              >
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold">{ach.title}</p>
                <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{ach.description}</p>
                <span className="mt-1 block text-[10px] font-black text-amber-400">+{ach.xpReward} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

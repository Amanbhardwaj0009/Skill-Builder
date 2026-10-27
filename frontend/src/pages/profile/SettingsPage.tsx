import React, { useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Globe,
  Clock,
  Shield,
  Check,
  User,
  Save,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'English');
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState(user?.dailyStudyMinutes || 30);
  const [isPublic, setIsPublic] = useState(true);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.patch('/auth/profile', {
        preferredLanguage,
        dailyStudyMinutes,
        privacy: {
          isPublic,
          showOnLeaderboard,
        },
      });
      await refreshUser();
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-3xl mx-auto">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-3">
          <Settings className="h-6 w-6 text-purple-400" /> Account Settings
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage your learning preferences, AI localization, and privacy controls.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-bold">
          ✓ {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Preferred Language & AI Tutor */}
        <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/80 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Globe className="h-4 w-4 text-cyan-400" /> AI Mentor Preferred Language
          </div>
          <p className="text-[11px] text-gray-400">
            Choose the language for conversational code explanations, analogies, and hints.
          </p>

          <select
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            className="w-full rounded-xl border border-gray-800 bg-[#080B14] p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिंदी)</option>
            <option value="Hinglish">Hinglish</option>
          </select>
        </div>

        {/* Daily Study Commitment */}
        <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/80 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Clock className="h-4 w-4 text-amber-400" /> Daily Target
            </div>
            <span className="text-xs font-bold text-amber-400">{dailyStudyMinutes} mins/day</span>
          </div>

          <input
            type="range"
            min="15"
            max="120"
            step="15"
            value={dailyStudyMinutes}
            onChange={(e) => setDailyStudyMinutes(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

        {/* Privacy & Showcase */}
        <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/80 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Shield className="h-4 w-4 text-emerald-400" /> Privacy & Leaderboard Visibility
          </div>

          <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
            <div>
              <span className="font-semibold text-white">Public Student Portfolio</span>
              <p className="text-[11px] text-gray-400">Allow other students and recruiters to view your verified skills.</p>
            </div>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-0 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
            <div>
              <span className="font-semibold text-white">Show on Global Leaderboard</span>
              <p className="text-[11px] text-gray-400">Display your rank and earned XP on weekly and monthly leaderboards.</p>
            </div>
            <input
              type="checkbox"
              checked={showOnLeaderboard}
              onChange={(e) => setShowOnLeaderboard(e.target.checked)}
              className="rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-0 h-4 w-4"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 text-xs font-bold text-white shadow-glow-purple hover:opacity-95 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
};

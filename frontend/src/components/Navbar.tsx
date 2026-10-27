import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, Bell, Search, Shield, LogOut, User as UserIcon, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-purple-500/20 bg-[#080B14]/85 px-4 backdrop-blur-md md:px-8">
      {/* Left: Brand Logo & Tagline */}
      <div className="flex items-center gap-3">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-glow-purple transition group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#080B14]">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-bold tracking-wider text-white">SKILLQUEST</span>
              <span className="rounded bg-gradient-to-r from-purple-500 to-cyan-400 px-1.5 py-0.5 text-[10px] font-black uppercase text-black">AI</span>
            </div>
            <p className="hidden text-[10px] font-medium tracking-wider text-cyan-400/80 sm:block">Learn by Playing. Build by Doing.</p>
          </div>
        </Link>
      </div>

      {/* Middle: Quick Search (Desktop) */}
      <div className="hidden max-w-xs flex-1 px-8 md:block lg:max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search quests, challenges, algorithms..."
            className="w-full rounded-xl border border-gray-800 bg-[#121B2D]/80 py-1.5 pl-9 pr-4 text-xs text-gray-200 placeholder-gray-500 transition focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/quests?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
              }
            }}
          />
        </div>
      </div>

      {/* Right Controls */}
      {user ? (
        <div className="flex items-center gap-3 md:gap-5">
          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 shadow-sm" title="Active Daily Learning Streak">
            <Flame className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{user.streak?.currentStreak || 1}d Streak</span>
          </div>

          {/* XP & Level Badge */}
          <div className="hidden items-center gap-2 rounded-xl border border-purple-500/30 bg-[#121B2D] px-3 py-1 sm:flex shadow-glow-purple/20">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 text-[10px] font-bold text-white">
              L{user.currentLevel || 1}
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-purple-300">{user.currentXP || 0} XP</span>
            </div>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-800 bg-[#121B2D] text-gray-400 transition hover:border-gray-700 hover:text-white"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-[#080B14]"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-purple-500/30 bg-[#121B2D] p-3 shadow-xl backdrop-blur-xl">
                <div className="mb-2 flex items-center justify-between border-b border-gray-800 pb-2">
                  <span className="text-xs font-bold text-gray-300">Quest Transmissions</span>
                  <span className="text-[10px] text-cyan-400">1 new</span>
                </div>
                <div className="space-y-2">
                  <div className="rounded-xl bg-[#101626] p-2.5 text-xs">
                    <p className="font-semibold text-purple-300">Daily Quest Refreshed!</p>
                    <p className="text-[11px] text-gray-400">Solve today's coding puzzle to claim +30 bonus XP.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#121B2D] p-1.5 transition hover:border-purple-500/50"
            >
              <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-lg bg-purple-950/50 object-cover" />
              <span className="hidden text-xs font-medium text-gray-200 md:inline">{user.name.split(' ')[0]}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-purple-500/30 bg-[#121B2D] py-2 shadow-2xl">
                <div className="border-b border-gray-800 px-4 py-2">
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="truncate text-[10px] text-gray-400">{user.email}</p>
                  {user.role === 'administrator' && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300">
                      <Shield className="h-3 w-3" /> Admin
                    </span>
                  )}
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-gray-300 hover:bg-purple-500/10 hover:text-white"
                  >
                    <UserIcon className="h-4 w-4 text-purple-400" /> Player Profile
                  </Link>
                  {user.role === 'administrator' && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-purple-300 hover:bg-purple-500/10 hover:text-white"
                    >
                      <Shield className="h-4 w-4 text-purple-400" /> Admin Command
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-300 transition hover:text-white"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-glow-purple transition hover:opacity-95"
          >
            Start Journey
          </Link>
        </div>
      )}
    </header>
  );
};

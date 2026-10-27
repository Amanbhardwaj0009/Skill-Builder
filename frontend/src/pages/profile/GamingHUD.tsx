import React from 'react';
import {
  Compass,
  Trophy,
  Zap,
  Flame,
  Award,
  ChevronUp,
  Layers,
  Sparkles,
} from 'lucide-react';

interface GamingHUDProps {
  user: any;
  currentCareer: string;
  onOpenPathways: () => void;
  onOpenAchievements: () => void;
}

export const GamingHUD: React.FC<GamingHUDProps> = ({
  user,
  currentCareer = 'Manufacturing Engineer',
  onOpenPathways,
  onOpenAchievements,
}) => {
  const currentXP = user?.currentXP || 0;
  const currentLevel = user?.currentLevel || 1;
  const levelStartXP = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  const progressXP = Math.max(0, currentXP - levelStartXP);
  const neededXP = Math.max(1, nextLevelXP - levelStartXP);
  const progressPct = Math.min(100, Math.round((progressXP / neededXP) * 100));

  return (
    <div className="w-full pointer-events-auto select-none">
      <div className="mx-auto max-w-7xl rounded-2xl border border-purple-500/30 bg-[#0B101E]/95 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
          {/* Bottom-Left Controls: Avatar & Career Pathways Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex'}
                  alt={user?.name || 'Recruit'}
                  className="h-9 w-9 rounded-xl border border-purple-500/50 bg-[#080B14] object-cover"
                />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded bg-purple-600 text-[8px] font-black text-white">
                  L{currentLevel}
                </span>
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-wider text-purple-400">
                  Active Career
                </span>
                <span className="block text-xs font-bold text-white truncate max-w-[150px]">
                  {currentCareer}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenPathways}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 shadow-glow-cyan/20 transition"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Career Pathways</span>
            </button>
          </div>

          {/* Bottom-Center & Progress: XP Progress Bar & Milestones */}
          <div className="flex-1 w-full max-w-md">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-200">Level {currentLevel} Mastery</span>
                <span className="rounded bg-purple-500/20 px-1.5 py-0.2 text-[9px] font-bold text-purple-300">
                  {progressPct}%
                </span>
              </div>
              <span className="text-gray-400 font-mono text-[10px]">
                {progressXP} / {neededXP} XP to Level {currentLevel + 1}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-900 overflow-hidden border border-gray-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Bottom-Right Controls: Achievements Shortcut */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenAchievements}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 shadow-glow-amber/10 transition"
            >
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Achievements</span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-rose-400 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-1.5">
              <Flame className="h-3.5 w-3.5 fill-rose-400" />
              <span>{user?.streak?.currentStreak || 1}d Streak</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

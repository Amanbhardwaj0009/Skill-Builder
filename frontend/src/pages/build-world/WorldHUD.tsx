import React from 'react';
import {
  Trophy,
  Sparkles,
  Coins,
  Building2,
  CheckCircle2,
  Flame,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface WorldHUDProps {
  worldLevel: number;
  currentXP: number;
  nextLevelXP: number;
  worldCredits: number;
  unlockedBuildingsCount: number;
  totalBuildingsCount: number;
  completedMissionsCount: number;
  totalMissionsCount: number;
  nextMilestone: string;
}

export const WorldHUD: React.FC<WorldHUDProps> = ({
  worldLevel,
  currentXP,
  nextLevelXP,
  worldCredits,
  unlockedBuildingsCount,
  totalBuildingsCount,
  completedMissionsCount,
  totalMissionsCount,
  nextMilestone,
}) => {
  const xpProgress = Math.min(100, Math.round((currentXP / nextLevelXP) * 100));

  return (
    <div className="w-full rounded-2xl border border-purple-500/25 bg-[#0C1222]/90 backdrop-blur-xl p-3.5 shadow-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: World Level & XP Meter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-glow-purple">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0A0E1A] font-display font-black text-xs text-white">
              W-L{worldLevel}
            </div>
          </div>

          <div className="flex-1 md:w-48 space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-white flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" />
                World Progress
              </span>
              <span className="text-purple-300 font-mono">
                {currentXP} / {nextLevelXP} XP
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Stat Badges */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full md:w-auto text-center">
          {/* Building Credits */}
          <div className="rounded-xl border border-gray-800 bg-[#080B14]/80 px-3 py-1.5 flex items-center justify-center gap-2">
            <Coins className="h-4 w-4 text-amber-400 shrink-0" />
            <div className="text-left">
              <span className="block text-[10px] text-gray-400 leading-none">City Credits</span>
              <span className="text-xs font-bold text-amber-300 font-mono">{worldCredits} Cr</span>
            </div>
          </div>

          {/* Unlocked Structures */}
          <div className="rounded-xl border border-gray-800 bg-[#080B14]/80 px-3 py-1.5 flex items-center justify-center gap-2">
            <Building2 className="h-4 w-4 text-cyan-400 shrink-0" />
            <div className="text-left">
              <span className="block text-[10px] text-gray-400 leading-none">Structures</span>
              <span className="text-xs font-bold text-cyan-300 font-mono">
                {unlockedBuildingsCount}/{totalBuildingsCount}
              </span>
            </div>
          </div>

          {/* Completed Missions */}
          <div className="rounded-xl border border-gray-800 bg-[#080B14]/80 px-3 py-1.5 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="text-left">
              <span className="block text-[10px] text-gray-400 leading-none">Missions</span>
              <span className="text-xs font-bold text-emerald-300 font-mono">
                {completedMissionsCount}/{totalMissionsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Next Milestone Roadmap */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-950/20 px-3 py-1.5 text-xs">
          <TrendingUp className="h-4 w-4 text-purple-400 shrink-0" />
          <div className="text-left">
            <span className="block text-[9px] uppercase font-bold text-purple-400">Next Milestone</span>
            <span className="font-bold text-gray-200 text-[11px]">{nextMilestone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Trophy,
  X,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';

interface AchievementsViewAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: any[];
}

export const AchievementsViewAllModal: React.FC<AchievementsViewAllModalProps> = ({
  isOpen,
  onClose,
  achievements = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-purple-500/40 bg-[#101626] p-6 sm:p-8 shadow-2xl text-white">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-glow-amber">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Achievements & Trophies</h2>
              <p className="text-xs text-gray-400">Track and unlock rewards for completing coding missions and streaks</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 transition ${
                ach.isUnlocked
                  ? 'border-amber-500/40 bg-amber-500/10 shadow-glow-amber/5'
                  : 'border-gray-800 bg-[#080B14]/60 opacity-50'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  ach.isUnlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-800 text-gray-600'
                }`}
              >
                <Trophy className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white truncate">{ach.title}</h3>
                  {ach.isUnlocked ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-gray-600 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{ach.description}</p>
                <span className="mt-1.5 inline-block text-[10px] font-black text-amber-400">
                  +{ach.xpReward} XP Reward
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

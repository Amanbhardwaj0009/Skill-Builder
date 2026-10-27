import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, X } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  unlockedAchievements?: any[];
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  level,
  unlockedAchievements = [],
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#38BDF8', '#34D399', '#FBBF24'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-purple-500/50 bg-[#101626] p-6 text-center shadow-glow-purple">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-1 shadow-glow-purple animate-bounce">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#080B14]">
            <Trophy className="h-10 w-10 text-amber-400" />
          </div>
        </div>

        <span className="inline-block rounded-full bg-purple-500/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-purple-300">
          Rank Promotion
        </span>

        <h2 className="mt-2 text-2xl font-black text-white">LEVEL UP!</h2>
        <p className="mt-1 text-sm text-gray-300">
          You have ascended to <span className="font-bold text-cyan-400">Level {level}</span>!
        </p>

        {unlockedAchievements.length > 0 && (
          <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>Achievement Unlocked</span>
            </div>
            {unlockedAchievements.map((ach) => (
              <div key={ach.id || ach.code} className="mt-1 text-xs text-gray-200">
                <span className="font-semibold text-white">{ach.title}:</span> {ach.description}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-glow-purple transition hover:opacity-95"
        >
          Claim Glory & Continue
        </button>
      </div>
    </div>
  );
};

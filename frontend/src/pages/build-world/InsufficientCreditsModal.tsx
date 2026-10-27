import React from 'react';
import {
  Coins,
  AlertCircle,
  X,
  Compass,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCredits: number;
  requiredCredits: number;
  buildingName: string;
  onEarnCredits: () => void;
}

export const InsufficientCreditsModal: React.FC<InsufficientCreditsModalProps> = ({
  isOpen,
  onClose,
  availableCredits,
  requiredCredits,
  buildingName,
  onEarnCredits,
}) => {
  if (!isOpen) return null;

  const shortfall = Math.max(0, requiredCredits - availableCredits);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080B14]/85 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#101626] to-[#0A0E1A] p-6 shadow-2xl shadow-amber-950/30 transition-all animate-scale-up">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-amber-500/15 blur-[60px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-purple-600/15 blur-[60px]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl border border-gray-800 bg-[#121B2D]/80 p-1.5 text-gray-400 hover:border-gray-700 hover:text-white transition"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3.5 mb-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 p-[2px] shadow-glow-amber">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0A0E1A]">
              <Coins className="h-6 w-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              Civic Treasury Alert
            </span>
            <h2 className="text-lg font-bold text-white">Not Enough City Credits!</h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-300 leading-relaxed mb-5">
          Your city is growing. Complete learning missions to earn more credits and upgrade{' '}
          <strong className="text-white">{buildingName}</strong>.
        </p>

        {/* Credit Comparison Dashboard Box */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#080B14]/80 p-4 mb-5 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-center border-b border-gray-800/80 pb-3">
            {/* Available */}
            <div className="rounded-xl border border-gray-800 bg-[#121B2D]/60 p-2.5">
              <span className="block text-[10px] font-semibold uppercase text-gray-400 mb-0.5">
                Available Credits
              </span>
              <span className="text-sm font-bold text-gray-200 font-mono">
                {availableCredits} Cr
              </span>
            </div>

            {/* Required */}
            <div className="rounded-xl border border-gray-800 bg-[#121B2D]/60 p-2.5">
              <span className="block text-[10px] font-semibold uppercase text-amber-400 mb-0.5">
                Required Credits
              </span>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {requiredCredits} Cr
              </span>
            </div>
          </div>

          {/* Calculated Shortfall Statement */}
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-1.5 text-gray-300 font-medium">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Credits Needed:</span>
            </div>
            <span className="font-bold text-amber-300 font-mono">
              You need {shortfall} more credits.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {/* Action 1: Earn Credits */}
          <button
            onClick={() => {
              onClose();
              onEarnCredits();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-glow-purple hover:brightness-110 transition"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Earn Credits with Missions (+100 Cr to +300 Cr)</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Action 2 & 3: View Missions / Cancel */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEarnCredits();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-[#121B2D] py-2.5 text-xs font-bold text-purple-200 hover:bg-[#1a253d] hover:text-white transition"
            >
              <Compass className="h-4 w-4 text-cyan-400" />
              <span>View Missions</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-800 bg-[#0C1222] py-2.5 text-xs font-bold text-gray-400 hover:border-gray-700 hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

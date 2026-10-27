import React from 'react';
import { Building } from './worldData';
import {
  Sparkles,
  CheckCircle2,
  Coins,
  Building2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface UpgradeSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building | null;
  cost: number;
  newCredits: number;
}

export const UpgradeSuccessModal: React.FC<UpgradeSuccessModalProps> = ({
  isOpen,
  onClose,
  building,
  cost,
  newCredits,
}) => {
  if (!isOpen || !building) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080B14]/85 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#101626] to-[#0A0E1A] p-6 text-center shadow-2xl shadow-emerald-950/40 transition-all animate-scale-up">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-44 w-44 rounded-full bg-emerald-500/20 blur-[60px]" />

        {/* Success Icon */}
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[2px] shadow-glow-emerald">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0A0E1A]">
            <CheckCircle2 className="h-7 w-7 text-emerald-400 animate-bounce" />
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
          Metropolis Milestone Reached
        </span>
        <h2 className="text-lg font-bold text-white mt-0.5">Structure Upgraded!</h2>

        <p className="text-xs text-gray-300 mt-2">
          <strong className="text-white">{building.name}</strong> has been elevated to{' '}
          <span className="font-bold text-purple-400">Tier {building.level}</span>!
        </p>

        {/* Transaction Summary Card */}
        <div className="my-4 rounded-2xl border border-gray-800 bg-[#080B14]/80 p-3.5 space-y-1.5 text-xs text-left">
          <div className="flex items-center justify-between text-gray-400">
            <span>Treasury Deducted:</span>
            <span className="font-bold text-rose-400 font-mono">-{cost} Cr</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Available City Credits:</span>
            <span className="font-bold text-emerald-400 font-mono">{newCredits} Cr</span>
          </div>
          <div className="pt-1.5 border-t border-gray-800 flex items-center justify-between text-gray-300 text-[11px]">
            <span>Civilian Happiness:</span>
            <span className="font-bold text-cyan-400">+15% Boost</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 py-3 text-xs font-bold text-white shadow-glow-emerald hover:brightness-110 transition"
        >
          Continue Building
        </button>
      </div>
    </div>
  );
};

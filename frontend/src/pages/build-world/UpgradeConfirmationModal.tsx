import React from 'react';
import { Building, getUpgradeCost, getUpgradeBenefits } from './worldData';
import {
  ArrowUpCircle,
  X,
  Coins,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Building2,
  Check,
} from 'lucide-react';

interface UpgradeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  building: Building | null;
  availableCredits: number;
  onConfirmUpgrade: (buildingId: string) => void;
}

export const UpgradeConfirmationModal: React.FC<UpgradeConfirmationModalProps> = ({
  isOpen,
  onClose,
  building,
  availableCredits,
  onConfirmUpgrade,
}) => {
  if (!isOpen || !building) return null;

  const cost = getUpgradeCost(building);
  const nextLevel = building.level + 1;
  const remainingBalance = availableCredits - cost;
  const benefits = getUpgradeBenefits(building, nextLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080B14]/85 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-b from-[#101626] to-[#0A0E1A] p-6 shadow-2xl shadow-purple-950/40 transition-all animate-scale-up">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-purple-600/20 blur-[60px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-cyan-500/15 blur-[60px]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl border border-gray-800 bg-[#121B2D]/80 p-1.5 text-gray-400 hover:border-gray-700 hover:text-white transition"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3.5 mb-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-glow-purple p-[2px]"
            style={{ backgroundColor: building.colorScheme.primary }}
          >
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
              Architectural Expansion
            </span>
            <h2 className="text-lg font-bold text-white">Upgrade {building.name}</h2>
          </div>
        </div>

        {/* Level Progression Indicator */}
        <div className="rounded-2xl border border-purple-500/30 bg-[#080B14]/80 p-4 mb-4">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-gray-400">Current Tier: L{building.level}</span>
            <span className="text-purple-400 flex items-center gap-1">
              Next Tier: L{nextLevel} <Sparkles className="h-3 w-3 text-cyan-400" />
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-center">
            <div className="flex-1 rounded-xl border border-gray-800 bg-[#121B2D]/60 p-2">
              <span className="block text-[10px] text-gray-400">Tier {building.level}</span>
              <span className="text-xs font-bold text-gray-300">Active</span>
            </div>
            <ArrowRight className="h-4 w-4 text-cyan-400 shrink-0" />
            <div className="flex-1 rounded-xl border border-purple-500/40 bg-purple-950/30 p-2 shadow-sm">
              <span className="block text-[10px] text-purple-300">Tier {nextLevel}</span>
              <span className="text-xs font-bold text-white">Enhanced</span>
            </div>
          </div>
        </div>

        {/* Expected Benefits */}
        <div className="mb-4">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Tier {nextLevel} Benefits & Unlocks:
          </h4>
          <div className="space-y-1.5">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-xl border border-gray-800/80 bg-[#121B2D]/50 px-3 py-2 text-xs text-gray-200"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost & Balance Breakdown */}
        <div className="rounded-2xl border border-gray-800 bg-[#080B14] p-3.5 mb-5 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Upgrade Investment:</span>
            <span className="font-bold text-amber-400 font-mono flex items-center gap-1">
              <Coins className="h-3.5 w-3.5" /> {cost} Cr
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Available Treasury:</span>
            <span className="font-bold text-gray-200 font-mono">{availableCredits} Cr</span>
          </div>
          <div className="pt-1.5 border-t border-gray-800/80 flex items-center justify-between">
            <span className="text-gray-300 font-semibold">Remaining After Upgrade:</span>
            <span className="font-bold text-emerald-400 font-mono">
              {remainingBalance} Cr
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onConfirmUpgrade(building.id);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-glow-purple hover:brightness-110 transition"
          >
            <Check className="h-4 w-4" />
            <span>Confirm Upgrade ({cost} Cr)</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-800 bg-[#0C1222] px-5 py-3 text-xs font-bold text-gray-400 hover:border-gray-700 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

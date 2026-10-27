import React from 'react';
import { Plot, Building, WorldMission, getUpgradeCost } from './worldData';
import {
  Building2,
  Lock,
  Sparkles,
  Zap,
  ArrowUpCircle,
  X,
  Palette,
  CheckCircle2,
  AlertCircle,
  Play,
  Layers,
  ChevronRight,
  ShieldCheck,
  Coins,
} from 'lucide-react';

interface BuildingDetailPanelProps {
  selectedPlot: Plot | null;
  building: Building | null;
  missions: WorldMission[];
  onClose: () => void;
  onLaunchMission: (missionId: string) => void;
  onUpgradeBuilding?: (buildingId: string) => void;
  worldCredits: number;
}

export const BuildingDetailPanel: React.FC<BuildingDetailPanelProps> = ({
  selectedPlot,
  building,
  missions,
  onClose,
  onLaunchMission,
  onUpgradeBuilding,
  worldCredits,
}) => {
  if (!selectedPlot) {
    return (
      <div className="flex flex-col h-[540px] md:h-[620px] w-full md:w-80 rounded-3xl border border-purple-500/20 bg-[#0C1222]/90 backdrop-blur-xl p-6 shadow-xl items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 mb-3">
          <Building2 className="h-7 w-7" />
        </div>
        <h3 className="text-sm font-bold text-white">Select a Building or Plot</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
          Click on any sector plot in the city canvas to inspect its infrastructure, unlock conditions, and active upgrades.
        </p>
      </div>
    );
  }

  // Plot is locked
  if (selectedPlot.isLocked) {
    return (
      <div className="flex flex-col h-[540px] md:h-[620px] w-full md:w-80 rounded-3xl border border-rose-500/30 bg-[#0C1222]/90 backdrop-blur-xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Zoned Sector Locked</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 mb-4">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs mb-1">
            <AlertCircle className="h-4 w-4 text-rose-400" />
            <span>Expansion Restricted</span>
          </div>
          <p className="text-xs text-gray-300">
            This metropolitan plot requires <strong className="text-white">World Level {selectedPlot.requiredWorldLevel}</strong> zoning clearance before construction permits can be issued.
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Requirements to Expand:</p>
          <div className="rounded-xl border border-gray-800 bg-[#080B14] p-3 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>Complete pending district missions</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              <span>Attain World Level {selectedPlot.requiredWorldLevel}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-800 hover:bg-gray-700 py-2.5 text-xs font-bold text-gray-300 transition"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    );
  }

  // Plot is unlocked but empty
  if (!building) {
    const availableUnlocks = missions
      .filter((m) => m.status === 'completed' && m.unlocksBuildingId)
      .map((m) => m.unlocksBuildingId);

    return (
      <div className="flex flex-col h-[540px] md:h-[620px] w-full md:w-80 rounded-3xl border border-cyan-500/30 bg-[#0C1222]/90 backdrop-blur-xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Empty Construction Plot</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-gray-300 mb-4">
          {selectedPlot.label} is prepped with underground fiber conduits and clean power lines. Complete learning missions to unlock new architectural structures for this lot.
        </p>

        <div className="space-y-3 mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
            Available City Blueprints
          </p>

          {missions.slice(0, 3).map((mission) => (
            <div
              key={mission.id}
              className="rounded-xl border border-gray-800 bg-[#121B2D] p-3 text-xs hover:border-purple-500/40 transition"
            >
              <div className="flex items-center justify-between font-bold text-white mb-1">
                <span>{mission.skill} Blueprint</span>
                <span className="text-[10px] text-amber-400">+{mission.rewardXP} XP</span>
              </div>
              <p className="text-[10px] text-gray-400 mb-2">{mission.title}</p>
              <button
                onClick={() => onLaunchMission(mission.id)}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-purple-600/30 border border-purple-500/40 py-1.5 text-[11px] font-bold text-purple-200 hover:bg-purple-600 hover:text-white transition"
              >
                <Play className="h-3 w-3" /> Start Mission to Unlock
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Building exists on plot
  const relatedMission = missions.find((m) => m.unlocksBuildingId === building.id);

  return (
    <div className="flex flex-col h-[540px] md:h-[620px] w-full md:w-80 rounded-3xl border border-purple-500/30 bg-[#0C1222]/90 backdrop-blur-xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md"
            style={{ backgroundColor: building.colorScheme.primary }}
          >
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white line-clamp-1">{building.name}</h3>
            <span className="text-[10px] font-semibold text-cyan-400">{building.category}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Building Details Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Description */}
        <p className="text-xs text-gray-300 leading-relaxed">{building.description}</p>

        {/* Level & Upgrade Status */}
        <div className="rounded-2xl border border-gray-800 bg-[#080B14] p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-300">Building Tier</span>
            <span className="font-bold text-purple-400">
              Level {building.level} / {building.maxLevel}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
              style={{ width: `${(building.level / building.maxLevel) * 100}%` }}
            />
          </div>
        </div>

        {/* Skills Practised & Features */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Active City Features
          </h4>
          <div className="space-y-1.5">
            {building.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl border border-gray-800/80 bg-[#121B2D]/60 px-3 py-2 text-xs text-gray-200"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span className="text-[11px]">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Mission */}
        {relatedMission && (
          <div className="rounded-2xl border border-purple-500/20 bg-purple-950/10 p-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span>Primary Curriculum</span>
              <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="h-3 w-3" /> Unlocked
              </span>
            </div>
            <p className="text-[11px] text-gray-400">{relatedMission.title}</p>
            <p className="text-[10px] text-purple-300 mt-1">Skill: {relatedMission.skill}</p>
          </div>
        )}
      </div>

      {/* Footer Upgrade Button */}
      <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
        {building.level < building.maxLevel && (
          <div className="flex items-center justify-between text-[11px] px-1">
            <span className="text-gray-400">Upgrade Cost:</span>
            <span className="font-bold text-amber-300 font-mono flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-amber-400" />
              {getUpgradeCost(building)} Cr
            </span>
          </div>
        )}

        <button
          onClick={() => onUpgradeBuilding && onUpgradeBuilding(building.id)}
          disabled={building.level >= building.maxLevel}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition shadow-md ${
            building.level >= building.maxLevel
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : worldCredits < getUpgradeCost(building)
              ? 'bg-gradient-to-r from-amber-600/80 to-purple-700/80 text-white hover:brightness-110 shadow-glow-amber/20'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-glow-purple/20'
          }`}
        >
          <ArrowUpCircle className="h-4 w-4" />
          {building.level >= building.maxLevel
            ? 'Maximum Tier Reached'
            : `Upgrade to Tier ${building.level + 1} (${getUpgradeCost(building)} Cr)`}
        </button>

        {building.level < building.maxLevel && worldCredits < getUpgradeCost(building) && (
          <p className="text-[10px] text-amber-400/90 text-center font-medium">
            Requires {getUpgradeCost(building) - worldCredits} more credits to upgrade
          </p>
        )}
      </div>
    </div>
  );
};

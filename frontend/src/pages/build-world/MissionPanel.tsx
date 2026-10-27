import React, { useState } from 'react';
import { WorldMission, Building } from './worldData';
import {
  Compass,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  ChevronRight,
  Code2,
  Layers,
  ArrowRight,
  Coins,
} from 'lucide-react';

interface MissionPanelProps {
  missions: WorldMission[];
  buildings: Record<string, Building>;
  onSelectMission: (mission: WorldMission) => void;
  onLaunchMission?: (mission: WorldMission) => void;
  selectedMissionId?: string;
  worldCredits: number;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({
  missions,
  buildings,
  onSelectMission,
  onLaunchMission,
  selectedMissionId,
  worldCredits,
}) => {
  const [filterTab, setFilterTab] = useState<'available' | 'in_progress' | 'completed' | 'locked'>('available');

  const filteredMissions = missions.filter((m) => {
    if (filterTab === 'available') return m.status === 'available';
    if (filterTab === 'in_progress') return m.status === 'in_progress';
    if (filterTab === 'completed') return m.status === 'completed';
    if (filterTab === 'locked') return m.status === 'locked';
    return true;
  });

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Intermediate':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Advanced':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="flex flex-col h-[540px] md:h-[620px] w-full md:w-80 rounded-3xl border border-purple-500/20 bg-[#0C1222]/90 backdrop-blur-xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">City Directives</h2>
            <p className="text-[10px] text-gray-400">Practical Learning Missions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
            <Coins className="h-3 w-3 text-amber-400" />
            <span>{worldCredits} Cr</span>
          </div>
          <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/20">
            {missions.filter((m) => m.status === 'completed').length}/{missions.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-4 gap-1 rounded-xl bg-[#080B14] p-1 mb-3 text-[10px] font-bold">
        {(['available', 'in_progress', 'completed', 'locked'] as const).map((tab) => {
          const count = missions.filter((m) => m.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`rounded-lg py-1.5 transition capitalize flex flex-col items-center justify-center gap-0.5 ${
                filterTab === tab
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>{tab.replace('_', ' ')}</span>
              <span className="text-[8px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Mission List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {filteredMissions.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-gray-800/80 bg-[#080B14]/40">
            <Layers className="h-8 w-8 text-gray-600 mb-2" />
            <p className="text-xs font-bold text-gray-300">
              {filterTab === 'available'
                ? missions.every((m) => m.status === 'completed')
                  ? 'All Missions Mastered!'
                  : 'No missions available right now.'
                : filterTab === 'completed'
                ? 'No completed missions yet'
                : `No ${filterTab.replace('_', ' ')} missions`}
            </p>
            <p className="text-[10px] text-gray-500 mt-1 max-w-[200px]">
              {filterTab === 'available' && missions.every((m) => m.status === 'completed')
                ? 'You have completed all currently available credit missions.'
                : filterTab === 'available'
                ? 'Check back after new missions are added or complete current prerequisites.'
                : filterTab === 'locked'
                ? 'Great job! You have unlocked all available city missions.'
                : 'Complete active learning objectives to earn more City Credits.'}
            </p>
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const unlockBuilding = buildings[mission.unlocksBuildingId];
            const isSelected = selectedMissionId === mission.id;

            return (
              <div
                key={mission.id}
                onClick={() => {
                  onSelectMission(mission);
                  if (mission.status === 'available' || mission.status === 'in_progress') {
                    if (onLaunchMission) onLaunchMission(mission);
                  }
                }}
                className={`group relative rounded-2xl border p-3.5 transition cursor-pointer ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/20 shadow-glow-purple/20'
                    : mission.status === 'locked'
                    ? 'border-gray-800/70 bg-[#080B14]/60 opacity-75'
                    : mission.status === 'completed'
                    ? 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50'
                    : 'border-gray-800 bg-[#121B2D]/80 hover:border-cyan-500/40 hover:bg-[#121B2D]'
                }`}
              >
                {/* Top Badges */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300 border border-indigo-500/30">
                      {mission.skill}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${getDifficultyBadge(
                        mission.difficulty
                      )}`}
                    >
                      {mission.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{mission.duration}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                  {mission.title}
                </h3>
                <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">
                  {mission.description}
                </p>

                {/* Unlocks & Rewards Footer */}
                <div className="mt-2.5 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <span className="flex items-center gap-0.5">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      +{mission.rewardXP} XP
                    </span>
                    <span className="flex items-center gap-0.5 text-cyan-400">
                      <Coins className="h-3 w-3" />
                      +{mission.rewardCredits} Cr
                    </span>
                  </div>

                  {unlockBuilding && (
                    <div className="flex items-center gap-1 text-purple-300 text-[9px] font-medium">
                      <span>Unlocks:</span>
                      <span className="font-bold text-white underline decoration-purple-500/60">
                        {unlockBuilding.name.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="mt-2 flex items-center justify-between">
                  {mission.status === 'completed' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Mastered & Unlocked
                    </span>
                  ) : mission.status === 'locked' ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                      <Lock className="h-3.5 w-3.5 text-gray-500" />
                      Requires Prerequisite
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 group-hover:translate-x-0.5 transition">
                      Launch Mission <ArrowRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

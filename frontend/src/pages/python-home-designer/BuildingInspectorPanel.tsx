import React, { useState } from 'react';
import {
  HouseConfig,
  RoomConfig,
  FurnitureConfig,
  FloorMaterial,
  calculateHouseBudget,
} from './houseModel';
import { MISSIONS_DATA, MissionDefinition } from './missionsData';
import {
  Building2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Coins,
  ChevronDown,
  ChevronUp,
  Palette,
  Maximize2,
  Award,
  DollarSign,
  Compass,
  Armchair,
  Check,
  Lightbulb,
} from 'lucide-react';

interface BuildingInspectorPanelProps {
  house: HouseConfig;
  selectedRoom: RoomConfig | null;
  selectedFurnitureId: string | null;
  onSelectRoom: (roomId: string) => void;
  onSelectFurniture: (furnitureId: string | null) => void;
  onUpdateRoom: (room: RoomConfig) => void;
  onUpdateFurniture: (furniture: FurnitureConfig) => void;
  currentMissionId: number;
  completedMissionIds: number[];
  onSelectMission: (missionId: number) => void;
  onClaimMissionReward: (missionId: number) => void;
  output: string[];
}

const COLOR_PALETTE = [
  { name: 'Warm Ivory', hex: '#F5EBE0' },
  { name: 'Sky Blue', hex: '#E3F2FD' },
  { name: 'Lavender', hex: '#E8EAF6' },
  { name: 'Mint Green', hex: '#E8F5E9' },
  { name: 'Soft Sand', hex: '#E8DCC8' },
  { name: 'Slate Gray', hex: '#334155' },
];

const FLOOR_MATERIALS: FloorMaterial[] = ['oak', 'marble', 'tile', 'concrete', 'carpet'];

export const BuildingInspectorPanel: React.FC<BuildingInspectorPanelProps> = ({
  house,
  selectedRoom,
  selectedFurnitureId,
  onSelectRoom,
  onSelectFurniture,
  onUpdateRoom,
  onUpdateFurniture,
  currentMissionId,
  completedMissionIds,
  onSelectMission,
  onClaimMissionReward,
  output,
}) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'inspector' | 'budget'>('mission');
  const [hintLevel, setHintLevel] = useState<number>(0);

  const currentMission: MissionDefinition =
    MISSIONS_DATA.find((m) => m.id === currentMissionId) || MISSIONS_DATA[0];

  const isMissionCompleted = completedMissionIds.includes(currentMission.id);

  // Evaluate requirements for active mission
  const requirementResults = currentMission.requirements.map((req) => ({
    ...req,
    passed: req.check(house, output),
  }));

  const allRequirementsPassed = requirementResults.every((r) => r.passed);

  // Selected furniture object if any
  const selectedFurniture = house.furniture.find((f) => f.id === selectedFurnitureId) || null;

  // Calculate simulated budget breakdown
  const budget = calculateHouseBudget(house);
  const totalHouseArea = (house.width * house.depth).toFixed(1);
  const totalBuiltArea = house.rooms.reduce((acc, r) => acc + r.width * r.depth, 0).toFixed(1);

  return (
    <div className="flex flex-col h-[540px] md:h-[620px] w-full md:w-80 rounded-3xl border border-purple-500/25 bg-[#0C1222]/90 backdrop-blur-xl p-4 shadow-2xl">
      {/* Top 3-Way Tab Switcher */}
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#080B14] p-1 mb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('mission')}
          className={`rounded-lg py-2 transition flex items-center justify-center gap-1 ${
            activeTab === 'mission'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          <span>Mission</span>
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={`rounded-lg py-2 transition flex items-center justify-center gap-1 ${
            activeTab === 'inspector'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Inspector</span>
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`rounded-lg py-2 transition flex items-center justify-center gap-1 ${
            activeTab === 'budget'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <DollarSign className="h-3.5 w-3.5" />
          <span>Budget</span>
        </button>
      </div>

      {/* Tab 1: Interactive Mission */}
      {activeTab === 'mission' && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs custom-scrollbar">
          {/* Mission Selector Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Select Mission (1–7):
            </label>
            <select
              value={currentMissionId}
              onChange={(e) => {
                onSelectMission(Number(e.target.value));
                setHintLevel(0);
              }}
              className="w-full rounded-xl border border-purple-500/30 bg-[#121B2D] px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
            >
              {MISSIONS_DATA.map((m) => (
                <option key={m.id} value={m.id}>
                  {completedMissionIds.includes(m.id) ? '✓ ' : ''}Mission {m.id}: {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Mission Header Card */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-3.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 mb-1">
              <span>{currentMission.tagline}</span>
              <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-purple-300">
                {currentMission.difficulty}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{currentMission.title}</h3>
            <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
              {currentMission.description}
            </p>

            {/* Rewards Overview */}
            <div className="mt-2.5 pt-2 border-t border-purple-500/20 flex items-center justify-between font-bold text-[11px]">
              <span className="text-amber-400 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> +{currentMission.xpReward} XP
              </span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Coins className="h-3.5 w-3.5" /> +{currentMission.creditsReward} Cr
              </span>
            </div>
            <div className="mt-1 text-[10px] text-emerald-400 font-mono">
              Unlock: {currentMission.unlockedItem}
            </div>
          </div>

          {/* Requirements Checklist */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Mission Requirements:
            </h4>
            <div className="space-y-1.5">
              {requirementResults.map((req) => (
                <div
                  key={req.id}
                  className={`flex items-start gap-2 rounded-xl border p-2 text-[11px] transition ${
                    req.passed
                      ? 'border-emerald-500/30 bg-emerald-950/15 text-emerald-300'
                      : 'border-gray-800 bg-[#080B14] text-gray-400'
                  }`}
                >
                  {req.passed ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-gray-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className={req.passed ? 'font-medium' : ''}>{req.label}</span>
                    {!req.passed && (
                      <span className="block text-[9px] text-gray-500 mt-0.5">{req.hint}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Tier Progressive Hints Drawer */}
          <div className="rounded-2xl border border-gray-800 bg-[#080B14] p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-300">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                <span>Learning Hints ({hintLevel}/3)</span>
              </span>
              {hintLevel < 3 && (
                <button
                  onClick={() => setHintLevel((l) => l + 1)}
                  className="text-[10px] text-purple-400 hover:text-purple-300 underline"
                >
                  Unlock Hint
                </button>
              )}
            </div>

            {hintLevel >= 1 && (
              <p className="text-[10px] text-gray-400 border-t border-gray-800 pt-1.5 leading-relaxed">
                <strong className="text-purple-300">Hint 1:</strong> {currentMission.hints[0]}
              </p>
            )}
            {hintLevel >= 2 && (
              <p className="text-[10px] text-gray-400 border-t border-gray-800 pt-1.5 leading-relaxed">
                <strong className="text-cyan-300">Hint 2:</strong> {currentMission.hints[1]}
              </p>
            )}
            {hintLevel >= 3 && (
              <p className="text-[10px] text-gray-400 border-t border-gray-800 pt-1.5 font-mono bg-[#090D1A] p-2 rounded-lg leading-relaxed">
                <strong className="text-emerald-300">Code Snippet:</strong> {currentMission.hints[2]}
              </p>
            )}
          </div>

          {/* Claim Mission Reward Action Button */}
          {allRequirementsPassed && !isMissionCompleted && (
            <button
              onClick={() => onClaimMissionReward(currentMission.id)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 py-3 text-xs font-bold text-white shadow-glow-emerald hover:brightness-110 transition animate-pulse"
            >
              <Sparkles className="h-4 w-4" />
              <span>Claim Mission {currentMission.id} Rewards (+{currentMission.creditsReward} Cr)</span>
            </button>
          )}

          {isMissionCompleted && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Mission Completed & Rewards Claimed!</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Building & Object Inspector */}
      {activeTab === 'inspector' && (
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs custom-scrollbar">
          {/* House Footprint Specs */}
          <div className="rounded-2xl border border-gray-800 bg-[#080B14] p-3 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Architectural Overview
            </span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl border border-gray-800 bg-[#121B2D] p-2">
                <span className="block text-[10px] text-gray-400">Lot Perimeter</span>
                <span className="text-xs font-bold text-white font-mono">
                  {house.width}m × {house.depth}m
                </span>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#121B2D] p-2">
                <span className="block text-[10px] text-gray-400">Built Area</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">
                  {totalBuiltArea} m²
                </span>
              </div>
            </div>
          </div>

          {/* Selected Room Form Inspector */}
          {selectedRoom ? (
            <div className="rounded-2xl border border-purple-500/30 bg-[#121B2D]/90 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedRoom.name}</h4>
                  <span className="text-[10px] text-purple-300 font-mono">
                    id: {selectedRoom.id}
                  </span>
                </div>
                <span className="rounded-lg bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                  {(selectedRoom.width * selectedRoom.depth).toFixed(1)} m²
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-xl border border-gray-800 bg-[#080B14] p-2">
                  <span className="text-gray-400 block text-[10px]">Dimensions</span>
                  <span className="font-bold text-gray-200">
                    {selectedRoom.width}m × {selectedRoom.depth}m
                  </span>
                </div>
                <div className="rounded-xl border border-gray-800 bg-[#080B14] p-2">
                  <span className="text-gray-400 block text-[10px]">Position (X, Z)</span>
                  <span className="font-bold text-gray-200">
                    ({selectedRoom.x}, {selectedRoom.z})
                  </span>
                </div>
              </div>

              {/* Interactive Wall Color Form Control */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-bold text-gray-400 flex items-center justify-between">
                  <span>Wall Color:</span>
                  <span className="font-mono text-gray-300">{selectedRoom.wallColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_PALETTE.map((pal) => (
                    <button
                      key={pal.hex}
                      onClick={() => onUpdateRoom({ ...selectedRoom, wallColor: pal.hex })}
                      className={`h-6 w-6 rounded-full border-2 transition shadow-sm ${
                        selectedRoom.wallColor === pal.hex
                          ? 'border-cyan-400 scale-110 shadow-glow-cyan'
                          : 'border-transparent hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: pal.hex }}
                      title={pal.name}
                    />
                  ))}
                </div>
              </div>

              {/* Interactive Floor Material Form Control */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-bold text-gray-400">Floor Finish:</label>
                <div className="grid grid-cols-3 gap-1">
                  {FLOOR_MATERIALS.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => onUpdateRoom({ ...selectedRoom, floorMaterial: mat })}
                      className={`rounded-lg py-1 px-1.5 text-[10px] font-bold capitalize transition border ${
                        selectedRoom.floorMaterial === mat
                          ? 'border-cyan-400 bg-cyan-950/30 text-cyan-200'
                          : 'border-gray-800 bg-[#080B14] text-gray-400 hover:text-white'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-4">
              Click a room in the 3D simulator to inspect its physical parameters.
            </p>
          )}

          {/* Selected Furniture Object Inspector */}
          {selectedFurniture && (
            <div className="rounded-2xl border border-cyan-500/30 bg-[#121B2D]/90 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Armchair className="h-4 w-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white capitalize">
                    {selectedFurniture.item.replace('_', ' ')}
                  </h4>
                </div>
                <button
                  onClick={() => onSelectFurniture(null)}
                  className="text-[10px] text-gray-400 hover:text-white"
                >
                  Deselect
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded-lg bg-[#080B14] p-1.5 text-center">
                  <span className="text-gray-400 block">Room</span>
                  <span className="font-bold text-purple-300">{selectedFurniture.roomId}</span>
                </div>
                <div className="rounded-lg bg-[#080B14] p-1.5 text-center">
                  <span className="text-gray-400 block">Rotation</span>
                  <span className="font-bold text-cyan-300">{selectedFurniture.rotation}°</span>
                </div>
              </div>

              {/* Rotation Slider Control */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 flex justify-between">
                  <span>Rotate Item:</span>
                  <span>{selectedFurniture.rotation}°</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="45"
                  value={selectedFurniture.rotation}
                  onChange={(e) =>
                    onUpdateFurniture({
                      ...selectedFurniture,
                      rotation: Number(e.target.value),
                    })
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Quick Rooms Switcher */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Rooms In House ({house.rooms.length}):
            </h5>
            <div className="space-y-1">
              {house.rooms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onSelectRoom(r.id);
                    onSelectFurniture(null);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs transition ${
                    selectedRoom?.id === r.id
                      ? 'border-cyan-400 bg-cyan-950/20 text-white font-bold'
                      : 'border-gray-800 bg-[#080B14] text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <span>{r.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {(r.width * r.depth).toFixed(0)}m²
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Simulated Budget Tracker (Mission 7 & Cost Modeling) */}
      {activeTab === 'budget' && (
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs custom-scrollbar">
          {/* Budget Limit Card */}
          <div className="rounded-2xl border border-gray-800 bg-[#080B14] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Simulated Budget Status
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  budget.totalCost <= 15000
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {budget.totalCost <= 15000 ? 'Within Budget' : 'Over Budget!'}
              </span>
            </div>

            <div className="text-center py-2">
              <span className="text-2xl font-black text-white font-mono">
                ${budget.totalCost.toLocaleString()}
              </span>
              <span className="block text-[10px] text-gray-400 mt-0.5">
                Target Cap: $15,000 (Remaining: ${Math.max(0, 15000 - budget.totalCost).toLocaleString()})
              </span>
            </div>

            {/* Visual Budget Meter */}
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  budget.totalCost <= 15000 ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (budget.totalCost / 15000) * 100)}%` }}
              />
            </div>
          </div>

          {/* Itemized Cost Breakdown */}
          <div className="space-y-1.5">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Estimated Line Items:
            </h5>

            <div className="flex justify-between items-center p-2 rounded-xl border border-gray-800 bg-[#080B14]">
              <span className="text-gray-300">Base Framing (${totalBuiltArea}m²)</span>
              <span className="font-mono font-bold text-white">
                ${budget.constructionCost.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-xl border border-gray-800 bg-[#080B14]">
              <span className="text-gray-300">Floor Finishes</span>
              <span className="font-mono font-bold text-white">
                ${budget.materialsCost.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-xl border border-gray-800 bg-[#080B14]">
              <span className="text-gray-300">
                Doors ({house.doors.length}) & Windows ({house.windows.length})
              </span>
              <span className="font-mono font-bold text-white">
                ${budget.openingsCost.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-xl border border-gray-800 bg-[#080B14]">
              <span className="text-gray-300">Furniture Items ({house.furniture.length})</span>
              <span className="font-mono font-bold text-white">
                ${budget.furnitureCost.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-xl border border-gray-800 bg-[#080B14]">
              <span className="text-gray-300">Smart Grid & Solar Tech</span>
              <span className="font-mono font-bold text-white">
                ${budget.smartTechCost.toLocaleString()}
              </span>
            </div>
          </div>

          <p className="text-[9px] text-gray-500 leading-normal">
            * Note: All costs are simulated algorithmic estimates for educational game purposes and do not represent physical construction contractor bids.
          </p>
        </div>
      )}
    </div>
  );
};

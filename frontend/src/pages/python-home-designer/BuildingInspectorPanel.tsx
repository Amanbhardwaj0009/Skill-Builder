import React, { useState } from 'react';
import { HouseConfig, RoomConfig } from './houseModel';
import {
  Building2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Coins,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  Palette,
  Maximize2,
  Award,
} from 'lucide-react';

interface BuildingInspectorPanelProps {
  house: HouseConfig;
  selectedRoom: RoomConfig | null;
  onSelectRoom: (roomId: string) => void;
  missionCompleted: boolean;
  onClaimReward: () => void;
}

export const BuildingInspectorPanel: React.FC<BuildingInspectorPanelProps> = ({
  house,
  selectedRoom,
  onSelectRoom,
  missionCompleted,
  onClaimReward,
}) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'inspector'>('mission');
  const [hintLevel, setHintLevel] = useState<number>(0);

  // Evaluate Mission 01 Checklist
  const hasBoundary = house.width >= 10 && house.depth >= 8;
  const hasRequiredRooms =
    house.rooms.some((r) => r.id.includes('living')) &&
    house.rooms.some((r) => r.id.includes('kitchen')) &&
    house.rooms.some((r) => r.id.includes('bed'));
  const totalRoomsCount = house.rooms.length >= 3;

  const allRoomsWithinBoundary = house.rooms.every(
    (r) => r.x >= 0 && r.z >= 0 && r.x + r.width <= house.width && r.z + r.depth <= house.depth
  );

  const hasDoor = house.doors.length >= 1;
  const hasWindows = house.windows.length >= 2;

  const isAllSatisfied =
    hasBoundary && hasRequiredRooms && totalRoomsCount && allRoomsWithinBoundary && hasDoor && hasWindows;

  const totalHouseArea = (house.width * house.depth).toFixed(1);
  const totalBuiltArea = house.rooms.reduce((acc, r) => acc + r.width * r.depth, 0).toFixed(1);

  return (
    <div className="flex flex-col h-[540px] md:h-[620px] w-full md:w-80 rounded-3xl border border-purple-500/25 bg-[#0C1222]/90 backdrop-blur-xl p-4 shadow-2xl">
      {/* Top Tabs Switcher */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#080B14] p-1 mb-3 text-xs font-bold">
        <button
          onClick={() => setActiveTab('mission')}
          className={`rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
            activeTab === 'mission'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Award className="h-3.5 w-3.5" /> Mission 01
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={`rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
            activeTab === 'inspector'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" /> Room Inspector
        </button>
      </div>

      {/* Tab 1: Current Mission */}
      {activeTab === 'mission' ? (
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
          {/* Mission Header */}
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-3.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 mb-1">
              <span>PYTHON ARCHITECTURE</span>
              <span>BEGINNER</span>
            </div>
            <h3 className="text-sm font-bold text-white">Design Your First Home</h3>
            <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
              Instantiate a <code className="text-purple-300">House</code> and define a living room, kitchen, and bedroom with doors and windows.
            </p>

            {/* Rewards */}
            <div className="mt-2.5 pt-2 border-t border-purple-500/20 flex items-center justify-between font-bold text-[11px]">
              <span className="text-amber-400 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> +200 XP
              </span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Coins className="h-3.5 w-3.5" /> +150 Cr
              </span>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Mission Requirements:
            </h4>
            <div className="space-y-1.5">
              <CheckItem
                satisfied={hasBoundary}
                label={`Perimeter >= 10x8m (${house.width}x${house.depth}m)`}
              />
              <CheckItem
                satisfied={hasRequiredRooms}
                label="Include Living Room, Kitchen & Bedroom"
              />
              <CheckItem
                satisfied={totalRoomsCount}
                label={`At least 3 rooms created (${house.rooms.length}/3)`}
              />
              <CheckItem
                satisfied={allRoomsWithinBoundary}
                label="All rooms fit inside house perimeter"
              />
              <CheckItem
                satisfied={hasDoor}
                label={`At least 1 doorway placed (${house.doors.length})`}
              />
              <CheckItem
                satisfied={hasWindows}
                label={`At least 2 windows placed (${house.windows.length}/2)`}
              />
            </div>
          </div>

          {/* 3-Tier Progressive Hint Drawer */}
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
              <p className="text-[10px] text-gray-400 border-t border-gray-800 pt-1.5">
                <strong>Concept:</strong> Use <code className="text-purple-300">home = House(width, depth)</code> to establish the plot boundary.
              </p>
            )}
            {hintLevel >= 2 && (
              <p className="text-[10px] text-gray-400 border-t border-gray-800 pt-1.5">
                <strong>Syntax:</strong> Call <code className="text-cyan-300">home.add_room("bedroom", x=0, z=5, width=5, depth=4)</code> to place rooms at coordinates.
              </p>
            )}
            {hintLevel >= 3 && (
              <div className="text-[10px] text-gray-400 border-t border-gray-800 pt-1.5 font-mono bg-[#090D1A] p-2 rounded-lg">
                home.add_door("living_room", wall="south")<br />
                home.add_window("living_room", wall="south")
              </div>
            )}
          </div>

          {/* Mission Claim Button */}
          {isAllSatisfied && !missionCompleted && (
            <button
              onClick={onClaimReward}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-cyan-600 to-purple-600 py-3 text-xs font-bold text-white shadow-glow-emerald hover:brightness-110 transition animate-pulse"
            >
              <Sparkles className="h-4 w-4" />
              <span>Claim Mission Rewards (+150 Cr)</span>
            </button>
          )}

          {missionCompleted && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Mission Completed & Rewards Claimed!</span>
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Building & Room Inspector */
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Whole House Overview */}
          <div className="rounded-2xl border border-gray-800 bg-[#080B14] p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Perimeter Specs
            </span>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl border border-gray-800 bg-[#121B2D] p-2">
                <span className="block text-[10px] text-gray-400">Plot Footprint</span>
                <span className="text-xs font-bold text-white font-mono">{totalHouseArea} m²</span>
              </div>
              <div className="rounded-xl border border-gray-800 bg-[#121B2D] p-2">
                <span className="block text-[10px] text-gray-400">Built Interior</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">{totalBuiltArea} m²</span>
              </div>
            </div>
          </div>

          {/* Selected Room Details */}
          {selectedRoom ? (
            <div className="rounded-2xl border border-purple-500/30 bg-[#121B2D]/90 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedRoom.name}</h4>
                  <span className="text-[10px] text-purple-300 font-mono">id: {selectedRoom.id}</span>
                </div>
                <span className="rounded-lg bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                  {(selectedRoom.width * selectedRoom.depth).toFixed(1)} m²
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-xl border border-gray-800 bg-[#080B14] p-2">
                  <span className="text-gray-400 block">Dimensions</span>
                  <span className="font-bold text-gray-200">
                    {selectedRoom.width}m × {selectedRoom.depth}m
                  </span>
                </div>
                <div className="rounded-xl border border-gray-800 bg-[#080B14] p-2">
                  <span className="text-gray-400 block">Position (X, Z)</span>
                  <span className="font-bold text-gray-200">
                    ({selectedRoom.x}, {selectedRoom.z})
                  </span>
                </div>
              </div>

              {/* Material & Color */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Wall Color:</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-gray-700 shadow-sm"
                      style={{ backgroundColor: selectedRoom.wallColor }}
                    />
                    <span className="font-mono text-gray-200">{selectedRoom.wallColor}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Floor Material:</span>
                  <span className="font-bold text-amber-300 capitalize">
                    {selectedRoom.floorMaterial}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-6">
              Click any room in the 3D simulator to inspect its physical parameters.
            </p>
          )}

          {/* Quick Rooms Switcher */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Rooms in Layout:
            </h5>
            <div className="space-y-1.5">
              {house.rooms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onSelectRoom(r.id)}
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
    </div>
  );
};

const CheckItem: React.FC<{ satisfied: boolean; label: string }> = ({
  satisfied,
  label,
}) => (
  <div
    className={`flex items-center gap-2 rounded-xl border p-2 text-[11px] transition ${
      satisfied
        ? 'border-emerald-500/30 bg-emerald-950/10 text-emerald-300'
        : 'border-gray-800/80 bg-[#080B14] text-gray-400'
    }`}
  >
    {satisfied ? (
      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
    ) : (
      <XCircle className="h-4 w-4 text-gray-600 shrink-0" />
    )}
    <span className={satisfied ? 'font-medium' : ''}>{label}</span>
  </div>
);

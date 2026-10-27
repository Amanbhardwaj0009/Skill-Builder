import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import {
  INITIAL_PLOTS,
  INITIAL_BUILDINGS,
  INITIAL_MISSIONS,
  INITIAL_DISTRICTS,
  Plot,
  Building,
  WorldMission,
  getUpgradeCost,
} from './worldData';
import { WorldCanvas } from './WorldCanvas';
import { MissionPanel } from './MissionPanel';
import { BuildingDetailPanel } from './BuildingDetailPanel';
import { WorldHUD } from './WorldHUD';
import { InsufficientCreditsModal } from './InsufficientCreditsModal';
import { UpgradeConfirmationModal } from './UpgradeConfirmationModal';
import { UpgradeSuccessModal } from './UpgradeSuccessModal';
import { MissionActivityModal } from './MissionActivityModal';
import {
  Globe,
  Sparkles,
  ArrowLeft,
  Settings,
  Edit2,
  Check,
  Building2,
  Compass,
  Layers,
  MapPin,
  Trophy,
  Coins,
  ChevronDown,
  TrendingUp,
} from 'lucide-react';

export const BuildWorldPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // World State
  const [worldName, setWorldName] = useState<string>('Neo Developer City');
  const [isEditingName, setIsEditingName] = useState(false);
  const [worldLevel, setWorldLevel] = useState<number>(1);
  const [worldCredits, setWorldCredits] = useState<number>(250);
  const [creditsEarned, setCreditsEarned] = useState<number>(250);
  const [creditsSpent, setCreditsSpent] = useState<number>(0);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [plots, setPlots] = useState<Plot[]>(INITIAL_PLOTS);
  const [buildings, setBuildings] = useState<Record<string, Building>>(INITIAL_BUILDINGS);
  const [missions, setMissions] = useState<WorldMission[]>(INITIAL_MISSIONS);

  // Selection states
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>('plot_center');
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

  // Mobile navigation tabs
  const [activeMobileView, setActiveMobileView] = useState<'canvas' | 'missions' | 'details'>('canvas');
  const [showCreditDetails, setShowCreditDetails] = useState<boolean>(false);

  // Modals state
  const [insufficientModal, setInsufficientModal] = useState<{
    isOpen: boolean;
    buildingName: string;
    requiredCost: number;
  }>({
    isOpen: false,
    buildingName: '',
    requiredCost: 0,
  });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    building: Building | null;
  }>({
    isOpen: false,
    building: null,
  });

  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    building: Building | null;
    cost: number;
    newCredits: number;
  }>({
    isOpen: false,
    building: null,
    cost: 0,
    newCredits: 0,
  });

  const [missionModal, setMissionModal] = useState<{
    isOpen: boolean;
    mission: WorldMission | null;
  }>({
    isOpen: false,
    mission: null,
  });

  // Load from local storage for seamless persistence
  useEffect(() => {
    const savedWorld = localStorage.getItem('skillquest_world_state');
    if (savedWorld) {
      try {
        const parsed = JSON.parse(savedWorld);
        if (parsed.worldName) setWorldName(parsed.worldName);
        if (parsed.worldLevel) setWorldLevel(parsed.worldLevel);
        if (parsed.worldCredits !== undefined) setWorldCredits(parsed.worldCredits);
        if (parsed.creditsEarned !== undefined) setCreditsEarned(parsed.creditsEarned);
        if (parsed.creditsSpent !== undefined) setCreditsSpent(parsed.creditsSpent);
        if (parsed.completedMissionIds) setCompletedMissionIds(parsed.completedMissionIds);
        if (parsed.plots) setPlots(parsed.plots);
        if (parsed.buildings) setBuildings(parsed.buildings);
        if (parsed.missions) setMissions(parsed.missions);
      } catch (err) {
        console.warn('Failed to parse saved world state:', err);
      }
    }
  }, []);

  const saveWorldState = (updated: any) => {
    localStorage.setItem(
      'skillquest_world_state',
      JSON.stringify({
        worldName,
        worldLevel,
        worldCredits,
        creditsEarned,
        creditsSpent,
        completedMissionIds,
        plots,
        buildings,
        missions,
        ...updated,
      })
    );
  };

  const handleSelectPlot = (plot: Plot) => {
    setSelectedPlotId(plot.id);
    setActiveMobileView('details');
  };

  const handleSelectMission = (mission: WorldMission) => {
    setSelectedMissionId(mission.id);
    const targetPlot = plots.find((p) => p.buildingId === mission.unlocksBuildingId);
    if (targetPlot) {
      setSelectedPlotId(targetPlot.id);
    }
  };

  // Triggered when user clicks "Upgrade Structure" in details panel
  const handleInitiateUpgrade = (buildingId: string) => {
    const current = buildings[buildingId];
    if (!current || current.level >= current.maxLevel) return;

    const cost = getUpgradeCost(current);

    if (worldCredits < cost) {
      // Replaces native alert with high-polish insufficient credit modal
      setInsufficientModal({
        isOpen: true,
        buildingName: current.name,
        requiredCost: cost,
      });
      return;
    }

    // Opens confirmation dialog
    setConfirmModal({
      isOpen: true,
      building: current,
    });
  };

  // Confirmed upgrade execution: single atomic deduction & state update
  const handleConfirmUpgrade = (buildingId: string) => {
    const current = buildings[buildingId];
    if (!current || current.level >= current.maxLevel) return;

    const cost = getUpgradeCost(current);

    // Revalidate balance before processing
    if (worldCredits < cost) {
      setInsufficientModal({
        isOpen: true,
        buildingName: current.name,
        requiredCost: cost,
      });
      return;
    }

    const newCredits = worldCredits - cost;
    const newSpent = creditsSpent + cost;
    const newLevel = current.level + 1;

    const updatedBuilding: Building = {
      ...current,
      level: newLevel,
    };

    const updatedBuildings = {
      ...buildings,
      [buildingId]: updatedBuilding,
    };

    setBuildings(updatedBuildings);
    setWorldCredits(newCredits);
    setCreditsSpent(newSpent);

    saveWorldState({
      buildings: updatedBuildings,
      worldCredits: newCredits,
      creditsSpent: newSpent,
    });

    // Celebration Confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
    });

    // Open success modal
    setSuccessModal({
      isOpen: true,
      building: updatedBuilding,
      cost,
      newCredits,
    });
  };

  // Mission Completion & Reward Granting (Idempotent & Anti-Duplication)
  const handleCompleteMission = (
    missionId: string,
    rewardXP: number,
    rewardCredits: number
  ) => {
    // 1. Duplicate prevention check
    if (completedMissionIds.includes(missionId)) {
      console.warn(`Mission ${missionId} already completed. No duplicate rewards granted.`);
      return;
    }

    const updatedCompletedIds = [...completedMissionIds, missionId];
    const newCredits = worldCredits + rewardCredits;
    const newEarned = creditsEarned + rewardCredits;

    // 2. Update missions list
    const updatedMissions = missions.map((m) => {
      if (m.id === missionId) {
        return { ...m, status: 'completed' as const };
      }
      return m;
    });

    // 3. Unlock target building
    const completedMission = missions.find((m) => m.id === missionId);
    let updatedBuildings = { ...buildings };
    let updatedPlots = [...plots];

    if (completedMission && completedMission.unlocksBuildingId) {
      const bId = completedMission.unlocksBuildingId;
      if (updatedBuildings[bId]) {
        updatedBuildings[bId] = {
          ...updatedBuildings[bId],
          status: 'unlocked',
        };

        // If building is not yet placed, place it in the first open plot of its district
        const alreadyPlaced = updatedPlots.some((p) => p.buildingId === bId);
        if (!alreadyPlaced) {
          const openPlotIndex = updatedPlots.findIndex(
            (p) => !p.buildingId && !p.isLocked && p.districtId === updatedBuildings[bId].district
          );
          if (openPlotIndex !== -1) {
            updatedPlots[openPlotIndex] = {
              ...updatedPlots[openPlotIndex],
              buildingId: bId,
            };
            setSelectedPlotId(updatedPlots[openPlotIndex].id);
          } else {
            // Alternatively place on any open unlocked lot
            const anyOpenPlotIndex = updatedPlots.findIndex((p) => !p.buildingId && !p.isLocked);
            if (anyOpenPlotIndex !== -1) {
              updatedPlots[anyOpenPlotIndex] = {
                ...updatedPlots[anyOpenPlotIndex],
                buildingId: bId,
              };
              setSelectedPlotId(updatedPlots[anyOpenPlotIndex].id);
            }
          }
        }
      }
    }

    // 4. Unlock next prerequisite missions
    const finalMissions = updatedMissions.map((m) => {
      if (m.status === 'locked') {
        const allPrereqsMet = m.prerequisites.every((prereqId) =>
          updatedCompletedIds.includes(prereqId)
        );
        if (allPrereqsMet) {
          return { ...m, status: 'available' as const };
        }
      }
      return m;
    });

    // 5. Check World Level Expansion
    let newWorldLevel = worldLevel;
    if (updatedCompletedIds.length >= 2 && newWorldLevel < 2) {
      newWorldLevel = 2;
      updatedPlots = updatedPlots.map((p) =>
        p.requiredWorldLevel <= 2 ? { ...p, isLocked: false } : p
      );
    }
    if (updatedCompletedIds.length >= 4 && newWorldLevel < 3) {
      newWorldLevel = 3;
      updatedPlots = updatedPlots.map((p) =>
        p.requiredWorldLevel <= 3 ? { ...p, isLocked: false } : p
      );
    }

    // Apply state updates
    setCompletedMissionIds(updatedCompletedIds);
    setWorldCredits(newCredits);
    setCreditsEarned(newEarned);
    setMissions(finalMissions);
    setBuildings(updatedBuildings);
    setPlots(updatedPlots);
    setWorldLevel(newWorldLevel);

    saveWorldState({
      completedMissionIds: updatedCompletedIds,
      worldCredits: newCredits,
      creditsEarned: newEarned,
      missions: finalMissions,
      buildings: updatedBuildings,
      plots: updatedPlots,
      worldLevel: newWorldLevel,
    });
  };

  const selectedPlot = plots.find((p) => p.id === selectedPlotId) || null;
  const selectedBuilding = selectedPlot?.buildingId ? buildings[selectedPlot.buildingId] : null;

  const unlockedCount = Object.values(buildings).filter((b) => b.status === 'unlocked' || b.level > 0).length;
  const completedMissionsCount = completedMissionIds.length;

  return (
    <div className="space-y-4 pb-8 animate-fade-in">
      {/* A. Top Navigation Bar */}
      <header className="rounded-2xl border border-purple-500/20 bg-[#0C1222]/90 backdrop-blur-xl px-4 py-3 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Brand, Title, and Editable World Name */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-800 bg-[#121B2D] text-gray-400 hover:border-purple-500 hover:text-white transition"
              title="Return to Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-glow-purple">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">
                    SkillQuest Interactive World
                  </span>
                </div>
                {isEditingName ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="text"
                      value={worldName}
                      onChange={(e) => setWorldName(e.target.value)}
                      className="rounded-lg border border-purple-500 bg-[#080B14] px-2 py-0.5 text-xs font-bold text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        saveWorldState({ worldName });
                      }}
                      className="rounded-lg bg-purple-600 p-1 text-white hover:bg-purple-500"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-sm md:text-base font-bold text-white">{worldName}</h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-gray-400 hover:text-purple-300 transition"
                      title="Rename World"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: City Credits Indicator, Level, XP and Settings */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Prominent City Credits Resource Indicator */}
            <div className="relative">
              <button
                onClick={() => setShowCreditDetails(!showCreditDetails)}
                className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-[#121B2D] px-3 py-1.5 shadow-glow-amber/20 hover:border-amber-400 transition"
                title="City Credits Treasury (Click for breakdown)"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                  <Coins className="h-3.5 w-3.5 animate-pulse" />
                </div>
                <div className="text-left">
                  <span className="block text-[8px] font-bold uppercase text-amber-400/80 leading-none">
                    City Credits
                  </span>
                  <span className="text-xs font-bold text-amber-300 font-mono">
                    {worldCredits} Cr
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-amber-400/70" />
              </button>

              {/* Credit Breakdown Tooltip / Popover */}
              {showCreditDetails && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-amber-500/30 bg-[#0C1222] p-3 text-xs shadow-2xl backdrop-blur-xl z-40 animate-fade-in space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-1.5 font-bold text-white">
                    <span className="flex items-center gap-1.5">
                      <Coins className="h-3.5 w-3.5 text-amber-400" /> Treasury Status
                    </span>
                    <span className="text-[10px] text-amber-400">{worldCredits} Cr</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Earned (Missions):</span>
                      <span className="font-bold text-emerald-400">+{creditsEarned} Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Spent (Upgrades):</span>
                      <span className="font-bold text-rose-400">-{creditsSpent} Cr</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreditDetails(false);
                      setActiveMobileView('missions');
                    }}
                    className="w-full mt-2 rounded-lg bg-amber-600/20 border border-amber-500/30 py-1 text-[10px] font-bold text-amber-300 hover:bg-amber-600/30 transition text-center"
                  >
                    Earn More Credits →
                  </button>
                </div>
              )}
            </div>

            {/* Level & XP */}
            <div className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-[#121B2D] px-3 py-1.5 shadow-sm">
              <span className="rounded bg-gradient-to-r from-purple-500 to-cyan-400 px-1.5 py-0.5 text-[9px] font-black text-black">
                LEVEL {user?.currentLevel || 1}
              </span>
              <span className="text-xs font-bold text-purple-300 font-mono">
                {user?.currentXP || 0} XP
              </span>
            </div>

            <Link
              to="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-800 bg-[#121B2D] text-gray-400 hover:border-gray-700 hover:text-white transition"
              title="World Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-800 bg-[#121B2D] px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-700 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Featured Mode: Python Home Designer */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0C1222] via-[#121B2D] to-[#10182E] p-3.5 sm:p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-[2px] shadow-glow-cyan">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0A0E1A]">
                <Building2 className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-gradient-to-r from-cyan-400 to-purple-500 px-1.5 py-0.2 text-[8px] font-black uppercase text-black">
                  Python 3D Simulator
                </span>
                <span className="text-[10px] font-bold text-cyan-300">Live Coding Game</span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Python Home Designer</h3>
              <p className="text-[11px] text-gray-400">Write Python. Design Homes. Build Your World.</p>
            </div>
          </div>
          <Link
            to="/python-home-designer"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-glow-cyan hover:brightness-110 transition shrink-0"
          >
            <span>Enter Home Designer</span>
            <Sparkles className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden rounded-xl bg-[#0C1222] border border-gray-800 p-1 text-xs font-bold">
        <button
          onClick={() => setActiveMobileView('missions')}
          className={`flex-1 rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
            activeMobileView === 'missions'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Compass className="h-4 w-4" /> Directives
        </button>
        <button
          onClick={() => setActiveMobileView('canvas')}
          className={`flex-1 rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
            activeMobileView === 'canvas'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Globe className="h-4 w-4" /> City Canvas
        </button>
        <button
          onClick={() => setActiveMobileView('details')}
          className={`flex-1 rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
            activeMobileView === 'details'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Building2 className="h-4 w-4" /> Sector Info
        </button>
      </div>

      {/* Main 3-Column Experience (Desktop) / Tabbed (Mobile) */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* C. Left Mission Panel */}
        <div
          className={`${
            activeMobileView === 'missions' ? 'block' : 'hidden'
          } md:block shrink-0`}
        >
          <MissionPanel
            missions={missions}
            buildings={buildings}
            onSelectMission={handleSelectMission}
            onLaunchMission={(mission) =>
              setMissionModal({
                isOpen: true,
                mission,
              })
            }
            selectedMissionId={selectedMissionId || undefined}
            worldCredits={worldCredits}
          />
        </div>

        {/* B. Main City Canvas */}
        <div
          className={`${
            activeMobileView === 'canvas' ? 'block' : 'hidden'
          } md:block flex-1`}
        >
          <WorldCanvas
            plots={plots}
            buildings={buildings}
            selectedPlotId={selectedPlotId}
            onSelectPlot={handleSelectPlot}
            worldLevel={worldLevel}
          />
        </div>

        {/* D. Right Building Information Panel */}
        <div
          className={`${
            activeMobileView === 'details' ? 'block' : 'hidden'
          } md:block shrink-0`}
        >
          <BuildingDetailPanel
            selectedPlot={selectedPlot}
            building={selectedBuilding}
            missions={missions}
            onClose={() => setSelectedPlotId(null)}
            onLaunchMission={(mId) => {
              const mission = missions.find((m) => m.id === mId);
              if (mission) {
                setMissionModal({
                  isOpen: true,
                  mission,
                });
              }
            }}
            onUpgradeBuilding={handleInitiateUpgrade}
            worldCredits={worldCredits}
          />
        </div>
      </div>

      {/* E. Bottom World HUD */}
      <WorldHUD
        worldLevel={worldLevel}
        currentXP={user?.currentXP || 150}
        nextLevelXP={500}
        worldCredits={worldCredits}
        unlockedBuildingsCount={unlockedCount}
        totalBuildingsCount={Object.keys(buildings).length}
        completedMissionsCount={completedMissionsCount}
        totalMissionsCount={missions.length}
        nextMilestone={
          worldLevel === 1
            ? 'Complete 2 missions to unlock Sector L2'
            : worldLevel === 2
            ? 'Complete 4 missions to unlock Data & AI Sector L3'
            : 'Metropolis Core at Peak Optimization'
        }
      />

      {/* Modals */}
      {/* 1. Insufficient City Credits Modal */}
      <InsufficientCreditsModal
        isOpen={insufficientModal.isOpen}
        onClose={() => setInsufficientModal({ ...insufficientModal, isOpen: false })}
        availableCredits={worldCredits}
        requiredCredits={insufficientModal.requiredCost}
        buildingName={insufficientModal.buildingName}
        onEarnCredits={() => {
          setActiveMobileView('missions');
          setSelectedPlotId(null);
        }}
      />

      {/* 2. Upgrade Confirmation Modal */}
      <UpgradeConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        building={confirmModal.building}
        availableCredits={worldCredits}
        onConfirmUpgrade={handleConfirmUpgrade}
      />

      {/* 3. Upgrade Success Modal */}
      <UpgradeSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        building={successModal.building}
        cost={successModal.cost}
        newCredits={successModal.newCredits}
      />

      {/* 4. Interactive Mission Workspace Modal */}
      <MissionActivityModal
        isOpen={missionModal.isOpen}
        onClose={() => setMissionModal({ ...missionModal, isOpen: false })}
        mission={missionModal.mission}
        building={
          missionModal.mission
            ? buildings[missionModal.mission.unlocksBuildingId] || null
            : null
        }
        onCompleteMission={handleCompleteMission}
      />
    </div>
  );
};

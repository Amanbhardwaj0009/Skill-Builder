import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  INITIAL_PLOTS,
  INITIAL_BUILDINGS,
  INITIAL_MISSIONS,
  INITIAL_DISTRICTS,
  Plot,
  Building,
  WorldMission,
} from './worldData';
import { WorldCanvas } from './WorldCanvas';
import { MissionPanel } from './MissionPanel';
import { BuildingDetailPanel } from './BuildingDetailPanel';
import { WorldHUD } from './WorldHUD';
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
} from 'lucide-react';

export const BuildWorldPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // World State
  const [worldName, setWorldName] = useState<string>('Neo Developer City');
  const [isEditingName, setIsEditingName] = useState(false);
  const [worldLevel, setWorldLevel] = useState<number>(1);
  const [worldCredits, setWorldCredits] = useState<number>(250);
  const [plots, setPlots] = useState<Plot[]>(INITIAL_PLOTS);
  const [buildings, setBuildings] = useState<Record<string, Building>>(INITIAL_BUILDINGS);
  const [missions, setMissions] = useState<WorldMission[]>(INITIAL_MISSIONS);

  // Selection states
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>('plot_center');
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

  // Mobile navigation tabs
  const [activeMobileView, setActiveMobileView] = useState<'canvas' | 'missions' | 'details'>('canvas');

  // Load from local storage for seamless Phase 1 persistence
  useEffect(() => {
    const savedWorld = localStorage.getItem('skillquest_world_state');
    if (savedWorld) {
      try {
        const parsed = JSON.parse(savedWorld);
        if (parsed.worldName) setWorldName(parsed.worldName);
        if (parsed.worldLevel) setWorldLevel(parsed.worldLevel);
        if (parsed.worldCredits) setWorldCredits(parsed.worldCredits);
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
    // If the mission unlocks a building, also highlight that building or its plot
    const targetPlot = plots.find((p) => p.buildingId === mission.unlocksBuildingId);
    if (targetPlot) {
      setSelectedPlotId(targetPlot.id);
    }
  };

  const handleUpgradeBuilding = (buildingId: string) => {
    if (worldCredits < 100) {
      alert('Insufficient City Credits! Complete missions to earn more credits.');
      return;
    }
    const current = buildings[buildingId];
    if (!current || current.level >= current.maxLevel) return;

    const updatedBuildings = {
      ...buildings,
      [buildingId]: {
        ...current,
        level: current.level + 1,
      },
    };
    const newCredits = worldCredits - 100;
    setBuildings(updatedBuildings);
    setWorldCredits(newCredits);
    saveWorldState({ buildings: updatedBuildings, worldCredits: newCredits });
  };

  const selectedPlot = plots.find((p) => p.id === selectedPlotId) || null;
  const selectedBuilding = selectedPlot?.buildingId ? buildings[selectedPlot.buildingId] : null;

  const unlockedCount = Object.values(buildings).filter((b) => b.status === 'unlocked' || b.level > 0).length;
  const completedMissionsCount = missions.filter((m) => m.status === 'completed').length;

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

          {/* Right: Student Level, XP and Settings */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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
            selectedMissionId={selectedMissionId || undefined}
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
              if (mission) handleSelectMission(mission);
            }}
            onUpgradeBuilding={handleUpgradeBuilding}
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
        nextMilestone="Unlock Smart City Infrastructure (Level 2)"
      />
    </div>
  );
};

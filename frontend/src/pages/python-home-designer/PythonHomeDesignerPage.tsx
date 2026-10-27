import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { HouseConfig, RoomConfig, FurnitureConfig, DEFAULT_HOUSE } from './houseModel';
import { executePythonCode, initPyodide } from './pythonRuntime';
import { PythonCodeEditor } from './PythonCodeEditor';
import { LiveHouseSimulator3D } from './LiveHouseSimulator3D';
import { BuildingInspectorPanel } from './BuildingInspectorPanel';
import { MISSIONS_DATA } from './missionsData';
import {
  ArrowLeft,
  Coins,
  Sparkles,
  Save,
  Check,
  Edit2,
  Code2,
  Building2,
  Award,
  Layers,
  FilePlus,
  FolderOpen,
} from 'lucide-react';

export const PythonHomeDesignerPage: React.FC = () => {
  const { user } = useAuth();

  // Project and Code State
  const [projectName, setProjectName] = useState<string>('My Solar Villa');
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentMissionId, setCurrentMissionId] = useState<number>(1);
  const [code, setCode] = useState<string>(MISSIONS_DATA[0].starterCode);
  const [house, setHouse] = useState<HouseConfig>(DEFAULT_HOUSE);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('living_room');
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  const [isFloorPlanView, setIsFloorPlanView] = useState<boolean>(false);

  // Execution & Terminal State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [output, setOutput] = useState<string[]>([
    'Python 3.11 Runtime Initialized.',
    'skillquest_house API imported and ready.',
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | undefined>(undefined);

  // Mission & Rewards State
  const [completedMissionIds, setCompletedMissionIds] = useState<number[]>([]);
  const [worldCredits, setWorldCredits] = useState<number>(250);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // Mobile View Tabs
  const [mobileView, setMobileView] = useState<'editor' | 'preview' | 'inspector'>('preview');

  // Load saved project & credits on mount
  useEffect(() => {
    initPyodide();

    const savedWorld = localStorage.getItem('skillquest_world_state');
    if (savedWorld) {
      try {
        const parsed = JSON.parse(savedWorld);
        if (parsed.worldCredits !== undefined) setWorldCredits(parsed.worldCredits);
      } catch (e) {}
    }

    const savedMissions = localStorage.getItem('skillquest_home_completed_missions');
    if (savedMissions) {
      try {
        setCompletedMissionIds(JSON.parse(savedMissions));
      } catch (e) {}
    }

    const savedProject = localStorage.getItem('skillquest_home_project');
    if (savedProject) {
      try {
        const parsed = JSON.parse(savedProject);
        if (parsed.projectName) setProjectName(parsed.projectName);
        if (parsed.code) setCode(parsed.code);
        if (parsed.house) setHouse(parsed.house);
        if (parsed.currentMissionId) setCurrentMissionId(parsed.currentMissionId);
      } catch (e) {}
    }
  }, []);

  // Save Project
  const handleSaveProject = () => {
    localStorage.setItem(
      'skillquest_home_project',
      JSON.stringify({
        projectName,
        code,
        house,
        currentMissionId,
        updatedAt: new Date().toISOString(),
      })
    );
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // New Project
  const handleNewProject = () => {
    if (window.confirm('Start a new home design project? Any unsaved changes will be reset.')) {
      setProjectName('Modern Eco Residence');
      const mission = MISSIONS_DATA.find((m) => m.id === currentMissionId) || MISSIONS_DATA[0];
      setCode(mission.starterCode);
      setHouse(DEFAULT_HOUSE);
      setSelectedRoomId('living_room');
      setSelectedFurnitureId(null);
      setOutput(['New project created.', 'Ready to execute Python design.']);
      setErrors([]);
      setWarnings([]);
    }
  };

  // Run Python Code
  const handleRunCode = async () => {
    setIsRunning(true);
    setErrors([]);
    setWarnings([]);

    try {
      const res = await executePythonCode(code);
      setOutput(res.output);
      setErrors(res.errors);
      setWarnings(res.warnings);
      setExecutionTimeMs(res.executionTimeMs);

      if (res.success && res.house.rooms.length > 0) {
        setHouse(res.house);
        // If selected room is no longer in house, select first
        if (!res.house.rooms.some((r) => r.id === selectedRoomId)) {
          setSelectedRoomId(res.house.rooms[0]?.id || null);
        }
      }
    } catch (err: any) {
      setErrors([err.message || 'Execution error occurred.']);
    } finally {
      setIsRunning(false);
    }
  };

  // Switch Mission
  const handleSelectMission = (missionId: number) => {
    setCurrentMissionId(missionId);
    const targetMission = MISSIONS_DATA.find((m) => m.id === missionId);
    if (targetMission) {
      // Offer user to load mission starter code
      const wantsTemplate = window.confirm(
        `Load starter template for Mission ${missionId}: ${targetMission.title}?`
      );
      if (wantsTemplate) {
        setCode(targetMission.starterCode);
      }
    }
  };

  // Claim Mission Reward (Idempotent per Mission)
  const handleClaimMissionReward = (missionId: number) => {
    if (completedMissionIds.includes(missionId)) return;

    const mission = MISSIONS_DATA.find((m) => m.id === missionId);
    if (!mission) return;

    const newCompleted = [...completedMissionIds, missionId];
    setCompletedMissionIds(newCompleted);
    localStorage.setItem('skillquest_home_completed_missions', JSON.stringify(newCompleted));

    const newCredits = worldCredits + mission.creditsReward;
    setWorldCredits(newCredits);

    // Save to world state
    const savedWorld = localStorage.getItem('skillquest_world_state');
    const existing = savedWorld ? JSON.parse(savedWorld) : {};
    localStorage.setItem(
      'skillquest_world_state',
      JSON.stringify({
        ...existing,
        worldCredits: newCredits,
        creditsEarned: (existing.creditsEarned || 250) + mission.creditsReward,
      })
    );

    handleSaveProject();

    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  // Update room properties from inspector (Bidirectional)
  const handleUpdateRoom = (updatedRoom: RoomConfig) => {
    setHouse((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) => (r.id === updatedRoom.id ? updatedRoom : r)),
    }));
  };

  // Update furniture properties from inspector
  const handleUpdateFurniture = (updatedFurn: FurnitureConfig) => {
    setHouse((prev) => ({
      ...prev,
      furniture: prev.furniture.map((f) => (f.id === updatedFurn.id ? updatedFurn : f)),
    }));
  };

  const selectedRoom = house.rooms.find((r) => r.id === selectedRoomId) || null;

  return (
    <div className="space-y-4 pb-8 animate-fade-in select-none">
      {/* Top Navigation Bar */}
      <header className="rounded-2xl border border-purple-500/20 bg-[#0C1222]/90 backdrop-blur-xl px-4 py-3 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Back Link & Project Name */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/build-world"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-800 bg-[#121B2D] text-gray-400 hover:border-purple-500 hover:text-white transition"
              title="Return to City World"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-glow-cyan p-[2px]">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0A0E1A]">
                  <Building2 className="h-5 w-5 text-cyan-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                    Python Home Designer
                  </span>
                  <span className="rounded bg-gradient-to-r from-purple-500 to-cyan-400 px-1.5 py-0.2 text-[8px] font-black text-black uppercase">
                    3D Studio
                  </span>
                </div>

                {isEditingName ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="rounded-lg border border-cyan-500 bg-[#080B14] px-2 py-0.5 text-xs font-bold text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => setIsEditingName(false)}
                      className="rounded-lg bg-cyan-600 p-1 text-white hover:bg-cyan-500"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-sm font-bold text-white">{projectName}</h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-gray-400 hover:text-cyan-300 transition"
                      title="Rename Project"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Actions, City Credits, Level, Save Button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* New Project Button */}
            <button
              onClick={handleNewProject}
              className="hidden lg:flex items-center gap-1 rounded-xl border border-gray-800 bg-[#121B2D] px-2.5 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition"
              title="Start New Project"
            >
              <FilePlus className="h-3.5 w-3.5 text-purple-400" />
              <span>New</span>
            </button>

            {/* City Credits Resource Badge */}
            <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 shadow-sm">
              <Coins className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>{worldCredits} Cr</span>
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

            {/* Save Project Button */}
            <button
              onClick={handleSaveProject}
              className="flex items-center gap-1.5 rounded-xl border border-gray-800 bg-[#121B2D] px-3 py-1.5 text-xs font-bold text-gray-300 hover:border-purple-500 hover:text-white transition"
              title="Save Project Locally"
            >
              <Save className="h-3.5 w-3.5 text-cyan-400" />
              <span>{saveToast ? 'Saved!' : 'Save'}</span>
            </button>

            <Link
              to="/build-world"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-800 bg-[#121B2D] px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition"
            >
              City World
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Mode Switcher */}
      <div className="flex md:hidden rounded-xl bg-[#0C1222] border border-gray-800 p-1 text-xs font-bold">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
            mobileView === 'editor' ? 'bg-purple-600 text-white' : 'text-gray-400'
          }`}
        >
          <Code2 className="h-4 w-4" /> Python Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
            mobileView === 'preview' ? 'bg-purple-600 text-white' : 'text-gray-400'
          }`}
        >
          <Building2 className="h-4 w-4" /> 3D House
        </button>
        <button
          onClick={() => setMobileView('inspector')}
          className={`flex-1 rounded-lg py-2 transition flex items-center justify-center gap-1.5 ${
            mobileView === 'inspector' ? 'bg-purple-600 text-white' : 'text-gray-400'
          }`}
        >
          <Award className="h-4 w-4" /> Mission & Specs
        </button>
      </div>

      {/* Main 3-Connected-Panels Desktop Experience */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT PANEL: Python Code Editor */}
        <div
          className={`${
            mobileView === 'editor' ? 'block' : 'hidden'
          } md:block shrink-0`}
        >
          <PythonCodeEditor
            code={code}
            onChangeCode={setCode}
            onRunCode={handleRunCode}
            onResetCode={() => {
              const mission = MISSIONS_DATA.find((m) => m.id === currentMissionId) || MISSIONS_DATA[0];
              setCode(mission.starterCode);
            }}
            isRunning={isRunning}
            output={output}
            errors={errors}
            warnings={warnings}
            executionTimeMs={executionTimeMs}
            currentMissionId={currentMissionId}
          />
        </div>

        {/* CENTRE PANEL: Live 3D Home Simulator */}
        <div
          className={`${
            mobileView === 'preview' ? 'block' : 'hidden'
          } md:block flex-1`}
        >
          <LiveHouseSimulator3D
            house={house}
            selectedRoomId={selectedRoomId}
            selectedFurnitureId={selectedFurnitureId}
            onSelectRoom={(id) => {
              setSelectedRoomId(id);
              setSelectedFurnitureId(null);
              setMobileView('inspector');
            }}
            onSelectFurniture={(id) => {
              setSelectedFurnitureId(id);
              setMobileView('inspector');
            }}
            isFloorPlanView={isFloorPlanView}
            onToggleFloorPlan={() => setIsFloorPlanView(!isFloorPlanView)}
          />
        </div>

        {/* RIGHT PANEL: Building Inspector & Current Mission */}
        <div
          className={`${
            mobileView === 'inspector' ? 'block' : 'hidden'
          } md:block shrink-0`}
        >
          <BuildingInspectorPanel
            house={house}
            selectedRoom={selectedRoom}
            selectedFurnitureId={selectedFurnitureId}
            onSelectRoom={setSelectedRoomId}
            onSelectFurniture={setSelectedFurnitureId}
            onUpdateRoom={handleUpdateRoom}
            onUpdateFurniture={handleUpdateFurniture}
            currentMissionId={currentMissionId}
            completedMissionIds={completedMissionIds}
            onSelectMission={handleSelectMission}
            onClaimMissionReward={handleClaimMissionReward}
            output={output}
          />
        </div>
      </div>
    </div>
  );
};

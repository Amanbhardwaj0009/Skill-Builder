import React, { useState, useRef } from 'react';
import { Plot, Building } from './worldData';
import { ZoomIn, ZoomOut, Maximize2, Lock, Sparkles, Building2, Trees, Compass } from 'lucide-react';

interface WorldCanvasProps {
  plots: Plot[];
  buildings: Record<string, Building>;
  selectedPlotId: string | null;
  onSelectPlot: (plot: Plot) => void;
  worldLevel: number;
}

export const WorldCanvas: React.FC<WorldCanvasProps> = ({
  plots,
  buildings,
  selectedPlotId,
  onSelectPlot,
  worldLevel,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on canvas background, not when clicking on building buttons
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'svg' || (e.target as HTMLElement).id === 'canvas-bg') {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Convert gridX, gridY to isometric coordinates
  // grid spacing
  const tileW = 160;
  const tileH = 80;
  const originX = 450;
  const originY = 160;

  const toIso = (gx: number, gy: number) => {
    const isoX = originX + (gx - gy) * (tileW / 2);
    const isoY = originY + (gx + gy) * (tileH / 2);
    return { x: isoX, y: isoY };
  };

  return (
    <div
      className="relative flex-1 w-full h-[540px] md:h-[620px] rounded-3xl border border-purple-500/20 bg-[#090D1A] overflow-hidden shadow-2xl shadow-purple-950/30 select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Subtle atmospheric city grid background & nebula glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/30 via-[#0A0E1D] to-[#060811]" />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

      {/* Grid Canvas Overlay info */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-[#121B2D]/80 px-3 py-1.5 backdrop-blur-md">
          <Compass className="h-4 w-4 text-cyan-400 animate-spin-slow" />
          <span className="text-xs font-bold text-gray-200">Genesis Metropolis Grid</span>
          <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-300">
            Sector L{worldLevel}
          </span>
        </div>
      </div>

      {/* Floating Zoom / Reset HUD */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-2xl border border-gray-800 bg-[#121B2D]/90 p-1.5 backdrop-blur-md shadow-xl">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.15, 1.8))}
          className="rounded-xl p-2 text-gray-400 hover:bg-purple-600/20 hover:text-white transition"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <span className="px-2 text-xs font-mono font-bold text-gray-300">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.65))}
          className="rounded-xl p-2 text-gray-400 hover:bg-purple-600/20 hover:text-white transition"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <div className="h-4 w-[1px] bg-gray-800 mx-0.5" />
        <button
          onClick={resetView}
          className="rounded-xl p-2 text-gray-400 hover:bg-purple-600/20 hover:text-white transition"
          title="Reset Position"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* Interactive Isometric SVG Canvas */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <svg
          id="canvas-bg"
          viewBox="0 0 920 620"
          className="w-full h-full max-w-[920px] max-h-[620px] overflow-visible drop-shadow-2xl"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="plotGrass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="plotActiveGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#182234" />
              <stop offset="100%" stopColor="#0B1324" />
            </linearGradient>
            <linearGradient id="fountainWater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Isometric Base Ground Foundation */}
          <polygon
            points="450,40 850,240 450,440 50,240"
            fill="#0D1322"
            stroke="#2E3C56"
            strokeWidth="3"
            opacity="0.85"
          />
          {/* Foundation Depth Wall */}
          <polygon
            points="50,240 450,440 450,460 50,260"
            fill="#090E18"
            stroke="#1E293B"
            strokeWidth="2"
          />
          <polygon
            points="450,440 850,240 850,260 450,460"
            fill="#060911"
            stroke="#1E293B"
            strokeWidth="2"
          />

          {/* Futuristic Connecting Road Network */}
          <g stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6">
            <line x1="450" y1="80" x2="450" y2="400" />
            <line x1="130" y1="240" x2="770" y2="240" />
          </g>
          {/* Glowing Road Arteries */}
          <polygon
            points="440,55 460,55 460,425 440,425"
            fill="url(#roadGrad)"
            stroke="#38BDF8"
            strokeWidth="0.5"
            opacity="0.7"
          />
          <polygon
            points="65,235 835,235 835,245 65,245"
            fill="url(#roadGrad)"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            opacity="0.7"
          />

          {/* Central Town Square Base Feature (Plaza fountain & monument) */}
          <g transform="translate(450, 240)">
            {/* Plaza Stone Ring */}
            <ellipse cx="0" cy="0" rx="48" ry="24" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <ellipse cx="0" cy="0" rx="36" ry="18" fill="url(#fountainWater)" opacity="0.8" />
            {/* Holographic Center Obelisk */}
            <polygon
              points="0,-36 8,-8 0,6 -8,-8"
              fill="url(#plotActiveGlow)"
              stroke="#38BDF8"
              strokeWidth="1.5"
              filter="url(#neonGlow)"
            />
            {/* Animated pulsating wave */}
            <ellipse
              cx="0"
              cy="0"
              rx="28"
              ry="14"
              fill="none"
              stroke="#A855F7"
              strokeWidth="1"
              strokeDasharray="4 2"
              className="animate-pulse"
            />
          </g>

          {/* Render All 9 Grid Plots */}
          {plots.map((plot) => {
            const { x, y } = toIso(plot.gridX, plot.gridY);
            const isSelected = selectedPlotId === plot.id;
            const building = plot.buildingId ? buildings[plot.buildingId] : null;

            // Plot base diamond points relative to (x, y)
            const pTop = `${x},${y - tileH / 2}`;
            const pRight = `${x + tileW / 2},${y}`;
            const pBottom = `${x},${y + tileH / 2}`;
            const pLeft = `${x - tileW / 2},${y}`;
            const diamondPoints = `${pTop} ${pRight} ${pBottom} ${pLeft}`;

            return (
              <g
                key={plot.id}
                className="cursor-pointer transition-all duration-200 group"
                onClick={() => onSelectPlot(plot)}
              >
                {/* Ground Tile Diamond */}
                <polygon
                  points={diamondPoints}
                  fill={
                    isSelected
                      ? 'url(#plotActiveGlow)'
                      : plot.isLocked
                      ? '#0B0F19'
                      : 'url(#plotGrass)'
                  }
                  stroke={
                    isSelected
                      ? '#38BDF8'
                      : plot.isLocked
                      ? '#334155'
                      : '#6366F1'
                  }
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  strokeDasharray={plot.isLocked ? '4 3' : undefined}
                  className="transition group-hover:brightness-125"
                />

                {/* Plot Selection Pulse Glow */}
                {isSelected && (
                  <polygon
                    points={diamondPoints}
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="3"
                    filter="url(#neonGlow)"
                  />
                )}

                {/* Empty Unlocked Plot State */}
                {!building && !plot.isLocked && (
                  <g transform={`translate(${x}, ${y})`}>
                    <circle cx="0" cy="0" r="14" fill="#1E293B" stroke="#6366F1" strokeWidth="1.5" />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#818CF8"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      +
                    </text>
                    <text
                      x="0"
                      y="26"
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="9"
                      fontWeight="bold"
                      className="tracking-wider uppercase"
                    >
                      Build Plot
                    </text>
                  </g>
                )}

                {/* Locked Plot State */}
                {plot.isLocked && (
                  <g transform={`translate(${x}, ${y})`}>
                    <circle cx="0" cy="0" r="14" fill="#18181B" stroke="#64748B" strokeWidth="1.5" />
                    {/* Padlock shape */}
                    <path
                      d="M -5 -1 L -5 -5 A 5 5 0 0 1 5 -5 L 5 -1 L 7 -1 L 7 6 L -7 6 L -7 -1 Z"
                      fill="#E2E8F0"
                      stroke="#475569"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="24"
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      Level {plot.requiredWorldLevel}
                    </text>
                  </g>
                )}

                {/* Building Render (When constructed) */}
                {building && (
                  <g transform={`translate(${x}, ${y})`}>
                    {/* Isometric Building Structure */}
                    {/* Shadow underneath */}
                    <ellipse cx="0" cy="14" rx="35" ry="16" fill="#000000" opacity="0.6" />

                    {/* Left Wall */}
                    <polygon
                      points="-30,6 0,20 0,-42 -30,-56"
                      fill={building.colorScheme.secondary}
                      stroke="#0F172A"
                      strokeWidth="1"
                    />
                    {/* Right Wall */}
                    <polygon
                      points="0,20 30,6 30,-56 0,-42"
                      fill={building.colorScheme.primary}
                      stroke="#0F172A"
                      strokeWidth="1"
                    />
                    {/* Roof Diamond */}
                    <polygon
                      points="0,-72 30,-56 0,-42 -30,-56"
                      fill={building.colorScheme.accent}
                      stroke="#FFFFFF"
                      strokeWidth="1"
                    />

                    {/* Glowing Architectural Windows (Left wall) */}
                    <polygon
                      points="-22,-44 -8,-36 -8,-24 -22,-32"
                      fill={building.colorScheme.glow}
                      stroke="#FFFFFF"
                      strokeWidth="0.5"
                    />
                    <polygon
                      points="-22,-18 -8,-10 -8,-2 -22,-10"
                      fill={building.colorScheme.glow}
                      stroke="#FFFFFF"
                      strokeWidth="0.5"
                    />

                    {/* Glowing Architectural Windows (Right wall) */}
                    <polygon
                      points="8,-36 22,-44 22,-32 8,-24"
                      fill={building.colorScheme.glow}
                      stroke="#FFFFFF"
                      strokeWidth="0.5"
                    />
                    <polygon
                      points="8,-10 22,-18 22,-10 8,-2"
                      fill={building.colorScheme.glow}
                      stroke="#FFFFFF"
                      strokeWidth="0.5"
                    />

                    {/* Rooftop Antenna Spire with blinking LED */}
                    <line x1="0" y1="-72" x2="0" y2="-92" stroke="#E2E8F0" strokeWidth="2" />
                    <circle
                      cx="0"
                      cy="-92"
                      r="3.5"
                      fill="#38BDF8"
                      filter="url(#neonGlow)"
                      className="animate-pulse"
                    />

                    {/* Building Name Pill Floating Above */}
                    <g transform="translate(0, -106)">
                      <rect
                        x="-48"
                        y="-10"
                        width="96"
                        height="20"
                        rx="10"
                        fill="#0F172A"
                        stroke={building.colorScheme.primary}
                        strokeWidth="1.5"
                        opacity="0.9"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#F8FAFC"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {building.name.length > 14
                          ? building.name.substring(0, 12) + '..'
                          : building.name}
                      </text>
                    </g>

                    {/* Level Pill Badge */}
                    <g transform="translate(32, -42)">
                      <circle cx="0" cy="0" r="9" fill="#1E1B4B" stroke="#8B5CF6" strokeWidth="1.5" />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="#C4B5FD"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        L{building.level}
                      </text>
                    </g>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

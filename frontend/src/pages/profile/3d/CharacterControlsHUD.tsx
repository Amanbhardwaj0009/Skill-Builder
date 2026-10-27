import React from 'react';
import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Hand,
  Sparkles,
  Footprints,
  Zap,
  Smile,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { CharacterAnimationName } from './AnimatedCharacter';

interface CharacterControlsHUDProps {
  currentAnimation: CharacterAnimationName;
  onSetAnimation: (anim: CharacterAnimationName) => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetCamera: () => void;
  interactiveDialogue?: string | null;
  studentName?: string;
  careerName?: string;
}

export const CharacterControlsHUD: React.FC<CharacterControlsHUDProps> = ({
  currentAnimation,
  onSetAnimation,
  onRotateLeft,
  onRotateRight,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  interactiveDialogue,
  studentName = 'Alex',
  careerName = 'Manufacturing Engineer',
}) => {
  return (
    <div className="absolute bottom-2 inset-x-0 z-20 flex flex-col items-center pointer-events-none px-4">
      {/* Interactive Dialogue Speech Bubble (if active) */}
      {interactiveDialogue && (
        <div className="pointer-events-auto mb-3 max-w-md rounded-2xl border border-cyan-400/50 bg-[#0C1222]/95 px-4 py-2.5 shadow-glow-cyan backdrop-blur-xl animate-fade-in text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-0.5">
            <Sparkles className="h-3 w-3" />
            <span>
              {studentName} • {careerName}
            </span>
          </div>
          <p className="text-xs font-semibold text-white leading-relaxed">
            "{interactiveDialogue}"
          </p>
        </div>
      )}

      {/* Floating Control HUD Bar */}
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-purple-500/30 bg-[#0C1222]/90 p-2 backdrop-blur-xl shadow-2xl">
        {/* Camera Control Group */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-800">
          <button
            onClick={onRotateLeft}
            className="rounded-xl p-2 text-gray-400 hover:bg-purple-600/20 hover:text-white transition"
            title="Rotate Left"
            aria-label="Rotate camera left"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onRotateRight}
            className="rounded-xl p-2 text-gray-400 hover:bg-purple-600/20 hover:text-white transition"
            title="Rotate Right"
            aria-label="Rotate camera right"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            onClick={onZoomIn}
            className="rounded-xl p-2 text-gray-400 hover:bg-purple-600/20 hover:text-white transition"
            title="Zoom In"
            aria-label="Zoom in camera"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={onZoomOut}
            className="rounded-xl p-2 text-gray-400 hover:bg-purple-600/20 hover:text-white transition"
            title="Zoom Out"
            aria-label="Zoom out camera"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={onResetCamera}
            className="rounded-xl p-2 text-gray-400 hover:bg-purple-600/20 hover:text-white transition"
            title="Reset Framing"
            aria-label="Reset camera framing"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Animation Actions Group */}
        <div className="flex items-center gap-1.5 pl-1">
          {/* Idle (Loop) */}
          <button
            onClick={() => onSetAnimation('idle')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
              currentAnimation === 'idle'
                ? 'bg-purple-600 text-white shadow-glow-purple/40'
                : 'text-gray-400 hover:bg-[#121B2D] hover:text-white'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Idle</span>
          </button>

          {/* Greeting / Agree Action */}
          <button
            onClick={() => onSetAnimation('agree')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
              currentAnimation === 'agree'
                ? 'bg-cyan-600 text-white shadow-glow-cyan/40'
                : 'text-gray-400 hover:bg-[#121B2D] hover:text-white'
            }`}
            title="Play Friendly Affirmation / Greeting"
          >
            <Hand className="h-3.5 w-3.5 text-cyan-400" />
            <span>Greeting</span>
          </button>

          {/* Walk Motion */}
          <button
            onClick={() => onSetAnimation('walk')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
              currentAnimation === 'walk'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-gray-400 hover:bg-[#121B2D] hover:text-white'
            }`}
            title="Play Walking Locomotion"
          >
            <Footprints className="h-3.5 w-3.5 text-amber-400" />
            <span>Walk</span>
          </button>

          {/* Run / Sprint Action */}
          <button
            onClick={() => onSetAnimation('run')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
              currentAnimation === 'run'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-gray-400 hover:bg-[#121B2D] hover:text-white'
            }`}
            title="Play Sprint Locomotion"
          >
            <Zap className="h-3.5 w-3.5 text-rose-400" />
            <span>Sprint</span>
          </button>

          {/* Emote / Head Shake */}
          <button
            onClick={() => onSetAnimation('headShake')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
              currentAnimation === 'headShake'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:bg-[#121B2D] hover:text-white'
            }`}
            title="Play Emote Head Shake"
          >
            <Smile className="h-3.5 w-3.5 text-emerald-400" />
            <span>Emote</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { WorldMission, Building, MISSION_STARTERS } from './worldData';
import {
  Code2,
  Sparkles,
  Coins,
  CheckCircle2,
  XCircle,
  X,
  Play,
  RotateCcw,
  Check,
  Building2,
  ShieldAlert,
  Lightbulb,
} from 'lucide-react';

interface MissionActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: WorldMission | null;
  building: Building | null;
  onCompleteMission: (missionId: string, rewardXP: number, rewardCredits: number) => void;
}

export const MissionActivityModal: React.FC<MissionActivityModalProps> = ({
  isOpen,
  onClose,
  mission,
  building,
  onCompleteMission,
}) => {
  if (!isOpen || !mission) return null;

  const starter = MISSION_STARTERS[mission.id] || {
    initialCode: `// Mission Task: ${mission.title}\n// Complete the required objectives below\n`,
    expectedKeywords: [],
    hint: 'Review the objectives checklist and implement the required functionality.',
  };

  const [code, setCode] = useState<string>(starter.initialCode);
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    message: string;
    missingKeywords?: string[];
  } | null>(null);

  const handleRunValidation = () => {
    // Check keywords
    const missing = starter.expectedKeywords.filter(
      (kw) => !code.toLowerCase().includes(kw.toLowerCase())
    );

    if (missing.length > 0) {
      setValidationResult({
        success: false,
        message: 'Solution does not satisfy all requirements. Review the hint below.',
        missingKeywords: missing,
      });
      return;
    }

    // Success!
    setValidationResult({
      success: true,
      message: `Verification successful! All ${mission.skill} requirements satisfied.`,
    });

    if (mission.status !== 'completed') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onCompleteMission(mission.id, mission.rewardXP, mission.rewardCredits);
    }
  };

  const handleResetCode = () => {
    setCode(starter.initialCode);
    setValidationResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080B14]/85 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-b from-[#101626] to-[#0A0E1A] shadow-2xl shadow-purple-950/40 transition-all animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 p-5 bg-[#0C1222]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300 border border-indigo-500/30">
                  {mission.skill}
                </span>
                <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-300">
                  {mission.difficulty}
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">{mission.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-gray-800 bg-[#121B2D]/80 p-1.5 text-gray-400 hover:border-gray-700 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Rewards Banner */}
          <div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5">
            <div className="flex items-center gap-3 text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-amber-400" />
                +{mission.rewardXP} XP
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <Coins className="h-4 w-4 text-cyan-400" />
                +{mission.rewardCredits} City Credits
              </span>
            </div>

            {building && (
              <div className="flex items-center gap-1.5 text-xs text-purple-200 font-semibold">
                <Building2 className="h-3.5 w-3.5 text-purple-400" />
                <span>Unlocks {building.name}</span>
              </div>
            )}
          </div>

          {/* Description & Requirements */}
          <div className="rounded-2xl border border-gray-800 bg-[#080B14] p-4 text-xs space-y-2.5">
            <p className="text-gray-300 leading-relaxed">{mission.description}</p>
            <div className="border-t border-gray-800/80 pt-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Requirements Checklist:
              </h4>
              <ul className="space-y-1">
                {mission.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300 text-[11px]">
                    <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Code Area */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-1.5 px-1">
              <span>Solution Workspace ({mission.skill})</span>
              <button
                onClick={handleResetCode}
                className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-300 transition"
              >
                <RotateCcw className="h-3 w-3" /> Reset Starter
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={9}
              className="w-full rounded-2xl border border-gray-800 bg-[#070A14] p-3.5 font-mono text-xs text-gray-200 focus:border-purple-500 focus:outline-none transition leading-relaxed resize-none shadow-inner"
              spellCheck={false}
            />
          </div>

          {/* Hint */}
          <div className="flex items-start gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs text-indigo-300">
            <Lightbulb className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <span className="text-[11px]">{starter.hint}</span>
          </div>

          {/* Validation Feedback Banner */}
          {validationResult && (
            <div
              className={`rounded-2xl border p-3.5 text-xs flex items-start gap-2.5 ${
                validationResult.success
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
              }`}
            >
              {validationResult.success ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{validationResult.message}</p>
                {validationResult.missingKeywords && validationResult.missingKeywords.length > 0 && (
                  <p className="text-[10px] text-rose-400 mt-1">
                    Missing elements: {validationResult.missingKeywords.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-800 p-4 bg-[#0C1222]">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-800 bg-[#121B2D] px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition"
          >
            Close
          </button>

          <button
            onClick={handleRunValidation}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-glow-purple hover:brightness-110 transition"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Verify & Claim Rewards (+{mission.rewardCredits} Cr)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

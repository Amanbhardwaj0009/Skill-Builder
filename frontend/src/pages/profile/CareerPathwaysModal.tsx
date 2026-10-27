import React from 'react';
import {
  Compass,
  X,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';

interface CareerPathwaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerName: string;
  onSelectCareer: (career: string) => void;
}

export const CareerPathwaysModal: React.FC<CareerPathwaysModalProps> = ({
  isOpen,
  onClose,
  careerName,
  onSelectCareer,
}) => {
  if (!isOpen) return null;

  const pathways = [
    {
      stage: 'Tier 1',
      title: 'Apprentice Manufacturing Technician',
      experience: '0 - 1 Years',
      skills: ['Basic Schematics', 'Shopfloor Safety Protocols', 'Hand Tool & Metrology'],
      status: 'Mastered',
      unlocked: true,
    },
    {
      stage: 'Tier 2',
      title: 'Junior Manufacturing Engineer',
      experience: '1 - 3 Years',
      skills: ['PLC Ladder Logic', 'Robotic Arm Jogging & Tool Center Points', 'CAD Fixture Modeling'],
      status: 'Current Role',
      unlocked: true,
    },
    {
      stage: 'Tier 3',
      title: 'Senior Automation & Systems Architect',
      experience: '3 - 6 Years',
      skills: ['Industrial IoT Integration', 'Digital Twin Factory Simulation', 'Six Sigma Black Belt'],
      status: 'Next Promotion',
      unlocked: false,
    },
    {
      stage: 'Tier 4',
      title: 'VP of Plant Engineering & Operations',
      experience: '6+ Years',
      skills: ['Capital Expenditure Planning', 'Smart Plant Autonomous Deployment', 'Executive Operations'],
      status: 'Executive Tier',
      unlocked: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-purple-500/40 bg-[#101626] p-6 sm:p-8 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600/20 text-cyan-400 border border-purple-500/40 shadow-glow-purple">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{careerName} Roadmap</span>
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                  Career Pathway
                </span>
              </h2>
              <p className="text-xs text-gray-400">Progression milestones from entry recruit to plant leadership</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pathway Steps */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {pathways.map((p, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-4 transition ${
                p.status === 'Current Role'
                  ? 'border-cyan-400/80 bg-cyan-500/10 shadow-glow-cyan/20'
                  : p.unlocked
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-gray-800 bg-[#080B14]/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-purple-400">{p.stage} • {p.experience}</span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                    p.status === 'Current Role'
                      ? 'text-cyan-400'
                      : p.unlocked
                      ? 'text-emerald-400'
                      : 'text-gray-500'
                  }`}
                >
                  {p.unlocked ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  <span>{p.status}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{p.title}</h3>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {p.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-gray-900 border border-gray-800 px-2 py-0.5 text-[10px] text-gray-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-gray-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-purple-600 px-6 py-2 text-xs font-bold text-white shadow-glow-purple hover:bg-purple-500 transition"
          >
            Acknowledge Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};

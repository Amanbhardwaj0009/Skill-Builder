import React from 'react';
import {
  Compass,
  X,
  CheckCircle2,
  Cpu,
  Wrench,
  ShieldAlert,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ExploreClustersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCluster: string;
  onSelectCluster: (cluster: string) => void;
  onSelectCareer: (career: string) => void;
}

export const ExploreClustersModal: React.FC<ExploreClustersModalProps> = ({
  isOpen,
  onClose,
  selectedCluster,
  onSelectCluster,
  onSelectCareer,
}) => {
  if (!isOpen) return null;

  const clusters = [
    {
      name: 'Manufacturing',
      icon: Wrench,
      description: 'Design automated factory floor cells, robotics integration, and lean assembly lines.',
      careers: ['Manufacturing Engineer', 'Industrial Engineer', 'Process Engineer', 'Operations Manager'],
    },
    {
      name: 'Engineering & Tech',
      icon: Cpu,
      description: 'Physical computing, robotic mechanisms, sensors, and hardware-software integration.',
      careers: ['Robotics Specialist', 'Mechanical Systems Designer', 'Electrical Engineer'],
    },
    {
      name: 'Information Tech',
      icon: Layers,
      description: 'Full-stack software architecture, data infrastructure, UI design, and cloud systems.',
      careers: ['Software Developer', 'UI/UX Designer', 'Data Analyst', 'Cybersecurity Analyst'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-purple-500/40 bg-[#101626] p-6 sm:p-8 shadow-2xl text-white">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-glow-cyan">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Career Clusters Explorer</h2>
              <p className="text-xs text-gray-400">Discover and switch career tracks across high-growth industries</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {clusters.map((c, i) => {
            const Icon = c.icon;
            const isSelected = selectedCluster === c.name;
            return (
              <div
                key={i}
                className={`rounded-2xl border p-4 transition ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10 shadow-glow-purple/20'
                    : 'border-gray-800 bg-[#080B14] hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">{c.name}</h3>
                  </div>
                  <button
                    onClick={() => {
                      onSelectCluster(c.name);
                      onSelectCareer(c.careers[0]);
                      onClose();
                    }}
                    className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30"
                  >
                    Select Cluster
                  </button>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-3">{c.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {c.careers.map((career, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectCluster(c.name);
                        onSelectCareer(career);
                        onClose();
                      }}
                      className="rounded-xl border border-gray-800 bg-[#121B2D] px-2.5 py-1 text-[11px] text-gray-300 hover:border-purple-500 hover:text-white"
                    >
                      {career}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

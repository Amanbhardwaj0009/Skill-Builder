import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, CheckCircle2, Layers, Sparkles, TrendingUp } from 'lucide-react';
import { ProjectItem } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const handleLaunchLive = () => {
    soundEffects.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl glass-panel-glow border border-cyan-400/30 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col text-white shadow-2xl z-10"
        >
          {/* Project Banner & Close */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-gray-900">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-transparent" />

            {/* Close Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category Pill */}
            <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              {project.category}
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-6 right-6">
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                {project.title}
              </h3>
              <p className="text-sm text-cyan-300 font-mono mt-0.5">
                {project.tagline}
              </p>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            {/* Description */}
            <div>
              <h4 className="text-xs uppercase font-mono tracking-widest text-gray-400 mb-2">
                Executive Overview
              </h4>
              <p className="text-sm text-gray-200 leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            {/* Metrics */}
            {project.metrics && (
              <div>
                <h4 className="text-xs uppercase font-mono tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  Key Impact Metrics
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {project.metrics.map((m, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                      <div className="font-display text-lg sm:text-xl font-bold text-gradient-cyan-purple">
                        {m.value}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono mt-1">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features Highlights */}
            <div>
              <h4 className="text-xs uppercase font-mono tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Technical Highlights
              </h4>
              <div className="space-y-2">
                {project.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack Tags */}
            <div>
              <h4 className="text-xs uppercase font-mono tracking-widest text-gray-400 mb-2.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Technologies & Architecture
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleLaunchLive}
                onMouseEnter={soundEffects.playHover}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:opacity-90 transition-opacity"
              >
                <span>Launch Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={soundEffects.playClick}
                onMouseEnter={soundEffects.playHover}
                className="flex-1 py-3 px-6 rounded-xl glass-panel border border-white/20 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View GitHub Repository</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

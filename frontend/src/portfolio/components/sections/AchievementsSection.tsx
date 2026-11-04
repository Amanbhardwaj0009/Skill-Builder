import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Sparkles, Medal, ExternalLink, Calendar, MapPin, X, Check } from 'lucide-react';
import { portfolioData, AchievementItem } from '../../data/portfolioData';
import { TiltCard3D } from '../ui/TiltCard3D';
import { soundEffects } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Award,
  Sparkles,
  Medal,
};

export const AchievementsSection: React.FC = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null);

  const handleInspect = (ach: AchievementItem) => {
    soundEffects.playClick();
    setSelectedAchievement(ach);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  return (
    <section id="achievements" className="relative py-28 w-full overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>05 // Recognition</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
            HONORS & <span className="text-gradient-cyan-purple">ACHIEVEMENTS</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 font-normal">
            Milestones earned through competitive problem-solving, rapid prototyping, and research engagement.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolioData.achievements.map((ach: AchievementItem) => {
            const Icon = iconMap[ach.icon] || Trophy;

            return (
              <TiltCard3D
                key={ach.id}
                maxTilt={10}
                scale={1.02}
                className="rounded-3xl cursor-pointer"
              >
                <div
                  onClick={() => handleInspect(ach)}
                  className="h-full glass-panel hover:glass-panel-glow border border-white/10 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 group shadow-lg"
                >
                  <div>
                    {/* Top Ribbon & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                        <Icon className="w-6 h-6" />
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                        {ach.rankBadge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {ach.title}
                    </h3>

                    {/* Event & Institution */}
                    <p className="text-xs text-cyan-400 font-mono mt-1">
                      {ach.institution}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  {/* Bottom Footer Info */}
                  <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      {ach.date}
                    </span>
                    <span className="text-cyan-400 font-semibold group-hover:underline flex items-center gap-0.5">
                      Inspect &gt;
                    </span>
                  </div>

                </div>
              </TiltCard3D>
            );
          })}
        </div>

      </div>

      {/* Achievement Certificate Preview Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAchievement(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xl glass-panel-glow border border-amber-400/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2 text-amber-300 font-display font-bold text-sm uppercase tracking-wider">
                  <Trophy className="w-4 h-4" />
                  <span>Official Recognition</span>
                </div>
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Certificate Frame Mockup */}
              <div className="border-2 border-dashed border-amber-400/40 rounded-2xl p-6 bg-gradient-to-b from-amber-400/5 to-transparent text-center relative overflow-hidden">
                <div className="absolute top-2 right-2 text-amber-300/20 font-display text-6xl font-black select-none pointer-events-none">
                  #1
                </div>

                <div className="inline-block p-3 rounded-2xl bg-amber-400/20 text-amber-300 mb-3">
                  <Award className="w-8 h-8" />
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                  {selectedAchievement.rankBadge}
                </span>

                <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                  {selectedAchievement.title}
                </h3>

                <p className="text-xs text-cyan-300 font-mono mt-1">
                  Presented by {selectedAchievement.institution}
                </p>

                <p className="text-xs sm:text-sm text-gray-300 mt-4 leading-relaxed max-w-md mx-auto">
                  {selectedAchievement.description}
                </p>

                <div className="mt-6 pt-4 border-t border-amber-400/20 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>Candidate: Aman Bhardwaj</span>
                  <span className="text-amber-300 font-bold">Verified Achievement</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

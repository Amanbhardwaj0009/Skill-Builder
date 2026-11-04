import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { portfolioData, ExperienceItem } from '../../data/portfolioData';
import { TiltCard3D } from '../ui/TiltCard3D';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="relative py-28 w-full overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>04 // Trajectory</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
            EXPERIENCE & <span className="text-gradient-purple-cyan">LEADERSHIP</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 font-normal">
            Track record of driving team initiatives, managing tech chapters, and building under pressure.
          </p>
        </div>

        {/* Futuristic Timeline Structure */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Glowing Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent opacity-40 hidden sm:block" />

          <div className="space-y-12">
            {portfolioData.experience.map((exp: ExperienceItem, idx: number) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={exp.id}
                  className={`relative flex flex-col sm:flex-row items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Center Glowing Timeline Node */}
                  <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#080d1a] border-2 border-cyan-400 items-center justify-center shadow-[0_0_15px_#00f0ff] z-20">
                    <div className="w-3 h-3 rounded-full bg-cyan-300 animate-ping opacity-75" />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  </div>

                  {/* Empty Spacer Column for Desktop */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Content Card Column */}
                  <div className={`w-full sm:w-1/2 ${isEven ? 'sm:pr-10' : 'sm:pl-10'}`}>
                    <TiltCard3D maxTilt={6} scale={1.01} className="rounded-3xl">
                      <div className="glass-panel hover:glass-panel-glow border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all">
                        
                        {/* Header Pill & Period */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span
                            className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider border"
                            style={{
                              color: exp.color,
                              borderColor: `${exp.color}40`,
                              backgroundColor: `${exp.color}15`,
                            }}
                          >
                            {exp.badge}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                            {exp.period}
                          </span>
                        </div>

                        {/* Role Title */}
                        <h3 className="font-display text-xl font-bold text-white">
                          {exp.role}
                        </h3>

                        {/* Organization & Location */}
                        <div className="flex items-center gap-2 text-xs text-cyan-300 font-medium mt-1">
                          <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                          <span>{exp.organization}</span>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Achievements Bullets */}
                        <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                          {exp.achievements.map((ach, aIdx) => (
                            <div key={aIdx} className="flex items-start gap-2 text-xs text-gray-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                              <span>{ach}</span>
                            </div>
                          ))}
                        </div>

                      </div>
                    </TiltCard3D>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

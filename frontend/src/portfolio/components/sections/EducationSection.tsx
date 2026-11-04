import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, CheckCircle, BookOpen, Sparkles } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { TiltCard3D } from '../ui/TiltCard3D';

export const EducationSection: React.FC = () => {
  const { education } = portfolioData;

  return (
    <section id="education" className="relative py-28 w-full overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>06 // Foundation</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
            ACADEMIC <span className="text-gradient-cyan-purple">EDUCATION</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 font-normal">
            Formal foundations in computer science theory, algorithms, and engineering discipline.
          </p>
        </div>

        {/* Education Hero Card */}
        <div className="max-w-4xl mx-auto">
          <TiltCard3D maxTilt={6} scale={1.01} className="rounded-3xl">
            <div className="glass-panel hover:glass-panel-glow border border-cyan-400/30 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                      {education.degree}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-cyan-400 font-medium mt-1">
                      <span>{education.institution}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <MapPin className="w-3 h-3 text-purple-400" />
                        {education.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end">
                  <span className="px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider">
                    {education.expectedGraduation}
                  </span>
                  <span className="text-xs text-gray-500 font-mono mt-1">
                    Timeline: {education.period}
                  </span>
                </div>
              </div>

              {/* Highlights List */}
              <div className="py-6 space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-widest text-purple-400 font-bold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Key Academic Focus & Extracurriculars</span>
                </h4>
                <div className="space-y-2.5">
                  {education.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-xs sm:text-sm text-gray-300 bg-white/5 p-3.5 rounded-2xl border border-white/5"
                    >
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coursework Badges */}
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold flex items-center gap-2 mb-3">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Core Computer Science Coursework</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {education.coursework.map((course, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 font-mono text-xs"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </TiltCard3D>
        </div>

      </div>
    </section>
  );
};

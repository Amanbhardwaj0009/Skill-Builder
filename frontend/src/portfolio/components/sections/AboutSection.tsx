import React from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Sparkles, MapPin, CheckCircle, Terminal, Heart, Code2 } from 'lucide-react';
import { TiltCard3D } from '../ui/TiltCard3D';
import { Interactive3DAvatar } from '../3d/Interactive3DAvatar';
import { portfolioData } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-28 w-full overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>01 // Discover</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
            ABOUT <span className="text-gradient-cyan-purple">ME</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 font-normal">
            Where creative curiosity meets structured software engineering and technical leadership.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Interactive 3D Avatar (Toggle Real 3D Character / 3D Hologram Photo) */}
          <div className="lg:col-span-5 flex justify-center">
            <TiltCard3D maxTilt={8} className="w-full max-w-md rounded-3xl">
              <div className="relative glass-panel-glow border border-cyan-400/40 rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                {/* 3D Avatar Component */}
                <Interactive3DAvatar />

                {/* Name & Title */}
                <h3 className="font-display text-2xl font-bold text-white mt-4">
                  Aman Bhardwaj
                </h3>
                <p className="text-xs font-mono text-cyan-400 mt-0.5 uppercase tracking-wider">
                  {portfolioData.personal.role}
                </p>

                {/* Institution & Location Badge */}
                <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{portfolioData.personal.college}</span>
                </div>

                {/* Interactive Mini Terminal in Card */}
                <div className="w-full mt-5 bg-[#040814] rounded-xl p-3 border border-white/10 text-left font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-gray-500 border-b border-white/5 pb-1 mb-1">
                    <span>aman.config.json</span>
                    <span className="text-cyan-400">ACTIVE</span>
                  </div>
                  <div className="text-gray-300">
                    <span className="text-purple-400">"degree"</span>: <span className="text-cyan-300">"B.Tech CSE"</span>,
                  </div>
                  <div className="text-gray-300">
                    <span className="text-purple-400">"gradYear"</span>: <span className="text-amber-300">2028</span>,
                  </div>
                  <div className="text-gray-300">
                    <span className="text-purple-400">"acmRole"</span>: <span className="text-emerald-300">"Treasurer"</span>
                  </div>
                </div>

                {/* Quick stats ribbon */}
                <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                  <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-display text-lg font-bold text-cyan-300">2nd Pos</div>
                    <div className="text-[10px] text-gray-400 font-mono">48H Hackathon</div>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-display text-lg font-bold text-purple-300">Top 6</div>
                    <div className="text-[10px] text-gray-400 font-mono">Quantum Univ</div>
                  </div>
                </div>
              </div>
            </TiltCard3D>
          </div>

          {/* Right Column: Bio, Education, Leadership, Development Interests */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Story Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span>Creative Engineering & Problem Solving</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {portfolioData.personal.aboutStory}
              </p>

              {/* Education Box */}
              <div className="mt-6 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-400/10 text-cyan-300 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {portfolioData.education.degree}
                    </h4>
                    <p className="text-xs text-cyan-300 mt-0.5">
                      {portfolioData.education.institution}, {portfolioData.education.location}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      {portfolioData.education.expectedGraduation}
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-mono text-xs text-center shrink-0">
                  Batch 2024–28
                </div>
              </div>

              {/* Leadership Highlight */}
              <div className="mt-4 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-400/10 text-purple-300 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    Treasurer – ACM Student Chapter, Shivalik
                  </h4>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    Spearheading financial management, workshop coordination, and tech contests to empower students with industry-relevant coding skills and competitive mindset.
                  </p>
                </div>
              </div>
            </div>

            {/* Development Interests Chips */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
              <h4 className="text-xs uppercase font-mono tracking-widest text-cyan-400 mb-4 flex items-center gap-2 font-bold">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>CORE DEVELOPMENT INTERESTS</span>
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {portfolioData.personal.interests.map((interest, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={soundEffects.playHover}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 border border-white/10 hover:border-cyan-400/40 text-xs sm:text-sm font-medium text-gray-200 hover:text-white transition-all cursor-default flex items-center gap-2 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{interest}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Metrics Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {portfolioData.personal.stats.map((s, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-4 rounded-2xl border border-white/10 text-center hover:border-cyan-400/30 transition-colors"
                >
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-gradient-cyan-purple">
                    {s.value}
                    <span className="text-xs text-cyan-400 font-mono ml-0.5">{s.suffix}</span>
                  </div>
                  <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

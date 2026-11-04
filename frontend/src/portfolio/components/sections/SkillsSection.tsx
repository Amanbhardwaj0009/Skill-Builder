import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Server,
  Database,
  Wrench,
  Sparkles,
  Braces,
  Palette,
  FileCode,
  Layout,
  Terminal,
  Network,
  Flame,
  GitBranch,
  Github,
  Laptop,
  Figma,
  Cpu,
} from 'lucide-react';
import { TiltCard3D } from '../ui/TiltCard3D';
import { portfolioData, SkillItem } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Code2,
  Braces,
  Palette,
  FileCode,
  Layout,
  Server,
  Cpu,
  Terminal,
  Network,
  Database,
  Flame,
  GitBranch,
  Github,
  Laptop,
  Figma,
};

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools'] as const;

export const SkillsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All');

  const filteredSkills =
    activeCategory === 'All'
      ? portfolioData.skills
      : portfolioData.skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="relative py-28 w-full overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>02 // Arsenal</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
            TECHNICAL <span className="text-gradient-cyan-purple">SKILLS</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 font-normal">
            Modern toolsets, battle-tested frameworks, and core engineering fundamentals.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  soundEffects.playClick();
                  setActiveCategory(cat);
                }}
                onMouseEnter={soundEffects.playHover}
                className={`relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-200 uppercase ${
                  isActive
                    ? 'text-black font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                    : 'text-gray-400 glass-panel border border-white/10 hover:text-white hover:border-cyan-400/30'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSkillTab"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full -z-0"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence>
            {filteredSkills.map((skill: SkillItem) => {
              const IconComponent = iconMap[skill.icon] || Code2;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={skill.name}
                >
                  <TiltCard3D maxTilt={12} scale={1.03} className="h-full rounded-2xl">
                    <div className="h-full glass-panel hover:glass-panel-glow border border-white/10 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 group">
                      
                      {/* Top Row: Icon & Tag */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
                            style={{
                              backgroundColor: `${skill.color}18`,
                              border: `1px solid ${skill.color}44`,
                            }}
                          >
                            <IconComponent className="w-6 h-6" style={{ color: skill.color }} />
                          </div>

                          {/* Editable Proficiency Level Badge */}
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase border"
                            style={{
                              color: skill.color,
                              borderColor: `${skill.color}35`,
                              backgroundColor: `${skill.color}10`,
                            }}
                          >
                            {skill.proficiencyTag}
                          </span>
                        </div>

                        {/* Skill Name */}
                        <h3 className="font-display text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {skill.name}
                        </h3>

                        {/* Category */}
                        <div className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">
                          {skill.category}
                        </div>

                        {/* Skill Description */}
                        <p className="text-xs text-gray-300 mt-2.5 leading-relaxed">
                          {skill.description}
                        </p>
                      </div>

                      {/* Bottom Accent Glow Line */}
                      <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400">
                          STATUS: ACTIVE
                        </span>
                        <div
                          className="h-1.5 w-12 rounded-full overflow-hidden"
                          style={{ backgroundColor: `${skill.color}20` }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500 group-hover:w-full"
                            style={{
                              width: '70%',
                              backgroundColor: skill.color,
                              boxShadow: `0 0 8px ${skill.color}`,
                            }}
                          />
                        </div>
                      </div>

                    </div>
                  </TiltCard3D>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Note on editability */}
        <div className="mt-12 text-center text-xs text-gray-400 font-mono">
          * Skill details & tags are synchronized directly from{' '}
          <span className="text-cyan-400">portfolioData.ts</span> for seamless customization.
        </div>
      </div>
    </section>
  );
};

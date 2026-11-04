import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, FileText, Github, Linkedin, Instagram, Mail, ChevronRight } from 'lucide-react';
import { HeroCanvas3D } from '../3d/HeroCanvas3D';
import { portfolioData } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';

interface HeroSectionProps {
  onOpenResume: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenResume }) => {
  const scrollToProjects = () => {
    soundEffects.playClick();
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 overflow-hidden bg-radial-hero"
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

      {/* Decorative ambient neon light blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-10rem)]">
          
          {/* Left Column: Heading, Subtitle, Bio, CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6 pt-4 lg:pt-0"
          >
            {/* Status Pill with Avatar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full glass-panel border border-cyan-400/40 text-cyan-300 text-xs font-mono tracking-wide w-fit shadow-[0_0_20px_rgba(0,240,255,0.2)]"
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-cyan-400/60 shadow-[0_0_8px_#00f0ff] shrink-0">
                <img
                  src={portfolioData.personal.avatar}
                  alt={portfolioData.personal.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>{portfolioData.personal.status}</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xs sm:text-sm font-mono tracking-widest text-cyan-400 uppercase font-semibold flex items-center gap-2"
              >
                <span>&lt;HELLO WORLD /&gt;</span>
                <span className="h-px w-12 bg-gradient-to-r from-cyan-400 to-transparent" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight uppercase leading-[1.08] text-white"
              >
                HEY, I'M <br />
                <span className="text-gradient-cyan-purple drop-shadow-[0_0_35px_rgba(0,240,255,0.25)]">
                  AMAN BHARDWAJ
                </span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-display text-lg sm:text-xl lg:text-2xl text-purple-200/90 font-medium tracking-wide"
            >
              Building Digital Experiences Through Code & Creativity.
            </motion.p>

            {/* Profile Introduction */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal"
            >
              Computer Science student at{' '}
              <span className="text-cyan-300 font-semibold">{portfolioData.education.institution}</span>,{' '}
              Treasurer of the{' '}
              <span className="text-purple-300 font-semibold">ACM Student Chapter</span>, and an avid hackathon competitor. Specializing in high-performance full-stack web applications and intelligent 3D web interfaces.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {/* Explore My Work CTA */}
              <button
                onClick={scrollToProjects}
                onMouseEnter={soundEffects.playHover}
                className="group relative px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black font-display font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] transition-all flex items-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">Explore My Work</span>
                <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>

              {/* Download Resume CTA */}
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onOpenResume();
                }}
                onMouseEnter={soundEffects.playHover}
                className="px-6 py-3.5 rounded-full glass-panel border border-white/20 text-white font-display font-semibold text-sm uppercase tracking-wider hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Download Resume</span>
              </button>
            </motion.div>

            {/* Social Icons Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="flex items-center gap-3 pt-3 text-gray-400"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-gray-500 mr-2">
                Connect:
              </span>
              <a
                href={portfolioData.personal.socials.github}
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                onMouseEnter={soundEffects.playHover}
                className="p-2.5 rounded-xl glass-panel border border-white/10 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={portfolioData.personal.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
                onMouseEnter={soundEffects.playHover}
                className="p-2.5 rounded-xl glass-panel border border-white/10 hover:border-purple-400 hover:text-purple-300 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={portfolioData.personal.socials.instagram}
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                onMouseEnter={soundEffects.playHover}
                className="p-2.5 rounded-xl glass-panel border border-white/10 hover:border-pink-400 hover:text-pink-300 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${portfolioData.personal.socials.email}`}
                title="Email"
                onMouseEnter={soundEffects.playHover}
                className="p-2.5 rounded-xl glass-panel border border-white/10 hover:border-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive 3D Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 h-[420px] sm:h-[500px] lg:h-[600px] w-full relative"
          >
            {/* Background 3D Glow Backlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

            {/* Three.js Interactive Hero Canvas */}
            <HeroCanvas3D />

            {/* Mouse Drag / Interactive Hint badge */}
            <div className="absolute bottom-2 right-4 glass-panel px-3 py-1.5 rounded-full border border-white/10 text-[11px] font-mono text-gray-400 flex items-center gap-1.5 pointer-events-none shadow-lg">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Interactive 3D • Move cursor</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="w-full flex flex-col items-center justify-center pt-8 cursor-pointer"
          onClick={() => {
            soundEffects.playClick();
            const aboutSec = document.querySelector('#about');
            if (aboutSec) aboutSec.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-[11px] font-mono tracking-widest uppercase text-gray-400 mb-2">
            Scroll to Explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-cyan-400/40 flex items-start justify-center p-1"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

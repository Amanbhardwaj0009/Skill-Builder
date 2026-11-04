import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Volume2, VolumeX, Sparkles, FileText, Send } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

interface NavbarProps {
  activeSection: string;
  onOpenResume: () => void;
}

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onOpenResume }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEffects.getIsMuted());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    soundEffects.playClick();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAudioToggle = () => {
    const newMuted = soundEffects.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundEffects.playSuccess();
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-4 px-4 sm:px-8 ${
          isScrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Monogram */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            onMouseEnter={soundEffects.playHover}
            className="group flex items-center gap-2 cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 flex items-center justify-center transition-all duration-300 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <span className="font-display font-black text-lg text-white group-hover:text-cyan-300 transition-colors">
                AB
              </span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                AMAN BHARDWAJ
              </span>
              <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                Full Stack & AI
              </span>
            </div>
          </a>

          {/* Desktop Navigation Floating Dock */}
          <nav className="hidden lg:flex items-center gap-1 glass-panel px-4 py-2 rounded-full border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  onMouseEnter={soundEffects.playHover}
                  className={`relative px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors duration-200 rounded-full ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 rounded-full border border-cyan-400/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={handleAudioToggle}
              title={isMuted ? 'Unmute Futuristic Audio' : 'Mute Audio'}
              className="p-2.5 rounded-full glass-panel border border-white/10 text-gray-400 hover:text-cyan-300 hover:border-cyan-400/40 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-gray-500" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
            </button>

            {/* Resume Button */}
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenResume();
              }}
              onMouseEnter={soundEffects.playHover}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full glass-panel border border-purple-500/30 text-xs font-semibold text-purple-200 hover:text-white hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Resume</span>
            </button>

            {/* Contact CTA */}
            <button
              onClick={() => handleNavClick('#contact')}
              onMouseEnter={soundEffects.playHover}
              className="relative group overflow-hidden px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <span>Hire Me</span>
                <Sparkles className="w-3 h-3 text-black" />
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2.5 rounded-xl glass-panel border border-white/10 text-gray-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-20 z-40 rounded-2xl glass-panel-glow border border-cyan-400/30 p-6 lg:hidden flex flex-col gap-4 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className={`text-left px-4 py-3 rounded-xl font-medium tracking-wide text-sm transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-semibold'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl glass-panel border border-purple-400/40 text-xs font-semibold text-purple-200 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>View Resume</span>
              </button>
              <button
                onClick={() => handleNavClick('#contact')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black text-xs font-bold flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Contact</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

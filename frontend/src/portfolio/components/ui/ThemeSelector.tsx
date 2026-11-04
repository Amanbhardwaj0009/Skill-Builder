import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { PortfolioTheme } from './DynamicBackground';
import { soundEffects } from '../../utils/soundEffects';

interface ThemeSelectorProps {
  currentTheme: PortfolioTheme;
  onThemeChange: (theme: PortfolioTheme) => void;
}

const themeOptions: Array<{
  id: PortfolioTheme;
  name: string;
  desc: string;
  colors: string[];
}> = [
  {
    id: 'nebula',
    name: 'Cosmic Nebula',
    desc: 'Deep Space • Violet & Cyan',
    colors: ['#a855f7', '#00f0ff', '#06020f'],
  },
  {
    id: 'matrix',
    name: 'Cyber Matrix',
    desc: 'Hacker Tech • Emerald & Cyan',
    colors: ['#10b981', '#00f0ff', '#020706'],
  },
  {
    id: 'synthwave',
    name: 'Sunset Synthwave',
    desc: 'Retro Cyber • Neon Pink & Sunset',
    colors: ['#ec4899', '#a855f7', '#0c0316'],
  },
  {
    id: 'oceanic',
    name: 'Oceanic Abyss',
    desc: 'Deep Bioluminescent • Sapphire & Blue',
    colors: ['#00f0ff', '#38bdf8', '#010714'],
  },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (theme: PortfolioTheme) => {
    soundEffects.playSuccess();
    onThemeChange(theme);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Theme Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          soundEffects.playClick();
          setIsOpen(!isOpen);
        }}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full glass-panel-glow border border-cyan-400/40 text-white shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
        title="Change Background Theme"
      >
        <Palette className="w-4 h-4 text-cyan-300 group-hover:rotate-45 transition-transform" />
        <span className="text-xs font-mono font-bold tracking-wider hidden sm:inline">
          THEME
        </span>
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      </motion.button>

      {/* Pop-up Theme Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="absolute bottom-14 right-0 w-72 rounded-3xl glass-panel-glow border border-cyan-400/30 p-4 shadow-2xl backdrop-blur-2xl text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Select Theme
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Theme Options */}
            <div className="space-y-2">
              {themeOptions.map((opt) => {
                const isSelected = currentTheme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Color Preview Swatch */}
                      <div className="flex -space-x-1.5 shrink-0">
                        {opt.colors.map((c, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>

                      <div>
                        <div
                          className={`text-xs font-bold ${
                            isSelected ? 'text-cyan-300' : 'text-gray-200 group-hover:text-white'
                          }`}
                        >
                          {opt.name}
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">
                          {opt.desc}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

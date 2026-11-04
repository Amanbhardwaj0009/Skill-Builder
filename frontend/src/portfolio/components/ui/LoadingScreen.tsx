import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('INITIALIZING ENVIRONMENT...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next > 25 && next < 55) {
          setStatusMessage('CALIBRATING 3D SHADERS & PARTICLES...');
        } else if (next >= 55 && next < 85) {
          setStatusMessage('LOADING AMAN BHARDWAJ REPOSITORIES...');
        } else if (next >= 85) {
          setStatusMessage('NEURAL MATRIX SYNCHRONIZED.');
        }

        return Math.min(next, 100);
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] text-white select-none"
      >
        {/* Ambient Glowing Background */}
        <div className="absolute inset-0 bg-radial-hero pointer-events-none" />
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

        {/* Center Futuristic Tech Core */}
        <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
          {/* Animated Glowing Monogram */}
          <div className="relative mb-8 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/40"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              className="absolute w-20 h-20 rounded-full border border-purple-500/50"
            />
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display font-black text-2xl tracking-widest text-gradient-cyan-purple">
                AB
              </span>
              <span className="text-[9px] tracking-widest text-cyan-400 uppercase font-mono">
                3D CORE
              </span>
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="font-display text-5xl font-extrabold tracking-tight mb-2 text-white">
            {progress}
            <span className="text-cyan-400 text-2xl">%</span>
          </div>

          {/* Status Message */}
          <p className="text-xs font-mono tracking-widest text-gray-400 mb-6 h-5 uppercase">
            {statusMessage}
          </p>

          {/* Sleek Progress Bar */}
          <div className="w-full bg-gray-900/80 rounded-full h-1.5 p-0.5 border border-white/10 overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full shadow-[0_0_12px_#00f0ff]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Bottom telemetry footer */}
          <div className="mt-8 flex items-center gap-4 text-[10px] text-gray-500 font-mono">
            <span>AMAN BHARDWAJ</span>
            <span>•</span>
            <span>PORTFOLIO v2026</span>
            <span>•</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

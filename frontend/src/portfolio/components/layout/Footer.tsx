import React from 'react';
import { ArrowUp, Heart, Github, Linkedin, Instagram, Mail, Sparkles } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundEffects.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black/40 backdrop-blur-xl border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Background cyber accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-600/20 border border-cyan-400/30 flex items-center justify-center">
                <span className="font-display font-black text-lg text-white">AB</span>
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-white tracking-wider">
                  AMAN BHARDWAJ
                </h4>
                <p className="text-xs text-cyan-400 font-mono">
                  Full Stack Developer • Computer Science Student
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 max-w-md leading-relaxed">
              Crafting immersive 3D digital experiences, high-throughput architectures, and intuitive web solutions.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-gray-300">
                Open for high-impact roles & hackathon squads
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs uppercase font-mono tracking-widest text-cyan-400 font-bold">
              Navigation
            </h5>
            <ul className="space-y-2 text-xs font-medium text-gray-400">
              {['Home', 'About', 'Skills', 'Projects', 'Experience', 'Achievements', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={() => soundEffects.playClick()}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect / Socials */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs uppercase font-mono tracking-widest text-purple-400 font-bold">
              Connect
            </h5>
            <div className="flex flex-col space-y-2 text-xs text-gray-400">
              <a
                href={portfolioData.personal.socials.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 text-gray-400" />
                <span>GitHub</span>
              </a>
              <a
                href={portfolioData.personal.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4 text-purple-400" />
                <span>LinkedIn</span>
              </a>
              <a
                href={portfolioData.personal.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram</span>
              </a>
              <a
                href={`mailto:${portfolioData.personal.socials.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>{portfolioData.personal.socials.email}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <p>
            © {new Date().getFullYear()} Aman Bhardwaj. Designed & Engineered with Three.js, React & Tailwind CSS.
          </p>

          <button
            onClick={scrollToTop}
            onMouseEnter={soundEffects.playHover}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border border-white/10 hover:border-cyan-400/40 text-gray-300 hover:text-cyan-300 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

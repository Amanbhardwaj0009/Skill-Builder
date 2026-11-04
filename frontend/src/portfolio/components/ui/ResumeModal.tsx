import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, Mail, Award, BookOpen, Briefcase, Code } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    soundEffects.playSuccess();
    // Create an editable print view / simulated download
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl glass-panel-glow border border-cyan-400/30 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-white shadow-2xl z-10"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.3)] shrink-0">
                <img
                  src={portfolioData.personal.avatar}
                  alt={portfolioData.personal.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  {portfolioData.personal.name}
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  {portfolioData.personal.role} • {portfolioData.education.expectedGraduation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs font-semibold text-cyan-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save / Print</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onClose();
                }}
                className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Resume Body */}
          <div className="mt-6 space-y-6 text-sm">
            {/* Contact Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-300 pb-4 border-b border-white/5">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                {portfolioData.personal.socials.email}
              </span>
              <span>•</span>
              <a
                href={portfolioData.personal.socials.github}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                GitHub <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <a
                href={portfolioData.personal.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:underline flex items-center gap-1"
              >
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Education */}
            <div>
              <div className="flex items-center gap-2 text-cyan-300 font-display font-semibold text-base mb-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>EDUCATION</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold">
                  <span>{portfolioData.education.degree}</span>
                  <span className="text-xs text-gray-400 font-mono">{portfolioData.education.period}</span>
                </div>
                <div className="text-xs text-cyan-400 mt-0.5">
                  {portfolioData.education.institution}, {portfolioData.education.location}
                </div>
                <p className="text-xs text-gray-300 mt-2">
                  Key Coursework: {portfolioData.education.coursework.join(', ')}
                </p>
              </div>
            </div>

            {/* Leadership & Experience */}
            <div>
              <div className="flex items-center gap-2 text-purple-300 font-display font-semibold text-base mb-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>EXPERIENCE & LEADERSHIP</span>
              </div>
              <div className="space-y-3">
                {portfolioData.experience.map((exp) => (
                  <div key={exp.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold">
                      <span className="text-white">{exp.role}</span>
                      <span className="text-xs text-gray-400 font-mono">{exp.period}</span>
                    </div>
                    <div className="text-xs text-purple-300">{exp.organization}</div>
                    <ul className="mt-2 list-disc list-inside text-xs text-gray-300 space-y-1">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills */}
            <div>
              <div className="flex items-center gap-2 text-cyan-300 font-display font-semibold text-base mb-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>TECHNICAL PROFICIENCIES</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
                  <span className="font-semibold text-cyan-300 block mb-1">Frontend:</span>
                  <span className="text-gray-300">React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
                  <span className="font-semibold text-purple-300 block mb-1">Backend & Systems:</span>
                  <span className="text-gray-300">Node.js, Express.js, Python, REST APIs, JSON Web Tokens</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
                  <span className="font-semibold text-emerald-300 block mb-1">Databases:</span>
                  <span className="text-gray-300">MongoDB, Firebase, Mongoose ODM</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
                  <span className="font-semibold text-blue-300 block mb-1">Developer Tools:</span>
                  <span className="text-gray-300">Git, GitHub, VS Code, Figma, Postman</span>
                </div>
              </div>
            </div>

            {/* Honors & Hackathon Achievements */}
            <div>
              <div className="flex items-center gap-2 text-amber-300 font-display font-semibold text-base mb-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>HONORS & HACKATHONS</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
                {portfolioData.achievements.map((ach) => (
                  <div key={ach.id} className="flex items-start justify-between text-xs py-1 border-b border-white/5 last:border-0">
                    <div>
                      <span className="font-semibold text-white">{ach.title}</span>
                      <p className="text-gray-400 text-[11px]">{ach.event} • {ach.institution}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[10px] whitespace-nowrap ml-2">
                      {ach.rankBadge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

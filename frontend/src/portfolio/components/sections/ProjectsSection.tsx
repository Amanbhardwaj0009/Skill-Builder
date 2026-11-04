import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Sparkles, Layers, ArrowUpRight, Eye } from 'lucide-react';
import { TiltCard3D } from '../ui/TiltCard3D';
import { ProjectModal } from '../ui/ProjectModal';
import { portfolioData, ProjectItem } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="relative py-28 w-full overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>03 // Showcase</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
            FEATURED <span className="text-gradient-cyan-purple">PROJECTS</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 font-normal">
            Flagship applications solving practical challenges across AI, EdTech, and computer vision.
          </p>
        </div>

        {/* 2x2 Grid of High-Impact Project Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {portfolioData.projects.map((project: ProjectItem) => (
            <TiltCard3D
              key={project.id}
              maxTilt={8}
              scale={1.015}
              className="rounded-3xl cursor-pointer"
            >
              <div
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedProject(project);
                }}
                className="group h-full glass-panel hover:glass-panel-glow border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
              >
                {/* Project Image Banner */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/40 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 font-mono text-[11px] uppercase tracking-wider backdrop-blur-md">
                    {project.category}
                  </div>

                  {/* Inspect Quick Badge */}
                  <div className="absolute top-4 right-4 p-2 rounded-full glass-panel border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-cyan-300" />
                  </div>

                  {/* Title & Tagline in banner bottom */}
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="font-display text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </h3>
                    <p className="text-xs font-mono text-cyan-400/90 mt-1">
                      {project.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-5">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technology Stack Tags */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span>Tech Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300 group-hover:border-cyan-400/30 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div
                    className="pt-4 border-t border-white/10 flex items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={soundEffects.playSuccess}
                      onMouseEnter={soundEffects.playHover}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:opacity-90 transition-opacity"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={soundEffects.playClick}
                      onMouseEnter={soundEffects.playHover}
                      className="flex-1 py-2.5 px-4 rounded-xl glass-panel border border-white/20 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-white/10 hover:border-cyan-400 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>

              </div>
            </TiltCard3D>
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

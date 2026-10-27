import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  CheckCircle2,
  Circle,
  Plus,
  ExternalLink,
  Github,
  Zap,
  Layers,
  Award,
} from 'lucide-react';
import { LevelUpModal } from '../../components/LevelUpModal';

export const ProjectsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New project modal / form state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newRepoUrl, setNewRepoUrl] = useState('');

  // Level up modal
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [unlockedAchs, setUnlockedAchs] = useState<any[]>([]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleToggleTask = async (projectId: string, taskId: string) => {
    const proj = projects.find((p) => p._id === projectId);
    if (!proj) return;

    const updatedTasks = proj.tasks.map((t: any) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    const allDone = updatedTasks.every((t: any) => t.completed);
    const newStatus = allDone ? 'submitted' : 'in_progress';

    try {
      const res = await api.patch(`/projects/${projectId}`, {
        tasks: updatedTasks,
        status: newStatus,
      });

      setProjects((prev) =>
        prev.map((p) => (p._id === projectId ? res.data.project : p))
      );

      if (allDone && proj.status !== 'submitted') {
        await refreshUser();
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        title: newTitle,
        description: newDesc,
        category: newCategory,
        repositoryUrl: newRepoUrl,
      });
      setShowModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewRepoUrl('');
      await fetchProjects();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-purple-400" /> Project Builder
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Build production-grade applications, complete milestone checklists, and export to your public portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/portfolio"
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
          >
            <Award className="h-4 w-4" /> View Portfolio
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-glow-purple hover:bg-purple-500 transition"
          >
            <Plus className="h-4 w-4" /> New Capstone Project
          </button>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const completedCount = proj.tasks.filter((t: any) => t.completed).length;
            const progressPct = Math.round((completedCount / proj.tasks.length) * 100);
            const isCompleted = proj.status === 'submitted' || proj.status === 'approved';

            return (
              <div
                key={proj._id}
                className="flex flex-col justify-between rounded-3xl border border-gray-800 bg-[#121B2D]/90 p-6 shadow-xl backdrop-blur transition hover:border-purple-500/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-lg bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-purple-300">
                      {proj.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-black text-amber-400">
                      <Zap className="h-3.5 w-3.5 fill-amber-400" /> +100 XP Bounty
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{proj.title}</h3>
                  <p className="mt-1 text-xs text-gray-400 leading-relaxed">{proj.description}</p>

                  {/* Task Checklist */}
                  <div className="mt-5 space-y-2 border-t border-gray-800 pt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span className="font-bold text-white">Milestone Tasks</span>
                      <span className="text-cyan-400 font-bold">{progressPct}% Complete</span>
                    </div>

                    <div className="space-y-1.5">
                      {proj.tasks.map((task: any) => (
                        <button
                          key={task.id}
                          onClick={() => handleToggleTask(proj._id, task.id)}
                          className={`flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs transition ${
                            task.completed
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              : 'border-gray-800 bg-[#101626] text-gray-300 hover:border-gray-700'
                          }`}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-600 shrink-0" />
                          )}
                          <span className={task.completed ? 'line-through text-gray-400' : ''}>
                            {task.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer status & links */}
                <div className="mt-6 border-t border-gray-800/80 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {proj.repositoryUrl && (
                      <a
                        href={proj.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-purple-400 hover:underline"
                      >
                        <Github className="h-3.5 w-3.5" /> Code Repo
                      </a>
                    )}
                  </div>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" /> Ready for Portfolio
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400 font-semibold">
                      Complete all tasks to submit
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/40 p-12 text-center">
          <Briefcase className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-300">No active projects</h3>
          <p className="text-xs text-gray-500 mt-1">Start your first practical build to cement your quest knowledge.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
          >
            Create First Project
          </button>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-[#121B2D] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Initialize New Capstone Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Cyberpunk Inventory Management System"
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14] p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe architecture, key capabilities, and target deliverables..."
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14] p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14] p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">GitHub Repo URL (Optional)</label>
                <input
                  type="url"
                  value={newRepoUrl}
                  onChange={(e) => setNewRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14] p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-glow-purple hover:bg-purple-500"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LevelUpModal
        isOpen={levelUpOpen}
        onClose={() => setLevelUpOpen(false)}
        level={newLevel}
        unlockedAchievements={unlockedAchs}
      />
    </div>
  );
};

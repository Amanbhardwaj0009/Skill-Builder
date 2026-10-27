import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  GitFork,
  CheckCircle2,
  Lock,
  ArrowRight,
  Zap,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';

interface SkillNode {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  description: string;
  prerequisites: string[];
  questSlug: string;
  xpReward: number;
}

export const SkillTreePage: React.FC = () => {
  const [completedQuestSlugs, setCompletedQuestSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const skillNodes: SkillNode[] = [
    {
      id: 'html-foundations',
      name: 'HTML Fundamentals',
      category: 'Frontend Core',
      difficulty: 'Beginner',
      description: 'Master semantic layout, DOM hierarchies, and accessible forms.',
      prerequisites: [],
      questSlug: 'html-explorer',
      xpReward: 60,
    },
    {
      id: 'css-architecture',
      name: 'CSS Architecture & Flexbox',
      category: 'Frontend Core',
      difficulty: 'Beginner',
      description: 'One-dimensional alignments, neon glassmorphism, and responsive units.',
      prerequisites: ['html-foundations'],
      questSlug: 'css-architect',
      xpReward: 70,
    },
    {
      id: 'javascript-foundations',
      name: 'JavaScript Logic & Closures',
      category: 'Programming Core',
      difficulty: 'Beginner',
      description: 'Array methods, pure functions, async/await, and scope boundaries.',
      prerequisites: ['html-foundations'],
      questSlug: 'javascript-adventurer',
      xpReward: 80,
    },
    {
      id: 'python-problem-solving',
      name: 'Python Computational Thinking',
      category: 'Algorithms',
      difficulty: 'Beginner',
      description: 'Data transformations, hash maps, list comprehensions, and script optimization.',
      prerequisites: [],
      questSlug: 'python-problem-solver',
      xpReward: 80,
    },
    {
      id: 'dsa-dungeon',
      name: 'Data Structures & Algorithms',
      category: 'Computer Science',
      difficulty: 'Intermediate',
      description: 'Two-pointer technique, sliding window, binary search, and Big-O asymptotic analysis.',
      prerequisites: ['javascript-foundations'],
      questSlug: 'dsa-dungeon',
      xpReward: 120,
    },
    {
      id: 'ai-explorer',
      name: 'AI Models & Neural Foundations',
      category: 'Artificial Intelligence',
      difficulty: 'Intermediate',
      description: 'Transformers, self-attention mechanisms, embeddings, and prompt architecture.',
      prerequisites: ['python-problem-solving'],
      questSlug: 'ai-explorer',
      xpReward: 110,
    },
  ];

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const res = await api.get('/quests');
        const completed = res.data.quests
          ?.filter((q: any) => q.userStatus === 'completed')
          .map((q: any) => q.slug);
        setCompletedQuestSlugs(completed || []);
      } catch (err) {
        console.error('Failed to load quest status for skill tree:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProgress();
  }, []);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <GitFork className="h-7 w-7 text-cyan-400" /> RPG Skill Tree
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Unlock downstream specializations by conquering prerequisite missions.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-purple-500/30 bg-[#121B2D] px-4 py-2 text-xs font-bold text-purple-300">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span>Nodes Unlocked: {completedQuestSlugs.length} / {skillNodes.length}</span>
        </div>
      </div>

      {/* Interactive RPG Node Progression Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillNodes.map((node, index) => {
          const isCompleted = completedQuestSlugs.includes(node.questSlug);
          const prerequisitesMet =
            node.prerequisites.length === 0 ||
            node.prerequisites.every((prereqId) => {
              const prereqNode = skillNodes.find((n) => n.id === prereqId);
              return prereqNode && completedQuestSlugs.includes(prereqNode.questSlug);
            });

          const isUnlocked = prerequisitesMet || isCompleted;

          return (
            <div
              key={node.id}
              className={`relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-300 ${
                isCompleted
                  ? 'border-emerald-500/40 bg-emerald-500/5 shadow-glow-emerald/10'
                  : isUnlocked
                  ? 'border-purple-500/40 bg-[#121B2D] shadow-glow-purple/10 hover:border-purple-400'
                  : 'border-gray-800 bg-[#101626]/50 opacity-60'
              }`}
            >
              <div>
                {/* Node Status Indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-lg bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-gray-300 uppercase">
                    Tier {node.prerequisites.length + 1}
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" /> Mastered
                    </span>
                  ) : isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-cyan-400">
                      <Sparkles className="h-3.5 w-3.5" /> Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-gray-500">
                      <Lock className="h-3.5 w-3.5" /> Locked
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white">{node.name}</h3>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">{node.description}</p>

                {/* Prerequisites requirements */}
                {node.prerequisites.length > 0 && (
                  <div className="mt-4 rounded-xl border border-gray-800 bg-[#080B14] p-2.5 text-[11px]">
                    <span className="font-semibold text-gray-400">Prerequisite Node:</span>{' '}
                    <span className="text-purple-300 font-bold">
                      {skillNodes.find((n) => n.id === node.prerequisites[0])?.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Link */}
              <div className="mt-6 border-t border-gray-800/80 pt-4 flex items-center justify-between">
                <span className="text-xs font-black text-amber-400">+{node.xpReward} XP</span>

                {isUnlocked ? (
                  <Link
                    to={`/quests/${node.questSlug}`}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      isCompleted
                        ? 'border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10'
                        : 'bg-purple-600 text-white shadow-glow-purple hover:bg-purple-500'
                    }`}
                  >
                    <span>{isCompleted ? 'Review Node' : 'Enter Quest Node'}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="text-[11px] text-gray-500 italic">Clear prior tier first</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

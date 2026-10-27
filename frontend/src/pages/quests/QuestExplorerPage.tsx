import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import {
  Search,
  Compass,
  Filter,
  Clock,
  Zap,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Flame,
  ArrowUpDown,
} from 'lucide-react';

export const QuestExplorerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('xp_desc');

  const categories = [
    'All',
    'Web Development',
    'JavaScript',
    'Python',
    'Data Structures and Algorithms',
    'Artificial Intelligence',
  ];

  const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];
  const statuses = ['All', 'not_started', 'in_progress', 'completed'];

  const fetchQuests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/quests', {
        params: {
          category,
          difficulty,
          status,
          search,
          sort,
        },
      });
      setQuests(res.data.quests || []);
    } catch (err) {
      console.error('Failed to load quests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [category, difficulty, status, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuests();
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <Compass className="h-7 w-7 text-purple-400" /> Quest Explorer
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Choose your mission track, conquer stage objectives, and unlock XP rewards.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quest missions..."
            className="w-full rounded-2xl border border-gray-800 bg-[#121B2D] py-2 pl-10 pr-4 text-xs text-white placeholder-gray-500 transition focus:border-purple-500 focus:outline-none"
          />
        </form>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
              category === cat
                ? 'bg-purple-600 text-white shadow-glow-purple/40 border border-purple-400'
                : 'border border-gray-800 bg-[#121B2D]/80 text-gray-400 hover:border-gray-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Auxiliary Filters & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-800 bg-[#101626] p-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 text-gray-400">
            <span>Difficulty:</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-lg border border-gray-800 bg-[#121B2D] px-2 py-1 text-xs text-white focus:outline-none capitalize"
            >
              {difficulties.map((d) => (
                <option key={d} value={d} className="capitalize">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-gray-400">
            <span>Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-gray-800 bg-[#121B2D] px-2 py-1 text-xs text-white focus:outline-none capitalize"
            >
              <option value="All">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 text-gray-400">
          <ArrowUpDown className="h-3.5 w-3.5 text-purple-400" />
          <span>Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-gray-800 bg-[#121B2D] px-2 py-1 text-xs text-white focus:outline-none"
          >
            <option value="xp_desc">XP: Highest First</option>
            <option value="xp_asc">XP: Lowest First</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Quests Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
        </div>
      ) : quests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((quest) => {
            const isCompleted = quest.userStatus === 'completed';
            const isInProgress = quest.userStatus === 'in_progress';

            return (
              <div
                key={quest.id}
                className="group flex flex-col justify-between rounded-3xl border border-gray-800 bg-[#121B2D]/90 p-6 transition duration-200 hover:border-purple-500/50 hover:shadow-glow-purple/20"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-lg bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                      {quest.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-black text-amber-400">
                      <Zap className="h-3.5 w-3.5 fill-amber-400" /> +{quest.xpReward} XP
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                    {quest.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {quest.description}
                  </p>

                  {/* Objectives summary */}
                  {quest.learningObjectives?.length > 0 && (
                    <div className="mt-4 space-y-1.5 border-t border-gray-800/80 pt-3">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Objectives:</p>
                      {quest.learningObjectives.slice(0, 2).map((obj: string, i: number) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-300">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span className="line-clamp-1">{obj}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Footer: Status and Action Button */}
                <div className="mt-6 border-t border-gray-800/80 pt-4">
                  <div className="flex items-center justify-between text-xs mb-3 text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{quest.estimatedDuration}</span>
                    </div>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-400 text-xs">
                        <CheckCircle2 className="h-4 w-4" /> Conquered
                      </span>
                    ) : isInProgress ? (
                      <span className="font-bold text-cyan-400 text-xs">
                        Stage {quest.currentStage} ({quest.progressPercentage}%)
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">Not Started</span>
                    )}
                  </div>

                  <Link
                    to={`/quests/${quest.slug}`}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                      isCompleted
                        ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                        : isInProgress
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple/40 hover:opacity-95'
                        : 'border border-gray-700 bg-gray-800/50 text-white hover:border-purple-500/50 hover:bg-purple-600/20'
                    }`}
                  >
                    <span>
                      {isCompleted ? 'Review Quest Mission' : isInProgress ? 'Continue Quest' : 'Start Quest'}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/40 p-12 text-center">
          <Compass className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-300">No matching quests found</h3>
          <p className="text-xs text-gray-500 mt-1">Try resetting your filters or search keywords.</p>
          <button
            onClick={() => {
              setCategory('All');
              setDifficulty('All');
              setStatus('All');
              setSearch('');
            }}
            className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

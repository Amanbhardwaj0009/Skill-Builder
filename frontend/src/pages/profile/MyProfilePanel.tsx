import React, { useState } from 'react';
import {
  User as UserIcon,
  Briefcase,
  Sparkles,
  Trophy,
  CheckCircle2,
  Lock,
  Plus,
  X,
  Compass,
  Zap,
  Flame,
  ChevronRight,
  Award,
} from 'lucide-react';

interface MyProfilePanelProps {
  user: any;
  currentCareer: string;
  careerCluster: string;
  onSelectCareer: (career: string) => void;
  onSelectCluster: (cluster: string) => void;
  onOpenExploreClusters: () => void;
  onOpenAchievementsModal: () => void;
  achievements: any[];
  onUpdateInterests: (newInterests: string[]) => void;
}

export const MyProfilePanel: React.FC<MyProfilePanelProps> = ({
  user,
  currentCareer,
  careerCluster,
  onSelectCareer,
  onSelectCluster,
  onOpenExploreClusters,
  onOpenAchievementsModal,
  achievements = [],
  onUpdateInterests,
}) => {
  const [newInterestInput, setNewInterestInput] = useState('');
  const [showAddInterest, setShowAddInterest] = useState(false);

  const careerClusters = ['Manufacturing', 'Engineering & Tech', 'Information Tech'];
  const specialtiesForCluster: Record<string, string[]> = {
    'Manufacturing': ['Manufacturing Engineer', 'Industrial Engineer', 'Process Engineer', 'Operations Manager'],
    'Engineering & Tech': ['Robotics Specialist', 'Mechanical Systems Designer', 'Electrical Engineer'],
    'Information Tech': ['Software Developer', 'UI/UX Designer', 'Data Analyst', 'Cybersecurity Analyst'],
  };

  const activeSpecialties = specialtiesForCluster[careerCluster] || specialtiesForCluster['Manufacturing'];

  // Skills with authentic indicators
  const skillsList = [
    { name: 'Problem Solving', score: 88, color: 'from-purple-500 to-indigo-500' },
    { name: 'Critical Thinking', score: 85, color: 'from-cyan-400 to-blue-500' },
    { name: 'Teamwork', score: 92, color: 'from-emerald-400 to-teal-500' },
    { name: 'Industrial Automation', score: 76, color: 'from-amber-400 to-orange-500' },
    { name: 'Presentation', score: 78, color: 'from-pink-500 to-purple-500' },
  ];

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterestInput.trim()) return;
    const currentList = user?.interests || ['Technology', 'Problem Solving', 'Teamwork'];
    if (!currentList.includes(newInterestInput.trim())) {
      onUpdateInterests([...currentList, newInterestInput.trim()]);
    }
    setNewInterestInput('');
    setShowAddInterest(false);
  };

  const handleRemoveInterest = (item: string) => {
    const currentList = user?.interests || [];
    onUpdateInterests(currentList.filter((i: string) => i !== item));
  };

  const userInterests = user?.interests?.length > 0
    ? user.interests
    : ['Technology', 'Problem Solving', 'Teamwork', 'Creativity', 'Data Analysis'];

  return (
    <div className="w-full h-full max-h-[82vh] overflow-y-auto rounded-3xl border border-purple-500/30 bg-[#101626]/85 p-5 md:p-6 shadow-2xl backdrop-blur-xl text-white scrollbar-thin scrollbar-thumb-purple-900/50">
      {/* Section A: My Profile Header */}
      <div className="flex items-center gap-3.5 border-b border-gray-800 pb-4 mb-5">
        <div className="relative">
          <img
            src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex'}
            alt={user?.name || 'Student'}
            className="h-14 w-14 rounded-2xl border-2 border-purple-500/60 bg-[#080B14] object-cover shadow-glow-purple"
          />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-cyan-500 text-[9px] font-black text-white">
            L{user?.currentLevel || 1}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-white truncate">{user?.name || 'Alex Mercer'}</h2>
            <span className="rounded bg-purple-500/20 px-1.5 py-0.2 text-[9px] font-bold text-purple-300">
              RECRUIT
            </span>
          </div>
          <p className="text-xs text-cyan-400 font-semibold truncate flex items-center gap-1 mt-0.5">
            <Briefcase className="h-3 w-3 shrink-0" />
            <span>{currentCareer}</span>
          </p>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
            <span className="flex items-center gap-0.5 text-amber-400 font-bold">
              <Zap className="h-3 w-3 fill-amber-400" /> {user?.currentXP || 0} XP
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-rose-400 font-bold">
              <Flame className="h-3 w-3 fill-rose-400" /> {user?.streak?.currentStreak || 1}d Streak
            </span>
          </div>
        </div>
      </div>

      {/* Section B: Career Clusters */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5" /> Career Clusters
          </span>
          <button
            onClick={onOpenExploreClusters}
            className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-0.5"
          >
            <span>Explore More</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {careerClusters.map((cluster) => {
            const isSelected = careerCluster === cluster;
            return (
              <button
                key={cluster}
                onClick={() => onSelectCluster(cluster)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? 'border border-cyan-400/80 bg-cyan-500/20 text-cyan-200 shadow-glow-cyan/20'
                    : 'border border-gray-800 bg-[#080B14]/80 text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
              >
                {cluster}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section C: Jobs / Specialties */}
      <div className="mb-5">
        <span className="block text-[11px] font-black uppercase tracking-wider text-purple-400 mb-2">
          Jobs / Specialties
        </span>
        <div className="space-y-1.5">
          {activeSpecialties.map((job) => {
            const isSelected = currentCareer === job;
            return (
              <button
                key={job}
                onClick={() => onSelectCareer(job)}
                className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left text-xs transition ${
                  isSelected
                    ? 'border border-purple-500/80 bg-purple-500/20 text-white font-bold shadow-glow-purple/20'
                    : 'border border-gray-800/80 bg-[#080B14]/50 text-gray-300 hover:bg-[#080B14] hover:text-white'
                }`}
              >
                <span>{job}</span>
                {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section D: Interests */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-400">
            Interests
          </span>
          <button
            onClick={() => setShowAddInterest(!showAddInterest)}
            className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-0.5"
          >
            <Plus className="h-3 w-3" /> Add More
          </button>
        </div>

        {showAddInterest && (
          <form onSubmit={handleAddInterest} className="flex gap-2 mb-2">
            <input
              type="text"
              value={newInterestInput}
              onChange={(e) => setNewInterestInput(e.target.value)}
              placeholder="e.g. Robotics, AI..."
              className="flex-1 rounded-xl border border-gray-700 bg-[#080B14] px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-3 py-1 text-xs font-bold text-black hover:opacity-90"
            >
              Add
            </button>
          </form>
        )}

        <div className="flex flex-wrap gap-1.5">
          {userInterests.map((interest: string, i: number) => (
            <span
              key={i}
              className="group inline-flex items-center gap-1 rounded-xl border border-gray-800 bg-[#080B14] px-2.5 py-1 text-[11px] text-gray-300 transition hover:border-purple-500/40"
            >
              <span>{interest}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(interest)}
                className="text-gray-500 hover:text-rose-400 transition"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Section E: Achievements & View All */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-amber-400" /> Achievements
          </span>
          <button
            onClick={onOpenAchievementsModal}
            className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {achievements.slice(0, 2).map((ach: any) => (
            <div
              key={ach.id}
              className={`rounded-2xl border p-2.5 text-left transition ${
                ach.isUnlocked
                  ? 'border-amber-500/30 bg-amber-500/10 text-white'
                  : 'border-gray-800 bg-[#080B14]/60 text-gray-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold mb-0.5">
                <Trophy className={`h-3.5 w-3.5 ${ach.isUnlocked ? 'text-amber-400' : 'text-gray-600'}`} />
                <span className="truncate">{ach.title}</span>
              </div>
              <p className="text-[10px] text-gray-400 line-clamp-1">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section F: Skills Competency Radar */}
      <div className="mb-5">
        <span className="block text-[11px] font-black uppercase tracking-wider text-purple-400 mb-2">
          Competency Skills
        </span>
        <div className="space-y-2">
          {skillsList.map((skill, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-300 font-medium">{skill.name}</span>
                <span className="text-cyan-400 font-bold">{skill.score}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-900 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section G: Badges Showcase */}
      <div>
        <span className="block text-[11px] font-black uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-purple-400" /> Career Badges
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Plant Safety', unlocked: true, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
            { label: 'PLC Logic', unlocked: true, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
            { label: 'Six Sigma', unlocked: false, color: 'text-gray-500 border-gray-800 bg-[#080B14]' },
          ].map((b, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center rounded-2xl border p-2 text-center text-[10px] font-bold ${b.color}`}
            >
              {b.unlocked ? <CheckCircle2 className="h-4 w-4 mb-1" /> : <Lock className="h-4 w-4 mb-1" />}
              <span className="truncate w-full">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

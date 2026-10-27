import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Plus,
  KeyRound,
  CheckCircle2,
  Circle,
  Trophy,
  Zap,
  Sparkles,
  Shield,
  Copy,
  Check,
} from 'lucide-react';

export const TeamChallengesPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [team, setTeam] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals / forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchTeamData = async () => {
    try {
      const [teamRes, lbRes] = await Promise.all([
        api.get('/teams/my'),
        api.get('/teams/leaderboard'),
      ]);
      setTeam(teamRes.data.team);
      setLeaderboard(lbRes.data.teams || []);
    } catch (err) {
      console.error('Failed to load team data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/teams', { name: teamName });
      setTeam(res.data.team);
      setShowCreateModal(false);
      setTeamName('');
      await refreshUser();
      await fetchTeamData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create team');
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/teams/join', { invitationCode: inviteCodeInput });
      setTeam(res.data.team);
      setShowJoinModal(false);
      setInviteCodeInput('');
      await refreshUser();
      await fetchTeamData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to join team');
    }
  };

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    if (!team) return;
    try {
      const res = await api.patch(`/teams/${team._id}/tasks/${taskId}`, {
        completed: !currentCompleted,
      });
      setTeam(res.data.team);
      await fetchTeamData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update squad task');
    }
  };

  const copyInviteCode = () => {
    if (!team?.invitationCode) return;
    navigator.clipboard.writeText(team.invitationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <Users className="h-7 w-7 text-cyan-400" /> Collaborative Squads
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Enlist with fellow learners, tackle timed squad challenges, and compete on the global team leaderboard.
          </p>
        </div>

        {!team && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              <KeyRound className="h-4 w-4" /> Join Squad
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-glow-purple hover:bg-purple-500 transition"
            >
              <Plus className="h-4 w-4" /> Form Squad (+30 XP)
            </button>
          </div>
        )}
      </div>

      {team ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Squad Details & Mission Tasks (Col 2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-purple-500/30 bg-[#121B2D]/90 p-6 shadow-2xl backdrop-blur">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 uppercase">
                      Active Squad
                    </span>
                    <span className="text-xs text-gray-400">Led by {team.leaderId?.name || 'Commander'}</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">{team.name}</h2>
                </div>

                {/* Invite Code Badge */}
                <div className="flex items-center gap-2 rounded-2xl border border-gray-800 bg-[#080B14] p-2 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-500 uppercase">Invite Code</span>
                    <span className="font-mono font-bold text-cyan-400">{team.invitationCode}</span>
                  </div>
                  <button
                    onClick={copyInviteCode}
                    className="rounded-lg bg-gray-800 p-2 text-gray-300 hover:text-white"
                    title="Copy invite code"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Collaborative Challenge & Progress */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs mb-2">
                  <div>
                    <span className="font-bold text-white text-sm">{team.challengeTitle}</span>
                    <p className="text-gray-400 text-xs mt-0.5">{team.challengeDescription}</p>
                  </div>
                  <span className="text-cyan-400 font-bold text-sm shrink-0">{team.progress}% Done</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-900 overflow-hidden border border-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${team.progress}%` }}
                  />
                </div>
              </div>

              {/* Shared Task Checklist */}
              <div className="mt-6 space-y-2.5 border-t border-gray-800 pt-4">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Squad Objectives Checklist
                </p>

                {team.tasks?.map((task: any) => (
                  <button
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs transition ${
                      task.completed
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-gray-800 bg-[#101626] text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {task.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-600 shrink-0" />
                      )}
                      <span className={task.completed ? 'line-through text-gray-400' : ''}>
                        {task.title}
                      </span>
                    </div>

                    {task.assignedTo && (
                      <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300 shrink-0">
                        {task.assignedTo}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Squad Roster (Col 1) */}
          <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/80 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-400" /> Squad Roster ({team.memberIds?.length || 1})
            </h3>

            <div className="space-y-3">
              {team.memberIds?.map((member: any) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between rounded-xl bg-[#101626] p-3 border border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-8 w-8 rounded-lg bg-purple-900/30 object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{member.name}</p>
                      <p className="text-[10px] text-gray-400">Level {member.currentLevel || 1}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-400">
                    {member.currentXP || 0} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/40 p-12 text-center">
          <Users className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white">You are not in a squad</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
            Form a new team to earn 30 bonus XP, or enter an invitation code from a peer to conquer collaborative challenges together.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setShowJoinModal(true)}
              className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-xs font-bold text-gray-200 hover:bg-gray-700"
            >
              Enter Invite Code
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-glow-purple hover:bg-purple-500"
            >
              Form Squad (+30 XP)
            </button>
          </div>
        </div>
      )}

      {/* Squad Leaderboard */}
      <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/80 p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" /> Global Squad Leaderboard
        </h2>

        <div className="space-y-2">
          {leaderboard.map((sq) => (
            <div
              key={sq.id}
              className="flex items-center justify-between rounded-xl bg-[#101626] p-3.5 border border-gray-800 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-lg font-black text-[11px] ${
                    sq.rank === 1
                      ? 'bg-amber-500 text-black shadow-glow-amber'
                      : sq.rank === 2
                      ? 'bg-gray-300 text-black'
                      : sq.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  #{sq.rank}
                </span>
                <div>
                  <p className="font-bold text-white">{sq.name}</p>
                  <p className="text-[10px] text-gray-400">Commander: {sq.leaderName} • {sq.membersCount} members</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-black text-amber-400">{sq.score} PTS</span>
                <span className="block text-[10px] text-cyan-400">{sq.progress}% Done</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-purple-500/30 bg-[#121B2D] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-2">Form Learning Squad</h2>
            <p className="text-xs text-gray-400 mb-4">
              Create a team squad, receive an invitation code, and earn 30 bonus XP.
            </p>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Squad Name</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., CyberPhantoms"
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14] p-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-glow-purple"
                >
                  Form Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/30 bg-[#121B2D] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-2">Join an Existing Squad</h2>
            <p className="text-xs text-gray-400 mb-4">
              Enter the unique invite code provided by your squad commander.
            </p>
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Invitation Code</label>
                <input
                  type="text"
                  required
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value)}
                  placeholder="e.g., SQUAD-7788"
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14] p-2.5 text-xs text-white uppercase tracking-wider focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-2 text-xs font-bold text-black hover:opacity-90 shadow-glow-cyan"
                >
                  Join Squad (+25 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

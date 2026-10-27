import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Users,
  Compass,
  Code2,
  Bot,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
      ]);
      setAnalytics(analyticsRes.data);
      setUsersList(usersRes.data.users || []);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'administrator' ? 'student' : 'administrator';
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const metrics = analytics?.metrics || {};

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Shield className="h-4 w-4" /> Commander Level Access
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            Admin Telemetry Command
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Platform health, learner governance, and content management.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-300 border border-purple-500/30">
          <span>Active Admin Session: {user?.name}</span>
        </div>
      </div>

      {/* Metrics Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Registered Recruits', val: metrics.totalUsers || 0, icon: Users, color: 'text-purple-400' },
          { label: 'Quests Conquered', val: metrics.completedQuests || 0, icon: Compass, color: 'text-cyan-400' },
          { label: 'Arena Submissions', val: metrics.totalSubmissions || 0, icon: Code2, color: 'text-emerald-400' },
          { label: 'AI Mentorship Sessions', val: metrics.totalAiConversations || 0, icon: Bot, color: 'text-amber-400' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="rounded-3xl border border-gray-800 bg-[#121B2D]/80 p-5 backdrop-blur">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-400">{m.label}</span>
                <Icon className={`h-4 w-4 ${m.color}`} />
              </div>
              <p className={`text-2xl font-black ${m.color}`}>{m.val}</p>
            </div>
          );
        })}
      </div>

      {/* User Governance Table */}
      <div className="rounded-3xl border border-gray-800 bg-[#121B2D]/90 shadow-xl overflow-hidden backdrop-blur">
        <div className="border-b border-gray-800 bg-[#101626] p-5">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-400" /> User Registry & Governance
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage student and administrator permissions across all enrolled accounts.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-gray-800 bg-[#080B14] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Recruit</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Level</th>
                <th className="p-4 text-center">XP</th>
                <th className="p-4 text-right">Role Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {usersList.map((u) => (
                <tr key={u._id} className="hover:bg-[#101626]/80 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="h-8 w-8 rounded-xl bg-purple-950/40 object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-[11px] text-gray-400">{u.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${
                        u.role === 'administrator'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {u.role === 'administrator' && <Shield className="h-3 w-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold">L{u.currentLevel || 1}</td>
                  <td className="p-4 text-center font-extrabold text-amber-400">{u.currentXP || 0}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRoleToggle(u._id, u.role)}
                      className={`rounded-xl border px-3 py-1 text-[11px] font-semibold transition ${
                        u.role === 'administrator'
                          ? 'border-rose-500/30 text-rose-300 hover:bg-rose-500/10'
                          : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/10'
                      }`}
                    >
                      {u.role === 'administrator' ? 'Demote to Student' : 'Promote to Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

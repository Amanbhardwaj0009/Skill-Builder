import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  Code2,
  Bot,
  GitFork,
  Briefcase,
  Award,
  Users,
  Trophy,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  Home,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Quest Explorer', path: '/quests', icon: Compass },
    { label: 'Coding Arena', path: '/coding-arena', icon: Code2 },
    { label: 'Build Your World', path: '/build-world', icon: Globe, badge: 'GAME' },
    { label: 'Home Designer', path: '/python-home-designer', icon: Home, badge: '3D' },
    { label: 'AI Mentor', path: '/mentor', icon: Bot, badge: 'AI' },
    { label: 'Skill Tree', path: '/skill-tree', icon: GitFork },
    { label: 'Project Builder', path: '/projects', icon: Briefcase },
    { label: 'Portfolio', path: '/portfolio', icon: Award },
    { label: 'Squad Challenges', path: '/team-challenges', icon: Users },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  if (user?.role === 'administrator') {
    navItems.push({ label: 'Admin Command', path: '/admin', icon: Shield, badge: 'PRO' });
  }

  navItems.push({ label: 'Settings', path: '/settings', icon: Settings });

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-purple-500/20 bg-[#080B14]/95 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Navigation Links */}
      <div className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/40 shadow-glow-purple/20'
                    : 'text-gray-400 hover:bg-[#121B2D] hover:text-gray-200'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0 text-purple-400 group-hover:text-cyan-400 transition" />
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded bg-gradient-to-r from-purple-500 to-cyan-400 px-1.5 py-0.2 text-[9px] font-black text-black">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="border-t border-purple-500/20 p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-800 bg-[#121B2D] py-2 text-xs text-gray-400 hover:text-white hover:border-gray-700 transition"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
};

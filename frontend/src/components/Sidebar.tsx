import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  ChevronDown,
  Building2,
  Globe,
  Home,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Check if current route is within the World Builder section
  const isWorldBuilderRoute =
    location.pathname.startsWith('/build-world') ||
    location.pathname.startsWith('/python-home-designer');

  // Submenu starts expanded if currently on a child route, or by default
  const [worldBuilderOpen, setWorldBuilderOpen] = useState(true);

  // Automatically expand submenu if user navigates to either child route
  useEffect(() => {
    if (isWorldBuilderRoute) {
      setWorldBuilderOpen(true);
    }
  }, [location.pathname, isWorldBuilderRoute]);

  const topNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Quest Explorer', path: '/quests', icon: Compass },
    { label: 'Coding Arena', path: '/coding-arena', icon: Code2 },
  ];

  const bottomNavItems = [
    { label: 'AI Mentor', path: '/mentor', icon: Bot, badge: 'AI' },
    { label: 'Skill Tree', path: '/skill-tree', icon: GitFork },
    { label: 'Project Builder', path: '/projects', icon: Briefcase },
    { label: 'Portfolio', path: '/portfolio', icon: Award },
    { label: 'Squad Challenges', path: '/team-challenges', icon: Users },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  if (user?.role === 'administrator') {
    bottomNavItems.push({ label: 'Admin Command', path: '/admin', icon: Shield, badge: 'PRO' });
  }

  bottomNavItems.push({ label: 'Settings', path: '/settings', icon: Settings });

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-purple-500/20 bg-[#080B14]/95 transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Navigation Links */}
      <div className="flex-1 space-y-1 p-3 overflow-y-auto custom-scrollbar">
        {/* Top Items: Dashboard, Quests, Coding Arena */}
        {topNavItems.map((item) => {
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
                </div>
              )}
            </NavLink>
          );
        })}

        {/* Expandable Parent Section: World Builder */}
        <div className="pt-0.5 pb-0.5">
          <button
            type="button"
            onClick={() => {
              if (collapsed) {
                setCollapsed(false);
                setWorldBuilderOpen(true);
              } else {
                setWorldBuilderOpen(!worldBuilderOpen);
              }
            }}
            aria-expanded={worldBuilderOpen}
            aria-controls="world-builder-submenu"
            className={`group flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              isWorldBuilderRoute
                ? 'bg-gradient-to-r from-purple-950/60 to-indigo-950/40 text-white border border-purple-500/30 shadow-glow-purple/10'
                : 'text-gray-400 hover:bg-[#121B2D] hover:text-gray-200'
            }`}
            title={collapsed ? 'World Builder' : undefined}
          >
            <Building2
              className={`h-5 w-5 shrink-0 transition ${
                isWorldBuilderRoute
                  ? 'text-cyan-400'
                  : 'text-purple-400 group-hover:text-cyan-400'
              }`}
            />
            {!collapsed && (
              <div className="flex flex-1 items-center justify-between">
                <span className="font-bold tracking-wide">World Builder</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    worldBuilderOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </div>
            )}
          </button>

          {/* Child Subsections (Build Your World & Home Designer) */}
          {!collapsed && worldBuilderOpen && (
            <div
              id="world-builder-submenu"
              role="region"
              aria-label="World Builder Submenu"
              className="ml-4 pl-3 border-l-2 border-purple-500/30 space-y-1 mt-1 transition-all duration-300"
            >
              {/* Subsection A: Build Your World */}
              <NavLink
                to="/build-world"
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/40 shadow-glow-purple/20'
                      : 'text-gray-400 hover:bg-[#121B2D] hover:text-gray-200'
                  }`
                }
              >
                <Globe className="h-4 w-4 shrink-0 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div className="flex flex-1 items-center justify-between">
                  <span>Build Your World</span>
                  <span className="rounded bg-gradient-to-r from-purple-500 to-cyan-400 px-1.5 py-0.2 text-[9px] font-black text-black">
                    GAME
                  </span>
                </div>
              </NavLink>

              {/* Subsection B: Home Designer */}
              <NavLink
                to="/python-home-designer"
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/40 shadow-glow-purple/20'
                      : 'text-gray-400 hover:bg-[#121B2D] hover:text-gray-200'
                  }`
                }
              >
                <Home className="h-4 w-4 shrink-0 text-purple-400 group-hover:scale-110 transition-transform" />
                <div className="flex flex-1 items-center justify-between">
                  <span>Home Designer</span>
                  <span className="rounded bg-gradient-to-r from-cyan-400 to-emerald-400 px-1.5 py-0.2 text-[9px] font-black text-black">
                    3D
                  </span>
                </div>
              </NavLink>
            </div>
          )}
        </div>

        {/* Bottom Items: Mentor, Skill Tree, Projects, Portfolio, Teams, Leaderboard, etc. */}
        {bottomNavItems.map((item) => {
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

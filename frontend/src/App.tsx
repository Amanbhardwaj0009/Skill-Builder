import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';

import { DashboardPage } from './pages/dashboard/DashboardPage';
import { QuestExplorerPage } from './pages/quests/QuestExplorerPage';
import { QuestDetailPage } from './pages/quests/QuestDetailPage';
import { CodingArenaPage } from './pages/coding-arena/CodingArenaPage';
import { MentorPage } from './pages/mentor/MentorPage';
import { SkillTreePage } from './pages/skill-tree/SkillTreePage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { PortfolioPage } from './pages/projects/PortfolioPage';
import { TeamChallengesPage } from './pages/teams/TeamChallengesPage';
import { LeaderboardPage } from './pages/leaderboard/LeaderboardPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { BuildWorldPage } from './pages/build-world/BuildWorldPage';
import { SettingsPage } from './pages/profile/SettingsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Application Shell */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />

            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/quests" element={<QuestExplorerPage />} />
              <Route path="/quests/:questId" element={<QuestDetailPage />} />
              <Route path="/coding-arena" element={<CodingArenaPage />} />
              <Route path="/build-world" element={<BuildWorldPage />} />
              <Route path="/mentor" element={<MentorPage />} />
              <Route path="/skill-tree" element={<SkillTreePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:userId" element={<PortfolioPage />} />
              <Route path="/team-challenges" element={<TeamChallengesPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Admin Protected Route */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

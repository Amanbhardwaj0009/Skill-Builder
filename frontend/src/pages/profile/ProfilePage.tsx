import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { IndustrialEnvironment } from './IndustrialEnvironment';
import { VirtualCharacter } from './VirtualCharacter';
import { CharacterScene } from './3d/CharacterScene';
import { MyProfilePanel } from './MyProfilePanel';
import { CareerCoachPanel } from './CareerCoachPanel';
import { GamingHUD } from './GamingHUD';
import { CareerPathwaysModal } from './CareerPathwaysModal';
import { ExploreClustersModal } from './ExploreClustersModal';
import { AchievementsViewAllModal } from './AchievementsViewAllModal';
import { Bot, Sparkles, User, ChevronLeft } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Active Career & Cluster State
  const [currentCareer, setCurrentCareer] = useState<string>(
    user?.currentCareer || 'Manufacturing Engineer'
  );
  const [careerCluster, setCareerCluster] = useState<string>(
    user?.careerCluster || 'Manufacturing'
  );

  // Panels visibility (on mobile/desktop toggle)
  const [coachOpen, setCoachOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<'profile' | 'character' | 'coach'>('character');
  const [use3DMode, setUse3DMode] = useState<boolean>(true);

  // Modals state
  const [pathwaysModalOpen, setPathwaysModalOpen] = useState(false);
  const [clustersModalOpen, setClustersModalOpen] = useState(false);
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/gamification/profile');
        setProfileData(res.data);
        if (res.data.user?.currentCareer) {
          setCurrentCareer(res.data.user.currentCareer);
        }
        if (res.data.user?.careerCluster) {
          setCareerCluster(res.data.user.careerCluster);
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Career Switching Handler with Persistence
  const handleSelectCareer = async (career: string) => {
    setCurrentCareer(career);
    try {
      await api.patch('/auth/profile', { currentCareer: career });
      await refreshUser();
    } catch (err) {
      console.warn('Note: saved career locally:', err);
    }
  };

  const handleSelectCluster = async (cluster: string) => {
    setCareerCluster(cluster);
    try {
      await api.patch('/auth/profile', { careerCluster: cluster });
      await refreshUser();
    } catch (err) {
      console.warn('Note: saved cluster locally:', err);
    }
  };

  const handleUpdateInterests = async (newInterests: string[]) => {
    try {
      await api.patch('/auth/profile', { interests: newInterests });
      await refreshUser();
    } catch (err) {
      console.warn('Failed to update interests:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080B14]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-glow-purple" />
          <p className="text-xs font-semibold tracking-wider text-purple-300 uppercase">
            Loading Virtual Career Simulation...
          </p>
        </div>
      </div>
    );
  }

  const achievements = profileData?.achievements || [];

  return (
    <div className="relative -m-4 md:-m-8 h-[calc(100vh-4rem)] w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] overflow-hidden bg-[#080B14] flex flex-col justify-between select-none">
      {/* 1. Full-Screen Industrial Environment */}
      <IndustrialEnvironment careerName={currentCareer} />

      {/* Mobile Mode Switcher Tabs (Only visible on small mobile screens) */}
      <div className="lg:hidden relative z-30 flex items-center justify-center gap-2 pt-3 px-4">
        <div className="flex rounded-2xl border border-purple-500/30 bg-[#121B2D]/90 p-1 text-xs backdrop-blur-md">
          <button
            onClick={() => setMobileTab('profile')}
            className={`rounded-xl px-3 py-1 font-bold transition ${
              mobileTab === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-400'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setMobileTab('character')}
            className={`rounded-xl px-3 py-1 font-bold transition ${
              mobileTab === 'character' ? 'bg-purple-600 text-white' : 'text-gray-400'
            }`}
          >
            Virtual Character
          </button>
          <button
            onClick={() => setMobileTab('coach')}
            className={`rounded-xl px-3 py-1 font-bold transition ${
              mobileTab === 'coach' ? 'bg-purple-600 text-white' : 'text-gray-400'
            }`}
          >
            Career Coach
          </button>
        </div>
      </div>

      {/* Main Viewport Stage: 3-Element Layout (Left Panel, Central Character, Right Coach) */}
      <div className="relative z-20 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 sm:px-6 md:px-8 py-2 overflow-hidden items-end">
        {/* Element 3: Left Floating "My Profile" Panel (Col 3 or 4) */}
        <div
          className={`lg:col-span-3 xl:col-span-3 h-full max-h-[76vh] flex flex-col justify-end transition-all duration-300 ${
            mobileTab === 'profile' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <MyProfilePanel
            user={user}
            currentCareer={currentCareer}
            careerCluster={careerCluster}
            onSelectCareer={handleSelectCareer}
            onSelectCluster={handleSelectCluster}
            onOpenExploreClusters={() => setClustersModalOpen(true)}
            onOpenAchievementsModal={() => setAchievementsModalOpen(true)}
            achievements={achievements}
            onUpdateInterests={handleUpdateInterests}
          />
        </div>

        {/* Element 2: Realistic Animated 3D Character Lobby (Col 6) */}
        <div
          className={`lg:col-span-6 xl:col-span-6 h-full flex flex-col items-center justify-end relative pb-2 ${
            mobileTab === 'character' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* 3D Engine Mode Toggle Badge */}
          <div className="absolute top-2 right-4 z-30 flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-[#0C1222]/80 px-2.5 py-1 text-[10px] font-bold text-gray-300 backdrop-blur-md">
            <span
              className={`h-2 w-2 rounded-full ${
                use3DMode ? 'bg-cyan-400 animate-pulse' : 'bg-gray-500'
              }`}
            />
            <span>{use3DMode ? '3D Game Lobby' : '2D Mode'}</span>
            <button
              onClick={() => setUse3DMode(!use3DMode)}
              className="ml-1 text-purple-400 hover:text-white underline decoration-purple-500"
            >
              {use3DMode ? 'Switch to 2D' : 'Switch to 3D'}
            </button>
          </div>

          {use3DMode ? (
            <CharacterScene
              careerName={currentCareer}
              studentName={user?.name?.split(' ')[0] || 'Alex'}
              onFallbackTo2D={() => setUse3DMode(false)}
            />
          ) : (
            <VirtualCharacter
              careerName={currentCareer}
              studentName={user?.name?.split(' ')[0] || 'Alex'}
            />
          )}
        </div>

        {/* Element 4: Right Floating "Career Coach" Panel (Col 3) */}
        <div
          className={`lg:col-span-3 xl:col-span-3 h-full max-h-[76vh] flex flex-col justify-end relative transition-all duration-300 ${
            mobileTab === 'coach' ? 'block' : coachOpen ? 'hidden lg:flex' : 'hidden'
          }`}
        >
          <CareerCoachPanel
            careerName={currentCareer}
            onClose={() => setCoachOpen(false)}
            onSelectCareer={handleSelectCareer}
          />
        </div>

        {/* Floating Reopen Button if Coach is closed on desktop */}
        {!coachOpen && (
          <button
            onClick={() => setCoachOpen(true)}
            className="hidden lg:flex absolute top-6 right-8 z-30 items-center gap-2 rounded-2xl border border-cyan-400/60 bg-[#121B2D]/90 px-4 py-2 text-xs font-bold text-cyan-300 shadow-glow-cyan backdrop-blur-md hover:bg-[#121B2D] transition"
          >
            <Bot className="h-4 w-4" />
            <span>Open Career Coach</span>
          </button>
        )}
      </div>

      {/* Element 5: Gaming HUD along the Bottom */}
      <div className="relative z-30 p-3 sm:p-4">
        <GamingHUD
          user={user}
          currentCareer={currentCareer}
          onOpenPathways={() => setPathwaysModalOpen(true)}
          onOpenAchievements={() => setAchievementsModalOpen(true)}
        />
      </div>

      {/* Modals */}
      <CareerPathwaysModal
        isOpen={pathwaysModalOpen}
        onClose={() => setPathwaysModalOpen(false)}
        careerName={currentCareer}
        onSelectCareer={handleSelectCareer}
      />

      <ExploreClustersModal
        isOpen={clustersModalOpen}
        onClose={() => setClustersModalOpen(false)}
        selectedCluster={careerCluster}
        onSelectCluster={handleSelectCluster}
        onSelectCareer={handleSelectCareer}
      />

      <AchievementsViewAllModal
        isOpen={achievementsModalOpen}
        onClose={() => setAchievementsModalOpen(false)}
        achievements={achievements}
      />
    </div>
  );
};

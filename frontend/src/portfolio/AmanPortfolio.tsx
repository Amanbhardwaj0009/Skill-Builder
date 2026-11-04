import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { AchievementsSection } from './components/sections/AchievementsSection';
import { EducationSection } from './components/sections/EducationSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';
import { CustomCursor } from './components/ui/CustomCursor';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ResumeModal } from './components/ui/ResumeModal';
import { DynamicBackground, PortfolioTheme } from './components/ui/DynamicBackground';
import { ThemeSelector } from './components/ui/ThemeSelector';

export const AmanPortfolio: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [theme, setTheme] = useState<PortfolioTheme>(() => {
    return (localStorage.getItem('aman_portfolio_theme') as PortfolioTheme) || 'nebula';
  });

  const handleThemeChange = (newTheme: PortfolioTheme) => {
    setTheme(newTheme);
    localStorage.setItem('aman_portfolio_theme', newTheme);
  };

  // Active section scroll spy using IntersectionObserver
  useEffect(() => {
    const sectionIds = [
      'home',
      'about',
      'skills',
      'projects',
      'experience',
      'achievements',
      'education',
      'contact',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <div className="relative min-h-screen text-[#F8FAFC] selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Dynamic Animated Atmospheric Canvas & Theme Mesh */}
      <DynamicBackground theme={theme} />

      {/* Loading Boot Animation */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Modern Floating Glassmorphic Navbar */}
      <Navbar
        activeSection={activeSection}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Main Portfolio Sections */}
      <main className="relative flex flex-col w-full z-10">
        <HeroSection onOpenResume={() => setIsResumeOpen(true)} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <AchievementsSection />
        <EducationSection />
        <ContactSection />
      </main>

      {/* Cyber Aesthetic Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Floating 1-Click Theme Switcher */}
      <ThemeSelector
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* Interactive Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
};

export default AmanPortfolio;

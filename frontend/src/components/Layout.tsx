import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#080B14] text-[#F8FAFC]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="relative flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#101626] via-[#080B14] to-[#080B14] p-4 md:p-8">
          {/* Subtle background ambient glow */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/10 blur-[120px]" />
          <div className="pointer-events-none absolute top-1/3 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

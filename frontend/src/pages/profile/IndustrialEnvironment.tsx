import React from 'react';

interface IndustrialEnvironmentProps {
  careerName?: string;
}

export const IndustrialEnvironment: React.FC<IndustrialEnvironmentProps> = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Deep Space Navy Background Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080F] via-[#0B0F1C] to-[#04060A]" />

      {/* 2. High-Tech Industrial Gantry & Window Background */}
      <svg
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="neonPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="neonCyan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#080B14" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="trussGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="floorReflection" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#161F33" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#0E1626" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#05070D" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="ambientPurple" cx="50%" cy="35%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#080B14" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Overhead Light Bloom */}
        <circle cx="960" cy="300" r="600" fill="url(#ambientPurple)" />
        <circle cx="400" cy="200" r="400" fill="#38BDF8" fillOpacity="0.06" />
        <circle cx="1520" cy="200" r="400" fill="#8B5CF6" fillOpacity="0.08" />

        {/* Giant Cathedral Industrial Window Grid */}
        <g opacity="0.35" stroke="#38BDF8" strokeWidth="1">
          {/* Main Arched Window Panes */}
          <rect x="250" y="80" width="300" height="420" rx="20" fill="#0C1424" fillOpacity="0.6" />
          <line x1="400" y1="80" x2="400" y2="500" />
          <line x1="250" y1="220" x2="550" y2="220" />
          <line x1="250" y1="360" x2="550" y2="360" />

          <rect x="810" y="50" width="300" height="450" rx="20" fill="#101A30" fillOpacity="0.7" />
          <line x1="960" y1="50" x2="960" y2="500" />
          <line x1="810" y1="200" x2="1110" y2="200" />
          <line x1="810" y1="350" x2="1110" y2="350" />

          <rect x="1370" y="80" width="300" height="420" rx="20" fill="#0C1424" fillOpacity="0.6" />
          <line x1="1520" y1="80" x2="1520" y2="500" />
          <line x1="1370" y1="220" x2="1670" y2="220" />
          <line x1="1370" y1="360" x2="1670" y2="360" />
        </g>

        {/* Overhead Gantry Trusses & Heavy Crane Tracks */}
        <g opacity="0.7">
          {/* Horizontal Upper Support Beam */}
          <rect x="0" y="40" width="1920" height="24" fill="url(#trussGrad)" />
          <line x1="0" y1="64" x2="1920" y2="64" stroke="#8B5CF6" strokeWidth="3" opacity="0.8" />

          {/* Secondary Structural Cross-Braces */}
          <path d="M0 64 L200 160 L400 64 L600 160 L800 64 L1000 160 L1200 64 L1400 160 L1600 64 L1800 160 L1920 100" stroke="#1E293B" strokeWidth="4" fill="none" />
          <line x1="0" y1="160" x2="1920" y2="160" stroke="#334155" strokeWidth="6" />

          {/* Neon Light Tubes on Gantries */}
          <line x1="200" y1="164" x2="600" y2="164" stroke="#38BDF8" strokeWidth="3" opacity="0.9" filter="drop-shadow(0 0 8px #38BDF8)" />
          <line x1="800" y1="164" x2="1120" y2="164" stroke="#8B5CF6" strokeWidth="3" opacity="0.9" filter="drop-shadow(0 0 8px #8B5CF6)" />
          <line x1="1320" y1="164" x2="1720" y2="164" stroke="#38BDF8" strokeWidth="3" opacity="0.9" filter="drop-shadow(0 0 8px #38BDF8)" />

          {/* Vertical Pillars */}
          <rect x="180" y="40" width="30" height="580" fill="#0F172A" stroke="#1E293B" />
          <rect x="1710" y="40" width="30" height="580" fill="#0F172A" stroke="#1E293B" />
        </g>

        {/* Industrial Automated Robotic Machinery & Background Enclosures */}
        <g opacity="0.5">
          {/* Left Robotic Cell */}
          <rect x="80" y="460" width="160" height="200" rx="8" fill="#131D33" stroke="#1E293B" />
          {/* Articulated Arm */}
          <path d="M160 460 L130 380 L190 320" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="160" cy="460" r="14" fill="#334155" />
          <circle cx="130" cy="380" r="10" fill="#475569" />
          <circle cx="190" cy="320" r="8" fill="#F59E0B" />
          {/* Robotic Tool Head Glow */}
          <circle cx="190" cy="320" r="4" fill="#00F0FF" />

          {/* Right Robotic Cell */}
          <rect x="1680" y="460" width="160" height="200" rx="8" fill="#131D33" stroke="#1E293B" />
          <path d="M1760 460 L1790 370 L1730 310" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="1760" cy="460" r="14" fill="#334155" />
          <circle cx="1790" cy="370" r="10" fill="#475569" />
          <circle cx="1730" cy="310" r="8" fill="#F59E0B" />
          <circle cx="1730" cy="310" r="4" fill="#8B5CF6" />

          {/* Center-Back Automation Line & Telemetry Dashboard */}
          <rect x="720" y="420" width="480" height="180" rx="12" fill="#0F172A" stroke="#1E293B" />
          <line x1="720" y1="460" x2="1200" y2="460" stroke="#38BDF8" strokeWidth="2" opacity="0.6" />
          <rect x="800" y="435" width="80" height="14" rx="4" fill="#8B5CF6" fillOpacity="0.4" />
          <rect x="900" y="435" width="120" height="14" rx="4" fill="#38BDF8" fillOpacity="0.3" />
          <rect x="1040" y="435" width="60" height="14" rx="4" fill="#10B981" fillOpacity="0.5" />
        </g>

        {/* 3. High-Gloss Reflective Factory Floor with Grid & Depth */}
        <polygon points="0,580 1920,580 1920,1080 0,1080" fill="url(#floorReflection)" />
        
        {/* Floor Neon Boundary Guide Strips */}
        <line x1="0" y1="580" x2="1920" y2="580" stroke="#8B5CF6" strokeWidth="2" opacity="0.6" />
        
        {/* Perspective Floor Grid Lines */}
        <g stroke="#38BDF8" strokeWidth="1" opacity="0.25">
          <line x1="960" y1="580" x2="960" y2="1080" />
          <line x1="960" y1="580" x2="680" y2="1080" />
          <line x1="960" y1="580" x2="1240" y2="1080" />
          <line x1="960" y1="580" x2="400" y2="1080" />
          <line x1="960" y1="580" x2="1520" y2="1080" />
          <line x1="960" y1="580" x2="100" y2="1080" />
          <line x1="960" y1="580" x2="1820" y2="1080" />

          {/* Horizontal Floor Perspective Bands */}
          <line x1="0" y1="620" x2="1920" y2="620" strokeWidth="1" opacity="0.2" />
          <line x1="0" y1="680" x2="1920" y2="680" strokeWidth="1" opacity="0.3" />
          <line x1="0" y1="760" x2="1920" y2="760" strokeWidth="1" opacity="0.4" />
          <line x1="0" y1="870" x2="1920" y2="870" strokeWidth="1.5" opacity="0.5" />
          <line x1="0" y1="1010" x2="1920" y2="1010" strokeWidth="2" opacity="0.6" stroke="#8B5CF6" />
        </g>

        {/* Center Pedestal Illumination for Character */}
        <ellipse cx="960" cy="850" rx="220" ry="60" fill="#8B5CF6" fillOpacity="0.18" filter="blur(20px)" />
        <ellipse cx="960" cy="860" rx="150" ry="35" fill="#38BDF8" fillOpacity="0.2" filter="blur(15px)" />
        <ellipse cx="960" cy="860" rx="90" ry="20" fill="#00F0FF" fillOpacity="0.15" />
      </svg>

      {/* Floating Volumetric Light Cones & Floating Cyber Dust */}
      <div className="absolute top-0 left-1/4 w-96 h-full bg-gradient-to-b from-purple-500/10 via-transparent to-transparent -rotate-12 blur-3xl opacity-60" />
      <div className="absolute top-0 right-1/4 w-96 h-full bg-gradient-to-b from-cyan-400/10 via-transparent to-transparent rotate-12 blur-3xl opacity-60" />

      {/* Subtle Animated Pulsing Steam / Atmospheric Mist */}
      <div className="absolute bottom-16 left-1/3 w-80 h-32 rounded-full bg-cyan-500/5 blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-1/3 w-80 h-32 rounded-full bg-purple-500/5 blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
    </div>
  );
};

import React, { useEffect, useRef } from 'react';

export type PortfolioTheme = 'nebula' | 'matrix' | 'synthwave' | 'oceanic';

interface DynamicBackgroundProps {
  theme: PortfolioTheme;
}

const themeConfigs: Record<
  PortfolioTheme,
  {
    bgClass: string;
    particleColors: string[];
    lineColor: string;
    blob1: string;
    blob2: string;
    blob3: string;
  }
> = {
  nebula: {
    bgClass: 'bg-gradient-to-b from-[#06020f] via-[#0b051c] to-[#04010a]',
    particleColors: ['#a855f7', '#00f0ff', '#c084fc', '#38bdf8', '#e879f9'],
    lineColor: 'rgba(168, 85, 247, 0.12)',
    blob1: 'bg-purple-600/20',
    blob2: 'bg-cyan-500/15',
    blob3: 'bg-fuchsia-600/15',
  },
  matrix: {
    bgClass: 'bg-gradient-to-b from-[#020706] via-[#031310] to-[#010505]',
    particleColors: ['#10b981', '#00f0ff', '#34d399', '#059669', '#a7f3d0'],
    lineColor: 'rgba(16, 185, 129, 0.14)',
    blob1: 'bg-emerald-500/18',
    blob2: 'bg-cyan-500/15',
    blob3: 'bg-teal-600/15',
  },
  synthwave: {
    bgClass: 'bg-gradient-to-b from-[#0c0316] via-[#1a052e] to-[#080210]',
    particleColors: ['#ec4899', '#8b5cf6', '#f43f5e', '#a855f7', '#fb7185'],
    lineColor: 'rgba(236, 72, 153, 0.14)',
    blob1: 'bg-pink-600/22',
    blob2: 'bg-purple-600/20',
    blob3: 'bg-rose-500/15',
  },
  oceanic: {
    bgClass: 'bg-gradient-to-b from-[#010714] via-[#02142b] to-[#01040a]',
    particleColors: ['#00f0ff', '#38bdf8', '#0284c7', '#60a5fa', '#06b6d4'],
    lineColor: 'rgba(56, 189, 248, 0.14)',
    blob1: 'bg-cyan-500/20',
    blob2: 'bg-blue-600/18',
    blob3: 'bg-sky-500/15',
  },
};

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = themeConfigs[theme] || themeConfigs.nebula;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes definition
    const count = Math.min(Math.floor((width * height) / 18000), 75);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = config.particleColors;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.25,
      });
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections
      const maxDistance = 120;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.22;
            ctx.strokeStyle = config.lineColor.replace(/[\d.]+\)$/, `${alpha})`);
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing particles
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow aura on larger particles
        if (p.radius > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.globalAlpha = p.alpha * 0.2;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, config]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-700 ${config.bgClass}`}>
      {/* Dynamic Animated Ambient Color Nebulae */}
      <div
        className={`absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full blur-[140px] pointer-events-none animate-pulse-slow ${config.blob1}`}
      />
      <div
        className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[160px] pointer-events-none animate-pulse-slow ${config.blob2}`}
      />
      <div
        className={`absolute top-[40%] right-[15%] w-[40vw] h-[40vw] rounded-full blur-[150px] pointer-events-none ${config.blob3}`}
      />

      {/* Cyber Grid Overlay with Theme-specific Hue */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      {/* Interactive Constellation Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

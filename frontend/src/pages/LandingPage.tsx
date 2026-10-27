import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Bot,
  Code2,
  Trophy,
  Users,
  Compass,
  CheckCircle2,
  Flame,
  Terminal,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080B14] text-[#F8FAFC]">
      {/* Background cyber grid & glow effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      <div className="pointer-events-none absolute top-[-150px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[150px]" />
      <div className="pointer-events-none absolute top-[30%] right-[-100px] h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[140px]" />

      {/* Top Header */}
      <header className="relative z-20 flex h-20 items-center justify-between border-b border-purple-500/10 px-6 max-w-7xl mx-auto md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px] shadow-glow-purple">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#080B14]">
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <span className="font-display text-xl font-bold tracking-wider text-white">
            SKILLQUEST <span className="text-cyan-400">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-400">
          <a href="#paths" className="hover:text-cyan-400 transition">Learning Paths</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition">How It Works</a>
          <a href="#features" className="hover:text-cyan-400 transition">Platform Features</a>
          <Link to="/leaderboard" className="hover:text-cyan-400 transition">Leaderboard</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs font-semibold text-gray-300 hover:text-white transition">
            Sign In
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-glow-purple transition hover:scale-105"
          >
            <span>Play Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-20 md:px-12 md:pt-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-md mb-8 shadow-glow-purple/20">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Next-Generation Gamified Learning Engine</span>
        </div>

        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:leading-[1.15]">
          Level Up Your Skills. <br />
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">
            One Quest at a Time.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-gray-400 leading-relaxed">
          Learn smarter with AI-powered missions, interactive challenges, real-world projects, and a learning experience designed around you.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-4 text-sm font-bold text-white shadow-glow-purple transition hover:opacity-90 hover:scale-105"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/quests"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-gray-800 bg-[#121B2D]/90 px-8 py-4 text-sm font-semibold text-gray-300 hover:border-purple-500/50 hover:text-white transition"
          >
            <Compass className="h-4 w-4 text-cyan-400" />
            <span>Explore Quests</span>
          </Link>
        </div>

        {/* Live Futuristic Interactive Dashboard Preview */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-3xl border border-purple-500/30 bg-[#121B2D]/80 p-4 sm:p-6 shadow-2xl backdrop-blur-xl animate-float">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-rose-500" />
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-xs text-gray-500">skillquest://control-hub/player-profile</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Flame className="h-3.5 w-3.5" /> 5-Day Streak
              </div>
              <div className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-300">
                Level 3 (840 XP)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
            {/* Active Quest Preview */}
            <div className="md:col-span-2 rounded-2xl border border-purple-500/20 bg-[#101626] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">Active Mission</span>
                <span className="text-xs font-bold text-emerald-400">Stage 3/5</span>
              </div>
              <h3 className="text-base font-bold text-white">JavaScript Adventurer: Functional Logic</h3>
              <p className="mt-1 text-xs text-gray-400">Solve array transformations using map, filter, and algorithmic reduction.</p>
              
              <div className="mt-4">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-gray-400">Mission Progress</span>
                  <span className="text-cyan-400 font-bold">60%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full w-[60%]" />
                </div>
              </div>
            </div>

            {/* AI Mentor Companion Preview */}
            <div className="rounded-2xl border border-cyan-500/20 bg-[#101626] p-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-cyan-400">
                <Bot className="h-4 w-4" /> AI Mentor Transmitting
              </div>
              <div className="rounded-xl bg-[#080B14] p-3 text-[11px] font-mono text-gray-300 border border-gray-800/80">
                <span className="text-purple-400">Mentor:</span> "Remember, .filter() produces a shallow copy. Check the parity test condition!"
              </div>
              <div className="mt-3 flex justify-between items-center text-xs">
                <span className="text-gray-400">Reward:</span>
                <span className="font-bold text-amber-400">+80 XP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-12 border-t border-purple-500/10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">The Journey</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">How It Works</h2>
          <p className="mt-3 text-sm text-gray-400">Transform your learning curve into a thrilling RPG progression system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Choose Path', desc: 'Select your track from Web Dev, Python, DSA, or AI.', icon: Compass },
            { step: '02', title: 'Start Missions', desc: 'Engage with guided concept stages and live code sandboxes.', icon: Zap },
            { step: '03', title: 'Solve Challenges', desc: 'Write verified code in Monaco Editor against hidden tests.', icon: Code2 },
            { step: '04', title: 'Earn XP & Level', desc: 'Unlock achievements, climb leaderboards, and maintain streaks.', icon: Trophy },
            { step: '05', title: 'Build Projects', desc: 'Ship portfolio projects and show off verified skills to recruiters.', icon: Shield },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative rounded-2xl border border-gray-800 bg-[#121B2D]/70 p-5 backdrop-blur hover:border-purple-500/40 transition">
                <span className="font-display text-2xl font-black text-purple-500/30">{item.step}</span>
                <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-cyan-400 mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Learning Paths */}
      <section id="paths" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-12 border-t border-purple-500/10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Skill Arenas</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">Featured Learning Paths</h2>
          <p className="mt-3 text-sm text-gray-400">Structured roadmaps from beginner basics to production mastery.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Web Development', desc: 'HTML5, CSS3, Flexbox, Tailwind, modern DOM and reactive frontends.', xp: '350 XP', level: 'Beginner to Advanced', color: 'from-purple-500 to-indigo-600' },
            { title: 'Python Programming', desc: 'Scripting, list comprehensions, functional paradigms, and data processing.', xp: '400 XP', level: 'Beginner', color: 'from-cyan-500 to-blue-600' },
            { title: 'Data Structures & Algorithms', desc: 'Two-pointer, Hash Maps, Binary Search, Big O asymptotic analysis.', xp: '600 XP', level: 'Intermediate', color: 'from-emerald-500 to-teal-600' },
            { title: 'AI & Machine Learning', desc: 'Neural nets, Transformer attention, embeddings, and prompt architecture.', xp: '550 XP', level: 'Intermediate', color: 'from-fuchsia-500 to-purple-600' },
            { title: 'Mathematics for CS', desc: 'Discrete math, boolean algebra, probability, and graph theory basics.', xp: '300 XP', level: 'Foundational', color: 'from-amber-500 to-orange-600' },
            { title: 'Computer Science Fundamentals', desc: 'Operating systems, memory layout, networks, and CPU instruction pipelines.', xp: '450 XP', level: 'Core', color: 'from-indigo-500 to-cyan-600' },
          ].map((path, idx) => (
            <div key={idx} className="group rounded-3xl border border-gray-800 bg-[#121B2D]/80 p-6 transition hover:border-purple-500/50 hover:shadow-glow-purple/20">
              <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${path.color} mb-4`} />
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>{path.level}</span>
                <span className="font-bold text-amber-400">{path.xp}</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">{path.title}</h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">{path.desc}</p>
              <Link
                to="/quests"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition"
              >
                <span>Enter Arena</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:px-12 border-t border-purple-500/10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Futuristic Arsenal</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">Platform Features</h2>
          <p className="mt-3 text-sm text-gray-400">Everything you need to turn learning into effortless execution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Bot, title: 'AI Learning Mentor', desc: 'Conversational assistant with bilingual English and Hindi explanations, code error reviews, and graduated hints.' },
            { icon: Code2, title: 'Interactive Coding Arena', desc: 'Monaco-powered execution environment running JavaScript, Python, and live HTML/CSS previews against test suites.' },
            { icon: Compass, title: 'Quest-Based Learning', desc: 'Step-by-step modular stages combining concepts, examples, knowledge quizzes, and coding challenges.' },
            { icon: Zap, title: 'Gamification Engine', desc: 'Strict anti-abuse XP engine, automatic streak monitoring, RPG levels, and authentic unlockable achievements.' },
            { icon: Shield, title: 'Project Builder & Portfolio', desc: 'Turn completed concepts into tangible projects with checklists and a verified public developer showcase.' },
            { icon: Users, title: 'Collaborative Squads', desc: 'Create squads, join with invite codes, tackle group challenges, and compete on the global team leaderboard.' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="rounded-3xl border border-gray-800 bg-[#121B2D]/60 p-6 backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social Proof (Identified as Demo Data) */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-12 text-center border-t border-purple-500/10">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          [Telemetry Preview & Benchmark Data]
        </p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/40 p-4">
            <span className="font-display text-2xl font-black text-cyan-400">10,000+</span>
            <p className="mt-1 text-xs text-gray-400">Missions Completed</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/40 p-4">
            <span className="font-display text-2xl font-black text-purple-400">98.4%</span>
            <p className="mt-1 text-xs text-gray-400">Concept Retention</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/40 p-4">
            <span className="font-display text-2xl font-black text-amber-400">250,000+</span>
            <p className="mt-1 text-xs text-gray-400">XP Awarded</p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-[#121B2D]/40 p-4">
            <span className="font-display text-2xl font-black text-emerald-400">1,200+</span>
            <p className="mt-1 text-xs text-gray-400">Active Squads</p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center">
        <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-b from-[#121B2D] to-[#101626] p-10 md:p-16 shadow-glow-purple/20">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-5xl">
            Your Next Level Starts Here.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-400">
            Join the cyber ranks of SkillQuest AI. Master coding through play, build a real-world portfolio, and unlock your true potential.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-glow-purple transition hover:scale-105"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto rounded-2xl border border-gray-700 bg-transparent px-8 py-3.5 text-sm font-semibold text-gray-300 hover:text-white hover:border-gray-600 transition"
            >
              Sign In to Terminal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 py-8 px-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="font-display font-bold text-gray-300">SkillQuest AI</span>
            <span>— Learn by Playing. Build by Doing.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/quests" className="hover:text-gray-400">Quests</Link>
            <Link to="/coding-arena" className="hover:text-gray-400">Arena</Link>
            <Link to="/mentor" className="hover:text-gray-400">AI Mentor</Link>
            <Link to="/leaderboard" className="hover:text-gray-400">Leaderboard</Link>
          </div>
          <p>© 2026 SkillQuest AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

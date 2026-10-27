import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Mail, Lock, User, Globe, Target, ArrowRight, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [mainInterest, setMainInterest] = useState('Web Development');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        preferredLanguage,
        mainInterest,
      });
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#080B14] px-4 py-12">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-purple-500/30 bg-[#121B2D]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px] shadow-glow-purple">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#080B14]">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-white">SKILLQUEST <span className="text-cyan-400">AI</span></span>
          </Link>
          <h1 className="text-xl font-extrabold text-white">Create Player Profile</h1>
          <p className="text-xs text-gray-400 mt-1">Begin your journey, unlock missions, and claim 50 Starter XP!</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full rounded-xl border border-gray-800 bg-[#080B14]/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 transition focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full rounded-xl border border-gray-800 bg-[#080B14]/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 transition focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14]/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 transition focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14]/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 transition focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Primary Interest</label>
              <div className="relative">
                <Target className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={mainInterest}
                  onChange={(e) => setMainInterest(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14]/80 py-2.5 pl-10 pr-4 text-xs text-white transition focus:border-purple-500 focus:outline-none"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Data Structures and Algorithms">DSA & Algorithms</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">AI Mentor Language</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-[#080B14]/80 py-2.5 pl-10 pr-4 text-xs text-white transition focus:border-purple-500 focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Hinglish">Hinglish</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 py-3 text-xs font-bold text-white shadow-glow-purple transition hover:opacity-95 disabled:opacity-50 mt-2"
          >
            <span>{submitting ? 'Registering Recruit...' : 'Deploy to Onboarding'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Already enlisted?{' '}
          <Link to="/login" className="font-bold text-cyan-400 hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

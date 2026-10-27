import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Mail, Lock, Shield, User, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async (role: 'student' | 'admin') => {
    setError('');
    setSubmitting(true);
    try {
      await demoLogin(role);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#080B14] px-4 py-12">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-purple-500/30 bg-[#121B2D]/90 p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px] shadow-glow-purple">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#080B14]">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-white">SKILLQUEST <span className="text-cyan-400">AI</span></span>
          </Link>
          <h1 className="text-xl font-extrabold text-white">Welcome Back, Explorer</h1>
          <p className="text-xs text-gray-400 mt-1">Authenticate to resume your active quests and streak.</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Fast-Login Section */}
        <div className="mb-6 rounded-2xl border border-purple-500/20 bg-[#101626] p-3 text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">Instant Demo Access</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('student')}
              disabled={submitting}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition"
            >
              <User className="h-3.5 w-3.5" /> Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              disabled={submitting}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              <Shield className="h-3.5 w-3.5" /> Demo Admin
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@skillquest.ai"
                className="w-full rounded-xl border border-gray-800 bg-[#080B14]/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 transition focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <button
                type="button"
                onClick={() => alert('Password reset link simulated. Please use the Demo buttons or your registered password.')}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-gray-800 bg-[#080B14]/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 transition focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-0"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-glow-purple transition hover:opacity-95 disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          New to the Quest?{' '}
          <Link to="/register" className="font-bold text-purple-400 hover:underline">
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
};

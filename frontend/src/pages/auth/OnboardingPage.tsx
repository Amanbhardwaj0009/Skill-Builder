import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Sparkles, Check, ArrowRight, Compass, Clock, Target, Globe, BookOpen } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>(['Web Development']);
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState(30);
  const [learningGoals, setLearningGoals] = useState<string[]>(['Master full-stack fundamentals', 'Build production portfolio']);
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'English');
  const [submitting, setSubmitting] = useState(false);

  const availableInterests = [
    'Web Development',
    'Python',
    'JavaScript',
    'Data Structures and Algorithms',
    'Artificial Intelligence',
    'Machine Learning',
  ];

  const availableGoals = [
    'Master full-stack fundamentals',
    'Solve algorithmic interview problems',
    'Build and deploy real-world projects',
    'Prepare for tech job interviews',
    'Understand AI models and prompt engineering',
    'Compete on global leaderboards',
  ];

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? (prev.length > 1 ? prev.filter((i) => i !== item) : prev) : [...prev, item]
    );
  };

  const toggleGoal = (goal: string) => {
    setLearningGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await api.post('/auth/onboarding', {
        interests,
        skillLevel,
        dailyStudyMinutes,
        learningGoals,
        preferredLanguage,
      });
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#080B14] p-4">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/15 blur-[120px]" />

      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-purple-500/30 bg-[#121B2D]/90 p-8 shadow-2xl backdrop-blur-xl">
        {/* Progress Bar */}
        <div className="mb-6 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="font-bold text-white uppercase tracking-wider">Mission Briefing: Calibration</span>
          </div>
          <span>Step {step} of 4</span>
        </div>
        <div className="mb-8 h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step 1: Learning Interests */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Compass className="h-6 w-6 text-purple-400" />
              <div>
                <h2 className="text-lg font-bold text-white">What would you like to master?</h2>
                <p className="text-xs text-gray-400">Select the domains you want to explore first.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {availableInterests.map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                      selected
                        ? 'border-purple-500 bg-purple-500/20 text-white shadow-glow-purple/20'
                        : 'border-gray-800 bg-[#101626] text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <span className="text-xs font-semibold">{interest}</span>
                    {selected && <Check className="h-4 w-4 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Experience & Pace */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-cyan-400" />
              <div>
                <h2 className="text-lg font-bold text-white">What is your current skill level?</h2>
                <p className="text-xs text-gray-400">We calibrate quest difficulty to your experience.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'beginner', title: 'Beginner', desc: 'New to coding or brushing up on basics.' },
                { id: 'intermediate', title: 'Intermediate', desc: 'Comfortable with syntax; building projects.' },
                { id: 'advanced', title: 'Advanced', desc: 'Experienced developer tackling algorithms & systems.' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSkillLevel(lvl.id as any)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    skillLevel === lvl.id
                      ? 'border-cyan-500 bg-cyan-500/20 text-white shadow-glow-cyan/20'
                      : 'border-gray-800 bg-[#101626] text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{lvl.title}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{lvl.desc}</p>
                </button>
              ))}
            </div>

            {/* Daily study commitment */}
            <div className="rounded-2xl border border-gray-800 bg-[#101626] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Clock className="h-4 w-4 text-amber-400" /> Daily Target
                </div>
                <span className="text-xs font-black text-amber-400">{dailyStudyMinutes} mins/day</span>
              </div>
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={dailyStudyMinutes}
                onChange={(e) => setDailyStudyMinutes(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>15 mins (Casual)</span>
                <span>45 mins (Steady)</span>
                <span>120 mins (Hardcore)</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-amber-400" />
              <div>
                <h2 className="text-lg font-bold text-white">What are your prime learning goals?</h2>
                <p className="text-xs text-gray-400">Select all objectives you want to achieve.</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {availableGoals.map((goal) => {
                const active = learningGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      active
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-gray-800 bg-[#101626] text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <span className="text-xs font-medium">{goal}</span>
                    {active && <Check className="h-4 w-4 text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: AI Mentor Localization */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-emerald-400" />
              <div>
                <h2 className="text-lg font-bold text-white">Select AI Mentor Language</h2>
                <p className="text-xs text-gray-400">Your AI mentor can explain complex code in English, Hindi, or Hinglish.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'English', label: 'English', desc: 'Standard technical English terminology' },
                { id: 'Hindi', label: 'Hindi (हिंदी)', desc: 'सरल हिंदी में अवधारणाएं और उदाहरण' },
                { id: 'Hinglish', label: 'Hinglish', desc: 'Mix of colloquial Hindi & English programming terms' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setPreferredLanguage(lang.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    preferredLanguage === lang.id
                      ? 'border-emerald-500 bg-emerald-500/20 text-white shadow-glow-emerald/20'
                      : 'border-gray-800 bg-[#101626] text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{lang.label}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{lang.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-800/80 pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-glow-purple hover:opacity-95"
            >
              <span>Next Stage</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleFinish}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-2.5 text-xs font-bold text-black shadow-glow-cyan hover:opacity-95 disabled:opacity-50"
            >
              <span>{submitting ? 'Deploying...' : 'Deploy to Dashboard (+25 XP)'}</span>
              <Sparkles className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

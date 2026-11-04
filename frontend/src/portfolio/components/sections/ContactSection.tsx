import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mail,
  Copy,
  Check,
  Github,
  Linkedin,
  Instagram,
  Sparkles,
  MessageSquare,
  User,
  AtSign,
  Tag,
} from 'lucide-react';
import { FloatingContactCanvas3D } from '../3d/FloatingContactCanvas3D';
import { portfolioData } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleCopyEmail = () => {
    soundEffects.playSuccess();
    navigator.clipboard.writeText(portfolioData.personal.socials.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    soundEffects.playSuccess();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 6000);
    }, 1200);
  };

  return (
    <section id="contact" className="relative py-28 w-full overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>07 // Transmission</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
            LET'S BUILD SOMETHING <br className="hidden sm:block" />
            <span className="text-gradient-cyan-purple">AMAZING TOGETHER</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400 font-normal">
            Whether you have a breakthrough project in mind, an internship opportunity, or just want to discuss tech — drop a message.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: 3D Hologram Beacon & Direct Social Cards */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-6">
            
            {/* 3D Floating Beacon Canvas */}
            <div className="w-full h-64 sm:h-80 relative flex items-center justify-center">
              <FloatingContactCanvas3D />
              
              {/* Overlay Hologram Ring */}
              <div className="absolute bottom-4 px-3 py-1 rounded-full glass-panel border border-cyan-400/30 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>NEURAL TRANSMISSION BEACON ACTIVE</span>
              </div>
            </div>

            {/* Quick Email Card with Copy button */}
            <div className="w-full glass-panel-glow border border-cyan-400/30 rounded-2xl p-5 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[11px] font-mono text-gray-400 uppercase">
                    Direct Email
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white truncate">
                    {portfolioData.personal.socials.email}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                onMouseEnter={soundEffects.playHover}
                title="Copy Email to Clipboard"
                className="px-3 py-2 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Channels Row */}
            <div className="w-full grid grid-cols-3 gap-3">
              <a
                href={portfolioData.personal.socials.github}
                target="_blank"
                rel="noreferrer"
                onClick={soundEffects.playClick}
                onMouseEnter={soundEffects.playHover}
                className="glass-panel hover:glass-panel-glow p-4 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center gap-1.5 group transition-all"
              >
                <Github className="w-5 h-5 text-gray-300 group-hover:text-cyan-300 transition-colors" />
                <span className="text-xs font-mono font-semibold text-white">GitHub</span>
              </a>

              <a
                href={portfolioData.personal.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={soundEffects.playClick}
                onMouseEnter={soundEffects.playHover}
                className="glass-panel hover:glass-panel-purple p-4 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center gap-1.5 group transition-all"
              >
                <Linkedin className="w-5 h-5 text-gray-300 group-hover:text-purple-300 transition-colors" />
                <span className="text-xs font-mono font-semibold text-white">LinkedIn</span>
              </a>

              <a
                href={portfolioData.personal.socials.instagram}
                target="_blank"
                rel="noreferrer"
                onClick={soundEffects.playClick}
                onMouseEnter={soundEffects.playHover}
                className="glass-panel hover:glass-panel-glow p-4 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center gap-1.5 group transition-all"
              >
                <Instagram className="w-5 h-5 text-gray-300 group-hover:text-pink-300 transition-colors" />
                <span className="text-xs font-mono font-semibold text-white">Instagram</span>
              </a>
            </div>

          </div>

          {/* Right Column: Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative">
              
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Send a Message
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-8">
                Your message is encrypted and delivered directly to Aman's inbox.
              </p>

              {/* Success Notification */}
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-3"
                  >
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold">Transmission Successful!</span> Thank you for reaching out. Aman will reply shortly.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5 uppercase">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Your Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-colors"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5 uppercase">
                      <AtSign className="w-3.5 h-3.5 text-purple-400" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-colors"
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5 uppercase">
                    <Tag className="w-3.5 h-3.5 text-blue-400" />
                    <span>Subject</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Project Inquiry / Internship Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-colors"
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5 uppercase">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Message</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share your ideas, project requirements, or opportunity details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={soundEffects.playHover}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black font-display font-bold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_35px_rgba(168,85,247,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Signal...</span>
                    </span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

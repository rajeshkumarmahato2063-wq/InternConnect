import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Compass, CheckCircle2, TrendingUp, Zap, Briefcase, Award, Loader2, X, Send, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import Container from '../Container/Container';
import SearchBar from '../SearchBar/SearchBar';
import Badge from '../Badge/Badge';
import { useAuth } from '../../context/AuthContext';
import { copilotService } from '../../services/copilotService';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, user } = useAuth();
  const [navigating, setNavigating] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your AI Internship Assistant. Ask me anything about internship discovery, resume optimization, or career guidance!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendQuery = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const query = inputMessage.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const reply = await copilotService.sendMessage({
        userId: user?.id,
        userRole: role || 'student',
        message: query,
        history: messages,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: reply || 'I have processed your request!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ai',
          isError: true,
          text: '⚠️ Unable to connect to AI server. Please make sure backend is running or check your connection.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleGetStarted = (e) => {
    if (e) e.preventDefault();
    setIsChatOpen(true);
  };

  const handleExplore = () => {
    setIsChatOpen(true);
  };
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Kicker Badge */}
            <Badge variant="accent" icon={Sparkles} className="mb-6 py-1.5 px-4 text-xs font-semibold tracking-wider">
              AI-Powered Career Accelerator
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Launch Your Career with{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Internship Discovery
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
              Match your unique skills with premier global tech companies. Get instant AI resume optimization, direct recruiter referrals, and smart internship tracking.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto relative z-20">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={handleExplore}
                className="w-full sm:w-auto shadow-xl shadow-indigo-600/30 active:scale-95 transition-transform"
              >
                Explore Internships
              </Button>

              <Button
                variant="secondary"
                size="lg"
                icon={navigating ? Loader2 : Compass}
                onClick={handleGetStarted}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleGetStarted(e);
                }}
                disabled={navigating}
                className="w-full sm:w-auto z-20 relative cursor-pointer active:scale-95 transition-transform shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                {navigating ? 'Navigating...' : 'Get Started'}
              </Button>
            </div>

            {/* Hero Feature Highlights */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant AI Skill Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>500+ Top Tier Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Zero Application Fees</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Artwork / Interactive AI Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Glow Aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse-slow -z-10" />

              {/* Main AI Candidate Glass Card */}
              <div className="rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/15 p-6 sm:p-8 shadow-2xl shadow-black/60 relative overflow-hidden">
                
                {/* Header Info */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      IC
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base">AI Live Match Engine</h4>
                      <p className="text-slate-400 text-xs flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-time candidates matching
                      </p>
                    </div>
                  </div>
                  <Badge variant="green" icon={Zap}>98% Match</Badge>
                </div>

                {/* Simulated Internship Card */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 hover:border-indigo-500/40 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">Senior Frontend Intern</span>
                        <h5 className="text-white font-bold text-base">Google Tech Campus</h5>
                        <p className="text-slate-400 text-xs mt-1 flex items-center gap-2">
                          <span>Mountain View, CA (Remote)</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium">$45 / hr</span>
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-700/50 text-indigo-400">
                        <Briefcase className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Skill Pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] bg-indigo-500/20 text-indigo-300 font-medium">React.js</span>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] bg-purple-500/20 text-purple-300 font-medium">TypeScript</span>
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] bg-blue-500/20 text-blue-300 font-medium">Tailwind</span>
                    </div>
                  </div>

                  {/* AI Match Bar */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/30">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-400" /> AI Score Analysis
                      </span>
                      <span className="text-indigo-400 font-bold">95 / 100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '95%' }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-3 -right-3 sm:-right-4 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs font-semibold text-white shadow-xl backdrop-blur-xl flex items-center gap-2"
                >
                  <div className="w-3 h-3 rounded-full bg-emerald-400 flex items-center justify-center text-[10px] text-slate-950 font-bold">✓</div>
                  <span>Applied to Microsoft AI</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -top-3 -left-3 sm:-left-4 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-xs font-semibold text-white shadow-xl backdrop-blur-xl flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span>2,500+ New Openings</span>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </div>

        {/* Search Bar Section embedded in Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 lg:mt-24"
        >
          <SearchBar />
        </motion.div>
      </Container>

      {/* Modal / Drawer Chat Window */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg h-[600px] bg-slate-900 border border-violet-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 p-0.5 flex items-center justify-center text-white shadow-lg">
                  <Sparkles className="w-5 h-5 text-violet-200 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    AI Career Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-xs text-violet-300">Powered by Gemini AI Engine</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-violet-600/30 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Message List */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isUser
                          ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white'
                          : 'bg-violet-950/80 text-violet-300 border border-violet-500/30'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-violet-400" />}
                    </div>

                    <div className={`space-y-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-medium shadow-md'
                            : msg.isError
                            ? 'bg-rose-950/70 border border-rose-800 text-rose-200 shadow-md'
                            : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-md'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 px-1 block text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex items-center gap-2 text-violet-400 text-xs p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                  <span className="text-xs text-slate-400 animate-pulse font-medium">
                    AI Assistant is thinking...
                  </span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendQuery}
              className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center gap-3"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isSending}
                placeholder={isSending ? 'Waiting for response...' : 'Ask about internships, resume tips, or skills...'}
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="p-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white disabled:opacity-50 transition-all shadow-lg shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Hero;

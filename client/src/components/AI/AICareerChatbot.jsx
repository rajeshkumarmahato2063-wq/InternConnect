import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Search,
  FileText,
  Mail,
  Mic,
  MapPin,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { copilotService } from '../../services/copilotService';
import { useAuth } from '../../context/AuthContext';

const AICareerChatbot = () => {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: 'Hi! I am your InternConnect AI Internship Copilot 🚀. How can I help launch your career today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const userId = user?.id || 'demo_user';
  const studentSkills = user?.skills || profile?.skills || ['React', 'JavaScript', 'Node.js', 'Git'];
  const studentName = user?.name || profile?.full_name || 'Candidate';

  // Load chat history from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      if (userId) {
        const savedHistory = await copilotService.getHistory(userId);
        if (isMounted && savedHistory && savedHistory.length > 0) {
          setMessages(savedHistory);
        }
      }
    };
    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (userPrompt) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const replyText = await copilotService.sendMessage({
        userId,
        userMessage: textToSend,
        conversationHistory: updatedMessages,
        studentSkills,
        studentName,
      });

      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedMessages, botMsg];
      setMessages(finalMessages);
      copilotService.saveHistory(userId, finalMessages);
    } catch (err) {
      console.error('Copilot send error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    const welcome = [
      {
        id: 'msg_welcome',
        sender: 'bot',
        text: 'Chat history cleared. How can I assist you with your internship search today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(welcome);
    copilotService.saveHistory(userId, welcome);
  };

  const quickActions = [
    { label: 'Find Internships', prompt: 'Recommend top internships matching my skills', icon: Search },
    { label: 'Analyze Resume', prompt: 'Analyze my resume and score my candidate profile', icon: FileText },
    { label: 'Generate Cover Letter', prompt: 'How do I generate a personalized AI cover letter?', icon: Mail },
    { label: 'Interview Prep', prompt: 'Give me 3 technical interview questions for React and Node.js', icon: Mic },
    { label: 'Career Roadmap', prompt: 'Create a 6-month full-stack developer career roadmap for me', icon: MapPin },
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all border border-indigo-400/40 flex items-center justify-center group"
        aria-label="Open AI Internship Copilot"
      >
        <Sparkles className="w-6 h-6 animate-pulse-slow" />
      </button>

      {/* Glassmorphism Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[520px] rounded-3xl bg-slate-900/95 border border-indigo-500/30 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {/* Decorative Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-indigo-600 text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white leading-tight">
                    AI Internship Copilot
                  </h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Gemini AI Active
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Clear conversation history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div className="p-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {quickActions.map((act, idx) => {
                const IconComp = act.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(act.prompt)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700/60 text-[10px] font-bold flex items-center gap-1 shrink-0 transition-colors whitespace-nowrap"
                  >
                    <IconComp className="w-3 h-3 text-indigo-400" />
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${
                    m.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      m.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className="max-w-[80%] space-y-1">
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        m.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span
                      className={`text-[9px] text-slate-500 block ${
                        m.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold p-2 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Gemini Copilot is crafting response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950/80 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Copilot about jobs, resume, cover letter..."
                className="flex-1 rounded-xl bg-slate-900 border border-slate-700/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AICareerChatbot;

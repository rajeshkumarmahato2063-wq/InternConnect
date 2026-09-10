import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Briefcase,
  FileText,
  MessageSquare,
  Compass,
  Award,
  HelpCircle,
  Users,
  Copy,
  Download,
  Check,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Bot,
  User,
  Zap,
  TrendingUp,
  Brain
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { copilotService } from '../../services/copilotService';
import { coverLetterService } from '../../services/coverLetterService';

const STUDENT_QUICK_ACTIONS = [
  { label: 'Find Internships', icon: Briefcase, prompt: 'Recommend top internships for my profile.' },
  { label: 'Review My Resume', icon: FileText, prompt: 'Analyze my resume and show my ATS score.' },
  { label: 'Generate Cover Letter', icon: MessageSquare, prompt: 'Generate a personalized cover letter snippet.' },
  { label: 'Interview Questions', icon: HelpCircle, prompt: 'Show top technical & HR interview questions.' },
  { label: 'Career Roadmap', icon: Compass, prompt: 'Create a 6-month full-stack career roadmap.' },
];

const COMPANY_QUICK_ACTIONS = [
  { label: 'Rank Applicants', icon: Award, prompt: 'How do I automatically score and rank applicants?' },
  { label: 'Write Internship Description', icon: FileText, prompt: 'Write an attractive engineering internship job description.' },
  { label: 'Interview Questions', icon: HelpCircle, prompt: 'Suggest key technical screening questions for candidates.' },
  { label: 'Hiring Tips', icon: Users, prompt: 'Give best practices for evaluating candidate portfolios.' },
];

const AICareerChatbot = () => {
  const { user, currentRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history when drawer opens or user changes
  useEffect(() => {
    if (user?.id && isOpen) {
      copilotService.getHistory(user.id).then((history) => {
        if (history.length > 0) {
          setMessages(history);
        } else {
          setMessages([
            {
              id: 'init_welcome',
              sender: 'ai',
              text: `Hello ${user?.name || 'there'}! I am InternConnect AI Copilot. How can I help you accelerate your internship search or hiring pipeline today?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      });
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (textToSend = null) => {
    const queryText = textToSend || inputMessage;
    if (!queryText.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const replyText = await copilotService.sendMessage({
        userId: user?.id,
        userRole: currentRole || 'student',
        message: queryText,
        history: messages,
      });

      const aiMsg = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'ai',
          text: 'I am here to assist with your career and internship search! Try asking for internship recommendations, resume review, or interview questions.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = async () => {
    if (user?.id) {
      await copilotService.clearHistory(user.id);
    }
    setMessages([
      {
        id: 'init_welcome',
        sender: 'ai',
        text: `Chat cleared! How can I help you today, ${user?.name || 'Candidate'}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const quickActions = currentRole === 'company' ? COMPANY_QUICK_ACTIONS : STUDENT_QUICK_ACTIONS;

  return (
    <>
      {/* FLOATING BOT BUTTON (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-2xl flex items-center justify-center border border-indigo-400/40 group"
          title="Open InternConnect AI Copilot"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Sparkles className="w-7 h-7 animate-pulse text-amber-300" />
              {/* Pulse Ring Indicator */}
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </>
          )}
        </motion.button>
      </div>

      {/* CHAT WINDOW PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 md:w-[420px] h-[580px] bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    InternConnect AI Copilot
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-[10px] text-indigo-300">Powered by Gemini 1.5 Flash • Context Memory Active</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions Scroll Bar */}
            <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {quickActions.map((action, idx) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(action.prompt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/20 text-[11px] font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 hover:scale-105"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-amber-300" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Conversation Messages Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar Icon */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        isUser
                          ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                          : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-300" />}
                    </div>

                    {/* Message Bubble */}
                    <div className={`space-y-1 max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                          isUser
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md'
                            : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-md'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {!isUser && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                            <span>Gemini AI</span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="text-slate-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                              {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <span className="text-[9px] text-slate-500 px-1 block text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-indigo-400 text-xs p-2">
                  <Bot className="w-4 h-4 animate-spin text-amber-300" />
                  <span className="text-[11px] text-slate-400 font-semibold animate-pulse">
                    InternConnect AI is thinking...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask AI Copilot anything..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white disabled:opacity-50 transition-all shadow-md shrink-0"
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

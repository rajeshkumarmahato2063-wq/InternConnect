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
  Check,
  RotateCcw,
  Bot,
  User,
  Loader2,
  AlertCircle,
  Code
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { copilotService } from '../../services/copilotService';
import ChatMessageContent from './ChatMessageContent';

const STUDENT_QUICK_ACTIONS = [
  { label: 'Find Internships', icon: Briefcase, prompt: 'Recommend top internships tailored for my skills and background.' },
  { label: 'Review My Resume', icon: FileText, prompt: 'Analyze my resume profile, score my ATS compatibility, and suggest improvements.' },
  { label: 'Generate Cover Letter', icon: MessageSquare, prompt: 'Write a compelling cover letter for a Software Engineering Internship.' },
  { label: 'Interview Prep', icon: HelpCircle, prompt: 'Ask me technical interview questions one by one. Wait for my answer before giving feedback.' },
  { label: 'Career Roadmap', icon: Compass, prompt: 'Outline a step-by-step career roadmap to land placements at top tech companies.' },
];

const COMPANY_QUICK_ACTIONS = [
  { label: 'Rank Applicants', icon: Award, prompt: 'Explain best practices for scoring and ranking candidate applications.' },
  { label: 'Job Description', icon: FileText, prompt: 'Write a high-converting engineering internship job description.' },
  { label: 'Interview Questions', icon: HelpCircle, prompt: 'Suggest key technical and behavioral screening questions for candidates.' },
  { label: 'Hiring Strategy', icon: Users, prompt: 'Provide advice on recruiting top university software engineering interns.' },
];

const AICareerChatbot = () => {
  const { user, currentRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

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
              text: `Hello ${user?.name || 'there'}! I am InternConnect AI Copilot powered by Gemini 2.5 Flash. You can ask me any programming, resume, interview, or career question!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      });
    } else if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'init_welcome',
          sender: 'ai',
          text: `Hello! I am InternConnect AI Copilot powered by Gemini 2.5 Flash. Ask me anything about internships, coding, resume tips, or interview preparation!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, streamingText, isOpen]);

  // Simulate token streaming effect for natural AI output display
  const streamTextOutput = (fullText, callback) => {
    setIsStreaming(true);
    setStreamingText('');

    let idx = 0;
    const chunkSize = Math.max(1, Math.floor(fullText.length / 40));
    const interval = setInterval(() => {
      idx += chunkSize;
      if (idx >= fullText.length) {
        setStreamingText(fullText);
        clearInterval(interval);
        setIsStreaming(false);
        if (callback) callback();
      } else {
        setStreamingText(fullText.slice(0, idx));
      }
    }, 20);
  };

  const handleSendMessage = async (textToSend = null) => {
    const queryText = textToSend || inputMessage;
    if (!queryText.trim() || isTyping || isStreaming) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Pass last 10 messages for conversation memory
      const replyText = await copilotService.sendMessage({
        userId: user?.id,
        userRole: currentRole || 'student',
        message: queryText,
        history: messages.slice(-10),
      });

      if (!replyText) {
        throw new Error('No response received from Gemini AI.');
      }

      setIsTyping(false);

      // Stream text output
      streamTextOutput(replyText, () => {
        const aiMsg = {
          id: `msg_ai_${Date.now()}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setStreamingText('');
      });

    } catch (err) {
      console.error('Chat error:', err);
      setIsTyping(false);
      setIsStreaming(false);

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'ai',
          isError: true,
          userQuery: queryText,
          text: `⚠️ ${err.message || 'Unable to connect to Gemini AI service. Please verify your connection or retry.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  // Regenerate last response
  const handleRegenerate = (userQueryText) => {
    if (!userQueryText) {
      const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
      if (lastUserMsg) {
        handleSendMessage(lastUserMsg.text);
      }
    } else {
      handleSendMessage(userQueryText);
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

  const quickActions = currentRole === 'company' ? COMPANY_QUICK_ACTIONS : STUDENT_QUICK_ACTIONS;

  return (
    <>
      {/* FLOATING BOT BUTTON (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-2xl flex items-center justify-center border border-indigo-400/40 group cursor-pointer"
          title="Open InternConnect AI Copilot"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Sparkles className="w-7 h-7 animate-pulse text-amber-300" />
              {/* Active Pulse Ring Indicator */}
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
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 md:w-[440px] h-[600px] bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    InternConnect AI Copilot
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-[10px] text-indigo-300 font-medium">Powered by Gemini 2.5 Flash • Active</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Clear Chat History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="px-3.5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {quickActions.map((action, idx) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isTyping || isStreaming}
                    onClick={() => handleSendMessage(action.prompt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/20 text-[11px] font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 hover:scale-105 disabled:opacity-50 cursor-pointer"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-amber-300" />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Conversation Messages List */}
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isErr = Boolean(msg.isError);

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
                          : isErr
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {isUser ? (
                        <User className="w-4 h-4" />
                      ) : isErr ? (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Bot className="w-4 h-4 text-amber-300" />
                      )}
                    </div>

                    {/* Message Content Bubble */}
                    <div className={`space-y-1 max-w-[84%] ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                          isUser
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md'
                            : isErr
                            ? 'bg-rose-950/60 border border-rose-800/80 text-rose-200 shadow-md'
                            : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-md'
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          <ChatMessageContent content={msg.text} />
                        )}

                        {/* Message Actions (Regenerate for AI responses) */}
                        {!isUser && (
                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400">
                            <span className="font-mono text-indigo-400/80">Gemini 2.5 Flash</span>
                            <button
                              type="button"
                              onClick={() => handleRegenerate(msg.userQuery)}
                              disabled={isTyping || isStreaming}
                              className="text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
                              title="Regenerate AI Response"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Regenerate</span>
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

              {/* Live Streaming Token Buffer */}
              {isStreaming && (
                <div className="flex items-start gap-2.5 flex-row">
                  <div className="w-7 h-7 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-amber-300 animate-pulse" />
                  </div>
                  <div className="p-3.5 rounded-2xl text-xs leading-relaxed bg-slate-950/80 border border-indigo-500/30 text-slate-200 max-w-[84%] shadow-md">
                    <ChatMessageContent content={streamingText} />
                    <span className="inline-block w-1.5 h-3 bg-indigo-400 animate-pulse ml-1" />
                  </div>
                </div>
              )}

              {/* Typing Loader Indicator */}
              {isTyping && !isStreaming && (
                <div className="flex items-center gap-2 text-indigo-400 text-xs p-2">
                  <Bot className="w-4 h-4 animate-spin text-amber-300" />
                  <span className="text-[11px] text-slate-400 font-semibold animate-pulse">
                    Gemini 2.5 Flash is thinking...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
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
                disabled={isTyping || isStreaming}
                placeholder={isTyping ? 'Waiting for Gemini AI...' : 'Ask AI Copilot anything (e.g. Java, React, Resume)...'}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping || isStreaming}
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white disabled:opacity-50 transition-all shadow-md shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                {isTyping || isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AICareerChatbot;

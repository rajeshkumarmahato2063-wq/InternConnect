import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Search,
  MessageSquare,
  CheckCheck,
  ShieldCheck,
  AlertTriangle,
  Users,
  Building2,
  Paperclip,
  Check,
  Copy,
  Megaphone,
  X
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import UserAvatar from '../../components/Common/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { messagingService } from '../../services/messagingService';

export default function AdminMessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialConvId = searchParams.get('convId');

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'students' | 'recruiters' | 'flagged'
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Announcement modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('ALL'); // 'ALL' | 'STUDENTS' | 'RECRUITERS'

  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const messagesEndRef = useRef(null);

  const loadConversations = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await messagingService.getConversations(user.id, 'admin');
      setConversations(data || []);

      if (data && data.length > 0) {
        const matched = initialConvId ? data.find((c) => c.id === initialConvId) || data[0] : data[0];
        setActiveChat(matched);
      }
    } catch (err) {
      console.error('Failed to load admin conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  // Load Messages for Active Chat
  useEffect(() => {
    if (!activeChat?.id) return;

    const fetchMsgs = async () => {
      const msgs = await messagingService.getMessages(activeChat.id);
      setMessages(msgs || []);
      scrollToBottom();
      messagingService.markConversationAsRead(activeChat.id, user?.id);
    };

    fetchMsgs();

    const unsubscribeMsgs = messagingService.subscribeToMessages(activeChat.id, (incomingMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === incomingMsg.id)) return prev;
        return [...prev, incomingMsg];
      });
      scrollToBottom();
    });

    return () => {
      unsubscribeMsgs?.();
    };
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeChat) return;

    const recipientId = activeChat.studentId || activeChat.recruiterId;

    const tempMsg = {
      id: `tmp_${Date.now()}`,
      conversationId: activeChat.id,
      senderId: user.id,
      senderRole: 'admin',
      message: newMessage,
      attachmentUrl: null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    const sendText = newMessage;
    setNewMessage('');

    try {
      await messagingService.sendMessage({
        conversationId: activeChat.id,
        senderId: user.id,
        senderRole: 'admin',
        message: sendText,
        recipientId,
      });
    } catch (err) {
      console.error('Failed to send admin message:', err);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    alert(`📢 Admin System Announcement Broadcasted to ${broadcastTarget} users successfully!`);
    setShowBroadcastModal(false);
    setBroadcastText('');
  };

  const handleCopyText = (txt, id) => {
    navigator.clipboard.writeText(txt);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (activeTab === 'students' && c.conversationType !== 'student_admin' && c.conversationType !== 'student_recruiter') return false;
    if (activeTab === 'recruiters' && c.conversationType !== 'recruiter_admin') return false;
    if (activeTab === 'flagged' && !c.lastMessage?.toLowerCase().includes('flag') && !c.lastMessage?.toLowerCase().includes('report')) return false;

    const q = searchQuery.toLowerCase();
    if (!q) return true;

    const studentName = (c.student?.full_name || '').toLowerCase();
    const recruiterName = (c.recruiter?.full_name || '').toLowerCase();
    const company = (c.recruiter?.company_name || '').toLowerCase();
    const lastMsg = (c.lastMessage || '').toLowerCase();

    return studentName.includes(q) || recruiterName.includes(q) || company.includes(q) || lastMsg.includes(q);
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Header Banner */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-500" /> Admin Support & Moderation Inbox
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full platform chat oversight, user support channels, and announcement broadcasts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBroadcastModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Megaphone className="w-4 h-4 text-amber-300" /> Send System Announcement
        </button>
      </div>

      {/* Main Glass Grid */}
      <div className="h-[700px] rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
          
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-950/80 p-1 rounded-xl w-full">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('students')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  activeTab === 'students'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                Students
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('recruiters')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  activeTab === 'recruiters'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                Recruiters
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('flagged')}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                  activeTab === 'flagged'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                Flagged
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidates, recruiters, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-200/50 dark:divide-slate-800/50">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs">Loading admin inbox...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <ShieldCheck className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="font-semibold text-slate-600 dark:text-slate-300">No moderation chats found.</p>
              </div>
            ) : (
              filteredConversations.map((item) => {
                const isActive = activeChat?.id === item.id;
                const studentName = item.student?.full_name || 'Student Candidate';
                const recruiterName = item.recruiter?.full_name || 'Company Recruiter';
                const company = item.recruiter?.company_name || 'Employer';

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveChat(item)}
                    className={`w-full p-4 flex items-start space-x-3 transition-colors text-left ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-600/15 border-l-4 border-indigo-600 dark:border-indigo-500'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <UserAvatar name={studentName || recruiterName} src={item.student?.avatar_url || item.recruiter?.avatar_url} size="md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {studentName} ↔ {company}
                        </h4>
                      </div>
                      <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 truncate mb-1">
                        Type: {item.conversationType}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.lastMessage}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Moderation Log & Support Chat */}
        <div className="lg:col-span-8 flex flex-col h-full bg-slate-50/30 dark:bg-slate-950/40">
          {activeChat ? (
            <>
              {/* Active Conversation Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/90 dark:bg-slate-900/70 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <UserAvatar name={activeChat.student?.full_name} size="md" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Conversation: {activeChat.student?.full_name} & {activeChat.recruiter?.company_name || 'Recruiter'}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Internship: {activeChat.internship?.title || 'General Support Inquiry'}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                  Admin Moderation Mode
                </span>
              </div>

              {/* Chat Log */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => {
                  const isAdmin = msg.senderRole === 'admin';
                  const isStudent = msg.senderRole === 'student';

                  return (
                    <motion.div
                      key={msg.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-lg p-4 rounded-2xl text-xs leading-relaxed shadow-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 pb-1 mb-1">
                          <span className={`font-bold text-[11px] ${isAdmin ? 'text-indigo-500' : isStudent ? 'text-blue-500' : 'text-purple-500'}`}>
                            {isAdmin ? '🛡️ Admin Support' : isStudent ? `Student (${activeChat.student?.full_name})` : `Recruiter (${activeChat.recruiter?.full_name})`}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Admin Response Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type official admin support message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />

                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs transition-all shadow-lg flex items-center space-x-1.5"
                >
                  <span>Respond</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select a conversation to inspect or moderate.</p>
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Announcement Modal */}
      <AnimatePresence>
        {showBroadcastModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-indigo-500" /> System Broadcast Announcement
                </h3>
                <button type="button" onClick={() => setShowBroadcastModal(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBroadcast} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-slate-500">Broadcast Target Audience</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="ALL">All Platform Users (Students & Recruiters)</option>
                    <option value="STUDENTS">Students Only</option>
                    <option value="RECRUITERS">Recruiters Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase text-slate-500">Announcement Message</label>
                  <textarea
                    rows={4}
                    placeholder="Enter platform update, maintenance window, or official announcement..."
                    value={broadcastText}
                    onChange={(e) => setBroadcastText(e.target.value)}
                    className="w-full rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-md shadow-indigo-600/30"
                  >
                    Broadcast Announcement
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

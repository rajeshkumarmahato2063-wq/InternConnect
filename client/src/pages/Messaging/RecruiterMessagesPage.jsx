import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Search,
  MessageSquare,
  CheckCheck,
  Circle,
  Briefcase,
  GraduationCap,
  FileText,
  ExternalLink,
  Archive,
  Paperclip,
  Check,
  Copy,
  Users
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import UserAvatar from '../../components/Common/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { messagingService } from '../../services/messagingService';
import { internshipService } from '../../services/internshipService';

export default function RecruiterMessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialConvId = searchParams.get('convId');

  const [internships, setInternships] = useState([]);
  const [selectedInternshipFilter, setSelectedInternshipFilter] = useState('ALL');

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // File Upload State
  const [attachment, setAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Real-time State
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const messagesEndRef = useRef(null);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [jobsData, convsData] = await Promise.all([
        internshipService.getCompanyInternships(user.id).catch(() => []),
        messagingService.getConversations(user.id, 'company').catch(() => []),
      ]);

      setInternships(jobsData || []);
      setConversations(convsData || []);

      if (convsData && convsData.length > 0) {
        const matched = initialConvId ? convsData.find((c) => c.id === initialConvId) || convsData[0] : convsData[0];
        setActiveChat(matched);
      }
    } catch (err) {
      console.error('Failed to load recruiter messaging data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

    // Subscribe to Realtime Messages
    const unsubscribeMsgs = messagingService.subscribeToMessages(activeChat.id, (incomingMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === incomingMsg.id)) return prev;
        return [...prev, incomingMsg];
      });
      scrollToBottom();
    });

    // Subscribe to Typing Indicators
    const unsubscribeTyping = messagingService.subscribeToTyping(activeChat.id, (payload) => {
      if (payload.userId !== user?.id) {
        setIsOtherTyping(payload.isTyping);
      }
    });

    return () => {
      unsubscribeMsgs?.();
      unsubscribeTyping?.();
    };
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOtherTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (activeChat?.id && user?.id) {
      messagingService.sendTypingSignal(activeChat.id, user.id, user.name || 'Recruiter', true);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await messagingService.uploadChatAttachment(file);
      setAttachment({ url, name: file.name });
    } catch (err) {
      console.error('Attachment upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachment) || !user || !activeChat) return;

    const recipientId = activeChat.studentId || activeChat.adminId;

    const tempMsg = {
      id: `tmp_${Date.now()}`,
      conversationId: activeChat.id,
      senderId: user.id,
      senderRole: 'company',
      message: newMessage,
      attachmentUrl: attachment?.url || null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    const sendText = newMessage;
    const sendAttach = attachment?.url || null;
    setNewMessage('');
    setAttachment(null);

    try {
      await messagingService.sendMessage({
        conversationId: activeChat.id,
        senderId: user.id,
        senderRole: 'company',
        message: sendText || (sendAttach ? 'Attached document' : 'Message'),
        attachmentUrl: sendAttach,
        recipientId,
      });

      messagingService.sendTypingSignal(activeChat.id, user.id, user.name || 'Recruiter', false);
    } catch (err) {
      console.error('Failed to send recruiter message:', err);
    }
  };

  const handleCopyText = (txt, id) => {
    navigator.clipboard.writeText(txt);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Filter conversations by Internship posting and search query
  const filteredConversations = conversations.filter((c) => {
    if (selectedInternshipFilter !== 'ALL' && c.internshipId !== selectedInternshipFilter) {
      return false;
    }

    const q = searchQuery.toLowerCase();
    if (!q) return true;

    const studentName = (c.student?.full_name || '').toLowerCase();
    const college = (c.student?.college || '').toLowerCase();
    const jobTitle = (c.internship?.title || '').toLowerCase();
    const lastMsg = (c.lastMessage || '').toLowerCase();

    return studentName.includes(q) || college.includes(q) || jobTitle.includes(q) || lastMsg.includes(q);
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Header Banner */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" /> Recruiter Applicant Communications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Direct 1-on-1 candidate messaging grouped by internship postings and applicants.
          </p>
        </div>
      </div>

      {/* Main Glass Panel Grid */}
      <div className="h-[700px] rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Sidebar: Internship Filter & Candidate List */}
        <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
          
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            {/* Internship Filter Select */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Filter by Internship Posting
              </label>
              <select
                value={selectedInternshipFilter}
                onChange={(e) => setSelectedInternshipFilter(e.target.value)}
                className="w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">All Internships ({conversations.length})</option>
                {internships.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate name, college, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-200/50 dark:divide-slate-800/50">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs">Loading applicant messages...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                <Users className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="font-semibold text-slate-600 dark:text-slate-300">No applicant chats found.</p>
                <p className="text-[11px] text-slate-500">
                  Select candidates from Applicant Management and click "Message Applicant".
                </p>
              </div>
            ) : (
              filteredConversations.map((item) => {
                const isActive = activeChat?.id === item.id;
                const candidateName = item.student?.full_name || 'Student Candidate';
                const candidateCollege = item.student?.college || 'University Student';
                const jobTitle = item.internship?.title || 'Internship Role';

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
                    <div className="relative shrink-0">
                      <UserAvatar name={candidateName} src={item.student?.avatar_url} size="md" />
                      <Circle className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400 absolute bottom-0 right-0" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{candidateName}</h4>
                        {item.lastMessageTime && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 truncate mb-1">
                        {jobTitle} • {candidateCollege}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.lastMessage}</p>
                    </div>

                    {item.unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-sm shrink-0">
                        {item.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Recruiter Chat Box */}
        <div className="lg:col-span-8 flex flex-col h-full bg-slate-50/30 dark:bg-slate-950/40">
          {activeChat ? (
            <>
              {/* Header with Candidate Profile Info */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/90 dark:bg-slate-900/70 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <UserAvatar name={activeChat.student?.full_name} src={activeChat.student?.avatar_url} size="md" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeChat.student?.full_name || 'Candidate Student'}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                        <Briefcase className="w-3 h-3" /> {activeChat.internship?.title || 'Applied Internship'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-slate-400" /> {activeChat.student?.college}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                    Candidate Applicant
                  </span>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === user?.id || msg.senderRole === 'company';
                  return (
                    <motion.div
                      key={msg.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-lg ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <UserAvatar
                          name={isMe ? user?.name : activeChat.student?.full_name}
                          src={isMe ? user?.avatar : activeChat.student?.avatar_url}
                          size="xs"
                        />
                        <div
                          className={`group relative p-4 rounded-2xl text-xs leading-relaxed shadow-md transition-all ${
                            isMe
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-none'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.message, msg.id)}
                            className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-slate-900 text-slate-300 text-[10px] flex items-center gap-1 shadow-md"
                            title="Copy text"
                          >
                            {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>

                          <p className="whitespace-pre-wrap">{msg.message}</p>

                          {msg.attachmentUrl && (
                            <div className="mt-3 pt-2 border-t border-white/20 dark:border-slate-700">
                              <a
                                href={msg.attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 font-bold text-[11px] underline"
                              >
                                <Paperclip className="w-3.5 h-3.5" /> View Attached File
                              </a>
                            </div>
                          )}

                          <div className="flex items-center justify-end space-x-1 mt-1.5 text-[10px] opacity-75">
                            <span>
                              {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-indigo-200" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {isOtherTyping && (
                  <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 italic pl-10 animate-pulse">
                    <span>{activeChat.student?.full_name || 'Candidate'} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors"
                  title="Attach file / document"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder="Type your message to applicant..."
                  value={newMessage}
                  onChange={handleInputChange}
                  className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />

                <button
                  type="submit"
                  disabled={(!newMessage.trim() && !attachment) || uploading}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg flex items-center space-x-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
              <Users className="w-12 h-12 text-slate-500" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No candidate conversation selected.</p>
              <p className="text-xs text-slate-500">Select an applicant from the left menu to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

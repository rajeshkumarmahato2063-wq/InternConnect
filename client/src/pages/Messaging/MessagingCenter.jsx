import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, MessageSquare, CheckCheck, User, Building, Circle, Sparkles } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import internshipService from '../../services/internshipService';

export default function MessagingCenter() {
  const { user, currentRole } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    const unsubscribe = internshipService.subscribeToMessages(user.id, (incomingMsg) => {
      setMessages((prev) => [...prev, incomingMsg]);
      scrollToBottom();
    });
    return () => unsubscribe?.();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await internshipService.getConversations(user.id);
      setConversations(data);
      if (data.length > 0) {
        setActiveChat(data[0]);
        setMessages([data[0]]);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeChat) return;

    const recipientId = activeChat.sender_id === user.id ? activeChat.receiver_id : activeChat.sender_id;

    const tempMsg = {
      id: `tmp_${Date.now()}`,
      sender_id: user.id,
      receiver_id: recipientId,
      message: newMessage,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage('');

    try {
      await internshipService.sendMessage({
        sender_id: user.id,
        receiver_id: recipientId,
        internship_id: activeChat.internship_id,
        message: tempMsg.message,
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    (c.sender_name || 'Recruiter').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.message || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Real-Time Messaging Center"
      subtitle="Direct line of communication between candidates and verified hiring managers."
    >
      <div className="h-[680px] rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Sidebar: Conversation List */}
        <div className="lg:col-span-4 border-r border-slate-800 flex flex-col h-full bg-slate-900/60">
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Conversations
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
                Supabase Realtime
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No active chats found.</div>
            ) : (
              filteredConversations.map((item) => {
                const isActive = activeChat?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveChat(item);
                      setMessages([item]);
                    }}
                    className={`w-full p-4 flex items-start space-x-3 transition-colors text-left ${
                      isActive ? 'bg-indigo-600/15 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={item.sender_name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <Circle className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400 absolute bottom-0 right-0" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-white truncate">{item.sender_name || 'Hiring Lead'}</h4>
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{item.message}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Chat Window */}
        <div className="lg:col-span-8 flex flex-col h-full bg-slate-950/40">
          {activeChat ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={activeChat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={activeChat.sender_name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <Circle className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400 absolute bottom-0 right-0" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeChat.sender_name || 'Hiring Manager'}</h3>
                    <p className="text-[11px] text-emerald-400 font-medium">Online • Active Session</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg, index) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <motion.div
                      key={msg.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed shadow-lg ${
                          isMe
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <div className="flex items-center justify-end space-x-1 mt-1.5 text-[10px] opacity-75">
                          <span>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg flex items-center space-x-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8 text-slate-400 text-xs">
              Select a conversation to start chatting.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

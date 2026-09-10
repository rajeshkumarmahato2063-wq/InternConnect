import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
  Check,
  Trash2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'application_submitted':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'shortlisted':
      return <Award className="w-4 h-4 text-purple-400" />;
    case 'interview_scheduled':
      return <Calendar className="w-4 h-4 text-indigo-400" />;
    case 'offer_received':
      return <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />;
    case 'new_internship':
      return <Sparkles className="w-4 h-4 text-blue-400" />;
    default:
      return <Bell className="w-4 h-4 text-indigo-400" />;
  }
};

const NotificationBellDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all focus:outline-none"
        aria-label="Notifications Dropdown"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse shadow-lg shadow-indigo-500/50">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No notifications yet. Live updates will appear here!
                </div>
              ) : (
                notifications.slice(0, 6).map((item) => {
                  const isRead = item.is_read || item.read;
                  return (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                        isRead ? 'bg-transparent hover:bg-slate-800/30' : 'bg-indigo-950/20 hover:bg-indigo-900/30'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 shrink-0">
                        {getNotificationIcon(item.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs font-bold truncate ${isRead ? 'text-slate-300' : 'text-white'}`}>
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {item.time || 'Just now'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer View All Link */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors w-full"
              >
                <span>View All Notifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBellDropdown;

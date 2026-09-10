import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
  Check,
  Trash2,
  Filter,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Container from '../../components/Container/Container';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { useNotifications } from '../../context/NotificationContext';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } =
    useNotifications();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'applications', 'interviews'

  const filteredNotifications = notifications.filter((n) => {
    const isUnread = !n.is_read && !n.read;
    if (filter === 'unread') return isUnread;
    if (filter === 'applications')
      return n.type === 'application_submitted' || n.type === 'shortlisted' || n.type === 'offer_received';
    if (filter === 'interviews') return n.type === 'interview_scheduled';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'application_submitted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'shortlisted':
        return <Award className="w-5 h-5 text-purple-400" />;
      case 'interview_scheduled':
        return <Calendar className="w-5 h-5 text-indigo-400" />;
      case 'offer_received':
        return <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <MainLayout>
      <div className="py-12 pt-28">
        <Container>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Supabase Realtime Activity</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">Notifications & Alerts</h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time updates regarding your internship applications, interview calls, and offers
              </p>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={markAllAsRead}
                icon={Check}
                className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
              >
                Mark All as Read ({unreadCount})
              </Button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 w-fit">
            {[
              { id: 'all', label: 'All Notifications' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'applications', label: 'Applications & Offers' },
              { id: 'interviews', label: 'Interviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications Feed */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card variant="glass" className="p-12 text-center space-y-3">
                <Bell className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Notifications Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You are all caught up! Realtime notifications will automatically stream here when status updates occur.
                </p>
              </Card>
            ) : (
              <AnimatePresence>
                {filteredNotifications.map((notif) => {
                  const isRead = notif.is_read || notif.read;
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card
                        variant="glass"
                        className={`p-5 md:p-6 transition-all border ${
                          isRead
                            ? 'border-slate-800/80 bg-slate-900/40 opacity-80'
                            : 'border-indigo-500/30 bg-gradient-to-r from-slate-900/90 via-indigo-950/20 to-slate-900/90 shadow-xl'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 shrink-0 mt-0.5">
                              {getIcon(notif.type)}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className={`text-sm md:text-base font-bold ${isRead ? 'text-slate-200' : 'text-white'}`}>
                                  {notif.title}
                                </h3>
                                {!isRead && (
                                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                )}
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-500 font-mono inline-block pt-1">
                                {notif.time || 'Recently updated'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {!isRead && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => clearNotification(notif.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;

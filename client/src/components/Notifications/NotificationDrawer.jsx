import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Calendar, Briefcase, Info } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationDrawer = () => {
  const { notifications, isDrawerOpen, closeDrawer, markAsRead, markAllAsRead, unreadCount } =
    useNotifications();

  if (!isDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDrawer}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Side Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 right-0 max-w-full flex pl-10"
        >
          <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-500 text-white">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Actions Bar */}
              {unreadCount > 0 && (
                <div className="py-3 flex justify-end">
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all as read
                  </button>
                </div>
              )}

              {/* Notification List */}
              <div className="mt-2 space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
                {notifications.map((item) => {
                  let Icon = Info;
                  let iconBg = 'bg-blue-500/10 text-blue-400 border-blue-500/30';

                  if (item.type === 'interview') {
                    Icon = Calendar;
                    iconBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                  } else if (item.type === 'job') {
                    Icon = Briefcase;
                    iconBg = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        !item.read
                          ? 'bg-slate-800/80 border-indigo-500/40 shadow-md'
                          : 'bg-slate-900/40 border-slate-800/60 opacity-80'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl border ${iconBg} shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-white truncate">
                              {item.title}
                            </h4>
                            <span className="text-[11px] text-slate-400 shrink-0">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={closeDrawer}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationDrawer;

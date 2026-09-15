import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import UserAvatar from '../Common/UserAvatar';

const TopBar = ({ title = 'Student Dashboard' }) => {
  const { user } = useAuth();
  const { unreadCount, toggleDrawer } = useNotifications();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="py-4 px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Welcome back, {user?.name || user?.email || 'Candidate'}!
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all shadow-sm"
          aria-label="Toggle Theme"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={toggleDrawer}
          className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-indigo-500" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Link */}
        <Link
          to="/student/profile"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all group shadow-sm"
        >
          <UserAvatar name={user?.name} email={user?.email} src={user?.avatar} size="xs" />
          <span className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors hidden sm:inline">
            {user?.name || user?.email || 'My Profile'}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;

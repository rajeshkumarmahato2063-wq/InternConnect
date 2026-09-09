import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Bookmark,
  FileText,
  User,
  Bell,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, user, logout } = useAuth();
  const { toggleDrawer, unreadCount } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Search Internships', href: '/explore', icon: Search },
    { name: 'Saved Jobs', href: '/saved-jobs', icon: Bookmark },
    { name: 'Applications', href: '/applications', icon: FileText },
    { name: 'Profile', href: '/student/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth/select-role');
  };

  return (
    <>
      {/* Mobile Drawer Hamburger Button */}
      <div className="lg:hidden p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2 font-bold text-white text-base">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>InternConnect AI</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-200"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-2xl p-6 flex flex-col justify-between lg:hidden"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <span className="font-extrabold text-white text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> InternConnect AI
                </span>
                <button type="button" onClick={() => setMobileOpen(false)} className="text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-indigo-400" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold text-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Panel */}
      <aside className="hidden lg:flex flex-col justify-between w-64 shrink-0 bg-slate-900/70 backdrop-blur-xl border-r border-slate-800/80 min-h-[calc(100vh-80px)] p-5">
        <div className="space-y-6">
          <span className="px-3 text-[11px] uppercase tracking-wider text-slate-400 font-extrabold block">
            Candidate Navigation
          </span>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-md shrink-0">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt={user?.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Aarav Sharma'}</p>
              <p className="text-[10px] text-indigo-400 font-semibold truncate">Student Candidate</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-700/80 hover:border-rose-500/30 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Bookmark,
  FileText,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  PlusCircle,
  Briefcase,
  Users,
  Building2,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import UserAvatar from '../Common/UserAvatar';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRole, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const studentNavItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Explore Internships', href: '/explore', icon: Search },
    { name: 'Skill Hub', href: '/skill-hub', icon: ShieldCheck },
    { name: 'Assessments', href: '/student/assessments', icon: BookOpen },
    { name: 'Saved Jobs', href: '/saved-jobs', icon: Bookmark },
    { name: 'Applications', href: '/applications', icon: FileText },
    { name: 'Profile', href: '/student/profile', icon: User },
  ];

  const companyNavItems = [
    { name: 'Dashboard', href: '/company/dashboard', icon: LayoutDashboard },
    { name: 'Post Internship', href: '/company/post-job', icon: PlusCircle },
    { name: 'Manage Jobs', href: '/company/jobs', icon: Briefcase },
    { name: 'Applicants', href: '/company/applicants', icon: Users },
    { name: 'Assessments', href: '/company/assessments', icon: BookOpen },
    { name: 'Company Profile', href: '/company/profile', icon: Building2 },
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Verification', href: '/admin/verification', icon: ShieldCheck },
    { name: 'User Management', href: '/admin/users', icon: Users },
  ];

  const navItems =
    currentRole === 'company'
      ? companyNavItems
      : currentRole === 'admin'
      ? adminNavItems
      : studentNavItems;

  const handleLogout = () => {
    logout();
    navigate('/auth/select-role');
  };

  const isLinkActive = (itemHref) => {
    const current = location.pathname;
    if (current === itemHref) return true;
    if (itemHref.startsWith('/student/') && current === itemHref) return true;
    if (itemHref === '/explore' && (current === '/explore' || current === '/student/explore')) return true;
    if (itemHref === '/saved-jobs' && (current === '/saved-jobs' || current === '/student/saved-jobs')) return true;
    if (itemHref === '/applications' && (current === '/applications' || current === '/student/applications')) return true;
    if (itemHref === '/skill-hub' && (current === '/skill-hub' || current === '/student/skill-hub')) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden p-4 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span>InternConnect AI</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl p-6 flex flex-col justify-between lg:hidden"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                <span className="font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" /> InternConnect AI
                </span>
                <button type="button" onClick={() => setMobileOpen(false)} className="text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isLinkActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-indigo-500" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/30 font-bold text-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Panel */}
      <aside className="hidden lg:flex flex-col justify-between w-64 shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 min-h-[calc(100vh-80px)] p-5 transition-colors">
        <div className="space-y-6">
          <span className="px-3 text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold block">
            {currentRole === 'company'
              ? 'Recruiter Navigation'
              : currentRole === 'admin'
              ? 'Admin Portal'
              : 'Candidate Navigation'}
          </span>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isLinkActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30'
                      : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <UserAvatar name={user?.name} email={user?.email} src={user?.avatar} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.name || user?.email || 'User Account'}
              </p>
              <p className="text-[10px] text-indigo-500 font-semibold truncate capitalize">
                {currentRole || 'Student Candidate'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-700 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-slate-700/80 hover:border-rose-500/30 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

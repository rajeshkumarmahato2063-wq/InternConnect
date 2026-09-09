import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, Bell, User, LayoutDashboard, Briefcase, FileText, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import Container from '../Container/Container';
import RoleSwitcher from '../Common/RoleSwitcher';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  const { isAuthenticated, role, user, logout } = useAuth();
  const { unreadCount, toggleDrawer } = useNotifications();
  const navigate = useNavigate();

  const isScrolled = scrollPosition > 20;

  // Dynamic Navigation items based on Authentication state and Role
  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', href: '/' },
        { name: 'Features', href: '/#features' },
        { name: 'Companies', href: '/#companies' },
        { name: 'Categories', href: '/#categories' },
      ];
    }

    if (role === 'student') {
      return [
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Search Internships', href: '/explore', icon: Briefcase },
        { name: 'Applications', href: '/applications', icon: FileText },
        { name: 'AI Career Tools', href: '/ai-tools', icon: Sparkles },
        { name: 'My Profile', href: '/student/profile', icon: User },
      ];
    } else if (role === 'company') {
      return [
        { name: 'Dashboard', href: '/company/dashboard', icon: LayoutDashboard },
        { name: 'Post Internship', href: '/company/post-job', icon: Briefcase },
        { name: 'Applicants', href: '/company/applicants', icon: FileText },
        { name: 'Company Profile', href: '/company/profile', icon: User },
      ];
    } else {
      return [
        { name: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Verifications', href: '/admin/verification', icon: User },
        { name: 'User Moderation', href: '/admin/users', icon: User },
      ];
    }
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    logout();
    navigate('/auth/select-role');
  };

  return (
    <>
      {/* Role Switcher Demo Bar (When authenticated or testing) */}
      {isAuthenticated && <RoleSwitcher />}

      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-indigo-950/30 py-3'
            : 'bg-slate-950/60 backdrop-blur-md border-b border-white/5 py-4'
        }`}
      >
        <Container>
          <nav className="flex items-center justify-between" aria-label="Main Navigation">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300 border border-indigo-400/30">
                <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1 font-sans">
                InternConnect <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/60 transition-all duration-200 flex items-center gap-1.5"
                    >
                      {IconComponent && <IconComponent className="w-3.5 h-3.5 text-indigo-400" />}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right Action Section */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Notifications Bell */}
                  <button
                    type="button"
                    onClick={toggleDrawer}
                    className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* User Profile Badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-semibold text-white">{user?.name}</span>
                  </div>

                  {/* Logout Button */}
                  <Button variant="secondary" size="sm" onClick={handleLogout} icon={LogOut}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="sm" onClick={() => navigate('/auth/select-role')} icon={LogIn}>
                    Login
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate('/auth/select-role')} icon={UserPlus}>
                    Register
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </Container>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10"
            >
              <Container className="py-6 space-y-4">
                <ul className="flex flex-col space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800/60 rounded-xl block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                  {isAuthenticated ? (
                    <Button variant="secondary" fullWidth onClick={handleLogout} icon={LogOut}>
                      Logout ({user?.name})
                    </Button>
                  ) : (
                    <>
                      <Button variant="secondary" fullWidth onClick={() => navigate('/auth/select-role')}>
                        Login
                      </Button>
                      <Button variant="primary" fullWidth onClick={() => navigate('/auth/select-role')}>
                        Register
                      </Button>
                    </>
                  )}
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;

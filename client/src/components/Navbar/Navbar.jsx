import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, User, LayoutDashboard, Briefcase, FileText, LogOut, LogIn, UserPlus, Folder, Home as HomeIcon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../Button/Button';
import Container from '../Container/Container';
import RoleSwitcher from '../Common/RoleSwitcher';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBellDropdown from '../Notifications/NotificationBellDropdown';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  const { isAuthenticated, role, user, logout } = useAuth();
  const { unreadCount, toggleDrawer } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const isScrolled = scrollPosition > 20;
  const isHomepage = location.pathname === '/';

  const getDashboardPath = () => {
    const currentRole = role || user?.role || 'student';
    if (currentRole === 'company') return '/company/dashboard';
    if (currentRole === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  const handleLoginClick = () => {
    if (!isAuthenticated || !user) {
      navigate('/auth/select-role');
    } else {
      navigate(getDashboardPath());
    }
  };

  const handleRegisterClick = () => {
    navigate('/auth/select-role');
  };

  const handleGoToDashboardClick = () => {
    navigate(getDashboardPath());
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e, href) => {
    setMobileMenuOpen(false);
    if (href === '/') {
      handleHomeClick(e);
    } else if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      if (location.pathname === '/') {
        e.preventDefault();
        const elem = document.getElementById(targetId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        e.preventDefault();
        navigate('/', { state: { scrollTo: targetId } });
      }
    }
  };

  // Dynamic Navigation items:
  // Both public visitors and logged-in users get a clear "Home" button returning to '/'
  const getNavLinks = () => {
    if (!isAuthenticated || isHomepage) {
      return [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Features', href: '/#features' },
        { name: 'Companies', href: '/#companies' },
        { name: 'Categories', href: '/#categories' },
      ];
    }

    if (role === 'student') {
      return [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Search Internships', href: '/explore', icon: Briefcase },
        { name: 'Portfolio Builder', href: '/student/portfolio', icon: Folder },
        { name: 'Applications', href: '/applications', icon: FileText },
        { name: 'AI Career Tools', href: '/ai-tools', icon: Sparkles },
        { name: 'My Profile', href: '/student/profile', icon: User },
      ];
    } else if (role === 'company') {
      return [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Dashboard', href: '/company/dashboard', icon: LayoutDashboard },
        { name: 'Post Internship', href: '/company/post-job', icon: Briefcase },
        { name: 'Applicants', href: '/company/applicants', icon: FileText },
        { name: 'Company Profile', href: '/company/profile', icon: User },
      ];
    } else {
      return [
        { name: 'Home', href: '/', icon: HomeIcon },
        { name: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Verifications', href: '/admin/verification', icon: User },
        { name: 'User Moderation', href: '/admin/users', icon: User },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Role Switcher Demo Bar (When authenticated) */}
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
            {/* Brand Logo - Wraps icon + text in React Router Link */}
            <Link
              to="/"
              onClick={handleHomeClick}
              className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-xl p-1.5 cursor-pointer transition-all hover:opacity-95"
              aria-label="InternConnect AI Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300 border border-indigo-400/30">
                <Sparkles className="w-5 h-5 text-white animate-pulse-slow pointer-events-none" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1 font-sans group-hover:text-indigo-200 transition-colors">
                InternConnect <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isHome = link.href === '/';
                const isHash = link.href.startsWith('/#');

                return (
                  <li key={link.name}>
                    {isHome ? (
                      <Link
                        to="/"
                        onClick={handleHomeClick}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/60 transition-all duration-200 flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {IconComponent && <IconComponent className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>{link.name}</span>
                      </Link>
                    ) : isHash ? (
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/60 transition-all duration-200 flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {IconComponent && <IconComponent className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>{link.name}</span>
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/60 transition-all duration-200 flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {IconComponent && <IconComponent className="w-3.5 h-3.5 text-indigo-400" />}
                        <span>{link.name}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Right Action Section */}
            <div className="hidden md:flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Prominent Go to Dashboard button */}
                  <Button variant="primary" size="sm" onClick={handleGoToDashboardClick} icon={LayoutDashboard}>
                    Go to Dashboard
                  </Button>

                  {/* Notifications Bell Dropdown */}
                  <NotificationBellDropdown />

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
                  <Button variant="secondary" size="sm" onClick={handleLoginClick} icon={LogIn}>
                    Login
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleRegisterClick} icon={UserPlus}>
                    Register
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle Navigation Menu"
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
                  {navLinks.map((link) => {
                    const isHome = link.href === '/';
                    const isHash = link.href.startsWith('/#');

                    return (
                      <li key={link.name}>
                        {isHome ? (
                          <Link
                            to="/"
                            onClick={handleHomeClick}
                            className="px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800/60 rounded-xl block flex items-center gap-2 cursor-pointer"
                          >
                            <HomeIcon className="w-4 h-4 text-indigo-400" />
                            <span>{link.name}</span>
                          </Link>
                        ) : isHash ? (
                          <a
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800/60 rounded-xl block cursor-pointer"
                          >
                            {link.name}
                          </a>
                        ) : (
                          <Link
                            to={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800/60 rounded-xl block cursor-pointer"
                          >
                            {link.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                  {isAuthenticated ? (
                    <>
                      <Button variant="primary" fullWidth onClick={() => { setMobileMenuOpen(false); handleGoToDashboardClick(); }} icon={LayoutDashboard}>
                        Go to Dashboard
                      </Button>
                      <Button variant="secondary" fullWidth onClick={() => { setMobileMenuOpen(false); handleLogout(); }} icon={LogOut}>
                        Logout ({user?.name})
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="secondary" fullWidth onClick={() => { setMobileMenuOpen(false); handleLoginClick(); }}>
                        Login
                      </Button>
                      <Button variant="primary" fullWidth onClick={() => { setMobileMenuOpen(false); handleRegisterClick(); }}>
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

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Bookmark,
  FileText,
  Sparkles,
  Building2,
  ShieldCheck,
  CheckCircle,
  Users,
  MessageSquare,
  Award,
  Settings,
} from 'lucide-react';
import MainLayout from './MainLayout';
import Container from '../components/Container/Container';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, title, subtitle }) => {
  const { currentRole, user, logout } = useAuth();
  const location = useLocation();

  const getSidebarNav = () => {
    if (currentRole === 'student') {
      return [
        { name: 'Dashboard Overview', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Messages & Chat', href: '/messages', icon: MessageSquare },
        { name: 'My Resume', href: '/student/resume', icon: FileText },
        { name: 'Interviews', href: '/student/interviews', icon: CheckCircle },
        { name: 'Offer Letters', href: '/student/offers', icon: Award },
        { name: 'Certificates', href: '/student/certificates', icon: ShieldCheck },
        { name: 'My Profile', href: '/student/profile', icon: User },
        { name: 'Explore Internships', href: '/explore', icon: Briefcase },
        { name: 'Saved Jobs', href: '/saved-jobs', icon: Bookmark },
        { name: 'Application Tracker', href: '/applications', icon: FileText },
        { name: 'AI Career Tools Hub', href: '/ai-tools', icon: Sparkles },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    } else if (currentRole === 'company') {
      return [
        { name: 'Dashboard', href: '/company/dashboard', icon: LayoutDashboard },
        { name: 'Messages & Chat', href: '/messages', icon: MessageSquare },
        { name: 'Post Internship', href: '/company/post-job', icon: Briefcase },
        { name: 'Manage Jobs', href: '/company/jobs', icon: FileText },
        { name: 'Applicants', href: '/company/applicants', icon: Users },
        { name: 'Company Profile', href: '/company/profile', icon: Building2 },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    } else {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Messages & Chat', href: '/messages', icon: MessageSquare },
        { name: 'Students', href: '/admin/users', icon: Users },
        { name: 'Companies', href: '/admin/verification', icon: Building2 },
        { name: 'Internships', href: '/admin/jobs-moderation', icon: Briefcase },
        { name: 'Analytics', href: '/admin/analytics', icon: Sparkles },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    }
  };

  const navItems = getSidebarNav();

  return (
    <MainLayout>
      <div className="py-10">
        <Container>
          {/* Header Banner */}
          <div className="mb-8 pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                {currentRole} Control Panel
              </span>
              <h1 className="text-3xl font-extrabold text-white">{title}</h1>
              {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-md">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white leading-tight">{user.name}</p>
                <p className="text-[11px] text-indigo-400 font-semibold capitalize">{currentRole} Account</p>
              </div>
            </div>
          </div>

          {/* Grid Layout: Sidebar + Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar */}
            <aside className="lg:col-span-3 space-y-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl">
              <span className="px-3 text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-2">
                Navigation Menu
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-indigo-400/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all border border-rose-500/20"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Logout</span>
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-9">{children}</main>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};

export default DashboardLayout;

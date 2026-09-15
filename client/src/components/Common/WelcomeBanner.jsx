import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, X, Sparkles, ArrowRight, UserCheck, Building2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const WelcomeBanner = () => {
  const { isAuthenticated, user, role } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (!isAuthenticated || !user || dismissed) return null;

  const currentRole = role || user.role || 'student';

  const getDashboardPath = () => {
    if (currentRole === 'company') return '/company/dashboard';
    if (currentRole === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  const getRoleLabel = () => {
    if (currentRole === 'company') return { text: 'Employer', icon: Building2, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    if (currentRole === 'admin') return { text: 'Admin', icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    return { text: 'Student Candidate', icon: UserCheck, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
  };

  const roleInfo = getRoleLabel();
  const RoleIcon = roleInfo.icon;

  const handleGoToDashboard = () => {
    navigate(getDashboardPath());
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative z-30 bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 border-b border-indigo-500/30 py-3 px-4 shadow-lg shadow-indigo-950/40"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          
          {/* Left Welcome message */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white font-bold">
                Welcome back, <span className="text-indigo-300 font-extrabold">{user?.name || 'User'}</span>!
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${roleInfo.color}`}>
                <RoleIcon className="w-3 h-3" />
                {roleInfo.text}
              </span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGoToDashboard}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss banner"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeBanner;

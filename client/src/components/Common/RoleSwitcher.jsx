import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Building2, ShieldCheck, RefreshCw } from 'lucide-react';

const RoleSwitcher = () => {
  const { currentRole, switchRole, user } = useAuth();

  const roles = [
    { id: 'student', name: 'Student View', icon: UserCheck, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { id: 'company', name: 'Recruiter View', icon: Building2, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { id: 'admin', name: 'Admin View', icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  ];

  return (
    <div className="bg-slate-900 border-b border-indigo-500/20 py-2 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left: Role Indicator */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" /> Active Role Demo:
          </span>
          <span className="font-bold text-white uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600/30 border border-indigo-400/30">
            {currentRole}
          </span>
          <span className="text-slate-400 hidden md:inline">
            ({user.name} - {user.email})
          </span>
        </div>

        {/* Right: Quick Toggle Buttons */}
        <div className="flex items-center gap-1.5">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => switchRole(r.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-indigo-300/40'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default RoleSwitcher;

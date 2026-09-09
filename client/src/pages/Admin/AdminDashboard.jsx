import React from 'react';
import { ShieldCheck, Users, Building2, Briefcase, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { MOCK_COMPANIES, MOCK_INTERNSHIPS, MOCK_USERS } from '../../services/mockData';

const AdminDashboard = () => {
  const pendingCompanies = MOCK_COMPANIES.filter((c) => !c.verified);

  return (
    <DashboardLayout
      title="System Admin Control Center"
      subtitle="Monitor platform activity, moderate employer verification queues, user accounts, and analytics."
    >
      <div className="space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="glass" hoverable={false} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Users</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">10,520</p>
            <p className="text-xs text-slate-400 mt-1">Students & recruiters</p>
          </Card>

          <Card variant="glass" hoverable={false} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Companies</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">{MOCK_COMPANIES.length}</p>
            <p className="text-xs text-slate-400 mt-1">Verified partner employers</p>
          </Card>

          <Card variant="glass" hoverable={false} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Pending Verifications</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-amber-400">{pendingCompanies.length}</p>
            <p className="text-xs text-slate-400 mt-1">Requires admin approval</p>
          </Card>

          <Card variant="glass" hoverable={false} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Hiring Placement Rate</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-400">95.4%</p>
            <p className="text-xs text-slate-400 mt-1">Successful intern offers</p>
          </Card>
        </div>

        {/* Analytics Visual Bar Chart */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Platform Growth & Monthly Application Metrics
            </h3>
            <span className="text-xs text-slate-400 font-semibold">2026 Year-to-Date</span>
          </div>

          <div className="space-y-4">
            {[
              { month: 'May 2026', count: 1200, pct: 45 },
              { month: 'Jun 2026', count: 1850, pct: 65 },
              { month: 'Jul 2026', count: 2400, pct: 85 },
              { month: 'Aug 2026', count: 2950, pct: 95 },
              { month: 'Sep 2026 (Current)', count: 3200, pct: 100 },
            ].map((m) => (
              <div key={m.month} className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300 font-semibold">
                  <span>{m.month}</span>
                  <span className="text-indigo-400 font-bold">{m.count.toLocaleString()} Applications</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Verification Banner */}
        {pendingCompanies.length > 0 && (
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-amber-300">Pending Employer Verifications ({pendingCompanies.length})</h4>
              <p className="text-xs text-amber-200/80 mt-0.5">
                New company accounts are waiting for tax/document verification review.
              </p>
            </div>
            <Link to="/admin/verification">
              <Button variant="primary" size="sm">
                Review Approval Queue
              </Button>
            </Link>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

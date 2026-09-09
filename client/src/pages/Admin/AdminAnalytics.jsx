import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Users, Building2, Briefcase, FileText } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';

const monthlyApplicationsData = [
  { month: 'Jan', applications: 120, hires: 25 },
  { month: 'Feb', applications: 210, hires: 42 },
  { month: 'Mar', applications: 350, hires: 78 },
  { month: 'Apr', applications: 480, hires: 95 },
  { month: 'May', applications: 620, hires: 130 },
  { month: 'Jun', applications: 890, hires: 185 },
];

const topHiringCompaniesData = [
  { name: 'Microsoft', jobs: 18, hires: 45 },
  { name: 'Google', jobs: 14, hires: 38 },
  { name: 'Amazon', jobs: 12, hires: 30 },
  { name: 'Meta', jobs: 10, hires: 24 },
  { name: 'Uber', jobs: 8, hires: 19 },
];

const categoryDistributionData = [
  { name: 'Frontend React', value: 35, color: '#6366f1' },
  { name: 'Backend Node.js', value: 28, color: '#10b981' },
  { name: 'AI & Data Science', value: 22, color: '#a855f7' },
  { name: 'DevOps & Cloud', value: 15, color: '#3b82f6' },
];

const userGrowthData = [
  { month: 'Jan', students: 400, companies: 40 },
  { month: 'Feb', students: 850, companies: 75 },
  { month: 'Mar', students: 1400, companies: 120 },
  { month: 'Apr', students: 2100, companies: 180 },
  { month: 'May', students: 3100, companies: 260 },
  { month: 'Jun', students: 4500, companies: 380 },
];

const AdminAnalytics = () => {
  return (
    <DashboardLayout
      title="Platform Analytics & Insights"
      subtitle="Real-time performance metrics, recruitment volume, category shares, and platform growth graphs."
    >
      <div className="space-y-8">
        {/* Top Summary Badges */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/50 to-purple-900/40 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Platform Growth Acceleration
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Monthly candidate applications increased by <strong>+142%</strong> quarter-over-quarter.
            </p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
            ⚡ Live Supabase Analytics Sync
          </span>
        </div>

        {/* Grid of Recharts Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Applications per Month */}
          <Card variant="glass" hoverable={false} className="p-6 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Monthly Applications & Hires
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyApplicationsData}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="#6366f1" fillOpacity={1} fill="url(#colorApps)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 2: Top Hiring Companies */}
          <Card variant="glass" hoverable={false} className="p-6 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" /> Top Recruiting Companies
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topHiringCompaniesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="hires" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 3: Internship Category Shares */}
          <Card variant="glass" hoverable={false} className="p-6 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" /> Internship Roles Distribution
            </h4>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 4: Student & Company Growth */}
          <Card variant="glass" hoverable={false} className="p-6 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Cumulative User Registration Growth
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="companies" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;

import React from 'react';
import { ShieldCheck, CheckCircle2, AlertOctagon } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import { MOCK_INTERNSHIPS } from '../../services/mockData';

const JobModeration = () => {
  return (
    <DashboardLayout
      title="Internship Moderation Queue"
      subtitle="Review flagged job postings, detect suspicious listings, and enforce platform quality guidelines."
    >
      <Card variant="glass" className="p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Moderation Scan Status
          </h3>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            AI Automated Safety: ACTIVE
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center py-12 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-white">All Active Listings Cleared</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Zero fraudulent or suspicious internship listings reported. The platform automated scanner checks for spam keywords and unverified stipend demands.
          </p>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default JobModeration;

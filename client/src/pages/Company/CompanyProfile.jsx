import React from 'react';
import { Building2, CheckCircle2, Globe, MapPin, Users, Award } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { MOCK_COMPANIES } from '../../services/mockData';

const CompanyProfile = () => {
  const company = MOCK_COMPANIES[1]; // Microsoft profile

  return (
    <DashboardLayout
      title="Company Profile & Recruiter Settings"
      subtitle="Manage your company's employer branding, verification badge, and recruiter credentials."
    >
      <div className="space-y-8">
        <Card variant="glass" className="p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <img
                src={company.logo}
                alt={company.name}
                className="w-16 h-16 rounded-2xl object-contain bg-white p-2 shadow-lg shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">{company.name}</h2>
                  {company.verified && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Employer
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">{company.industry} • {company.size}</p>
              </div>
            </div>

            <Button variant="secondary" size="sm">
              Edit Employer Brand
            </Button>
          </div>

          <div className="py-6 space-y-4 text-xs text-slate-300 leading-relaxed">
            <div>
              <h4 className="font-bold text-white text-sm mb-1">About Company</h4>
              <p>{company.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>Website: <a href={company.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{company.website}</a></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>Headquarters: {company.location}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;

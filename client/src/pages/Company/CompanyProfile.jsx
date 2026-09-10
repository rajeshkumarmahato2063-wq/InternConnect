import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  Globe,
  MapPin,
  Users,
  Award,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import VerificationModal from '../../components/Company/VerificationModal';
import { companyVerificationService } from '../../services/companyVerificationService';
import { useAuth } from '../../context/AuthContext';
import { MOCK_COMPANIES } from '../../services/mockData';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [verification, setVerification] = useState({
    status: 'Pending',
    documents: {},
    verifiedAt: null,
  });
  const [showModal, setShowModal] = useState(false);

  const companyId = user?.id || 'comp_demo';
  const company = {
    name: user?.name || MOCK_COMPANIES[1].name,
    logo: user?.avatar || MOCK_COMPANIES[1].logo,
    industry: MOCK_COMPANIES[1].industry,
    size: MOCK_COMPANIES[1].size,
    description: MOCK_COMPANIES[1].description,
    website: user?.portfolio || MOCK_COMPANIES[1].website,
    location: MOCK_COMPANIES[1].location,
  };

  const loadStatus = async () => {
    const data = await companyVerificationService.getVerificationStatus(companyId);
    if (data) setVerification(data);
  };

  useEffect(() => {
    loadStatus();
  }, [companyId]);

  const renderStatusBadge = () => {
    switch (verification.status) {
      case 'Approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Verified Employer</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Verification Rejected</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Verification Pending Admin Review</span>
          </span>
        );
    }
  };

  return (
    <DashboardLayout
      title="Company Profile & Recruiter Settings"
      subtitle="Manage employer branding, tax documents, and issue platform verification badges."
    >
      <div className="space-y-8">
        {/* Verification Status Banner */}
        <Card
          variant="glass"
          className={`p-6 border ${
            verification.status === 'Approved'
              ? 'border-emerald-500/30 bg-emerald-950/20'
              : verification.status === 'Rejected'
              ? 'border-rose-500/30 bg-rose-950/20'
              : 'border-amber-500/30 bg-amber-950/20'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
                <ShieldCheck
                  className={`w-6 h-6 ${
                    verification.status === 'Approved'
                      ? 'text-emerald-400'
                      : verification.status === 'Rejected'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Employer Verification Status</h3>
                  {renderStatusBadge()}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {verification.status === 'Approved'
                    ? 'Your company is verified! Your posted internships receive priority placement on Explore.'
                    : verification.status === 'Rejected'
                    ? 'Your corporate registration documents require update. Please submit revised credentials.'
                    : 'Your corporate registration documents have been submitted and are under active review by Admin.'}
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowModal(true)}
              icon={Upload}
              className="shrink-0 border-indigo-500/30 text-indigo-300 font-bold"
            >
              {verification.status === 'Approved' ? 'Update Credentials' : 'Upload Verification Docs'}
            </Button>
          </div>
        </Card>

        {/* Employer Main Card */}
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
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {company.industry} • {company.size}
                </p>
              </div>
            </div>

            <Button variant="secondary" size="sm" onClick={() => setShowModal(true)}>
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
                <span>
                  Website:{' '}
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    {company.website}
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>Headquarters: {company.location}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Verification Submission Modal */}
      <VerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmitted={loadStatus}
      />
    </DashboardLayout>
  );
};

export default CompanyProfile;

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
import UserAvatar from '../../components/Common/UserAvatar';
import VerificationModal from '../../components/Company/VerificationModal';
import { companyVerificationService } from '../../services/companyVerificationService';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [verification, setVerification] = useState({
    status: 'Pending',
    documents: {},
    verifiedAt: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    name: user?.name || '',
    logo: user?.avatar || '',
    industry: '',
    size: '',
    description: '',
    website: '',
    location: '',
  });

  const companyId = user?.id;

  const loadStatusAndProfile = async () => {
    if (!companyId) return;

    // Load verification status
    const data = await companyVerificationService.getVerificationStatus(companyId);
    if (data) setVerification(data);

    // Load company profile from Supabase
    try {
      const { data: profileData } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', companyId)
        .maybeSingle();

      if (profileData) {
        setCompanyDetails({
          name: profileData.company_name || user?.name || '',
          logo: profileData.logo_url || user?.avatar || '',
          industry: profileData.industry || '',
          size: profileData.company_size || '',
          description: profileData.description || '',
          website: profileData.website_url || '',
          location: profileData.headquarters || '',
        });
      } else {
        // Fallback to user metadata if company profile row isn't initialized yet
        setCompanyDetails({
          name: user?.name || '',
          logo: user?.avatar || '',
          industry: '',
          size: '',
          description: 'No company description added yet. Edit employer brand to complete your company page.',
          website: '',
          location: '',
        });
      }
    } catch (err) {
      console.warn('Could not fetch company profile:', err);
    }
  };

  useEffect(() => {
    loadStatusAndProfile();
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
      subtitle="Manage employer branding, tax documents, and platform verification status."
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
                    : 'Your corporate registration documents have been submitted and are under review by Admin.'}
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
              <UserAvatar
                name={companyDetails.name || user?.email}
                email={user?.email}
                src={companyDetails.logo}
                size="2xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">
                    {companyDetails.name || 'Complete Company Profile'}
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {companyDetails.industry || 'Industry Not Specified'} • {companyDetails.size || 'Size Not Specified'}
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
              <p className={!companyDetails.description ? 'text-slate-500 italic' : ''}>
                {companyDetails.description || 'No company description added yet. Click "Edit Employer Brand" to complete.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>
                  Website:{' '}
                  {companyDetails.website ? (
                    <a
                      href={companyDetails.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:underline"
                    >
                      {companyDetails.website}
                    </a>
                  ) : (
                    <span className="text-slate-500 italic">Not specified</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>
                  Headquarters:{' '}
                  {companyDetails.location ? (
                    companyDetails.location
                  ) : (
                    <span className="text-slate-500 italic">Not specified</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Verification Submission Modal */}
      <VerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmitted={loadStatusAndProfile}
      />
    </DashboardLayout>
  );
};

export default CompanyProfile;

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Building2,
  ShieldCheck,
  ExternalLink,
  FileText,
  Clock,
  AlertTriangle,
  Globe,
  Eye,
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { companyVerificationService } from '../../services/companyVerificationService';
import { useNotifications } from '../../context/NotificationContext';

const CompanyVerification = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending'); // 'Pending', 'Approved', 'Rejected', 'All'
  const [selectedDoc, setSelectedDoc] = useState(null);
  const { addNotification } = useNotifications();

  const loadCompanies = async () => {
    setLoading(true);
    const data = await companyVerificationService.fetchPendingCompanies();
    setCompanies(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleUpdateStatus = async (companyId, newStatus, companyName) => {
    await companyVerificationService.updateStatus(companyId, newStatus);

    addNotification({
      title: `Company ${newStatus} 🛡️`,
      message: `${companyName} verification status updated to ${newStatus}.`,
      type: newStatus === 'Approved' ? 'shortlisted' : 'info',
    });

    loadCompanies();
  };

  const filteredCompanies = companies.filter((c) => {
    if (filter === 'All') return true;
    return (c.status || 'Pending') === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Pending Review
          </span>
        );
    }
  };

  return (
    <DashboardLayout
      title="Employer Verification Dashboard"
      subtitle="Review employer corporate registration documents, tax IDs, and issue platform verification badges."
    >
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === tab
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab} Queue ({companies.filter((c) => tab === 'All' || (c.status || 'Pending') === tab).length})
              </button>
            ))}
          </div>
        </div>

        {/* Main Table / List View */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" /> Verification Requests ({filter})
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              Showing {filteredCompanies.length} records
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading company verification queue...</div>
          ) : filteredCompanies.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="font-bold text-slate-300">No {filter} Verification Requests</p>
              <p className="text-xs">Companies submitting corporate credentials will appear here for review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCompanies.map((comp) => (
                <div
                  key={comp.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-colors hover:border-slate-700"
                >
                  {/* Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={comp.logo}
                      alt={comp.name}
                      className="w-14 h-14 rounded-2xl object-contain bg-white p-2 shadow-md shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-bold text-base">{comp.name}</h4>
                        {getStatusBadge(comp.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1.5">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-indigo-400" />
                          <a href={comp.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                            {comp.website}
                          </a>
                        </span>
                        <span>•</span>
                        <span>Tax ID: <strong className="text-slate-200">{comp.taxId}</strong></span>
                        <span>•</span>
                        <span>Submitted: {comp.submittedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(comp)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" /> View Docs
                    </button>

                    {comp.status !== 'Approved' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(comp.id, 'Approved', comp.name)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                    )}

                    {comp.status !== 'Rejected' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(comp.id, 'Rejected', comp.name)}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* View Document Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">Corporate Verification Details</h3>
                <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p><strong>Company:</strong> {selectedDoc.name}</p>
                <p><strong>Tax/EIN ID:</strong> {selectedDoc.taxId}</p>
                <p><strong>Official Website:</strong> {selectedDoc.website}</p>
                <p><strong>Registration Certificate Document:</strong></p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <span className="font-mono text-slate-200">corporate_reg_certificate.pdf</span>
                  </div>
                  <a
                    href={selectedDoc.registrationDoc}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1"
                  >
                    Open Document <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="secondary" size="sm" onClick={() => setSelectedDoc(null)}>
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyVerification;

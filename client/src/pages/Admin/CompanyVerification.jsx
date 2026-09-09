import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Building2, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import { apiService } from '../../services/api';

const CompanyVerification = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCompanies = async () => {
    setLoading(true);
    const data = await apiService.getCompanies();
    setCompanies(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleVerify = async (companyId, status) => {
    await apiService.verifyCompany(companyId, status);
    loadCompanies();
  };

  return (
    <DashboardLayout
      title="Employer Verification Dashboard"
      subtitle="Verify employer legitimacy, corporate tax credentials, and issue platform verification badges."
    >
      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" /> Employer Verification Queue
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Total: {companies.length} Companies</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading companies...</div>
        ) : (
          <div className="space-y-4">
            {companies.map((comp) => (
              <div
                key={comp.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={comp.logo}
                    alt={comp.name}
                    className="w-12 h-12 rounded-xl object-contain bg-white p-1.5 shadow-md shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-bold text-base">{comp.name}</h4>
                      {comp.verified ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          Pending Review
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {comp.industry} • Location: {comp.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {!comp.verified ? (
                    <button
                      type="button"
                      onClick={() => handleVerify(comp.id, true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Issue Badge
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleVerify(comp.id, false)}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Revoke Badge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default CompanyVerification;

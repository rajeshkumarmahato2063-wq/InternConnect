import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, Share2, ShieldCheck, QrCode, Building, Sparkles, RefreshCw, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import internshipService from '../../services/internshipService';

export default function StudentCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await internshipService.getStudentCertificates(user.id);
      setCertificates(data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareOnLinkedIn = (cert) => {
    const text = `I am excited to share my official Internship Completion Certificate from ${cert.company_name} for the role of ${cert.job_title}! Verified on InternConnect AI (ID: ${cert.verification_code}).`;
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <DashboardLayout
      title="Verified Completion Certificates"
      subtitle="Digital credentials backed by Supabase verification & QR code authentication."
    >
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Authenticated Credentials
            </span>
            <h2 className="text-2xl font-bold text-white">Your Earned Certificates</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Showcase verified completion certificates to top recruiters or export them directly to your LinkedIn profile.
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
            <span>Loading verified certificates...</span>
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <Award className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Completion Certificates Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Once you complete an internship term, employer completion certificates will be generated here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-6"
              >
                {/* Visual Watermark */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      <img
                        src={cert.company_logo || 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'}
                        alt={cert.company_name}
                        className="w-9 h-9 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{cert.job_title || 'AI Development Intern'}</h3>
                      <p className="text-xs text-purple-400 font-semibold">{cert.company_name || 'Tech Organization'}</p>
                    </div>
                  </div>

                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Credential
                  </span>
                </div>

                {/* Body Details & QR Code */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="space-y-2 text-xs">
                    <p className="text-slate-400">
                      Recipient Candidate: <strong className="text-white">{user?.name || 'Aarav Sharma'}</strong>
                    </p>
                    <p className="text-slate-400">
                      Issued On: <strong className="text-white">{new Date(cert.issued_at).toLocaleDateString()}</strong>
                    </p>
                    <p className="text-slate-400 flex items-center gap-1.5">
                      <span>Verification ID:</span>
                      <code className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono text-[11px]">
                        {cert.verification_code}
                      </code>
                    </p>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-14 h-14 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
                      <QrCode className="w-full h-full text-slate-950" />
                    </div>
                    <div className="text-[10px] text-slate-400">
                      <p className="font-bold text-white">Scan to Verify</p>
                      <p className="text-slate-400">InternConnect AI Blockchain Proof</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    onClick={() => handleShareOnLinkedIn(cert)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 transition-all flex items-center space-x-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share on LinkedIn</span>
                  </button>

                  <a
                    href={cert.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/30 transition-all flex items-center space-x-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certificate</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  X,
  Globe,
  FileText,
  Building,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import Button from '../Button/Button';
import { companyVerificationService } from '../../services/companyVerificationService';
import { useAuth } from '../../context/AuthContext';

const VerificationModal = ({ isOpen, onClose, onSubmitted }) => {
  const { user } = useAuth();
  const companyId = user?.id || 'demo_company_id';

  const [logoUrl, setLogoUrl] = useState(user?.avatar || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=150&q=80');
  const [websiteUrl, setWebsiteUrl] = useState(user?.portfolio || 'https://company.example.com');
  const [registrationDocUrl, setRegistrationDocUrl] = useState('https://example.com/docs/corporate_inc_certificate.pdf');
  const [taxId, setTaxId] = useState('EIN-984012948');
  const [notes, setNotes] = useState('Official tax registration and corporate incorporation documents.');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await companyVerificationService.submitRequest(companyId, {
        logoUrl,
        websiteUrl,
        registrationDocUrl,
        taxId,
        notes,
      });

      setSuccess(true);
      if (onSubmitted) onSubmitted();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to submit verification request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl rounded-3xl bg-slate-900/95 border border-indigo-500/30 shadow-2xl backdrop-blur-2xl overflow-hidden z-10 p-6 sm:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Employer Verification Request</h3>
                <p className="text-xs text-slate-400">
                  Submit credentials to receive the Verified Employer badge & priority search ranking
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="py-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" /> Company Logo URL
              </label>
              <input
                type="url"
                required
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://company.com/logo.png"
                className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" /> Official Website URL
              </label>
              <input
                type="url"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://company.com"
                className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Registration Document URL / PDF Link
              </label>
              <input
                type="url"
                required
                value={registrationDocUrl}
                onChange={(e) => setRegistrationDocUrl(e.target.value)}
                placeholder="https://company.com/legal/certificate_inc.pdf"
                className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Corporate Tax / EIN Registration ID
              </label>
              <input
                type="text"
                required
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="e.g. EIN-98-102934"
                className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Additional Recruiter Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details regarding your corporate incorporation and recruiter authority..."
                className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Submit Bar */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
              <Button type="button" variant="secondary" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading || success}
                icon={loading ? RefreshCw : success ? CheckCircle2 : Upload}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 font-bold"
              >
                {loading ? 'Submitting Documents...' : success ? 'Submitted for Admin Review!' : 'Submit Verification Request'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VerificationModal;

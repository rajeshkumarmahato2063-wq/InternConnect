import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, CheckCircle, XCircle, FileText, Building, Calendar, DollarSign, Sparkles, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import internshipService from '../../services/internshipService';

export default function StudentOffers() {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [actionType, setActionType] = useState(null); // 'accept' or 'decline'
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, [user]);

  const fetchOffers = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await internshipService.getStudentOffers(user.id);
      setOffers(data);
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedOffer || !actionType) return;
    try {
      setProcessing(true);
      const newStatus = actionType === 'accept' ? 'Accepted' : 'Declined';
      await internshipService.respondToOffer(selectedOffer.id, newStatus);
      setOffers((prev) =>
        prev.map((o) => (o.id === selectedOffer.id ? { ...o, status: newStatus } : o))
      );
      setSelectedOffer(null);
      setActionType(null);
    } catch (err) {
      console.error('Failed to respond to offer:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout
      title="Official Offer Letters"
      subtitle="Review, accept, or decline official internship offer letters issued by recruiters."
    >
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-indigo-900/40 to-blue-900/40 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Career Milestones
            </span>
            <h2 className="text-2xl font-bold text-white">Your Internship Offers</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Congratulations on receiving offer letters! Accept your offer to initiate onboarding.
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
            <span>Loading offer letters...</span>
          </div>
        ) : offers.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <Award className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Offer Letters Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Complete your scheduled technical interviews to receive official internship offer letters here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      <img
                        src={offer.company_logo || 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'}
                        alt={offer.company_name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{offer.job_title || 'Software Intern'}</h3>
                      <p className="text-xs text-indigo-400 font-semibold">{offer.company_name || 'Tech Company'}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase ${
                      offer.status === 'Accepted'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : offer.status === 'Declined'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-slate-400 uppercase font-semibold text-[10px]">Monthly Stipend</p>
                      <p className="text-white font-bold">{offer.stipend || '$5,000 / mo'}</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-slate-400 uppercase font-semibold text-[10px]">Issued Date</p>
                      <p className="text-white font-bold">{new Date(offer.issued_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-slate-400 uppercase font-semibold text-[10px]">Document</p>
                      <a
                        href={offer.offer_letter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Download PDF</span>
                        <Download className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {offer.status === 'Pending' && (
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setSelectedOffer(offer);
                        setActionType('decline');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all"
                    >
                      Decline Offer
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOffer(offer);
                        setActionType('accept');
                      }}
                      className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept Offer</span>
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {selectedOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4"
            >
              <h3 className="text-lg font-bold text-white">
                {actionType === 'accept' ? 'Accept Internship Offer?' : 'Decline Offer?'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {actionType === 'accept'
                  ? `Are you sure you want to accept the offer for ${selectedOffer.job_title} at ${selectedOffer.company_name}? This will notify the recruiter.`
                  : `Are you sure you want to decline the offer from ${selectedOffer.company_name}?`}
              </p>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setSelectedOffer(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={processing}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-lg ${
                    actionType === 'accept' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {processing ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Trash2, Search } from 'lucide-react';
import Card from '../../components/Card/Card';
import EmptyState from '../../components/Common/EmptyState';
import StatusTimeline from '../../components/Common/StatusTimeline';
import { useAuth } from '../../context/AuthContext';
import { internshipService } from '../../services/internshipService';

export const statusSteps = ['Applied', 'Shortlisted', 'Interview', 'Selected'];

const ApplicationTracker = () => {
  const { user } = useAuth();
  const [userApplications, setUserApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const apps = await internshipService.getUserApplications(user.id);
        setUserApplications(apps || []);
      } else {
        setUserApplications([]);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setUserApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();

    if (user?.id) {
      const unsubscribe = internshipService.subscribeToApplications(user.id, () => {
        fetchApplications();
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    setWithdrawingId(appId);
    try {
      await internshipService.withdrawApplication(appId);
      await fetchApplications();
    } catch (err) {
      console.error('Withdraw application error:', err);
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* Header Banner */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Application Tracker</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time recruitment status pipeline, status timeline, and scheduled interviews.
          </p>
        </div>
        <a
          href="/explore"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Search className="w-3.5 h-3.5" /> Browse Internships
        </a>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <p className="text-xs font-medium">Loading your internship applications...</p>
        </div>
      ) : userApplications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="You haven't applied for any internships yet."
          description="Explore active internship listings and submit your profile with 1-click!"
          actionLabel="Browse Internships"
          onAction={() => (window.location.href = '/explore')}
        />
      ) : (
        <div className="space-y-6">
          {userApplications.map((app) => {
            const isRejected = app?.status === 'Rejected';
            const isWithdrawn = app?.status === 'Withdrawn';
            const isSelected = app?.status === 'Selected';
            const canWithdraw = !isRejected && !isWithdrawn && !isSelected;

            return (
              <Card key={app.id} variant="glass" hoverable={false} className="p-6 sm:p-8 space-y-6">
                
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-start gap-4">
                    {app?.companyLogo ? (
                      <img
                        src={app.companyLogo}
                        alt={app.companyName || 'Company'}
                        className="w-14 h-14 rounded-2xl object-contain bg-white p-1.5 shadow-md shrink-0 border border-slate-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shrink-0">
                        {(app?.companyName || 'C').charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {app?.companyName || 'Hiring Employer'}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {app?.jobTitle || 'Internship Position'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Applied on: {app?.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'} • Resume: {app?.resumeName || 'Primary Resume'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isRejected
                          ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30'
                          : isWithdrawn
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                          : isSelected
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      Status: {app?.status || 'Applied'}
                    </span>

                    {canWithdraw && (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(app.id)}
                        disabled={withdrawingId === app.id}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-colors flex items-center gap-1"
                        title="Withdraw Application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{withdrawingId === app.id ? 'Withdrawing...' : 'Withdraw'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Timeline Stepper */}
                <StatusTimeline status={app?.status} />

                {/* Interview Details Sub-box if scheduled */}
                {app?.interviewDetails && (
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-gradient-to-r dark:from-indigo-950/80 dark:to-purple-950/80 border border-indigo-200 dark:border-indigo-500/40 text-xs text-slate-800 dark:text-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-300">
                        <Calendar className="w-4 h-4" /> Scheduled Technical Interview
                      </span>
                      {app.interviewDetails.meetingLink && (
                        <a
                          href={app.interviewDetails.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[11px] hover:bg-indigo-500"
                        >
                          Launch Meeting &rarr;
                        </a>
                      )}
                    </div>
                    <p>📅 <strong>Date:</strong> {app.interviewDetails.date} | ⏰ <strong>Time:</strong> {app.interviewDetails.time}</p>
                    <p className="text-slate-500 dark:text-slate-400">Interviewer: {app.interviewDetails.interviewer || 'Hiring Manager'}</p>
                  </div>
                )}

              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Clock, Calendar, Video, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import EmptyState from '../../components/Common/EmptyState';
import StatusTimeline from '../../components/Common/StatusTimeline';
import { useAuth } from '../../context/AuthContext';
import { internshipService } from '../../services/internshipService';

const ApplicationTracker = () => {
  const { user, applications: fallbackApps } = useAuth();
  const [userApplications, setUserApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    if (user?.id) {
      const apps = await internshipService.getUserApplications(user.id);
      if (apps && apps.length > 0) {
        setUserApplications(apps);
        setLoading(false);
        return;
      }
    }
    setUserApplications(fallbackApps || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();

    // Subscribe to real-time application updates for student
    const unsubscribe = internshipService.subscribeToApplications(user?.id, () => {
      fetchApplications();
    });

    return () => unsubscribe();
  }, [user, fallbackApps]);

  const normalizeStatus = (st) => {
    if (!st) return 'Applied';
    if (st === 'Under Review') return 'Reviewing';
    if (st === 'Interview Scheduled') return 'Interview';
    return st;
  };

  const getStepIndex = (status) => {
    const norm = normalizeStatus(status);
    if (norm === 'Rejected') return -1;
    return statusSteps.indexOf(norm);
  };

  return (
    <DashboardLayout
      title="Application Tracker"
      subtitle="Real-time recruitment status pipeline, review notes, and scheduled interviews."
    >
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading application tracker...</div>
      ) : userApplications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Applications Submitted"
          description="You haven't submitted any internship applications yet. Explore listings and apply with 1-click!"
          actionLabel="Explore Jobs"
          onAction={() => (window.location.href = '/explore')}
        />
      ) : (
        <div className="space-y-6">
          {userApplications.map((app) => {
            const currentStepIdx = getStepIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <Card key={app.id} variant="glass" hoverable={false} className="p-6 sm:p-8 space-y-6">
                
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <img
                      src={app.companyLogo}
                      alt={app.companyName}
                      className="w-14 h-14 rounded-2xl object-contain bg-white p-1.5 shadow-md shrink-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                        {app.companyName}
                      </span>
                      <h3 className="text-lg font-bold text-white leading-snug">{app.jobTitle}</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Applied on: {new Date(app.appliedAt).toLocaleDateString()} • Resume: {app.resumeName}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isRejected
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    Status: {app.status}
                  </span>
                </div>

                {/* Status Timeline Stepper */}
                <StatusTimeline status={app.status} />

                {/* Interview Details Sub-box if scheduled */}
                {app.interviewDetails && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-500/40 text-xs text-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span className="flex items-center gap-1.5 text-indigo-300">
                        <Calendar className="w-4 h-4" /> Scheduled Technical Interview
                      </span>
                      <a
                        href={app.interviewDetails.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[11px] hover:bg-indigo-500"
                      >
                        Launch Meeting &rarr;
                      </a>
                    </div>
                    <p>📅 <strong>Date:</strong> {app.interviewDetails.date} | ⏰ <strong>Time:</strong> {app.interviewDetails.time}</p>
                    <p className="text-slate-400">Interviewer: {app.interviewDetails.interviewer}</p>
                  </div>
                )}

              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ApplicationTracker;

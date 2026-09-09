import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle2, XCircle, FileText, Award, Download, Eye, ExternalLink, Send } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import InterviewSchedulerModal from '../../components/Modals/InterviewSchedulerModal';
import OfferLetterModal from '../../components/Modals/OfferLetterModal';
import { useAuth } from '../../context/AuthContext';
import { internshipService } from '../../services/internshipService';

const ApplicantManagement = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [offerCandidate, setOfferCandidate] = useState(null);

  const loadApplicants = async () => {
    setLoading(true);
    let data = [];
    if (user?.id) {
      data = await internshipService.getCompanyApplications(user.id);
    } else {
      data = await internshipService.getCompanyApplications(null);
    }
    // Sort candidates by AI Match Score descending
    data.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadApplicants();
  }, [user]);

  const handleUpdateStatus = async (appId, status) => {
    await internshipService.updateApplicationStatus(appId, status);
    loadApplicants();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <DashboardLayout
      title="Candidate Pipeline & AI Match Ranking"
      subtitle="Screen applicants ranked by AI resume score, shortlist high-potential candidates, or schedule technical interviews."
    >
      <div className="space-y-6">
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Applicant Pipeline ({applications.length})
            </h3>
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              Sorted by AI Candidate Match Score
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading candidate applications...</div>
          ) : applications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No student applications received yet.</div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const resumeUrl = app.resume_url || app.student?.resume_url;
                const skills = app.student?.skills || app.skills || [];

                return (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                  >
                    {/* Candidate Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-md shrink-0">
                        <img
                          src={app.studentAvatar || app.student?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={app.studentName || app.student?.full_name || 'Student'}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-white font-bold text-base">
                            {app.studentName || app.student?.full_name || 'Student Candidate'}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-400" /> {app.matchScore || 85}% Match
                          </span>
                          {app.applied_at && (
                            <span className="text-xs text-slate-500">
                              • Applied {formatDate(app.applied_at)}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400">
                          Applied for: <strong className="text-slate-200">{app.jobTitle || app.internship?.title}</strong> • {app.studentCollege || app.student?.college || 'University'} ({app.studentDegree || app.student?.degree || 'Degree'})
                        </p>

                        {/* Skills Badges */}
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {skills.slice(0, 5).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {app.coverLetter && (
                          <p className="text-xs text-slate-300 italic mt-1 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                            "{app.coverLetter}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions & Resume Button */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      {resumeUrl && (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Resume</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          app.status === 'Interview' || app.status === 'Interview Scheduled'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : app.status === 'Shortlisted'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : app.status === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {app.status || 'Applied'}
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedCandidate(app)}
                          icon={Calendar}
                        >
                          Schedule
                        </Button>

                        <button
                          type="button"
                          onClick={() => setOfferCandidate(app)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
                          title="Issue Official Offer Letter"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Offer</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                          className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30"
                          title="Shortlist Candidate"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                          title="Reject Candidate"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <InterviewSchedulerModal
        applicant={selectedCandidate}
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        onInterviewScheduled={() => loadApplicants()}
      />

      <OfferLetterModal
        applicant={offerCandidate}
        isOpen={Boolean(offerCandidate)}
        onClose={() => setOfferCandidate(null)}
        onOfferSent={() => loadApplicants()}
      />
    </DashboardLayout>
  );
};

export default ApplicantManagement;


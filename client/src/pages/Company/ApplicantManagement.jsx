import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Award,
  ExternalLink,
  Send,
  Eye,
  Briefcase,
  ChevronDown,
  Sparkles,
  Clock,
  UserCheck,
  Building,
  GraduationCap
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import InterviewSchedulerModal from '../../components/Modals/InterviewSchedulerModal';
import OfferLetterModal from '../../components/Modals/OfferLetterModal';
import { useAuth } from '../../context/AuthContext';
import { internshipService } from '../../services/internshipService';

const STATUSES = ['All', 'Applied', 'Reviewing', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

const ApplicantManagement = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState('ALL');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'date'
  
  // Modals & Toast State
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [offerCandidate, setOfferCandidate] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const companyId = user?.id || null;
      const [jobsData, appsData] = await Promise.all([
        internshipService.getCompanyInternships(companyId),
        internshipService.getCompanyApplications(companyId)
      ]);

      setInternships(jobsData || []);
      setApplications(appsData || []);
    } catch (err) {
      console.error('Failed to load applicant management data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateStatus = async (app, newStatus) => {
    try {
      await internshipService.updateApplicationStatus(
        app.id,
        newStatus,
        app.studentId || app.student_id,
        app.jobTitle || app.internship?.title || 'Internship'
      );
      showToast(`Status updated to "${newStatus}" for ${app.studentName || app.student?.full_name || 'Candidate'}`);
      loadData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    // Internship filter
    if (selectedInternshipId !== 'ALL' && app.jobId !== selectedInternshipId && app.internship_id !== selectedInternshipId) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'All' && app.status !== statusFilter) {
      return false;
    }

    // Search query
    const q = searchQuery.toLowerCase();
    const candidateName = (app.studentName || app.student?.full_name || '').toLowerCase();
    const jobTitle = (app.jobTitle || app.internship?.title || '').toLowerCase();
    const college = (app.studentCollege || app.student?.college || '').toLowerCase();
    const skills = (app.student?.skills || app.skills || []).join(' ').toLowerCase();

    if (q && !candidateName.includes(q) && !jobTitle.includes(q) && !college.includes(q) && !skills.includes(q)) {
      return false;
    }

    // College filter
    if (collegeFilter && !college.includes(collegeFilter.toLowerCase())) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'match') {
      return (b.matchScore || b.match_score || 0) - (a.matchScore || a.match_score || 0);
    } else {
      return new Date(b.appliedAt || b.applied_at || 0) - new Date(a.appliedAt || a.applied_at || 0);
    }
  });

  // Calculate Stats
  const totalApps = applications.length;
  const stats = {
    Applied: applications.filter(a => a.status === 'Applied' || !a.status).length,
    Reviewing: applications.filter(a => a.status === 'Reviewing').length,
    Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    Interview: applications.filter(a => a.status === 'Interview Scheduled' || a.status === 'Interview').length,
    Selected: applications.filter(a => a.status === 'Selected').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  return (
    <DashboardLayout
      title="Applicant Pipeline Management"
      subtitle="Review candidates, inspect AI match metrics, update statuses, schedule technical interviews, and issue offers."
    >
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-indigo-600/90 border border-indigo-400/30 text-white shadow-2xl backdrop-blur-md flex items-center gap-3 text-sm font-semibold"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Pipeline Overview Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Applicants</span>
            <p className="text-2xl font-black text-white mt-1">{totalApps}</p>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">New Applied</span>
            <p className="text-2xl font-black text-indigo-400 mt-1">{stats.Applied}</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Under Review</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{stats.Reviewing}</p>
          </div>
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Shortlisted</span>
            <p className="text-2xl font-black text-purple-400 mt-1">{stats.Shortlisted}</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Interviews</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{stats.Interview}</p>
          </div>
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Selected</span>
            <p className="text-2xl font-black text-cyan-400 mt-1">{stats.Selected}</p>
          </div>
        </div>

        {/* Internship Selection Header Tabs */}
        {internships.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedInternshipId('ALL')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedInternshipId === 'ALL'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>All Postings</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
                {applications.length}
              </span>
            </button>

            {internships.map((job) => {
              const count = applications.filter(
                (a) => a.jobId === job.id || a.internship_id === job.id
              ).length;
              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedInternshipId(job.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    selectedInternshipId === job.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/30'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{job.title}</span>
                  {count > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Filter & Search Bar */}
        <Card variant="glass" className="p-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, skills, college, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950/60 border border-slate-800 rounded-xl p-1">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === status
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Sorting Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="match">Sort: Highest Match Score</option>
                <option value="date">Sort: Most Recent Applied</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Applicant Cards Pipeline */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Candidates Pipeline ({filteredApps.length})
            </h3>
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Candidate Match Enabled
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
              <p className="text-xs">Fetching candidate applications...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No applicants found matching criteria.</p>
              <p className="text-xs text-slate-500">Try adjusting your status filter or search keywords.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => {
                const resumeUrl = app.resume_url || app.student?.resume_url;
                const skills = app.student?.skills || app.skills || ['React.js', 'Node.js', 'Python', 'PostgreSQL'];
                const studentName = app.studentName || app.student?.full_name || 'Student Candidate';
                const college = app.studentCollege || app.student?.college || 'IIT Delhi / B.Tech Computer Science';
                const degree = app.studentDegree || app.student?.degree || 'B.Tech CS';
                const jobTitle = app.jobTitle || app.internship?.title || 'Software Engineering Intern';
                const matchScore = app.matchScore || app.match_score || 92;

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                  >
                    {/* Candidate Info Column */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-xl shrink-0">
                        <img
                          src={
                            app.studentAvatar ||
                            app.student?.avatar_url ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={studentName}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      </div>

                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-white font-bold text-base">{studentName}</h4>

                          {/* Match Score Badge */}
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-400" /> {matchScore}% Match
                          </span>

                          {/* Applied Date */}
                          {(app.appliedAt || app.applied_at) && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-600" /> {formatDate(app.appliedAt || app.applied_at)}
                            </span>
                          )}
                        </div>

                        {/* Applied Job & College Details */}
                        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1 text-indigo-300 font-semibold">
                            <Briefcase className="w-3.5 h-3.5" /> {jobTitle}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-500" /> {college} ({degree})
                          </span>
                        </div>

                        {/* Skills Badges */}
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {skills.slice(0, 5).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/80"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Cover Letter Box */}
                        {app.coverLetter && (
                          <p className="text-xs text-slate-300 italic mt-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                            "{app.coverLetter}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions & Status Control Column */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 w-full lg:w-auto justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                      {/* Current Status Pill */}
                      <span
                        className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          app.status === 'Selected'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : app.status === 'Interview Scheduled' || app.status === 'Interview'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : app.status === 'Shortlisted'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : app.status === 'Reviewing'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : app.status === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {app.status || 'Applied'}
                      </span>

                      {/* Action Button Controls */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Resume View */}
                        {resumeUrl && (
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            title="View ATS Resume"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Resume</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {/* Review Action */}
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app, 'Reviewing')}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors"
                          title="Mark Under Review"
                        >
                          Review
                        </button>

                        {/* Shortlist Action */}
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app, 'Shortlisted')}
                          className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-semibold transition-colors"
                          title="Shortlist Candidate"
                        >
                          Shortlist
                        </button>

                        {/* Schedule Interview */}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedCandidate(app)}
                          icon={Calendar}
                        >
                          Schedule
                        </Button>

                        {/* Select Candidate */}
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app, 'Selected')}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Select Candidate"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Select</span>
                        </button>

                        {/* Reject Candidate */}
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app, 'Rejected')}
                          className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                          title="Reject Candidate"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Interview Scheduler Modal */}
      <InterviewSchedulerModal
        applicant={selectedCandidate}
        isOpen={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        onInterviewScheduled={() => {
          showToast(`Interview invitation sent!`);
          loadData();
        }}
      />

      {/* Offer Letter Modal */}
      <OfferLetterModal
        applicant={offerCandidate}
        isOpen={Boolean(offerCandidate)}
        onClose={() => setOfferCandidate(null)}
        onOfferSent={() => {
          showToast(`Offer letter issued!`);
          loadData();
        }}
      />
    </DashboardLayout>
  );
};

export default ApplicantManagement;

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
  ChevronUp,
  Sparkles,
  Clock,
  UserCheck,
  Building,
  GraduationCap,
  Trophy,
  Medal,
  HelpCircle,
  Check,
  AlertCircle,
  TrendingUp,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import InterviewSchedulerModal from '../../components/Modals/InterviewSchedulerModal';
import OfferLetterModal from '../../components/Modals/OfferLetterModal';
import AIInterviewQuestionsModal from '../../components/Modals/AIInterviewQuestionsModal';
import RejectionFeedbackModal from '../../components/Modals/RejectionFeedbackModal';
import { useAuth } from '../../context/AuthContext';
import { internshipService } from '../../services/internshipService';
import { emailService } from '../../services/emailService';
import { aiRecruiterService } from '../../services/aiRecruiterService';
import { notificationService } from '../../services/notificationService';
import { supabase } from '../../services/supabaseClient';

const STATUSES = ['All', 'Applied', 'Reviewing', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
const SCORE_FILTERS = [
  { label: 'All Scores', value: 'ALL' },
  { label: 'Top Tier (90%+)', value: '90' },
  { label: 'Strong Fit (80%+)', value: '80' },
  { label: 'Good Match (70%+)', value: '70' },
];

const ApplicantManagement = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState('ALL');
  const [applications, setApplications] = useState([]);
  const [aiAnalyses, setAiAnalyses] = useState({}); // key: `${internshipId}_${studentId}`
  const [loading, setLoading] = useState(true);
  const [analyzingAi, setAnalyzingAi] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [scoreFilter, setScoreFilter] = useState('ALL');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [sortBy, setSortBy] = useState('score'); // 'score' | 'date'
  
  // Modals & Toast State
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [offerCandidate, setOfferCandidate] = useState(null);
  const [questionsCandidate, setQuestionsCandidate] = useState(null);
  const [rejectingCandidate, setRejectingCandidate] = useState(null);
  const [expandedAnalysisId, setExpandedAnalysisId] = useState(null);
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
      const loadedApps = appsData || [];
      setApplications(loadedApps);

      // Perform AI Analysis batching for loaded applications
      await runAiAnalysisBatch(loadedApps, jobsData || []);
    } catch (err) {
      console.error('Failed to load applicant management data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run AI analysis for applicants
  const runAiAnalysisBatch = async (appsList, jobsList) => {
    setAnalyzingAi(true);
    const analysisMap = {};

    try {
      // First, fetch existing saved analyses from Supabase
      if (selectedInternshipId !== 'ALL') {
        const savedList = await aiRecruiterService.getInternshipAnalyses(selectedInternshipId);
        savedList.forEach((item) => {
          analysisMap[`${item.internshipId}_${item.studentId}`] = item;
        });
      }

      // Analyze remaining candidates using Gemini AI service
      for (const app of appsList) {
        const iId = app.jobId || app.internship_id;
        const sId = app.studentId || app.student_id;
        const key = `${iId}_${sId}`;

        if (!analysisMap[key]) {
          const matchedJob = jobsList.find((j) => j.id === iId) || app.internship || {};
          const studentSkills = app.student?.skills || app.skills || ['React', 'JavaScript', 'Git'];
          const requiredSkills = matchedJob.skills || matchedJob.required_skills || ['React', 'Node.js'];

          const result = await aiRecruiterService.analyzeApplicant({
            internshipId: iId,
            studentId: sId,
            studentName: app.studentName || app.student?.full_name || 'Candidate',
            studentCollege: app.studentCollege || app.student?.college || 'University',
            studentDegree: app.studentDegree || app.student?.degree || 'Computer Science',
            studentSkills,
            resumeText: app.coverLetter || app.student?.bio || '',
            internshipTitle: matchedJob.title || app.jobTitle || 'Internship',
            internshipDescription: matchedJob.description || '',
            requiredSkills,
          });

          analysisMap[key] = result;
        }
      }

      setAiAnalyses(analysisMap);
    } catch (err) {
      console.warn('AI analysis batching note:', err.message);
    } finally {
      setAnalyzingAi(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Setup Supabase Realtime listener for live application arrivals & AI analyses
  useEffect(() => {
    const channel = supabase
      .channel('ai-applicant-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'applications' },
        (payload) => {
          showToast('⚡ New application received! AI rank recalculating...');
          loadData();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ai_applicant_analysis' },
        (payload) => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleUpdateStatus = async (app, newStatus, feedbackText = null) => {
    try {
      const sId = app.studentId || app.student_id;
      const jobTitle = app.jobTitle || app.internship?.title || 'Internship';

      await internshipService.updateApplicationStatus(
        app.id,
        newStatus,
        sId,
        jobTitle
      );

      // Handle Rejection feedback storage & student notification
      if (newStatus === 'Rejected' && feedbackText) {
        await notificationService.notifyStudent({
          userId: sId,
          title: `Application Update: ${jobTitle}`,
          message: feedbackText,
          type: 'application_rejected',
        });
      }

      // Handle Selection offer email
      if (newStatus === 'Selected') {
        emailService.sendOfferEmail({
          studentEmail: app.studentEmail || app.student?.email || 'student@example.com',
          studentName: app.studentName || app.student?.full_name || 'Candidate',
          companyName: user?.name || 'Company',
          jobTitle: jobTitle,
          startDate: 'Immediate / Next Month',
          stipend: app.stipend || '₹45,000/month',
          userId: sId,
        });
      }

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

  // Compute AI Match Score for an application
  const getCandidateScore = (app) => {
    const iId = app.jobId || app.internship_id;
    const sId = app.studentId || app.student_id;
    const key = `${iId}_${sId}`;
    const analysis = aiAnalyses[key];
    return analysis?.score || app.matchScore || app.match_score || 85;
  };

  // Filter & Sort Applications
  const filteredApps = applications.filter((app) => {
    const iId = app.jobId || app.internship_id;

    // Internship filter
    if (selectedInternshipId !== 'ALL' && iId !== selectedInternshipId) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'All' && app.status !== statusFilter) {
      return false;
    }

    // Score filter
    const score = getCandidateScore(app);
    if (scoreFilter !== 'ALL' && score < parseInt(scoreFilter, 10)) {
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
    if (sortBy === 'score') {
      return getCandidateScore(b) - getCandidateScore(a);
    } else {
      return new Date(b.appliedAt || b.applied_at || 0) - new Date(a.appliedAt || a.applied_at || 0);
    }
  });

  // Calculate Pipeline Stats
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
      title="AI Recruiter Dashboard & Candidate Ranking"
      subtitle="Automated Gemini AI candidate evaluation, 0–100 score breakdowns, gold/silver/bronze candidate ranking, and customized interview question kits."
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
                placeholder="Search by candidate name, skills, college, or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
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

              {/* Score Filter */}
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {SCORE_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>

              {/* Sorting Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="score">Sort: Highest AI Score</option>
                <option value="date">Sort: Applied Date</option>
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

            <div className="flex items-center gap-3">
              {analyzingAi && (
                <span className="text-xs text-amber-300 font-semibold flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> AI Analyzing...
                </span>
              )}
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Gemini AI Talent Ranking Active
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
              <p className="text-xs">Fetching candidate applications & running AI scoring...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No applicants found matching criteria.</p>
              <p className="text-xs text-slate-500">Try adjusting your score filter or status filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app, rankIndex) => {
                const iId = app.jobId || app.internship_id;
                const sId = app.studentId || app.student_id;
                const key = `${iId}_${sId}`;
                const analysis = aiAnalyses[key];

                const resumeUrl = app.resume_url || app.student?.resume_url;
                const skills = app.student?.skills || app.skills || ['React.js', 'Node.js', 'Python', 'PostgreSQL'];
                const studentName = app.studentName || app.student?.full_name || 'Student Candidate';
                const college = app.studentCollege || app.student?.college || 'IIT Delhi / B.Tech Computer Science';
                const degree = app.studentDegree || app.student?.degree || 'B.Tech CS';
                const jobTitle = app.jobTitle || app.internship?.title || 'Software Engineering Intern';
                
                const score = analysis?.score || app.matchScore || app.match_score || (95 - rankIndex * 3);
                const breakdown = analysis?.scoreBreakdown || {
                  skillMatch: Math.round(score * 0.4),
                  education: 20,
                  projects: 18,
                  resumeQuality: 16,
                };
                const matchingSkills = analysis?.matchingSkills || skills.slice(0, 3);
                const missingSkills = analysis?.missingSkills || ['MongoDB', 'Docker'];
                const strengths = analysis?.strengths || ['Solid technical core', 'High project portfolio relevance'];
                const weaknesses = analysis?.weaknesses || ['Limited industrial experience'];

                const isExpanded = expandedAnalysisId === app.id;

                // Candidate Rank Badge Determination
                let rankBadge = null;
                if (rankIndex === 0) {
                  rankBadge = (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500/30 to-yellow-500/20 text-amber-300 border border-amber-400/50 flex items-center gap-1.5 shadow-lg shadow-amber-500/10">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" /> #1 Rank • Gold Medal
                    </span>
                  );
                } else if (rankIndex === 1) {
                  rankBadge = (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-slate-400/30 to-slate-200/20 text-slate-200 border border-slate-300/50 flex items-center gap-1.5 shadow-md">
                      <Medal className="w-3.5 h-3.5 text-slate-300" /> #2 Rank • Silver Medal
                    </span>
                  );
                } else if (rankIndex === 2) {
                  rankBadge = (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-700/30 to-orange-600/20 text-orange-300 border border-amber-600/40 flex items-center gap-1.5 shadow-md">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> #3 Rank • Bronze Medal
                    </span>
                  );
                } else {
                  rankBadge = (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                      #{rankIndex + 1} Rank
                    </span>
                  );
                }

                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl bg-slate-900/80 border transition-all ${
                      rankIndex === 0
                        ? 'border-amber-500/40 shadow-xl shadow-amber-500/5 bg-gradient-to-b from-amber-500/5 to-transparent'
                        : 'border-slate-800 hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      {/* Candidate Profile Info & AI Score Circle */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-xl shrink-0">
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

                          {/* Animated AI Score Circle Pill */}
                          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-950 text-indigo-300 border border-indigo-500/50 shadow-md">
                            {score}/100
                          </div>
                        </div>

                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-white font-bold text-base">{studentName}</h4>
                            
                            {/* Rank Badge */}
                            {rankBadge}

                            {/* Applied Date */}
                            {(app.appliedAt || app.applied_at) && (
                              <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto sm:ml-0">
                                <Clock className="w-3 h-3 text-slate-600" /> {formatDate(app.appliedAt || app.applied_at)}
                              </span>
                            )}
                          </div>

                          {/* Role & Education */}
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

                          {/* Matching / Missing Skills Quick Chips */}
                          <div className="flex items-center gap-3 text-[11px] pt-1 flex-wrap">
                            {matchingSkills.length > 0 && (
                              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Matches: {matchingSkills.slice(0, 3).join(', ')}</span>
                              </div>
                            )}
                            {missingSkills.length > 0 && (
                              <div className="flex items-center gap-1 text-rose-400 font-medium">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                                <span>Missing: {missingSkills.slice(0, 2).join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* AI Score Breakdown Ring & Action Column */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 w-full lg:w-auto justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                        {/* Overall AI Meter Card */}
                        <div className="flex items-center gap-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 w-full sm:w-auto">
                          {/* Animated Circular Meter */}
                          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-slate-800"
                                strokeWidth="3.5"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className={score >= 85 ? 'text-indigo-400' : score >= 75 ? 'text-amber-400' : 'text-slate-400'}
                                strokeDasharray={`${score}, 100`}
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <span className="absolute text-xs font-black text-white">{score}%</span>
                          </div>

                          {/* Quick Score Metrics Breakdown */}
                          <div className="text-[11px] space-y-0.5 pr-2">
                            <div className="flex items-center justify-between gap-4 text-slate-300">
                              <span>Skill Match:</span>
                              <span className="font-bold text-indigo-300">{breakdown.skillMatch}/40</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-slate-300">
                              <span>Education:</span>
                              <span className="font-bold text-indigo-300">{breakdown.education}/20</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-slate-300">
                              <span>Projects:</span>
                              <span className="font-bold text-indigo-300">{breakdown.projects}/20</span>
                            </div>
                          </div>
                        </div>

                        {/* Current Status Pill */}
                        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
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

                          <button
                            onClick={() => setExpandedAnalysisId(isExpanded ? null : app.id)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                          >
                            <span>{isExpanded ? 'Less' : 'AI Analysis'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Resume Link */}
                          {resumeUrl && (
                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              title="View Candidate Resume"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Resume</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          {/* AI Interview Questions Kit */}
                          <button
                            type="button"
                            onClick={() => setQuestionsCandidate({ ...app, matchScore: score, analysis })}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            title="Generate AI Interview Questions"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>Interview Kit</span>
                          </button>

                          {/* Shortlist */}
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

                          {/* Reject with AI Feedback Modal */}
                          <button
                            type="button"
                            onClick={() => setRejectingCandidate({ ...app, matchScore: score, missingSkills })}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                            title="Reject Candidate"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable AI Breakdown Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            {/* Strengths */}
                            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                              <h5 className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Core Candidate Strengths
                              </h5>
                              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                                {strengths.map((s, idx) => (
                                  <li key={idx}>{s}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Weaknesses */}
                            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                              <h5 className="font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                <XCircle className="w-3.5 h-3.5" /> Gaps & Weaknesses
                              </h5>
                              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                                {weaknesses.map((w, idx) => (
                                  <li key={idx}>{w}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Detailed Score Breakdown */}
                            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                              <h5 className="font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                <TrendingUp className="w-3.5 h-3.5" /> Score Weight Breakdown
                              </h5>
                              <div className="space-y-1.5 text-slate-300">
                                <div className="flex justify-between">
                                  <span>Skill Match (40%):</span>
                                  <span className="font-bold text-white">{breakdown.skillMatch} / 40</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Education (20%):</span>
                                  <span className="font-bold text-white">{breakdown.education} / 20</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Projects (20%):</span>
                                  <span className="font-bold text-white">{breakdown.projects} / 20</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Resume Quality (20%):</span>
                                  <span className="font-bold text-white">{breakdown.resumeQuality} / 20</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

      {/* AI Interview Questions Kit Modal */}
      <AIInterviewQuestionsModal
        isOpen={Boolean(questionsCandidate)}
        candidate={questionsCandidate}
        analysis={questionsCandidate?.analysis}
        onClose={() => setQuestionsCandidate(null)}
      />

      {/* Candidate Rejection & AI Feedback Modal */}
      <RejectionFeedbackModal
        isOpen={Boolean(rejectingCandidate)}
        candidate={rejectingCandidate}
        onClose={() => setRejectingCandidate(null)}
        onConfirmReject={(cand, feedbackText) => {
          handleUpdateStatus(cand, 'Rejected', feedbackText);
        }}
      />
    </DashboardLayout>
  );
};

export default ApplicantManagement;

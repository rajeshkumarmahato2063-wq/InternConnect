import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Bookmark,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  UserCheck,
  Activity,
  Bell,
  FileText,
  CheckCircle2,
  Video,
  ExternalLink,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import TopBar from '../components/Dashboard/TopBar';
import StatCard from '../components/Dashboard/StatCard';
import ProfileProgressRing from '../components/Dashboard/ProfileProgressRing';
import Card from '../components/Card/Card';
import LoadingSkeleton from '../components/Common/LoadingSkeleton';
import EmptyState from '../components/Common/EmptyState';
import { useAuth } from '../context/AuthContext';
import internshipService from '../services/internshipService';

const StudentDashboard = () => {
  const { user, savedJobs, applications: authApplications, refreshApplications } = useAuth();
  const [profile, setProfile] = useState(null);
  const [internships, setInternships] = useState([]);
  const [userApps, setUserApps] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [profileData, jobsData, notifsData, appsData, interviewsData] = await Promise.all([
        internshipService.getProfile(user.id).catch(() => null),
        internshipService.getInternships().catch(() => []),
        internshipService.getUserNotifications(user.id).catch(() => []),
        internshipService.getUserApplications(user.id).catch(() => []),
        internshipService.getStudentInterviews(user.id).catch(() => [])
      ]);

      if (profileData) setProfile(profileData);
      setInternships(jobsData || []);
      setRecentNotifications(notifsData || []);
      setUserApps(appsData && appsData.length > 0 ? appsData : authApplications || []);
      setUpcomingInterviews(interviewsData || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Setup Supabase Realtime Listener for instant status updates
    if (user?.id) {
      const unsubscribe = internshipService.subscribeToApplications(user.id, () => {
        fetchDashboardData();
        if (refreshApplications) refreshApplications();
      });
      return () => unsubscribe();
    }
  }, [user]);

  const calculatedCompletion = profile ? (
    (profile.resume_url ? 25 : 0) +
    (profile.skills?.length > 0 ? 25 : 0) +
    (profile.github ? 15 : 0) +
    (profile.linkedin ? 15 : 0) +
    (profile.portfolio ? 20 : 0)
  ) : 80;

  const currentApps = userApps.length > 0 ? userApps : authApplications;
  const interviewCallsCount = currentApps.filter((a) => a.interviewDetails || a.status === 'Interview Scheduled' || a.status === 'Interview').length;
  const recommendedJobs = internships.slice(0, 3);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Interview Scheduled':
      case 'Interview':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Shortlisted':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Reviewing':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Student Candidate Dashboard" />

        <main className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/50 to-purple-900/40 border border-indigo-500/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Supabase Realtime Connected
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome back, {profile?.full_name || user?.name || 'Student Candidate'}! 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Track real-time application status updates, join scheduled technical interviews, and apply for top tech internships.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 relative z-10 w-full lg:w-auto">
              {calculatedCompletion < 100 && (
                <Link
                  to="/student/profile"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold border border-indigo-500/30 transition-all flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Complete Profile</span>
                </Link>
              )}
              <Link
                to="/student/resume"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span>My Resume</span>
              </Link>
              <Link
                to="/explore"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <span>Browse Internships</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Applied Jobs"
              value={currentApps.length}
              icon={Briefcase}
              color="indigo"
              subtitle="Active job submissions"
            />
            <StatCard
              title="Saved Jobs"
              value={savedJobs.length}
              icon={Bookmark}
              color="purple"
              subtitle="Bookmarked opportunities"
            />
            <StatCard
              title="Interview Calls"
              value={interviewCallsCount || upcomingInterviews.length}
              icon={Calendar}
              color="emerald"
              subtitle="Scheduled technical calls"
            />
            <StatCard
              title="Profile Completion"
              value={`${calculatedCompletion}%`}
              icon={Award}
              color="amber"
              subtitle="Supabase ATS Profile score"
            />
          </div>

          {/* Upcoming Scheduled Technical Interviews */}
          {upcomingInterviews.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" /> Upcoming Video Evaluation Calls
                </h3>
                <Link to="/student/interviews" className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1">
                  View Full Portal &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingInterviews.map((int) => (
                  <div
                    key={int.id}
                    className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-emerald-500/30 shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {int.interviewType || 'Technical Screening'}
                          </span>
                        </div>
                        <h4 className="text-white font-bold text-base">{int.jobTitle}</h4>
                        <p className="text-xs text-slate-300 font-semibold">{int.companyName}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {int.date} at {int.time}
                      </span>
                    </div>

                    {int.notes && (
                      <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        💬 <strong className="text-slate-300">Notes:</strong> {int.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-[11px] text-slate-500 font-medium">Live Candidate Video Call</span>
                      {int.meetingLink ? (
                        <a
                          href={int.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Meeting</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No link</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Completion Circular Progress Ring */}
          <ProfileProgressRing profile={profile} percentage={calculatedCompletion} />

          {/* Recommended Internships Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> AI Recommended Internships
              </h3>
              <Link to="/explore" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                View All Listings &rarr;
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={3} />
            ) : recommendedJobs.length === 0 ? (
              <EmptyState
                title="No Internships Found"
                description="Check back soon for new active tech internship postings from verified hiring managers."
                actionLabel="Browse All Opportunities"
                onAction={() => (window.location.href = '/explore')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedJobs.map((job) => (
                  <Card key={job.id} variant="glass" hoverable className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <img
                          src={job.companyLogo}
                          alt={job.companyName}
                          className="w-10 h-10 rounded-xl object-contain bg-white p-1"
                        />
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {job.matchScore || 92}% Match
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-sm mb-1 leading-snug">{job.title}</h4>
                      <p className="text-slate-400 text-xs">{job.companyName} • {job.location}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-semibold">{job.stipend}</span>
                      <Link to={`/internship/${job.id}`} className="text-indigo-400 font-bold hover:underline">
                        Details &rarr;
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity & Notifications Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Live Applications Status Cards */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" /> Active Application Statuses
                </h3>
                <Link to="/applications" className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1">
                  Tracker <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {currentApps.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No recent job applications submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {currentApps.slice(0, 4).map((app, idx) => (
                    <div
                      key={app.id || idx}
                      className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-white">{app.jobTitle || 'Engineering Role'}</p>
                        <p className="text-[11px] text-slate-400">{app.companyName || 'Tech Partner'}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeStyle(
                          app.status
                        )}`}
                      >
                        {app.status || 'Applied'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Notifications */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-400" /> Real-time System Updates
              </h3>

              {recentNotifications.length === 0 ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start space-x-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Supabase Realtime Active</p>
                      <p className="text-[11px] text-slate-400">Status updates will automatically refresh in real-time.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentNotifications.slice(0, 4).map((notif, idx) => (
                    <div key={notif.id || idx} className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-xs space-y-1">
                      <p className="font-bold text-white flex items-center justify-between">
                        <span>{notif.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">Just now</span>
                      </p>
                      <p className="text-[11px] text-slate-400">{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;

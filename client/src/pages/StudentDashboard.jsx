import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Bookmark, Calendar, Award, Sparkles, ArrowRight, UserCheck, Activity, Bell, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Dashboard/Sidebar';
import TopBar from '../../components/Dashboard/TopBar';
import StatCard from '../../components/Dashboard/StatCard';
import ProfileProgressRing from '../../components/Dashboard/ProfileProgressRing';
import Card from '../../components/Card/Card';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyState from '../../components/Common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import internshipService from '../../services/internshipService';

const StudentDashboard = () => {
  const { user, savedJobs, applications } = useAuth();
  const [profile, setProfile] = useState(null);
  const [internships, setInternships] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [profileData, jobsData, notifsData] = await Promise.all([
        internshipService.getProfile(user.id).catch(() => null),
        internshipService.getInternships().catch(() => []),
        internshipService.getUserNotifications(user.id).catch(() => []),
      ]);

      if (profileData) setProfile(profileData);
      setInternships(jobsData || []);
      setRecentNotifications(notifsData || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculatedCompletion = profile ? (
    (profile.resume_url ? 25 : 0) +
    (profile.skills?.length > 0 ? 25 : 0) +
    (profile.github ? 15 : 0) +
    (profile.linkedin ? 15 : 0) +
    (profile.portfolio ? 20 : 0)
  ) : 80;

  const interviewCallsCount = applications.filter((a) => a.interviewDetails || a.status === 'Interview').length;
  const recommendedJobs = internships.slice(0, 3);

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
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Authenticated Supabase Session
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome back, {profile?.full_name || user?.name || 'Student Candidate'}! 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Track your active job applications, optimize your ATS resume score, and join live technical interview calls.
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
              value={applications.length}
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
              value={interviewCallsCount}
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
                onAction={() => window.location.href = '/explore'}
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
            {/* Recent Application Activity */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" /> Recent Application Activity
              </h3>

              {applications.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No recent job applications submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 3).map((app, idx) => (
                    <div key={app.id || idx} className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{app.jobTitle || 'Engineering Role'}</p>
                        <p className="text-[11px] text-slate-400">{app.companyName || 'Tech Partner'}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {app.status || 'Applied'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Supabase Notifications */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-400" /> System Notifications
              </h3>

              {recentNotifications.length === 0 ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-start space-x-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">Authenticated Session Active</p>
                      <p className="text-[11px] text-slate-400">Welcome to your InternConnect AI student workspace.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentNotifications.slice(0, 3).map((notif, idx) => (
                    <div key={notif.id || idx} className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-xs space-y-1">
                      <p className="font-bold text-white">{notif.title}</p>
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


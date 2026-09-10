import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Calendar, CheckCircle, Plus, Video, ExternalLink, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import { useAuth } from '../context/AuthContext';
import { internshipService } from '../services/internshipService';
import { MOCK_INTERNSHIPS, MOCK_APPLICATIONS } from '../services/mockData';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [totalApplicantsCount, setTotalApplicantsCount] = useState(0);
  const [interviewsCount, setInterviewsCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [recentApplications, setRecentApplications] = useState([]);
  const [companyInterviews, setCompanyInterviews] = useState([]);
  const [interviewFilter, setInterviewFilter] = useState('upcoming'); // 'today', 'upcoming', 'completed'
  const [loading, setLoading] = useState(true);

  const fetchCompanyData = async () => {
    setLoading(true);
    if (user?.id) {
      const [jobs, apps, interviews] = await Promise.all([
        internshipService.getCompanyInternships(user.id).catch(() => []),
        internshipService.getCompanyApplications(user.id).catch(() => []),
        internshipService.getCompanyInterviews(user.id).catch(() => [])
      ]);

      if (jobs && jobs.length > 0) {
        const active = jobs.filter((j) => j.status === 'active');
        setActiveJobsCount(active.length);
      } else {
        setActiveJobsCount(MOCK_INTERNSHIPS.length);
      }

      if (apps && apps.length > 0) {
        setTotalApplicantsCount(apps.length);
        setShortlistedCount(apps.filter((a) => a.status === 'Shortlisted' || a.status === 'Selected').length);
        setRecentApplications(apps.slice(0, 5));
      } else {
        setTotalApplicantsCount(MOCK_APPLICATIONS.length);
        setShortlistedCount(2);
        setRecentApplications(MOCK_APPLICATIONS);
      }

      setCompanyInterviews(interviews || []);
      setInterviewsCount(interviews ? interviews.filter(i => i.status === 'Scheduled').length : 1);
    } else {
      // Fallback
      setActiveJobsCount(MOCK_INTERNSHIPS.length);
      setTotalApplicantsCount(MOCK_APPLICATIONS.length);
      setInterviewsCount(1);
      setShortlistedCount(2);
      setRecentApplications(MOCK_APPLICATIONS);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanyData();

    if (user?.id) {
      const unsubscribe = internshipService.subscribeToInterviews(user.id, () => {
        fetchCompanyData();
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleUpdateStatus = async (interviewId, newStatus, studentId, jobTitle) => {
    await internshipService.updateInterviewStatus(interviewId, newStatus, studentId, { jobTitle });
    fetchCompanyData();
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredInterviews = companyInterviews.filter((item) => {
    if (interviewFilter === 'today') return item.date === todayStr && item.status === 'Scheduled';
    if (interviewFilter === 'completed') return item.status === 'Completed' || item.status === 'Cancelled';
    return item.status === 'Scheduled'; // Default upcoming
  });

  return (
    <DashboardLayout
      title="Recruiter Portal Overview"
      subtitle="Manage active internship postings, review candidate submissions, and conduct video interviews."
    >
      <div className="space-y-8">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="glass" hoverable={false} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Active Listings</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">{activeJobsCount}</p>
            <p className="text-xs text-slate-400 mt-1">Live internship openings</p>
          </Card>

          <Card variant="glass" hoverable={false} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Applicants</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-white">{totalApplicantsCount}</p>
            <p className="text-xs text-slate-400 mt-1">Candidate submissions</p>
          </Card>

          <Card variant="glass" hoverable={false} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Interviews</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-400">{interviewsCount}</p>
            <p className="text-xs text-slate-400 mt-1">Scheduled candidate calls</p>
          </Card>

          <Card variant="glass" hoverable={false} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Selected Hires</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-400">{shortlistedCount}</p>
            <p className="text-xs text-slate-400 mt-1">Confirmed intern hires</p>
          </Card>
        </div>

        {/* Video Interview Scheduler Widget */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-400" /> Video Interview Pipeline
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Track live scheduled interviews, open meeting links, and update evaluation statuses.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50">
              <button
                onClick={() => setInterviewFilter('upcoming')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  interviewFilter === 'upcoming'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setInterviewFilter('today')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  interviewFilter === 'today'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setInterviewFilter('completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  interviewFilter === 'completed'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                History
              </button>
            </div>
          </div>

          {filteredInterviews.length === 0 ? (
            <div className="p-8 text-center bg-slate-800/30 rounded-2xl border border-slate-700/40 text-slate-400 space-y-2">
              <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-semibold text-white">No interviews in this section</p>
              <p className="text-xs text-slate-400">
                To schedule an interview, navigate to <Link to="/company/applicants" className="text-indigo-400 font-bold hover:underline">Applicants Pipeline</Link> and select "Schedule Interview".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInterviews.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-block mb-1">
                        {item.interviewType || 'Technical Screening'}
                      </span>
                      <h4 className="text-white font-bold text-base">{item.studentName}</h4>
                      <p className="text-xs text-indigo-400 font-semibold">{item.jobTitle}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.date} at {item.time}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                      📝 <strong className="text-slate-400">Agenda:</strong> {item.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/60">
                    <div className="flex items-center space-x-2">
                      {item.status === 'Scheduled' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Completed', item.student_id, item.jobTitle)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-bold border border-emerald-500/30 transition-all"
                          >
                            Mark Completed
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'Cancelled', item.student_id, item.jobTitle)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] font-bold border border-rose-500/30 transition-all"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {item.status !== 'Scheduled' && (
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.status}</span>
                      )}
                    </div>

                    {item.meetingLink && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Launch Call</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Bar */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/50 to-purple-900/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Need to Hire Talent Fast?</h3>
            <p className="text-xs text-slate-300 mt-1">
              Create a new internship post in under 2 minutes with automated AI candidate skill matching.
            </p>
          </div>

          <Link to="/company/post-job">
            <Button variant="primary" size="md" icon={Plus}>
              Post New Internship
            </Button>
          </Link>
        </div>

        {/* Recent Applicants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Recent Candidates Pipeline</h3>
            <Link to="/company/applicants" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
              View All Candidates &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recentApplications.map((app) => (
              <Card key={app.id} variant="glass" hoverable={false} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {(app.studentName || 'S').charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{app.studentName || 'Applicant'}</h4>
                    <p className="text-xs text-slate-400">
                      Applied for: <strong>{app.jobTitle}</strong> • {app.studentCollege || 'University Student'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {app.matchScore || 85}% Match
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">{app.status}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;

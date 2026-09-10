import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Calendar, CheckCircle, Plus, ArrowRight } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      if (user?.id) {
        const jobs = await internshipService.getCompanyInternships(user.id);
        const apps = await internshipService.getCompanyApplications(user.id);

        if (jobs && jobs.length > 0) {
          const active = jobs.filter((j) => j.status === 'active');
          setActiveJobsCount(active.length);
        } else {
          setActiveJobsCount(MOCK_INTERNSHIPS.length);
        }

        if (apps && apps.length > 0) {
          setTotalApplicantsCount(apps.length);
          setInterviewsCount(apps.filter((a) => a.status === 'Interview' || a.status === 'Interview Scheduled').length);
          setShortlistedCount(apps.filter((a) => a.status === 'Shortlisted').length);
          setRecentApplications(apps.slice(0, 5));
          setLoading(false);
          return;
        }
      }
      // Fallback
      setActiveJobsCount(MOCK_INTERNSHIPS.length);
      setTotalApplicantsCount(MOCK_APPLICATIONS.length);
      setInterviewsCount(1);
      setShortlistedCount(2);
      setRecentApplications(MOCK_APPLICATIONS);
      setLoading(false);
    };
    fetchCompanyData();
  }, [user]);

  return (
    <DashboardLayout
      title="Recruiter Portal Overview"
      subtitle="Manage your active internship postings, applicant candidate pipelines, and technical interviews."
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
            <p className="text-xs text-slate-400 mt-1">Scheduled candidate interviews</p>
          </Card>

          <Card variant="glass" hoverable={false} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Hired</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-emerald-400">{shortlistedCount}</p>
            <p className="text-xs text-slate-400 mt-1">Confirmed intern hires</p>
          </Card>
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

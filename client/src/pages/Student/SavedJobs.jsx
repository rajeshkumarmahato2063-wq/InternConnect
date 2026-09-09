import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import EmptyState from '../../components/Common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { MOCK_INTERNSHIPS } from '../../services/mockData';
import { internshipService } from '../../services/internshipService';

const SavedJobs = () => {
  const { user, savedJobs, toggleSaveJob } = useAuth();
  const [bookmarkedInternships, setBookmarkedInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      if (user?.id) {
        const jobs = await internshipService.getUserSavedJobs(user.id);
        if (jobs && jobs.length > 0) {
          setBookmarkedInternships(jobs);
          setLoading(false);
          return;
        }
      }
      // Fallback to local saved IDs matched against MOCK
      const fallback = MOCK_INTERNSHIPS.filter((j) => savedJobs.includes(j.id));
      setBookmarkedInternships(fallback);
      setLoading(false);
    };
    fetchSaved();
  }, [user, savedJobs]);

  const handleRemove = async (jobId) => {
    await toggleSaveJob(jobId);
    setBookmarkedInternships((prev) => prev.filter((j) => j.id !== jobId));
  };

  return (
    <DashboardLayout
      title="Saved Internships"
      subtitle="Your bookmarked career opportunities and saved job listings."
    >
      {bookmarkedInternships.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No Saved Internships"
          description="You haven't bookmarked any jobs yet. Browse available listings and save your favorites!"
          actionLabel="Explore Internships"
          onAction={() => (window.location.href = '/explore')}
        />
      ) : (
        <div className="space-y-4">
          {bookmarkedInternships.map((job) => (
            <Card
              key={job.id}
              variant="glass"
              hoverable={false}
              className="p-6 flex flex-col sm:flex-row items-start justify-between gap-4 border-slate-800"
            >
              <div className="flex items-start gap-4">
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-14 h-14 rounded-2xl object-contain bg-white p-1.5 shadow-md shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    {job.companyName}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">{job.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    📍 {job.location} • 💰 {job.stipend} • {job.workMode}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <button
                  type="button"
                  onClick={() => handleRemove(job.id)}
                  className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>

                <Link to={`/internship/${job.id}`}>
                  <Button variant="primary" size="sm" icon={ArrowRight}>
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SavedJobs;

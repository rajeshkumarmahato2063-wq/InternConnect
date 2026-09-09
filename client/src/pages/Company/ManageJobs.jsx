import React, { useState, useEffect } from 'react';
import { Briefcase, Eye, Trash2, Edit3, Lock, Unlock, Plus, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import EditInternshipModal from '../../components/Modals/EditInternshipModal';
import { useAuth } from '../../context/AuthContext';
import { internshipService } from '../../services/internshipService';

const ManageJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobToEdit, setSelectedJobToEdit] = useState(null);

  const loadJobs = async () => {
    setLoading(true);
    if (user?.id) {
      const data = await internshipService.getCompanyInternships(user.id);
      setJobs(data);
    } else {
      const data = await internshipService.getInternships();
      setJobs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, [user]);

  const handleToggleStatus = async (jobId, currentStatus) => {
    const isCurrentlyActive = currentStatus === 'active' || currentStatus === true;
    await internshipService.updateInternshipStatus(jobId, !isCurrentlyActive);
    loadJobs();
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to permanently delete this internship listing?')) {
      await internshipService.deleteInternship(jobId);
      loadJobs();
    }
  };

  return (
    <DashboardLayout
      title="Manage Internship Listings"
      subtitle="Monitor active postings, view applicant counts, edit job details, or archive listings."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" /> Active & Archived Postings ({jobs.length})
          </h3>
          <Link to="/company/post-job">
            <Button variant="primary" size="sm" icon={Plus}>
              Post New Internship
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading company jobs...</div>
        ) : jobs.length === 0 ? (
          <Card variant="glass" className="p-12 text-center space-y-4">
            <Briefcase className="w-12 h-12 text-indigo-400 mx-auto opacity-80" />
            <h4 className="text-xl font-bold text-white">No Internship Listings Found</h4>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              You haven't posted any internships yet. Create your first listing to start accepting candidate applications.
            </p>
            <Link to="/company/post-job" className="inline-block pt-2">
              <Button variant="primary" size="md" icon={Plus}>
                Create First Posting
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => {
              const isActive = job.status === 'active' || job.isActive === true;
              return (
                <Card key={job.id} variant="glass" hoverable={false} className="p-6 space-y-4 flex flex-col justify-between border-slate-800">
                  <div className="space-y-3">
                    {/* Header: Title & Status badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                          {job.workMode || 'Remote'}
                        </span>
                        <h4 className="text-lg font-bold text-white leading-snug mt-0.5">{job.title}</h4>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>

                    {/* Metadata details */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 py-2 border-y border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate">{job.location || 'Remote'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{job.stipend || '₹50,000 / mo'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>Deadline: {job.deadline || 'N/A'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{job.openings || 1} Openings</span>
                      </div>
                    </div>

                    {/* Skill chips */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skills.slice(0, 4).map((sk) => (
                          <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 text-[10px] font-medium border border-slate-700">
                            {sk}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                    <Link to={`/company/applicants?jobId=${job.id}`}>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Applicants
                      </button>
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedJobToEdit(job)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                        title="Edit Listing Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(job.id, job.status)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                        title={isActive ? 'Close Hiring' : 'Reopen Hiring'}
                      >
                        {isActive ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(job.id)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <EditInternshipModal
        job={selectedJobToEdit}
        isOpen={Boolean(selectedJobToEdit)}
        onClose={() => setSelectedJobToEdit(null)}
        onUpdated={loadJobs}
      />
    </DashboardLayout>
  );
};

export default ManageJobs;

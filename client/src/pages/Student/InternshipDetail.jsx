import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, Award, CheckCircle2, Bookmark, ArrowRight, ArrowLeft } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';
import Container from '../../components/Container/Container';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import ApplyModal from '../../components/Modals/ApplyModal';
import { apiService } from '../../services/api';
import { internshipService } from '../../services/internshipService';
import { useAuth } from '../../context/AuthContext';

const InternshipDetail = () => {
  const { id } = useParams();
  const { isJobSaved, toggleSaveJob, hasApplied } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      const data = await internshipService.getInternshipById(id);
      setJob(data);
      setLoading(false);
    };
    loadJob();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="py-32 text-center text-slate-400">Loading internship detail...</div>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout>
        <div className="py-32 text-center text-white">
          <h2>Internship Listing Not Found</h2>
          <Link to="/explore" className="text-indigo-400 font-bold mt-4 inline-block">
            &larr; Back to Explore
          </Link>
        </div>
      </MainLayout>
    );
  }

  const saved = isJobSaved(job.id);
  const applied = hasApplied(job.id);

  return (
    <MainLayout>
      <div className="py-12 pt-28">
        <Container>
          {/* Back button */}
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search Listings
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Job Overview & Description */}
            <div className="lg:col-span-8 space-y-6">
              <Card variant="glass" className="p-8">
                {/* Header Info */}
                <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-start gap-4">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-16 h-16 rounded-2xl object-contain bg-white p-2 shadow-lg shrink-0"
                    />
                    <div>
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                        {job.companyName}
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-snug">
                        {job.title}
                      </h1>
                      <p className="text-xs text-slate-400 mt-2 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-purple-400" /> {job.location}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{job.stipend}</span>
                        <span>•</span>
                        <span>{job.workMode}</span>
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                    {job.matchScore}% Match Score
                  </span>
                </div>

                {/* Description */}
                <div className="py-6 space-y-6 text-sm text-slate-300 leading-relaxed">
                  <div>
                    <h3 className="text-base font-bold text-white mb-2">Role Overview</h3>
                    <p>{job.description}</p>
                  </div>

                  {job.responsibilities && (
                    <div>
                      <h3 className="text-base font-bold text-white mb-2">Key Responsibilities</h3>
                      <ul className="space-y-2">
                        {job.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.requirements && (
                    <div>
                      <h3 className="text-base font-bold text-white mb-2">Requirements & Skills</h3>
                      <ul className="space-y-2">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills Tags */}
                  <div>
                    <h3 className="text-base font-bold text-white mb-3">Required Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((sk) => (
                        <span
                          key={sk}
                          className="px-3 py-1 rounded-xl bg-slate-800 text-indigo-300 text-xs font-semibold border border-slate-700"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Action Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <Card variant="glass" className="p-6 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Stipend & Tenure</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">{job.stipend}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Duration: {job.duration} • {job.openings} Openings</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  {applied ? (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-sm font-bold cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Already Applied
                    </button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={() => setShowApplyModal(true)}
                      icon={ArrowRight}
                    >
                      Apply Now with AI Profile
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    onClick={() => toggleSaveJob(job.id)}
                    icon={Bookmark}
                  >
                    {saved ? 'Saved in Bookmarks' : 'Save to Bookmarks'}
                  </Button>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-200">
                  <p className="font-bold mb-1">⚡ Instant AI Resume Screening</p>
                  <p className="text-indigo-200/80">
                    Applying auto-attaches your verified resume and calculates real-time candidate rank.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </div>

      <ApplyModal
        job={job}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
      />
    </MainLayout>
  );
};

export default InternshipDetail;

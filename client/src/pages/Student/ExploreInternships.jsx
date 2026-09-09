import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Bookmark, Briefcase, Sparkles, CheckCircle2, ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Container from '../../components/Container/Container';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import EmptyState from '../../components/Common/EmptyState';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import InternshipCard from '../../components/Common/InternshipCard';
import FilterPanel from '../../components/Common/FilterPanel';
import ApplyModal from '../../components/Modals/ApplyModal';
import { useAuth } from '../../context/AuthContext';
import { internshipService } from '../../services/internshipService';

const ExploreInternships = () => {
  const { isJobSaved, toggleSaveJob } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [filters, setFilters] = useState({
    query: '',
    location: '',
    workMode: 'All',
    minStipend: 0,
    duration: 'All',
  });
  const [sortBy, setSortBy] = useState('newest');

  // Selected job for apply modal
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    const data = await internshipService.getInternships(filters);

    if (sortBy === 'stipend') {
      data.sort((a, b) => (b.stipendValue || 0) - (a.stipendValue || 0));
    } else if (sortBy === 'match') {
      data.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();

    // Realtime listener for new internship postings
    const unsubscribe = internshipService.subscribeToInternships(() => {
      fetchJobs();
    });

    return () => unsubscribe();
  }, [filters, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      location: '',
      workMode: 'All',
      minStipend: 0,
      duration: 'All',
    });
  };

  return (
    <MainLayout>
      <div className="py-12 pt-28">
        <Container>
          {/* Header Banner */}
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              Supabase Powered Directory
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-3">
              Discover AI-Matched{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Internship Roles
              </span>
            </h1>
            <p className="text-slate-400 text-base mt-2">
              Instant Supabase queries by title, company, skills, location, work mode, and stipend.
            </p>
          </div>

          {/* Search Bar & Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Multi-Filter Sidebar */}
            <aside className="lg:col-span-3 sticky top-28">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </aside>

            {/* Right Column: Search Input & Job Listing Cards */}
            <main className="lg:col-span-9 space-y-6">
              
              {/* Search Control Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={filters.query}
                    onChange={(e) => handleFilterChange('query', e.target.value)}
                    placeholder="Search by job title, company name, or tech stack skill..."
                    className="w-full rounded-2xl bg-slate-900/80 border border-slate-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="relative w-full sm:w-48">
                  <MapPin className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    placeholder="Location"
                    className="w-full rounded-2xl bg-slate-900/80 border border-slate-800 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-2.5 text-xs text-white focus:outline-none shrink-0"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="stipend">Sort: Highest Stipend</option>
                  <option value="match">Sort: AI Match %</option>
                </select>
              </div>

              {/* Popular Skills Quick Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Popular Skills:</span>
                {['React', 'Python', 'AI/LLM', 'Node.js', 'Next.js', 'Figma', 'TypeScript'].map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleFilterChange('query', skill)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/20 text-[11px] font-medium transition-colors"
                  >
                    {skill}
                  </button>
                ))}
              </div>

              {/* Job Cards Grid */}
              {loading ? (
                <div className="space-y-4">
                  <LoadingSkeleton count={3} />
                </div>
              ) : jobs.length === 0 ? (
                <EmptyState
                  title="No Internships Match Your Search Criteria"
                  description="Try adjusting your keyword search, selecting another work mode, or clearing stipend filters."
                  actionLabel="Reset All Filters"
                  onAction={handleResetFilters}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <InternshipCard
                      key={job.id}
                      job={job}
                      isSaved={isJobSaved(job.id)}
                      onToggleSave={() => toggleSaveJob(job.id)}
                      onApply={() => setSelectedApplyJob(job)}
                    />
                  ))}
                </div>
              )}
            </main>

          </div>
        </Container>
      </div>

      {/* 1-Click Apply Modal */}
      <ApplyModal
        job={selectedApplyJob}
        isOpen={Boolean(selectedApplyJob)}
        onClose={() => setSelectedApplyJob(null)}
      />
    </MainLayout>
  );
};

export default ExploreInternships;

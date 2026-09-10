import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Filter, Sparkles, X, Briefcase, Calendar, DollarSign, Clock, Users, ArrowRight, Share2, CheckCircle2, Bookmark, RefreshCw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import EmptyState from '../components/Common/EmptyState';
import LoadingSkeleton from '../components/Common/LoadingSkeleton';
import InternshipCard from '../components/Common/InternshipCard';
import FilterPanel from '../components/Common/FilterPanel';
import ApplyModal from '../components/Modals/ApplyModal';
import Button from '../components/Button/Button';
import SaveButton from '../components/Common/SaveButton';
import SkillChip from '../components/Common/SkillChip';
import SearchBar from '../components/SearchBar/SearchBar';
import { useAuth } from '../context/AuthContext';
import { internshipService } from '../services/internshipService';

const ExploreInternships = () => {
  const { user, isJobSaved, toggleSaveJob, hasApplied } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQueryParam = searchParams.get('query') || '';
  const initialLocationParam = searchParams.get('location') || '';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [filters, setFilters] = useState({
    query: initialQueryParam,
    location: initialLocationParam,
    workMode: 'All',
    minStipend: 0,
    duration: 'All',
    deadline: 'All',
    skills: [],
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Selection & Details Panel
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);

  // Sync state with URL params
  useEffect(() => {
    const urlQuery = searchParams.get('query') || '';
    const urlLocation = searchParams.get('location') || '';
    setFilters((prev) => ({ ...prev, query: urlQuery, location: urlLocation }));
  }, [searchParams]);

  // Fetch internships from Supabase
  const fetchJobs = useCallback(async (currentFilters = filters) => {
    setLoading(true);
    try {
      const data = await internshipService.getInternships(currentFilters);
      
      // Sorting
      if (sortBy === 'stipend') {
        data.sort((a, b) => (b.stipendValue || 0) - (a.stipendValue || 0));
      } else if (sortBy === 'match') {
        data.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      }

      setJobs(data);
      if (data.length > 0) {
        setSelectedJob((prev) => {
          if (!prev || !data.some((j) => j.id === prev.id)) return data[0];
          return prev;
        });
      } else {
        setSelectedJob(null);
      }
    } catch (err) {
      console.error('Error querying Supabase internships:', err);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  // Debounced search trigger for typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.query, filters.location, filters.workMode, filters.minStipend, sortBy]);

  // Subscribe to real-time database changes
  useEffect(() => {
    const unsubscribe = internshipService.subscribeToInternships(() => fetchJobs(filters));
    return () => unsubscribe();
  }, [filters, fetchJobs]);

  const handleSearchExecute = ({ query, location }) => {
    const newFilters = { ...filters, query, location };
    setFilters(newFilters);
    
    // Update URL Search Params
    const newParams = new URLSearchParams();
    if (query) newParams.set('query', query);
    if (location) newParams.set('location', location);
    setSearchParams(newParams);

    fetchJobs(newFilters);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    const reset = { query: '', location: '', workMode: 'All', minStipend: 0, duration: 'All', deadline: 'All', skills: [] };
    setFilters(reset);
    setSearchParams(new URLSearchParams());
    fetchJobs(reset);
  };

  const DetailPanel = ({ job }) => {
    if (!job) return null;
    const isApplied = hasApplied(job.id);
    const isSaved = isJobSaved(job.id);

    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 h-full flex flex-col overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={job.companyLogo || job.company_logo} 
              alt={job.companyName} 
              className="w-16 h-16 rounded-2xl object-contain bg-white p-2 shadow-lg shrink-0" 
              onError={(e) => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'; }}
            />
            <div>
              <h2 className="text-xl font-extrabold text-white leading-tight mb-1">{job.title}</h2>
              <p className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">{job.companyName}</p>
            </div>
          </div>
          <button className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50">
            <MapPin className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Location</p>
              <p className="text-xs font-semibold text-white">{job.location} ({job.workMode})</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Stipend</p>
              <p className="text-xs font-semibold text-white">{job.stipend}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50">
            <Clock className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Duration</p>
              <p className="text-xs font-semibold text-white">{job.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50">
            <Calendar className="w-5 h-5 text-rose-400" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Deadline</p>
              <p className="text-xs font-semibold text-white">{job.deadline || 'Apply ASAP'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Description</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{job.description}</p>
          </div>
          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(sk => <SkillChip key={sk} skill={sk} size="sm" />)}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-4">
          <button 
            onClick={() => toggleSaveJob(job.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-bold transition-colors ${
              isSaved ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Bookmark className="w-5 h-5" /> {isSaved ? 'Saved' : 'Save Job'}
          </button>

          {isApplied ? (
            <button disabled className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-sm font-bold cursor-not-allowed">
              <CheckCircle2 className="w-5 h-5" /> Already Applied
            </button>
          ) : (
            <Button variant="primary" className="flex-[2] py-3 rounded-2xl shadow-lg shadow-indigo-600/30" onClick={() => setSelectedApplyJob(job)} icon={ArrowRight}>
              Apply Now
            </Button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col lg:flex-row">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Sticky Header with Search Bar */}
        <header className="shrink-0 p-4 sm:p-6 border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-xl z-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full flex-1">
              <SearchBar
                initialQuery={filters.query}
                initialLocation={filters.location}
                onSearch={handleSearchExecute}
                loading={loading}
              />
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button 
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-sm font-semibold text-white"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter className="w-4 h-4 text-indigo-400" /> Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm font-semibold text-white focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="stipend">Highest Stipend</option>
                <option value="match">Best AI Match</option>
              </select>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left: Filter Panel (Desktop Only) */}
          <aside className="hidden lg:block w-72 shrink-0 overflow-y-auto p-6 border-r border-slate-800/80">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
          </aside>

          {/* Middle: Job List */}
          <section className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Found <span className="text-indigo-400">{jobs.length}</span> Internships
                {(filters.query || filters.location) && (
                  <span className="text-xs text-slate-400 font-normal">
                    matching "{filters.query || filters.location}"
                  </span>
                )}
              </h2>

              {(filters.query || filters.location || filters.workMode !== 'All') && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear Search Filters
                </button>
              )}
            </div>
            
            {loading ? (
              <div className="space-y-4"><LoadingSkeleton count={4} /></div>
            ) : jobs.length === 0 ? (
              <EmptyState 
                title="No internships found." 
                description="Try searching for a different skill, job title, company, or location." 
                actionLabel="Browse All Internships" 
                onAction={handleResetFilters} 
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {jobs.map((job) => (
                  <InternshipCard
                    key={job.id}
                    job={job}
                    isSelected={selectedJob?.id === job.id}
                    isSaved={isJobSaved(job.id)}
                    isApplied={hasApplied(job.id)}
                    onClick={() => setSelectedJob(job)}
                    onToggleSave={() => toggleSaveJob(job.id)}
                    onApply={(j) => setSelectedApplyJob(j)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Right: Details Panel (Desktop Only) */}
          <aside className="hidden lg:block w-[450px] shrink-0 p-6 overflow-y-auto bg-slate-950/30 border-l border-slate-800/80">
            {selectedJob ? (
              <DetailPanel job={selectedJob} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 border-2 border-dashed border-slate-800 rounded-3xl p-8 text-center">
                <Briefcase className="w-12 h-12 text-slate-600" />
                <p>Select an internship to view details</p>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Mobile Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedJob(null)} />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
                <h3 className="font-bold text-white">Internship Details</h3>
                <button onClick={() => setSelectedJob(null)} className="p-2 bg-slate-800 rounded-full text-slate-400"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                <DetailPanel job={selectedJob} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h3 className="font-bold text-white flex items-center gap-2"><Filter className="w-5 h-5 text-indigo-400"/> Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-slate-400"><X className="w-6 h-6"/></button>
              </div>
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1-Click Apply Modal */}
      <ApplyModal
        job={selectedApplyJob}
        isOpen={Boolean(selectedApplyJob)}
        onClose={() => setSelectedApplyJob(null)}
      />
    </div>
  );
};

export default ExploreInternships;

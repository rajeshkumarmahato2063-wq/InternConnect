import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sparkles, Filter, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

const SearchBar = ({ initialQuery = '', initialLocation = '', onSearch, loading = false }) => {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [activeTag, setActiveTag] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const popularTags = ['React', 'Machine Learning', 'Remote', 'Data Science', 'Python'];

  const executeSearch = (searchQuery, searchLocation) => {
    if (onSearch) {
      onSearch({ query: searchQuery, location: searchLocation });
    } else {
      const params = new URLSearchParams();
      if (searchQuery) params.set('query', searchQuery);
      if (searchLocation) params.set('location', searchLocation);
      navigate(`/explore?${params.toString()}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch(query, location);
  };

  const handleChipClick = (tag) => {
    let newQuery = query;
    let newLocation = location;

    if (tag === 'Remote') {
      newLocation = 'Remote';
      setLocation('Remote');
      setActiveTag('Remote');
    } else {
      newQuery = tag;
      setQuery(tag);
      setActiveTag(tag);
    }

    executeSearch(newQuery, newLocation);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="p-2 sm:p-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 flex flex-col md:flex-row items-center gap-3 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20"
      >
        {/* Search Input */}
        <div className="relative flex-1 w-full flex items-center px-3 py-2 border-b md:border-b-0 md:border-r border-slate-800">
          <Search className="w-5 h-5 text-indigo-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (activeTag && e.target.value !== activeTag) setActiveTag('');
            }}
            placeholder="Search internships by skill, company, or role..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
        </div>

        {/* Location Input */}
        <div className="relative flex-1 w-full flex items-center px-3 py-2">
          <MapPin className="w-5 h-5 text-purple-400 shrink-0 mr-3" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location or 'Remote'"
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto shrink-0">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            fullWidth
            icon={loading ? Loader2 : Sparkles}
            className="shadow-xl flex items-center justify-center gap-2 min-w-[170px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Searching...</span>
              </>
            ) : (
              <span>Find Internships</span>
            )}
          </Button>
        </div>
      </form>

      {/* Popular Search Tags */}
      <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1 font-medium text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5 text-indigo-400" /> Popular:
        </span>
        {popularTags.map((tag) => {
          const isSelected = activeTag === tag || (tag === 'Remote' && location.toLowerCase() === 'remote') || query.toLowerCase() === tag.toLowerCase();

          return (
            <button
              key={tag}
              type="button"
              onClick={() => handleChipClick(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/50 shadow-lg shadow-indigo-600/30 scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 hover:border-indigo-500/40'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBar;

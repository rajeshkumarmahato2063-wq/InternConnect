import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Filter } from 'lucide-react';
import Button from '../Button/Button';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const popularTags = ['React', 'Machine Learning', 'Remote', 'Data Science', 'Python'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query, location, activeTag });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="p-2 sm:p-3 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 flex flex-col md:flex-row items-center gap-3 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20"
      >
        {/* Search Input */}
        <div className="relative flex-1 w-full flex items-center px-3 py-2 border-b md:border-b-0 md:border-r border-slate-800">
          <Search className="w-5 h-5 text-indigo-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
            fullWidth
            icon={Sparkles}
            className="shadow-xl"
          >
            Find Internships
          </Button>
        </div>
      </form>

      {/* Popular Search Tags */}
      <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1 font-medium text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5" /> Popular:
        </span>
        {popularTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setActiveTag(tag);
              setQuery(tag);
            }}
            className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
              activeTag === tag
                ? 'bg-indigo-600 text-white font-medium border border-indigo-400/40 shadow-sm'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-white/5 hover:border-white/10'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;

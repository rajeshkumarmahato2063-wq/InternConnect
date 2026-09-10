import React, { useState } from 'react';
import { Filter, RotateCcw, DollarSign, MapPin, Briefcase, Calendar, Code } from 'lucide-react';

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const workModes = ['All', 'Remote', 'Hybrid', 'Onsite'];
  const popularSkills = ['React', 'Python', 'Node.js', 'Figma', 'TypeScript', 'Java', 'UI/UX'];

  const toggleSkill = (skill) => {
    const currentSkills = filters.skills || [];
    if (currentSkills.includes(skill)) {
      onFilterChange('skills', currentSkills.filter(s => s !== skill));
    } else {
      onFilterChange('skills', [...currentSkills, skill]);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" /> Filters
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Work Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          {workModes.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onFilterChange('workMode', mode)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                filters.workMode === mode
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Stipend Range */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold uppercase tracking-wider text-slate-400">Min Stipend</span>
          <span className="font-bold text-emerald-400">
            {filters.minStipend > 0 ? `₹${Number(filters.minStipend).toLocaleString()}` : 'Any (Paid/Unpaid)'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100000"
          step="5000"
          value={filters.minStipend || 0}
          onChange={(e) => onFilterChange('minStipend', Number(e.target.value))}
          className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>₹0</span>
          <span>₹50k</span>
          <span>₹100k+</span>
        </div>
      </div>

      {/* Duration Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Duration
        </label>
        <select
          value={filters.duration || 'All'}
          onChange={(e) => onFilterChange('duration', e.target.value)}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="All">Any Duration</option>
          <option value="1 Month">1 Month</option>
          <option value="2 Months">2 Months</option>
          <option value="3 Months">3 Months</option>
          <option value="6 Months">6 Months</option>
        </select>
      </div>

      {/* Deadline Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Apply By (Deadline)
        </label>
        <select
          value={filters.deadline || 'All'}
          onChange={(e) => onFilterChange('deadline', e.target.value)}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="All">Any Time</option>
          <option value="Next 7 Days">Next 7 Days</option>
          <option value="Next 15 Days">Next 15 Days</option>
          <option value="Next 30 Days">Next 30 Days</option>
        </select>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-2">
          <Code className="w-3.5 h-3.5" /> Skills
        </label>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map((skill) => {
            const isSelected = (filters.skills || []).includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors border ${
                  isSelected
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-300'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

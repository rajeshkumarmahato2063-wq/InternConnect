import React from 'react';
import { Filter, RotateCcw, DollarSign, MapPin, Briefcase } from 'lucide-react';
import Button from '../Button/Button';

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const workModes = ['All', 'Remote', 'Hybrid', 'Onsite'];

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" /> Multi-Filter Options
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Work Mode Filter Pills */}
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

      {/* Min Stipend Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold uppercase tracking-wider text-slate-400">Min Monthly Stipend</span>
          <span className="font-bold text-emerald-400">₹{Number(filters.minStipend || 0).toLocaleString()}</span>
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

      {/* Location Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Preferred Location
        </label>
        <input
          type="text"
          value={filters.location || ''}
          onChange={(e) => onFilterChange('location', e.target.value)}
          placeholder="e.g. Bengaluru, Mumbai..."
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Duration Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Tenure / Duration
        </label>
        <select
          value={filters.duration || 'All'}
          onChange={(e) => onFilterChange('duration', e.target.value)}
          className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="All">All Durations</option>
          <option value="1 Month">1 Month</option>
          <option value="3 Months">3 Months</option>
          <option value="6 Months">6 Months</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;

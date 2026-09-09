import React from 'react';
import { Bookmark } from 'lucide-react';

const SaveButton = ({ isSaved, onToggle, size = 'md', showText = true }) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onToggle?.();
      }}
      className={`rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
        isSaved
          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
          : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700'
      } ${size === 'sm' ? 'p-2 text-xs' : 'px-3 py-2 text-xs'}`}
      title={isSaved ? 'Remove from Saved Jobs' : 'Save Job Listing'}
    >
      <Bookmark className={`w-4 h-4 transition-transform ${isSaved ? 'fill-indigo-400 text-indigo-400 scale-110' : ''}`} />
      {showText && <span>{isSaved ? 'Saved' : 'Save'}</span>}
    </button>
  );
};

export default SaveButton;

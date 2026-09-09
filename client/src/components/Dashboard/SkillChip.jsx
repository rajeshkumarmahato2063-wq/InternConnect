import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const SkillChip = ({ skills = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      const updated = [...skills, inputValue.trim()];
      onChange(updated);
      setInputValue('');
    }
  };

  const handleRemove = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd(e)}
          placeholder="Add technical skill (e.g. React.js, Python, AWS)"
          className="flex-1 rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {/* Skills Chips list */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => handleRemove(skill)}
              className="text-indigo-400 hover:text-rose-400 p-0.5 rounded transition-colors"
              aria-label={`Remove ${skill}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillChip;

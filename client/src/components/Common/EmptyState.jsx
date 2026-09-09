import React from 'react';
import { SearchX } from 'lucide-react';
import Button from '../Button/Button';

const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No Results Found',
  description = 'We couldn’t find any matches. Try adjusting your filters or search terms.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="w-full p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center my-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

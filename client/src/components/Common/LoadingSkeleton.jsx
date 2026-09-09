import React from 'react';

export const CardSkeleton = () => (
  <div className="rounded-2xl p-6 bg-slate-900/60 border border-slate-800 animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 bg-slate-800 rounded-xl" />
      <div className="w-20 h-6 bg-slate-800 rounded-full" />
    </div>
    <div className="h-5 bg-slate-800 rounded w-3/4" />
    <div className="h-4 bg-slate-800 rounded w-1/2" />
    <div className="space-y-2 pt-2">
      <div className="h-3 bg-slate-800 rounded w-full" />
      <div className="h-3 bg-slate-800 rounded w-5/6" />
    </div>
    <div className="flex gap-2 pt-2">
      <div className="w-16 h-6 bg-slate-800 rounded-md" />
      <div className="w-16 h-6 bg-slate-800 rounded-md" />
      <div className="w-16 h-6 bg-slate-800 rounded-md" />
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="w-full bg-slate-900/60 rounded-2xl border border-slate-800 p-4 space-y-3 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800/60">
        <div className="w-10 h-10 bg-slate-800 rounded-lg" />
        <div className="h-4 bg-slate-800 rounded w-1/4" />
        <div className="h-4 bg-slate-800 rounded w-1/6" />
        <div className="h-6 bg-slate-800 rounded-full w-20" />
      </div>
    ))}
  </div>
);

export const LoadingSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[...Array(count)].map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export default LoadingSkeleton;

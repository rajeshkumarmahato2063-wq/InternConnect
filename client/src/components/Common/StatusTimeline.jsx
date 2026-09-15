import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export const STATUS_STEPS = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Selected'];

const StatusTimeline = ({ status }) => {
  const normalizeStatus = (st) => {
    if (!st) return 'Applied';
    if (st === 'Under Review') return 'Reviewing';
    if (st === 'Interview Scheduled') return 'Interview';
    if (st === 'Offer') return 'Selected';
    return st;
  };

  const normStatus = normalizeStatus(status);
  const isRejected = normStatus === 'Rejected';
  const isWithdrawn = normStatus === 'Withdrawn';
  const currentIdx = isRejected || isWithdrawn ? -1 : STATUS_STEPS.indexOf(normStatus);

  if (isRejected) {
    return (
      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-3">
        <XCircle className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-bold">Application Status: Not Selected</p>
          <p className="text-rose-700/80 dark:text-rose-200/80 text-[11px] mt-0.5">
            Thank you for applying. Keep exploring and applying to other top opportunities!
          </p>
        </div>
      </div>
    );
  }

  if (isWithdrawn) {
    return (
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs flex items-center gap-3">
        <XCircle className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-bold">Application Status: Withdrawn</p>
          <p className="text-amber-700/80 dark:text-amber-200/80 text-[11px] mt-0.5">
            You withdrew this application. You can explore and apply for other internships anytime.
          </p>
        </div>
      </div>
    );
  }

  const effectiveIdx = currentIdx < 0 ? 0 : currentIdx;

  return (
    <div className="py-3 px-2">
      <div className="flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />
        
        {/* Active Progress Line */}
        <div
          className="absolute top-4 left-4 h-0.5 bg-indigo-600 dark:bg-indigo-500 transition-all duration-700 -z-0"
          style={{
            width: `${(effectiveIdx / (STATUS_STEPS.length - 1)) * 90}%`,
          }}
        />

        {STATUS_STEPS.map((step, idx) => {
          const isCompleted = idx <= effectiveIdx;
          const isCurrent = idx === effectiveIdx;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border-2 border-indigo-400'
                    : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-2 border-slate-300 dark:border-slate-800'
                } ${isCurrent ? 'scale-110 ring-4 ring-indigo-500/20' : ''}`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <span
                className={`text-[11px] font-semibold mt-2 text-center max-w-[75px] ${
                  isCurrent
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : isCompleted
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTimeline;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Video, 
  Building, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  RefreshCw,
  Sparkles,
  Briefcase,
  Download,
  CalendarPlus,
  AlertCircle,
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import internshipService from '../../services/internshipService';
import { getGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendarUtils';

export default function StudentInterviews() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();

    if (user?.id) {
      const unsubscribe = internshipService.subscribeToInterviews(user.id, () => {
        fetchInterviews();
      });
      return () => unsubscribe();
    }
  }, [user]);

  const fetchInterviews = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await internshipService.getStudentInterviews(user.id);
      setInterviews(data);
    } catch (err) {
      console.error("Error fetching interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = (dateStr, timeStr) => {
    try {
      const target = new Date(`${dateStr} ${timeStr || '10:00 AM'}`);
      const diff = target - new Date();
      if (diff <= 0) return 'In Progress / Expired';
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days}d ${remainingHours}h remaining`;
      if (hours > 0) return `${hours}h ${minutes}m remaining`;
      return `${minutes}m remaining`;
    } catch {
      return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Scheduled</span>
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center space-x-1.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/30">
            {status || 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-blue-900/40 border border-purple-500/30 p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Real-time Live Video Scheduler</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Video Interview Portal</h1>
          <p className="text-gray-300 text-sm max-w-xl">
            Track technical screenings, join live video calls directly, sync scheduled rounds to Google Calendar, and download iCal invitations.
          </p>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 flex items-center justify-center space-x-3 text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
          <span>Loading scheduled video interviews...</span>
        </div>
      ) : interviews.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Interviews Scheduled Yet</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            When recruiters shortlist your job applications and schedule live evaluation rounds, meeting links and calendar options will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {interviews.map((item, index) => {
              const countdown = item.status === 'Scheduled' ? calculateTimeRemaining(item.date, item.time) : null;
              const googleCalUrl = getGoogleCalendarUrl({
                title: item.jobTitle,
                companyName: item.companyName,
                interviewType: item.interviewType,
                date: item.date,
                time: item.time,
                meetingLink: item.meetingLink,
                notes: item.notes
              });

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-2xl hover:border-slate-700 transition-all space-y-5"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.companyLogo || 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'}
                        alt={item.companyName}
                        className="w-12 h-12 rounded-2xl object-contain bg-white p-1 border border-slate-700"
                        onError={(e) => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'; }}
                      />
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {item.companyName || "Tech Company"}
                        </h3>
                        <p className="text-xs text-indigo-400 font-semibold flex items-center space-x-1.5 mt-0.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>{item.jobTitle || "Internship Role"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{item.interviewType || 'Technical Screening'}</span>
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>

                  {/* Date, Time & Meeting Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                      <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div>
                        <p className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Date</p>
                        <p className="text-sm font-semibold text-white">{item.date || "Scheduled"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                      <Clock className="w-5 h-5 text-purple-400 shrink-0" />
                      <div>
                        <p className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Time</p>
                        <p className="text-sm font-semibold text-white">{item.time || "Scheduled"}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                      <div className="flex items-center space-x-3 min-w-0">
                        <Video className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Platform</p>
                          <p className="text-sm font-semibold text-white truncate">
                            {item.meetingLink?.includes('meet') ? 'Google Meet' : item.meetingLink?.includes('zoom') ? 'Zoom' : 'Video Evaluation'}
                          </p>
                        </div>
                      </div>

                      {item.meetingLink && item.status !== 'Cancelled' ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-lg shadow-emerald-600/30"
                        >
                          <span>Join Meeting</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unavailable</span>
                      )}
                    </div>
                  </div>

                  {/* Countdown Timer Badge */}
                  {countdown && item.status === 'Scheduled' && (
                    <div className="flex items-center space-x-2 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300">
                      <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span><strong>Starts in:</strong> {countdown}</span>
                    </div>
                  )}

                  {/* Notes from Recruiter */}
                  {item.notes && (
                    <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200">
                      <span className="font-bold text-purple-300">Recruiter Notes: </span>
                      {item.notes}
                    </div>
                  )}

                  {/* Actions & Calendar Sync */}
                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800/80 gap-3">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Add to calendar to set auto-reminders before the call
                    </span>

                    <div className="flex items-center space-x-3">
                      <a
                        href={googleCalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-all"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Google Calendar</span>
                      </a>

                      <button
                        onClick={() => downloadIcsFile({
                          title: item.jobTitle,
                          companyName: item.companyName,
                          interviewType: item.interviewType,
                          date: item.date,
                          time: item.time,
                          meetingLink: item.meetingLink,
                          notes: item.notes
                        })}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-all"
                      >
                        <Download className="w-3.5 h-3.5 text-purple-400" />
                        <span>Download .ics</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

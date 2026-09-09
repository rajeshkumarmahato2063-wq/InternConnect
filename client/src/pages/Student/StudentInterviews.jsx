import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Video, 
  Building, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw,
  Sparkles,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import internshipService from '../../services/internshipService';

export default function StudentInterviews() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
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
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center space-x-1.5">
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/40 border border-purple-500/20 p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-time Schedule</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Interview Portal</h1>
          <p className="text-gray-400 mt-2 text-sm max-w-xl">
            Track your upcoming technical screenings, behavioral interviews, and join video calls directly.
          </p>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="p-12 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-center space-x-3 text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
          <span>Loading scheduled interviews...</span>
        </div>
      ) : interviews.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Interviews Scheduled Yet</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Once companies shortlist your application and schedule an interview, meeting links and times will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {interviews.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {item.company?.company_name || item.internship?.title || "Company Interview"}
                    </h3>
                    <p className="text-xs text-indigo-400 font-medium flex items-center space-x-1 mt-0.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{item.internship?.title || "Internship Role"}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(item.status)}
                </div>
              </div>

              {/* Timing & Link details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <div>
                    <p className="text-[11px] uppercase font-semibold text-gray-400">Date</p>
                    <p className="text-sm font-medium text-white">{item.interview_date || "To be specified"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-[11px] uppercase font-semibold text-gray-400">Time</p>
                    <p className="text-sm font-medium text-white">{item.interview_time || "To be specified"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center space-x-3">
                    <Video className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-[11px] uppercase font-semibold text-gray-400">Platform</p>
                      <p className="text-sm font-medium text-white truncate max-w-[120px]">
                        {item.meeting_link?.includes('meet') ? 'Google Meet' : item.meeting_link?.includes('zoom') ? 'Zoom' : 'Video Call'}
                      </p>
                    </div>
                  </div>

                  {item.meeting_link ? (
                    <a
                      href={item.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-lg shadow-emerald-600/20"
                    >
                      <span>Join Call</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500 italic">No link provided</span>
                  )}
                </div>
              </div>

              {/* Notes */}
              {item.notes && (
                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200">
                  <span className="font-semibold text-purple-400">Note from Recruiter: </span>
                  {item.notes}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

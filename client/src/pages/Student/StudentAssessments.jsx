import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  Play,
  Briefcase,
  Building,
  HelpCircle,
  ChevronRight,
  Sparkles,
  FileCheck
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { assessmentService } from '../../services/assessmentService';

const StudentAssessments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const data = await assessmentService.getStudentAssessments(user?.id);
      setAssessments(data || []);
    } catch (err) {
      console.error('Failed to load student assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, [user]);

  return (
    <DashboardLayout
      title="Online Internship Assessments"
      subtitle="Complete company screening assessments before interview scheduling. Review instructions, timed test criteria, and auto-scored results."
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
            <p className="text-xs">Loading assigned internship assessments...</p>
          </div>
        ) : assessments.length === 0 ? (
          <Card variant="glass" className="p-12 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Pending Assessments</h3>
            <p className="text-xs text-slate-400">
              When companies issue online screening assessments for your applied internships, they will appear here.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assessments.map((item) => {
              const attempt = item.attempt;
              const isAttempted = Boolean(attempt && attempt.status !== 'Started');
              const isPassed = attempt?.status === 'Passed';
              const isFailed = attempt?.status === 'Failed' || attempt?.status === 'Time Expired';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card
                    variant="glass"
                    className={`p-6 flex flex-col justify-between space-y-6 border transition-all ${
                      isPassed
                        ? 'border-emerald-500/30'
                        : isFailed
                        ? 'border-rose-500/30'
                        : 'border-indigo-500/30 hover:border-indigo-500/60'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                            <Building className="w-3 h-3" /> {item.companyName}
                          </span>
                          <h3 className="text-lg font-bold text-white mt-0.5">{item.title}</h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <Briefcase className="w-3.5 h-3.5 text-slate-500" /> {item.jobTitle}
                          </p>
                        </div>

                        {/* Status Pill */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                            isPassed
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isFailed
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {attempt ? attempt.status : 'Ready to Take'}
                        </span>
                      </div>

                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Duration</span>
                          <span className="font-bold text-white flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" /> {item.durationMinutes}m
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Questions</span>
                          <span className="font-bold text-white flex items-center justify-center gap-1">
                            <HelpCircle className="w-3 h-3 text-cyan-400" /> {item.totalQuestions} MCQs
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Pass Cutoff</span>
                          <span className="font-bold text-white flex items-center justify-center gap-1">
                            <Award className="w-3 h-3 text-emerald-400" /> {item.passingMarks}%
                          </span>
                        </div>
                      </div>

                      {/* Instructions */}
                      <p className="text-xs text-slate-400 italic line-clamp-2">
                        "{item.instructions}"
                      </p>
                    </div>

                    {/* Footer Control */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      {isAttempted ? (
                        <div className="flex items-center gap-3 w-full justify-between">
                          <div className="flex items-center gap-2">
                            {isPassed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-rose-400" />
                            )}
                            <div>
                              <span className="text-xs text-slate-400 block">Score Achieved:</span>
                              <span className="text-sm font-black text-white">
                                {attempt.score} / {item.totalMarks} Marks ({Math.round((attempt.score / item.totalMarks) * 100)}%)
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/student/assessment/${item.id}/take`)}
                          >
                            View Result
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Anti-Cheating Enabled
                          </span>

                          <Button
                            variant="primary"
                            size="sm"
                            icon={Play}
                            onClick={() => navigate(`/student/assessment/${item.id}/take`)}
                          >
                            Start Assessment
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAssessments;

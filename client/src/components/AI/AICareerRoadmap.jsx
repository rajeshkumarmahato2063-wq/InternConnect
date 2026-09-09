import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, BookOpen, CheckCircle2, Rocket, Award, Code } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { aiService } from '../../services/aiService';

const AICareerRoadmap = () => {
  const [selectedGoal, setSelectedGoal] = useState('Full Stack Developer');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const careerOptions = [
    'Full Stack Developer',
    'AI & Machine Learning Engineer',
    'Cloud Security Specialist',
    'Mobile Application Engineer',
  ];

  const fetchRoadmap = async (goal) => {
    setLoading(true);
    const data = await aiService.generateRoadmap(goal);
    setRoadmap(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoadmap(selectedGoal);
  }, [selectedGoal]);

  return (
    <Card variant="glass" className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-purple-400" /> AI Career Preparation Roadmap
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Personalized month-by-month skill roadmap, projects, and certifications.
          </p>
        </div>

        {/* Goal Selector */}
        <div className="flex flex-wrap gap-1.5">
          {careerOptions.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => setSelectedGoal(goal)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedGoal === goal
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-slate-300 text-sm">Generating 6-Month Career Roadmap for {selectedGoal}...</p>
        </div>
      ) : roadmap ? (
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-indigo-500 before:to-blue-500">
          {roadmap.timeline.map((step, idx) => (
            <motion.div
              key={step.month}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Timeline Pin */}
              <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-purple-400 flex items-center justify-center group-hover:scale-125 transition-transform">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
              </div>

              {/* Step Card */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {step.month}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Rocket className="w-3.5 h-3.5 text-indigo-400" /> Key Milestone
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-3">{step.title}</h4>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {step.skills.map((sk) => (
                    <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700">
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Project & Certification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="flex items-start gap-2 text-slate-300">
                    <Code className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Target Project:</span>
                      <p className="text-slate-400 mt-0.5">{step.project}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white">Recommended Cert:</span>
                      <p className="text-slate-400 mt-0.5">{step.certification}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : null}
    </Card>
  );
};

export default AICareerRoadmap;

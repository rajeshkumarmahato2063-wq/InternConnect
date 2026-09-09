import React, { useState } from 'react';
import { Sparkles, FileText, Award, Compass, HelpCircle, Target, Mail } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import AIResumeBuilder from '../../components/AI/AIResumeBuilder';
import AIResumeScore from '../../components/AI/AIResumeScore';
import AICareerRoadmap from '../../components/AI/AICareerRoadmap';
import AIRecommendationEngine from '../../components/AI/AIRecommendationEngine';
import AIInterviewCoach from '../../components/AI/AIInterviewCoach';
import AICoverLetterGenerator from '../../components/AI/AICoverLetterGenerator';

const AICareerTools = () => {
  const [activeTab, setActiveTab] = useState('score');

  const tabs = [
    { id: 'score', name: 'Resume ATS Score', icon: Award },
    { id: 'roadmap', name: 'Career Roadmap', icon: Compass },
    { id: 'match', name: 'Job Match Engine', icon: Target },
    { id: 'coverletter', name: 'Cover Letter Generator', icon: Mail },
    { id: 'coach', name: 'Mock Interview Coach', icon: HelpCircle },
    { id: 'builder', name: 'AI Resume Builder', icon: FileText },
  ];

  return (
    <DashboardLayout
      title="AI Career Power Suite"
      subtitle="Optimize your ATS resume score, generate 6-month skill roadmaps, and build custom cover letters."
    >
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border-indigo-400/40'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div>
          {activeTab === 'score' && <AIResumeScore />}
          {activeTab === 'roadmap' && <AICareerRoadmap />}
          {activeTab === 'match' && <AIRecommendationEngine />}
          {activeTab === 'coverletter' && <AICoverLetterGenerator />}
          {activeTab === 'coach' && <AIInterviewCoach />}
          {activeTab === 'builder' && <AIResumeBuilder />}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AICareerTools;

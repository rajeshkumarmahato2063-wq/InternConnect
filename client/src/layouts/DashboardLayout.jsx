import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import TopBar from '../components/Dashboard/TopBar';
import AICareerChatbot from '../components/AI/AICareerChatbot';
import ErrorBoundary from '../components/Common/ErrorBoundary';

const DashboardLayout = ({ children, title }) => {
  const location = useLocation();

  const getPageTitle = () => {
    if (title) return title;
    const path = location.pathname.toLowerCase();
    
    // Admin Routes
    if (path.includes('admin/dashboard')) return 'Admin Portal Dashboard';
    if (path.includes('admin/verification')) return 'Company Verification';
    if (path.includes('admin/users')) return 'User Management';
    if (path.includes('admin/jobs-moderation')) return 'Job Moderation';
    if (path.includes('admin/analytics')) return 'Platform Analytics';
    if (path.includes('admin/reports')) return 'Audit Reports';
    if (path.includes('admin/messages')) return 'Admin Support & Moderation';

    // Company Routes
    if (path.includes('company/dashboard')) return 'Recruiter Dashboard';
    if (path.includes('company/profile')) return 'Company Profile';
    if (path.includes('company/post-job')) return 'Post Internship';
    if (path.includes('company/jobs')) return 'Manage Internships';
    if (path.includes('company/applicants')) return 'Applicant Management';
    if (path.includes('company/assessments')) return 'Company Assessments';
    if (path.includes('company/messages')) return 'Recruiter Messages';

    // Student Routes
    if (path.includes('dashboard')) return 'Student Dashboard';
    if (path.includes('explore')) return 'Explore Internships';
    if (path.includes('saved-jobs')) return 'Saved Jobs';
    if (path.includes('applications')) return 'Application Tracker';
    if (path.includes('profile')) return 'My Profile';
    if (path.includes('resume')) return 'My Resume & ATS Score';
    if (path.includes('interviews')) return 'Technical Interviews';
    if (path.includes('offers')) return 'Offer Letters';
    if (path.includes('certificates')) return 'Internship Certificates';
    if (path.includes('notifications')) return 'Notifications';
    if (path.includes('settings')) return 'Account Settings';
    if (path.includes('ai-tools')) return 'AI Career Tools Hub';
    if (path.includes('portfolio')) return 'Portfolio Builder';
    if (path.includes('assessments')) return 'Skills Assessments';
    if (path.includes('skill-hub')) return 'Skill Challenge Hub';
    if (path.includes('skill-challenge')) return 'Coding Challenge Portal';
    if (path.includes('internship')) return 'Internship Details';
    return 'InternConnect AI';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors duration-200">
      {/* Reusable Sidebar Navigation */}
      <Sidebar />

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={getPageTitle()} />
        
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <ErrorBoundary>
            {children || <Outlet />}
          </ErrorBoundary>
        </main>
      </div>

      {/* Floating AI Copilot */}
      <AICareerChatbot />
    </div>
  );
};

export default DashboardLayout;

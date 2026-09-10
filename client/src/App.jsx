import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Components & Route Guard
import ProtectedRoute from './components/Auth/ProtectedRoute';
import NotificationDrawer from './components/Notifications/NotificationDrawer';
import AICareerChatbot from './components/AI/AICareerChatbot';
import ErrorBoundary from './components/Common/ErrorBoundary';


// Lazy Loaded Pages for Production Code Splitting
const Home = lazy(() => import('./pages/Home'));

// Auth Pages
const AuthRoleSelect = lazy(() => import('./pages/auth/AuthRoleSelect'));
const StudentLogin = lazy(() => import('./pages/auth/StudentLogin'));
const StudentRegister = lazy(() => import('./pages/auth/StudentRegister'));
const CompanyLogin = lazy(() => import('./pages/auth/CompanyLogin'));
const CompanyRegister = lazy(() => import('./pages/auth/CompanyRegister'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// Student & Messaging Pages (Protected)
const ExploreInternships = lazy(() => import('./pages/Explore'));
const InternshipDetail = lazy(() => import('./pages/Student/InternshipDetail'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const StudentProfile = lazy(() => import('./pages/Profile'));
const StudentResume = lazy(() => import('./pages/Student/StudentResume'));
const StudentInterviews = lazy(() => import('./pages/Student/StudentInterviews'));
const StudentOffers = lazy(() => import('./pages/Student/StudentOffers'));
const StudentCertificates = lazy(() => import('./pages/Student/StudentCertificates'));
const MessagingCenter = lazy(() => import('./pages/Messaging/MessagingCenter'));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SavedJobs = lazy(() => import('./pages/Student/SavedJobs'));
const ApplicationTracker = lazy(() => import('./pages/Student/ApplicationTracker'));
const AICareerTools = lazy(() => import('./pages/Student/AICareerTools'));
const NotificationsPage = lazy(() => import('./pages/Student/NotificationsPage'));
const PortfolioBuilder = lazy(() => import('./pages/Student/PortfolioBuilder'));
const StudentAssessments = lazy(() => import('./pages/Student/StudentAssessments'));
const TakeAssessmentPortal = lazy(() => import('./pages/Student/TakeAssessmentPortal'));
const SkillHub = lazy(() => import('./pages/Student/SkillHub'));
const TakeChallengePortal = lazy(() => import('./pages/Student/TakeChallengePortal'));


// Company Pages (Protected)
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));
const CompanyProfile = lazy(() => import('./pages/Company/CompanyProfile'));
const PostInternship = lazy(() => import('./pages/Company/PostInternship'));
const ManageJobs = lazy(() => import('./pages/Company/ManageJobs'));
const ApplicantManagement = lazy(() => import('./pages/Company/ApplicantManagement'));
const CompanyAssessments = lazy(() => import('./pages/Company/CompanyAssessments'));


// Admin Pages (Protected)
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const CompanyVerification = lazy(() => import('./pages/Admin/CompanyVerification'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const JobModeration = lazy(() => import('./pages/Admin/JobModeration'));
const AdminAnalytics = lazy(() => import('./pages/Admin/AdminAnalytics'));
const AdminReports = lazy(() => import('./pages/Admin/AdminReports'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
      Loading InternConnect AI...
    </span>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Landing & Auth Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/auth/select-role" element={<AuthRoleSelect />} />
              <Route path="/auth/student/login" element={<StudentLogin />} />
              <Route path="/auth/student/register" element={<StudentRegister />} />
              <Route path="/auth/company/login" element={<CompanyLogin />} />
              <Route path="/auth/company/register" element={<CompanyRegister />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/verify-email" element={<VerifyEmail />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/portfolio/:username" element={<PublicPortfolio />} />

              {/* Protected Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute allowedRole="student">
                    <ExploreInternships />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/internship/:id"
                element={
                  <ProtectedRoute allowedRole="student">
                    <InternshipDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-jobs"
                element={
                  <ProtectedRoute allowedRole="student">
                    <SavedJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/applications"
                element={
                  <ProtectedRoute allowedRole="student">
                    <ApplicationTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRole="student">
                    <StudentProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/resume"
                element={
                  <ProtectedRoute allowedRole="student">
                    <StudentResume />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/interviews"
                element={
                  <ProtectedRoute allowedRole="student">
                    <StudentInterviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/offers"
                element={
                  <ProtectedRoute allowedRole="student">
                    <StudentOffers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/certificates"
                element={
                  <ProtectedRoute allowedRole="student">
                    <StudentCertificates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagingCenter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-tools"
                element={
                  <ProtectedRoute allowedRole="student">
                    <AICareerTools />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/portfolio"
                element={
                  <ProtectedRoute allowedRole="student">
                    <PortfolioBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/assessments"
                element={
                  <ProtectedRoute allowedRole="student">
                    <StudentAssessments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/assessment/:id/take"
                element={
                  <ProtectedRoute allowedRole="student">
                    <TakeAssessmentPortal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skill-hub"
                element={
                  <ProtectedRoute allowedRole="student">
                    <SkillHub />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skill-challenge/:id"
                element={
                  <ProtectedRoute allowedRole="student">
                    <TakeChallengePortal />
                  </ProtectedRoute>
                }
              />


              {/* Protected Company Routes */}
              <Route
                path="/company/dashboard"
                element={
                  <ProtectedRoute allowedRole="company">
                    <CompanyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/profile"
                element={
                  <ProtectedRoute allowedRole="company">
                    <CompanyProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/post-job"
                element={
                  <ProtectedRoute allowedRole="company">
                    <PostInternship />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/jobs"
                element={
                  <ProtectedRoute allowedRole="company">
                    <ManageJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/applicants"
                element={
                  <ProtectedRoute allowedRole="company">
                    <ApplicantManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/assessments"
                element={
                  <ProtectedRoute allowedRole="company">
                    <CompanyAssessments />
                  </ProtectedRoute>
                }
              />


              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/verification"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <CompanyVerification />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/jobs-moderation"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <JobModeration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRole="admin">
                    <AdminReports />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          {/* Floating UI Extensions wrapped safely */}
          <ErrorBoundary>
            <Suspense fallback={null}>
              <NotificationDrawer />
              <AICareerChatbot />
            </Suspense>
          </ErrorBoundary>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}


export default App;

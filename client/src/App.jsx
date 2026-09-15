import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

// Components & Layouts
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import NotificationDrawer from './components/Notifications/NotificationDrawer';
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
const StudentMessagesPage = lazy(() => import('./pages/Messaging/StudentMessagesPage'));
const RecruiterMessagesPage = lazy(() => import('./pages/Messaging/RecruiterMessagesPage'));
const AdminMessagesPage = lazy(() => import('./pages/Messaging/AdminMessagesPage'));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SavedJobs = lazy(() => import('./pages/Student/SavedJobs'));
const ApplicationTracker = lazy(() => import('./pages/Student/ApplicationTracker'));
const AICareerTools = lazy(() => import('./pages/Student/AICareerTools'));
const NotificationsPage = lazy(() => import('./pages/Student/NotificationsPage'));
const PortfolioBuilder = lazy(() => import('./pages/Student/PortfolioBuilder'));
const PublicPortfolio = lazy(() => import('./pages/PublicPortfolio'));
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
  <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
      Loading InternConnect AI...
    </span>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Landing & Auth Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<AuthRoleSelect />} />
                <Route path="/auth/select-role" element={<AuthRoleSelect />} />
                <Route path="/auth/student/login" element={<StudentLogin />} />
                <Route path="/auth/student/register" element={<StudentRegister />} />
                <Route path="/register/student" element={<StudentRegister />} />
                <Route path="/auth/company/login" element={<CompanyLogin />} />
                <Route path="/auth/company/register" element={<CompanyRegister />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/verify-email" element={<VerifyEmail />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/portfolio/:username" element={<PublicPortfolio />} />

                {/* Nested Student Routes wrapped inside unified DashboardLayout */}
                <Route
                  element={
                    <ProtectedRoute allowedRole="student">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/profile" element={<StudentProfile />} />
                  <Route path="/student/resume" element={<StudentResume />} />
                  <Route path="/student/interviews" element={<StudentInterviews />} />
                  <Route path="/student/offers" element={<StudentOffers />} />
                  <Route path="/student/certificates" element={<StudentCertificates />} />
                  <Route path="/student/portfolio" element={<PortfolioBuilder />} />
                  <Route path="/student/assessments" element={<StudentAssessments />} />
                  <Route path="/student/assessment/:id/take" element={<TakeAssessmentPortal />} />
                  <Route path="/student/applications" element={<ApplicationTracker />} />
                  <Route path="/student/saved-jobs" element={<SavedJobs />} />
                  <Route path="/student/explore" element={<ExploreInternships />} />
                  <Route path="/student/ai-tools" element={<AICareerTools />} />
                  <Route path="/student/messages" element={<StudentMessagesPage />} />
                  <Route path="/messages" element={<StudentMessagesPage />} />

                  {/* Top-Level Route Aliases rendering inside the same DashboardLayout */}
                  <Route path="/explore" element={<ExploreInternships />} />
                  <Route path="/saved-jobs" element={<SavedJobs />} />
                  <Route path="/applications" element={<ApplicationTracker />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/ai-tools" element={<AICareerTools />} />
                  <Route path="/skill-hub" element={<SkillHub />} />
                  <Route path="/skill-challenge/:id" element={<TakeChallengePortal />} />
                  <Route path="/internship/:id" element={<InternshipDetail />} />
                </Route>

                {/* Protected Company Routes */}
                <Route
                  element={
                    <ProtectedRoute allowedRole="company">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/company/dashboard" element={<CompanyDashboard />} />
                  <Route path="/company/profile" element={<CompanyProfile />} />
                  <Route path="/company/post-job" element={<PostInternship />} />
                  <Route path="/company/jobs" element={<ManageJobs />} />
                  <Route path="/company/applicants" element={<ApplicantManagement />} />
                  <Route path="/company/assessments" element={<CompanyAssessments />} />
                  <Route path="/company/messages" element={<RecruiterMessagesPage />} />
                </Route>

                {/* Protected Admin Routes */}
                <Route
                  element={
                    <ProtectedRoute allowedRole="admin">
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/verification" element={<CompanyVerification />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/jobs-moderation" element={<JobModeration />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="/admin/messages" element={<AdminMessagesPage />} />
                </Route>

                {/* 404 Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>

            {/* Floating UI Extensions wrapped safely */}
            <ErrorBoundary>
              <Suspense fallback={null}>
                <NotificationDrawer />
              </Suspense>
            </ErrorBoundary>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

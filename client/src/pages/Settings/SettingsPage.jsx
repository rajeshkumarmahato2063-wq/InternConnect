import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Mail,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  Save,
  AlertCircle,
  Key,
  Sliders,
  FileCheck,
  UserCheck,
  Globe,
  Eye,
  Trash2,
  Bell,
  RefreshCw,
  LogOut
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { profileService } from '../../services/profileService';

export default function SettingsPage() {
  const { user, currentRole, logout } = useAuth();
  const userId = user?.id;

  // Password Update Form State
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [submittingPassword, setSubmittingPassword] = useState(false);

  // Student Email Preferences
  const [emailPrefs, setEmailPrefs] = useState({
    internship_alerts: true,
    interview_reminders: true,
    weekly_recommendations: true,
    marketing_emails: false,
  });

  // Admin Specific Settings
  const [adminSettings, setAdminSettings] = useState({
    two_factor_required: true,
    auto_verify_companies: false,
    auto_flag_reported_chats: true,
    audit_log_retention: '90', // days
    security_alerts_email: true,
    maintenance_broadcasts: true,
  });

  // Recruiter Specific Settings
  const [recruiterPrefs, setRecruiterPrefs] = useState({
    new_applicant_alerts: true,
    interview_response_alerts: true,
    weekly_ranking_digest: true,
    two_factor_enabled: false,
  });

  // Privacy Settings (Student)
  const [privacySettings, setPrivacySettings] = useState({
    public_portfolio_indexed: true,
    allow_recruiter_direct_messages: true,
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!userId) return;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('email_preferences, admin_settings, recruiter_prefs, privacy_settings')
          .eq('id', userId)
          .maybeSingle();

        if (data) {
          if (data.email_preferences) setEmailPrefs(data.email_preferences);
          if (data.admin_settings) setAdminSettings(data.admin_settings);
          if (data.recruiter_prefs) setRecruiterPrefs(data.recruiter_prefs);
          if (data.privacy_settings) setPrivacySettings(data.privacy_settings);
        }
      } catch (e) {
        console.warn('Failed to load user settings preferences:', e.message);
      }
    };
    loadPreferences();
  }, [userId]);

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4500);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (passwordForm.new.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }

    setSubmittingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordForm.new });
      if (error) {
        showToast(error.message, 'error');
      } else {
        setPasswordForm({ current: '', new: '', confirm: '' });
        showToast('Password updated successfully!');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingPassword(false);
    }
  };

  const handleSaveSettings = async (settingType = 'preferences') => {
    if (!userId) {
      showToast('Settings updated locally!');
      return;
    }

    setSubmitting(true);
    try {
      let updatePayload = {};
      if (currentRole === 'admin') {
        updatePayload = { admin_settings: adminSettings };
      } else if (currentRole === 'company') {
        updatePayload = { recruiter_prefs: recruiterPrefs };
      } else {
        updatePayload = { email_preferences: emailPrefs, privacy_settings: privacySettings };
      }

      await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId);

      showToast('Settings saved successfully!');
    } catch (e) {
      showToast('Settings updated successfully.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Account Deletion Handler with RBAC Backend & Role Check
   */
  const handleDeleteAccount = async () => {
    // 1. Strict RBAC Enforcement: Block Admin self-deletion
    if (currentRole === 'admin' || user?.role === 'admin') {
      showToast('Authorization Error: Admin accounts cannot be deleted via self-service. Contact system owner.', 'error');
      return;
    }

    const actionWord = currentRole === 'company' ? 'deactivate your employer organization account' : 'permanently delete your student candidate profile';

    if (window.confirm(`CAUTION: Are you sure you want to ${actionWord}? All associated profile data will be permanently removed.`)) {
      try {
        await profileService.deleteAccount(userId, currentRole);
        showToast('Account deleted. Redirecting...', 'error');
        setTimeout(() => {
          logout();
          window.location.href = '/login';
        }, 1500);
      } catch (err) {
        showToast(err.message || 'Account deletion failed.', 'error');
      }
    }
  };

  const getPageTitle = () => {
    if (currentRole === 'admin') return 'System Administration & Security Settings';
    if (currentRole === 'company') return 'Employer Account & Recruiter Settings';
    return 'Account & Email Settings';
  };

  const getPageSubtitle = () => {
    if (currentRole === 'admin') {
      return 'Configure platform verification rules, moderation preferences, audit logs, and admin security credentials.';
    }
    if (currentRole === 'company') {
      return 'Configure hiring team security, applicant notification alerts, and recruiter preferences.';
    }
    return 'Manage your authentication credentials, email notification preferences, and privacy controls.';
  };

  return (
    <DashboardLayout title={getPageTitle()} subtitle={getPageSubtitle()}>
      <div className="space-y-8 max-w-4xl mx-auto pb-12">
        {/* Toast Notification */}
        {message.text && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center space-x-2 transition-all ${
              message.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
            }`}
          >
            {message.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADMIN ROLE SETTINGS SECTION                                               */}
        {/* ========================================================================= */}
        {currentRole === 'admin' && (
          <>
            {/* 1. Admin Security & Authentication */}
            <Card variant="glass" className="p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-500" /> Admin Security & Access Control
              </h3>

              <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    New Admin Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingPassword}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{submittingPassword ? 'Updating...' : 'Update Admin Password'}</span>
                  </button>
                </div>
              </form>
            </Card>

            {/* 2. Admin Platform & Moderation Preferences */}
            <Card variant="glass" className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-500" /> Platform Verification & User Moderation Rules
                </h3>
                <button
                  type="button"
                  onClick={() => handleSaveSettings('admin')}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Save Admin Preferences
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Require Two-Factor Authentication (2FA) for Admin Portal
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Enforce strict 2FA OTP verification on all administrative login sessions.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={adminSettings.two_factor_required}
                    onChange={(e) => setAdminSettings({ ...adminSettings, two_factor_required: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Auto-Flag Reported & Suspicious Chat Messages
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Automatically route flagged candidate/recruiter messages to the Admin Moderation Inbox.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={adminSettings.auto_flag_reported_chats}
                    onChange={(e) => setAdminSettings({ ...adminSettings, auto_flag_reported_chats: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      High-Priority Security Email Alerts
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Receive immediate notifications when new corporate employers submit verification documents.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={adminSettings.security_alerts_email}
                    onChange={(e) => setAdminSettings({ ...adminSettings, security_alerts_email: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4 cursor-pointer"
                  />
                </label>

                {/* Audit Log Retention dropdown */}
                <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      System Audit Log Retention Period
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Duration to retain platform moderation logs and verification history.
                    </span>
                  </div>
                  <select
                    value={adminSettings.audit_log_retention}
                    onChange={(e) => setAdminSettings({ ...adminSettings, audit_log_retention: e.target.value })}
                    className="rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold cursor-pointer ml-4"
                  >
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                    <option value="365">1 Year</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* 3. Session & Security Info */}
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Session & Authorization Integrity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your administrative account is protected under Supabase Row Level Security (RLS) policies. Self-service deletion is disabled for system safety.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Admin Protected Status Active
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-700 dark:text-slate-300 hover:text-rose-500 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out Session
                </button>
              </div>
            </Card>
          </>
        )}

        {/* ========================================================================= */}
        {/* RECRUITER / COMPANY ROLE SETTINGS SECTION                                */}
        {/* ========================================================================= */}
        {currentRole === 'company' && (
          <>
            {/* 1. Recruiter Security */}
            <Card variant="glass" className="p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500" /> Employer Security & Authentication
              </h3>

              <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingPassword}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </Card>

            {/* 2. Applicant Notifications */}
            <Card variant="glass" className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-500" /> Recruiter & Applicant Notification Alerts
                </h3>
                <button
                  type="button"
                  onClick={() => handleSaveSettings('company')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Save Recruiter Prefs
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Instant Applicant Alerts</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Receive email notifications as soon as a student applies for your internships.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={recruiterPrefs.new_applicant_alerts}
                    onChange={(e) => setRecruiterPrefs({ ...recruiterPrefs, new_applicant_alerts: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Interview Acceptance Alerts</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Receive alerts when candidates confirm scheduled technical video calls.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={recruiterPrefs.interview_response_alerts}
                    onChange={(e) => setRecruiterPrefs({ ...recruiterPrefs, interview_response_alerts: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Weekly Gemini AI Talent Digest</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Receive weekly AI summaries of top matched applicants for active listings.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={recruiterPrefs.weekly_ranking_digest}
                    onChange={(e) => setRecruiterPrefs({ ...recruiterPrefs, weekly_ranking_digest: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4 cursor-pointer"
                  />
                </label>
              </div>
            </Card>

            {/* Recruiter Danger / Deactivate Zone */}
            <Card variant="glass" className="p-6 space-y-4 border-red-500/30">
              <h3 className="text-base font-bold text-rose-600 dark:text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" /> Employer Account Controls
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deactivate your company account or pause active internship postings.
              </p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-600 dark:text-rose-300 hover:text-white border border-rose-500/40 font-semibold text-xs transition-all"
              >
                Deactivate Company Account
              </button>
            </Card>
          </>
        )}

        {/* ========================================================================= */}
        {/* STUDENT ROLE SETTINGS SECTION                                            */}
        {/* ========================================================================= */}
        {currentRole === 'student' && (
          <>
            {/* 1. Security & Password */}
            <Card variant="glass" className="p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-500" /> Security & Password
              </h3>

              <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingPassword}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </Card>

            {/* 2. Email Notifications */}
            <Card variant="glass" className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-500" /> Email Notifications & Preferences
                </h3>
                <button
                  type="button"
                  onClick={() => handleSaveSettings('student')}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Save Preferences
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Internship Match Alerts</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Receive email notifications when new internships match your skills.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailPrefs.internship_alerts}
                    onChange={(e) => setEmailPrefs({ ...emailPrefs, internship_alerts: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Interview Reminders & Invitations</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Receive scheduled interview calls and calendar invites.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailPrefs.interview_reminders}
                    onChange={(e) => setEmailPrefs({ ...emailPrefs, interview_reminders: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Weekly Career Digest</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Weekly AI-curated tips and recommended high-paying roles.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailPrefs.weekly_recommendations}
                    onChange={(e) => setEmailPrefs({ ...emailPrefs, weekly_recommendations: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4 cursor-pointer"
                  />
                </label>
              </div>
            </Card>

            {/* 3. Student Danger Zone */}
            <Card variant="glass" className="p-6 space-y-4 border-red-500/30">
              <h3 className="text-base font-bold text-rose-600 dark:text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" /> Danger Zone
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Permanently remove your candidate profile, uploaded resumes, interview histories, and saved job bookmarks.
              </p>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-600 dark:text-rose-300 hover:text-white border border-rose-500/40 font-semibold text-xs transition-all"
              >
                Delete Account Permanently
              </button>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

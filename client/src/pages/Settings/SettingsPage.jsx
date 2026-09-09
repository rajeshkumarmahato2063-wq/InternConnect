import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Bell, Moon, Sun, ShieldAlert, CheckCircle, Save, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user, currentRole } = useAuth();
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [emailForm, setEmailForm] = useState({ email: user?.email || 'student@internconnect.ai' });
  const [notifications, setNotifications] = useState({ emailAlerts: true, pushAlerts: true, interviewReminders: true });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
      showToast('Password updated successfully!');
    }, 600);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showToast('Email address updated successfully!');
    }, 600);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('CAUTION: Are you sure you want to permanently delete your InternConnect account? This action cannot be undone.')) {
      showToast('Account scheduled for deletion.', 'error');
    }
  };

  return (
    <DashboardLayout
      title="Account & System Settings"
      subtitle="Manage your authentication credentials, notification preferences, and application settings."
    >
      <div className="space-y-8 max-w-4xl mx-auto pb-12">
        {/* Toast */}
        {message.text && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center space-x-2 ${
              message.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Change Password Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" /> Security & Password
          </h3>

          <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-400" /> Realtime Notifications & Email Alerts
          </h3>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 cursor-pointer">
              <span className="text-xs font-medium text-slate-200">Email Notifications for New Messages</span>
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 cursor-pointer">
              <span className="text-xs font-medium text-slate-200">Push Notifications for Interview Invites</span>
              <input
                type="checkbox"
                checked={notifications.interviewReminders}
                onChange={(e) => setNotifications({ ...notifications, interviewReminders: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/30 backdrop-blur-xl shadow-xl space-y-4">
          <h3 className="text-base font-bold text-red-300 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" /> Danger Zone
          </h3>
          <p className="text-xs text-slate-400">
            Permanently remove your profile data, uploaded resumes, interview histories, and saved job bookmarks.
          </p>

          <button
            onClick={handleDeleteAccount}
            className="px-5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 font-semibold text-xs transition-all"
          >
            Delete Account permanently
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

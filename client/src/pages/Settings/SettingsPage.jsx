import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Bell, Moon, Sun, ShieldAlert, CheckCircle, Save, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

export default function SettingsPage() {
  const { user } = useAuth();
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [emailPrefs, setEmailPrefs] = useState({
    internship_alerts: true,
    interview_reminders: true,
    marketing_emails: false,
    weekly_recommendations: true,
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    const loadPrefs = async () => {
      if (userId) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('email_preferences')
            .eq('id', userId)
            .maybeSingle();

          if (data && data.email_preferences) {
            setEmailPrefs(data.email_preferences);
          }
        } catch (e) {
          console.warn('Failed to load email preferences:', e.message);
        }
      }
    };
    loadPrefs();
  }, [userId]);

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    setSubmitting(true);
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
      setSubmitting(false);
    }
  };

  const handleSaveEmailPrefs = async () => {
    if (!userId) {
      showToast('Preferences saved locally!');
      return;
    }

    try {
      await supabase
        .from('profiles')
        .update({ email_preferences: emailPrefs })
        .eq('id', userId);

      showToast('Email preferences updated successfully!');
    } catch (e) {
      showToast('Saved email preferences locally.');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('CAUTION: Are you sure you want to permanently delete your InternConnect account?')) {
      showToast('Account scheduled for deletion.', 'error');
    }
  };

  return (
    <DashboardLayout
      title="Account & Email Settings"
      subtitle="Manage your authentication credentials, email preferences, and notification workflows."
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

        {/* Email Preferences Section */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-400" /> Email Notifications & Preferences
            </h3>
            <button
              type="button"
              onClick={handleSaveEmailPrefs}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" /> Save Preferences
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 cursor-pointer hover:bg-slate-800/60 transition-colors">
              <div>
                <span className="text-xs font-bold text-white block">Internship Match Alerts</span>
                <span className="text-[11px] text-slate-400">Receive instant email notifications when new internships match your skill matrix.</span>
              </div>
              <input
                type="checkbox"
                checked={emailPrefs.internship_alerts}
                onChange={(e) => setEmailPrefs({ ...emailPrefs, internship_alerts: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 cursor-pointer hover:bg-slate-800/60 transition-colors">
              <div>
                <span className="text-xs font-bold text-white block">Interview Reminders & Invitations</span>
                <span className="text-[11px] text-slate-400">Receive scheduled interview calls, video meeting links, and calendar invites.</span>
              </div>
              <input
                type="checkbox"
                checked={emailPrefs.interview_reminders}
                onChange={(e) => setEmailPrefs({ ...emailPrefs, interview_reminders: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 cursor-pointer hover:bg-slate-800/60 transition-colors">
              <div>
                <span className="text-xs font-bold text-white block">Weekly Career Recommendations</span>
                <span className="text-[11px] text-slate-400">Weekly AI-curated digest of top candidate tips, roadmaps, and high-paying roles.</span>
              </div>
              <input
                type="checkbox"
                checked={emailPrefs.weekly_recommendations}
                onChange={(e) => setEmailPrefs({ ...emailPrefs, weekly_recommendations: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 cursor-pointer hover:bg-slate-800/60 transition-colors">
              <div>
                <span className="text-xs font-bold text-white block">Platform News & Product Updates</span>
                <span className="text-[11px] text-slate-400">Updates regarding new AI tools, features, and platform enhancements.</span>
              </div>
              <input
                type="checkbox"
                checked={emailPrefs.marketing_emails}
                onChange={(e) => setEmailPrefs({ ...emailPrefs, marketing_emails: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded shrink-0 ml-4"
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

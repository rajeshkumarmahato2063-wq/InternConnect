import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, GraduationCap, BookOpen, Calendar, Github, Linkedin, Globe, Save, CheckCircle2, X, Plus } from 'lucide-react';
import ProfileProgressRing from '../components/Dashboard/ProfileProgressRing';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import UserAvatar from '../components/Common/UserAvatar';
import { useAuth } from '../context/AuthContext';

const StudentProfile = () => {
  const { user, updateProfileData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    college: '',
    degree: '',
    graduation_year: 2026,
    skills: [],
    github: '',
    linkedin: '',
    portfolio: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.name || '',
        phone: user.phone || '',
        college: user.college || '',
        degree: user.degree || '',
        graduation_year: user.graduationYear || 2026,
        skills: Array.isArray(user.skills) ? user.skills : [],
        github: user.github || '',
        linkedin: user.linkedin || '',
        portfolio: user.portfolio || '',
        avatar_url: user.avatar || '',
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    await updateProfileData(formData);

    setSaving(false);
    setIsEditing(false);
    setSuccessToast(true);

    setTimeout(() => setSuccessToast(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.name || '',
      phone: user?.phone || '',
      college: user?.college || '',
      degree: user?.degree || '',
      graduation_year: user?.graduationYear || 2026,
      skills: Array.isArray(user?.skills) ? user.skills : [],
      github: user?.github || '',
      linkedin: user?.linkedin || '',
      portfolio: user?.portfolio || '',
      avatar_url: user?.avatar || '',
    });
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((sk) => sk !== skillToRemove),
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full">
          {/* Profile Completion Indicator */}
          <ProfileProgressRing percentage={user?.profileCompletion || 0} />

          {/* Success Toast Notification */}
          {successToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Profile updated and synchronized with Supabase database!
              </span>
              <button type="button" onClick={() => setSuccessToast(false)} className="text-emerald-400">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Main Form Card */}
          <Card variant="glass" className="p-6 sm:p-8">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Card Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <UserAvatar
                    name={formData.full_name || user?.email}
                    email={user?.email}
                    src={formData.avatar_url}
                    size="2xl"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {formData.full_name || 'Complete Your Profile'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {user?.email || 'No email associated'}
                    </p>
                    {(formData.college || formData.degree) && (
                      <p className="text-xs text-indigo-400 mt-0.5">
                        {formData.college} {formData.degree ? `• ${formData.degree}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                {!isEditing ? (
                  <Button type="button" variant="primary" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" disabled={saving} icon={Save}>
                      {saving ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Avatar Storage URL */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block font-semibold uppercase text-slate-300">
                    Profile Photo URL (Supabase Storage / Public Link)
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    placeholder="Enter custom photo URL or upload to Supabase avatars bucket"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className={`w-full rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all ${
                      isEditing
                        ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                        : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-slate-300">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      placeholder="Enter your 10-digit phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* College */}
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-slate-300">College / University</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      placeholder="Enter your college or university"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Degree */}
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-slate-300">Degree & Major</label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      placeholder="e.g. B.Tech Computer Science"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Graduation Year */}
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-slate-300">Graduation Year</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                    <input
                      type="number"
                      disabled={!isEditing}
                      placeholder="e.g. 2026"
                      value={formData.graduation_year || ''}
                      onChange={(e) => setFormData({ ...formData, graduation_year: Number(e.target.value) })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-slate-300">GitHub Profile URL</label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      disabled={!isEditing}
                      placeholder="https://github.com/your-username"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-slate-300">LinkedIn Profile URL</label>
                  <div className="relative">
                    <Linkedin className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      disabled={!isEditing}
                      placeholder="https://linkedin.com/in/your-profile"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Portfolio */}
                <div className="space-y-1">
                  <label className="block font-semibold uppercase text-slate-300">Personal Portfolio URL</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      disabled={!isEditing}
                      placeholder="https://yourportfolio.dev"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Skills Chips Editor */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold uppercase text-slate-300 text-xs">
                    Technical Skills & Tools
                  </label>
                </div>

                {isEditing && (
                  <div className="flex gap-2 max-w-md">
                    <input
                      type="text"
                      placeholder="Add a new skill (e.g. React, Python)"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                )}

                {formData.skills && formData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.skills.map((sk) => (
                      <span
                        key={sk}
                        className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5"
                      >
                        {sk}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(sk)}
                            className="hover:text-rose-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic pt-1">No skills added yet.</p>
                )}
              </div>
            </form>
          </Card>
    </div>
  );
};

export default StudentProfile;

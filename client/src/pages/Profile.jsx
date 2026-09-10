import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, GraduationCap, BookOpen, Calendar, Github, Linkedin, Globe, Save, CheckCircle2, X } from 'lucide-react';
import Sidebar from '../components/Dashboard/Sidebar';
import TopBar from '../components/Dashboard/TopBar';
import SkillChip from '../components/Dashboard/SkillChip';
import ProfileProgressRing from '../components/Dashboard/ProfileProgressRing';
import Card from '../components/Card/Card';
import Button from '../components/Button/Button';
import { useAuth } from '../context/AuthContext';

const StudentProfile = () => {
  const { user, updateProfileData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.name || 'Aarav Sharma',
    phone: user?.phone || '+91 98765 43210',
    college: user?.college || 'IIT Delhi',
    degree: user?.degree || 'B.Tech in Computer Science',
    graduation_year: user?.graduationYear || 2025,
    skills: user?.skills || ['React.js', 'Node.js', 'Python', 'TypeScript', 'Tailwind CSS'],
    github: user?.github || 'https://github.com/aarav-sharma',
    linkedin: user?.linkedin || 'https://linkedin.com/in/aarav-sharma',
    portfolio: user?.portfolio || 'https://aaravsharma.dev',
    avatar_url:
      user?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  });

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
      full_name: user?.name || 'Aarav Sharma',
      phone: user?.phone || '+91 98765 43210',
      college: user?.college || 'IIT Delhi',
      degree: user?.degree || 'B.Tech in Computer Science',
      graduation_year: user?.graduationYear || 2025,
      skills: user?.skills || ['React.js', 'Node.js', 'Python', 'TypeScript', 'Tailwind CSS'],
      github: user?.github || 'https://github.com/aarav-sharma',
      linkedin: user?.linkedin || 'https://linkedin.com/in/aarav-sharma',
      portfolio: user?.portfolio || 'https://aaravsharma.dev',
      avatar_url:
        user?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="My Profile & Supabase Storage" />

        <main className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
          {/* Profile Completion Indicator */}
          <ProfileProgressRing percentage={user?.profileCompletion || 80} />

          {/* Success Toast Notification */}
          {successToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Profile updated and synchronized with Supabase PostgreSQL database!
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
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-lg shrink-0">
                    <img
                      src={formData.avatar_url}
                      alt={formData.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{formData.full_name}</h2>
                    <p className="text-xs text-slate-400">{formData.college} • {formData.degree}</p>
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
                {/* Avatar URL */}
                <div className="md:col-span-2">
                  <label className="block font-semibold uppercase text-slate-300 mb-1">
                    Profile Photo URL
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className={`w-full rounded-xl p-3 text-sm text-white focus:outline-none transition-all ${
                      isEditing
                        ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                        : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="block font-semibold uppercase text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-semibold uppercase text-slate-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* College */}
                <div>
                  <label className="block font-semibold uppercase text-slate-300 mb-1">College / University</label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Degree */}
                <div>
                  <label className="block font-semibold uppercase text-slate-300 mb-1">Degree & Program</label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="block font-semibold uppercase text-slate-300 mb-1">Graduation Year</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                    <input
                      type="number"
                      disabled={!isEditing}
                      value={formData.graduation_year}
                      onChange={(e) => setFormData({ ...formData, graduation_year: Number(e.target.value) })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div>
                  <label className="block font-semibold uppercase text-slate-300 mb-1">GitHub Profile</label>
                  <div className="relative">
                    <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      disabled={!isEditing}
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block font-semibold uppercase text-slate-300 mb-1">LinkedIn Profile</label>
                  <div className="relative">
                    <Linkedin className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      disabled={!isEditing}
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {/* Portfolio */}
                <div>
                  <label className="block font-semibold uppercase text-slate-300 mb-1">Portfolio Link</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      disabled={!isEditing}
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className={`w-full rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none transition-all ${
                        isEditing
                          ? 'bg-slate-900 border border-slate-700 focus:border-indigo-500'
                          : 'bg-slate-900/40 border border-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Skills Editor */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <label className="block font-semibold uppercase text-slate-300 text-xs">
                  Technical Skills (Dynamic Chips)
                </label>
                {isEditing ? (
                  <SkillChip
                    skills={formData.skills}
                    onChange={(newSkills) => setFormData({ ...formData, skills: newSkills })}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((sk) => (
                      <span
                        key={sk}
                        className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default StudentProfile;

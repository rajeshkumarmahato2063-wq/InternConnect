import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Save, Send, CheckCircle2, Plus, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { internshipService } from '../../services/internshipService';

const PostInternship = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [workMode, setWorkMode] = useState('Remote');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [stipend, setStipend] = useState('50000');
  const [duration, setDuration] = useState('3 Months');
  const [openings, setOpenings] = useState(5);
  const [deadline, setDeadline] = useState('2026-12-31');
  const [skills, setSkills] = useState(['React.js', 'Node.js', 'TypeScript']);
  const [skillInput, setSkillInput] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
      if (errors.skills) {
        setErrors((prev) => ({ ...prev, skills: null }));
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Job position title is required';
    if (!location.trim()) errs.location = 'Office location is required';
    if (!description.trim()) errs.description = 'Job description is required';
    if (!duration.trim()) errs.duration = 'Duration is required';

    if (!stipend.toString().trim()) {
      errs.stipend = 'Stipend amount is required';
    } else {
      const stipendVal = parseFloat(stipend.toString().replace(/[^0-9.]/g, ''));
      if (isNaN(stipendVal) || stipendVal <= 0) {
        errs.stipend = 'Stipend must be a positive number (e.g. ₹50,000)';
      }
    }

    if (!deadline) {
      errs.deadline = 'Application deadline is required';
    } else {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        errs.deadline = 'Deadline must be a future date';
      }
    }

    if (skills.length === 0) {
      errs.skills = 'Please add at least one required skill tag';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    if (!isDraft && !validateForm()) return;

    setSubmitting(true);
    const stipendVal = parseFloat(stipend.toString().replace(/[^0-9.]/g, '')) || 50000;
    const formattedStipend = stipend.toString().startsWith('₹') ? stipend : `₹${stipend} / month`;

    const jobData = {
      company_id: user?.id,
      companyName: user?.user_metadata?.company_name || 'TechCorp',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      title,
      workMode,
      location,
      stipend: formattedStipend,
      stipendValue: stipendVal,
      duration,
      openings: Number(openings),
      deadline,
      skills,
      description,
      saveDraft: isDraft,
    };

    await internshipService.createInternship(jobData, user?.id);
    setSubmitting(false);
    setSuccess(true);

    setTimeout(() => {
      navigate('/company/jobs');
    }, 1500);
  };

  return (
    <DashboardLayout
      title="Post New Internship"
      subtitle="Publish an internship opening to reach over 10,000 verified university candidates."
    >
      <Card variant="glass" className="p-8">
        {success ? (
          <div className="py-12 text-center flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Internship Listing Published!</h3>
            <p className="text-slate-400 text-sm">Redirecting to your active listings management table...</p>
          </div>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" /> Internship Details Form
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={submitting}
                  icon={Save}
                >
                  Save as Draft
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={submitting} icon={Send}>
                  {submitting ? 'Publishing...' : 'Publish Listing'}
                </Button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-semibold uppercase text-slate-300 mb-1">
                Internship Position Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Frontend Software Engineering Intern"
                className={`w-full rounded-xl bg-slate-800 border p-3 text-sm text-white focus:outline-none ${
                  errors.title ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.title && <p className="text-rose-400 text-[11px] mt-1">{errors.title}</p>}
            </div>

            {/* Row: Work mode & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold uppercase text-slate-300 mb-1">Work Mode</label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-300 mb-1">Office Location *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, Karnataka"
                  className={`w-full rounded-xl bg-slate-800 border p-3 text-sm text-white focus:outline-none ${
                    errors.location ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                  }`}
                />
                {errors.location && <p className="text-rose-400 text-[11px] mt-1">{errors.location}</p>}
              </div>
            </div>

            {/* Row: Stipend, Duration, Openings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold uppercase text-slate-300 mb-1">Stipend Amount (Monthly) *</label>
                <input
                  type="text"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="e.g. 50000"
                  className={`w-full rounded-xl bg-slate-800 border p-3 text-sm text-white focus:outline-none ${
                    errors.stipend ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                  }`}
                />
                {errors.stipend && <p className="text-rose-400 text-[11px] mt-1">{errors.stipend}</p>}
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-300 mb-1">Tenure / Duration *</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 3 Months"
                  className={`w-full rounded-xl bg-slate-800 border p-3 text-sm text-white focus:outline-none ${
                    errors.duration ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                  }`}
                />
                {errors.duration && <p className="text-rose-400 text-[11px] mt-1">{errors.duration}</p>}
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-300 mb-1">Total Openings</label>
                <input
                  type="number"
                  min="1"
                  value={openings}
                  onChange={(e) => setOpenings(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block font-semibold uppercase text-slate-300 mb-1">Application Deadline *</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`w-full rounded-xl bg-slate-800 border p-3 text-sm text-white focus:outline-none ${
                  errors.deadline ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.deadline && <p className="text-rose-400 text-[11px] mt-1">{errors.deadline}</p>}
            </div>

            {/* Dynamic Skills Tag Chips */}
            <div>
              <label className="block font-semibold uppercase text-slate-300 mb-1">
                Required Tech Stack Skills (Dynamic Chip Tag Builder) *
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type skill name and press Enter or comma..."
                  className="flex-1 rounded-xl bg-slate-800 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Skill
                </button>
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-400 text-slate-400 font-bold ml-1"
                        title="Remove Skill Tag"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {errors.skills && <p className="text-rose-400 text-[11px] mt-1">{errors.skills}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold uppercase text-slate-300 mb-1">
                Full Job Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe team projects, responsibilities, and key candidate expectations..."
                className={`w-full rounded-xl bg-slate-800 border p-3 text-sm text-white focus:outline-none ${
                  errors.description ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.description && <p className="text-rose-400 text-[11px] mt-1">{errors.description}</p>}
            </div>
          </form>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default PostInternship;

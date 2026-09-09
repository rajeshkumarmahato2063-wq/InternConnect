import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Plus, Save } from 'lucide-react';
import Button from '../Button/Button';
import { internshipService } from '../../services/internshipService';

const EditInternshipModal = ({ job, isOpen, onClose, onUpdated }) => {
  const [title, setTitle] = useState('');
  const [workMode, setWorkMode] = useState('Remote');
  const [location, setLocation] = useState('');
  const [stipend, setStipend] = useState('');
  const [duration, setDuration] = useState('');
  const [openings, setOpenings] = useState(1);
  const [deadline, setDeadline] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setTitle(job.title || '');
      setWorkMode(job.workMode || job.work_mode || 'Remote');
      setLocation(job.location || '');
      setStipend(job.stipend || '');
      setDuration(job.duration || '');
      setOpenings(job.openings || 1);
      setDeadline(job.deadline || '');
      setSkills(Array.isArray(job.skills) ? job.skills : []);
      setDescription(job.description || '');
      setErrors({});
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
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
    if (!title.trim()) errs.title = 'Job title is required';
    if (!location.trim()) errs.location = 'Location is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (!stipend.trim()) errs.stipend = 'Stipend amount is required';
    
    // Parse numeric value from stipend to check positive amount
    const stipendVal = parseFloat(stipend.replace(/[^0-9.]/g, ''));
    if (isNaN(stipendVal) || stipendVal <= 0) {
      errs.stipend = 'Stipend must be a positive amount (e.g. ₹25000)';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const stipendVal = parseFloat(stipend.replace(/[^0-9.]/g, '')) || 50000;

    const updatedJobData = {
      title,
      workMode,
      location,
      stipend,
      stipendValue: stipendVal,
      duration,
      openings: Number(openings),
      deadline,
      skills,
      description,
      isActive: job.isActive !== undefined ? job.isActive : true,
    };

    await internshipService.updateInternship(job.id, updatedJobData);
    setIsSubmitting(false);
    onUpdated?.();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Edit Internship Listing</h3>
              <p className="text-xs text-slate-400">Update posting criteria, required tech stack, or deadline</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="block font-semibold uppercase text-slate-300 mb-1">Position Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full rounded-xl bg-slate-800 border p-3 text-sm text-white focus:outline-none ${
                  errors.title ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.title && <p className="text-rose-400 text-[11px] mt-1">{errors.title}</p>}
            </div>

            {/* Work Mode & Location */}
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
                <label className="block font-semibold uppercase text-slate-300 mb-1">Location *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full rounded-xl bg-slate-800 border p-3 text-sm text-white focus:outline-none ${
                    errors.location ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                  }`}
                />
                {errors.location && <p className="text-rose-400 text-[11px] mt-1">{errors.location}</p>}
              </div>
            </div>

            {/* Stipend, Duration, Openings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold uppercase text-slate-300 mb-1">Stipend *</label>
                <input
                  type="text"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="e.g. ₹35,000 / month"
                  className={`w-full rounded-xl bg-slate-800 border p-3 text-sm text-white focus:outline-none ${
                    errors.stipend ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                  }`}
                />
                {errors.stipend && <p className="text-rose-400 text-[11px] mt-1">{errors.stipend}</p>}
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-300 mb-1">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 6 Months"
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-300 mb-1">Openings</label>
                <input
                  type="number"
                  min="1"
                  value={openings}
                  onChange={(e) => setOpenings(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Deadline */}
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
              <label className="block font-semibold uppercase text-slate-300 mb-1">Required Tech Stack Skills *</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type skill and press Enter or comma..."
                  className="flex-1 rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-medium flex items-center gap-1.5"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-400 font-bold"
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
              <label className="block font-semibold uppercase text-slate-300 mb-1">Description *</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full rounded-xl bg-slate-800 border p-3 text-sm text-white focus:outline-none ${
                  errors.description ? 'border-rose-500' : 'border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.description && <p className="text-rose-400 text-[11px] mt-1">{errors.description}</p>}
            </div>

            {/* Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
              <Button variant="secondary" size="md" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" disabled={isSubmitting} icon={Save}>
                {isSubmitting ? 'Saving Changes...' : 'Update Listing'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditInternshipModal;

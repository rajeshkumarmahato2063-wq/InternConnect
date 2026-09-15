import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, GraduationCap, BookOpen, Calendar, Code, AlertCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import PasswordInput from '../../components/Auth/PasswordInput';
import LoadingButton from '../../components/Auth/LoadingButton';
import { useAuth } from '../../context/AuthContext';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// Zod Validation Schema
const studentRegisterSchema = z
  .object({
    fullName: z.string().min(2, 'Full Name is required'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone: z.string().optional(),
    college: z.string().min(2, 'College/University name is required'),
    degree: z.string().min(2, 'Degree & Major is required'),
    graduationYear: z.coerce.number().min(2024, 'Graduation year must be valid'),
    skills: z.string().optional(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .regex(PASSWORD_REGEX, 'Password must contain at least one letter and one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

const StudentRegister = () => {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      college: '',
      degree: '',
      graduationYear: 2026,
      skills: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const skillsArray = data.skills
        ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await registerAuth(
        {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          college: data.college,
          degree: data.degree,
          graduationYear: data.graduationYear,
          skills: skillsArray,
          password: data.password,
        },
        'student'
      );

      navigate('/student/dashboard');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your information and try again.');
    }
  };

  return (
    <AuthLayout
      title="Create Student Profile"
      subtitle="Join 10,000+ candidates building AI-matched careers."
      backLink="/auth/student/login"
    >
      <div className="space-y-6">
        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1 text-xs">
            <label className="block font-semibold uppercase tracking-wider text-slate-300">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter your full name"
                {...register('fullName')}
                disabled={isSubmitting}
                className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  errors.fullName ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.fullName && <p className="text-rose-400 font-medium text-[11px]">{errors.fullName.message}</p>}
          </div>

          {/* Row: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="Enter your student email"
                  {...register('email')}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-rose-400 font-medium text-[11px]">{errors.email.message}</p>}
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  {...register('phone')}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.phone ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-rose-400 font-medium text-[11px]">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Row: College & Degree */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                College / University *
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Enter your university or college"
                  {...register('college')}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.college ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.college && <p className="text-rose-400 font-medium text-[11px]">{errors.college.message}</p>}
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Degree & Major *
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  {...register('degree')}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.degree ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.degree && <p className="text-rose-400 font-medium text-[11px]">{errors.degree.message}</p>}
            </div>
          </div>

          {/* Graduation Year & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Expected Graduation Year *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  placeholder="e.g. 2026"
                  {...register('graduationYear')}
                  disabled={isSubmitting}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.graduationYear ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.graduationYear && (
                <p className="text-rose-400 font-medium text-[11px]">{errors.graduationYear.message}</p>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Skills (Optional, comma-separated)
              </label>
              <div className="relative">
                <Code className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. React, Python, Java, SQL"
                  {...register('skills')}
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-slate-900/90 border border-slate-800 focus:border-indigo-500 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordInput
              label="Password *"
              name="password"
              placeholder="Enter password (min 6 chars)"
              register={register}
              error={errors.password}
              disabled={isSubmitting}
            />
            <PasswordInput
              label="Confirm Password *"
              name="confirmPassword"
              placeholder="Re-enter password"
              register={register}
              error={errors.confirmPassword}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <LoadingButton loading={isSubmitting} disabled={isSubmitting} type="submit" variant="primary">
              Create Student Account
            </LoadingButton>
          </div>

          {/* Redirect to login */}
          <div className="pt-2 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/auth/student/login" className="text-indigo-400 font-bold hover:underline">
              Sign In Instead
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default StudentRegister;

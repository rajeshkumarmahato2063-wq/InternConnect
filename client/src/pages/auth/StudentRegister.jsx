import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, GraduationCap, BookOpen, Calendar, AlertCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import PasswordInput from '../../components/Auth/PasswordInput';
import LoadingButton from '../../components/Auth/LoadingButton';
import { useAuth } from '../../context/AuthContext';

// Zod Validation Schema
const studentRegisterSchema = z
  .object({
    fullName: z.string().min(2, 'Full Name is required'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
    college: z.string().min(2, 'College/University name is required'),
    degree: z.string().min(2, 'Degree & Major is required'),
    graduationYear: z.coerce.number().min(2024, 'Graduation year must be valid'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
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
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerAuth(
        {
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          college: data.college,
          degree: data.degree,
          graduationYear: data.graduationYear,
        },
        'student'
      );

      navigate('/student/dashboard');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
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
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Aarav Sharma"
                {...register('fullName')}
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
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="aarav@college.edu"
                  {...register('email')}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-rose-400 font-medium text-[11px]">{errors.email.message}</p>}
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Phone Number (10 Digits)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  {...register('phone')}
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
                College / University
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="IIT Delhi"
                  {...register('college')}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.college ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.college && <p className="text-rose-400 font-medium text-[11px]">{errors.college.message}</p>}
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Degree & Major
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-blue-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="B.Tech in Computer Science"
                  {...register('degree')}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.degree ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.degree && <p className="text-rose-400 font-medium text-[11px]">{errors.degree.message}</p>}
            </div>
          </div>

          {/* Graduation Year */}
          <div className="space-y-1 text-xs">
            <label className="block font-semibold uppercase tracking-wider text-slate-300">
              Expected Graduation Year
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
              <input
                type="number"
                placeholder="2026"
                {...register('graduationYear')}
                className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  errors.graduationYear ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.graduationYear && (
              <p className="text-rose-400 font-medium text-[11px]">{errors.graduationYear.message}</p>
            )}
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordInput
              label="Password"
              name="password"
              register={register}
              error={errors.password}
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              register={register}
              error={errors.confirmPassword}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <LoadingButton loading={isSubmitting} type="submit" variant="primary">
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

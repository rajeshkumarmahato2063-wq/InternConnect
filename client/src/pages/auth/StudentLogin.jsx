import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, GraduationCap, AlertCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import PasswordInput from '../../components/Auth/PasswordInput';
import LoadingButton from '../../components/Auth/LoadingButton';
import { useAuth } from '../../context/AuthContext';

// Zod validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const StudentLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'aarav.sharma@example.com',
      password: 'password123',
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login({
        email: data.email,
        password: data.password,
        role: 'student',
        rememberMe: data.rememberMe,
      });

      navigate('/student/dashboard');
    } catch (err) {
      setServerError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Student Login"
      subtitle="Sign in to your candidate account to access internships and AI tools."
      backLink="/auth/select-role"
    >
      <div className="space-y-6">
        
        {/* Header Icon */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 mb-6">
          <GraduationCap className="w-6 h-6 shrink-0" />
          <p className="text-xs">
            Log in as <strong>Student Candidate</strong>. Switch role on the selection screen if you are a recruiter.
          </p>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1 text-xs">
            <label className="block font-semibold uppercase tracking-wider text-slate-300">
              Student Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="aarav@college.edu"
                {...register('email')}
                className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  errors.email
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
                }`}
              />
            </div>
            {errors.email && <p className="text-rose-400 font-medium text-[11px] mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <PasswordInput
            label="Password"
            name="password"
            register={register}
            error={errors.password}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/auth/forgot-password"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <LoadingButton loading={isSubmitting} type="submit" variant="primary">
            Sign In to Student Dashboard
          </LoadingButton>

          {/* Registration Redirect */}
          <div className="pt-4 text-center text-xs text-slate-400">
            Don't have a student account yet?{' '}
            <Link to="/auth/student/register" className="text-indigo-400 font-bold hover:underline">
              Create Student Profile
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default StudentLogin;

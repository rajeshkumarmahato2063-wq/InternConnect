import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Building2, AlertCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import PasswordInput from '../../components/Auth/PasswordInput';
import LoadingButton from '../../components/Auth/LoadingButton';
import { useAuth } from '../../context/AuthContext';

const companyLoginSchema = z.object({
  email: z.string().min(1, 'Official email is required').email('Enter a valid corporate email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const CompanyLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(companyLoginSchema),
    defaultValues: {
      email: 'recruiter@microsoft.com',
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
        role: 'company',
        rememberMe: data.rememberMe,
      });

      navigate('/company/dashboard');
    } catch (err) {
      setServerError(err.message || 'Invalid employer credentials');
    }
  };

  return (
    <AuthLayout
      title="Recruiter Login"
      subtitle="Access your company hiring dashboard and applicant pipeline."
      backLink="/auth/select-role"
    >
      <div className="space-y-6">
        
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 mb-6">
          <Building2 className="w-6 h-6 shrink-0" />
          <p className="text-xs">
            Log in as <strong>Employer Recruiter</strong>. Post internships and schedule technical interviews.
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
              Official Corporate Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="hr@company.com"
                {...register('email')}
                className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
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
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/auth/forgot-password"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <LoadingButton loading={isSubmitting} type="submit" variant="primary">
            Sign In to Recruiter Portal
          </LoadingButton>

          {/* Register Redirect */}
          <div className="pt-4 text-center text-xs text-slate-400">
            Need an employer account?{' '}
            <Link to="/auth/company/register" className="text-purple-400 font-bold hover:underline">
              Register Employer Organization
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default CompanyLogin;

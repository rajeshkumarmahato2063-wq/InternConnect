import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Globe, MapPin, Users, User, ShieldCheck, AlertCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import PasswordInput from '../../components/Auth/PasswordInput';
import LoadingButton from '../../components/Auth/LoadingButton';
import { useAuth } from '../../context/AuthContext';

const companyRegisterSchema = z
  .object({
    companyName: z.string().min(2, 'Company name is required'),
    email: z.string().min(1, 'Official email is required').email('Enter a valid corporate email'),
    website: z.string().url('Enter a valid website URL (e.g. https://company.com)'),
    industry: z.string().min(2, 'Industry type is required'),
    companySize: z.string().min(1, 'Company size is required'),
    location: z.string().min(2, 'Headquarters location is required'),
    hrName: z.string().min(2, 'HR Contact Name is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const CompanyRegister = () => {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(companyRegisterSchema),
    defaultValues: {
      companyName: '',
      email: '',
      website: 'https://',
      industry: 'Enterprise Software & Cloud',
      companySize: '50-200 employees',
      location: '',
      hrName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerAuth(
        {
          companyName: data.companyName,
          email: data.email,
          website: data.website,
          industry: data.industry,
          companySize: data.companySize,
          location: data.location,
          name: data.hrName,
        },
        'company'
      );

      navigate('/company/dashboard');
    } catch (err) {
      setServerError(err.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      title="Register Employer Account"
      subtitle="Recruit top university candidates across India."
      backLink="/auth/company/login"
    >
      <div className="space-y-6">
        
        {/* Verification Alert Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Employer Verification Notice</p>
            <p className="text-amber-200/80 mt-0.5">
              Your company account will be verified by an administrator before issuing your official partner badge.
            </p>
          </div>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Company Name */}
          <div className="space-y-1 text-xs">
            <label className="block font-semibold uppercase tracking-wider text-slate-300">
              Company Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="TechCorp Innovations"
                {...register('companyName')}
                className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  errors.companyName ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.companyName && <p className="text-rose-400 font-medium text-[11px]">{errors.companyName.message}</p>}
          </div>

          {/* Row: Email & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Official Corporate Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="hr@techcorp.com"
                  {...register('email')}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-rose-400 font-medium text-[11px]">{errors.email.message}</p>}
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Company Website URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  placeholder="https://techcorp.com"
                  {...register('website')}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                    errors.website ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                  }`}
                />
              </div>
              {errors.website && <p className="text-rose-400 font-medium text-[11px]">{errors.website.message}</p>}
            </div>
          </div>

          {/* Row: Industry & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Industry Sector
              </label>
              <input
                type="text"
                placeholder="Enterprise Software / FinTech"
                {...register('industry')}
                className={`w-full rounded-xl bg-slate-900/90 border p-3 text-sm text-white focus:outline-none transition-all ${
                  errors.industry ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                }`}
              />
              {errors.industry && <p className="text-rose-400 font-medium text-[11px]">{errors.industry.message}</p>}
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Company Size
              </label>
              <select
                {...register('companySize')}
                className="w-full rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-sm text-white focus:outline-none"
              >
                <option value="1-10 employees">1-10 employees (Startup)</option>
                <option value="11-50 employees">11-50 employees</option>
                <option value="51-200 employees">51-200 employees</option>
                <option value="500+ employees">500+ employees (Enterprise)</option>
              </select>
            </div>
          </div>

          {/* Row: Location & HR Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                Headquarters Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Bengaluru, India"
                  {...register('location')}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-all ${
                    errors.location ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                  }`}
                />
              </div>
              {errors.location && <p className="text-rose-400 font-medium text-[11px]">{errors.location.message}</p>}
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold uppercase tracking-wider text-slate-300">
                HR Contact / Recruiter Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Sarah Jenkins"
                  {...register('hrName')}
                  className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-all ${
                    errors.hrName ? 'border-rose-500' : 'border-slate-800 focus:border-purple-500'
                  }`}
                />
              </div>
              {errors.hrName && <p className="text-rose-400 font-medium text-[11px]">{errors.hrName.message}</p>}
            </div>
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

          <div className="pt-3">
            <LoadingButton loading={isSubmitting} type="submit" variant="primary">
              Register Employer Organization
            </LoadingButton>
          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            Already have an employer account?{' '}
            <Link to="/auth/company/login" className="text-purple-400 font-bold hover:underline">
              Sign In Here
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default CompanyRegister;

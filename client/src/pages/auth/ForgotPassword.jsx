import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import LoadingButton from '../../components/Auth/LoadingButton';
import { emailService } from '../../services/emailService';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Enter a valid email address'),
});

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setSentEmail(data.email);
    await emailService.sendPasswordResetEmail(data.email);
    setSubmitted(true);
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your account email address and we’ll send you a password recovery link."
      backLink="/auth/select-role"
    >
      {submitted ? (
        <div className="py-8 text-center flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-white">Recovery Email Sent!</h3>
          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
            If an account exists with <span className="font-mono text-indigo-300 font-bold">{sentEmail}</span>, password reset instructions have been sent. Please check your inbox.
          </p>
          <Link
            to="/auth/select-role"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Role Selection
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1 text-xs">
            <label className="block font-semibold uppercase tracking-wider text-slate-300">
              Account Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="your.email@example.com"
                {...register('email')}
                className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.email && <p className="text-rose-400 font-medium text-[11px] mt-1">{errors.email.message}</p>}
          </div>

          <LoadingButton loading={isSubmitting} type="submit" variant="primary">
            Send Reset Instructions
          </LoadingButton>

          <div className="pt-2 text-center text-xs text-slate-400">
            Remembered your password?{' '}
            <Link to="/auth/select-role" className="text-indigo-400 font-bold hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;

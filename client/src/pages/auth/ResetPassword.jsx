import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, ArrowLeft } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import LoadingButton from '../../components/Auth/LoadingButton';
import PasswordInput from '../../components/Auth/PasswordInput';
import { emailService } from '../../services/emailService';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const ResetPassword = () => {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    setErrorMessage('');
    const result = await emailService.updatePassword(data.password);
    if (result.success) {
      setSuccess(true);
    } else {
      setErrorMessage(result.error || 'Failed to reset password');
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Choose a strong, secure password for your InternConnect AI account."
      backLink="/auth/select-role"
    >
      {success ? (
        <div className="py-8 text-center flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-white">Password Updated Successfully!</h3>
          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
            Your password has been reset. You can now log in using your new credentials.
          </p>
          <button
            onClick={() => navigate('/auth/select-role')}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg mt-2 transition-all"
          >
            Go to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <PasswordInput
            label="New Password"
            placeholder="••••••••"
            register={register('password')}
            error={errors.password}
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="••••••••"
            register={register('confirmPassword')}
            error={errors.confirmPassword}
          />

          <LoadingButton loading={isSubmitting} type="submit" variant="primary">
            Update Password & Login
          </LoadingButton>

          <div className="pt-2 text-center text-xs text-slate-400">
            <Link to="/auth/select-role" className="text-indigo-400 font-bold hover:underline">
              Back to Role Selection
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;

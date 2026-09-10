import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, RefreshCw, ArrowLeft, ShieldAlert } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/Button/Button';
import { emailService } from '../../services/emailService';
import { useAuth } from '../../context/AuthContext';

const VerifyEmail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const targetEmail = user?.email || 'student@university.edu';

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    setResending(true);
    await emailService.sendVerificationEmail(targetEmail);
    setResending(false);
    setResendSuccess(true);
    setCanResend(false);
    setResendTimer(60);
    setTimeout(() => setResendSuccess(false), 4000);
  };

  return (
    <AuthLayout
      title="Verify Your Email Address"
      subtitle="We sent a confirmation link to your email. Verify to unlock your candidate dashboard."
      backLink="/auth/select-role"
    >
      <div className="py-6 text-center space-y-6">
        {/* Animated Mail Icon */}
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-xl animate-pulse">
          <Mail className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Check Your Inbox</h3>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            A confirmation link was sent to{' '}
            <span className="font-mono text-indigo-300 font-bold">{targetEmail}</span>. Please click the link to activate your account.
          </p>
        </div>

        {/* Resend Status Messages */}
        {resendSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Verification email resent successfully!</span>
          </div>
        )}

        {/* Resend Actions & Timer */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={handleResend}
            disabled={!canResend || resending}
            icon={resending ? RefreshCw : Mail}
            className="border-indigo-500/30 text-indigo-300 font-bold"
          >
            {resending
              ? 'Sending Verification Email...'
              : canResend
              ? 'Resend Verification Email'
              : `Resend Email in ${resendTimer}s`}
          </Button>

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => navigate('/student/dashboard')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 font-bold"
          >
            I've Verified My Email — Continue to Dashboard
          </Button>
        </div>

        <div className="pt-2 text-xs text-slate-400">
          Need help?{' '}
          <Link to="/auth/select-role" className="text-indigo-400 font-bold hover:underline">
            Back to Role Selection
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;

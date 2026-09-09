import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = ({
  label = 'Password',
  placeholder = '••••••••',
  register,
  name = 'password',
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1 text-xs">
      {label && (
        <label className="block font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <Lock className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          {...(register ? register(name) : {})}
          {...props}
          className={`w-full rounded-xl bg-slate-900/90 border pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
            error
              ? 'border-rose-500/80 focus:ring-1 focus:ring-rose-500'
              : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-rose-400 font-medium text-[11px] mt-1">{error.message}</p>}
    </div>
  );
};

export default PasswordInput;

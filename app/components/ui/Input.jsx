import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Input({ 
  label, 
  error, 
  className,
  required,
  type = 'text',
  icon,
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          className={clsx(
            'w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 bg-white/50 backdrop-blur-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',
            error && 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50',
            icon && 'pl-10',
            type === 'password' && 'pr-10',
            focused && 'shadow-lg shadow-blue-500/10 -translate-y-0.5',
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 font-medium animate-shake">
          {error}
        </p>
      )}
    </div>
  );
}

import clsx from 'clsx';

export default function Badge({ children, variant = 'default', className, pulse = false }) {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-blue-100 text-blue-800 border-blue-200',
    info: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  };

  return (
    <span className={clsx(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
      variants[variant],
      pulse && 'animate-pulse',
      className
    )}>
      {pulse && variant === 'pending' && (
        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-ping"></span>
      )}
      {children}
    </span>
  );
}

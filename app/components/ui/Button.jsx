import clsx from 'clsx';
import Link from 'next/link';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  disabled,
  href,
  loading,
  icon,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer transform active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5',
    secondary: 'bg-white border border-slate-200 text-slate-700 shadow-md hover:shadow-lg hover:bg-slate-50 hover:-translate-y-0.5',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg',
    ghost: 'text-slate-600 hover:text-blue-600 hover:bg-blue-50',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:shadow-red-500/25'
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm rounded-lg',
    md: 'h-11 px-6 text-base rounded-xl',
    lg: 'h-14 px-8 text-lg rounded-xl',
    xl: 'h-16 px-10 text-xl rounded-2xl'
  };

  const buttonClasses = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    loading && 'opacity-70 cursor-wait',
    className
  );

  const content = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
}

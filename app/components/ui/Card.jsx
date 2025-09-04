'use client';

export default function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  ...props 
}) {
  const baseClasses = 'rounded-xl border shadow-lg';
  
  const variants = {
    default: 'bg-gray-800 border-gray-700 text-white',
    primary: 'bg-gradient-to-br from-blue-900 to-blue-800 border-blue-600 text-white',
    secondary: 'bg-gradient-to-br from-green-900 to-green-800 border-green-600 text-white',
    accent: 'bg-gradient-to-br from-orange-900 to-orange-800 border-orange-600 text-white'
  };
  
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-200' : '';
  
  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

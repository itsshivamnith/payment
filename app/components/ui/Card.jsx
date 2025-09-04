export default function Card({ 
  children, 
  className = '', 
  hover = false,
  gradient = false,
  ...props 
}) {
  return (
    <div 
      className={`
        bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''}
        ${gradient ? 'bg-gradient-to-br from-white to-slate-50/50' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

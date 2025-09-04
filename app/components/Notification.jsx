'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const styles = {
  success: 'bg-green-900 border-green-700 text-green-100',
  error: 'bg-red-900 border-red-700 text-red-100',
  warning: 'bg-orange-900 border-orange-700 text-orange-100',
  info: 'bg-blue-900 border-blue-700 text-blue-100'
};

export default function Notification({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  autoClose = 5000,
  className = '' 
}) {
  const [visible, setVisible] = useState(true);
  const Icon = icons[type];

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }, autoClose);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 max-w-md w-full z-50 transform transition-all duration-300 ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className={`p-4 rounded-lg border shadow-lg ${styles[type]} ${className}`}>
        <div className="flex items-start">
          <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            {title && <h4 className="text-sm font-medium mb-1">{title}</h4>}
            {message && <p className="text-sm opacity-90">{message}</p>}
          </div>
          {onClose && (
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onClose, 300);
              }}
              className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

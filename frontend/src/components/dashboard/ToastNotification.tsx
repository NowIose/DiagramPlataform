import { useEffect } from 'react';

export interface ToastProps {
  title: string;
  message: string;
  icon: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function ToastNotification({ title, message, icon, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div 
      className={`fixed bottom-6 right-6 max-w-md bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 transform transition-all duration-300 z-50 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}
      id="action-toast"
    >
      <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">{icon}</span>
      <div className="text-xs">
        <p className="font-semibold">{title}</p>
        <p className="text-inverse-on-surface/80 text-[11px]">{message}</p>
      </div>
      <button 
        className="ml-auto text-inverse-on-surface/60 hover:text-inverse-on-surface" 
        onClick={onClose} 
        type="button"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}

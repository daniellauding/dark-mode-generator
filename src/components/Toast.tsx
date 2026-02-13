import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  action?: { label: string; onClick: () => void };
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, action, onDismiss, duration = 6000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 200);
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-dark-700 border border-dark-600 shadow-2xl transition-all duration-200 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      role="status"
    >
      <span className="text-sm text-dark-200">{message}</span>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-medium text-primary-400 hover:text-primary-300 whitespace-nowrap transition-colors cursor-pointer"
        >
          {action.label}
        </button>
      )}
      <button
        onClick={handleDismiss}
        className="p-0.5 text-dark-500 hover:text-dark-300 transition-colors cursor-pointer shrink-0"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

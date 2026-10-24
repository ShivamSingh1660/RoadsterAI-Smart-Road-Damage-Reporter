import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, AlertTriangle, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'border-emerald-200 bg-white text-stone-900 shadow-lg',
  error: 'border-red-200 bg-white text-stone-900 shadow-lg',
  warning: 'border-amber-200 bg-white text-stone-900 shadow-lg',
  info: 'border-sky-200 bg-white text-stone-900 shadow-lg',
};

const iconColors = {
  success: 'text-emerald-600',
  error: 'text-red-600',
  warning: 'text-amber-600',
  info: 'text-sky-600',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${colors[toast.type]}`}
            >
              <Icon size={18} className={iconColors[toast.type]} />
              <span className="text-sm text-text-primary flex-1">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

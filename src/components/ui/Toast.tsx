import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import type { Toast as ToastType } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  error: <XCircle size={16} />,
  info: <Info size={16} />,
};

const colors = {
  success: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', border: '#b8e0cc' },
  warning: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: '#eed9a8' },
  error: { bg: 'var(--color-error-bg)', color: 'var(--color-error)', border: '#f0bfbf' },
  info: { bg: 'var(--color-info-bg)', color: 'var(--color-info)', border: '#b8c9ee' },
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => (
  <div
    style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      zIndex: 1000,
    }}
    aria-live="polite"
    aria-label="Notifications"
  >
    {toasts.map((t) => {
      const c = colors[t.type];
      return (
        <div
          key={t.id}
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            background: c.bg,
            color: c.color,
            border: `1px solid ${c.border}`,
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            fontSize: 14,
            maxWidth: 340,
            animation: 'fadeInUp 0.2s ease',
          }}
        >
          {icons[t.type]}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => onRemove(t.id)}
            aria-label="Dismiss"
            style={{ color: c.color, opacity: 0.7, display: 'flex', alignItems: 'center' }}
          >
            <X size={14} />
          </button>
        </div>
      );
    })}
    <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
);

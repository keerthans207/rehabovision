import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      gap: 12,
      textAlign: 'center',
    }}
  >
    {icon && (
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
          marginBottom: 4,
        }}
      >
        {icon}
      </div>
    )}
    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</h3>
    {description && (
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', maxWidth: 320, lineHeight: 1.6 }}>
        {description}
      </p>
    )}
    {action && (
      <div style={{ marginTop: 8 }}>
        <Button onClick={action.onClick}>{action.label}</Button>
      </div>
    )}
  </div>
);

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div
        key={i}
        style={{
          height: 56,
          background: 'linear-gradient(90deg, #f0f3f2 25%, #e8eded 50%, #f0f3f2 75%)',
          backgroundSize: '200% 100%',
          borderRadius: 'var(--radius-md)',
          animation: 'shimmer 1.4s infinite',
        }}
      />
    ))}
    <style>{`
      @keyframes shimmer {
        from { background-position: 200% 0; }
        to   { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

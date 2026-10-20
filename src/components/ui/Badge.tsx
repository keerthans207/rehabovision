import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const styles: Record<BadgeVariant, React.CSSProperties> = {
  success: { background: 'var(--color-success-bg)', color: 'var(--color-success)' },
  warning: { background: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
  error: { background: 'var(--color-error-bg)', color: 'var(--color-error)' },
  info: { background: 'var(--color-info-bg)', color: 'var(--color-info)' },
  neutral: { background: '#F0F3F2', color: 'var(--color-text-secondary)' },
  primary: { background: 'var(--color-primary-light)', color: 'var(--color-primary)' },
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, icon }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 9px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      lineHeight: '20px',
      whiteSpace: 'nowrap',
      ...styles[variant],
    }}
  >
    {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
    {children}
  </span>
);

export function qualityBadge(q: 'good' | 'uncertain' | 'unavailable') {
  const map = {
    good: { variant: 'success' as BadgeVariant, label: 'Reliable' },
    uncertain: { variant: 'warning' as BadgeVariant, label: 'Uncertain' },
    unavailable: { variant: 'error' as BadgeVariant, label: 'Unavailable' },
  };
  return map[q];
}

export function reviewBadge(r: 'reviewed' | 'pending' | 'flagged') {
  const map = {
    reviewed: { variant: 'success' as BadgeVariant, label: 'Reviewed' },
    pending: { variant: 'info' as BadgeVariant, label: 'Pending' },
    flagged: { variant: 'error' as BadgeVariant, label: 'Flagged' },
  };
  return map[r];
}

export function statusBadge(s: 'active' | 'inactive' | 'on-hold') {
  const map = {
    active: { variant: 'success' as BadgeVariant, label: 'Active' },
    inactive: { variant: 'neutral' as BadgeVariant, label: 'Inactive' },
    'on-hold': { variant: 'warning' as BadgeVariant, label: 'On Hold' },
  };
  return map[s];
}

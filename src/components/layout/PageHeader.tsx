import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  meta?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action, meta }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 28,
      gap: 16,
      flexWrap: 'wrap',
    }}
  >
    <div>
      {meta && (
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{meta}</p>
      )}
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', marginTop: 6 }}>{subtitle}</p>
      )}
    </div>
    {action && <div style={{ flexShrink: 0 }}>{action}</div>}
  </div>
);

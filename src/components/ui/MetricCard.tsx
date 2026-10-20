import React from 'react';
import { Card } from './Card';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  accent?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, subtext, icon, accent }) => (
  <Card padding={20}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: 8 }}>
          {label}
        </p>
        <p style={{ fontSize: 28, fontWeight: 700, color: accent || 'var(--color-text-primary)', lineHeight: 1 }}>
          {value}
        </p>
        {subtext && (
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 6 }}>{subtext}</p>
        )}
      </div>
      {icon && (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
    </div>
  </Card>
);

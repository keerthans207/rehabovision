import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--color-primary)',
    color: '#fff',
    border: '1.5px solid var(--color-primary)',
  },
  secondary: {
    background: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    border: '1.5px solid var(--color-border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1.5px solid transparent',
  },
  danger: {
    background: 'var(--color-error-bg)',
    color: 'var(--color-error)',
    border: '1.5px solid var(--color-error)',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '5px 12px', fontSize: 13, borderRadius: 'var(--radius-sm)' },
  md: { padding: '8px 16px', fontSize: 14, borderRadius: 'var(--radius-md)' },
  lg: { padding: '11px 22px', fontSize: 15, borderRadius: 'var(--radius-md)' },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading,
  fullWidth,
  children,
  style,
  disabled,
  ...props
}) => (
  <button
    disabled={disabled || loading}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      fontWeight: 500,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.55 : 1,
      transition: 'background 0.15s, opacity 0.15s',
      whiteSpace: 'nowrap',
      width: fullWidth ? '100%' : undefined,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    }}
    onMouseOver={(e) => {
      if (!disabled && !loading && variant === 'primary') {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary-hover)';
      }
    }}
    onMouseOut={(e) => {
      if (!disabled && !loading && variant === 'primary') {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-primary)';
      }
    }}
    {...props}
  >
    {icon && iconPosition === 'left' && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
    {loading ? 'Loading…' : children}
    {icon && iconPosition === 'right' && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
  </button>
);

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, hint, icon, id, style, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={inputId}
          style={{
            width: '100%',
            padding: icon ? '9px 12px 9px 34px' : '9px 12px',
            fontSize: 14,
            color: 'var(--color-text-primary)',
            background: 'var(--color-surface)',
            border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            transition: 'border-color 0.15s',
            ...style,
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'var(--color-primary)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
          }}
          {...props}
        />
      </div>
      {error && <p style={{ fontSize: 12, color: 'var(--color-error)' }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{hint}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, hint, id, style, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        style={{
          width: '100%',
          padding: '9px 12px',
          fontSize: 14,
          color: 'var(--color-text-primary)',
          background: 'var(--color-surface)',
          border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          resize: 'vertical',
          minHeight: 80,
          transition: 'border-color 0.15s',
          fontFamily: 'inherit',
          ...style,
        }}
        onFocus={(e) => {
          (e.target as HTMLTextAreaElement).style.borderColor = 'var(--color-primary)';
        }}
        onBlur={(e) => {
          (e.target as HTMLTextAreaElement).style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
        }}
        {...props}
      />
      {error && <p style={{ fontSize: 12, color: 'var(--color-error)' }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{hint}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, id, style, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {label}
        </label>
      )}
      <select
        id={inputId}
        style={{
          width: '100%',
          padding: '9px 12px',
          fontSize: 14,
          color: 'var(--color-text-primary)',
          background: 'var(--color-surface)',
          border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          cursor: 'pointer',
          ...style,
        }}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p style={{ fontSize: 12, color: 'var(--color-error)' }}>{error}</p>}
    </div>
  );
};

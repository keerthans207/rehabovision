import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../ui/Toast';
import { useToast } from '../../hooks/useToast';
import type { UserRole } from '../../types';

interface AppLayoutProps {
  role: UserRole;
  userName: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ role, userName }) => {
  const navigate = useNavigate();
  const { toasts, removeToast } = useToast();

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar role={role} userName={userName} onSignOut={handleSignOut} />
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px 32px',
          maxWidth: 1200,
        }}
      >
        <Outlet />
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

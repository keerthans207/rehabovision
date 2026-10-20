import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  Activity,
  Dumbbell,
  TrendingUp,
  User,
} from 'lucide-react';
import type { UserRole } from '../../types';

interface SidebarProps {
  role: UserRole;
  userName: string;
  onSignOut: () => void;
}

const physioNav = [
  { to: '/physio/overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { to: '/physio/patients', label: 'Patients', icon: <Users size={18} /> },
  { to: '/physio/protocols', label: 'Exercise Protocols', icon: <ClipboardList size={18} /> },
  { to: '/physio/sessions', label: 'Sessions', icon: <Calendar size={18} /> },
  { to: '/physio/progress', label: 'Progress Reports', icon: <BarChart2 size={18} /> },
  { to: '/physio/settings', label: 'Settings', icon: <Settings size={18} /> },
];

const patientNav = [
  { to: '/patient/exercises', label: 'My Exercises', icon: <Dumbbell size={18} /> },
  { to: '/patient/sessions', label: 'My Sessions', icon: <Activity size={18} /> },
  { to: '/patient/progress', label: 'My Progress', icon: <TrendingUp size={18} /> },
  { to: '/patient/profile', label: 'Profile', icon: <User size={18} /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ role, userName, onSignOut }) => {
  const [collapsed, setCollapsed] = useState(false);
  const nav = role === 'physio' ? physioNav : patientNav;

  return (
    <aside
      style={{
        width: collapsed ? 64 : 240,
        minHeight: '100vh',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '20px 0' : '20px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: '1px solid var(--color-border)',
          justifyContent: collapsed ? 'center' : 'flex-start',
          minHeight: 65,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Activity size={18} color="#fff" />
        </div>
        {!collapsed && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
              RehaboVision
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 500 }}>AI</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 8px' }} aria-label="Main navigation">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '10px 0' : '10px 12px',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              background: isActive ? 'var(--color-primary-light)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              marginBottom: 2,
              transition: 'background 0.12s, color 0.12s',
              justifyContent: collapsed ? 'center' : 'flex-start',
              textDecoration: 'none',
            })}
          >
            <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: profile + sign out */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--color-border)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '8px 0' : '8px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {userName.charAt(0)}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userName}
              </p>
              <p style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
                {role === 'physio' ? 'Physiotherapist' : 'Patient'}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onSignOut}
          aria-label="Sign out"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: collapsed ? '8px 0' : '8px 12px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-secondary)',
            fontSize: 13,
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'color 0.12s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-error)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign out</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: collapsed ? '8px 0' : '8px 12px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-secondary)',
            fontSize: 13,
            justifyContent: collapsed ? 'center' : 'flex-start',
            marginTop: 2,
          }}
        >
          <ChevronLeft
            size={16}
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

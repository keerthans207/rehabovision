import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #E8F4F3 0%, #F7F9FA 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: 480, width: '100%' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={32} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1 }}>
              RehaboVision
            </h1>
            <p style={{ fontSize: 16, color: 'var(--color-primary)', fontWeight: 600, marginTop: 2 }}>AI</p>
          </div>
        </div>

        {/* Welcome card */}
        <Card padding={32} style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            Welcome to RehaboVision AI
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            Computer-vision-assisted rehabilitation. Track movement, measure progress, and support recovery with confidence.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Button
              size="lg"
              fullWidth
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              onClick={() => navigate('/physio/overview')}
            >
              Continue as Physiotherapist
            </Button>
            <Button
              size="lg"
              fullWidth
              variant="secondary"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              onClick={() => navigate('/patient/exercises')}
            >
              Continue as Patient
            </Button>
          </div>
        </Card>

        {/* Info note */}
        <div
          style={{
            padding: '16px 20px',
            background: 'var(--color-info-bg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #b8c9ee',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--color-info)', lineHeight: 1.6 }}>
            This is an interactive prototype. In production, authentication would be required before accessing patient data.
          </p>
        </div>

        {/* Footer note */}
        <p
          style={{
            fontSize: 12,
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            marginTop: 32,
            lineHeight: 1.6,
          }}
        >
          RehaboVision AI supports physiotherapist-led rehabilitation.<br />
          It does not diagnose injuries or autonomously prescribe treatment.
        </p>
      </div>
    </div>
  );
};

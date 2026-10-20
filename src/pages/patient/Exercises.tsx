import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, Activity } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockProtocols } from '../../data/mock';

export const Exercises: React.FC = () => {
  const navigate = useNavigate();
  const assignedProtocol = mockProtocols[0];

  return (
    <div>
      <PageHeader
        title="My Exercises"
        subtitle="Your current rehabilitation program."
      />

      {/* Current protocol */}
      <Card padding={28} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{assignedProtocol.name}</h2>
              <Badge variant="primary">Active</Badge>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              Assigned by Dr. Sarah Chen
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 14,
            marginBottom: 20,
            padding: '16px 0',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Exercise</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{assignedProtocol.exercise}</p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Repetitions</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{assignedProtocol.prescribedReps}</p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Sets</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{assignedProtocol.sets}</p>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Instructions</h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            {assignedProtocol.instructions}
          </p>
        </div>

        {assignedProtocol.restrictions && (
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--color-warning-bg)',
              border: '1px solid #eed9a8',
              borderRadius: 'var(--radius-md)',
              marginBottom: 20,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-warning)', marginBottom: 4 }}>
              Important restrictions
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-warning)', lineHeight: 1.6 }}>
              {assignedProtocol.restrictions}
            </p>
          </div>
        )}

        <Button
          icon={<Play size={16} />}
          size="lg"
          onClick={() => navigate('/patient/live-session')}
        >
          Start Exercise Session
        </Button>
      </Card>

      {/* Quick tips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <Card padding={20}>
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
              marginBottom: 12,
            }}
          >
            <Activity size={20} />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Before you start</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Ensure your camera is working and you have enough space to move freely. Position yourself so your full body is visible.
          </p>
        </Card>

        <Card padding={20}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-info-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-info)',
              marginBottom: 12,
            }}
          >
            <Clock size={20} />
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Session length</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Plan for approximately 15–20 minutes. You can pause or end the session at any time if needed.
          </p>
        </Card>
      </div>
    </div>
  );
};

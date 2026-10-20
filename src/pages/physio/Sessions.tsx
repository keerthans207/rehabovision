import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Badge, qualityBadge, reviewBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockSessions } from '../../data/mock';

export const Sessions: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Sessions" subtitle="All recorded rehabilitation sessions." />
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 80px', padding: '12px 24px', borderBottom: '1px solid var(--color-border)', background: '#FAFBFB' }}>
          {['Patient', 'Exercise', 'Date', 'Quality', 'Status', ''].map((h) => (
            <p key={h} style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</p>
          ))}
        </div>
        {mockSessions.length === 0 ? (
          <EmptyState title="No sessions recorded" description="Sessions appear here after patients complete exercises." />
        ) : (
          mockSessions.map((s) => {
            const qb = qualityBadge(s.measurementQuality);
            const rb = reviewBadge(s.reviewStatus);
            return (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 80px', padding: '14px 24px', borderBottom: '1px solid var(--color-border)', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 500 }}>{s.patientName}</p>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{s.exercise}</p>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                <Badge variant={qb.variant}>{qb.label}</Badge>
                <Badge variant={rb.variant}>{rb.label}</Badge>
                <Button size="sm" variant="ghost" icon={<ArrowRight size={14} />} iconPosition="right" onClick={() => navigate(`/physio/sessions/${s.id}`)}>View</Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

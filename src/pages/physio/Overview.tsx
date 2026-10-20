import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { MetricCard } from '../../components/ui/MetricCard';
import { Card } from '../../components/ui/Card';
import { Badge, qualityBadge, reviewBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockSessions, mockPatientsToReview } from '../../data/mock';

const today = new Date().toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

export const Overview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Your rehabilitation practice at a glance."
        meta={today}
        action={<Button onClick={() => navigate('/physio/patients/add')}>Add Patient</Button>}
      />

      {/* Summary metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <MetricCard
          label="Active Patients"
          value={5}
          subtext="Across 2 physiotherapists"
          icon={<Users size={20} />}
        />
        <MetricCard
          label="Sessions This Week"
          value={3}
          subtext="Mon 14 – Sun 20 Oct"
          icon={<Calendar size={20} />}
        />
        <MetricCard
          label="Reports Awaiting Review"
          value={2}
          subtext="1 flagged, 1 pending"
          icon={<FileText size={20} />}
          accent="var(--color-warning)"
        />
      </div>

      {/* Main two-column content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent Sessions */}
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div
            style={{
              padding: '20px 24px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Recent Sessions</h2>
            <button
              onClick={() => navigate('/physio/sessions')}
              style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          {mockSessions.length === 0 ? (
            <EmptyState
              title="No recent sessions"
              description="Sessions will appear here after patients complete their exercises."
            />
          ) : (
            <div>
              {mockSessions.map((s) => {
                const qb = qualityBadge(s.measurementQuality);
                const rb = reviewBadge(s.reviewStatus);
                return (
                  <div
                    key={s.id}
                    style={{
                      padding: '14px 24px',
                      borderBottom: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{s.patientName}</p>
                      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                        {s.exercise} · {new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <Badge variant={qb.variant}>{qb.label}</Badge>
                      <Badge variant={rb.variant}>{rb.label}</Badge>
                      <button
                        onClick={() => navigate(`/physio/sessions/${s.id}`)}
                        aria-label={`View session for ${s.patientName}`}
                        style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Patients to Review */}
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div
            style={{
              padding: '20px 24px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Patients to Review</h2>
            {mockPatientsToReview.length > 0 && (
              <Badge variant="warning" icon={<AlertCircle size={12} />}>
                {mockPatientsToReview.length}
              </Badge>
            )}
          </div>

          {mockPatientsToReview.length === 0 ? (
            <EmptyState
              icon={<FileText size={24} />}
              title="No outstanding reviews"
              description="All patient records are up to date."
            />
          ) : (
            <div>
              {mockPatientsToReview.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{p.identifier}</p>
                    <p style={{ fontSize: 13, color: 'var(--color-warning)' }}>{p.reason}</p>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                      Last: {new Date(p.lastSession).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/physio/patients/${p.id}`)}
                    >
                      Open
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

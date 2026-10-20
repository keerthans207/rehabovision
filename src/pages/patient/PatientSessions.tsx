import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge, qualityBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockSessions } from '../../data/mock';

export const PatientSessions: React.FC = () => {
  const navigate = useNavigate();
  const mySessions = mockSessions.filter((s) => s.patientId === 'p1');

  return (
    <div>
      <PageHeader title="My Sessions" subtitle="Your exercise session history." />

      {mySessions.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Calendar size={24} />}
            title="No sessions yet"
            description="Your completed exercise sessions will appear here."
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mySessions.map((s) => {
            const qb = qualityBadge(s.measurementQuality);
            return (
              <Card
                key={s.id}
                padding={0}
                hoverable
                onClick={() => navigate(`/patient/sessions/${s.id}`)}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr',
                    alignItems: 'center',
                    padding: '18px 24px',
                    gap: 16,
                  }}
                >
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>
                      {new Date(s.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                      {new Date(s.date).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{s.exercise}</p>
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 2 }}>
                      Completed
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>
                      {s.completedReps}/{s.prescribedReps}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 2 }}>
                      Duration
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{s.duration} min</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Badge variant={qb.variant}>{qb.label}</Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

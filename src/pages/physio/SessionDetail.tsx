import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge, qualityBadge, reviewBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockSessions } from '../../data/mock';

const qualityColor = (q: string) => {
  if (q === 'good') return 'var(--color-primary)';
  if (q === 'uncertain') return 'var(--color-warning)';
  return '#D1D8D7';
};

export const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const session = mockSessions.find((s) => s.id === id);

  if (!session) {
    return (
      <EmptyState
        title="Session not found"
        description="This session record does not exist or has been removed."
        action={{ label: 'Back to sessions', onClick: () => navigate('/physio/sessions') }}
      />
    );
  }

  const qb = qualityBadge(session.measurementQuality);
  const rb = reviewBadge(session.reviewStatus);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 20 }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Session Summary</h1>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Patient:</strong> {session.patientName}
              </p>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Exercise:</strong> {session.exercise}
              </p>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Date:</strong>{' '}
                {new Date(session.date).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Duration:</strong> {session.duration} min
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge variant={qb.variant}>{qb.label}</Badge>
            <Badge variant={rb.variant}>{rb.label}</Badge>
          </div>
        </div>
      </div>

      {/* Summary metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Prescribed reps', value: session.prescribedReps },
          { label: 'Completed reps', value: session.completedReps },
          { label: 'Measurement coverage', value: `${session.measurementCoverage}%` },
          { label: 'Discomfort reported', value: session.discomfortReported ? 'Yes' : 'No', accent: session.discomfortReported ? 'var(--color-warning)' : undefined },
        ].map((m) => (
          <Card key={m.label} padding={18}>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>{m.label}</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: m.accent || 'var(--color-text-primary)' }}>{m.value}</p>
          </Card>
        ))}
      </div>

      {/* Rep-by-rep chart */}
      <Card padding={24} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Knee Angle by Repetition</h2>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
          Peak observed flexion angle per repetition · Color indicates measurement reliability
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={session.angles} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EBE9" vertical={false} />
            <XAxis dataKey="rep" tick={{ fontSize: 12, fill: '#647572' }} tickLine={false} label={{ value: 'Rep', position: 'insideBottom', offset: -2, fontSize: 12, fill: '#647572' }} />
            <YAxis tick={{ fontSize: 11, fill: '#647572' }} tickLine={false} axisLine={false} unit="°" width={36} domain={[40, 140]} />
            <Tooltip
              formatter={(v: number, _, props: any) => [`${v}°`, 'Peak angle']}
              contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid var(--color-border)' }}
            />
            <Bar dataKey="peakAngle" radius={[4, 4, 0, 0]}>
              {session.angles.map((a, i) => (
                <Cell key={i} fill={qualityColor(a.quality)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          {[
            { color: 'var(--color-primary)', label: 'Reliable' },
            { color: 'var(--color-warning)', label: 'Uncertain' },
            { color: '#D1D8D7', label: 'Unavailable' },
          ].map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </Card>

      {/* AI summary */}
      {session.aiSummary && (
        <Card padding={24} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Session Notes</h2>
            <Badge variant="neutral">Automated summary — review before clinical use</Badge>
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{session.aiSummary}</p>
          {session.discomfortReported && (
            <div
              style={{
                marginTop: 16,
                padding: '12px 16px',
                background: 'var(--color-warning-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #eed9a8',
                fontSize: 14,
                color: 'var(--color-warning)',
              }}
            >
              ⚠ Patient reported discomfort during this session. Clinical review is recommended before the next session.
            </div>
          )}
        </Card>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button onClick={() => navigate(`/physio/patients/${session.patientId}`)} variant="secondary" icon={<User size={14} />}>
          Patient Profile
        </Button>
        <Button>Mark as Reviewed</Button>
      </div>
    </div>
  );
};

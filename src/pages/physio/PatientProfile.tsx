import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit, Activity, CheckCircle, AlertTriangle,
  XCircle, Plus, Send,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge, qualityBadge, reviewBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockPatients, mockSessions, mockProgressData, mockClinicalNotes } from '../../data/mock';

const QualityIcon = ({ q }: { q: 'good' | 'uncertain' | 'unavailable' }) => {
  if (q === 'good') return <CheckCircle size={14} color="var(--color-success)" />;
  if (q === 'uncertain') return <AlertTriangle size={14} color="var(--color-warning)" />;
  return <XCircle size={14} color="var(--color-error)" />;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 13,
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 2 }}>{label}</p>
        {val !== null ? (
          <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{val}°</p>
        ) : (
          <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No valid data</p>
        )}
      </div>
    );
  }
  return null;
};

export const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(mockClinicalNotes);

  const patient = mockPatients.find((p) => p.id === id);
  if (!patient) {
    return (
      <EmptyState
        title="Patient not found"
        description="This patient record does not exist."
        action={{ label: 'Back to patients', onClick: () => navigate('/physio/patients') }}
      />
    );
  }

  const sessions = mockSessions.filter((s) => s.patientId === patient.id);
  const chartData = mockProgressData.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    angle: d.value,
    quality: d.quality,
  }));

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes([
      {
        id: Math.random().toString(36).slice(2),
        authorId: 'physio1',
        authorName: 'Dr. Sarah Chen',
        content: newNote.trim(),
        timestamp: new Date().toISOString(),
        isAuto: false,
      },
      ...notes,
    ]);
    setNewNote('');
  };

  return (
    <div>
      {/* Back link */}
      <button
        onClick={() => navigate('/physio/patients')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 20 }}
      >
        <ArrowLeft size={16} /> Back to Patients
      </button>

      {/* Header */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 24,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {patient.name.charAt(0)}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700 }}>{patient.name}</h1>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{patient.identifier}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Physio:</span>{' '}
              {patient.assignedPhysio}
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Protocol:</span>{' '}
              {patient.protocol}
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Last session:</span>{' '}
              {new Date(patient.lastSession).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" icon={<Edit size={14} />}>
          Edit Plan
        </Button>
      </div>

      {/* Overview cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card padding={20}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Sessions completed</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-primary)' }}>{patient.sessionCount}</p>
        </Card>
        <Card padding={20}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Latest knee ROM</p>
          {patient.latestKneeROM ? (
            <>
              <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)' }}>{patient.latestKneeROM}°</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                Observed · {new Date(patient.lastSession).toLocaleDateString('en-GB')}
              </p>
            </>
          ) : (
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No valid data</p>
          )}
        </Card>
        <Card padding={20}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>Measurement quality</p>
          {patient.measurementQuality ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <QualityIcon q={patient.measurementQuality} />
              <Badge variant={qualityBadge(patient.measurementQuality).variant}>
                {qualityBadge(patient.measurementQuality).label}
              </Badge>
            </div>
          ) : (
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>—</p>
          )}
        </Card>
      </div>

      {/* Progress chart */}
      <Card padding={24} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
            Observed Knee Movement Across Sessions
          </h2>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            Knee flexion angle in degrees · Gaps indicate sessions with insufficient measurement quality
          </p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EBE9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#647572' }}
              tickLine={false}
              axisLine={{ stroke: '#E4EBE9' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#647572' }}
              tickLine={false}
              axisLine={false}
              domain={[50, 140]}
              unit="°"
              width={36}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="angle"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={(props: any) => {
                const q = chartData[props.index]?.quality;
                const fill =
                  q === 'good'
                    ? 'var(--color-primary)'
                    : q === 'uncertain'
                    ? 'var(--color-warning)'
                    : 'transparent';
                return <circle key={props.key} cx={props.cx} cy={props.cy} r={4} fill={fill} stroke={fill} />;
              }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 12, fontStyle: 'italic' }}>
          Changes in measured movement do not independently establish clinical recovery.
        </p>
      </Card>

      {/* Session history */}
      <Card padding={0} style={{ overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Session History</h2>
        </div>
        {sessions.length === 0 ? (
          <EmptyState
            icon={<Activity size={24} />}
            title="No sessions yet"
            description="Sessions will appear here once the patient starts exercising."
          />
        ) : (
          sessions.map((s) => {
            const rb = reviewBadge(s.reviewStatus);
            return (
              <div
                key={s.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 80px',
                  alignItems: 'center',
                  padding: '14px 24px',
                  borderBottom: '1px solid var(--color-border)',
                  gap: 8,
                }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>
                    {new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </p>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{s.exercise}</p>
                <p style={{ fontSize: 13 }}>{s.completedReps}/{s.prescribedReps} reps</p>
                <p style={{ fontSize: 13 }}>{s.measurementCoverage}% coverage</p>
                <Badge variant={rb.variant}>{rb.label}</Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(`/physio/sessions/${s.id}`)}
                >
                  Report
                </Button>
              </div>
            );
          })
        )}
      </Card>

      {/* Clinical notes */}
      <Card padding={24}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Clinical Notes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <Textarea
            placeholder="Add a clinical note…"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            aria-label="Add clinical note"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="sm"
              onClick={handleAddNote}
              disabled={!newNote.trim()}
              icon={<Send size={14} />}
            >
              Add Note
            </Button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notes.map((n) => (
            <div
              key={n.id}
              style={{
                padding: 16,
                background: n.isAuto ? '#FAFBFB' : 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{n.authorName}</p>
                  {n.isAuto && (
                    <Badge variant="neutral">Automated</Badge>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  {new Date(n.timestamp).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{n.content}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

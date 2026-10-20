import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, MessageSquarePlus, CheckCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Input';
import { Dialog } from '../../components/ui/Dialog';
import { mockSessions } from '../../data/mock';

const session = mockSessions[0];

const qualityColor = (q: string) =>
  q === 'good' ? 'var(--color-primary)' : q === 'uncertain' ? 'var(--color-warning)' : '#D1D8D7';

export const SessionSummary: React.FC = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState('');

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Session Summary</h1>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            {new Date(session.date).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{session.exercise}</p>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{session.duration} min</p>
        </div>
      </div>

      {/* Summary metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Prescribed reps', value: session.prescribedReps },
          { label: 'Completed reps', value: session.completedReps },
          { label: 'Measurement coverage', value: `${session.measurementCoverage}%` },
          { label: 'Median rep duration', value: '4.4 s', note: 'Calculated from reliable reps only' },
        ].map((m) => (
          <Card key={m.label} padding={18}>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>{m.label}</p>
            <p style={{ fontSize: 22, fontWeight: 700 }}>{m.value}</p>
            {m.note && <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>{m.note}</p>}
          </Card>
        ))}
      </div>

      {/* Movement chart */}
      <Card padding={24} style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Knee Angle by Repetition</h2>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
          Peak observed flexion angle per repetition · Color indicates measurement reliability
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={session.angles} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EBE9" vertical={false} />
            <XAxis dataKey="rep" tick={{ fontSize: 12, fill: '#647572' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#647572' }} tickLine={false} axisLine={false} unit="°" width={36} domain={[40, 110]} />
            <Tooltip
              formatter={(v: number) => [`${v}°`, 'Peak angle']}
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
      <Card padding={24} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Session Notes</h2>
          <Badge variant="neutral">Automated summary — review before clinical use</Badge>
        </div>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          {session.aiSummary}
        </p>
      </Card>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {saved ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-success)', fontSize: 14, fontWeight: 500 }}>
            <CheckCircle size={16} /> Session saved
          </div>
        ) : (
          <Button icon={<Save size={15} />} onClick={() => setSaved(true)}>
            Save Session
          </Button>
        )}
        <Button variant="secondary" icon={<MessageSquarePlus size={15} />} onClick={() => setShowNoteDialog(true)}>
          Add Clinical Note
        </Button>
        <Button variant="ghost" icon={<User size={15} />} onClick={() => navigate('/physio/patients/p1')}>
          Patient Profile
        </Button>
      </div>

      {/* Add note dialog */}
      <Dialog
        open={showNoteDialog}
        title="Add Clinical Note"
        confirmLabel="Save Note"
        onConfirm={() => setShowNoteDialog(false)}
        onCancel={() => setShowNoteDialog(false)}
      >
        <Textarea
          label="Note"
          placeholder="Enter your clinical observations…"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={4}
        />
      </Dialog>
    </div>
  );
};

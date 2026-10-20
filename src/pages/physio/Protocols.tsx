import React, { useState } from 'react';
import { Plus, Edit2, Users } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockProtocols } from '../../data/mock';
import type { Protocol } from '../../types';

export const Protocols: React.FC = () => {
  const [protocols, setProtocols] = useState(mockProtocols);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Protocol | null>(null);
  const [form, setForm] = useState({ name: '', exercise: '', prescribedReps: '10', sets: '3', instructions: '', restrictions: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Protocol name is required.';
    if (!form.exercise.trim()) e.exercise = 'Exercise is required.';
    if (!form.instructions.trim()) e.instructions = 'Instructions are required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editTarget) {
      setProtocols((prev) =>
        prev.map((p) =>
          p.id === editTarget.id
            ? { ...p, ...form, prescribedReps: parseInt(form.prescribedReps), sets: parseInt(form.sets), lastUpdated: new Date().toISOString().split('T')[0] }
            : p
        )
      );
    } else {
      setProtocols((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          name: form.name,
          exercise: form.exercise,
          prescribedReps: parseInt(form.prescribedReps),
          sets: parseInt(form.sets),
          instructions: form.instructions,
          restrictions: form.restrictions || undefined,
          lastUpdated: new Date().toISOString().split('T')[0],
          status: 'active' as const,
          assignedPatients: 0,
        },
      ]);
    }
    setShowAdd(false);
    setEditTarget(null);
    setForm({ name: '', exercise: '', prescribedReps: '10', sets: '3', instructions: '', restrictions: '' });
    setErrors({});
  };

  const openEdit = (p: Protocol) => {
    setEditTarget(p);
    setForm({
      name: p.name,
      exercise: p.exercise,
      prescribedReps: String(p.prescribedReps),
      sets: String(p.sets),
      instructions: p.instructions,
      restrictions: p.restrictions || '',
    });
    setShowAdd(true);
  };

  const statusVariant = (s: Protocol['status']) =>
    s === 'active' ? 'success' : s === 'draft' ? 'info' : 'neutral';

  return (
    <div>
      <PageHeader
        title="Exercise Protocols"
        subtitle="Configure and manage rehabilitation protocols for your patients."
        action={
          <Button icon={<Plus size={16} />} onClick={() => { setEditTarget(null); setForm({ name: '', exercise: '', prescribedReps: '10', sets: '3', instructions: '', restrictions: '' }); setShowAdd(true); }}>
            New Protocol
          </Button>
        }
      />

      {protocols.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Plus size={24} />}
            title="No protocols yet"
            description="Create your first exercise protocol to assign to patients."
            action={{ label: 'Create Protocol', onClick: () => setShowAdd(true) }}
          />
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {protocols.map((p) => (
            <Card key={p.id} padding={0} style={{ overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 80px', alignItems: 'center', padding: '18px 24px', gap: 16 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{p.name}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{p.exercise}</p>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {p.prescribedReps} reps · {p.sets} sets
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  <Users size={14} />
                  {p.assignedPatients}
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  Updated {new Date(p.lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
                <Badge variant={statusVariant(p.status)}>
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </Badge>
                <Button size="sm" variant="secondary" icon={<Edit2 size={13} />} onClick={() => openEdit(p)}>
                  Edit
                </Button>
              </div>
              {p.instructions && (
                <div style={{ padding: '0 24px 16px', borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 500 }}>Instructions: </span>{p.instructions}
                  </p>
                  {p.restrictions && (
                    <p style={{ fontSize: 12, color: 'var(--color-warning)', marginTop: 4 }}>
                      <span style={{ fontWeight: 500 }}>Restrictions: </span>{p.restrictions}
                    </p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={showAdd}
        title={editTarget ? 'Edit Protocol' : 'New Protocol'}
        confirmLabel={editTarget ? 'Save Changes' : 'Create Protocol'}
        cancelLabel="Cancel"
        onConfirm={handleSave}
        onCancel={() => { setShowAdd(false); setEditTarget(null); setErrors({}); }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Protocol name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="e.g. Post-ACL Rehab Phase II" />
          <Input label="Exercise" value={form.exercise} onChange={(e) => setForm({ ...form, exercise: e.target.value })} error={errors.exercise} placeholder="e.g. Bodyweight Squat" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Prescribed reps" type="number" min="1" value={form.prescribedReps} onChange={(e) => setForm({ ...form, prescribedReps: e.target.value })} />
            <Input label="Sets" type="number" min="1" value={form.sets} onChange={(e) => setForm({ ...form, sets: e.target.value })} />
          </div>
          <Textarea label="Instructions" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} error={errors.instructions} rows={3} placeholder="Step-by-step instructions for the patient…" />
          <Textarea label="Restrictions (optional)" value={form.restrictions} onChange={(e) => setForm({ ...form, restrictions: e.target.value })} rows={2} placeholder="Any movement limits or contraindications…" />
        </div>
      </Dialog>
    </div>
  );
};

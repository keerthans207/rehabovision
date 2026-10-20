import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { mockProtocols } from '../../data/mock';

export const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    identifier: '',
    displayName: '',
    physio: 'Dr. Sarah Chen',
    protocol: 'pr1',
    consent: 'yes',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.identifier.trim()) e.identifier = 'Patient identifier is required.';
    if (!form.displayName.trim()) e.displayName = 'Display name is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitted(true);
    setTimeout(() => navigate('/physio/patients'), 1800);
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 340, gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)', fontSize: 28 }}>✓</div>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Patient added</h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Returning to patient list…</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate('/physio/patients')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 20 }}>
        <ArrowLeft size={16} /> Back to Patients
      </button>
      <PageHeader title="Add Patient" subtitle="Register a new patient and assign an initial rehabilitation protocol." />

      <Card padding={28} style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Input
            label="Patient identifier"
            placeholder="e.g. PT-0042"
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            error={errors.identifier}
            hint="Use your practice's existing patient ID system."
          />
          <Input
            label="Display name"
            placeholder="e.g. Alex Morgan"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            error={errors.displayName}
          />
          <Select
            label="Assigned physiotherapist"
            value={form.physio}
            onChange={(e) => setForm({ ...form, physio: e.target.value })}
            options={[
              { value: 'Dr. Sarah Chen', label: 'Dr. Sarah Chen' },
              { value: 'Dr. Mark Osei', label: 'Dr. Mark Osei' },
            ]}
          />
          <Select
            label="Initial exercise protocol"
            value={form.protocol}
            onChange={(e) => setForm({ ...form, protocol: e.target.value })}
            options={mockProtocols.map((p) => ({ value: p.id, label: p.name }))}
          />
          <Select
            label="Consent status"
            value={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.value })}
            options={[
              { value: 'yes', label: 'Consent given' },
              { value: 'pending', label: 'Pending — do not start sessions' },
            ]}
            hint="Ensure informed consent has been obtained before starting any sessions."
          />
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <Button onClick={handleSubmit} icon={<UserPlus size={15} />}>Add Patient</Button>
            <Button variant="secondary" onClick={() => navigate('/physio/patients')}>Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

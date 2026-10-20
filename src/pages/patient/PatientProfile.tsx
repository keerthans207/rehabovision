import React from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { mockPatients } from '../../data/mock';

export const PatientProfilePage: React.FC = () => {
  const patient = mockPatients[0];

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your account and rehabilitation information." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
        {/* Personal info */}
        <Card padding={24}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Personal Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Full name" defaultValue={patient.name} icon={<User size={16} />} />
            <Input label="Patient ID" defaultValue={patient.identifier} disabled />
            <Input
              label="Email"
              type="email"
              defaultValue="alex.morgan@email.com"
              icon={<Mail size={16} />}
            />
            <Button size="sm" style={{ alignSelf: 'flex-start' }}>
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Rehabilitation info */}
        <Card padding={24}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
            Rehabilitation Program
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                Assigned physiotherapist
              </p>
              <p style={{ fontSize: 14, fontWeight: 500 }}>{patient.assignedPhysio}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                Current protocol
              </p>
              <p style={{ fontSize: 14, fontWeight: 500 }}>{patient.protocol}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                Last session
              </p>
              <p style={{ fontSize: 14, fontWeight: 500 }}>
                {new Date(patient.lastSession).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card padding={24}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Privacy & Data</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Your exercise data and movement measurements are stored securely and are only accessible to your assigned healthcare team. You can request a copy or deletion of your data at any time.
          </p>
        </Card>
      </div>
    </div>
  );
};

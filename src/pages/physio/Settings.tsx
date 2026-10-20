import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';

export const PhysioSettings: React.FC = () => (
  <div>
    <PageHeader title="Settings" subtitle="Manage your account and practice preferences." />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
      <Card padding={24}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Account</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Full name" defaultValue="Dr. Sarah Chen" />
          <Input label="Email" type="email" defaultValue="s.chen@rehab.clinic" />
          <Button size="sm" style={{ alignSelf: 'flex-start' }}>Save Changes</Button>
        </div>
      </Card>
      <Card padding={24}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Notifications</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select
            label="Email notification frequency"
            defaultValue="daily"
            options={[
              { value: 'immediate', label: 'Immediately' },
              { value: 'daily', label: 'Daily digest' },
              { value: 'weekly', label: 'Weekly digest' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <Button size="sm" style={{ alignSelf: 'flex-start' }}>Save</Button>
        </div>
      </Card>
    </div>
  </div>
);

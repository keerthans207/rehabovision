import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Input, Select } from '../../components/ui/Input';
import { Badge, reviewBadge, statusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState, LoadingSkeleton } from '../../components/ui/EmptyState';
import { mockPatients } from '../../data/mock';

export const Patients: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading] = useState(false);

  const filtered = mockPatients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.identifier.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Patients"
        subtitle="Manage rehabilitation plans and review progress."
        action={
          <Button icon={<UserPlus size={16} />} onClick={() => navigate('/physio/patients/add')}>
            Add Patient
          </Button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            placeholder="Search by name or identifier…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
            aria-label="Search patients"
          />
        </div>
        <div style={{ width: 180 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'active', label: 'Active' },
              { value: 'on-hold', label: 'On Hold' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr 80px',
            padding: '12px 24px',
            borderBottom: '1px solid var(--color-border)',
            background: '#FAFBFB',
          }}
        >
          {['Patient', 'Assigned Protocol', 'Last Session', 'Status', ''].map((h) => (
            <p
              key={h}
              style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              {h}
            </p>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 24 }}>
            <LoadingSkeleton rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={search ? <Search size={24} /> : <UserPlus size={24} />}
            title={search ? 'No patients found' : 'No patients yet'}
            description={
              search
                ? `No patient matches "${search}". Try a different name or identifier.`
                : 'Add your first patient to get started.'
            }
            action={
              !search
                ? { label: 'Add Patient', onClick: () => navigate('/physio/patients/add') }
                : undefined
            }
          />
        ) : (
          filtered.map((p) => {
            const sb = statusBadge(p.status);
            const rb = reviewBadge(p.recentSessionStatus);
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/physio/patients/${p.id}`)}
                role="row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1fr 1fr 80px',
                  padding: '14px 24px',
                  borderBottom: '1px solid var(--color-border)',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#FAFBFB')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.identifier}</p>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{p.protocol}</p>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {new Date(p.lastSession).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Badge variant={sb.variant}>{sb.label}</Badge>
                  <Badge variant={rb.variant}>{rb.label}</Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button size="sm" variant="ghost" icon={<ArrowRight size={14} />} iconPosition="right">
                    View
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {filtered.length > 0 && (
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 12 }}>
          Showing {filtered.length} of {mockPatients.length} patients
        </p>
      )}
    </div>
  );
};

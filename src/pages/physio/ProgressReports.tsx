import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockPatients, mockProgressData } from '../../data/mock';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, boxShadow: 'var(--shadow-md)' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 2 }}>{label}</p>
        {val != null ? <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{val}°</p> : <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>No valid data</p>}
      </div>
    );
  }
  return null;
};

export const ProgressReports: React.FC = () => {
  const [patientId, setPatientId] = useState('p1');
  const [range, setRange] = useState('all');

  const patient = mockPatients.find((p) => p.id === patientId);

  let data = mockProgressData.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    angle: d.value,
    quality: d.quality,
  }));

  if (range === '30') data = data.slice(-4);
  if (range === '60') data = data.slice(-8);

  const validPoints = data.filter((d) => d.angle !== null);
  const hasData = validPoints.length > 0;

  return (
    <div>
      <PageHeader title="Progress Reports" subtitle="Review observed movement measurements across sessions." />

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ width: 260 }}>
          <Select
            label="Patient"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            options={mockPatients.map((p) => ({ value: p.id, label: `${p.name} (${p.identifier})` }))}
          />
        </div>
        <div style={{ width: 180 }}>
          <Select
            label="Period"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            options={[
              { value: 'all', label: 'All time' },
              { value: '60', label: 'Last 60 days' },
              { value: '30', label: 'Last 30 days' },
            ]}
          />
        </div>
      </div>

      {!hasData ? (
        <Card>
          <EmptyState
            icon={<BarChart2 size={24} />}
            title="Insufficient data"
            description="There are not enough reliable measurements for the selected patient and period."
          />
        </Card>
      ) : (
        <Card padding={24}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              Observed Knee Movement — {patient?.name}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              Knee flexion angle in degrees · {validPoints.length} valid measurement{validPoints.length !== 1 ? 's' : ''}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4EBE9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#647572' }} tickLine={false} axisLine={{ stroke: '#E4EBE9' }} />
              <YAxis tick={{ fontSize: 11, fill: '#647572' }} tickLine={false} axisLine={false} domain={[50, 140]} unit="°" width={36} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="angle"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={(props: any) => {
                  const q = data[props.index]?.quality;
                  const fill = q === 'good' ? 'var(--color-primary)' : q === 'uncertain' ? 'var(--color-warning)' : 'transparent';
                  return <circle key={props.key} cx={props.cx} cy={props.cy} r={4} fill={fill} stroke={fill} />;
                }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 12, fontStyle: 'italic' }}>
            Changes in measured movement do not independently establish clinical recovery. Yellow dots indicate uncertain measurements; gaps indicate sessions with no valid data.
          </p>
        </Card>
      )}
    </div>
  );
};

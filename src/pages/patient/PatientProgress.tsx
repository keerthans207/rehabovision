import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Input';
import { mockProgressData } from '../../data/mock';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

export const PatientProgress: React.FC = () => {
  const [range, setRange] = useState('all');

  let data = mockProgressData.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    angle: d.value,
    quality: d.quality,
  }));

  if (range === '30') data = data.slice(-4);
  if (range === '60') data = data.slice(-8);

  const validPoints = data.filter((d) => d.angle !== null);

  return (
    <div>
      <PageHeader title="My Progress" subtitle="Track your movement measurements over time." />

      <div style={{ marginBottom: 24, width: 180 }}>
        <Select
          label="View period"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          options={[
            { value: 'all', label: 'All time' },
            { value: '60', label: 'Last 60 days' },
            { value: '30', label: 'Last 30 days' },
          ]}
        />
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card padding={20}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            Sessions recorded
          </p>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {data.length}
          </p>
        </Card>
        <Card padding={20}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            Valid measurements
          </p>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)' }}>
            {validPoints.length}
          </p>
        </Card>
        <Card padding={20}>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            Latest knee angle
          </p>
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)' }}>94°</p>
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            17 Oct 2026
          </p>
        </Card>
      </div>

      {/* Chart */}
      <Card padding={24}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
            Observed Knee Movement Across Sessions
          </h2>
          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            Knee flexion angle in degrees · Gaps indicate sessions with insufficient measurement quality
          </p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
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
                const q = data[props.index]?.quality;
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
        <p
          style={{
            fontSize: 11,
            color: 'var(--color-text-secondary)',
            marginTop: 12,
            fontStyle: 'italic',
          }}
        >
          Changes in measured movement do not independently establish clinical recovery. Discuss your progress with your physiotherapist.
        </p>
      </Card>

      {/* Info note */}
      <Card padding={20} style={{ marginTop: 20, background: 'var(--color-info-bg)', border: '1px solid #b8c9ee' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <TrendingUp size={20} color="var(--color-info)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-info)', marginBottom: 4 }}>
              Understanding your progress
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-info)', lineHeight: 1.6 }}>
              The measurements shown here reflect observed movement during your exercise sessions. Your physiotherapist will review this data alongside other clinical assessments to guide your rehabilitation plan.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

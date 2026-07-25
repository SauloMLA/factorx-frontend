'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function OverviewChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-sm text-slate-500">
        No hay datos suficientes para graficar.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
        <XAxis
          dataKey="name"
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
        />
        <Tooltip
          cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
          contentStyle={{
            backgroundColor: '#1e293b',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
          }}
          itemStyle={{ color: '#fff' }}
          formatter={(value: any) => [
            new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(Number(value || 0)),
            'Monto',
          ]}
        />
        <Bar
          dataKey="volume"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

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
import { useLanguage } from '@/context/language-context';

export function OverviewChart({ data }: { data: any[] }) {
  const { t, language } = useLanguage();
  const locale = language === 'en' ? 'en-US' : 'es-MX';

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-xs text-slate-400 dark:text-slate-500 font-medium">
        {t('dash.volume_empty')}
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
            backgroundColor: '#111625',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '12px',
          }}
          itemStyle={{ color: '#60a5fa' }}
          formatter={(value: any) => [
            new Intl.NumberFormat(locale, {
              style: 'currency',
              currency: 'MXN',
            }).format(Number(value || 0)),
            language === 'en' ? 'Amount' : 'Monto',
          ]}
        />
        <Bar
          dataKey="volume"
          fill="#3b82f6"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

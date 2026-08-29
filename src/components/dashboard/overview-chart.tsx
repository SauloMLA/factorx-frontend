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
      <div className="flex items-center justify-center h-[300px] text-xs text-muted-foreground font-medium">
        {t('dash.volume_empty')}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="goldBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.76 0.12 82)" stopOpacity={1} />
            <stop offset="100%" stopColor="oklch(0.76 0.12 82)" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
        <XAxis
          dataKey="name"
          stroke="var(--muted-foreground)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dy={8}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
          dx={-8}
        />
        <Tooltip
          cursor={{ fill: 'var(--accent)', opacity: 0.2 }}
          contentStyle={{
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            color: 'var(--popover-foreground)',
            fontSize: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          }}
          itemStyle={{ color: 'oklch(0.76 0.12 82)', fontWeight: 'bold' }}
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
          fill="url(#goldBarGrad)"
          radius={[6, 6, 0, 0]}
          isAnimationActive={true}
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

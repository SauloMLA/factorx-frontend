'use client';

import { Layers, CreditCard, ShieldCheck, Users, FileText, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDashboardMetricsQuery } from '@/hooks/useDashboardMetrics';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { useLanguage } from '@/context/language-context';
import { motion } from 'motion/react';
import { GlowCard } from '@/components/ui/glow-card';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { spring, fadeUp } from '@/lib/motion';

export default function DashboardPage() {
  const { data: metrics, isLoading, isError } = useDashboardMetricsQuery();
  const { t, language } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="relative">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[oklch(0.76_0.12_82)] border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full blur-md bg-[oklch(0.76_0.12_82/0.3)] animate-pulse"></div>
        </div>
        <p className="text-xs text-muted-foreground font-mono tracking-wider font-semibold">
          CALCULANDO MÉTRICAS FINANCIERAS...
        </p>
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <motion.div
        {...fadeUp}
        className="flex flex-col items-center justify-center py-16 text-center bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 backdrop-blur-xl"
      >
        <AlertCircle className="h-10 w-10 text-rose-500 mb-2" />
        <h3 className="text-lg font-bold text-foreground mb-1">Error de conexión</h3>
        <p className="text-xs text-muted-foreground max-w-md">
          No se pudieron cargar los datos del dashboard. Verifica tu conexión o inicia sesión nuevamente.
        </p>
      </motion.div>
    );
  }

  const { kpis, charts } = metrics;
  const locale = language === 'en' ? 'en-US' : 'es-MX';

  const kpiItems = [
    {
      title: t('dash.total_volume'),
      value: kpis.totalVolume,
      currency: true,
      icon: CreditCard,
      subtext: language === 'en' ? 'Cumulative origination' : 'Originación acumulada',
      glow: 'oklch(0.76 0.12 82)',
      badge: '+12.4%',
    },
    {
      title: t('dash.net_commissions'),
      value: kpis.commissions,
      currency: true,
      icon: ShieldCheck,
      subtext: language === 'en' ? 'Fixed fee return 1.5%' : 'Retorno 1.5% tasa fija',
      glow: 'oklch(0.75 0.16 145)',
      badge: language === 'en' ? 'Net Margin' : 'Margen neto',
    },
    {
      title: t('dash.active_operations'),
      value: kpis.activeOperations,
      currency: false,
      icon: Layers,
      subtext: `${language === 'en' ? 'Avg. advance' : 'Aforo prom.'} ${kpis.averageAforo.toFixed(1)}%`,
      glow: 'oklch(0.68 0.14 260)',
      badge: language === 'en' ? 'Active' : 'Activas',
    },
    {
      title: t('dash.clients_invoices'),
      value: kpis.totalClients,
      secondaryValue: kpis.totalInvoices,
      currency: false,
      icon: Users,
      subtext: `${kpis.totalInvoices} ${language === 'en' ? 'funded invoices' : 'facturas fondeadas'}`,
      glow: 'oklch(0.70 0.12 320)',
      badge: language === 'en' ? 'Companies' : 'Empresas',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Encabezado con estética de Banca Privada adaptativa */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.76_0.12_82/0.12)] border border-[oklch(0.76_0.12_82/0.3)] text-[11px] font-bold text-[oklch(0.76_0.12_82)] uppercase tracking-wider mb-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.76_0.12_82)] animate-ping" />
            <Sparkles className="h-3 w-3" />
            {language === 'en' ? 'Real-Time Console' : 'Consola en Tiempo Real'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {t('dash.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            {t('dash.subtitle')}
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-card border border-border text-right shadow-sm">
            <span className="text-[11px] text-muted-foreground block font-medium">
              {language === 'en' ? 'System Liquidity' : 'Liquidez del Sistema'}
            </span>
            <span className="text-sm font-mono font-bold text-[oklch(0.76_0.12_82)]">
              $100,000,000 MXN
            </span>
          </div>
        </div>
      </motion.div>

      {/* Grid de KPIs Globales con GlowCard y Stagger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {kpiItems.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, ...spring }}
          >
            <GlowCard
              glowColor={kpi.glow}
              className="bg-card border border-border hover:border-foreground/20 transition-all duration-300 shadow-sm hover:shadow-lg group"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className="p-2.5 rounded-xl shrink-0 border border-border"
                    style={{
                      background: `${kpi.glow}18`,
                      color: kpi.glow,
                    }}
                  >
                    <kpi.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-mono">
                    {kpi.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    {kpi.title}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground font-mono tracking-tight group-hover:text-[oklch(0.76_0.12_82)] transition-colors">
                    {kpi.currency ? (
                      <AnimatedNumber value={kpi.value} currency locale={locale} />
                    ) : kpi.secondaryValue !== undefined ? (
                      <>
                        <AnimatedNumber value={kpi.value} locale={locale} />
                        <span className="text-muted-foreground text-sm font-normal ml-1">
                          / <AnimatedNumber value={kpi.secondaryValue} locale={locale} />
                        </span>
                      </>
                    ) : (
                      <AnimatedNumber value={kpi.value} locale={locale} />
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium pt-1">
                    {kpi.subtext}
                  </p>
                </div>
              </CardContent>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Gráficas y Métricas Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gráfica de Volumen */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, ...spring }}
          className="lg:col-span-7"
        >
          <Card className="bg-card border-border shadow-sm hover:shadow-md rounded-2xl overflow-hidden backdrop-blur-xl">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground text-sm font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[oklch(0.76_0.12_82)]" />
                  {t('dash.volume_trend')}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-mono font-semibold">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{language === 'en' ? 'Consolidated History' : 'Histórico Consolidado'}</span>
                </div>
              </div>
              <CardDescription className="text-muted-foreground text-xs font-medium">
                {t('dash.volume_sub')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <OverviewChart data={charts.volumeByMonth} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabla de Crecimiento de Clientes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, ...spring }}
          className="lg:col-span-5"
        >
          <Card className="bg-card border-border shadow-sm hover:shadow-md rounded-2xl overflow-hidden backdrop-blur-xl h-full flex flex-col">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-foreground text-sm font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-500" />
                {t('dash.client_growth')}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs font-medium">
                {t('dash.growth_sub')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between">
              {charts.clientsByMonth.length === 0 ? (
                <div className="py-16 text-center text-xs text-muted-foreground font-medium">
                  {t('dash.growth_empty')}
                </div>
              ) : (
                <div className="overflow-hidden border border-border rounded-xl bg-muted/20">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow className="border-b border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground text-xs font-bold py-3">
                          {t('dash.month')}
                        </TableHead>
                        <TableHead className="text-muted-foreground text-xs font-bold py-3 text-right">
                          {t('dash.new_clients')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {charts.clientsByMonth.map((monthData, i) => (
                        <TableRow
                          key={i}
                          className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <TableCell className="font-semibold text-foreground py-3 text-xs capitalize">
                            {monthData.name}
                          </TableCell>
                          <TableCell className="text-emerald-500 font-mono py-3 text-xs text-right font-bold">
                            +{monthData.count}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="pt-4 mt-auto border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">
                  {language === 'en' ? 'Automated SAT Audit' : 'Auditoría SAT automatizada'}
                </span>
                <span className="text-[oklch(0.76_0.12_82)] font-mono font-bold">
                  {language === 'en' ? 'Rule RD-INV-003' : 'Regla RD-INV-003'}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

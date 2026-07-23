'use client';

import Link from 'next/link';
import { ArrowRight, Layers, CreditCard, ShieldCheck, Users, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useDashboardMetricsQuery } from '@/hooks/useDashboardMetrics';
import { OverviewChart } from '@/components/dashboard/overview-chart';

export default function DashboardPage() {
  const { data: metrics, isLoading, isError } = useDashboardMetricsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Cargando métricas financieras...</p>
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-rose-50 dark:bg-[#17111e]/20 border border-rose-200 dark:border-rose-500/20 rounded-xl p-8">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-2" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Error de conexión</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">No se pudieron cargar los datos del dashboard. Verifica tu conexión o inicia sesión nuevamente.</p>
      </div>
    );
  }

  const { kpis, charts } = metrics;

  const formattedTotalVolume = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(kpis.totalVolume);
  const formattedCommissions = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(kpis.commissions);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Financiero</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Analítica avanzada y métricas clave de rendimiento (KPIs).
        </p>
      </div>

      {/* Grid de KPIs Globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-[#111625] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs hover:border-blue-500/50 transition-colors">
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Volumen Originado</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-mono">{formattedTotalVolume}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#111625] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs hover:border-emerald-500/50 transition-colors">
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Comisiones Netas</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-mono">{formattedCommissions}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#111625] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs hover:border-indigo-500/50 transition-colors">
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operaciones Fondeadas</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{kpis.activeOperations}</h3>
              <p className="text-xs text-slate-400 mt-1">Aforo prom. {kpis.averageAforo.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#111625] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs hover:border-purple-500/50 transition-colors">
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clientes / Facturas</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {kpis.totalClients} <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">/ {kpis.totalInvoices}</span>
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfica de Volumen */}
        <Card className="bg-white dark:bg-[#0c101a] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Tendencia de Volumen (Monto Financiado)
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Monto total originado por mes.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <OverviewChart data={charts.volumeByMonth} />
          </CardContent>
        </Card>

        {/* Gráfica de Clientes o Tabla de Resumen */}
        <Card className="bg-white dark:bg-[#0c101a] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 dark:text-white text-base font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-500" />
                Crecimiento de Clientes
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Clientes aprobados por mes en la plataforma.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {charts.clientsByMonth.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400 dark:text-slate-500">
                No hay datos de clientes registrados aún.
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-200 dark:border-[#1e293b]/20 rounded-lg">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-[#111625]">
                    <TableRow className="border-b border-slate-200 dark:border-[#1e293b]/20 hover:bg-transparent">
                      <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-3">Mes</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-3 text-right">Nuevos Clientes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {charts.clientsByMonth.map((monthData, i) => (
                      <TableRow key={i} className="border-b border-slate-100 dark:border-[#1e293b]/10 last:border-0 hover:bg-slate-50 dark:hover:bg-[#1e293b]/5">
                        <TableCell className="font-semibold text-slate-900 dark:text-white py-3">{monthData.name}</TableCell>
                        <TableCell className="text-emerald-600 dark:text-emerald-400 font-mono py-3 text-right">+{monthData.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

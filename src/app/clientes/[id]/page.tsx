'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, ShieldCheck, AlertTriangle, Calendar, CreditCard, Layers, Download } from 'lucide-react';
import { useClientDetailsQuery, useClientSummaryQuery } from '@/hooks/useClients';
import { useOperationsQuery } from '@/hooks/useOperations';
import { exportToCSV } from '@/lib/export-csv';
import ClientStatusBadge from '@/components/clients/status-badge';
import ApproveClientDialog from '@/components/clients/approve-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/context/language-context';

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = use(params);
  const { t, language } = useLanguage();

  const { data: client, isLoading: isClientLoading, isError: isClientError } = useClientDetailsQuery(id);
  const { data: summary, isLoading: isSummaryLoading } = useClientSummaryQuery(id, client?.status === 'APPROVED');
  const { data: operations, isLoading: isOperationsLoading } = useOperationsQuery(id);

  const handleExportClientReport = () => {
    if (!client || !operations || operations.length === 0) return;
    const reportData = operations.map((op) => ({
      clienteRfc: client.rfc,
      clienteNombre: client.name,
      idOperacion: op.id,
      montoTotalFacturas: op.totalAmount,
      montoAnticipado: op.advancedAmount,
      comision: op.commission,
      montoDepositado: op.depositAmount,
      fechaOriginacion: new Date(op.createdAt).toISOString(),
    }));

    exportToCSV(reportData, `expediente_${client.rfc}`, {
      clienteRfc: 'RFC Cliente',
      clienteNombre: 'Razón Social',
      idOperacion: 'ID Operación',
      montoTotalFacturas: 'Total Facturado',
      montoAnticipado: 'Anticipado (85%)',
      comision: 'Comisión (1.5%)',
      montoDepositado: 'Depositado Neto',
      fechaOriginacion: 'Fecha de Originación',
    });
  };

  const locale = language === 'en' ? 'en-US' : 'es-MX';

  if (isClientLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[oklch(0.76_0.12_82)] border-t-transparent" />
        <p className="text-xs text-muted-foreground font-mono font-medium">{t('common.loading')}</p>
      </div>
    );
  }

  if (isClientError || !client) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground mb-2">Expediente no encontrado</h3>
        <p className="text-sm text-muted-foreground mb-6">El cliente solicitado no existe.</p>
        <Link href="/clientes">
          <Button variant="outline" className="border-border text-foreground gap-2 rounded-xl">
            <ArrowLeft className="h-4 w-4" /> {t('client_detail.back')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Cabecera y Navegación de Regreso */}
      <div className="space-y-4">
        <Link href="/clientes" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> {t('client_detail.back')}
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{client.name}</h1>
              <ClientStatusBadge status={client.status} />
            </div>
            <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 text-xs sm:text-sm text-muted-foreground font-medium">
              <span>{t('clients.col_rfc')}: <span className="font-mono text-foreground">{client.rfc}</span></span>
              <span className="hidden sm:inline">•</span>
              <span>{t('clients.col_email')}: <span className="text-foreground font-mono">{client.email}</span></span>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex flex-wrap items-center gap-3">
            {client.status === 'APPROVED' && operations && operations.length > 0 && (
              <Button
                onClick={handleExportClientReport}
                variant="outline"
                className="border-border text-foreground gap-2 text-xs rounded-xl cursor-pointer"
              >
                <Download className="h-4 w-4" /> {t('client_detail.export_csv')}
              </Button>
            )}

            {client.status === 'PENDING' ? (
              <ApproveClientDialog
                clientId={client.id}
                clientName={client.name}
                clientRfc={client.rfc}
                trigger={
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold rounded-xl shadow-md shadow-emerald-500/20 cursor-pointer">
                    <ShieldCheck className="h-4 w-4" /> {t('clients.approve_btn')}
                  </Button>
                }
              />
            ) : (
              <Link href={`/operaciones/nueva?clientId=${client.id}`}>
                <Button
                  className="font-bold text-xs uppercase tracking-wider text-[oklch(0.07_0_0)] gap-2 rounded-xl shadow-lg h-10 px-5 transition-all hover:brightness-110 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
                    boxShadow: '0 2px 14px oklch(0.76 0.12 82 / 25%)',
                  }}
                >
                  <Plus className="h-4 w-4" /> {t('ops.btn_new')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Banner de Advertencia si está Pendiente */}
      {client.status === 'PENDING' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-foreground text-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-600 dark:text-amber-400">{t('client_detail.pending_banner_title')}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('client_detail.pending_banner_desc')}
            </p>
          </div>
        </div>
      )}

      {/* KPIs del Expediente Financiero */}
      {client.status === 'APPROVED' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-card border-border text-card-foreground shadow-sm rounded-2xl">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[oklch(0.76_0.12_82/0.12)] border border-[oklch(0.76_0.12_82/0.25)] text-[oklch(0.76_0.12_82)] shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('client_detail.funded_ops')}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1">
                  {isSummaryLoading ? '...' : summary?.operationCount ?? 0}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground shadow-sm rounded-2xl">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('client_detail.advanced_vol')}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1 font-mono">
                  {isSummaryLoading
                    ? '...'
                    : new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(
                        summary?.totalAdvancedAmount ?? 0
                      )}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border text-card-foreground shadow-sm rounded-2xl">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[oklch(0.68_0.14_260/0.12)] border border-[oklch(0.68_0.14_260/0.25)] text-[oklch(0.68_0.14_260)] shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{t('client_detail.next_due')}</p>
                <h3 className="text-lg font-bold text-foreground mt-2 font-mono">
                  {isSummaryLoading
                    ? '...'
                    : summary?.nearestDueDate
                    ? new Date(summary.nearestDueDate).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : t('client_detail.no_due')}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historial de Operaciones */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">{t('client_detail.ops_history')}</h2>
        
        {isOperationsLoading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">{t('common.loading')}</div>
        ) : !operations || operations.length === 0 ? (
          <Card className="bg-card border-border py-12 text-center rounded-2xl shadow-sm">
            <CardContent>
              <p className="text-muted-foreground text-sm font-medium">{t('client_detail.no_ops')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/40 border-b border-border">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-3.5">{t('ops.col_id')}</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-3.5">{t('ops.col_date')}</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-3.5">{t('ops.col_invoices')}</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-3.5">{t('ops.col_total')}</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-3.5">{t('ops.col_advanced')}</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-3.5">{t('ops.col_commission')}</TableHead>
                  <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-3.5 text-right">{t('ops.col_deposit')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.map((op) => (
                  <TableRow key={op.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground py-3.5">
                      {op.id}
                    </TableCell>
                    <TableCell className="text-foreground py-3.5 text-sm font-mono">
                      {new Date(op.createdAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-foreground py-3.5 font-medium">{op.invoices?.length ?? 0}</TableCell>
                    <TableCell className="font-mono text-foreground py-3.5">
                      {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.totalAmount)}
                    </TableCell>
                    <TableCell className="font-mono text-[oklch(0.76_0.12_82)] py-3.5 font-semibold">
                      {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.advancedAmount)}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground py-3.5">
                      {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.commission)}
                    </TableCell>
                    <TableCell className="font-mono text-emerald-500 font-bold text-right py-3.5">
                      {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.depositAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

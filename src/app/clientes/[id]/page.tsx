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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-sm text-slate-400">{t('common.loading')}</p>
      </div>
    );
  }

  if (isClientError || !client) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-2">Expediente no encontrado</h3>
        <p className="text-sm text-slate-400 mb-6">El cliente solicitado no existe.</p>
        <Link href="/clientes">
          <Button variant="outline" className="border-[#1e293b] text-slate-300 gap-2 rounded-xl">
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
        <Link href="/clientes" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> {t('client_detail.back')}
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-[#1e293b]/60 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{client.name}</h1>
              <ClientStatusBadge status={client.status} />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span>{t('clients.col_rfc')}: <span className="font-mono text-slate-800 dark:text-slate-300">{client.rfc}</span></span>
              <span>•</span>
              <span>{t('clients.col_email')}: <span className="text-slate-800 dark:text-slate-300 font-mono">{client.email}</span></span>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex items-center gap-3">
            {client.status === 'APPROVED' && operations && operations.length > 0 && (
              <Button
                onClick={handleExportClientReport}
                variant="outline"
                className="border-slate-300 dark:border-[#1e293b]/60 text-slate-700 dark:text-slate-300 gap-2 text-xs rounded-xl"
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
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold rounded-xl shadow-md shadow-emerald-500/20">
                    <ShieldCheck className="h-4 w-4" /> {t('clients.approve_btn')}
                  </Button>
                }
              />
            ) : (
              <Link href={`/operaciones/nueva?clientId=${client.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold rounded-xl shadow-md shadow-blue-500/20">
                  <Plus className="h-4 w-4" /> {t('ops.btn_new')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Banner de Advertencia si está Pendiente */}
      {client.status === 'PENDING' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-slate-700 dark:text-slate-300 text-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-600 dark:text-amber-400">{t('client_detail.pending_banner_title')}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {t('client_detail.pending_banner_desc')}
            </p>
          </div>
        </div>
      )}

      {/* KPIs del Expediente Financiero (Solo si está Aprobado) */}
      {client.status === 'APPROVED' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-[#0c101a] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 shadow-md rounded-2xl">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('client_detail.funded_ops')}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {isSummaryLoading ? '...' : summary?.operationCount ?? 0}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#0c101a] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 shadow-md rounded-2xl">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('client_detail.advanced_vol')}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
                  {isSummaryLoading
                    ? '...'
                    : new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(
                        summary?.totalAdvancedAmount ?? 0
                      )}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#0c101a] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 shadow-md rounded-2xl">
            <CardContent className="pt-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('client_detail.next_due')}</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 font-mono">
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
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('client_detail.ops_history')}</h2>
        
        {isOperationsLoading ? (
          <div className="py-10 text-center text-sm text-slate-500">{t('common.loading')}</div>
        ) : !operations || operations.length === 0 ? (
          <Card className="bg-slate-50 dark:bg-[#111625]/20 border-slate-200 dark:border-[#1e293b]/60 py-12 text-center rounded-2xl">
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{t('client_detail.no_ops')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="border border-slate-200 dark:border-[#1e293b]/60 rounded-2xl overflow-hidden bg-white dark:bg-[#0c101a] shadow-xl">
            <Table>
              <TableHeader className="bg-slate-100/80 dark:bg-[#111625] border-b border-slate-200 dark:border-[#1e293b]/60">
                <TableRow className="border-b border-slate-200 dark:border-[#1e293b]/60 hover:bg-transparent">
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-3.5">{t('ops.col_id')}</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-3.5">{t('ops.col_date')}</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-3.5">{t('ops.col_invoices')}</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-3.5">{t('ops.col_total')}</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-3.5">{t('ops.col_advanced')}</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-3.5">{t('ops.col_commission')}</TableHead>
                  <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-3.5 text-right">{t('ops.col_deposit')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.map((op) => (
                  <TableRow key={op.id} className="border-b border-slate-100 dark:border-[#1e293b]/20 hover:bg-slate-50 dark:hover:bg-[#1e293b]/20 transition-colors">
                    <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-400 py-3.5">
                      {op.id}
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300 py-3.5 text-sm font-mono">
                      {new Date(op.createdAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300 py-3.5 font-medium">{op.invoices?.length ?? 0}</TableCell>
                    <TableCell className="font-mono text-slate-700 dark:text-slate-300 py-3.5">
                      {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.totalAmount)}
                    </TableCell>
                    <TableCell className="font-mono text-blue-600 dark:text-blue-400 py-3.5">
                      {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.advancedAmount)}
                    </TableCell>
                    <TableCell className="font-mono text-slate-500 dark:text-slate-400 py-3.5">
                      {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.commission)}
                    </TableCell>
                    <TableCell className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-right py-3.5">
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

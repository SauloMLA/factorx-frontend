'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, ChevronDown, ChevronUp, AlertCircle, Download } from 'lucide-react';
import { useOperationsQuery } from '@/hooks/useOperations';
import { useClientsQuery } from '@/hooks/useClients';
import { exportToCSV } from '@/lib/export-csv';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/context/language-context';

export default function OperationsPage() {
  const { data: operations, isLoading, isError, error } = useOperationsQuery();
  const { data: clients } = useClientsQuery();
  const { t, language } = useLanguage();
  
  const [search, setSearch] = useState('');
  const [expandedOperationId, setExpandedOperationId] = useState<string | null>(null);

  const toggleExpand = (opId: string) => {
    setExpandedOperationId(expandedOperationId === opId ? null : opId);
  };

  const handleExportCSV = () => {
    if (!filteredOperations || filteredOperations.length === 0) return;
    const exportData = filteredOperations.map((op) => {
      const client = (clients || []).find((c) => c.id === op.clientId);
      return {
        id: op.id,
        clienteNombre: client?.name || 'Desconocido',
        clienteRfc: client?.rfc || 'Desconocido',
        montoTotal: op.totalAmount,
        montoAdelantado: op.advancedAmount,
        comision: op.commission,
        montoDepositado: op.depositAmount,
        fecha: new Date(op.createdAt).toISOString(),
      };
    });

    exportToCSV(exportData, 'operaciones_factoraje', {
      id: 'ID Operación',
      clienteNombre: 'Razón Social Cliente',
      clienteRfc: 'RFC Cliente',
      montoTotal: 'Monto Total Facturas',
      montoAdelantado: 'Monto Anticipado (85%)',
      comision: 'Comisión (1.5%)',
      montoDepositado: 'Monto Depositado Neto',
      fecha: 'Fecha de Originación',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t('common.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-rose-50 dark:bg-[#17111e]/20 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-8">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-2" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Error</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">{(error as any)?.message || 'Network error.'}</p>
      </div>
    );
  }

  const filteredOperations = (operations || []).filter((op) => {
    const client = (clients || []).find((c) => c.id === op.clientId);
    const clientName = client?.name || '';
    const clientRfc = client?.rfc || '';
    
    return (
      op.id.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase()) ||
      clientRfc.toLowerCase().includes(search.toLowerCase())
    );
  });

  const locale = language === 'en' ? 'en-US' : 'es-MX';

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-[#1e293b]/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('ops.title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('ops.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportCSV}
            disabled={filteredOperations.length === 0}
            variant="outline"
            className="border-slate-300 dark:border-[#1e293b]/60 text-slate-700 dark:text-slate-300 gap-2 rounded-xl"
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Link href="/operaciones/nueva">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 rounded-xl shadow-md shadow-blue-500/20">
              <Plus className="h-4 w-4" />
              {t('ops.btn_new')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Buscador reactivo */}
      <div className="flex justify-end">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/60 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Tabla del Historial */}
      {filteredOperations.length === 0 ? (
        <Card className="bg-slate-50 dark:bg-[#111625]/20 border-slate-200 dark:border-[#1e293b]/60 py-16 text-center rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-slate-400 dark:text-slate-600 mb-3" />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{t('ops.empty')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-slate-200 dark:border-[#1e293b]/60 rounded-2xl overflow-hidden bg-white dark:bg-[#0c101a] shadow-xl">
          <Table>
            <TableHeader className="bg-slate-100/80 dark:bg-[#111625] border-b border-slate-200 dark:border-[#1e293b]/60">
              <TableRow className="border-b border-slate-200 dark:border-[#1e293b]/60 hover:bg-transparent">
                <TableHead className="w-10"></TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('ops.col_id')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('ops.col_client')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('ops.col_total')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('ops.col_advanced')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('ops.col_commission')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('ops.col_deposit')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4 text-right">{t('ops.col_date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperations.map((op) => {
                const client = (clients || []).find((c) => c.id === op.clientId);
                const isExpanded = expandedOperationId === op.id;

                return (
                  <Fragment key={op.id}>
                    {/* Fila Principal */}
                    <TableRow className="border-b border-slate-100 dark:border-[#1e293b]/20 hover:bg-slate-50 dark:hover:bg-[#1e293b]/20 transition-colors">
                      <TableCell className="py-3.5">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => toggleExpand(op.id)}
                          className="h-6 w-6 text-slate-500 dark:text-slate-400"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-400 py-3.5">
                        {op.id}
                      </TableCell>
                      <TableCell className="py-3.5">
                        {client ? (
                          <Link href={`/clientes/${client.id}`} className="hover:underline font-semibold text-slate-900 dark:text-white">
                            {client.name}
                          </Link>
                        ) : (
                          <span className="text-slate-500 font-medium">Cliente</span>
                        )}
                        {client && <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-mono">{client.rfc}</span>}
                      </TableCell>
                      <TableCell className="font-mono text-slate-700 dark:text-slate-300 py-3.5">
                        {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.totalAmount)}
                      </TableCell>
                      <TableCell className="font-mono text-blue-600 dark:text-blue-400 py-3.5">
                        {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.advancedAmount)}
                      </TableCell>
                      <TableCell className="font-mono text-slate-500 dark:text-slate-400 py-3.5">
                        {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.commission)}
                      </TableCell>
                      <TableCell className="font-mono text-emerald-600 dark:text-emerald-400 font-bold py-3.5">
                        {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.depositAmount)}
                      </TableCell>
                      <TableCell className="text-right text-slate-500 dark:text-slate-400 py-3.5 text-xs font-mono">
                        {new Date(op.createdAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>

                    {/* Fila Expandida con el Desglose de Facturas */}
                    {isExpanded && (
                      <TableRow className="bg-slate-50/80 dark:bg-[#0b0f19] border-b border-slate-200 dark:border-[#1e293b]/20 hover:bg-slate-50 dark:hover:bg-[#0b0f19]">
                        <TableCell colSpan={8} className="p-4">
                          <div className="border border-slate-200 dark:border-[#1e293b]/60 rounded-xl overflow-hidden bg-white dark:bg-[#0a0d15] p-4 space-y-3 shadow-inner">
                            <h4 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('ops.col_invoices')}</h4>
                            <Table>
                              <TableHeader className="bg-slate-100 dark:bg-[#111625]/60">
                                <TableRow className="border-b border-slate-200 dark:border-[#1e293b]/20 hover:bg-transparent">
                                  <TableHead className="text-slate-500 font-semibold py-1.5 text-xs">Folio</TableHead>
                                  <TableHead className="text-slate-500 font-semibold py-1.5 text-xs">Deudor RFC</TableHead>
                                  <TableHead className="text-slate-500 font-semibold py-1.5 text-xs">Deudor Razón Social</TableHead>
                                  <TableHead className="text-slate-500 font-semibold py-1.5 text-xs">Monto</TableHead>
                                  <TableHead className="text-slate-500 font-semibold py-1.5 text-xs">Emisión</TableHead>
                                  <TableHead className="text-slate-500 font-semibold py-1.5 text-xs text-right">Vencimiento</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {op.invoices?.map((inv) => (
                                  <TableRow key={inv.id} className="border-b border-slate-100 dark:border-[#1e293b]/10 last:border-0 hover:bg-transparent">
                                    <TableCell className="font-mono text-xs text-slate-800 dark:text-slate-300 py-2">{inv.folio}</TableCell>
                                    <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-400 py-2">{inv.debtorRfc}</TableCell>
                                    <TableCell className="text-slate-800 dark:text-slate-300 py-2 text-xs">{inv.debtorName}</TableCell>
                                    <TableCell className="font-mono text-slate-800 dark:text-slate-300 text-xs py-2">
                                      {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(inv.amount)}
                                    </TableCell>
                                    <TableCell className="text-slate-500 dark:text-slate-400 text-xs py-2 font-mono">
                                      {new Date(inv.issueDate).toLocaleDateString(locale, {
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                    </TableCell>
                                    <TableCell className="text-right text-slate-500 dark:text-slate-400 text-xs py-2 font-mono">
                                      {new Date(inv.dueDate).toLocaleDateString(locale, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

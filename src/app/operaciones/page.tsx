'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useOperationsQuery } from '@/hooks/useOperations';
import { useClientsQuery } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { exportToCSV } from '@/lib/export-csv';
import { useLanguage } from '@/context/language-context';
import { spring } from '@/lib/motion';

export default function OperacionesPage() {
  const { data: operations, isLoading, isError, error } = useOperationsQuery();
  const { data: clients } = useClientsQuery();
  const [search, setSearch] = useState('');
  const [expandedOperationId, setExpandedOperationId] = useState<string | null>(null);
  const { t, language } = useLanguage();

  const toggleExpand = (id: string) => {
    setExpandedOperationId((prev) => (prev === id ? null : id));
  };

  const handleExportCSV = () => {
    if (!operations || operations.length === 0) return;

    const dataToExport = operations.map((op) => {
      const client = (clients || []).find((c) => c.id === op.clientId);
      return {
        id: op.id,
        cliente: client?.name || op.clientId,
        montoTotal: op.totalAmount,
        montoAvanzado: op.advancedAmount,
        comision: op.commission,
        montoDepositado: op.depositAmount,
        fecha: new Date(op.createdAt).toLocaleDateString(),
      };
    });

    exportToCSV(dataToExport, `operaciones-factorcore-${new Date().toISOString().slice(0, 10)}.csv`, {
      id: 'ID Operación',
      cliente: 'Empresa Cedente',
      montoTotal: 'Monto Total Facturas',
      montoAvanzado: 'Monto Anticipado (85%)',
      comision: 'Comisión (1.5%)',
      montoDepositado: 'Monto Depositado Neto',
      fecha: 'Fecha de Originación',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="relative">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[oklch(0.76_0.12_82)] border-t-transparent" />
          <div className="absolute inset-0 rounded-full blur-md bg-[oklch(0.76_0.12_82/0.3)] animate-pulse" />
        </div>
        <p className="text-xs text-muted-foreground font-mono tracking-wider font-semibold">
          CARGANDO HISTORIAL DE ORIGINACIÓN...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 backdrop-blur-xl">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-2" />
        <h3 className="text-lg font-bold text-foreground mb-1">Error de carga</h3>
        <p className="text-xs text-muted-foreground max-w-md">{(error as any)?.message || 'Network error.'}</p>
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
    <div className="space-y-8">
      {/* Encabezado Institucional */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[oklch(0.76_0.12_82/0.12)] border border-[oklch(0.76_0.12_82/0.25)] text-[10px] font-bold text-[oklch(0.76_0.12_82)] uppercase tracking-wider mb-2">
            Liquidación D+0
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{t('ops.title')}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">{t('ops.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={handleExportCSV}
            disabled={filteredOperations.length === 0}
            variant="outline"
            className="border-border bg-card hover:bg-muted text-foreground gap-2 rounded-xl text-xs h-10 px-4 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Descargar CSV
          </Button>
          <Link href="/operaciones/nueva">
            <Button
              className="font-bold text-xs uppercase tracking-wider text-[oklch(0.07_0_0)] gap-2 rounded-xl shadow-lg h-10 px-5 transition-all hover:brightness-110 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
                boxShadow: '0 2px 14px oklch(0.76 0.12 82 / 25%)',
              }}
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              {t('ops.btn_new')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Buscador reactivo */}
      <div className="flex justify-end">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/50 border border-border hover:border-foreground/20 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[oklch(0.76_0.12_82)] focus:ring-2 focus:ring-[oklch(0.76_0.12_82/0.2)] transition-all duration-200"
          />
        </div>
      </div>

      {/* Tabla del Historial */}
      {filteredOperations.length === 0 ? (
        <Card className="bg-card border border-border py-16 text-center rounded-2xl shadow-sm">
          <CardContent className="flex flex-col items-center justify-center">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-foreground text-sm font-semibold">{t('ops.empty')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border">
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="w-10 pl-4" />
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">{t('ops.col_id')}</TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">{t('ops.col_client')}</TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">{t('ops.col_total')}</TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">{t('ops.col_advanced')}</TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">{t('ops.col_commission')}</TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">{t('ops.col_deposit')}</TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4 text-right pr-6">{t('ops.col_date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperations.map((op, index) => {
                const client = (clients || []).find((c) => c.id === op.clientId);
                const isExpanded = expandedOperationId === op.id;

                return (
                  <Fragment key={op.id}>
                    {/* Fila Principal */}
                    <motion.tr
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, ...spring }}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group"
                    >
                      <TableCell className="py-4 pl-4">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => toggleExpand(op.id)}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-[oklch(0.76_0.12_82)]" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground py-4">
                        {op.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="py-4">
                        {client ? (
                          <Link href={`/clientes/${client.id}`} className="hover:text-[oklch(0.76_0.12_82)] font-semibold text-foreground transition-colors block">
                            {client.name}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground font-medium">Cliente</span>
                        )}
                        {client && <span className="block text-[10px] text-muted-foreground font-mono">{client.rfc}</span>}
                      </TableCell>
                      <TableCell className="font-mono text-foreground py-4 text-xs font-semibold">
                        {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.totalAmount)}
                      </TableCell>
                      <TableCell className="font-mono text-[oklch(0.76_0.12_82)] py-4 text-xs font-semibold">
                        {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.advancedAmount)}
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground py-4 text-xs">
                        {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.commission)}
                      </TableCell>
                      <TableCell className="font-mono text-emerald-500 font-bold py-4 text-xs">
                        {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(op.depositAmount)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground py-4 text-xs font-mono pr-6">
                        {new Date(op.createdAt).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                    </motion.tr>

                    {/* Fila Expandida con Desglose */}
                    <AnimatePresence>
                      {isExpanded && (
                        <TableRow className="bg-muted/20 border-b border-border hover:bg-muted/20">
                          <TableCell colSpan={8} className="p-4 sm:p-6">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ ...spring }}
                              className="border border-border rounded-xl overflow-hidden bg-card p-4 sm:p-5 space-y-3 shadow-inner"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-border">
                                <h4 className="text-[10px] font-bold text-[oklch(0.76_0.12_82)] uppercase tracking-widest flex items-center gap-2">
                                  <FileText className="h-3.5 w-3.5" /> {t('ops.col_invoices')} ({op.invoices?.length || 0})
                                </h4>
                                <span className="text-[10px] text-muted-foreground font-mono">ID: {op.id}</span>
                              </div>
                              <Table>
                                <TableHeader className="bg-muted/40">
                                  <TableRow className="border-b border-border hover:bg-transparent">
                                    <TableHead className="text-muted-foreground font-semibold py-2 text-xs">Folio</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold py-2 text-xs">Deudor RFC</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold py-2 text-xs">Deudor Razón Social</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold py-2 text-xs">Monto</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold py-2 text-xs">Emisión</TableHead>
                                    <TableHead className="text-muted-foreground font-semibold py-2 text-xs text-right">Vencimiento</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {op.invoices?.map((inv) => (
                                    <TableRow key={inv.id} className="border-b border-border/40 last:border-0 hover:bg-muted/30">
                                      <TableCell className="font-mono text-xs text-foreground py-2.5 font-bold">{inv.folio}</TableCell>
                                      <TableCell className="font-mono text-xs text-muted-foreground py-2.5">{inv.debtorRfc}</TableCell>
                                      <TableCell className="text-foreground py-2.5 text-xs">{inv.debtorName}</TableCell>
                                      <TableCell className="font-mono text-[oklch(0.76_0.12_82)] text-xs py-2.5 font-semibold">
                                        {new Intl.NumberFormat(locale, { style: 'currency', currency: 'MXN' }).format(inv.amount)}
                                      </TableCell>
                                      <TableCell className="text-muted-foreground text-xs py-2.5 font-mono">
                                        {new Date(inv.issueDate).toLocaleDateString(locale, {
                                          month: 'short',
                                          day: 'numeric',
                                        })}
                                      </TableCell>
                                      <TableCell className="text-right text-muted-foreground text-xs py-2.5 font-mono">
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
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
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

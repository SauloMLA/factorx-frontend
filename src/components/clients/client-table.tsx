'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Search, Eye, AlertCircle } from 'lucide-react';
import { useClientsQuery } from '@/hooks/useClients';
import ClientStatusBadge from '@/components/clients/status-badge';
import ApproveClientDialog from '@/components/clients/approve-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { spring } from '@/lib/motion';

export default function ClientTable() {
  const { data: clients, isLoading, isError } = useClientsQuery();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING'>('ALL');
  const [search, setSearch] = useState('');
  const { t, language } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[oklch(0.76_0.12_82)] border-t-transparent" />
        <p className="text-xs text-muted-foreground font-mono font-medium">CARGANDO CLIENTES...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="bg-rose-500/10 border-rose-500/20 py-8 text-center rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center text-rose-500">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p className="text-sm font-semibold">{t('clients.error_load')}</p>
        </CardContent>
      </Card>
    );
  }

  const filteredClients = (clients || []).filter((client) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'APPROVED' && client.status === 'APPROVED') ||
      (statusFilter === 'PENDING' && client.status === 'PENDING');

    const matchesSearch =
      client.rfc.toLowerCase().includes(search.toLowerCase()) ||
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const locale = language === 'en' ? 'en-US' : 'es-MX';

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Tabs
          value={statusFilter}
          onValueChange={(val) => setStatusFilter(val as any)}
          className="w-full sm:w-auto"
        >
          <TabsList className="h-[42px] grid w-full sm:w-[460px] grid-cols-3 p-1 bg-muted/60 rounded-xl border border-border">
            <TabsTrigger
              value="ALL"
              className="text-[11px] sm:text-xs px-2 data-[state=active]:bg-[oklch(0.76_0.12_82/0.15)] data-[state=active]:text-[oklch(0.76_0.12_82)] rounded-lg transition-all font-semibold"
            >
              {t('clients.tab_all')} ({clients?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="APPROVED"
              className="text-[11px] sm:text-xs px-2 data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-500 rounded-lg transition-all font-semibold"
            >
              {t('clients.tab_approved')} ({clients?.filter((c) => c.status === 'APPROVED').length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="PENDING"
              className="text-[11px] sm:text-xs px-2 data-[state=active]:bg-[oklch(0.76_0.12_82/0.15)] data-[state=active]:text-[oklch(0.76_0.12_82)] rounded-lg transition-all font-semibold"
            >
              {t('clients.tab_pending')} ({clients?.filter((c) => c.status === 'PENDING').length || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('clients.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/50 border border-border hover:border-foreground/20 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[oklch(0.76_0.12_82)] focus:ring-2 focus:ring-[oklch(0.76_0.12_82/0.2)] transition-all duration-200"
          />
        </div>
      </div>

      {/* Tabla de Resultados */}
      {filteredClients.length === 0 ? (
        <Card className="bg-card border border-border py-16 text-center rounded-2xl shadow-sm">
          <CardContent className="flex flex-col items-center justify-center">
            <Building2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-foreground text-sm font-semibold">{t('clients.empty')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('clients.empty_sub')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border">
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4 pl-6">
                  {t('clients.col_name')}
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">
                  {t('clients.col_rfc')}
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">
                  {t('clients.col_email')}
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">
                  {t('clients.col_status')}
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">
                  {t('clients.col_registered')}
                </TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4 text-right pr-6">
                  {t('clients.col_actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredClients.map((client, index) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, ...spring }}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors group"
                  >
                    <TableCell className="font-semibold text-foreground py-4 pl-6 group-hover:text-[oklch(0.76_0.12_82)] transition-colors">
                      {client.name}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground py-4">{client.rfc}</TableCell>
                    <TableCell className="text-muted-foreground py-4 text-xs">{client.email}</TableCell>
                    <TableCell className="py-4">
                      <ClientStatusBadge status={client.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4 text-xs font-mono">
                      {new Date(client.createdAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6">
                      <div className="flex justify-end items-center gap-2">
                        <Link href={`/clientes/${client.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground hover:bg-muted gap-1.5 rounded-xl text-xs h-8 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {t('clients.view_file')}
                          </Button>
                        </Link>

                        {client.status === 'PENDING' && (
                          <ApproveClientDialog
                            clientId={client.id}
                            clientName={client.name}
                            clientRfc={client.rfc}
                          />
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

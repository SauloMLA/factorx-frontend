'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Search, AlertCircle, FileText } from 'lucide-react';
import { useClientsQuery } from '@/hooks/useClients';
import ClientStatusBadge from './status-badge';
import ApproveClientDialog from './approve-dialog';
import { useLanguage } from '@/context/language-context';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ClientTable() {
  const { data: clients, isLoading, isError, error } = useClientsQuery();
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING'>('ALL');

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
          <TabsList className="h-[38px] grid w-full sm:w-[450px] grid-cols-3 p-1 bg-slate-100 dark:bg-[#111625] rounded-xl border border-slate-200 dark:border-[#1e293b]/60">
            <TabsTrigger value="ALL" className="text-[11px] sm:text-xs px-1 sm:px-3 truncate">
              {t('clients.tab_all')} ({clients?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="APPROVED" className="text-[11px] sm:text-xs px-1 sm:px-3 truncate">
              {t('clients.tab_approved')} ({clients?.filter(c => c.status === 'APPROVED').length || 0})
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="text-[11px] sm:text-xs px-1 sm:px-3 truncate">
              {t('clients.tab_pending')} ({clients?.filter(c => c.status === 'PENDING').length || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={t('clients.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/60 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Tabla de Resultados */}
      {filteredClients.length === 0 ? (
        <Card className="bg-slate-50 dark:bg-[#111625]/20 border-slate-200 dark:border-[#1e293b]/60 py-16 text-center rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-slate-400 dark:text-slate-600 mb-3" />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{t('clients.empty')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{t('clients.empty_sub')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-slate-200 dark:border-[#1e293b]/60 rounded-2xl overflow-hidden bg-white dark:bg-[#0c101a] shadow-xl">
          <Table>
            <TableHeader className="bg-slate-100/80 dark:bg-[#111625] border-b border-slate-200 dark:border-[#1e293b]/60">
              <TableRow className="border-b border-slate-200 dark:border-[#1e293b]/60 hover:bg-transparent">
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('clients.col_name')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('clients.col_rfc')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('clients.col_email')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('clients.col_status')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('clients.col_registered')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4 text-right">{t('clients.col_actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="border-b border-slate-100 dark:border-[#1e293b]/20 hover:bg-slate-50 dark:hover:bg-[#1e293b]/20 transition-colors">
                  <TableCell className="font-semibold text-slate-900 dark:text-white py-3.5">
                    {client.name}
                  </TableCell>
                  <TableCell className="font-mono text-slate-700 dark:text-slate-300 py-3.5">{client.rfc}</TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400 py-3.5">{client.email}</TableCell>
                  <TableCell className="py-3.5">
                    <ClientStatusBadge status={client.status} />
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400 py-3.5 text-xs font-mono">
                    {new Date(client.createdAt).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right py-3.5">
                    <div className="flex justify-end items-center gap-2">
                      <Link href={`/clientes/${client.id}`}>
                        <Button size="sm" variant="ghost" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 gap-1.5 rounded-xl">
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

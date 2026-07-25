'use client';

import { useAuditLogs } from '@/hooks/useAuditLogs';
import { useState } from 'react';
import { exportToCSV } from '@/lib/export-csv';
import { Download, Filter, Terminal, ShieldAlert, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return dateString;
  }
}

function getActionBadgeStyle(action: string) {
  switch (action) {
    case 'CREATE':
    case 'REGISTER_CLIENT':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'APPROVE':
    case 'APPROVE_CLIENT':
      return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
    case 'CREATE_OPERATION':
      return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
    case 'LOGIN':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    default:
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  }
}

export function AuditTable() {
  const { t } = useLanguage();
  const [entityFilter, setEntityFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const { data: logs, isLoading, error } = useAuditLogs({
    entity: entityFilter || undefined,
    action: actionFilter || undefined,
  });

  const handleExportCSV = () => {
    if (!logs || logs.length === 0) return;
    exportToCSV(logs, 'bitacora_auditoria', {
      id: 'ID Registro',
      timestamp: 'Fecha',
      performedBy: 'Usuario ID',
      action: 'Acción',
      entity: 'Entidad',
      entityId: 'ID Entidad',
      ip: 'Dirección IP',
      userAgent: 'Navegador/UserAgent',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('audit.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <span>Error al cargar la bitácora</span>
        </div>
        <p className="font-mono">{error instanceof Error ? error.message : 'No se pudo obtener la información de auditoría.'}</p>
        {error instanceof Error && (error.message.includes('Forbidden') || error.message.includes('403')) && (
          <p className="text-[11px] text-rose-500 font-semibold mt-2">
            {t('audit.error_permission')}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Acciones */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Filter className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={t('audit.filter_entity')}
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/60 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="relative flex-1 sm:w-64">
            <Terminal className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={t('audit.filter_action')}
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/60 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={!logs || logs.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-40 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          {t('audit.export_csv')}
        </button>
      </div>

      {/* Tabla Estilizada */}
      <div className="overflow-hidden border border-slate-200 dark:border-[#1e293b]/60 rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-[#111625] border-b border-slate-200 dark:border-[#1e293b]/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">{t('audit.col_date')}</th>
                <th className="py-3.5 px-4">{t('audit.col_user')}</th>
                <th className="py-3.5 px-4">{t('audit.col_action')}</th>
                <th className="py-3.5 px-4">{t('audit.col_entity')}</th>
                <th className="py-3.5 px-4">{t('audit.col_entity_id')}</th>
                <th className="py-3.5 px-4 text-right">{t('audit.col_details')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]/40 text-xs">
              {logs?.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-[#1e293b]/20 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap">
                    {log.performedBy}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getActionBadgeStyle(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {log.entity}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 truncate max-w-xs whitespace-nowrap">
                    {log.entityId}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <details className="group cursor-pointer">
                      <summary className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline list-none">
                        <span>{t('audit.view_changes')}</span>
                        <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="mt-3 text-left p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2 border border-slate-800 shadow-xl overflow-x-auto">
                        {log.oldValue && (
                          <div>
                            <span className="text-amber-400 font-bold">{t('audit.old_value')}:</span>
                            <pre className="mt-1 p-2 rounded-lg bg-slate-950 text-amber-200/90 whitespace-pre-wrap">{typeof log.oldValue === 'string' ? log.oldValue : JSON.stringify(log.oldValue, null, 2)}</pre>
                          </div>
                        )}
                        {log.newValue && (
                          <div>
                            <span className="text-emerald-400 font-bold">{t('audit.new_value')}:</span>
                            <pre className="mt-1 p-2 rounded-lg bg-slate-950 text-emerald-200/90 whitespace-pre-wrap">{typeof log.newValue === 'string' ? log.newValue : JSON.stringify(log.newValue, null, 2)}</pre>
                          </div>
                        )}
                        <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-800 flex flex-wrap justify-between gap-2">
                          <span>IP: <strong className="text-slate-200">{log.ip || 'N/A'}</strong></span>
                          <span className="truncate max-w-md">UA: <strong className="text-slate-200">{log.userAgent || 'N/A'}</strong></span>
                        </div>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}

              {logs?.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                    {t('audit.no_records')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

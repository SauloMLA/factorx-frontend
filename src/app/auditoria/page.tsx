'use client';

import { AuditTable } from '@/components/auditoria/audit-table';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function AuditoriaPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Encabezado Principal */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-[#1e293b]/60 pb-6">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('audit.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {t('audit.subtitle')}
          </p>
        </div>
      </div>

      {/* Contenedor Principal de Auditoría (Glassmorphic Dark Mode Ready) */}
      <div className="bg-white dark:bg-[#0b0f19]/90 border border-slate-200 dark:border-[#1e293b]/60 rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-md">
        <AuditTable />
      </div>
    </div>
  );
}

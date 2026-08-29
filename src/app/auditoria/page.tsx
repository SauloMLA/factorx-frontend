'use client';

import { AuditTable } from '@/components/auditoria/audit-table';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function AuditoriaPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Encabezado Principal */}
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div
          className="h-12 w-12 rounded-2xl flex items-center justify-center text-[oklch(0.07_0_0)] shadow-lg shrink-0"
          style={{
            background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
            boxShadow: '0 4px 20px oklch(0.76 0.12 82 / 30%)',
          }}
        >
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t('audit.title')}
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed font-medium">
            {t('audit.subtitle')}
          </p>
        </div>
      </div>

      {/* Contenedor Principal de Auditoría */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8 backdrop-blur-md">
        <AuditTable />
      </div>
    </div>
  );
}

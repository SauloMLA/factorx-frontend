'use client';

import ClientTable from '@/components/clients/client-table';
import RegisterClientModal from '@/components/clients/register-modal';
import { useLanguage } from '@/context/language-context';

export default function ClientesPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Encabezado y Botón de Registro */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-[#1e293b]/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('clients.title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('clients.subtitle')}
          </p>
        </div>
        <RegisterClientModal />
      </div>

      {/* Tabla de Clientes con Filtros y Búsqueda */}
      <ClientTable />
    </div>
  );
}

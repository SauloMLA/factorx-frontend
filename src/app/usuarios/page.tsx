'use client';

import UsersTable from '@/components/usuarios/users-table';
import { useLanguage } from '@/context/language-context';

export default function UsuariosPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-[#1e293b]/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('users.title')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('users.subtitle')}
          </p>
        </div>
      </div>

      <UsersTable />
    </div>
  );
}

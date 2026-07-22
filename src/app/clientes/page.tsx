'use client';

import ClientTable from '@/components/clients/client-table';
import RegisterClientModal from '@/components/clients/register-modal';

export default function ClientesPage() {
  return (
    <div className="space-y-8">
      {/* Encabezado y Botón de Registro */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-[#1e293b]/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Directorio de Clientes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestión y control de empresas para originación financiera. Aprueba clientes pendientes antes de iniciar operaciones.
          </p>
        </div>
        <RegisterClientModal />
      </div>

      {/* Tabla de Clientes con Filtros y Búsqueda */}
      <ClientTable />
    </div>
  );
}

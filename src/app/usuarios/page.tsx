'use client';

import UsersTable from '@/components/usuarios/users-table';

export default function UsuariosPage() {
  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-[#1e293b]/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Gestión de Usuarios</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Administra los accesos al sistema. Registra nuevos operadores y administradores.
          </p>
        </div>
        {/* Aquí iría el modal de crear usuario en el futuro */}
        {/* <CreateUserModal /> */}
      </div>

      <UsersTable />
    </div>
  );
}

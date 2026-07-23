'use client';

import { useState } from 'react';
import { Search, AlertCircle, Users, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { useUsersQuery } from '@/hooks/useUsers';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UsersTable() {
  const { data: users, isLoading, isError, error } = useUsersQuery();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMINISTRATOR' | 'OPERATOR'>('ALL');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Cargando base de datos de usuarios...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-rose-50 dark:bg-[#17111e]/20 border border-rose-200 dark:border-rose-500/20 rounded-xl p-8">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-2" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Acceso Denegado / Error</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">{(error as any)?.response?.data?.message || (error as any)?.message || 'Ocurrió un problema de red o no tienes permisos para ver esta lista.'}</p>
      </div>
    );
  }

  const filteredUsers = (users || []).filter((user) => {
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Pestañas de Rol */}
        <Tabs
          value={roleFilter}
          onValueChange={(val) => setRoleFilter(val as any)}
          className="w-full sm:w-auto"
        >
          <TabsList className="h-[38px] grid w-full sm:w-[450px] grid-cols-3 p-1 bg-slate-100 dark:bg-[#111625] rounded-lg border border-slate-200 dark:border-[#1e293b]/40">
            <TabsTrigger value="ALL">
              Todos ({users?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="ADMINISTRATOR">
              Admins ({users?.filter(u => u.role === 'ADMINISTRATOR').length || 0})
            </TabsTrigger>
            <TabsTrigger value="OPERATOR">
              Operadores ({users?.filter(u => u.role === 'OPERATOR').length || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Input Buscador */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por Nombre o Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/40 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Tabla de Resultados */}
      {filteredUsers.length === 0 ? (
        <Card className="bg-slate-50 dark:bg-[#111625]/20 border-slate-200 dark:border-[#1e293b]/40 py-16 text-center">
          <CardContent className="flex flex-col items-center justify-center">
            <Users className="h-12 w-12 text-slate-400 dark:text-slate-600 mb-3" />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">No se encontraron usuarios en este criterio</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-slate-200 dark:border-[#1e293b]/40 rounded-xl overflow-hidden bg-white dark:bg-[#0d121f] shadow-xs">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-[#111625] border-b border-slate-200 dark:border-[#1e293b]/40">
              <TableRow className="border-b border-slate-200 dark:border-[#1e293b]/40 hover:bg-transparent">
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">Nombre</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">Email</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">Rol</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">Estado</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">Registro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-b border-slate-100 dark:border-[#1e293b]/20 hover:bg-slate-50 dark:hover:bg-[#1e293b]/10 transition-colors">
                  <TableCell className="font-semibold text-slate-900 dark:text-white py-3.5">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400 py-3.5">{user.email}</TableCell>
                  <TableCell className="py-3.5">
                    {user.role === 'ADMINISTRATOR' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Administrador
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <Users className="w-3.5 h-3.5" />
                        Operador
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                        <XCircle className="w-3.5 h-3.5" />
                        Inactivo
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400 py-3.5 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
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

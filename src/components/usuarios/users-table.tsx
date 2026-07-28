'use client';

import { useState } from 'react';
import { Search, AlertCircle, Users, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { useUsersQuery, User } from '@/hooks/useUsers';
import { useLanguage } from '@/context/language-context';

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
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMINISTRATOR' | 'OPERATOR'>('ALL');

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

  const filteredUsers = ((users as User[]) || []).filter((user: User) => {
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const locale = language === 'en' ? 'en-US' : 'es-MX';

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Tabs
          value={roleFilter}
          onValueChange={(val) => setRoleFilter(val as any)}
          className="w-full sm:w-auto"
        >
          <TabsList className="h-[38px] grid w-full sm:w-[450px] grid-cols-3 p-1 bg-slate-100 dark:bg-[#111625] rounded-xl border border-slate-200 dark:border-[#1e293b]/60">
            <TabsTrigger value="ALL" className="text-[11px] sm:text-xs px-1 sm:px-3 truncate">
              {t('clients.tab_all')} ({users?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="ADMINISTRATOR" className="text-[11px] sm:text-xs px-1 sm:px-3 truncate">
              Admins ({((users as User[]) || []).filter((u: User) => u.role === 'ADMINISTRATOR').length || 0})
            </TabsTrigger>
            <TabsTrigger value="OPERATOR" className="text-[11px] sm:text-xs px-1 sm:px-3 truncate">
              Operators ({((users as User[]) || []).filter((u: User) => u.role === 'OPERATOR').length || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/60 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Tabla de Resultados */}
      {filteredUsers.length === 0 ? (
        <Card className="bg-slate-50 dark:bg-[#111625]/20 border-slate-200 dark:border-[#1e293b]/60 py-16 text-center rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center">
            <Users className="h-12 w-12 text-slate-400 dark:text-slate-600 mb-3" />
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-slate-200 dark:border-[#1e293b]/60 rounded-2xl overflow-hidden bg-white dark:bg-[#0c101a] shadow-xl">
          <Table>
            <TableHeader className="bg-slate-100/80 dark:bg-[#111625] border-b border-slate-200 dark:border-[#1e293b]/60">
              <TableRow className="border-b border-slate-200 dark:border-[#1e293b]/60 hover:bg-transparent">
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('users.col_name')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('users.col_email')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('users.col_role')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('users.col_status')}</TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-4">{t('clients.col_registered')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-b border-slate-100 dark:border-[#1e293b]/20 hover:bg-slate-50 dark:hover:bg-[#1e293b]/20 transition-colors">
                  <TableCell className="font-semibold text-slate-900 dark:text-white py-3.5">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400 py-3.5 font-mono">{user.email}</TableCell>
                  <TableCell className="py-3.5">
                    {user.role === 'ADMINISTRATOR' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {t('header.admin')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <Users className="w-3.5 h-3.5" />
                        {t('header.operator')}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t('users.active')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        {t('users.inactive')}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400 py-3.5 text-xs font-mono">
                    {new Date(user.createdAt).toLocaleDateString(locale, {
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

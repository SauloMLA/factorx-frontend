'use client';

import { useState } from 'react';
import { Search, AlertCircle, Users, Shield, CheckCircle2, XCircle } from 'lucide-react';
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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[oklch(0.76_0.12_82)] border-t-transparent" />
        <p className="text-xs text-muted-foreground font-mono font-medium">{t('common.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="bg-rose-500/10 border-rose-500/20 py-8 text-center rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center text-rose-500">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p className="text-sm font-semibold">{(error as any)?.message || 'Network error.'}</p>
        </CardContent>
      </Card>
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
          <TabsList className="h-[42px] grid w-full sm:w-[450px] grid-cols-3 p-1 bg-muted/60 rounded-xl border border-border">
            <TabsTrigger value="ALL" className="text-[11px] sm:text-xs px-1 sm:px-3 truncate data-[state=active]:bg-[oklch(0.76_0.12_82/0.15)] data-[state=active]:text-[oklch(0.76_0.12_82)] rounded-lg font-semibold">
              {t('clients.tab_all')} ({users?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="ADMINISTRATOR" className="text-[11px] sm:text-xs px-1 sm:px-3 truncate data-[state=active]:bg-[oklch(0.76_0.12_82/0.15)] data-[state=active]:text-[oklch(0.76_0.12_82)] rounded-lg font-semibold">
              Admins ({((users as User[]) || []).filter((u: User) => u.role === 'ADMINISTRATOR').length || 0})
            </TabsTrigger>
            <TabsTrigger value="OPERATOR" className="text-[11px] sm:text-xs px-1 sm:px-3 truncate data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-500 rounded-lg font-semibold">
              Operators ({((users as User[]) || []).filter((u: User) => u.role === 'OPERATOR').length || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/50 border border-border hover:border-foreground/20 rounded-xl py-2 pl-10 pr-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[oklch(0.76_0.12_82)] focus:ring-2 focus:ring-[oklch(0.76_0.12_82/0.2)] transition-all duration-200"
          />
        </div>
      </div>

      {/* Tabla de Resultados */}
      {filteredUsers.length === 0 ? (
        <Card className="bg-card border border-border py-16 text-center rounded-2xl shadow-sm">
          <CardContent className="flex flex-col items-center justify-center">
            <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-foreground text-sm font-semibold">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border">
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">{t('users.col_name')}</TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">{t('users.col_email')}</TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">{t('users.col_role')}</TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">{t('users.col_status')}</TableHead>
                <TableHead className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider py-4">{t('clients.col_registered')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold text-foreground py-3.5">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground py-3.5 font-mono text-xs">{user.email}</TableCell>
                  <TableCell className="py-3.5">
                    {user.role === 'ADMINISTRATOR' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[oklch(0.76_0.12_82/0.15)] text-[oklch(0.76_0.12_82)] border border-[oklch(0.76_0.12_82/0.3)]">
                        <Shield className="w-3 h-3" />
                        {t('header.admin')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <Users className="w-3 h-3" />
                        {t('header.operator')}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3.5">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {t('users.active')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border">
                        <XCircle className="w-3 h-3" />
                        {t('users.inactive')}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground py-3.5 text-xs font-mono">
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

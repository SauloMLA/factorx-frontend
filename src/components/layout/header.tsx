'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, LogOut, Shield } from 'lucide-react';
import { clientService } from '@/services/client.service';
import { useQuery } from '@tanstack/react-query';
import { LanguageToggle } from '@/components/language-toggle';
import { NotificationDropdown } from '@/components/layout/notification-dropdown';
import { useLanguage } from '@/context/language-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Traer lista de clientes para buscador rápido
  const { data: clients } = useQuery({
    queryKey: ['clients', 'quick-search'],
    queryFn: () => clientService.getClients(),
    enabled: !!user,
  });

  const filteredClients = searchQuery.trim()
    ? (clients || []).filter(
        (c) =>
          c.rfc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectClient = (clientId: string) => {
    setSearchQuery('');
    setShowResults(false);
    router.push(`/clientes/${clientId}`);
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-[#1e293b]/60 bg-white/90 dark:bg-[#080c14]/90 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-200">
      {/* Buscador Rápido de Clientes */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          placeholder={t('header.search_placeholder')}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="w-full bg-slate-100 dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/60 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
        />

        {/* Dropdown de Resultados de Búsqueda */}
        {showResults && filteredClients.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-[#1e293b]/60 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => handleSelectClient(client.id)}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-[#1e293b]/40 border-b border-slate-100 dark:border-[#1e293b]/20 last:border-0 transition-colors duration-150 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{client.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{client.rfc}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  client.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}>
                  {client.status}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Acciones: Toggle Idioma + Notificaciones + Perfil */}
      <div className="flex items-center gap-3.5">
        {/* Toggle de Idioma (Español / Inglés) */}
        <LanguageToggle />

        {/* Notificaciones del Sistema */}
        <NotificationDropdown />

        <div className="h-6 w-px bg-slate-200 dark:bg-[#1e293b]/60 mx-1"></div>

        {/* Perfil del Usuario Autenticado */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 hover:opacity-80 transition-opacity text-left outline-none rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-[#1e293b]/30">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1 font-medium">
                  <Shield className="w-2.5 h-2.5 inline text-blue-500" />
                  {user.role === UserRole.ADMINISTRATOR ? t('header.admin') : t('header.operator')}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 dark:bg-[#0f1422]/95 backdrop-blur-md border border-slate-200 dark:border-[#1e293b]/60 shadow-xl shadow-slate-200/20 dark:shadow-black/60 rounded-xl p-1.5">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-800 dark:text-slate-200">{user.name}</p>
                    <p className="text-xs leading-none text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-[#1e293b]/40 my-1" />
              <DropdownMenuItem className="cursor-pointer text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-[#1e293b]/40 rounded-lg text-xs font-medium" onClick={() => router.push('/perfil')}>
                <User className="mr-2 h-4 w-4 text-blue-500" />
                <span>{t('header.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-[#1e293b]/40 my-1" />
              <DropdownMenuItem className="cursor-pointer text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 focus:text-rose-600 rounded-lg text-xs font-medium" onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('header.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
          >
            <User className="h-3.5 w-3.5" /> {t('header.login')}
          </button>
        )}
      </div>
    </header>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Search, User, LogOut, Shield, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clientService } from '@/services/client.service';
import { useQuery } from '@tanstack/react-query';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
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
import { spring } from '@/lib/motion';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export default function Header({ onToggleMobileMenu }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Quick search client query
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

  const getBreadcrumbTitle = () => {
    if (pathname === '/') return t('nav.dashboard');
    if (pathname.startsWith('/clientes')) return t('nav.clients');
    if (pathname.startsWith('/operaciones/nueva')) return t('nav.new_operation');
    if (pathname.startsWith('/operaciones')) return t('nav.operations');
    if (pathname.startsWith('/usuarios')) return t('nav.users');
    if (pathname.startsWith('/auditoria')) return t('nav.audit');
    if (pathname.startsWith('/perfil')) return t('header.profile');
    return '';
  };

  return (
    <header
      className={`h-16 border-b transition-all duration-300 flex items-center justify-between px-4 sm:px-6 md:px-8 sticky top-0 z-40 gap-3 ${
        scrolled
          ? 'bg-background/85 border-border backdrop-blur-xl shadow-md'
          : 'bg-background/60 border-border/60 backdrop-blur-md'
      }`}
    >
      {/* Left side: Hamburger + Breadcrumb + Buscador */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {onToggleMobileMenu && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        )}

        {/* Dynamic Breadcrumb with Emil Kowalski spring transition */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground select-none">
          <span className="font-medium">Terminal</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
          <AnimatePresence mode="wait">
            <motion.span
              key={pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ ...spring }}
              className="text-[oklch(0.76_0.12_82)] dark:text-[oklch(0.76_0.12_82)] font-bold"
            >
              {getBreadcrumbTitle()}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Buscador Rápido de Clientes */}
        <div className="relative w-full max-w-[170px] sm:max-w-xs md:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
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
            onBlur={() => setTimeout(() => setShowResults(false), 220)}
            className="w-full bg-muted/50 border border-border hover:border-foreground/20 rounded-xl py-1.5 sm:py-2 pl-9 sm:pl-10 pr-3 text-xs sm:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-[oklch(0.76_0.12_82)] focus:ring-2 focus:ring-[oklch(0.76_0.12_82/0.2)] transition-all duration-200"
          />

          {/* Dropdown de Resultados de Búsqueda */}
          <AnimatePresence>
            {showResults && filteredClients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ ...spring }}
                className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 p-1"
              >
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectClient(client.id)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-muted rounded-lg transition-colors duration-150 flex items-center justify-between group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground group-hover:text-[oklch(0.76_0.12_82)] transition-colors truncate">
                        {client.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono">{client.rfc}</p>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold tracking-wider shrink-0 ml-2 ${
                        client.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-[oklch(0.76_0.12_82/0.15)] text-[oklch(0.76_0.12_82)] border border-[oklch(0.76_0.12_82/0.3)]'
                      }`}
                    >
                      {client.status}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Acciones: Toggle Idioma + Toggle Tema + Notificaciones + Perfil */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <LanguageToggle />
        <ThemeToggle />
        <NotificationDropdown />

        <div className="h-5 w-px bg-border mx-1"></div>

        {/* Perfil del Usuario Autenticado */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2.5 hover:opacity-90 transition-all outline-none rounded-xl p-1.5 hover:bg-muted/60 cursor-pointer">
              <div
                className="h-8 w-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 text-[oklch(0.07_0_0)] shadow-md"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
                  boxShadow: '0 2px 10px oklch(0.76 0.12 82 / 25%)',
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-foreground leading-tight">{user.name}</p>
                <p className="text-[10px] text-muted-foreground flex items-center justify-end gap-1 font-medium">
                  <Shield className="w-2.5 h-2.5 inline text-[oklch(0.76_0.12_82)]" />
                  {user.role === UserRole.ADMINISTRATOR ? t('header.admin') : t('header.operator')}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-popover border border-border shadow-2xl rounded-xl p-1.5 text-popover-foreground"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-foreground">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground font-mono">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-border my-1" />
              <DropdownMenuItem
                className="cursor-pointer text-foreground hover:bg-muted rounded-lg text-xs font-medium"
                onClick={() => router.push('/perfil')}
              >
                <User className="mr-2 h-4 w-4 text-[oklch(0.76_0.12_82)]" />
                <span>{t('header.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border my-1" />
              <DropdownMenuItem
                className="cursor-pointer text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-500/10 rounded-lg text-xs font-medium"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('header.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl text-[oklch(0.07_0_0)] font-bold transition-all shadow-lg hover:brightness-110 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
              boxShadow: '0 2px 12px oklch(0.76 0.12 82 / 20%)',
            }}
          >
            <User className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{t('header.login')}</span>
          </button>
        )}
      </div>
    </header>
  );
}

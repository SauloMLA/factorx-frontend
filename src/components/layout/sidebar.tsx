'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  PlusCircle,
  User,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { useLanguage } from '@/context/language-context';
import { spring } from '@/lib/motion';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  if (pathname === '/login') return null;

  const baseMenuItems = [
    { name: t('nav.dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('nav.clients'), href: '/clientes', icon: Users },
    { name: t('nav.operations'), href: '/operaciones', icon: FileSpreadsheet },
    { name: t('nav.new_operation'), href: '/operaciones/nueva', icon: PlusCircle },
    { name: t('nav.users'), href: '/usuarios', icon: User },
    { name: t('nav.audit'), href: '/auditoria', icon: ShieldAlert, adminOnly: true },
  ];

  const visibleItems = baseMenuItems.filter(
    (item) => !item.adminOnly || user?.role === UserRole.ADMINISTRATOR
  );

  const userInitial = user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : undefined }}
        className={cn(
          'w-64 flex flex-col justify-between z-50',
          'border-r border-border',
          'bg-sidebar text-sidebar-foreground',
          'fixed inset-y-0 left-0 h-full transition-transform duration-300 ease-in-out',
          'lg:sticky lg:top-0 lg:h-screen lg:flex lg:translate-x-0',
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top section */}
        <div>
          {/* Brand */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-border">
            <Link
              href="/"
              onClick={() => onClose?.()}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: -3 }}
                transition={{ ...spring, stiffness: 500 }}
                className="h-8 w-8 rounded-xl flex items-center justify-center font-black text-sm tracking-tighter text-[oklch(0.07_0_0)] shadow-md"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
                  boxShadow: '0 4px 16px oklch(0.76 0.12 82 / 30%)',
                }}
              >
                FC
              </motion.div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground leading-none">
                  Factor
                  <span className="text-gradient-gold">Core</span>
                </span>
                <span className="text-[9px] text-muted-foreground font-semibold tracking-widest uppercase leading-none mt-0.5">
                  Terminal v2.0
                </span>
              </div>
            </Link>

            {/* Mobile close */}
            {onClose && (
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={spring}
                className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </div>

          {/* Nav */}
          <nav className="p-3 space-y-0.5 mt-2">
            <p className="text-[9px] font-bold text-muted-foreground uppercase px-3 mb-3 tracking-widest">
              {user?.role === UserRole.ADMINISTRATOR ? t('nav.console_admin') : t('nav.console_operator')}
            </p>

            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 group cursor-pointer',
                    isActive
                      ? 'text-[oklch(0.76_0.12_82)] font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {/* Sliding active pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-xl bg-[oklch(0.76_0.12_82/0.12)] border border-[oklch(0.76_0.12_82/0.25)] shadow-[0_0_16px_oklch(0.76_0.12_82/0.08)]"
                      transition={{ ...spring, stiffness: 500, damping: 35 }}
                    />
                  )}

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ ...spring, stiffness: 600 }}
                    className="relative z-10 shrink-0"
                  >
                    <item.icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive ? 'text-[oklch(0.76_0.12_82)]' : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                  </motion.div>

                  <span className="relative z-10 truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer — user card */}
        <div className="p-3 border-t border-border">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/40 border border-border">
              {/* Avatar */}
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 text-[oklch(0.07_0_0)] shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
                }}
              >
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1 font-medium">
                  <TrendingUp className="h-2.5 w-2.5 text-[oklch(0.76_0.12_82)]" />
                  {user.role === UserRole.ADMINISTRATOR ? 'Administrador' : 'Operador'}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}

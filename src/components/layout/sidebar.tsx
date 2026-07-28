'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LayoutDashboard, Users, FileSpreadsheet, PlusCircle, User, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { useLanguage } from '@/context/language-context';

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

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "w-64 bg-white dark:bg-[#080c14] border-r border-slate-200 dark:border-[#1e293b]/60 flex flex-col justify-between text-slate-700 dark:text-slate-200 transition-transform duration-300 ease-in-out z-50",
          "fixed inset-y-0 left-0 h-full lg:sticky lg:top-0 lg:h-screen lg:flex lg:translate-x-0",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div>
          {/* Brand / Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-[#1e293b]/60">
            <Link
              href="/"
              onClick={() => onClose && onClose()}
              className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-white group"
            >
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                FC
              </div>
              <span className="tracking-tight">Factor<span className="text-blue-600 dark:text-blue-500 font-extrabold">Core</span></span>
            </Link>

            {/* Mobile Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-3 mb-2 tracking-widest">
              {user?.role === UserRole.ADMINISTRATOR ? t('nav.console_admin') : t('nav.console_operator')}
            </div>
            {baseMenuItems.map((item) => {
              if (item.adminOnly && user?.role !== UserRole.ADMINISTRATOR) {
                return null;
              }
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose && onClose()}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111625] hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-200 dark:border-[#1e293b]/60">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0f1422] border border-slate-200 dark:border-[#1e293b]/40">
            <ShieldAlert className="h-4 w-4 text-blue-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">SaaS Multi-User</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">FactorCore v2.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

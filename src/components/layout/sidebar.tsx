'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileSpreadsheet, PlusCircle, User, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { useLanguage } from '@/context/language-context';

export default function Sidebar() {
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
    <aside className="w-64 bg-white dark:bg-[#080c14] border-r border-slate-200 dark:border-[#1e293b]/60 flex flex-col justify-between text-slate-700 dark:text-slate-200 h-screen sticky top-0 transition-colors duration-200">
      <div>
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-[#1e293b]/60">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-white group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              FC
            </div>
            <span className="tracking-tight">Factor<span className="text-blue-600 dark:text-blue-500 font-extrabold">Core</span></span>
          </Link>
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
          <ShieldAlert className="h-4 w-4 text-blue-500" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">SaaS Multi-User</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">FactorCore v2.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

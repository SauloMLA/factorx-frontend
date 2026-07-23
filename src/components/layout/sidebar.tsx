'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileSpreadsheet, PlusCircle, User, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

const baseMenuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Operaciones', href: '/operaciones', icon: FileSpreadsheet },
  { name: 'Nueva Originación', href: '/operaciones/nueva', icon: PlusCircle },
  { name: 'Usuarios', href: '/usuarios', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Ocultar la barra lateral completamente en la página de Login
  if (pathname === '/login') return null;

  return (
    <aside className="w-64 bg-white dark:bg-[#090d16] border-r border-slate-200 dark:border-[#1e293b]/40 flex flex-col justify-between text-slate-700 dark:text-slate-200 h-screen sticky top-0 transition-colors duration-200">
      <div>
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-[#1e293b]/40">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-slate-900 dark:text-white">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-md shadow-blue-500/20">
              FC
            </div>
            <span>Factor<span className="text-blue-600 dark:text-blue-500 font-bold">Core</span></span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase px-3 mb-2 tracking-wider">
            Consola {user?.role === UserRole.ADMINISTRATOR ? 'Administrador' : 'Operador'}
          </div>
          {baseMenuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#111827] hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 dark:border-[#1e293b]/40">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/20">
          <ShieldAlert className="h-4 w-4 text-amber-500" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">SaaS Multi-User</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">FactorCore v2.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

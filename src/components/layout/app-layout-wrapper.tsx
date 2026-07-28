'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Loader2 } from 'lucide-react';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicRoute = pathname === '/login';

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        router.replace('/login');
      } else if (isAuthenticated && isPublicRoute) {
        router.replace('/');
      }
    }
  }, [isAuthenticated, isLoading, isPublicRoute, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // 1. Estado de carga ultralimpio mientras se verifica la sesión en el servidor
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#080b11] text-white flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center animate-pulse shadow-2xl shadow-blue-500/30">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <Loader2 className="absolute -bottom-2 -right-2 h-6 w-6 text-blue-400 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold tracking-wider text-slate-200 uppercase">FactorCore Terminal</p>
          <p className="text-xs text-slate-500">Verificando credenciales de seguridad...</p>
        </div>
      </div>
    );
  }

  // 2. Si no está autenticado y no está en ruta pública, bloquear completamente el render
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  // 3. Si está en la pantalla de Login pública
  if (isPublicRoute) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  // 4. Si está autenticado, renderizar la consola completa con Sidebar y Header
  return (
    <div className="flex w-full min-h-screen relative overflow-x-hidden">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0">{children}</main>
      </div>
    </div>
  );
}

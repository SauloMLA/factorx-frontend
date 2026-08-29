'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from '@/components/layout/sidebar';
import Header from '@/components/layout/header';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Loader2 } from 'lucide-react';
import { pageTransition } from '@/lib/motion';

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
      <div className="w-full h-screen bg-[oklch(0.07_0_0)] text-white flex flex-col items-center justify-center space-y-5">
        <div className="relative flex items-center justify-center">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-2xl text-[oklch(0.07_0_0)] animate-pulse"
            style={{
              background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
              boxShadow: '0 0 40px oklch(0.76 0.12 82 / 30%)',
            }}
          >
            <Shield className="h-8 w-8" />
          </div>
          <Loader2 className="absolute -bottom-2 -right-2 h-6 w-6 text-[oklch(0.76_0.12_82)] animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold tracking-widest text-white/80 uppercase">FactorCore Terminal</p>
          <p className="text-[11px] text-white/30 font-mono">Autenticación bancaria y verificación de sesión...</p>
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
    return <div className="w-full min-h-screen bg-background text-foreground">{children}</div>;
  }

  // 4. Consola completa con Sidebar, Header y Transiciones de Página
  return (
    <div className="flex w-full min-h-screen relative overflow-x-hidden bg-background text-foreground">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            {...pageTransition}
            className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  TrendingUp,
  Activity,
  Award,
  Globe,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login({ email, password });
  };

  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-[#080b11] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* ─── COLUMNA IZQUIERDA: HERO CORPORATIVO & MÉTRICAS DE IMPACTO (Oculto en móviles) ─── */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between p-12 bg-gradient-to-br from-[#060910] via-[#0b1220] to-[#0a1528] text-white overflow-hidden border-r border-slate-800/60">
        
        {/* Glows ambientales sutiles */}
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Encabezado Superior Izquierdo */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-0.5 shadow-xl shadow-blue-500/30 flex items-center justify-center">
            <div className="h-full w-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white leading-none">
              Factor<span className="text-blue-400">Core</span>
            </h1>
            <span className="text-xs text-slate-400 font-medium tracking-wide">
              Mesa de Control Financial SaaS
            </span>
          </div>
        </div>

        {/* Centro: Mensaje de Marca & Tarjetas de Valor */}
        <div className="relative z-10 space-y-8 my-auto max-w-xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> Motor de Factoraje Corporativo v2.0
            </div>
            <h2 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Infraestructura financiera para originar con precisión.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Plataforma integral de cesión de cartera, validación automática de folios fiscales y cálculo en tiempo real de aforos y comisiones.
            </p>
          </div>

          {/* Grid de Métricas del Negocio */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold mb-1">
                <TrendingUp className="w-4 h-4" /> <span>$145M+ MXN</span>
              </div>
              <p className="text-xs text-slate-400">Volumen Operado</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold mb-1">
                <Activity className="w-4 h-4" /> <span>0.02s</span>
              </div>
              <p className="text-xs text-slate-400">Validación SAT</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold mb-1">
                <Award className="w-4 h-4" /> <span>85% / 1.5%</span>
              </div>
              <p className="text-xs text-slate-400">Aforo / Comisión</p>
            </div>
          </div>
        </div>

        {/* Footer Inferior Izquierdo: Insignias de Cumplimiento */}
        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cifrado AES-256</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-blue-400" /> ISO 27001</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">Capital X Inc. © 2026</span>
        </div>
      </div>

      {/* ─── COLUMNA DERECHA: FORMULARIO DE ACCESO Y SELECTOR DE ROL ─── */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        
        {/* Header Superior Derecho */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              Servidores Operativos
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* Formulario Principal de Login */}
        <div className="w-full max-w-md mx-auto space-y-8 my-auto py-8">
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Bienvenido de nuevo
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ingresa tus credenciales autorizadas para ingresar a la terminal.
            </p>
          </div>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl dark:shadow-2xl">
            <CardContent className="pt-6 space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Campo Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Correo Institucional
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="analyst@capital.mx"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Campo Password */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Contraseña
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Botón de Enviar */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Autenticando...
                    </>
                  ) : (
                    <>
                      Ingresar al Sistema <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Acceso Rápido Demo (Pills Ejecutivas) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block text-center">
                  Cargar Credenciales de Prueba
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoFill('analyst@capital.mx')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors text-center"
                  >
                    <span className="font-bold text-blue-600 dark:text-blue-400">👑 Administrador</span>
                    <span className="text-[10px] text-slate-400">Mesa de Control</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoFill('operador@capital.mx')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors text-center"
                  >
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">🏢 Operador</span>
                    <span className="text-[10px] text-slate-400">Originación</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Derecho */}
        <div className="text-center text-xs text-slate-400">
          FactorCore Financial Tech • Todos los derechos reservados
        </div>

      </div>
    </div>
  );
}

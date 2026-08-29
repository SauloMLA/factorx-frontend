'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
  Shield,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuroraBg } from '@/components/ui/aurora-bg';
import { spring, fadeUp } from '@/lib/motion';

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
    <AuroraBg className="min-h-screen lg:h-screen w-full text-white font-sans overflow-y-auto lg:overflow-hidden">
      <div className="min-h-screen lg:h-screen w-full grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* ─── COLUMNA IZQUIERDA: HERO CORPORATIVO FINANCIERO (Solo escritorio) ─── */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative flex-col justify-between p-12 lg:p-16 border-r border-white/[0.06] h-full">
          {/* Encabezado Superior Izquierdo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring }}
            className="flex items-center space-x-3.5"
          >
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg text-[oklch(0.07_0_0)] shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
                boxShadow: '0 0 32px oklch(0.76 0.12 82 / 35%)',
              }}
            >
              FC
            </div>
            <div>
              <h1 className="font-extrabold text-2xl tracking-tight text-white leading-none">
                Factor<span className="text-gradient-gold">Core</span>
              </h1>
              <span className="text-[11px] text-white/40 font-medium tracking-widest uppercase mt-1 block">
                Plataforma de Factoraje Financiero
              </span>
            </div>
          </motion.div>

          {/* Centro: Propuesta de Valor Institucional */}
          <div className="space-y-8 max-w-xl my-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ...spring }}
              className="space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.76_0.12_82/0.1)] border border-[oklch(0.76_0.12_82/0.25)] text-[oklch(0.76_0.12_82)] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Motor Financiero Institucional v2.0</span>
              </div>
              <h2 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white">
                Infraestructura para originar con{' '}
                <span className="text-gradient-gold">precisión milimétrica</span>.
              </h2>
              <p className="text-white/60 text-base leading-relaxed">
                Cesión de cartera automatizada, validación criptográfica de CFDI contra SAT y
                liquidación atómica con aforo del 85% y comisión fija del 1.5%.
              </p>
            </motion.div>

            {/* Tarjetas de Métricas de Alto Impacto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, ...spring }}
              className="grid grid-cols-3 gap-4 pt-2"
            >
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-white/[0.15] transition-all">
                <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold mb-1">
                  <TrendingUp className="w-4 h-4" /> <span>$145M+</span>
                </div>
                <p className="text-[11px] text-white/40 font-medium">Volumen Fondefacturado</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-white/[0.15] transition-all">
                <div className="flex items-center space-x-1.5 text-[oklch(0.76_0.12_82)] text-xs font-bold mb-1">
                  <Activity className="w-4 h-4" /> <span>0.02s</span>
                </div>
                <p className="text-[11px] text-white/40 font-medium">Validación SAT CFDI</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:border-white/[0.15] transition-all">
                <div className="flex items-center space-x-1.5 text-indigo-300 text-xs font-bold mb-1">
                  <Award className="w-4 h-4" /> <span>85% / 1.5%</span>
                </div>
                <p className="text-[11px] text-white/40 font-medium">Aforo / Comisión</p>
              </div>
            </motion.div>
          </div>

          {/* Footer Inferior Izquierdo */}
          <div className="flex items-center justify-between pt-6 border-t border-white/[0.06] text-xs text-white/40">
            <div className="flex items-center space-x-5">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cifrado AES-256 GCM
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[oklch(0.76_0.12_82)]" /> ISO 27001 Ready
              </span>
            </div>
            <span className="font-mono text-[11px] text-white/30">FactorCore Systems © 2026</span>
          </div>
        </div>

        {/* ─── COLUMNA DERECHA: FORMULARIO CENTRADO EN GLASSMORPHISM ─── */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col min-h-screen lg:h-full justify-between p-6 sm:p-12 relative backdrop-blur-md lg:backdrop-blur-none">
          {/* Header Superior Derecho */}
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-wide text-white/70">
                Terminal Operativa en Línea
              </span>
            </div>
          </div>

          {/* Tarjeta de Login con Frosted Glass de Alta Fidelidad */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, ...spring }}
            className="w-full max-w-md mx-auto my-auto py-6 space-y-6"
          >
            <div className="space-y-1.5 text-left">
              <h2 className="text-3xl font-black tracking-tight text-white">
                Iniciar Sesión
              </h2>
              <p className="text-xs text-white/50">
                Ingresa con tus credenciales institucionales autorizadas.
              </p>
            </div>

            <Card className="border border-white/[0.1] bg-[oklch(0.10_0.002_264/0.7)] backdrop-blur-2xl shadow-2xl shadow-black/80 rounded-3xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 space-y-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Campo Correo */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                      Correo Institucional
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                      <Input
                        type="email"
                        autoComplete="username"
                        placeholder="analyst@capital.mx"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 bg-white/[0.04] border-white/[0.08] hover:border-white/[0.14] text-white placeholder-white/25 focus:border-[oklch(0.76_0.12_82)] focus:ring-2 focus:ring-[oklch(0.76_0.12_82/0.25)] rounded-xl transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Campo Contraseña */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 bg-white/[0.04] border-white/[0.08] hover:border-white/[0.14] text-white placeholder-white/25 focus:border-[oklch(0.76_0.12_82)] focus:ring-2 focus:ring-[oklch(0.76_0.12_82/0.25)] rounded-xl transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-white/30 hover:text-white/80 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Botón de Enviar con Glow Dorado */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 font-bold text-xs uppercase tracking-wider text-[oklch(0.07_0_0)] shadow-xl transition-all mt-2 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
                      boxShadow: '0 4px 20px oklch(0.76 0.12 82 / 30%)',
                    }}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[oklch(0.07_0_0)]" />
                        Autenticando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Acceder a Terminal <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>

                {/* Acceso Rápido Demo con Diseño Limpio */}
                <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block text-center">
                    Credenciales Demo Rápidas
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleDemoFill('analyst@capital.mx')}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-[oklch(0.76_0.12_82/0.4)] text-xs text-white/80 transition-all text-center group"
                    >
                      <div className="flex items-center gap-1 font-bold text-[oklch(0.76_0.12_82)]">
                        <Shield className="w-3.5 h-3.5" /> Administrador
                      </div>
                      <span className="text-[10px] text-white/40">Mesa de Control</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleDemoFill('operador@capital.mx')}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-emerald-400/40 text-xs text-white/80 transition-all text-center group"
                    >
                      <div className="flex items-center gap-1 font-bold text-emerald-400">
                        <UserCheck className="w-3.5 h-3.5" /> Operador
                      </div>
                      <span className="text-[10px] text-white/40">Originación</span>
                    </motion.button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Derecho */}
          <div className="text-center text-[11px] text-white/30 font-mono">
            FactorCore Financial Technologies • Cifrado Bancario Activo
          </div>
        </div>
      </div>
    </AuroraBg>
  );
}

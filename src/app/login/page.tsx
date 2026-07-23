'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-[#080b11] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Superior: Barra limpia con selector de tema */}
      <div className="w-full p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg leading-none">FactorCore</h1>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Plataforma SaaS de Factoraje</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Centro: Tarjeta de Iniciar Sesión */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-2 text-center pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight">Iniciar Sesión</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
                Ingresa tus credenciales para acceder a la consola financiera de Capital X
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="analyst@capital.mx"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Contraseña
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-blue-500/25 transition-all mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...
                    </>
                  ) : (
                    <>
                      Ingresar a la Consola <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">¿Credenciales de prueba para Demo?</span>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => handleDemoFill('analyst@capital.mx')}
                  className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-mono transition-colors"
                >
                  👤 Admins (Mesa Control)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('operador@capital.mx')}
                  className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-mono transition-colors"
                >
                  🏢 Operadores
                </button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Footer legal */}
      <div className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/50 dark:border-slate-800/50">
        © 2026 FactorCore SaaS • Plataforma de Factoraje Financiero Capital X
      </div>
    </div>
  );
}

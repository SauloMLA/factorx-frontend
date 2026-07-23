'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/auth';
import { User, Shield, Mail, Calendar, Building2, LogOut, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isDarkRole = user.role === UserRole.ADMINISTRATOR;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perfil de Usuario</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Información personal, rol operativo y permisos dentro del sistema FactorCore
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta Lateral de Identidad */}
        <Card className="md:col-span-1 border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>

            <div className="pt-2 flex flex-col items-center gap-2 w-full">
              <Badge
                variant={isDarkRole ? 'default' : 'secondary'}
                className={
                  isDarkRole
                    ? 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 py-1 px-3'
                }
              >
                <Shield className="w-3.5 h-3.5 mr-1.5 inline" />
                {user.role === UserRole.ADMINISTRATOR ? 'Administrador de Mesa' : 'Operador Financiero'}
              </Badge>

              <Badge variant="outline" className="text-xs py-0.5 text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> Cuenta Activa
              </Badge>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detalles de la Cuenta */}
        <Card className="md:col-span-2 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Detalles de la Cuenta</CardTitle>
            <CardDescription>Parámetros de acceso y empresa asignada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Nombre Completo</span>
                <span className="text-sm font-semibold">{user.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <Mail className="h-5 w-5 text-indigo-500" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Correo Electrónico</span>
                <span className="text-sm font-semibold">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <Building2 className="h-5 w-5 text-emerald-500" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Empresa Asignada (clientId)</span>
                <span className="text-sm font-semibold font-mono">
                  {user.clientId ? user.clientId : 'Mesa de Control Global (Sin restricción)'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Fecha de Registro</span>
                <span className="text-sm font-semibold">
                  {new Date(user.createdAt).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

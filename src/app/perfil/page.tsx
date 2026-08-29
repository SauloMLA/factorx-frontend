'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/auth';
import { User, Shield, Mail, Calendar, Building2, LogOut, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();

  if (!user) return null;

  const isDarkRole = user.role === UserRole.ADMINISTRATOR;
  const locale = language === 'en' ? 'en-US' : 'es-MX';

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('profile.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">
          {t('profile.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta Lateral de Identidad */}
        <Card className="lg:col-span-1 border-border bg-card shadow-sm rounded-2xl">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div
              className="h-24 w-24 rounded-2xl flex items-center justify-center text-3xl font-black text-[oklch(0.07_0_0)] shadow-lg"
              style={{
                background: 'linear-gradient(135deg, oklch(0.88 0.08 82), oklch(0.72 0.14 82))',
                boxShadow: '0 4px 20px oklch(0.76 0.12 82 / 30%)',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground">{user.name}</h2>
              <p className="text-xs text-muted-foreground font-mono">{user.email}</p>
            </div>

            <div className="pt-2 flex flex-col items-center gap-2 w-full">
              <Badge
                variant={isDarkRole ? 'default' : 'secondary'}
                className={
                  isDarkRole
                    ? 'bg-[oklch(0.76_0.12_82/0.15)] text-[oklch(0.76_0.12_82)] border border-[oklch(0.76_0.12_82/0.3)] font-bold py-1 px-3 rounded-xl'
                    : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 py-1 px-3 rounded-xl font-bold'
                }
              >
                <Shield className="w-3.5 h-3.5 mr-1.5 inline" />
                {user.role === UserRole.ADMINISTRATOR ? t('profile.desk_admin') : t('profile.financial_operator')}
              </Badge>

              <Badge variant="outline" className="text-xs py-0.5 text-muted-foreground border-border rounded-xl">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> {t('profile.active_account')}
              </Badge>
            </div>

            <div className="w-full pt-4 border-t border-border">
              <Button
                variant="destructive"
                className="w-full rounded-xl cursor-pointer"
                onClick={() => logout()}
              >
                <LogOut className="w-4 h-4 mr-2" /> {t('header.logout')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detalles de la Cuenta */}
        <Card className="lg:col-span-2 border-border bg-card shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">{t('profile.details_title')}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">{t('profile.details_sub')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-muted/40 border border-border">
              <User className="h-5 w-5 text-[oklch(0.76_0.12_82)]" />
              <div>
                <span className="text-xs text-muted-foreground block font-medium">{t('profile.full_name')}</span>
                <span className="text-sm font-semibold text-foreground">{user.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-muted/40 border border-border">
              <Mail className="h-5 w-5 text-[oklch(0.76_0.12_82)]" />
              <div>
                <span className="text-xs text-muted-foreground block font-medium">{t('profile.email')}</span>
                <span className="text-sm font-semibold text-foreground font-mono">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-muted/40 border border-border">
              <Building2 className="h-5 w-5 text-emerald-500" />
              <div>
                <span className="text-xs text-muted-foreground block font-medium">{t('profile.assigned_company')}</span>
                <span className="text-sm font-semibold text-foreground font-mono">
                  {user.clientId ? user.clientId : t('profile.global_desk')}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-muted/40 border border-border">
              <Calendar className="h-5 w-5 text-[oklch(0.68_0.14_260)]" />
              <div>
                <span className="text-xs text-muted-foreground block font-medium">{t('profile.registration_date')}</span>
                <span className="text-sm font-semibold text-foreground font-mono">
                  {new Date(user.createdAt).toLocaleDateString(locale, {
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

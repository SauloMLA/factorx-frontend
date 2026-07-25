'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.clients': 'Clientes',
    'nav.operations': 'Operaciones',
    'nav.new_operation': 'Nueva Originación',
    'nav.users': 'Usuarios',
    'nav.audit': 'Auditoría',
    'nav.console_admin': 'Consola Administrador',
    'nav.console_operator': 'Consola Operador',

    // Header
    'header.search_placeholder': 'Buscar cliente por RFC o Nombre...',
    'header.profile': 'Mi Perfil',
    'header.logout': 'Cerrar Sesión',
    'header.login': 'Iniciar Sesión',
    'header.admin': 'Administrador',
    'header.operator': 'Operador',

    // Audit Page
    'audit.title': 'Bitácora de Auditoría Inmutable',
    'audit.subtitle': 'Registro criptográfico e inmutable de todas las acciones, transacciones y accesos del sistema. Acceso exclusivo para administradores.',
    'audit.filter_entity': 'Filtrar por Entidad (ej. ClientRecord)',
    'audit.filter_action': 'Filtrar por Acción (ej. CREATE_OPERATION)',
    'audit.export_csv': 'Exportar a CSV',
    'audit.col_date': 'Fecha / Hora',
    'audit.col_user': 'Usuario / ID',
    'audit.col_action': 'Acción',
    'audit.col_entity': 'Entidad Afectada',
    'audit.col_entity_id': 'ID de Entidad',
    'audit.col_details': 'Detalles de Evento',
    'audit.view_changes': 'Ver payload de cambios',
    'audit.old_value': 'Valor Anterior',
    'audit.new_value': 'Valor Nuevo',
    'audit.no_records': 'No se encontraron registros de auditoría registrados en la bitácora.',
    'audit.loading': 'Cargando registros de auditoría...',
    'audit.error_permission': 'Nota: Este módulo requiere permisos de Administrador (UserRole.ADMINISTRATOR).',

    // Dashboard
    'dash.title': 'Dashboard Financiero',
    'dash.subtitle': 'Analítica avanzada de originación de factoraje y métricas clave de rendimiento (KPIs).',
    'dash.total_volume': 'Volumen Originado',
    'dash.net_commissions': 'Comisiones Netas',
    'dash.active_operations': 'Operaciones Fondeadas',
    'dash.clients_invoices': 'Clientes / Facturas',
    'dash.volume_trend': 'Tendencia de Volumen (Monto Financiado)',
    'dash.client_growth': 'Crecimiento de Clientes',
    'dash.month': 'Mes',
    'dash.new_clients': 'Nuevos Clientes',

    // Common
    'common.approved': 'Aprobado',
    'common.pending': 'Pendiente',
    'common.actions': 'Acciones',
    'common.search': 'Buscar...',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.clients': 'Clients',
    'nav.operations': 'Operations',
    'nav.new_operation': 'New Origination',
    'nav.users': 'Users',
    'nav.audit': 'Audit Log',
    'nav.console_admin': 'Admin Console',
    'nav.console_operator': 'Operator Console',

    // Header
    'header.search_placeholder': 'Search client by Tax ID or Name...',
    'header.profile': 'My Profile',
    'header.logout': 'Sign Out',
    'header.login': 'Sign In',
    'header.admin': 'Administrator',
    'header.operator': 'Operator',

    // Audit Page
    'audit.title': 'Immutable Audit Log',
    'audit.subtitle': 'Cryptographic, immutable ledger of all system actions, transactions, and user access. Administrator access only.',
    'audit.filter_entity': 'Filter by Entity (e.g. ClientRecord)',
    'audit.filter_action': 'Filter by Action (e.g. CREATE_OPERATION)',
    'audit.export_csv': 'Export to CSV',
    'audit.col_date': 'Date / Time',
    'audit.col_user': 'User / ID',
    'audit.col_action': 'Action',
    'audit.col_entity': 'Target Entity',
    'audit.col_entity_id': 'Entity ID',
    'audit.col_details': 'Event Details',
    'audit.view_changes': 'View change payload',
    'audit.old_value': 'Previous Value',
    'audit.new_value': 'New Value',
    'audit.no_records': 'No audit log entries recorded in the immutable ledger.',
    'audit.loading': 'Loading audit records...',
    'audit.error_permission': 'Note: This module requires Administrator privileges (UserRole.ADMINISTRATOR).',

    // Dashboard
    'dash.title': 'Financial Dashboard',
    'dash.subtitle': 'Advanced factoring origination analytics & key performance indicators (KPIs).',
    'dash.total_volume': 'Originated Volume',
    'dash.net_commissions': 'Net Commissions',
    'dash.active_operations': 'Funded Operations',
    'dash.clients_invoices': 'Clients / Invoices',
    'dash.volume_trend': 'Volume Trend (Funded Amount)',
    'dash.client_growth': 'Client Portfolio Growth',
    'dash.month': 'Month',
    'dash.new_clients': 'New Clients',

    // Common
    'common.approved': 'Approved',
    'common.pending': 'Pending',
    'common.actions': 'Actions',
    'common.search': 'Search...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const saved = localStorage.getItem('fc_language') as Language;
    if (saved === 'es' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('fc_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['es'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

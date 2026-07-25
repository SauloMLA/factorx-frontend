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

    // Clients Page
    'clients.title': 'Directorio de Clientes',
    'clients.subtitle': 'Gestión y control de empresas para originación financiera. Aprueba clientes pendientes antes de iniciar operaciones.',
    'clients.btn_register': 'Registrar Cliente',
    'clients.tab_all': 'Todos',
    'clients.tab_approved': 'Aprobados',
    'clients.tab_pending': 'Pendientes',
    'clients.search_placeholder': 'Buscar por RFC, Nombre o Email...',
    'clients.col_name': 'Razón Social',
    'clients.col_rfc': 'RFC',
    'clients.col_email': 'Email',
    'clients.col_status': 'Estado',
    'clients.col_registered': 'Registro',
    'clients.col_actions': 'Acciones',
    'clients.view_file': 'Expediente',
    'clients.empty': 'No se encontraron clientes con el criterio seleccionado.',
    'clients.empty_sub': 'Registra un nuevo cliente para iniciar o modifica tus filtros.',
    'clients.approve_btn': 'Aprobar Cliente',

    // Operations Page
    'ops.title': 'Historial de Operaciones',
    'ops.subtitle': 'Registro de todas las operaciones de factoraje originadas y fondeadas.',
    'ops.btn_new': 'Nueva Originación',
    'ops.col_id': 'ID Operación',
    'ops.col_client': 'Cliente',
    'ops.col_total': 'Monto Total',
    'ops.col_advanced': 'Monto Adelantado',
    'ops.col_commission': 'Comisión',
    'ops.col_deposit': 'Monto Depositado',
    'ops.col_date': 'Fecha',
    'ops.col_invoices': 'Facturas',
    'ops.empty': 'No hay operaciones de factoraje registradas.',

    // Users Page
    'users.title': 'Administración de Usuarios',
    'users.subtitle': 'Control de accesos y roles (Mesa de Control / Operadores).',
    'users.col_name': 'Nombre',
    'users.col_email': 'Email',
    'users.col_role': 'Rol',
    'users.col_status': 'Estado',
    'users.active': 'Activo',
    'users.inactive': 'Inactivo',

    // Common
    'common.approved': 'Aprobado',
    'common.pending': 'Pendiente',
    'common.actions': 'Acciones',
    'common.search': 'Buscar...',
    'common.loading': 'Cargando...',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
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

    // Clients Page
    'clients.title': 'Client Directory',
    'clients.subtitle': 'Corporate account management for financial origination. Approve pending clients before initiating operations.',
    'clients.btn_register': 'Register Client',
    'clients.tab_all': 'All',
    'clients.tab_approved': 'Approved',
    'clients.tab_pending': 'Pending',
    'clients.search_placeholder': 'Search by Tax ID, Name, or Email...',
    'clients.col_name': 'Company Name',
    'clients.col_rfc': 'Tax ID (RFC)',
    'clients.col_email': 'Email',
    'clients.col_status': 'Status',
    'clients.col_registered': 'Registration Date',
    'clients.col_actions': 'Actions',
    'clients.view_file': 'View Dossier',
    'clients.empty': 'No clients found matching the selected criteria.',
    'clients.empty_sub': 'Register a new client to get started or adjust your filters.',
    'clients.approve_btn': 'Approve Client',

    // Operations Page
    'ops.title': 'Operations History',
    'ops.subtitle': 'Immutable record of all originated and funded factoring transactions.',
    'ops.btn_new': 'New Origination',
    'ops.col_id': 'Operation ID',
    'ops.col_client': 'Client',
    'ops.col_total': 'Total Amount',
    'ops.col_advanced': 'Advanced Amount',
    'ops.col_commission': 'Commission Fee',
    'ops.col_deposit': 'Disbursed Amount',
    'ops.col_date': 'Origination Date',
    'ops.col_invoices': 'Invoices',
    'ops.empty': 'No factoring operations recorded.',

    // Users Page
    'users.title': 'User Management',
    'users.subtitle': 'Access control & role management (Control Desk / Operators).',
    'users.col_name': 'Name',
    'users.col_email': 'Email',
    'users.col_role': 'Role',
    'users.col_status': 'Status',
    'users.active': 'Active',
    'users.inactive': 'Inactive',

    // Common
    'common.approved': 'Approved',
    'common.pending': 'Pending',
    'common.actions': 'Actions',
    'common.search': 'Search...',
    'common.loading': 'Loading...',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
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

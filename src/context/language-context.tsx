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
    'dash.volume_sub': 'Monto total originado por mes.',
    'dash.volume_empty': 'No hay datos suficientes para graficar.',
    'dash.client_growth': 'Crecimiento de Clientes',
    'dash.growth_sub': 'Clientes aprobados por mes en la plataforma.',
    'dash.growth_empty': 'No hay datos de clientes registrados aún.',
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

    // New Origination Page
    'ops.new_title': 'Originación de Operaciones',
    'ops.new_subtitle': 'Carga de lotes de facturas para la cesión de derechos y anticipo de liquidez.',
    'ops.back_to_ops': 'Volver a Operaciones',
    'ops.no_approved_clients': 'No hay clientes aprobados',
    'ops.no_approved_sub': 'Para originar una operación financiera de factoraje, primero debes registrar y aprobar al menos un cliente en el sistema.',
    'ops.go_to_clients': 'Ir a Directorio de Clientes',
    'ops.config_title': 'Configuración del Origen',
    'ops.select_client': 'Cliente (Solo Aprobados)',
    'ops.select_client_placeholder': '-- Selecciona un Cliente --',
    'ops.req_date': 'Fecha de la Solicitud',
    'ops.batch_title': 'Lote de Facturas',
    'ops.batch_sub': 'Carga los folios, RFC deudor, importes y fechas de vencimiento de las facturas.',
    'ops.add_row': 'Añadir Fila',
    'ops.invoice_num': 'Factura',
    'ops.folio': 'Folio',
    'ops.debtor_rfc': 'RFC Deudor',
    'ops.debtor_name': 'Razón Social Deudor',
    'ops.invoice_amount': 'Monto Factura (MXN)',
    'ops.issue_date': 'Fecha Emisión',
    'ops.due_date': 'Fecha Vencimiento',
    'ops.term': 'Plazo restante',
    'ops.summary_title': 'Resumen de Originación',
    'ops.summary_sub': 'Desglose financiero en tiempo real calculado bajo reglas de Capital X.',
    'ops.total_invoiced': 'Total Facturado',
    'ops.advanced_amount': 'Monto Adelantado (85.0%)',
    'ops.service_fee': 'Comisión por Servicio (1.5%)',
    'ops.total_disbursed': 'Total a Depositar',
    'ops.disbursed_sub': 'Monto neto resultante tras la retención de aforo y el cobro de la comisión.',
    'ops.must_select_client': 'Debes seleccionar un cliente aprobado para poder originar la operación.',
    'ops.confirm_origination': 'Confirmar y Originar Lote',
    'ops.processing': 'Procesando Originación...',

    // Profile Page
    'profile.title': 'Perfil de Usuario',
    'profile.subtitle': 'Información personal, rol operativo y permisos dentro del sistema FactorCore',
    'profile.desk_admin': 'Administrador de Mesa',
    'profile.financial_operator': 'Operador Financiero',
    'profile.active_account': 'Cuenta Activa',
    'profile.details_title': 'Detalles de la Cuenta',
    'profile.details_sub': 'Parámetros de acceso y empresa asignada',
    'profile.full_name': 'Nombre Completo',
    'profile.email': 'Correo Electrónico',
    'profile.assigned_company': 'Empresa Asignada (clientId)',
    'profile.global_desk': 'Mesa de Control Global (Sin restricción)',
    'profile.registration_date': 'Fecha de Registro',

    // Client Detail Page
    'client_detail.back': 'Volver a Directorio',
    'client_detail.export_csv': 'Exportar Reporte CSV',
    'client_detail.pending_banner_title': 'Cliente pendiente de aprobación',
    'client_detail.pending_banner_desc': 'Este cliente se encuentra en la etapa de alta en la mesa de control. No podrá originar operaciones financieras ni cargar facturas hasta ser aprobado por un analista.',
    'client_detail.funded_ops': 'Operaciones Fondeadas',
    'client_detail.advanced_vol': 'Volumen Adelantado',
    'client_detail.next_due': 'Próximo Vencimiento',
    'client_detail.no_due': 'Sin vencimientos',
    'client_detail.ops_history': 'Historial de Operaciones',
    'client_detail.no_ops': 'No hay operaciones registradas para este cliente',

    // Notification Dropdown
    'notif.title': 'Notificaciones',
    'notif.new': 'nuevas',
    'notif.mark_read': 'Marcar leídas',
    'notif.empty': 'No tienes notificaciones por el momento.',

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
    'dash.volume_sub': 'Total amount originated per month.',
    'dash.volume_empty': 'Insufficient data for plotting.',
    'dash.client_growth': 'Client Portfolio Growth',
    'dash.growth_sub': 'Approved clients per month on the platform.',
    'dash.growth_empty': 'No registered client data yet.',
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

    // New Origination Page
    'ops.new_title': 'Origination of Operations',
    'ops.new_subtitle': 'Invoice batch upload for rights assignment & liquidity advance.',
    'ops.back_to_ops': 'Back to Operations',
    'ops.no_approved_clients': 'No approved clients',
    'ops.no_approved_sub': 'To originate a financial factoring operation, you must first register and approve at least one client in the system.',
    'ops.go_to_clients': 'Go to Client Directory',
    'ops.config_title': 'Origination Setup',
    'ops.select_client': 'Client (Approved Only)',
    'ops.select_client_placeholder': '-- Select a Client --',
    'ops.req_date': 'Request Date',
    'ops.batch_title': 'Invoice Batch',
    'ops.batch_sub': 'Upload invoice numbers, debtor Tax IDs, amounts, and due dates.',
    'ops.add_row': 'Add Invoice Row',
    'ops.invoice_num': 'Invoice',
    'ops.folio': 'Invoice Folio',
    'ops.debtor_rfc': 'Debtor Tax ID',
    'ops.debtor_name': 'Debtor Legal Name',
    'ops.invoice_amount': 'Invoice Amount (MXN)',
    'ops.issue_date': 'Issue Date',
    'ops.due_date': 'Due Date',
    'ops.term': 'Remaining term',
    'ops.summary_title': 'Origination Summary',
    'ops.summary_sub': 'Real-time financial breakdown calculated under Capital X rules.',
    'ops.total_invoiced': 'Total Invoiced',
    'ops.advanced_amount': 'Advanced Amount (85.0%)',
    'ops.service_fee': 'Service Fee (1.5%)',
    'ops.total_disbursed': 'Total Disbursed',
    'ops.disbursed_sub': 'Net amount after advance retention and factoring fee deduction.',
    'ops.must_select_client': 'You must select an approved client to originate an operation.',
    'ops.confirm_origination': 'Confirm & Originate Batch',
    'ops.processing': 'Processing Origination...',

    // Profile Page
    'profile.title': 'User Profile',
    'profile.subtitle': 'Personal details, operational role, and permissions within FactorCore system.',
    'profile.desk_admin': 'Control Desk Administrator',
    'profile.financial_operator': 'Financial Operator',
    'profile.active_account': 'Active Account',
    'profile.details_title': 'Account Details',
    'profile.details_sub': 'Access parameters and assigned corporate account',
    'profile.full_name': 'Full Name',
    'profile.email': 'Email Address',
    'profile.assigned_company': 'Assigned Company (clientId)',
    'profile.global_desk': 'Global Control Desk (Unrestricted)',
    'profile.registration_date': 'Registration Date',

    // Client Detail Page
    'client_detail.back': 'Back to Directory',
    'client_detail.export_csv': 'Export CSV Report',
    'client_detail.pending_banner_title': 'Client pending approval',
    'client_detail.pending_banner_desc': 'This client is in the onboarding phase. Operations cannot be originated nor invoices loaded until approved by an analyst.',
    'client_detail.funded_ops': 'Funded Operations',
    'client_detail.advanced_vol': 'Advanced Volume',
    'client_detail.next_due': 'Next Maturity Date',
    'client_detail.no_due': 'No active maturities',
    'client_detail.ops_history': 'Operations History',
    'client_detail.no_ops': 'No operations recorded for this client',

    // Notification Dropdown
    'notif.title': 'Notifications',
    'notif.new': 'new',
    'notif.mark_read': 'Mark all as read',
    'notif.empty': 'No notifications at the moment.',

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

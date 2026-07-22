# PROJECT_GUIDE (Frontend - FactorCore Web)

Este documento sirve como fuente de verdad para la experiencia de usuario (UX), componentes clave y reglas de negocio reflejadas en la interfaz de **FactorCore Web**.

---

## 1. Módulos y Flujos de la Consola

### A. Dashboard Ejecutivo (`/`)
- Muestra los indicadores clave de rendimiento (KPIs) del negocio:
  - **Volumen Total Originado (MXN)**
  - **Comisiones Netas Cobradas (1.5%)**
  - **Total de Operaciones Fondeadas**
  - **Distribución de Clientes (Aprobados vs Pendientes)**
- **Mesa de Control Rápida:** Acceso directo para aprobar empresas en estado `PENDING`.
- **Actividad Reciente:** Lista de las últimas operaciones originadas.

### B. Directorio de Clientes (`/clientes`)
- Listado de empresas registradas con filtros por estado (`Todos`, `Aprobados`, `Pendientes`) y buscador reactivo por RFC, Nombre o Email.
- **Registro de Cliente:** Modal para dar de alta una nueva empresa (nace en estado `PENDING`).
- **Expediente de Cliente (`/clientes/:id`):** Resumen financiero del cliente (acumulados, operaciones y fecha de próximo vencimiento).

### C. Historial de Operaciones (`/operaciones`)
- Tabla auditables con expansión de filas (`Accordion/Collapse`) para visualizar el desglose de facturas cedidas en cada lote originado.

### D. Nueva Originación (`/operaciones/nueva`)
- Asistente interactivo para la cesión de facturas:
  - Selecciona un cliente en estado `APPROVED`.
  - Permite agregar dinámicamente múltiples facturas (Folio, RFC Deudor, Razón Social, Monto, Emisión, Vencimiento).
  - Muestra un resumen lateral fijo con el desglose en tiempo real:
    - **Total Facturado**
    - **Monto Adelantado (85%)**
    - **Comisión por Servicio (1.5%)**
    - **Total a Depositar (Neto resultante)**

---

## 2. Invariantes de Negocio en la Interfaz

*   **RD-CLI-002:** El campo RFC en formularios exige exactamente 12 caracteres formateados como Persona Moral.
*   **RD-INV-003:** La fecha de vencimiento de cada factura en el lote es validada en tiempo real. La diferencia con la fecha de solicitud debe ser estrictamente de **15 a 120 días calendario**.
*   **RD-OP-001:** Solo los clientes aprobados (`APPROVED`) aparecen disponibles en el selector del asistente de originación.

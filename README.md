# FactorCore Web (FactorX Frontend) 2.0

> Consola Web y Portal de Administración de Factoraje Corporativo para **Capital X**.

**FactorCore Web** es la interfaz web del sistema **FactorCore**, construida para permitir a analistas financieros y empresas proveedoras gestionar el ciclo de vida completo de clientes, originación de operaciones, notificaciones y bitácora de auditoría inmutable.

---

## 🚀 Módulos y Funcionalidades Nuevas

1. **Bitácora de Auditoría (`/auditoria`)**:
   - Registro inmutable de acciones del sistema (`CREATE`, `APPROVE`, etc.).
   - Filtros dinámicos por Entidad y Acción.
   - Restringido exclusivamente a usuarios con rol `ADMINISTRATOR`.
2. **Centro de Notificaciones en Tiempo Real**:
   - Campana interactiva en la barra superior con contador de notificaciones no leídas y refetch automático.
   - Acción para marcar notificaciones como leídas.
3. **Exportación de Datos a CSV (UTF-8)**:
   - Descarga estandarizada en formato CSV con BOM (compatibilidad total con Excel).
   - Botón de exportación en **Bitácora de Auditoría**, **Historial de Operaciones** y **Expediente de Cliente**.
4. **Autenticación JWT & RBAC**:
   - Manejo de sesiones seguras mediante cookies `HttpOnly` (`access_token` y `refresh_token`).
   - Pantalla de inicio de sesión dividida ejecutiva con control de rutas protegidas.

---

## 🛠️ Tecnologías y Arquitectura

* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + Turbopack
* **Biblioteca UI**: React 19 + Radix UI + Tailwind CSS v4
* **Manejo de Estado & Caché API**: TanStack Query v5 (React Query)
* **Iconos & Notificaciones**: Lucide React + Sonner
* **Exportación**: Utilidad nativa UTF-8 `exportToCSV`

---

## ⚡️ Guía de Ejecución Local

```bash
cd financial-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (puerto 3001)
npm run dev
```

Abre **[http://localhost:3001](http://localhost:3001)** en tu navegador.

# FactorCore Web (FactorX Frontend)

> **FactorCore Web** es la consola de administración ejecutiva y portal de originación de factoraje financiero para **Capital X**, construida con **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** y arquitectura **Backend-For-Frontend (BFF)**.

---

## 🧠 El Problema y la Experiencia de Usuario (UX)

En las finanzas corporativas, los analistas y clientes necesitan visibilidad inmediata sobre su liquidez. **FactorCore Web** elimina la complejidad operativa permitiendo:
1. **Originación Reactiva**: Validación en tiempo real del RFC, aforo del 85%, comisión del 1.5% y vigencia de facturas (15-120 días) antes de enviar la solicitud.
2. **Control de Acceso por Roles (RBAC)**: Vistas ejecutivas como `/auditoria` y `/usuarios` restringidas dinámicamente según el rol (`ADMINISTRATOR` vs `OPERATOR`).
3. **Alertas en Tiempo Real**: Centro de notificaciones en el encabezado con refetch automático.
4. **Exportación de Reportes**: Generación instantánea de archivos **CSV UTF-8 (BOM)** para contabilidad y auditoría.

---

## 🏛️ Patrón Backend-For-Frontend (BFF) & Bounded Contexts Consumidos

La aplicación utiliza Next.js API Routes Proxy (`/app/api/*`) para consumir los Bounded Contexts del backend NestJS de forma transparente y segura:

- **Auth Proxy (`/api/auth/*`)**: Setea cookies seguras `HttpOnly` (`access_token` y `refresh_token`).
- **Audit Proxy (`/api/auditoria`)**: Reenvía peticiones con Bearer JWT al backend interno (`http://localhost:3005/audit`).
- **Notifications Proxy (`/api/notifications`)**: Alertas del sistema.

---

## ⚡️ Guía de Ejecución Local

```bash
cd factorx-frontend
npm install
npm run dev   # Inicia en http://localhost:3001
```

---

## 📚 Documentación Maestra del Sistema

Para consultar el documento completo de diseño de arquitectura, ADRs y estrategias de seguridad:

👉 **[TECHNICAL_DESIGN_DOCUMENT.md](../TECHNICAL_DESIGN_DOCUMENT.md)**

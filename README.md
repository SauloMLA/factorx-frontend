# FactorCore Web (FactorX Frontend)

> *Consola Web y Portal de Administración de Factoraje Corporativo para Capital X.*

**FactorCore Web** es la interfaz web del sistema **FactorCore**, construida para permitir a analistas financieros y empresas proveedoras gestionar el ciclo de vida completo de clientes y la originación de operaciones de factoraje.

El diseño de la aplicación prioriza una experiencia de usuario (UX) rápida, reactiva y clara, garantizando que las invariantes financieras (aforo del 85%, comisión del 1.5% y elegibilidad de 15 a 120 días) se calculen y validen en tiempo real antes de enviar cualquier solicitud al backend.

---

## 🚀 Tecnologías y Arquitectura

*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
*   **Biblioteca UI**: [React 19](https://react.dev/) + [Radix UI / Base UI](https://base-ui.com/)
*   **Estilos y Temas**: [Tailwind CSS v4](https://tailwindcss.com/) + [`next-themes`](https://github.com/pacocoursey/next-themes) (Soporte completo para **Modo Claro** ☀️ y **Modo Oscuro** 🌙)
*   **Manejo de Estado y Caché API**: [TanStack Query v5 (React Query)](https://tanstack.com/query)
*   **Formularios y Validación**: React Hook Form + [Zod](https://zod.dev)
*   **Iconografía y Notificaciones**: [Lucide React](https://lucide.dev) + [Sonner](https://sonner.emilkowal.si/)
*   **Patrón de Comunicación**: Backend-For-Frontend (BFF) integrado en Next.js.

---

## 🎨 Modo Claro / Modo Oscuro (Theme System)

La consola soporta alternancia dinámica de temas accesible desde el botón en el encabezado principal:

*   **Modo Oscuro (Dark Theme):** Paleta financiera estilo terminal en tonos pizarra profunda (`#080b11`, `#090d16`) con acentos azul eléctrico y esmeralda.
*   **Modo Claro (Light Theme):** Paleta ejecutiva limpia en tonos slate suave (`#f8fafc`) con sombras sutiles y bordes contrastados.

---

## 💡 Decisión de Diseño y Validación Reactiva

1. **Validación en Tiempo Real (Invariantes de Negocio):**
   - **RFC de Persona Moral:** Validación estricta mediante expresión regular (12 caracteres).
   - **Plazo de Elegibilidad (RD-INV-003):** El formulario de originación calcula en tiempo real los días calendario entre la fecha de solicitud y el vencimiento de cada factura, mostrando un indicador visual verde `[Plazo: X días ✅]` o rojo `[Plazo: X días ❌]` si no cumple el rango de 15 a 120 días.
   - **Cálculo Financiero Atómico:** El aforo (85%), la comisión (1.5%) y el depósito neto resultante se recalculan de forma reactiva al ingresar los montos.

2. **Caché y Optimización Financiera:**
   - Se configuró TanStack Query con `staleTime: 5 mins` y `refetchOnWindowFocus: false` para prevenir recargas innecesarias durante la captura de facturas pesadas.

---

## ⚡️ Guía de Ejecución Local

### 1. Variables de Entorno

Asegúrate de contar con el archivo `.env` configurado:

```bash
NEXT_PUBLIC_API_URL="http://localhost:3000"
DATABASE_URL="file:../../financial-api/prisma/dev.db"
```

### 2. Iniciar el Servidor de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en puerto 3001
npm run dev
```

Abre **[http://localhost:3001](http://localhost:3001)** en tu navegador.

---

## 📚 Documentación Adicional

*   **[PROJECT_GUIDE.md](PROJECT_GUIDE.md):** Manual operativo y reglas de interfaz de usuario.
*   **[ARCHITECTURE.md](ARCHITECTURE.md):** Diagrama de arquitectura del frontend, componentes y flujo de datos.

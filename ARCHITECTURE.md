# ARCHITECTURE (Frontend - FactorCore Web)

Este documento detalla la estructura del frontend, patrones de componentes y gestión de estado de **FactorCore Web**.

---

## 🏗 Arquitectura de Componentes

La aplicación sigue el **App Router de Next.js** combinado con una arquitectura basada en componentes modulares y desacoplados:

```
src/
├── api/                   # Clientes Axios y configuración de BFF
├── app/                   # Rutas y páginas del App Router
│   ├── api/               # Server Endpoints (BFF proxy a NestJS)
│   ├── clientes/          # Páginas del módulo de Clientes
│   ├── operaciones/       # Páginas del módulo de Operaciones
│   ├── globals.css        # Estilos globales y tokens Tailwind v4
│   └── layout.tsx         # Root Layout con Sidebar y Header persistentes
├── components/
│   ├── clients/           # Componentes específicos de clientes (Tabla, Modal, Badge)
│   ├── dashboard/         # Widgets y páneles del Dashboard
│   ├── layout/            # Sidebar, Header y componentes de estructura
│   ├── providers.tsx      # React Query Provider + ThemeProvider (next-themes)
│   ├── theme-toggle.tsx   # Botón de alternancia Modo Claro / Oscuro
│   └── ui/                # Sistema de diseño atómico (Button, Card, Table, Input, Tabs)
├── hooks/                 # Hooks personalizados de React Query (useClients, useOperations)
├── lib/                   # Utilidades y cliente Prisma del BFF
├── services/              # Capa de consumo HTTP (Axios)
└── types/                 # Definiciones de tipos TypeScript (Client, Operation, Invoice)
```

---

## 🔄 Flujo de Datos y BFF (Backend-For-Frontend)

```
[ Navegador / React 19 ]
         │
         ▼
[ React Query / Hooks ]
         │
         ├─── (Lecturas pesadas en cliente / Forms) ────► [ BFF: Next.js API Routes / Server Components ] ────► [ SQLite / Prisma ]
         │
         └─── (Acciones de Originación) ─────────────────► [ NestJS API (financial-api) :3000 ]
```

1. **Server Components:** El Dashboard principal realiza consultas directas mediante Prisma en el servidor para renderizar los acumulados con cero latencia inicial.
2. **React Query (Client Side):** Los formularios interactivos, tablas con filtro y modales utilizan React Query para sincronizar el estado del cliente con invalidación de caché automática (`queryClient.invalidateQueries`).

---

## 🌗 Sistema de Temas (Light & Dark Theme)

El sistema de temas está impulsado por `next-themes` y tokens CSS nativos de Tailwind v4:

- **Contenedor Principal:** `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`
- **Estrategia de Clases:** Se utiliza la variante `dark:` en los componentes. Cuando el usuario cambia el tema a `light`, las clases sin prefijo definen los fondos claros y textos oscuros.

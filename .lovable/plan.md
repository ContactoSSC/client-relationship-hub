# Plan: SSC Limitada → CRM de Licitaciones Públicas

Vamos a transformar el dashboard actual en un CRM integrado de licitaciones, organismos y equipo, con estética moderna tipo Linear/Notion. El plan está dividido en 5 fases iterativas — al terminar cada una tendrás algo funcional y podrás ajustar antes de seguir.

---

## Diagnóstico del estado actual

Lo que funciona bien hoy:
- Hay una identidad clara (azul corporativo + datos chilenos reales)
- KPIs visibles arriba, lista de oportunidades abajo
- Filtros básicos por región, orden y monto

Lo que limita su crecimiento como CRM:
- Header muy cargado (badges de estado, email, salir, navegación principal todo junto)
- KPIs aislados — no cuentan una historia (¿voy bien? ¿voy mal?)
- La tabla muestra datos pero no permite **actuar** (no hay vista de detalle, asignación rápida, notas, estados)
- No hay concepto de "pipeline" — cada licitación es un evento aislado, no parte de un flujo
- No hay vista de organismos como cuentas (¿cuánto le he vendido a HOSPITAL LA SERENA? ¿qué tasa de éxito tengo con ellos?)
- No hay seguimiento del equipo (Equipo es solo un link, no un módulo)

---

## Estética objetivo (estilo Linear/Notion aplicado a CRM)

**Layout:** Sidebar colapsable a la izquierda con navegación principal (libera el header y permite escalar a más módulos). Header limpio arriba con solo: breadcrumb + búsqueda global (`Cmd+K`) + notificaciones + avatar.

**Color:** Mantener el azul marino como acento institucional pero llevarlo a un sistema más sutil:
- Fondo principal casi blanco (`#FAFAFA`)
- Superficies blancas con bordes muy finos (1px gris claro), sin sombras pesadas
- Azul marino solo para estados activos, CTAs primarios y header del sidebar
- Sistema semántico: verde (oportunidad activa), ámbar (urgente <4h), rojo (vencido), gris (cerrado)

**Tipografía:** Inter para todo. Jerarquía marcada por peso y tamaño, no por color.

**Densidad:** Tablas más densas (filas de 44-48px), espaciado generoso solo donde aporta jerarquía. Tipo Linear: mucha información sin sentirse saturado.

**Microinteracciones:** Transiciones de 150ms, hover states sutiles, skeleton loaders, atajos de teclado visibles (`J/K` para navegar filas, `/` para buscar).

---

## Fase 1 — Rediseño visual y arquitectura base

Reconstruimos el shell de la aplicación sin tocar la lógica de datos.

**Qué incluye:**
- Sistema de diseño nuevo en `index.css` y `tailwind.config.ts`: paleta semántica, tokens de espaciado, radios, sombras sutiles
- Sidebar colapsable con navegación: Dashboard · Pipeline · Licitaciones · Organismos · Equipo · Analytics · Admin
- Header superior con breadcrumb dinámico, búsqueda global (`Cmd+K`), centro de notificaciones (campana con badge) y menú de usuario
- Banner de alertas (token Mercado Público) rediseñado como notificación contextual del header en lugar de banner que ocupa espacio
- Rediseño de los 4 KPIs: cards con micro-tendencia (sparkline o "+12% vs ayer"), íconos discretos, jerarquía clara, el card destacado (Oportunidades) con tratamiento visual distinto
- Tabla de licitaciones rediseñada: filas más densas, columna de estado con badges semánticos, acciones rápidas al hover (estrella, asignar, abrir), urgencia de cierre como barra de progreso visual
- Filtros como chips removibles arriba de la tabla en lugar de dropdowns sueltos
- Estados vacíos, skeletons de carga, modo responsive

---

## Fase 2 — Ficha detallada de licitación

Cada licitación deja de ser una fila y se vuelve una entidad con vida propia.

**Qué incluye:**
- Página `/licitaciones/:id` con layout de 3 columnas: info principal · timeline/actividad · panel lateral de acciones
- Header con código, nombre, organismo, monto, cuenta regresiva grande al cierre, botones primarios (Cotizar, Marcar favorita, Asignar)
- Tabs internos: **Resumen** (descripción, requisitos, items) · **Cotización** (productos, precios, márgenes) · **Documentos** (adjuntos) · **Notas** (comentarios del equipo con menciones `@`) · **Actividad** (timeline auto de cambios)
- Panel lateral con: responsable asignado, estado en pipeline, etiquetas, organismo (con link a su ficha), competidores cotizantes, historial de licitaciones similares
- Modal de cotización rápida desde la lista (sin entrar a la ficha completa)
- Sistema de etiquetas/tags personalizables

---

## Fase 3 — Pipeline Kanban y módulo de Organismos

El corazón del CRM: ver el negocio como un flujo y a los clientes como cuentas.

**Pipeline Kanban (`/pipeline`):**
- Columnas: Nueva → En análisis → Cotizando → Enviada → Adjudicada / Perdida
- Drag & drop entre etapas con confirmación
- Cada card muestra: código corto, organismo, monto, responsable (avatar), tiempo en etapa, urgencia
- Filtros por responsable, región, monto, organismo
- Toggle de vistas: Kanban · Tabla · Calendario (por fecha de cierre)
- Métricas arriba del board: valor total del pipeline, valor por etapa, tasa de conversión etapa-a-etapa

**Organismos (`/organismos`):**
- Lista de todos los organismos con los que has interactuado, con: total de licitaciones, monto adjudicado histórico, tasa de éxito, última actividad
- Ficha de organismo `/organismos/:id`: contactos, licitaciones históricas (ganadas/perdidas/activas), monto total adjudicado, productos más comprados, mapa de la región, notas internas sobre la cuenta
- Sistema de "cuentas favoritas" / cuentas estratégicas

---

## Fase 4 — Equipo, asignaciones y notificaciones

Convertir el "Equipo" actual en un módulo real de gestión.

**Qué incluye:**
- Página `/equipo` con lista de miembros, sus roles (admin, comercial, viewer), licitaciones asignadas, carga de trabajo visual
- Ficha individual: licitaciones activas, tasa de éxito personal, monto adjudicado este mes, actividad reciente
- Asignación rápida desde la tabla y kanban (avatar dropdown)
- Sistema de roles con permisos (usando `user_roles` en tabla separada — patrón seguro de Supabase)
- Centro de notificaciones unificado en el header:
  - Cierres próximos (<4h, <24h)
  - Asignaciones nuevas
  - Menciones en notas (`@juan`)
  - Cambios de estado en licitaciones que sigues
  - Alertas de sistema (token expirado, etc.)
- Recordatorios programables por licitación
- Preferencias de notificación por usuario

---

## Fase 5 — Analytics y reportes

El módulo que justifica la inversión en CRM: ver el negocio con claridad.

**Dashboard ejecutivo (`/analytics`):**
- Embudo de conversión visual (cuántas oportunidades pasan de cada etapa a la siguiente)
- Tasa de éxito global y por responsable, organismo, región, rango de monto
- Monto adjudicado vs cotizado por mes (gráfico de barras 12 meses)
- Top 10 organismos por monto adjudicado
- Mapa de calor de Chile por región (dónde estás ganando más)
- Tiempo promedio en cada etapa del pipeline
- Productos/servicios más cotizados y con mejor tasa de éxito
- Comparativo período vs período anterior
- Exportación a CSV/PDF de todos los reportes
- Filtros globales: rango de fechas, responsable, región

---

## Detalles técnicos

- **Stack:** Mantenemos React + Vite + Tailwind + shadcn. Sumamos `recharts` (analytics), `@dnd-kit` (kanban), `react-markdown` (notas), `cmdk` (búsqueda global).
- **Backend:** Lovable Cloud / Supabase ya conectado. Añadiremos tablas: `pipeline_stages`, `licitacion_notes`, `licitacion_activity`, `tags`, `licitacion_tags`, `notifications`, `user_roles`, `organismo_notes`. Vistas materializadas para analytics pesados.
- **Seguridad:** Roles en tabla `user_roles` separada con `has_role()` security definer (nunca en `profiles`). RLS estricto en todas las tablas nuevas.
- **Diseño:** Todo el color/tipografía/spacing pasa por tokens semánticos en `index.css` para que un cambio de marca futuro sea trivial.
- **Performance:** React Query con caché agresivo, paginación servidor-side en listas largas, índices en columnas filtradas.

---

## Cómo avanzaremos

Empezamos por **Fase 1** (la base visual) — al terminar verás una transformación grande sin perder ninguna funcionalidad actual. Después de tu feedback pasamos a Fase 2, y así sucesivamente. En cualquier punto podemos pausar, reordenar fases o agregar cosas nuevas.

¿Le damos? Si quieres ajustar el orden de fases o el alcance de alguna, dímelo antes de aprobar.
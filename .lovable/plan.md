# Fase 2 — Ficha detallada de licitación

Cada licitación pasa de ser una fila a ser una entidad navegable con su propio espacio de trabajo. Al hacer clic en cualquier fila de la tabla del Dashboard, se abrirá esta ficha.

## Qué se construye

**Nueva ruta `/licitaciones/:id`** dentro del `AppShell` actual, con layout de 2 columnas (contenido principal + panel lateral derecho 320px).

**Header de la ficha**
- Botón "← Volver" + breadcrumb dinámico (ya soportado por el header global)
- Código de licitación (mono) + estado actual como badge
- Título grande, organismo con link a su ficha futura, región
- **Cuenta regresiva grande al cierre** con color según urgencia (verde / ámbar / rojo)
- Botones primarios: **Cotizar** (abre modal), **Marcar favorita** (estrella), **Asignar** (dropdown con avatares del equipo), menú "..." con más acciones

**Tabs internos** (5 secciones):
1. **Resumen** — descripción en markdown, requisitos como checklist, competidores cotizantes, licitaciones similares con resultado histórico
2. **Cotización** — tabla de ítems solicitados con cantidad/unidad/precio unitario editable, subtotales, total destacado, indicador de margen estimado
3. **Documentos** — lista de archivos con tipo, tamaño, quién subió, cuándo. Zona de drop para subir nuevos
4. **Notas** — feed de comentarios del equipo con avatares, soporte markdown vía `react-markdown`, menciones `@usuario` resaltadas, input para agregar nueva nota
5. **Actividad** — timeline cronológica de todos los eventos (cambios de estado, asignaciones, notas, documentos, cotizaciones) con íconos por tipo

**Panel lateral derecho** (sticky, siempre visible)
- Estado en pipeline + selector para cambiarlo
- Responsable asignado (con avatar + cambiar)
- Tags / etiquetas (chips removibles + agregar)
- Monto total
- Datos del organismo (nombre, región, link a futura ficha)
- "Cotizantes actuales" con barra de competencia
- Mini sección "Licitaciones similares" — tasa de éxito histórica con este organismo

**Modal de cotización rápida**
- Accesible desde el botón "Cotizar" del header de la ficha **y también desde la tabla del Dashboard** (acción al hover sobre la fila)
- Formulario compacto: ítems con precios, total auto-calculado, campo de notas, botón "Guardar borrador" / "Marcar como enviada"

## Detalles técnicos

- Nuevo archivo `src/data/licitacionDetail.ts` con datos mock realistas (descripción, items, documentos, notas, actividad, tags, competidores, similares) + fallback para ids sin datos curados
- Nuevo componente `src/pages/LicitacionDetail.tsx` (página) usando `useParams` de react-router
- Sub-componentes en `src/components/licitacion/`:
  - `LicitacionHeader.tsx` (título + acciones + countdown)
  - `LicitacionTabs.tsx` con 5 paneles internos: `ResumenPanel`, `CotizacionPanel`, `DocumentosPanel`, `NotasPanel`, `ActividadPanel`
  - `LicitacionSidePanel.tsx` (panel derecho)
  - `CotizarModal.tsx` (modal reutilizable)
- Tabla del Dashboard: cada fila se vuelve clickeable (navega a `/licitaciones/:id`); botón "Cotizar" rápido aparece al hover
- Usa shadcn `Tabs`, `Dialog`, `Avatar`, `Badge`, `Separator` ya disponibles
- `react-markdown` para renderizar descripción y notas (ya está en `package.json`? — si no, lo agregaré)
- Sin cambios al sistema de diseño ni a los componentes ya existentes de Fase 1

Al terminar, el flujo Dashboard → ficha → cotizar funciona end-to-end con datos mock, listo para conectar Lovable Cloud después.
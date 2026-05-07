// Detail-level mock data for a Licitación. Designed to be replaced 1:1 by Supabase queries.

import { team, type TeamMember } from "./mock";

// Each ítem covers the FULL operational cycle: solicitud → costo de compra → llegada → facturación
export interface ItemSolicitado {
  id: string;
  numero: number;
  descripcion: string;
  cantidad: number;
  unidad: string;
  // Cotización (lo que vendemos al organismo)
  precioVentaUnitario?: number;
  // Compra (lo que nos cuesta a nosotros)
  costoUnitario?: number;
  proveedor?: string;
  // Logística
  fechaLlegada?: string; // ISO
  // Facturación al organismo
  facturado?: boolean;
  numeroFactura?: string;
  notas?: string;
}

export interface Documento {
  id: string;
  nombre: string;
  tipo: "pdf" | "xlsx" | "docx" | "img";
  tamano: string;
  subidoPor: TeamMember;
  fecha: string;
}

export interface Tag {
  id: string;
  label: string;
  color: "info" | "success" | "warning" | "destructive" | "muted";
}

// Mensaje de chat del equipo (en tiempo real, visible para todo el equipo)
export interface MensajeChat {
  id: string;
  autor: TeamMember;
  contenido: string;
  fecha: string;
}

export interface ActividadEvent {
  id: string;
  tipo: "stage_change" | "assignment" | "note" | "document" | "quote" | "purchase" | "delivery" | "billing" | "system";
  actor: TeamMember | "system";
  descripcion: string;
  fecha: string;
}

// Snapshot del contador de cotizantes en el tiempo
export interface CotizantePoint {
  fecha: string; // ISO
  cantidad: number;
}

export interface LicitacionDetail {
  id: string;
  descripcion: string;
  items: ItemSolicitado[];
  // Archivos separados: del organismo vs del equipo
  documentosOrganismo: Documento[];
  documentosEquipo: Documento[];
  chat: MensajeChat[];
  notasInternas: string;
  actividad: ActividadEvent[];
  tags: Tag[];
  competidores: { nombre: string; cotizaciones: number }[];
  similares: { id: string; codigo: string; nombre: string; resultado: "adjudicada" | "perdida" | "activa"; monto: number }[];
  cotizantesHistorico: CotizantePoint[];
  // Checklist de etapas: fecha y responsable cuando se completaron
  hitos: Partial<Record<
    "abierta" | "cerrada" | "adjudicada" | "en_compra" | "entregada" | "notificada" | "cobro_1" | "cobro_2",
    { fecha: string; por?: TeamMember }
  >>;
}

const ago = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();

export const licitacionDetails: Record<string, LicitacionDetail> = {
  l1: {
    id: "l1",
    descripcion:
      "Servicio de internet dedicado para DAEM Punitaqui, Escuela Bélgica, Escuela Teresita de los Andes, Liceo Alberto Gallardo Lorca.\n\nSe requiere SLA 99.5%, IP fija y soporte 24/7 por 12 meses.",
    items: [
      { id: "i1", numero: 1, descripcion: "Servicio internet dedicado 100 Mbps simétrico", cantidad: 12, unidad: "mes", precioVentaUnitario: 280_000, costoUnitario: 215_000, proveedor: "Mundo Pacífico" },
      { id: "i2", numero: 2, descripcion: "Instalación y puesta en marcha", cantidad: 1, unidad: "global", precioVentaUnitario: 450_000, costoUnitario: 320_000, proveedor: "Mundo Pacífico" },
      { id: "i3", numero: 3, descripcion: "Equipamiento router CPE empresarial", cantidad: 1, unidad: "unidad", precioVentaUnitario: 130_000, costoUnitario: 92_000, proveedor: "PCFactory" },
    ],
    documentosOrganismo: [
      { id: "do1", nombre: "Bases técnicas administrativas.pdf", tipo: "pdf", tamano: "1.2 MB", subidoPor: team[0], fecha: ago(96) },
      { id: "do2", nombre: "Anexo 3 - Formulario económico.xlsx", tipo: "xlsx", tamano: "84 KB", subidoPor: team[0], fecha: ago(96) },
    ],
    documentosEquipo: [
      { id: "de1", nombre: "Cotización Mundo Pacífico.pdf", tipo: "pdf", tamano: "240 KB", subidoPor: team[1], fecha: ago(20) },
      { id: "de2", nombre: "Ficha técnica router CPE.pdf", tipo: "pdf", tamano: "1.8 MB", subidoPor: team[2], fecha: ago(8) },
    ],
    chat: [
      { id: "m1", autor: team[1], contenido: "Confirmé con Mundo Pacífico el costo. Margen ~22% si nos quedamos con el plan empresarial.", fecha: ago(10) },
      { id: "m2", autor: team[2], contenido: "@javier ojo que el organismo pidió SLA 99.5% en bases. ¿Lo cubre el plan?", fecha: ago(3) },
      { id: "m3", autor: team[1], contenido: "Sí, lo cubre. Subí la ficha técnica para respaldo.", fecha: ago(2) },
    ],
    notasInternas: "Cliente histórico, paga rápido. Hay que pasar por DAEM antes de instalar.",
    actividad: [
      { id: "a1", tipo: "system",       actor: "system",  descripcion: "Compra detectada en Mercado Público", fecha: ago(96) },
      { id: "a2", tipo: "document",     actor: team[0],   descripcion: "subió Bases técnicas administrativas.pdf", fecha: ago(96) },
      { id: "a3", tipo: "assignment",   actor: team[3],   descripcion: "asignó la compra a María González", fecha: ago(72) },
      { id: "a4", tipo: "stage_change", actor: team[0],   descripcion: "movió de Abierta a En análisis interno", fecha: ago(60) },
      { id: "a5", tipo: "note",         actor: team[1],   descripcion: "agregó una nota sobre el margen estimado", fecha: ago(10) },
      { id: "a6", tipo: "quote",        actor: team[2],   descripcion: "actualizó la cotización (3 ítems · $3.920.000)", fecha: ago(0.5) },
    ],
    tags: [
      { id: "t1", label: "Telecomunicaciones", color: "info" },
      { id: "t2", label: "Recurrente",         color: "success" },
      { id: "t3", label: "Margen alto",        color: "success" },
    ],
    competidores: [
      { nombre: "Telecom Norte Ltda.", cotizaciones: 12 },
      { nombre: "ConectaChile SpA",    cotizaciones: 8 },
    ],
    similares: [
      { id: "s1", codigo: "3872-87-COT25",  nombre: "Servicio internet dedicado 50 Mbps",            resultado: "adjudicada", monto: 2_880_000 },
      { id: "s2", codigo: "3201-44-COT25",  nombre: "Internet dedicado dependencias municipales",    resultado: "perdida",    monto: 4_120_000 },
      { id: "s3", codigo: "5021-71-COT26",  nombre: "Servicio internet 200 Mbps",                    resultado: "activa",     monto: 6_840_000 },
    ],
    cotizantesHistorico: [
      { fecha: ago(96), cantidad: 0 },
      { fecha: ago(72), cantidad: 0 },
      { fecha: ago(48), cantidad: 1 },
      { fecha: ago(24), cantidad: 1 },
      { fecha: ago(8),  cantidad: 2 },
      { fecha: ago(0),  cantidad: 2 },
    ],
    hitos: {
      abierta: { fecha: ago(96) },
    },
  },
};

// Fallback so any licitacion id from the table opens with a sensible empty state.
export function getLicitacionDetail(id: string): LicitacionDetail {
  if (licitacionDetails[id]) return licitacionDetails[id];
  return {
    id,
    descripcion:
      "Las bases detalladas todavía no fueron procesadas para esta compra. Conecta Lovable Cloud para sincronizar automáticamente la información de Mercado Público.",
    items: [],
    documentosOrganismo: [],
    documentosEquipo: [],
    chat: [],
    notasInternas: "",
    actividad: [
      { id: "a-sys", tipo: "system", actor: "system", descripcion: "Compra detectada en Mercado Público", fecha: ago(2) },
    ],
    tags: [],
    competidores: [],
    similares: [],
    cotizantesHistorico: [],
    hitos: {},
  };
}

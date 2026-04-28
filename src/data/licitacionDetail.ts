// Detail-level mock data for a Licitación. Designed to be replaced 1:1 by Supabase queries.

import { team, type TeamMember } from "./mock";

export interface ItemSolicitado {
  id: string;
  numero: number;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precioUnitario?: number;
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

export interface Nota {
  id: string;
  autor: TeamMember;
  contenido: string;
  fecha: string;
}

export interface ActividadEvent {
  id: string;
  tipo: "status_change" | "assignment" | "note" | "document" | "quote" | "system";
  actor: TeamMember | "system";
  descripcion: string;
  fecha: string;
}

export interface LicitacionDetail {
  id: string;
  descripcion: string;
  requisitos: string[];
  items: ItemSolicitado[];
  documentos: Documento[];
  notas: Nota[];
  actividad: ActividadEvent[];
  tags: Tag[];
  competidores: { nombre: string; cotizaciones: number }[];
  similares: { id: string; codigo: string; nombre: string; resultado: "adjudicada" | "perdida" | "activa"; monto: number }[];
}

const ago = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();

export const licitacionDetails: Record<string, LicitacionDetail> = {
  l1: {
    id: "l1",
    descripcion:
      "Contratación del servicio de **internet dedicado simétrico de 100 Mbps** con SLA 99.5%, IP fija y soporte 24/7 para las dependencias municipales de la comuna de Punitaqui durante un período de 12 meses.\n\nEl proveedor adjudicado deberá hacerse cargo del equipamiento CPE en comodato y de la instalación inicial.",
    requisitos: [
      "Inicio del servicio dentro de 30 días corridos desde la adjudicación.",
      "SLA de disponibilidad mínimo 99.5% mensual.",
      "Soporte técnico 24/7 con tiempo de respuesta menor a 2 horas.",
      "Equipamiento CPE en comodato durante toda la vigencia del contrato.",
      "Boleta de garantía por 5% del monto adjudicado.",
    ],
    items: [
      { id: "i1", numero: 1, descripcion: "Servicio internet dedicado 100 Mbps simétrico", cantidad: 12, unidad: "mes", precioUnitario: 280_000 },
      { id: "i2", numero: 2, descripcion: "Instalación y puesta en marcha", cantidad: 1, unidad: "global", precioUnitario: 450_000 },
      { id: "i3", numero: 3, descripcion: "Equipamiento router CPE empresarial", cantidad: 1, unidad: "unidad", precioUnitario: 130_000 },
    ],
    documentos: [
      { id: "d1", nombre: "Bases técnicas administrativas.pdf", tipo: "pdf", tamano: "1.2 MB", subidoPor: team[0], fecha: ago(8) },
      { id: "d2", nombre: "Anexo 3 - Formulario económico.xlsx", tipo: "xlsx", tamano: "84 KB", subidoPor: team[0], fecha: ago(8) },
      { id: "d3", nombre: "Plano dependencias municipales.pdf", tipo: "pdf", tamano: "3.8 MB", subidoPor: team[1], fecha: ago(5) },
    ],
    notas: [
      {
        id: "n1",
        autor: team[1],
        contenido:
          "Revisé las bases. **Importante:** exigen IP fija y SLA 99.5%, lo tenemos cubierto con el plan Empresarial. Margen estimado ~22%.",
        fecha: ago(3),
      },
      {
        id: "n2",
        autor: team[2],
        contenido: "@javier confirmé con el proveedor el costo de instalación. Ajusté el ítem 2 a $450.000.",
        fecha: ago(1),
      },
    ],
    actividad: [
      { id: "a1", tipo: "system", actor: "system", descripcion: "Licitación detectada en Mercado Público", fecha: ago(8) },
      { id: "a2", tipo: "assignment", actor: team[3], descripcion: "asignó la licitación a María González", fecha: ago(7) },
      { id: "a3", tipo: "status_change", actor: team[0], descripcion: "movió de Nueva a En análisis", fecha: ago(6) },
      { id: "a4", tipo: "document", actor: team[0], descripcion: "subió Bases técnicas administrativas.pdf", fecha: ago(8) },
      { id: "a5", tipo: "note", actor: team[1], descripcion: "agregó una nota sobre el margen estimado", fecha: ago(3) },
      { id: "a6", tipo: "quote", actor: team[2], descripcion: "actualizó la cotización (3 ítems · $3.920.000)", fecha: ago(0.5) },
    ],
    tags: [
      { id: "t1", label: "Telecomunicaciones", color: "info" },
      { id: "t2", label: "Recurrente", color: "success" },
      { id: "t3", label: "Margen alto", color: "success" },
    ],
    competidores: [
      { nombre: "Telecom Norte Ltda.", cotizaciones: 12 },
      { nombre: "ConectaChile SpA", cotizaciones: 8 },
    ],
    similares: [
      { id: "s1", codigo: "3872-87-COT25", nombre: "Servicio internet dedicado 50 Mbps", resultado: "adjudicada", monto: 2_880_000 },
      { id: "s2", codigo: "3201-44-COT25", nombre: "Internet dedicado dependencias municipales", resultado: "perdida", monto: 4_120_000 },
      { id: "s3", codigo: "5021-71-COT26", nombre: "Servicio internet 200 Mbps", resultado: "activa", monto: 6_840_000 },
    ],
  },
};

// Fallback so any licitacion id from the table opens with a sensible empty state.
export function getLicitacionDetail(id: string): LicitacionDetail {
  if (licitacionDetails[id]) return licitacionDetails[id];
  return {
    id,
    descripcion:
      "Las bases detalladas todavía no fueron procesadas para esta licitación. Conecta Lovable Cloud para sincronizar automáticamente la información de Mercado Público.",
    requisitos: [],
    items: [],
    documentos: [],
    notas: [],
    actividad: [
      { id: "a-sys", tipo: "system", actor: "system", descripcion: "Licitación detectada en Mercado Público", fecha: ago(2) },
    ],
    tags: [],
    competidores: [],
    similares: [],
  };
}

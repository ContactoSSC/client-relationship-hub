// Mock data — replace with Supabase queries when backend is connected.
// Realistic Chilean Mercado Público data for SSC Limitada.

export type Region =
  | "Coquimbo"
  | "Valparaíso"
  | "Metropolitana"
  | "Maule"
  | "O'Higgins";

// 8 real process stages from SSC's actual app
export type EtapaProceso =
  | "abierta"
  | "cerrada"
  | "adjudicada"
  | "en_compra"
  | "entregada"
  | "notificada"
  | "cobro_1"
  | "cobro_2";

export const ETAPAS_ORDEN: EtapaProceso[] = [
  "abierta",
  "cerrada",
  "adjudicada",
  "en_compra",
  "entregada",
  "notificada",
  "cobro_1",
  "cobro_2",
];

export const etapaMeta: Record<EtapaProceso, { label: string; short: string; cls: string }> = {
  abierta:    { label: "Abierta",        short: "Abierta",   cls: "bg-info-soft text-info-soft-foreground" },
  cerrada:    { label: "Cerrada",        short: "Cerrada",   cls: "bg-warning-soft text-warning-soft-foreground" },
  adjudicada: { label: "Adjudicada",     short: "Adj.",      cls: "bg-success-soft text-success-soft-foreground" },
  en_compra:  { label: "En compra",      short: "Compra",    cls: "bg-primary/10 text-primary" },
  entregada:  { label: "Entregada",      short: "Entreg.",   cls: "bg-success-soft text-success-soft-foreground" },
  notificada: { label: "Notificada",     short: "Notif.",    cls: "bg-success-soft text-success-soft-foreground" },
  cobro_1:    { label: "Cobro 1",        short: "Cobro 1",   cls: "bg-success text-success-foreground" },
  cobro_2:    { label: "Cobro 2",        short: "Cobro 2",   cls: "bg-success text-success-foreground" },
};

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Organismo {
  institucion: string;
  unidad?: string;
  rut?: string;
  direccion?: string;
  region: Region;
}

export interface Licitacion {
  id: string;
  codigo: string;
  nombre: string;
  organismo: Organismo;
  monto: number;            // monto disponible (Mercado Público)
  cotizantes: number;
  publicacion: string;      // ISO
  cierre: string;           // ISO
  plazoEntregaDias?: number;
  segundoLlamado?: boolean;
  responsable?: TeamMember | null;
  etapa: EtapaProceso;
  favorita: boolean;
  // Operational flags / data
  oc?: string;
  requiereViajeStgo?: boolean;
  montoCobrado?: number;    // monto bruto cobrado al organismo (con IVA)
}

export const team: TeamMember[] = [
  { id: "u1", name: "María González", initials: "MG", color: "bg-info" },
  { id: "u2", name: "Javier Rojas",   initials: "JR", color: "bg-success" },
  { id: "u3", name: "Camila Pérez",   initials: "CP", color: "bg-warning" },
  { id: "u4", name: "Diego Soto",     initials: "DS", color: "bg-primary" },
];

const now = Date.now();
const inHours  = (h: number) => new Date(now + h * 3600_000).toISOString();
const agoHours = (h: number) => new Date(now - h * 3600_000).toISOString();

export const licitaciones: Licitacion[] = [
  {
    id: "l1",
    codigo: "3872-109-COT26",
    nombre: "Servicio de internet dedicado",
    organismo: {
      institucion: "I. MUNICIPALIDAD DE PUNITAQUI",
      unidad: "Depto. Educación",
      rut: "69.040.900-3",
      direccion: "Carlos Galleguillos s/n antiguo internado femenino",
      region: "Coquimbo",
    },
    monto: 3_920_000,
    cotizantes: 2,
    publicacion: agoHours(96),
    cierre: inHours(2.46),
    plazoEntregaDias: 3,
    segundoLlamado: true,
    responsable: null,
    etapa: "abierta",
    favorita: false,
  },
  {
    id: "l2",
    codigo: "1057439-2418-COT26",
    nombre: "Adquisición de Repuestos para Monitores Desfibrilador Zoll modelo serie R",
    organismo: {
      institucion: "SERVICIO DE SALUD COQUIMBO HOSPITAL LA SERENA",
      unidad: "Subdirección Administrativa",
      rut: "61.602.230-9",
      direccion: "Balmaceda 916, La Serena",
      region: "Coquimbo",
    },
    monto: 4_910_059,
    cotizantes: 1,
    publicacion: agoHours(72),
    cierre: inHours(4.62),
    plazoEntregaDias: 15,
    responsable: team[0],
    etapa: "abierta",
    favorita: false,
  },
  {
    id: "l3",
    codigo: "1057439-2416-COT26",
    nombre: "Mantención Correctiva de Electrocardiógrafo Nihon Kohden",
    organismo: {
      institucion: "SERVICIO DE SALUD COQUIMBO HOSPITAL LA SERENA",
      unidad: "Equipos Médicos",
      rut: "61.602.230-9",
      direccion: "Balmaceda 916, La Serena",
      region: "Coquimbo",
    },
    monto: 2_145_570,
    cotizantes: 1,
    publicacion: agoHours(60),
    cierre: inHours(4.83),
    plazoEntregaDias: 10,
    responsable: team[1],
    etapa: "cerrada",
    favorita: true,
  },
  {
    id: "l4",
    codigo: "1057439-2414-COT26",
    nombre: "Mantenimiento correctivo de Unidades Calefactoras de Pacientes",
    organismo: {
      institucion: "SERVICIO DE SALUD COQUIMBO HOSPITAL LA SERENA",
      unidad: "Equipos Médicos",
      rut: "61.602.230-9",
      direccion: "Balmaceda 916, La Serena",
      region: "Coquimbo",
    },
    monto: 1_481_459,
    cotizantes: 1,
    publicacion: agoHours(48),
    cierre: agoHours(4),
    plazoEntregaDias: 10,
    responsable: null,
    etapa: "adjudicada",
    favorita: false,
    oc: "1057439-128-AG26",
  },
  {
    id: "l5",
    codigo: "5021-88-COT26",
    nombre: "Suministro de papelería e insumos de oficina trimestre",
    organismo: {
      institucion: "MUNICIPALIDAD DE LA SERENA",
      unidad: "Depto. Adquisiciones",
      rut: "69.040.100-2",
      direccion: "Eduardo de la Barra 435, La Serena",
      region: "Coquimbo",
    },
    monto: 6_240_000,
    cotizantes: 4,
    publicacion: agoHours(120),
    cierre: agoHours(48),
    plazoEntregaDias: 7,
    responsable: team[2],
    etapa: "en_compra",
    favorita: true,
    oc: "5021-203-AG26",
    requiereViajeStgo: false,
  },
  {
    id: "l6",
    codigo: "2231-401-COT26",
    nombre: "Servicio de aseo industrial dependencias administrativas",
    organismo: {
      institucion: "GOBIERNO REGIONAL DE VALPARAÍSO",
      unidad: "Administración",
      rut: "72.227.700-K",
      direccion: "Melgarejo 669, Valparaíso",
      region: "Valparaíso",
    },
    monto: 12_870_000,
    cotizantes: 6,
    publicacion: agoHours(240),
    cierre: agoHours(120),
    plazoEntregaDias: 30,
    responsable: team[3],
    etapa: "entregada",
    favorita: false,
    oc: "2231-871-AG26",
    montoCobrado: 12_870_000,
  },
  {
    id: "l7",
    codigo: "9901-18-COT26",
    nombre: "Adquisición de equipos computacionales para sala de informática",
    organismo: {
      institucion: "LICEO BICENTENARIO TALCA",
      unidad: "UTP",
      rut: "70.123.456-7",
      direccion: "1 Norte 1234, Talca",
      region: "Maule",
    },
    monto: 8_450_300,
    cotizantes: 3,
    publicacion: agoHours(360),
    cierre: agoHours(240),
    plazoEntregaDias: 20,
    responsable: team[0],
    etapa: "cobro_1",
    favorita: false,
    oc: "9901-44-AG26",
    montoCobrado: 8_450_300,
    requiereViajeStgo: true,
  },
];

// Operational KPIs — counts of licitaciones in different real-world states
const countBy = (pred: (l: Licitacion) => boolean) => licitaciones.filter(pred).length;

export const kpis = {
  porCotizar: {
    value: countBy((l) => l.etapa === "abierta"),
    label: "Cierran pronto, sin cotización",
    deltaPct: 8.0,
    trend: [3, 4, 4, 5, 4, 5, 6],
  },
  enCompra: {
    value: countBy((l) => l.etapa === "adjudicada" || l.etapa === "en_compra"),
    label: "Adjudicadas pendientes de comprar",
    deltaPct: 2.1,
    trend: [2, 3, 3, 4, 3, 4, 4],
  },
  porEntregar: {
    value: countBy((l) => l.etapa === "en_compra"),
    label: "En tránsito al organismo",
    deltaPct: -1.2,
    trend: [4, 3, 3, 2, 3, 2, 2],
  },
  enCobro: {
    value: countBy((l) => l.etapa === "notificada" || l.etapa === "cobro_1"),
    label: "Esperando pago del organismo",
    deltaPct: 12.0,
    trend: [1, 2, 2, 3, 3, 4, 4],
  },
};

export const alerts = [
  {
    id: "a1",
    severity: "destructive" as const,
    title: "Token de Mercado Público expirado",
    description: "Expiró hace 25 min. Actualízalo para seguir recibiendo nuevas licitaciones.",
    cta: { label: "Ir a Administración", href: "/admin" },
  },
];

export const notifications = [
  { id: "n1", type: "deadline" as const,   title: "Cierre en 2h 28m",          description: "Servicio de internet dedicado · MUNICIPALIDAD DE PUNITAQUI", time: "hace 2 min" },
  { id: "n2", type: "assignment" as const, title: "Te asignaron una compra",   description: "Mantención Electrocardiógrafo · HOSPITAL LA SERENA",          time: "hace 18 min" },
  { id: "n3", type: "mention" as const,    title: "Camila te mencionó",        description: "“@diego revisa el ítem 4 de la cotización”",                  time: "hace 1 h" },
  { id: "n4", type: "system" as const,     title: "Token Mercado Público exp.", description: "Actualízalo en Administración",                              time: "hace 25 min" },
];

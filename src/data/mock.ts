// Mock data — replace with Supabase queries when backend is connected.
// Realistic Chilean Mercado Público data for SSC Limitada.

export type Region =
  | "Coquimbo"
  | "Valparaíso"
  | "Metropolitana"
  | "Maule"
  | "O'Higgins";

export type LicitacionStatus =
  | "nueva"
  | "analisis"
  | "cotizando"
  | "enviada"
  | "adjudicada"
  | "perdida";

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string; // tailwind class fragment like "bg-info"
}

export interface Licitacion {
  id: string;
  codigo: string;
  nombre: string;
  organismo: string;
  region: Region;
  monto: number;
  cotizantes: number;
  cierre: string; // ISO date
  responsable?: TeamMember | null;
  status: LicitacionStatus;
  favorita: boolean;
  marcadaVista: boolean;
}

export const team: TeamMember[] = [
  { id: "u1", name: "María González", initials: "MG", color: "bg-info" },
  { id: "u2", name: "Javier Rojas", initials: "JR", color: "bg-success" },
  { id: "u3", name: "Camila Pérez", initials: "CP", color: "bg-warning" },
  { id: "u4", name: "Diego Soto", initials: "DS", color: "bg-primary" },
];

const now = Date.now();
const inHours = (h: number) => new Date(now + h * 3600_000).toISOString();

export const licitaciones: Licitacion[] = [
  {
    id: "l1",
    codigo: "3872-109-COT26",
    nombre: "Servicio de internet dedicado",
    organismo: "I MUNICIPALIDAD DE PUNITAQUI",
    region: "Coquimbo",
    monto: 3_920_000,
    cotizantes: 2,
    cierre: inHours(2.46),
    responsable: null,
    status: "nueva",
    favorita: false,
    marcadaVista: true,
  },
  {
    id: "l2",
    codigo: "1057439-2418-COT26",
    nombre: "Adquisición de Repuestos para Monitores Desfibrilador Zoll modelo serie R",
    organismo: "SERVICIO DE SALUD COQUIMBO HOSPITAL LA SERENA",
    region: "Coquimbo",
    monto: 4_910_059,
    cotizantes: 1,
    cierre: inHours(4.62),
    responsable: team[0],
    status: "cotizando",
    favorita: false,
    marcadaVista: true,
  },
  {
    id: "l3",
    codigo: "1057439-2416-COT26",
    nombre: "Mantención Correctiva de Electrocardiógrafo Nihon Kohden",
    organismo: "SERVICIO DE SALUD COQUIMBO HOSPITAL LA SERENA",
    region: "Coquimbo",
    monto: 2_145_570,
    cotizantes: 1,
    cierre: inHours(4.83),
    responsable: team[1],
    status: "analisis",
    favorita: true,
    marcadaVista: true,
  },
  {
    id: "l4",
    codigo: "1057439-2414-COT26",
    nombre: "Mantenimiento correctivo de Unidades Calefactoras de Pacientes",
    organismo: "SERVICIO DE SALUD COQUIMBO HOSPITAL LA SERENA",
    region: "Coquimbo",
    monto: 1_481_459,
    cotizantes: 1,
    cierre: inHours(5.27),
    responsable: null,
    status: "nueva",
    favorita: false,
    marcadaVista: false,
  },
  {
    id: "l5",
    codigo: "5021-88-COT26",
    nombre: "Suministro de papelería e insumos de oficina trimestre",
    organismo: "MUNICIPALIDAD DE LA SERENA",
    region: "Coquimbo",
    monto: 6_240_000,
    cotizantes: 4,
    cierre: inHours(8.5),
    responsable: team[2],
    status: "enviada",
    favorita: true,
    marcadaVista: true,
  },
  {
    id: "l6",
    codigo: "2231-401-COT26",
    nombre: "Servicio de aseo industrial dependencias administrativas",
    organismo: "GOBIERNO REGIONAL DE VALPARAÍSO",
    region: "Valparaíso",
    monto: 12_870_000,
    cotizantes: 6,
    cierre: inHours(22),
    responsable: team[3],
    status: "cotizando",
    favorita: false,
    marcadaVista: true,
  },
  {
    id: "l7",
    codigo: "9901-18-COT26",
    nombre: "Adquisición de equipos computacionales para sala de informática",
    organismo: "LICEO BICENTENARIO TALCA",
    region: "Maule",
    monto: 8_450_300,
    cotizantes: 3,
    cierre: inHours(28.5),
    responsable: team[0],
    status: "analisis",
    favorita: false,
    marcadaVista: true,
  },
];

export const kpis = {
  activas: { value: 732, deltaPct: 4.2, trend: [12, 14, 13, 16, 15, 18, 22] },
  nuevas: { value: 22, deltaPct: 12.0, trend: [3, 5, 4, 6, 7, 8, 9] },
  favoritas: { value: 9, deltaPct: -2.1, trend: [10, 9, 11, 10, 9, 9, 9] },
  oportunidades: { value: 0, label: "<5h sin cotizantes", deltaPct: 0, trend: [2, 1, 0, 1, 0, 1, 0] },
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
  { id: "n1", type: "deadline" as const, title: "Cierre en 2h 28m", description: "Servicio de internet dedicado · MUNICIPALIDAD DE PUNITAQUI", time: "hace 2 min" },
  { id: "n2", type: "assignment" as const, title: "Te asignaron una licitación", description: "Mantención Electrocardiógrafo · HOSPITAL LA SERENA", time: "hace 18 min" },
  { id: "n3", type: "mention" as const, title: "Camila te mencionó", description: "“@diego revisa el ítem 4 de la cotización”", time: "hace 1 h" },
  { id: "n4", type: "system" as const, title: "Token Mercado Público expirado", description: "Actualízalo en Administración", time: "hace 25 min" },
];

import {
  Building2,
  MapPin,
  Tag as TagIcon,
  Plus,
  X,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import type { Licitacion, LicitacionStatus } from "@/data/mock";
import { team } from "@/data/mock";
import type { LicitacionDetail, Tag } from "@/data/licitacionDetail";
import { formatCLP } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusOptions: { id: LicitacionStatus; label: string; cls: string }[] = [
  { id: "nueva", label: "Nueva", cls: "bg-info-soft text-info-soft-foreground" },
  { id: "analisis", label: "En análisis", cls: "bg-warning-soft text-warning-soft-foreground" },
  { id: "cotizando", label: "Cotizando", cls: "bg-success-soft text-success-soft-foreground" },
  { id: "enviada", label: "Enviada", cls: "bg-primary/10 text-primary" },
  { id: "adjudicada", label: "Adjudicada", cls: "bg-success text-success-foreground" },
  { id: "perdida", label: "Perdida", cls: "bg-destructive-soft text-destructive-soft-foreground" },
];

const tagColorCls: Record<Tag["color"], string> = {
  info: "bg-info-soft text-info-soft-foreground",
  success: "bg-success-soft text-success-soft-foreground",
  warning: "bg-warning-soft text-warning-soft-foreground",
  destructive: "bg-destructive-soft text-destructive-soft-foreground",
  muted: "bg-surface-muted text-muted-foreground",
};

export function LicitacionSidePanel({
  licitacion,
  detail,
  onStatusChange,
}: {
  licitacion: Licitacion;
  detail: LicitacionDetail;
  onStatusChange: (s: LicitacionStatus) => void;
}) {
  const current = statusOptions.find((s) => s.id === licitacion.status)!;
  const competenciaLevel = Math.min(licitacion.cotizantes / 6, 1);

  // Demo "tasa de éxito" with this organismo
  const ganadas = detail.similares.filter((s) => s.resultado === "adjudicada").length;
  const cerradas = detail.similares.filter((s) => s.resultado !== "activa").length;
  const tasaExito = cerradas > 0 ? Math.round((ganadas / cerradas) * 100) : null;

  return (
    <aside className="space-y-4 lg:sticky lg:top-20">
      {/* Status */}
      <Section title="Estado">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-md border border-border bg-surface px-2.5 py-1.5 transition hover:bg-surface-muted">
              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", current.cls)}>
                {current.label}
              </span>
              <ChevronRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs">Cambiar estado</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((s) => (
              <DropdownMenuItem key={s.id} onSelect={() => onStatusChange(s.id)}>
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", s.cls)}>
                  {s.label}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      {/* Responsable */}
      <Section title="Responsable">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 transition hover:bg-surface-muted">
              {licitacion.responsable ? (
                <>
                  <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white", licitacion.responsable.color)}>
                    {licitacion.responsable.initials}
                  </div>
                  <span className="flex-1 truncate text-left text-sm">{licitacion.responsable.name}</span>
                </>
              ) : (
                <span className="flex-1 text-left text-sm text-muted-foreground">Sin asignar</span>
              )}
              <ChevronRight className="h-3.5 w-3.5 rotate-90 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {team.map((m) => (
              <DropdownMenuItem key={m.id} className="gap-2">
                <div className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white", m.color)}>
                  {m.initials}
                </div>
                {m.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      {/* Tags */}
      <Section title="Etiquetas" icon={TagIcon}>
        <div className="flex flex-wrap gap-1.5">
          {detail.tags.map((t) => (
            <span key={t.id} className={cn("group inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", tagColorCls[t.color])}>
              {t.label}
              <button className="opacity-0 transition group-hover:opacity-60 hover:!opacity-100" aria-label="Quitar">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
          <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] text-muted-foreground transition hover:border-border-strong hover:text-foreground">
            <Plus className="h-2.5 w-2.5" />
            Agregar
          </button>
        </div>
      </Section>

      {/* Monto */}
      <Section title="Monto estimado">
        <div className="text-xl font-semibold tabular-nums text-foreground">{formatCLP(licitacion.monto)}</div>
      </Section>

      {/* Organismo */}
      <Section title="Organismo" icon={Building2}>
        <div className="space-y-1">
          <div className="text-sm font-medium text-foreground">{licitacion.organismo}</div>
          <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Región de {licitacion.region}
          </div>
          {tasaExito !== null && (
            <div className="mt-2.5 flex items-center justify-between rounded-md bg-surface-muted px-2.5 py-1.5">
              <span className="text-[11px] text-muted-foreground">Tasa de éxito histórica</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                <TrendingUp className="h-3 w-3" />
                {tasaExito}%
              </span>
            </div>
          )}
        </div>
      </Section>

      {/* Competencia */}
      <Section title="Cotizantes actuales">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold tabular-nums text-foreground">{licitacion.cotizantes}</span>
          <span className="text-[11px] text-muted-foreground">
            {licitacion.cotizantes === 0 ? "Sin competencia" : licitacion.cotizantes <= 2 ? "Baja" : licitacion.cotizantes <= 5 ? "Media" : "Alta"}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              competenciaLevel < 0.34 ? "bg-success" : competenciaLevel < 0.67 ? "bg-warning" : "bg-destructive",
            )}
            style={{ width: `${Math.max(competenciaLevel * 100, 6)}%` }}
          />
        </div>
      </Section>
    </aside>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: typeof Building2;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3.5">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        {title}
      </div>
      {children}
    </div>
  );
}

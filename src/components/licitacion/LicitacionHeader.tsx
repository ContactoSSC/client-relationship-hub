import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  ChevronLeft,
  MoreHorizontal,
  Send,
  Building2,
  MapPin,
  UserPlus,
  Check,
  ExternalLink,
} from "lucide-react";
import type { Licitacion } from "@/data/mock";
import { team, etapaMeta } from "@/data/mock";
import { timeToDeadline } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CotizarModal } from "./CotizarModal";
import { type ItemSolicitado } from "@/data/licitacionDetail";

export function LicitacionHeader({
  licitacion,
  items,
  onToggleFav,
}: {
  licitacion: Licitacion;
  items: ItemSolicitado[];
  onToggleFav: () => void;
}) {
  const navigate = useNavigate();
  const [cotizarOpen, setCotizarOpen] = useState(false);
  const t = timeToDeadline(licitacion.cierre);
  const status = etapaMeta[licitacion.etapa];
  const cerrada = t.urgency === "expired";

  const countdownCls = cerrada
    ? "text-muted-foreground"
    : t.urgency === "critical"
      ? "text-destructive"
      : t.urgency === "warning"
        ? "text-warning"
        : "text-success";

  return (
    <>
      <div className="space-y-4">
        {/* Top: back + meta */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </button>
          <div className="h-4 w-px bg-border" />
          <span className="font-mono text-[11px] text-muted-foreground">{licitacion.codigo}</span>
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", status.cls)}>
            {status.label}
          </span>
          {licitacion.segundoLlamado && (
            <span className="inline-flex items-center rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-warning-soft-foreground">
              Segundo llamado
            </span>
          )}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground transition hover:text-foreground"
          >
            Ver en Mercado Público
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Title + actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1 space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {licitacion.nombre}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {licitacion.organismo.institucion}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Región de {licitacion.organismo.region}
              </span>
            </div>
          </div>

          {/* Countdown + actions */}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start lg:items-end">
            <div className="rounded-lg border border-border bg-surface px-4 py-2.5 text-right">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {cerrada ? "Cerró" : "Cierre en"}
              </div>
              <div className={cn("text-2xl font-semibold tabular-nums leading-tight", countdownCls)}>
                {t.label}
              </div>
              <div className="text-[10px] text-muted-foreground">{t.dateLabel}</div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onToggleFav}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface transition hover:bg-surface-muted",
                  licitacion.favorita && "text-warning",
                )}
                aria-label="Marcar favorita"
              >
                <Star className={cn("h-4 w-4", licitacion.favorita && "fill-warning")} />
              </button>

              <AssignDropdown licitacion={licitacion} />

              {(licitacion.etapa === "abierta" || licitacion.etapa === "cerrada") && (
                <button
                  onClick={() => setCotizarOpen(true)}
                  className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover"
                >
                  <Send className="h-3.5 w-3.5" />
                  Cotizar
                </button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition hover:bg-surface-muted">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Duplicar como cotización</DropdownMenuItem>
                  <DropdownMenuItem>Exportar PDF</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    Marcar como perdida
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <CotizarModal open={cotizarOpen} onOpenChange={setCotizarOpen} licitacion={licitacion} initialItems={items} />
    </>
  );
}

function AssignDropdown({ licitacion }: { licitacion: Licitacion }) {
  const current = licitacion.responsable;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-2 text-xs text-foreground transition hover:bg-surface-muted">
          {current ? (
            <>
              <div className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white", current.color)}>
                {current.initials}
              </div>
              <span className="hidden sm:inline">{current.name.split(" ")[0]}</span>
            </>
          ) : (
            <>
              <UserPlus className="h-3.5 w-3.5" />
              <span>Asignar</span>
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-xs">Asignar responsable</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {team.map((m) => {
          const isCurrent = current?.id === m.id;
          return (
            <DropdownMenuItem key={m.id} className="gap-2">
              <div className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white", m.color)}>
                {m.initials}
              </div>
              <span className="flex-1">{m.name}</span>
              {isCurrent && <Check className="h-3.5 w-3.5 text-success" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

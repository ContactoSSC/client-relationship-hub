import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Search, X, ListFilter, Plus, MapPin, ArrowUpDown, DollarSign, UserPlus, Send } from "lucide-react";
import { licitaciones as allLicitaciones, type Licitacion, type LicitacionStatus, team } from "@/data/mock";
import { getLicitacionDetail } from "@/data/licitacionDetail";
import { CotizarModal } from "@/components/licitacion/CotizarModal";
import { formatCLP, timeToDeadline } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Tab = "activas" | "cerradas" | "adjudicadas" | "todas";

const tabs: { id: Tab; label: string; count: number }[] = [
  { id: "activas", label: "Activas", count: 732 },
  { id: "cerradas", label: "Cerradas", count: 128 },
  { id: "adjudicadas", label: "Adjudicadas", count: 41 },
  { id: "todas", label: "Todas", count: 901 },
];

const statusMeta: Record<LicitacionStatus, { label: string; cls: string }> = {
  nueva: { label: "Nueva", cls: "bg-info-soft text-info-soft-foreground" },
  analisis: { label: "En análisis", cls: "bg-warning-soft text-warning-soft-foreground" },
  cotizando: { label: "Cotizando", cls: "bg-success-soft text-success-soft-foreground" },
  enviada: { label: "Enviada", cls: "bg-primary/10 text-primary" },
  adjudicada: { label: "Adjudicada", cls: "bg-success text-success-foreground" },
  perdida: { label: "Perdida", cls: "bg-destructive-soft text-destructive-soft-foreground" },
};

export function LicitacionesTable() {
  const [tab, setTab] = useState<Tab>("activas");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("Todas las regiones");
  const [order, setOrder] = useState<string>("Cierre próximo");
  const [montoMin, setMontoMin] = useState<string>("");
  const [items, setItems] = useState<Licitacion[]>(allLicitaciones);

  const filtered = useMemo(() => {
    return items.filter((l) => {
      if (region !== "Todas las regiones" && l.region !== region) return false;
      if (montoMin && l.monto < Number(montoMin)) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !l.codigo.toLowerCase().includes(q) &&
          !l.organismo.toLowerCase().includes(q) &&
          !l.nombre.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [items, region, montoMin, query]);

  const toggleFav = (id: string) =>
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, favorita: !l.favorita } : l)));

  const activeChips = [
    region !== "Todas las regiones" && { label: region, clear: () => setRegion("Todas las regiones") },
    montoMin && { label: `≥ ${formatCLP(Number(montoMin))}`, clear: () => setMontoMin("") },
    order !== "Cierre próximo" && { label: `Orden: ${order}`, clear: () => setOrder("Cierre próximo") },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <section className="rounded-xl border border-border bg-surface shadow-xs">
      {/* Tabs + search */}
      <div className="flex flex-col gap-3 border-b border-border px-4 pt-3 lg:flex-row lg:items-center lg:gap-4 lg:px-5">
        <div className="-mb-px flex flex-1 items-end gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "group relative flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 pb-2.5 pt-1 text-sm transition-colors",
                tab === t.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-px text-[10px] font-medium tabular-nums",
                  tab === t.id ? "bg-primary/10 text-primary" : "bg-surface-muted text-muted-foreground",
                )}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por código, organismo, nombre…"
            className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-ring"
          />
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2.5 lg:px-5">
        <FilterDropdown
          icon={MapPin}
          label={region}
          options={["Todas las regiones", "Coquimbo", "Valparaíso", "Metropolitana", "Maule", "O'Higgins"]}
          onSelect={setRegion}
        />
        <FilterDropdown
          icon={ArrowUpDown}
          label={`Orden: ${order}`}
          options={["Cierre próximo", "Mayor monto", "Menor monto", "Más reciente"]}
          onSelect={setOrder}
        />
        <div className="relative">
          <DollarSign className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={montoMin}
            onChange={(e) => setMontoMin(e.target.value.replace(/\D/g, ""))}
            placeholder="Monto mín."
            className="h-8 w-32 rounded-md border border-border bg-surface pl-7 pr-2 text-xs focus-ring"
          />
        </div>

        <button className="flex h-8 items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 text-xs text-muted-foreground transition hover:border-border-strong hover:text-foreground">
          <Plus className="h-3.5 w-3.5" />
          Añadir filtro
        </button>

        <div className="ml-auto flex items-center gap-2">
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {activeChips.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-foreground"
                >
                  {c.label}
                  <button onClick={c.clear} className="opacity-60 hover:opacity-100">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs text-muted-foreground transition hover:bg-surface-muted">
            <ListFilter className="h-3.5 w-3.5" />
            Vistas
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="w-10 py-2.5 pl-4" />
              <th className="w-36 py-2.5 text-left font-medium">Código</th>
              <th className="py-2.5 text-left font-medium">Compra</th>
              <th className="w-32 py-2.5 text-left font-medium">Estado</th>
              <th className="w-32 py-2.5 text-left font-medium">Responsable</th>
              <th className="w-24 py-2.5 text-center font-medium">Cotizantes</th>
              <th className="w-32 py-2.5 text-right font-medium">Monto</th>
              <th className="w-40 py-2.5 pr-4 text-right font-medium">Cierre</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <Row key={l.id} l={l} onToggleFav={() => toggleFav(l.id)} />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-16 text-center text-sm text-muted-foreground">
                  No hay licitaciones que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground lg:px-5">
        <span>
          Mostrando <span className="font-medium text-foreground">{filtered.length}</span> de {items.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="kbd">J</span>
          <span>/</span>
          <span className="kbd">K</span>
          <span>navegar</span>
          <span className="ml-3 kbd">↵</span>
          <span>abrir</span>
        </div>
      </div>
    </section>
  );
}

function Row({ l, onToggleFav }: { l: Licitacion; onToggleFav: () => void }) {
  const navigate = useNavigate();
  const [cotizarOpen, setCotizarOpen] = useState(false);
  const t = timeToDeadline(l.cierre);
  const status = statusMeta[l.status];

  const urgencyText =
    t.urgency === "expired"
      ? "text-destructive"
      : t.urgency === "critical"
        ? "text-warning"
        : t.urgency === "warning"
          ? "text-warning-soft-foreground"
          : "text-foreground";

  // Stop the row click when interacting with embedded controls
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      <tr
        onClick={() => navigate(`/licitaciones/${l.id}`)}
        className="group cursor-pointer border-b border-border/70 transition-colors hover:bg-surface-muted/60"
      >
        <td className="py-3 pl-4 align-middle" onClick={stop}>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
            className="text-muted-foreground transition hover:text-warning"
            aria-label="Marcar favorita"
          >
            <Star className={cn("h-4 w-4", l.favorita && "fill-warning text-warning")} />
          </button>
        </td>
        <td className="py-3 align-middle">
          <span className="font-mono text-[11px] text-muted-foreground">{l.codigo}</span>
        </td>
        <td className="py-3 align-middle">
          <div className="flex items-center gap-2">
            <div className="min-w-0">
              <div className="truncate font-medium text-foreground">{l.nombre}</div>
              <div className="truncate text-[11px] text-muted-foreground">
                {l.organismo} <span className="opacity-60">· Región de {l.region}</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setCotizarOpen(true); }}
              className="ml-1 hidden h-7 items-center gap-1 rounded-md border border-border bg-surface px-2 text-[11px] font-medium text-foreground opacity-0 shadow-xs transition hover:bg-surface-muted group-hover:opacity-100 lg:inline-flex"
            >
              <Send className="h-3 w-3" />
              Cotizar
            </button>
          </div>
        </td>
        <td className="py-3 align-middle">
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", status.cls)}>
            {status.label}
          </span>
        </td>
      <td className="py-3 align-middle">
        {l.responsable ? (
          <div className="flex items-center gap-2">
            <div className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white", l.responsable.color)}>
              {l.responsable.initials}
            </div>
            <span className="truncate text-xs text-foreground">{l.responsable.name.split(" ")[0]}</span>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-6 items-center gap-1 rounded-md border border-dashed border-border px-1.5 text-[11px] text-muted-foreground transition hover:border-border-strong hover:text-foreground">
                <UserPlus className="h-3 w-3" />
                Asignar
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel className="text-xs">Asignar responsable</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
        )}
      </td>
      <td className="py-3 text-center align-middle">
        <span
          className={cn(
            "inline-flex h-6 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-semibold tabular-nums",
            l.cotizantes === 0
              ? "bg-info text-info-foreground"
              : l.cotizantes <= 2
                ? "bg-success-soft text-success-soft-foreground"
                : "bg-surface-muted text-muted-foreground",
          )}
        >
          {l.cotizantes}
        </span>
      </td>
      <td className="py-3 pr-2 text-right align-middle font-medium tabular-nums text-foreground">
        {formatCLP(l.monto)}
      </td>
      <td className="py-3 pr-4 text-right align-middle">
        <div className={cn("text-sm font-semibold tabular-nums", urgencyText)}>{t.label}</div>
        <div className="text-[10px] text-muted-foreground">{t.dateLabel}</div>
      </td>
    </tr>
  );
}

function FilterDropdown({
  icon: Icon,
  label,
  options,
  onSelect,
}: {
  icon: typeof MapPin;
  label: string;
  options: string[];
  onSelect: (v: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground transition hover:bg-surface-muted">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          {label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((o) => (
          <DropdownMenuItem key={o} onSelect={() => onSelect(o)}>
            {o}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  CheckCircle2,
  Circle,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  UploadCloud,
  Send,
  AtSign,
  Activity,
  UserPlus,
  StickyNote,
  Paperclip,
  ArrowRight,
  Briefcase,
  Sparkles,
  ShoppingCart,
  Truck,
  Receipt,
  TrendingUp,
  Plus,
  Trash2,
  Pencil,
  Building2,
  Calendar,
  MapPin,
} from "lucide-react";
import type { Licitacion, EtapaProceso } from "@/data/mock";
import { ETAPAS_ORDEN, etapaMeta } from "@/data/mock";
import type {
  LicitacionDetail,
  ItemSolicitado,
  Documento,
  MensajeChat,
  ActividadEvent,
} from "@/data/licitacionDetail";
import { formatCLP, formatDate, relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const resultadoCls: Record<string, string> = {
  adjudicada: "bg-success-soft text-success-soft-foreground",
  perdida: "bg-destructive-soft text-destructive-soft-foreground",
  activa: "bg-info-soft text-info-soft-foreground",
};

export function LicitacionTabs({
  licitacion,
  detail,
  onEtapaChange,
}: {
  licitacion: Licitacion;
  detail: LicitacionDetail;
  onEtapaChange: (e: EtapaProceso) => void;
}) {
  return (
    <Tabs defaultValue="operacion" className="w-full">
      <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b border-border bg-transparent p-0">
        <TabTrigger value="operacion">Operación</TabTrigger>
        <TabTrigger value="equipo">
          Equipo
          <Count n={detail.chat.length + detail.documentosEquipo.length} />
        </TabTrigger>
        <TabTrigger value="datos">Datos</TabTrigger>
      </TabsList>

      <div className="pt-5">
        <TabsContent value="operacion" className="mt-0 animate-fade-in">
          <OperacionPanel licitacion={licitacion} detail={detail} onEtapaChange={onEtapaChange} />
        </TabsContent>
        <TabsContent value="equipo" className="mt-0 animate-fade-in">
          <EquipoPanel detail={detail} />
        </TabsContent>
        <TabsContent value="datos" className="mt-0 animate-fade-in">
          <DatosPanel licitacion={licitacion} detail={detail} />
        </TabsContent>
      </div>
    </Tabs>
  );
}

function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="relative flex h-9 items-center gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-3 text-sm text-muted-foreground shadow-none transition-colors data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
    >
      {children}
    </TabsTrigger>
  );
}

function Count({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="rounded-full bg-surface-muted px-1.5 py-px text-[10px] font-medium tabular-nums text-muted-foreground">
      {n}
    </span>
  );
}

/* ───────────────────── OPERACIÓN ───────────────────── */
function OperacionPanel({
  licitacion,
  detail,
  onEtapaChange,
}: {
  licitacion: Licitacion;
  detail: LicitacionDetail;
  onEtapaChange: (e: EtapaProceso) => void;
}) {
  return (
    <div className="space-y-6">
      <Card title="Descripción">
        <div className="prose prose-sm max-w-none text-foreground prose-strong:text-foreground prose-p:text-foreground/90">
          <ReactMarkdown>{detail.descripcion}</ReactMarkdown>
        </div>
      </Card>

      <ItemsCard items={detail.items} montoCobrado={licitacion.montoCobrado} />

      <ChecklistCard licitacion={licitacion} detail={detail} onEtapaChange={onEtapaChange} />
    </div>
  );
}

/* Items table — full operational cycle */
function ItemsCard({ items, montoCobrado }: { items: ItemSolicitado[]; montoCobrado?: number }) {
  const [edit, setEdit] = useState<ItemSolicitado[]>(items);

  const totalVenta = edit.reduce((acc, i) => acc + (i.precioVentaUnitario ?? 0) * i.cantidad, 0);
  const totalCosto = edit.reduce((acc, i) => acc + (i.costoUnitario ?? 0) * i.cantidad, 0);
  const cobrado = montoCobrado ?? totalVenta;
  const utilidad = cobrado - totalCosto;
  const margenPct = cobrado > 0 ? (utilidad / cobrado) * 100 : 0;
  const facturados = edit.filter((i) => i.facturado).length;

  const update = (id: string, patch: Partial<ItemSolicitado>) =>
    setEdit((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const margenCls =
    margenPct >= 20 ? "text-success" : margenPct >= 10 ? "text-warning" : "text-destructive";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Ítems · ciclo completo</h3>
          <span className="rounded-full bg-surface-muted px-1.5 py-px text-[10px] font-medium tabular-nums text-muted-foreground">
            {edit.length}
          </span>
        </div>
        <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-surface px-2 text-xs text-foreground transition hover:bg-surface-muted">
          <Plus className="h-3 w-3" />
          Agregar ítem
        </button>
      </div>

      {edit.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No hay ítems aún. Agrega uno para empezar a trackear su compra, costo, llegada y facturación.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted/60 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-8 py-2.5 pl-4 text-left font-medium">#</th>
                <th className="py-2.5 text-left font-medium">Descripción</th>
                <th className="w-16 py-2.5 text-right font-medium">Cant.</th>
                <th className="w-32 py-2.5 text-right font-medium">Costo unit.</th>
                <th className="w-32 py-2.5 text-right font-medium">Venta unit.</th>
                <th className="w-28 py-2.5 text-right font-medium">Subtotal</th>
                <th className="w-28 py-2.5 text-left font-medium">Llegada</th>
                <th className="w-20 py-2.5 pr-4 text-center font-medium">Facturado</th>
              </tr>
            </thead>
            <tbody>
              {edit.map((it) => {
                const subtotal = (it.precioVentaUnitario ?? 0) * it.cantidad;
                return (
                  <tr key={it.id} className="border-t border-border align-top">
                    <td className="py-3 pl-4 text-muted-foreground tabular-nums">{it.numero}</td>
                    <td className="py-3 pr-2">
                      <div className="text-foreground">{it.descripcion}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {it.unidad}{it.proveedor && ` · ${it.proveedor}`}
                      </div>
                    </td>
                    <td className="py-3 text-right tabular-nums">{it.cantidad}</td>
                    <td className="py-3 text-right">
                      <NumInput
                        value={it.costoUnitario ?? 0}
                        onChange={(v) => update(it.id, { costoUnitario: v })}
                      />
                    </td>
                    <td className="py-3 text-right">
                      <NumInput
                        value={it.precioVentaUnitario ?? 0}
                        onChange={(v) => update(it.id, { precioVentaUnitario: v })}
                      />
                    </td>
                    <td className="py-3 text-right font-medium tabular-nums text-foreground">
                      {formatCLP(subtotal)}
                    </td>
                    <td className="py-3">
                      {it.fechaLlegada ? (
                        <span className="text-xs text-foreground">{formatDate(it.fechaLlegada)}</span>
                      ) : (
                        <button className="text-[11px] text-muted-foreground transition hover:text-foreground">
                          + Marcar
                        </button>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <button
                        onClick={() => update(it.id, { facturado: !it.facturado })}
                        className={cn(
                          "inline-flex h-6 w-6 items-center justify-center rounded-md border transition",
                          it.facturado
                            ? "border-success bg-success text-success-foreground"
                            : "border-border bg-surface text-muted-foreground hover:bg-surface-muted",
                        )}
                        aria-label="Marcar facturado"
                      >
                        {it.facturado && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Rentabilidad strip */}
      <div className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-4">
        <Cell label="Total venta" value={formatCLP(totalVenta)} />
        <Cell label="Costo total" value={formatCLP(totalCosto)} muted />
        <Cell label="Cobrado" value={formatCLP(cobrado)} accent={montoCobrado != null} />
        <Cell
          label="Margen real"
          value={
            <span className={cn("tabular-nums", margenCls)}>
              {margenPct.toFixed(1)}%
              <span className="ml-1 text-[11px] text-muted-foreground">({formatCLP(utilidad)})</span>
            </span>
          }
        />
      </div>
      {edit.length > 0 && (
        <div className="border-t border-border bg-surface-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
          {facturados} de {edit.length} ítems facturados
        </div>
      )}
    </div>
  );
}

function NumInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value || ""}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder="0"
      className="h-8 w-28 rounded-md border border-border bg-surface px-2 text-right text-sm tabular-nums focus-ring"
    />
  );
}

function Cell({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={cn("bg-surface px-4 py-3", accent && "bg-primary/5")}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 text-base font-semibold tabular-nums", muted ? "text-muted-foreground" : "text-foreground")}>
        {value}
      </div>
    </div>
  );
}

/* Process checklist with dates and people */
function ChecklistCard({
  licitacion,
  detail,
  onEtapaChange,
}: {
  licitacion: Licitacion;
  detail: LicitacionDetail;
  onEtapaChange: (e: EtapaProceso) => void;
}) {
  const currentIdx = ETAPAS_ORDEN.indexOf(licitacion.etapa);

  return (
    <Card title="Estado del proceso" icon={Activity}>
      <ul className="divide-y divide-border">
        {ETAPAS_ORDEN.map((etapa, i) => {
          const meta = etapaMeta[etapa];
          const done = i < currentIdx;
          const active = i === currentIdx;
          const hito = detail.hitos[etapa];
          return (
            <li key={etapa} className="flex items-center gap-3 py-2.5">
              <button
                onClick={() => onEtapaChange(etapa)}
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition",
                  done && "bg-success text-success-foreground",
                  active && "border-2 border-primary bg-primary/10 text-primary",
                  !done && !active && "border border-dashed border-border text-muted-foreground hover:border-border-strong",
                )}
                aria-label={`Marcar ${meta.label}`}
              >
                {done ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-2 w-2" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className={cn("text-sm font-medium", done || active ? "text-foreground" : "text-muted-foreground")}>
                  {meta.label}
                </div>
                {hito && (
                  <div className="text-[11px] text-muted-foreground">
                    {formatDate(hito.fecha)}
                    {hito.por && ` · ${hito.por.name.split(" ")[0]}`}
                  </div>
                )}
              </div>
              {active && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  Etapa actual
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ───────────────────── EQUIPO ───────────────────── */
function EquipoPanel({ detail }: { detail: LicitacionDetail }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <ChatCard chat={detail.chat} />
      <div className="space-y-6">
        <FilesCard
          title="Archivos del equipo"
          subtitle="Cotizaciones, fichas técnicas, declaraciones juradas."
          files={detail.documentosEquipo}
          allowUpload
        />
        <NotasInternasCard text={detail.notasInternas} />
      </div>
    </div>
  );
}

function ChatCard({ chat }: { chat: MensajeChat[] }) {
  const [draft, setDraft] = useState("");
  return (
    <Card title={`Conversación del equipo (${chat.length})`} icon={Briefcase}>
      <div className="mb-3 rounded-md border border-border bg-surface p-2.5">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribe un mensaje… visible para todo el equipo en tiempo real."
          rows={2}
          className="w-full resize-none rounded-md border-0 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="flex items-center justify-between border-t border-border pt-2">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <AtSign className="h-3 w-3" /> Menciona con @
          </div>
          <button
            disabled={!draft.trim()}
            className="flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-40"
          >
            <Send className="h-3 w-3" /> Enviar
          </button>
        </div>
      </div>

      {chat.length === 0 ? (
        <Empty>Sé el primero en comentar.</Empty>
      ) : (
        <ul className="space-y-3">
          {chat.map((m) => (
            <li key={m.id} className="flex gap-2.5">
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white", m.autor.color)}>
                {m.autor.initials}
              </div>
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-surface p-2.5">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-foreground">{m.autor.name}</span>
                  <span className="text-[11px] text-muted-foreground">{relativeTime(m.fecha)}</span>
                </div>
                <div className="text-sm text-foreground/90">{m.contenido}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function NotasInternasCard({ text }: { text: string }) {
  const [val, setVal] = useState(text);
  return (
    <Card title="Notas internas" icon={StickyNote}>
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={4}
        placeholder="Cualquier anotación interna del equipo…"
        className="w-full resize-none rounded-md border border-border bg-surface px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-ring"
      />
    </Card>
  );
}

const fileIconMap: Record<Documento["tipo"], typeof FileText> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: FileText,
  img: FileImage,
};

function FilesCard({
  title,
  subtitle,
  files,
  allowUpload,
}: {
  title: string;
  subtitle: string;
  files: Documento[];
  allowUpload?: boolean;
}) {
  return (
    <Card title={title} icon={Paperclip}>
      <p className="mb-3 text-[11px] text-muted-foreground">{subtitle}</p>
      {allowUpload && (
        <button className="mb-3 flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border bg-surface px-4 py-5 text-xs text-muted-foreground transition hover:border-border-strong hover:bg-surface-muted hover:text-foreground">
          <UploadCloud className="h-5 w-5" />
          <span>Arrastra archivos o haz clic para subir</span>
        </button>
      )}
      {files.length === 0 ? (
        <Empty>{allowUpload ? "Sin archivos todavía." : "El organismo no publicó archivos adjuntos."}</Empty>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {files.map((d) => {
            const Icon = fileIconMap[d.tipo] ?? File;
            return (
              <li key={d.id} className="flex items-center gap-2.5 px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-muted text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-foreground">{d.nombre}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {d.tamano} · {d.subidoPor.name.split(" ")[0]} · {relativeTime(d.fecha)}
                  </div>
                </div>
                <button className="rounded-md px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-surface-muted hover:text-foreground">
                  Descargar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* ───────────────────── DATOS ───────────────────── */
function DatosPanel({ licitacion, detail }: { licitacion: Licitacion; detail: LicitacionDetail }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <OrganismoCard licitacion={licitacion} detail={detail} />
        <FilesCard
          title="Archivos del organismo"
          subtitle="Bases, anexos y formularios publicados en Mercado Público."
          files={detail.documentosOrganismo}
        />
      </div>
      <div className="space-y-6">
        <CotizantesChart data={detail.cotizantesHistorico} actuales={licitacion.cotizantes} />
        <CompetidoresCard competidores={detail.competidores} />
        <SimilaresCard similares={detail.similares} />
        <ActividadCard eventos={detail.actividad} />
      </div>
    </div>
  );
}

function OrganismoCard({ licitacion, detail: _d }: { licitacion: Licitacion; detail: LicitacionDetail }) {
  const o = licitacion.organismo;
  return (
    <Card title="Organismo" icon={Building2}>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-2">
        <Field label="Institución" value={o.institucion} full />
        {o.unidad &&    <Field label="Unidad" value={o.unidad} />}
        {o.rut &&       <Field label="RUT" value={<span className="font-mono">{o.rut}</span>} />}
        {o.direccion && <Field label="Dirección" value={o.direccion} full />}
        <Field label="Región" value={`Región de ${o.region}`} />
      </dl>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm sm:grid-cols-3">
        <Field icon={Calendar} label="Publicación" value={formatDate(licitacion.publicacion)} />
        <Field icon={Calendar} label="Cierre" value={formatDate(licitacion.cierre)} />
        {licitacion.plazoEntregaDias != null && (
          <Field icon={Truck} label="Plazo entrega" value={`${licitacion.plazoEntregaDias} día(s)`} />
        )}
        {licitacion.oc && <Field icon={Receipt} label="N° OC" value={<span className="font-mono">{licitacion.oc}</span>} />}
      </div>
    </Card>
  );
}

function Field({
  label,
  value,
  icon: Icon,
  full,
}: {
  label: string;
  value: React.ReactNode;
  icon?: typeof Building2;
  full?: boolean;
}) {
  return (
    <div className={cn(full && "sm:col-span-2")}>
      <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function CotizantesChart({ data, actuales }: { data: { fecha: string; cantidad: number }[]; actuales: number }) {
  if (data.length === 0) {
    return (
      <Card title="Evolución de cotizantes" icon={TrendingUp}>
        <Empty>Sin histórico todavía.</Empty>
      </Card>
    );
  }

  const w = 320;
  const h = 120;
  const padding = 24;
  const max = Math.max(...data.map((d) => d.cantidad), 1) + 1;
  const xs = data.map((_, i) => padding + (i / (data.length - 1)) * (w - padding * 2));
  const ys = data.map((d) => h - padding - (d.cantidad / max) * (h - padding * 2));
  const points = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = `${padding},${h - padding} ${points} ${xs[xs.length - 1]},${h - padding}`;

  return (
    <Card title="Evolución de cotizantes" icon={TrendingUp}>
      <div className="mb-2 flex items-baseline justify-between">
        <div>
          <div className="text-2xl font-semibold tabular-nums text-foreground">{actuales}</div>
          <div className="text-[11px] text-muted-foreground">cotizantes actuales</div>
        </div>
        <div className="text-right text-[11px] text-muted-foreground">
          <div>{formatDate(data[0].fecha)}</div>
          <div>{formatDate(data[data.length - 1].fecha)}</div>
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* y grid */}
        {Array.from({ length: max + 1 }).map((_, i) => {
          const y = h - padding - (i / max) * (h - padding * 2);
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={w - padding} y2={y} stroke="hsl(var(--border))" strokeDasharray="2 3" />
              <text x={padding - 6} y={y + 3} fontSize="9" textAnchor="end" fill="hsl(var(--muted-foreground))">{i}</text>
            </g>
          );
        })}
        <polygon points={area} fill="hsl(var(--primary) / 0.08)" />
        <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r={3} fill="hsl(var(--primary))" />
        ))}
      </svg>
    </Card>
  );
}

function CompetidoresCard({ competidores }: { competidores: { nombre: string; cotizaciones: number }[] }) {
  return (
    <Card title="Competidores cotizando" icon={Briefcase}>
      {competidores.length === 0 ? (
        <Empty>Aún no hay competidores visibles.</Empty>
      ) : (
        <ul className="space-y-2">
          {competidores.map((c, i) => (
            <li key={i} className="flex items-center justify-between rounded-md bg-surface-muted px-2.5 py-2 text-sm">
              <span className="truncate text-foreground">{c.nombre}</span>
              <span className="text-xs text-muted-foreground tabular-nums">{c.cotizaciones} cotiz.</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function SimilaresCard({ similares }: { similares: LicitacionDetail["similares"] }) {
  return (
    <Card title="Compras similares" icon={Sparkles}>
      {similares.length === 0 ? (
        <Empty>Sin histórico aún.</Empty>
      ) : (
        <ul className="space-y-2">
          {similares.map((s) => (
            <li key={s.id} className="rounded-md border border-border p-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm text-foreground">{s.nombre}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{s.codigo}</div>
                </div>
                <span className={cn("inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize", resultadoCls[s.resultado])}>
                  {s.resultado}
                </span>
              </div>
              <div className="mt-1 text-xs font-medium tabular-nums text-foreground">{formatCLP(s.monto)}</div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

const actividadIconMap: Record<ActividadEvent["tipo"], typeof Activity> = {
  stage_change: ArrowRight,
  assignment: UserPlus,
  note: StickyNote,
  document: Paperclip,
  quote: Send,
  purchase: ShoppingCart,
  delivery: Truck,
  billing: Receipt,
  system: Activity,
};

function ActividadCard({ eventos }: { eventos: ActividadEvent[] }) {
  if (eventos.length === 0) {
    return (
      <Card title="Actividad" icon={Activity}>
        <Empty>Sin actividad registrada.</Empty>
      </Card>
    );
  }
  const sorted = [...eventos].sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha));
  return (
    <Card title="Actividad reciente" icon={Activity}>
      <ol className="relative space-y-4">
        {sorted.slice(0, 8).map((e, i) => {
          const Icon = actividadIconMap[e.tipo];
          const actor = e.actor === "system" ? null : e.actor;
          return (
            <li key={e.id} className="relative pl-8">
              {i < Math.min(sorted.length, 8) - 1 && (
                <span className="absolute left-2.5 top-6 h-full w-px bg-border" aria-hidden />
              )}
              <span className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground">
                <Icon className="h-2.5 w-2.5" />
              </span>
              <div className="flex flex-wrap items-baseline gap-1.5 text-xs">
                {actor ? (
                  <span className="font-medium text-foreground">{actor.name}</span>
                ) : (
                  <span className="font-medium text-muted-foreground">Sistema</span>
                )}
                <span className="text-foreground/80">{e.descripcion}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{relativeTime(e.fecha)}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/* ─────────── shared ─────────── */
function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: typeof Activity;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {title}
      </div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
      {children}
    </div>
  );
}

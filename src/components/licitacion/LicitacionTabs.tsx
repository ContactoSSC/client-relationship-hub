import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  UploadCloud,
  Send,
  AtSign,
  ArrowRight,
  Activity,
  UserPlus,
  StickyNote,
  Paperclip,
  Briefcase,
  Sparkles,
} from "lucide-react";
import type { Licitacion } from "@/data/mock";
import type { LicitacionDetail, ItemSolicitado, Documento, Nota, ActividadEvent } from "@/data/licitacionDetail";
import { formatCLP } from "@/lib/format";
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
}: {
  licitacion: Licitacion;
  detail: LicitacionDetail;
}) {
  return (
    <Tabs defaultValue="resumen" className="w-full">
      <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b border-border bg-transparent p-0">
        <TabTrigger value="resumen">Resumen</TabTrigger>
        <TabTrigger value="cotizacion">Cotización</TabTrigger>
        <TabTrigger value="documentos">
          Documentos
          <Count n={detail.documentos.length} />
        </TabTrigger>
        <TabTrigger value="notas">
          Notas
          <Count n={detail.notas.length} />
        </TabTrigger>
        <TabTrigger value="actividad">Actividad</TabTrigger>
      </TabsList>

      <div className="pt-5">
        <TabsContent value="resumen" className="mt-0 animate-fade-in">
          <ResumenPanel licitacion={licitacion} detail={detail} />
        </TabsContent>
        <TabsContent value="cotizacion" className="mt-0 animate-fade-in">
          <CotizacionPanel items={detail.items} />
        </TabsContent>
        <TabsContent value="documentos" className="mt-0 animate-fade-in">
          <DocumentosPanel docs={detail.documentos} />
        </TabsContent>
        <TabsContent value="notas" className="mt-0 animate-fade-in">
          <NotasPanel notas={detail.notas} />
        </TabsContent>
        <TabsContent value="actividad" className="mt-0 animate-fade-in">
          <ActividadPanel eventos={detail.actividad} />
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

/* ─────────── Resumen ─────────── */
function ResumenPanel({ licitacion: _l, detail }: { licitacion: Licitacion; detail: LicitacionDetail }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card title="Descripción">
          <div className="prose prose-sm max-w-none text-foreground prose-strong:text-foreground prose-p:text-foreground/90">
            <ReactMarkdown>{detail.descripcion}</ReactMarkdown>
          </div>
        </Card>

        <Card title="Requisitos clave" icon={CheckCircle2}>
          {detail.requisitos.length > 0 ? (
            <ul className="space-y-2">
              {detail.requisitos.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-foreground">{r}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Sin requisitos extraídos.</Empty>
          )}
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Competidores cotizando" icon={Briefcase}>
          {detail.competidores.length > 0 ? (
            <ul className="space-y-2">
              {detail.competidores.map((c, i) => (
                <li key={i} className="flex items-center justify-between rounded-md bg-surface-muted px-2.5 py-2 text-sm">
                  <span className="truncate text-foreground">{c.nombre}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{c.cotizaciones} cotiz.</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Aún no hay competidores visibles.</Empty>
          )}
        </Card>

        <Card title="Licitaciones similares" icon={Sparkles}>
          {detail.similares.length > 0 ? (
            <ul className="space-y-2">
              {detail.similares.map((s) => (
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
          ) : (
            <Empty>Sin histórico aún.</Empty>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ─────────── Cotización ─────────── */
function CotizacionPanel({ items }: { items: ItemSolicitado[] }) {
  const [edit, setEdit] = useState<ItemSolicitado[]>(items);
  const total = edit.reduce((acc, i) => acc + (i.precioUnitario ?? 0) * i.cantidad, 0);
  const margenEstimado = 22;

  if (edit.length === 0) {
    return (
      <Card title="Cotización">
        <Empty>No hay ítems cargados todavía. Conecta Mercado Público para sincronizarlos.</Empty>
      </Card>
    );
  }

  const updatePrecio = (id: string, value: number) =>
    setEdit((prev) => prev.map((i) => (i.id === id ? { ...i, precioUnitario: value } : i)));

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted/60 text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="w-10 py-2.5 pl-4 text-left font-medium">#</th>
              <th className="py-2.5 text-left font-medium">Ítem solicitado</th>
              <th className="w-20 py-2.5 text-right font-medium">Cant.</th>
              <th className="w-20 py-2.5 text-left font-medium">Unidad</th>
              <th className="w-36 py-2.5 text-right font-medium">Precio unit.</th>
              <th className="w-32 py-2.5 pr-4 text-right font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {edit.map((it) => {
              const subtotal = (it.precioUnitario ?? 0) * it.cantidad;
              return (
                <tr key={it.id} className="border-t border-border">
                  <td className="py-3 pl-4 align-middle text-muted-foreground tabular-nums">{it.numero}</td>
                  <td className="py-3 align-middle text-foreground">{it.descripcion}</td>
                  <td className="py-3 text-right align-middle tabular-nums">{it.cantidad}</td>
                  <td className="py-3 align-middle text-xs text-muted-foreground">{it.unidad}</td>
                  <td className="py-3 text-right align-middle">
                    <input
                      type="number"
                      value={it.precioUnitario ?? 0}
                      onChange={(e) => updatePrecio(it.id, Number(e.target.value))}
                      className="h-8 w-32 rounded-md border border-border bg-surface px-2 text-right text-sm tabular-nums focus-ring"
                    />
                  </td>
                  <td className="py-3 pr-4 text-right align-middle font-medium tabular-nums text-foreground">
                    {formatCLP(subtotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card title="Total cotizado">
          <div className="text-2xl font-semibold tabular-nums text-foreground">{formatCLP(total)}</div>
        </Card>
        <Card title="Margen estimado">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold tabular-nums text-success">{margenEstimado}%</span>
            <span className="text-xs text-muted-foreground">≈ {formatCLP(Math.round((total * margenEstimado) / 100))}</span>
          </div>
        </Card>
        <Card title="Ítems">
          <div className="text-2xl font-semibold tabular-nums text-foreground">{edit.length}</div>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <button className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm transition hover:bg-surface-muted">
          Guardar borrador
        </button>
        <button className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover">
          <Send className="h-3.5 w-3.5" />
          Marcar como enviada
        </button>
      </div>
    </div>
  );
}

/* ─────────── Documentos ─────────── */
const fileIconMap: Record<Documento["tipo"], typeof FileText> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: FileText,
  img: FileImage,
};

function DocumentosPanel({ docs }: { docs: Documento[] }) {
  return (
    <div className="space-y-4">
      <button className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-surface px-6 py-8 text-sm text-muted-foreground transition hover:border-border-strong hover:bg-surface-muted hover:text-foreground">
        <UploadCloud className="h-6 w-6" />
        <div>
          <span className="font-medium">Arrastra archivos aquí</span> o haz clic para subir
        </div>
        <div className="text-[11px] text-muted-foreground">PDF, XLSX, DOCX, PNG · máx. 25 MB</div>
      </button>

      {docs.length === 0 ? (
        <Empty>Sin documentos adjuntos todavía.</Empty>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
          {docs.map((d) => {
            const Icon = fileIconMap[d.tipo] ?? File;
            return (
              <li key={d.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-muted text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{d.nombre}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {d.tamano} · subido por {d.subidoPor.name.split(" ")[0]} · {relativeTime(d.fecha)}
                  </div>
                </div>
                <button className="rounded-md px-2.5 py-1 text-xs text-muted-foreground transition hover:bg-surface-muted hover:text-foreground">
                  Descargar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ─────────── Notas ─────────── */
function NotasPanel({ notas }: { notas: Nota[] }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribe una nota… usa @ para mencionar al equipo. Soporta **markdown**."
          rows={3}
          className="w-full resize-none rounded-md border-0 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
        <div className="flex items-center justify-between border-t border-border pt-2">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <AtSign className="h-3 w-3" />
            Menciona con @
          </div>
          <button
            disabled={!draft.trim()}
            className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-40"
          >
            <Send className="h-3 w-3" />
            Publicar
          </button>
        </div>
      </div>

      {notas.length === 0 ? (
        <Empty>Sin notas todavía. Sé el primero en compartir contexto.</Empty>
      ) : (
        <ul className="space-y-3">
          {notas.map((n) => (
            <li key={n.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white", n.autor.color)}>
                    {n.autor.initials}
                  </div>
                  <span className="text-sm font-medium text-foreground">{n.autor.name}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{relativeTime(n.fecha)}</span>
              </div>
              <div className="prose prose-sm max-w-none text-foreground prose-strong:text-foreground prose-p:my-1">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p>{highlightMentions(children)}</p>,
                  }}
                >
                  {n.contenido}
                </ReactMarkdown>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────── Actividad ─────────── */
const actividadIconMap: Record<ActividadEvent["tipo"], typeof Activity> = {
  status_change: ArrowRight,
  assignment: UserPlus,
  note: StickyNote,
  document: Paperclip,
  quote: Send,
  system: Activity,
};

function ActividadPanel({ eventos }: { eventos: ActividadEvent[] }) {
  if (eventos.length === 0) return <Empty>Sin actividad registrada.</Empty>;

  const sorted = [...eventos].sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha));

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <ol className="relative space-y-5">
        {sorted.map((e, i) => {
          const Icon = actividadIconMap[e.tipo];
          const actor = e.actor === "system" ? null : e.actor;
          return (
            <li key={e.id} className="relative pl-9">
              {i < sorted.length - 1 && (
                <span className="absolute left-3 top-7 h-full w-px bg-border" aria-hidden />
              )}
              <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground">
                <Icon className="h-3 w-3" />
              </span>
              <div className="flex flex-wrap items-baseline gap-1.5 text-sm">
                {actor ? (
                  <span className="font-medium text-foreground">{actor.name}</span>
                ) : (
                  <span className="font-medium text-muted-foreground">Sistema</span>
                )}
                <span className="text-foreground/80">{e.descripcion}</span>
                <span className="ml-auto text-[11px] text-muted-foreground">{relativeTime(e.fecha)}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
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
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        {title}
      </div>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">{children}</div>;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

function highlightMentions(children: React.ReactNode): React.ReactNode {
  if (typeof children === "string") {
    const parts = children.split(/(@\w+)/g);
    return parts.map((p, i) =>
      p.startsWith("@") ? (
        <span key={i} className="rounded bg-info-soft px-1 py-px text-info-soft-foreground">
          {p}
        </span>
      ) : (
        <span key={i}>{p}</span>
      ),
    );
  }
  if (Array.isArray(children)) return children.map((c, i) => <span key={i}>{highlightMentions(c)}</span>);
  return children;
}

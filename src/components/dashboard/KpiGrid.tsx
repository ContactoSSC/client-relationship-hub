import { TrendingUp, TrendingDown, Activity, Sparkles, Star, Zap } from "lucide-react";
import { kpis } from "@/data/mock";
import { cn } from "@/lib/utils";

interface KpiDef {
  key: keyof typeof kpis;
  label: string;
  icon: typeof Activity;
  highlight?: boolean;
  hint?: string;
}

const items: KpiDef[] = [
  { key: "activas", label: "Activas", icon: Activity },
  { key: "nuevas", label: "Nuevas", icon: Sparkles },
  { key: "favoritas", label: "Favoritas", icon: Star },
  { key: "oportunidades", label: "Oportunidades", icon: Zap, highlight: true, hint: "<5h sin cotizantes" },
];

export function KpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {items.map((it) => {
        const data = kpis[it.key];
        return (
          <KpiCard
            key={it.key}
            label={it.label}
            value={data.value}
            deltaPct={data.deltaPct}
            trend={data.trend}
            icon={it.icon}
            highlight={it.highlight}
            hint={it.hint ?? (data as { label?: string }).label}
          />
        );
      })}
    </div>
  );
}

function KpiCard({
  label,
  value,
  deltaPct,
  trend,
  icon: Icon,
  highlight,
  hint,
}: {
  label: string;
  value: number;
  deltaPct: number;
  trend: number[];
  icon: typeof Activity;
  highlight?: boolean;
  hint?: string;
}) {
  const positive = deltaPct >= 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:shadow-md",
        highlight
          ? "border-info/30 bg-gradient-to-br from-info/10 via-surface to-surface"
          : "border-border bg-surface",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <div className="text-xs font-medium text-muted-foreground">{label}</div>
        </div>
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md",
            highlight ? "bg-info/15 text-info" : "bg-surface-muted text-muted-foreground",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
          {value.toLocaleString("es-CL")}
        </div>
        {deltaPct !== 0 && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-[11px] font-medium",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? "+" : ""}
            {deltaPct.toFixed(1)}%
          </div>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="text-[11px] text-muted-foreground">
          {hint ?? "vs período anterior"}
        </div>
        <Sparkline data={trend} positive={positive} highlight={highlight} />
      </div>
    </div>
  );
}

function Sparkline({
  data,
  positive,
  highlight,
}: {
  data: number[];
  positive: boolean;
  highlight?: boolean;
}) {
  const w = 64;
  const h = 20;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const stroke = highlight
    ? "hsl(var(--info))"
    : positive
      ? "hsl(var(--success))"
      : "hsl(var(--destructive))";

  return (
    <svg width={w} height={h} className="opacity-90">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

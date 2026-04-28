import { AlertTriangle, ArrowUpRight, X } from "lucide-react";
import { useState } from "react";
import { alerts } from "@/data/mock";
import { cn } from "@/lib/utils";

export function AlertBanner() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = alerts.filter((a) => !dismissed.includes(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.map((a) => (
        <div
          key={a.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm animate-fade-in",
            "border-destructive/20 bg-destructive-soft text-destructive-soft-foreground",
          )}
          role="alert"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="font-medium">{a.title}</div>
            <div className="text-xs opacity-90">{a.description}</div>
          </div>
          <a
            href={a.cta.href}
            className="hidden items-center gap-1 rounded-md border border-destructive/30 bg-surface px-3 py-1.5 text-xs font-medium text-destructive-soft-foreground transition hover:bg-surface-muted sm:inline-flex"
          >
            {a.cta.label}
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <button
            onClick={() => setDismissed((d) => [...d, a.id])}
            className="rounded p-1 text-current opacity-70 hover:bg-surface/40 hover:opacity-100"
            aria-label="Cerrar alerta"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

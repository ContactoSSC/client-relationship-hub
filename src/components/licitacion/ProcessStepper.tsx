import { Check } from "lucide-react";
import { ETAPAS_ORDEN, etapaMeta, type EtapaProceso } from "@/data/mock";
import { cn } from "@/lib/utils";

export function ProcessStepper({
  current,
  onChange,
}: {
  current: EtapaProceso;
  onChange?: (e: EtapaProceso) => void;
}) {
  const currentIdx = ETAPAS_ORDEN.indexOf(current);

  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="flex items-center gap-1 overflow-x-auto">
        {ETAPAS_ORDEN.map((e, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          const pending = i > currentIdx;
          return (
            <div key={e} className="flex min-w-0 flex-1 items-center gap-1">
              <button
                onClick={() => onChange?.(e)}
                className={cn(
                  "group flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                  active && "bg-primary/8",
                  !active && "hover:bg-surface-muted",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums transition-colors",
                    done && "bg-success text-success-foreground",
                    active && "bg-primary text-primary-foreground ring-2 ring-primary/25 ring-offset-1 ring-offset-surface",
                    pending && "border border-dashed border-border bg-surface text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "min-w-0 truncate text-[11px] font-medium",
                    active ? "text-foreground" : done ? "text-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {etapaMeta[e].short}
                </span>
              </button>
              {i < ETAPAS_ORDEN.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "h-px w-3 shrink-0",
                    i < currentIdx ? "bg-success/60" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

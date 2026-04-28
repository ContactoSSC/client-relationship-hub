import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Send, Save } from "lucide-react";
import type { Licitacion } from "@/data/mock";
import type { ItemSolicitado } from "@/data/licitacionDetail";
import { formatCLP } from "@/lib/format";

export function CotizarModal({
  open,
  onOpenChange,
  licitacion,
  initialItems,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  licitacion: Licitacion;
  initialItems: ItemSolicitado[];
}) {
  const [items, setItems] = useState<ItemSolicitado[]>(initialItems);
  const [notas, setNotas] = useState("");

  // reset on open
  useMemo(() => {
    if (open) {
      setItems(initialItems);
      setNotas("");
    }
  }, [open, initialItems]);

  const total = items.reduce((acc, i) => acc + (i.precioUnitario ?? 0) * i.cantidad, 0);

  const handleSave = (enviar: boolean) => {
    onOpenChange(false);
    toast.success(enviar ? "Cotización enviada" : "Borrador guardado", {
      description: `${licitacion.codigo} · ${formatCLP(total)} · ${items.length} ítem${items.length === 1 ? "" : "s"}`,
    });
  };

  const updatePrecio = (id: string, value: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, precioUnitario: value } : i)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cotizar licitación</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {licitacion.codigo} · {licitacion.organismo}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {items.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Sin ítems registrados todavía. Agrega manualmente o sincroniza con Mercado Público.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface-muted text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="w-8 py-2 pl-3 text-left font-medium">#</th>
                    <th className="py-2 text-left font-medium">Descripción</th>
                    <th className="w-20 py-2 text-right font-medium">Cant.</th>
                    <th className="w-32 py-2 text-right font-medium">Precio unit.</th>
                    <th className="w-32 py-2 pr-3 text-right font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => {
                    const subtotal = (it.precioUnitario ?? 0) * it.cantidad;
                    return (
                      <tr key={it.id} className="border-t border-border">
                        <td className="py-2 pl-3 align-middle text-muted-foreground">{it.numero}</td>
                        <td className="py-2 align-middle">
                          <div className="text-foreground">{it.descripcion}</div>
                          <div className="text-[10px] text-muted-foreground">{it.unidad}</div>
                        </td>
                        <td className="py-2 text-right align-middle tabular-nums">{it.cantidad}</td>
                        <td className="py-2 text-right align-middle">
                          <input
                            type="number"
                            value={it.precioUnitario ?? 0}
                            onChange={(e) => updatePrecio(it.id, Number(e.target.value))}
                            className="h-8 w-28 rounded-md border border-border bg-surface px-2 text-right text-sm tabular-nums focus-ring"
                          />
                        </td>
                        <td className="py-2 pr-3 text-right align-middle font-medium tabular-nums">
                          {formatCLP(subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border bg-surface-muted/60">
                    <td colSpan={4} className="py-2.5 pr-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Total
                    </td>
                    <td className="py-2.5 pr-3 text-right text-base font-semibold tabular-nums text-foreground">
                      {formatCLP(total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-foreground">Notas internas</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={3}
              placeholder="Comentarios, supuestos, márgenes…"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus-ring"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <button
            onClick={() => handleSave(false)}
            className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-sm transition hover:bg-surface-muted"
          >
            <Save className="h-3.5 w-3.5" />
            Guardar borrador
          </button>
          <button
            onClick={() => handleSave(true)}
            className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover"
          >
            <Send className="h-3.5 w-3.5" />
            Marcar como enviada
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

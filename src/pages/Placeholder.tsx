import { Construction } from "lucide-react";

export default function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
      <div className="max-w-md rounded-xl border border-dashed border-border bg-surface p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground">
          <Construction className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          Esta sección llegará en una próxima fase del rediseño.
        </p>
      </div>
    </div>
  );
}

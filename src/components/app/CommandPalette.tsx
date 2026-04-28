import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Kanban, ListChecks, Building2, Users, BarChart3, Settings, Star, FileSearch } from "lucide-react";
import { licitaciones } from "@/data/mock";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar licitación, organismo, persona…" />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        <CommandGroup heading="Navegación">
          <CommandItem onSelect={() => go("/")}><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</CommandItem>
          <CommandItem onSelect={() => go("/pipeline")}><Kanban className="mr-2 h-4 w-4" />Pipeline</CommandItem>
          <CommandItem onSelect={() => go("/licitaciones")}><ListChecks className="mr-2 h-4 w-4" />Licitaciones</CommandItem>
          <CommandItem onSelect={() => go("/organismos")}><Building2 className="mr-2 h-4 w-4" />Organismos</CommandItem>
          <CommandItem onSelect={() => go("/equipo")}><Users className="mr-2 h-4 w-4" />Equipo</CommandItem>
          <CommandItem onSelect={() => go("/analytics")}><BarChart3 className="mr-2 h-4 w-4" />Analytics</CommandItem>
          <CommandItem onSelect={() => go("/admin")}><Settings className="mr-2 h-4 w-4" />Administración</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Licitaciones recientes">
          {licitaciones.slice(0, 5).map((l) => (
            <CommandItem key={l.id} onSelect={() => go("/licitaciones")}>
              <FileSearch className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{l.nombre}</span>
              <span className="ml-2 truncate text-xs text-muted-foreground">{l.codigo}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Acciones rápidas">
          <CommandItem><Star className="mr-2 h-4 w-4" />Marcar como favorita</CommandItem>
          <CommandItem><Users className="mr-2 h-4 w-4" />Asignar responsable</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, AlertTriangle, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notifications } from "@/data/mock";
import { cn } from "@/lib/utils";

const routeLabels: Record<string, string> = {
  "": "Dashboard",
  pipeline: "Pipeline",
  licitaciones: "Licitaciones",
  organismos: "Organismos",
  equipo: "Equipo",
  analytics: "Analytics",
  admin: "Administración",
};

export function AppHeader({ onOpenPalette }: { onOpenPalette: () => void }) {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const crumbs = segments.length === 0 ? ["Dashboard"] : segments.map((s) => routeLabels[s] ?? s);

  // Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenPalette]);

  const unread = notifications.length;

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur lg:px-6">
      {/* Breadcrumbs */}
      <nav className="flex min-w-0 items-center gap-1.5 text-sm" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            <span
              className={cn(
                "truncate",
                i === crumbs.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {c}
            </span>
          </div>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Global search trigger */}
      <button
        onClick={onOpenPalette}
        className="hidden h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm text-muted-foreground shadow-xs transition hover:border-border-strong hover:text-foreground md:flex md:w-72 lg:w-96"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Buscar licitaciones, organismos…</span>
        <span className="kbd">⌘K</span>
      </button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
            aria-label="Notificaciones"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-destructive opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-destructive" />
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            Notificaciones
            <span className="text-[10px] font-normal text-muted-foreground">
              {unread} sin leer
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.map((n) => (
            <DropdownMenuItem key={n.id} className="flex items-start gap-2.5 py-2.5">
              <NotificationIcon type={n.type} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{n.title}</div>
                <div className="truncate text-xs text-muted-foreground">{n.description}</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">{n.time}</div>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-xs text-muted-foreground">
            Ver todas las notificaciones
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-1.5 pr-2.5 transition hover:border-border-strong">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              SC
            </div>
            <span className="hidden text-xs font-medium text-foreground lg:inline">
              contacto@ssclimitada.cl
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            contacto@ssclimitada.cl
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Mi perfil</DropdownMenuItem>
          <DropdownMenuItem>Preferencias</DropdownMenuItem>
          <DropdownMenuItem>Atajos de teclado</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

function NotificationIcon({ type }: { type: string }) {
  const map: Record<string, { cls: string; icon: typeof Bell }> = {
    deadline: { cls: "bg-warning-soft text-warning-soft-foreground", icon: AlertTriangle },
    assignment: { cls: "bg-info-soft text-info-soft-foreground", icon: Bell },
    mention: { cls: "bg-success-soft text-success-soft-foreground", icon: Bell },
    system: { cls: "bg-destructive-soft text-destructive-soft-foreground", icon: AlertTriangle },
  };
  const { cls, icon: Icon } = map[type] ?? map.system;
  return (
    <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md", cls)}>
      <Icon className="h-3.5 w-3.5" />
    </div>
  );
}

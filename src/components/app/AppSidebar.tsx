import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Kanban,
  ListChecks,
  Building2,
  Users,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/pipeline", label: "Pipeline", icon: Kanban, badge: "Pronto" },
  { to: "/licitaciones", label: "Licitaciones", icon: ListChecks },
  { to: "/organismos", label: "Organismos", icon: Building2, badge: "Pronto" },
  { to: "/equipo", label: "Equipo", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3, badge: "Pronto" },
];

const secondary = [
  { to: "/admin", label: "Administración", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ShieldCheck className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold leading-tight text-sidebar-foreground">
              SSC Limitada
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              Compras Ágiles · Chile
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <SidebarGroup label={collapsed ? null : "Workspace"} items={nav} collapsed={collapsed} />
        <div className="my-3 h-px bg-sidebar-border" />
        <SidebarGroup label={collapsed ? null : "Sistema"} items={secondary} collapsed={collapsed} />
      </nav>

      {/* Collapse trigger */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="mx-2 mb-2 flex h-9 items-center justify-center gap-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
        aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : (
          <>
            <ChevronsLeft className="h-4 w-4" />
            <span className="text-xs">Colapsar</span>
          </>
        )}
      </button>
    </aside>
  );
}

function SidebarGroup({
  label,
  items,
  collapsed,
}: {
  label: string | null;
  items: { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean; badge?: string }[];
  collapsed: boolean;
}) {
  return (
    <div>
      {label && (
        <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className="group flex h-8 items-center gap-2.5 rounded-md px-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            >
              <item.icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

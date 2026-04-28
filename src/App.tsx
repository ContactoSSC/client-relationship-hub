import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app/AppShell";
import Index from "./pages/Index.tsx";
import Placeholder from "./pages/Placeholder.tsx";
import LicitacionDetail from "./pages/LicitacionDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Index />} />
            <Route
              path="/pipeline"
              element={
                <Placeholder
                  title="Pipeline Kanban"
                  description="Vista de licitaciones por etapa con drag & drop, métricas de embudo y filtros por responsable."
                />
              }
            />
            <Route
              path="/licitaciones"
              element={
                <Placeholder
                  title="Todas las licitaciones"
                  description="Vista completa con filtros avanzados, vistas guardadas y exportación."
                />
              }
            />
            <Route path="/licitaciones/:id" element={<LicitacionDetail />} />
            <Route
              path="/organismos"
              element={
                <Placeholder
                  title="Organismos"
                  description="Cuentas de organismos públicos: histórico, monto adjudicado, contactos, tasa de éxito."
                />
              }
            />
            <Route
              path="/equipo"
              element={
                <Placeholder
                  title="Equipo comercial"
                  description="Miembros, roles, asignaciones, carga de trabajo y rendimiento individual."
                />
              }
            />
            <Route
              path="/analytics"
              element={
                <Placeholder
                  title="Analytics & reportes"
                  description="Embudo, tasa de éxito, monto adjudicado, mapa por región y tendencias."
                />
              }
            />
            <Route
              path="/admin"
              element={
                <Placeholder
                  title="Administración"
                  description="Token de Mercado Público, integraciones, facturación y configuración general."
                />
              }
            />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

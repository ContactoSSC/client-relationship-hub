import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { LicitacionesTable } from "@/components/dashboard/LicitacionesTable";

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Compras Ágiles · V, VI, RM, Coquimbo, Maule · actualizado hace instantes
        </p>
      </header>

      <AlertBanner />
      <KpiGrid />
      <LicitacionesTable />
    </div>
  );
};

export default Index;

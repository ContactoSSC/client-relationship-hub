import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { LicitacionHeader } from "@/components/licitacion/LicitacionHeader";
import { LicitacionTabs } from "@/components/licitacion/LicitacionTabs";
import { LicitacionSidePanel } from "@/components/licitacion/LicitacionSidePanel";
import { licitaciones, type LicitacionStatus } from "@/data/mock";
import { getLicitacionDetail } from "@/data/licitacionDetail";
import NotFound from "./NotFound";

export default function LicitacionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const base = useMemo(() => licitaciones.find((l) => l.id === id), [id]);
  const [licitacion, setLicitacion] = useState(base);

  if (!base || !licitacion) {
    return <NotFound />;
  }

  const detail = getLicitacionDetail(licitacion.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <LicitacionHeader
        licitacion={licitacion}
        items={detail.items}
        onToggleFav={() => setLicitacion({ ...licitacion, favorita: !licitacion.favorita })}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <LicitacionTabs licitacion={licitacion} detail={detail} />
        </div>
        <LicitacionSidePanel
          licitacion={licitacion}
          detail={detail}
          onStatusChange={(s: LicitacionStatus) => setLicitacion({ ...licitacion, status: s })}
        />
      </div>
    </div>
  );
}

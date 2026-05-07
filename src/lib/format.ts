/** Format CLP currency without the "CLP" suffix, matching MercadoPúblico style. */
export function formatCLP(value: number): string {
  return "$" + value.toLocaleString("es-CL");
}

/** Returns object describing time-to-deadline for an ISO date string. */
export function timeToDeadline(iso: string) {
  const target = new Date(iso).getTime();
  const diff = target - Date.now();
  const abs = Math.abs(diff);
  const hours = Math.floor(abs / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);

  let urgency: "expired" | "critical" | "warning" | "normal";
  if (diff < 0) urgency = "expired";
  else if (diff < 4 * 3_600_000) urgency = "critical";
  else if (diff < 24 * 3_600_000) urgency = "warning";
  else urgency = "normal";

  const label =
    diff < 0
      ? `vencido hace ${hours}h`
      : hours > 0
        ? `${hours}h ${minutes}m`
        : `${minutes}m`;

  const date = new Date(iso);
  const dateLabel =
    date.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit" }) +
    ", " +
    date.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false });

  return { urgency, label, dateLabel, diff };
}

/** Short Chilean date format: "28-abr, 08:00" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("es-CL", { day: "2-digit", month: "short" }) +
    ", " +
    d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
}

/** Relative time in Spanish: "hace 2 min", "hace 3 h", "hace 2 d" */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} d`;
}

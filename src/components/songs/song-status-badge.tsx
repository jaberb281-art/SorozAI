import type { SongStatus } from "@/lib/types"

type SongStatusBadgeProps = {
  status: SongStatus
}

const STATUS_STYLES: Record<SongStatus, string> = {
  queued: "border-sand/20 bg-sand/10 text-sand/75",
  generating:
    "border-saffron/40 bg-saffron/15 text-saffron shadow-[0_0_22px_rgba(227,122,44,0.18)]",
  completed:
    "border-emerald-300/30 bg-emerald-300/12 text-emerald-100 shadow-[0_0_22px_rgba(16,185,129,0.12)]",
  failed: "border-terracotta/45 bg-terracotta/18 text-sand",
}

const STATUS_LABELS: Record<SongStatus, string> = {
  queued: "Queued",
  generating: "Generating",
  completed: "Completed",
  failed: "Failed",
}

export function SongStatusBadge({ status }: SongStatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

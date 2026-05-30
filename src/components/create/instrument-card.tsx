import type { Instrument } from "@/lib/types"
import { InstrumentIcon } from "@/components/create/instrument-icon"

type InstrumentCardProps = {
  instrument: Instrument
  selected: boolean
  onToggle: (instrument: Instrument) => void
}

export function InstrumentCard({
  instrument,
  selected,
  onToggle,
}: InstrumentCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${instrument}`}
      onClick={() => onToggle(instrument)}
      className={`group flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border p-2 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal sm:min-h-[4.25rem] ${selected
          ? "border-[#E37A2C] bg-[#E37A2C] text-[#EDE3D3] shadow-[0_10px_24px_rgba(227,122,44,0.22)]"
          : "border-white/10 bg-white/[0.05] text-[#EDE3D3]/82 hover:border-[#B73E1F] hover:bg-[#B73E1F]/12 hover:text-[#EDE3D3] hover:shadow-[0_8px_20px_rgba(183,62,31,0.14)]"
        }`}
    >
      <span className="flex size-8 items-center justify-center rounded-lg border border-current/20 bg-sand/8 text-current transition group-hover:bg-sand/12">
        <InstrumentIcon name={instrument} className="h-5 w-5" />
      </span>
      <span className="text-[11px] font-semibold leading-tight sm:text-[12px]">
        {instrument}
      </span>
    </button>
  )
}
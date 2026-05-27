type WaveformPlaceholderProps = {
  density?: "compact" | "large"
  isActive?: boolean
}

const BAR_COUNT = 72

export function WaveformPlaceholder({
  density = "compact",
  isActive = false,
}: WaveformPlaceholderProps) {
  const heights = Array.from({ length: BAR_COUNT }, (_, index) => {
    const curve = Math.sin(index * 0.46) * 18
    const pulse = (index * 19) % 34

    return Math.max(10, Math.round(20 + curve + pulse))
  })

  return (
    <div
      className={`relative flex items-center gap-1 overflow-hidden rounded-2xl border border-sand/10 bg-charcoal/35 px-3 ${
        density === "large" ? "h-44 sm:h-56 sm:px-5" : "h-24"
      }`}
      role="img"
      aria-label="Mock audio waveform"
    >
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-saffron/18 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-indigo-deep/45 to-transparent" />
      {heights.map((height, index) => (
        <span
          key={index}
          className={`relative z-10 w-full rounded-full transition ${
            isActive && index < 26 ? "bg-saffron" : "bg-sand/72"
          }`}
          style={{
            height: `${density === "large" ? height * 1.45 : height}px`,
            opacity: index % 7 === 0 ? 0.36 : 0.86,
          }}
        />
      ))}
      <div className="absolute inset-x-3 top-1/2 h-px bg-sand/10" />
    </div>
  )
}

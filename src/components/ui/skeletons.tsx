export function SongRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-xl px-3 py-2.5">
      {/* Cover art placeholder */}
      <div className="size-12 shrink-0 rounded-lg bg-white/[0.06]" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Title */}
        <div className="h-3.5 w-2/5 rounded-full bg-white/[0.08]" />
        {/* Subtitle / prompt */}
        <div className="h-3 w-3/5 rounded-full bg-white/[0.05]" />
        {/* Badges row */}
        <div className="flex gap-2">
          <div className="h-4 w-14 rounded-md bg-white/[0.05]" />
          <div className="h-4 w-16 rounded-md bg-white/[0.05]" />
        </div>
      </div>
      {/* Duration placeholder */}
      <div className="h-3 w-8 shrink-0 rounded-full bg-white/[0.05]" />
    </div>
  )
}

export function FeedCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-2xl bg-white/[0.03] p-3">
      {/* Cover art */}
      <div className="aspect-square w-full rounded-xl bg-white/[0.06]" />
      {/* Title */}
      <div className="h-4 w-3/4 rounded-full bg-white/[0.08]" />
      {/* Artist + meta row */}
      <div className="flex items-center gap-2">
        <div className="size-5 rounded-full bg-white/[0.06]" />
        <div className="h-3 w-1/2 rounded-full bg-white/[0.05]" />
      </div>
      {/* Stat pills */}
      <div className="flex gap-2">
        <div className="h-5 w-12 rounded-full bg-white/[0.05]" />
        <div className="h-5 w-10 rounded-full bg-white/[0.05]" />
      </div>
    </div>
  )
}

export function LibraryPageSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: rows }).map((_, i) => (
        <SongRowSkeleton key={i} />
      ))}
    </div>
  )
}

export function FeedPageSkeleton({ cards = 8 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: cards }).map((_, i) => (
        <FeedCardSkeleton key={i} />
      ))}
    </div>
  )
}

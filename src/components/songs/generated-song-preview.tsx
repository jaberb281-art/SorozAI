import type { GenrePreset, Instrument } from "@/lib/types"
import Link from "next/link"
import {
  Compass,
  Globe2,
  Library,
  Lock,
  Megaphone,
  Play,
  RefreshCcw,
} from "lucide-react"

type GeneratedSongPreviewProps = {
  genre: GenrePreset
  instruments: Instrument[]
  isPublic: boolean
}

export function GeneratedSongPreview({
  genre,
  instruments,
  isPublic,
}: GeneratedSongPreviewProps) {
  const selectedInstruments =
    instruments.length > 0 ? instruments.join(", ") : "Voice texture only"
  const visibilityLabel = isPublic ? "Public" : "Private"
  const visibilityNote = isPublic ? "Ready for Discover" : "Only in My Studio"

  return (
    <section className="mt-5 rounded-[1.5rem] border border-sand/15 bg-sand/10 p-4 text-sand shadow-2xl shadow-charcoal/30 backdrop-blur-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-saffron">
            Completed
          </p>
          <h2 className="mt-2 text-2xl font-black">Makran Nightfall</h2>
          <p className="mt-2 text-sm leading-6 text-sand/70">
            {genre} with {selectedInstruments}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <span className="w-fit rounded-full border border-terracotta/30 bg-terracotta/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sand">
            Status completed
          </span>
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
              isPublic
                ? "border-saffron/35 bg-saffron/12 text-saffron"
                : "border-sand/15 bg-sand/8 text-sand/68"
            }`}
          >
            {isPublic ? (
              <Globe2 className="size-3.5" aria-hidden="true" />
            ) : (
              <Lock className="size-3.5" aria-hidden="true" />
            )}
            {visibilityLabel}
          </span>
          <span className="w-fit rounded-full border border-sand/10 bg-sand/7 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sand/58">
            {visibilityNote}
          </span>
        </div>
      </div>

      <div className="mt-5 flex h-20 items-center gap-1 rounded-2xl border border-sand/10 bg-charcoal/25 px-4" aria-hidden="true">
        {Array.from({ length: 64 }).map((_, index) => (
          <span
            key={index}
            className="w-full rounded-full bg-sand/70"
            style={{
              height: `${14 + ((index * 23) % 48)}px`,
              opacity: index % 5 === 0 ? 0.35 : 0.85,
            }}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          aria-label="Play generated song preview"
          className="inline-flex items-center gap-2 rounded-full bg-saffron px-4 py-2 text-sm font-bold text-sand transition hover:bg-terracotta"
        >
          <Play className="size-4" aria-hidden="true" />
          Play
        </button>
        <Link
          href="/library"
          aria-label="Open generated song preview in My Studio"
          className="inline-flex items-center gap-2 rounded-full border border-sand/15 px-4 py-2 text-sm font-bold text-sand transition hover:bg-sand/10"
        >
          <Library className="size-4" aria-hidden="true" />
          Open in My Studio
        </Link>
        <button
          type="button"
          aria-label="Remix generated song preview"
          className="inline-flex items-center gap-2 rounded-full border border-sand/15 px-4 py-2 text-sm font-bold text-sand transition hover:bg-sand/10"
        >
          <RefreshCcw className="size-4" aria-hidden="true" />
          Remix
        </button>
        {isPublic ? (
          <Link
            href="/feed"
            aria-label="View generated song preview in Discover"
            className="inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-4 py-2 text-sm font-bold text-saffron transition hover:bg-saffron/15"
          >
            <Compass className="size-4" aria-hidden="true" />
            View in Discover
          </Link>
        ) : (
          <button
            type="button"
            aria-label="Post generated song preview to Discover"
            className="inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-4 py-2 text-sm font-bold text-saffron transition hover:bg-saffron/15"
          >
            <Megaphone className="size-4" aria-hidden="true" />
            Post to Discover
          </button>
        )}
      </div>
    </section>
  )
}

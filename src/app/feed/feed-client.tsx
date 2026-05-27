"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Compass, Search, Sparkles } from "lucide-react"

import { PublicSongCard } from "@/components/feed/public-song-card"
import type { Song } from "@/lib/types"

type FeedFilter = "All" | "Zahirok" | "Hip-Hop Fusion" | "Wedding" | "Sufi" | "Lullaby"

const FILTERS: FeedFilter[] = [
  "All",
  "Zahirok",
  "Hip-Hop Fusion",
  "Wedding",
  "Sufi",
  "Lullaby",
]

type FeedClientProps = {
  songs: Song[]
}

export function FeedClient({ songs }: FeedClientProps) {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("All")

  const filteredSongs = useMemo(
    () => filterPublicSongs(songs, query, activeFilter),
    [songs, query, activeFilter],
  )

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-sand">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(227,122,44,0.22),transparent_30%),radial-gradient(circle_at_16%_28%,rgba(183,62,31,0.2),transparent_27%),radial-gradient(circle_at_84%_20%,rgba(26,58,92,0.82),transparent_35%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_44%,var(--charcoal)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(237,227,211,0.45)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.35)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-charcoal to-transparent" />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-8 pt-8 md:px-6 md:pb-10 md:pt-10 xl:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-saffron shadow-[0_0_28px_rgba(227,122,44,0.16)]">
              <Compass className="size-4" aria-hidden="true" />
              ZAHIROK COMMUNITY
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-sand sm:text-4xl md:text-5xl">
              Public ZahiRok Feed
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-sand/72 md:text-base md:leading-7">
              Discover Balochi AI songs shared by creators.
            </p>
          </div>

          <Link
            href="/create#composer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-black text-sand shadow-[0_16px_40px_rgba(227,122,44,0.26)] transition hover:bg-terracotta sm:w-auto"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Create Song
          </Link>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-sand/15 bg-sand/10 p-2.5 shadow-[0_20px_56px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
          <div className="rounded-[1.15rem] border border-sand/10 bg-charcoal/50 p-3">
            <label className="relative block">
              <span className="sr-only">Search public songs</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-sand/45"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search public songs..."
                className="h-[3.25rem] w-full rounded-full border border-sand/15 bg-sand/8 pl-12 pr-4 text-sm font-semibold text-sand outline-none transition placeholder:text-sand/45 focus:border-saffron/55 focus:bg-sand/10"
              />
            </label>

            <div role="group" className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter public songs by genre">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${
                    activeFilter === filter
                      ? "border-saffron bg-saffron text-sand shadow-[0_12px_30px_rgba(227,122,44,0.22)]"
                      : "border-sand/12 bg-sand/8 text-sand/70 hover:bg-sand/12 hover:text-sand"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredSongs.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSongs.map((song) => (
              <PublicSongCard key={song.id} song={song} queue={filteredSongs} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-terracotta/25 bg-terracotta/10 p-6 text-center shadow-[0_20px_56px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-saffron/30 bg-saffron/15 text-saffron shadow-[0_0_28px_rgba(227,122,44,0.18)]">
              <Search className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-2xl font-black text-sand">
              No public songs found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-sand/68">
              Try another search or create your first public track.
            </p>
            <Link
              href="/create#composer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-black text-sand shadow-[0_16px_40px_rgba(227,122,44,0.24)] transition hover:bg-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Create Song
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

function filterPublicSongs(
  songs: Song[],
  query: string,
  activeFilter: FeedFilter,
) {
  const normalizedQuery = query.trim().toLowerCase()

  return songs.filter((song) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        song.title,
        song.prompt,
        song.genrePreset,
        song.instruments.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)

    const matchesFilter =
      activeFilter === "All" || song.genrePreset === activeFilter

    return matchesQuery && matchesFilter
  })
}

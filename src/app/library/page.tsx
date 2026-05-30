"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ChevronDown,
  Download,
  Library,
  MoreHorizontal,
  Play,
  Pause,
  RefreshCcw,
  Search,
  Share2,
  Sparkles,
  X,
} from "lucide-react"

import { WaveformPlaceholder } from "@/components/songs/waveform-placeholder"
import { SongStatusBadge } from "@/components/songs/song-status-badge"
import type { SongStatus } from "@/lib/types"

// ── Page-local types ──────────────────────────────────────────────────────────

interface LibrarySong {
  id: string
  title: string
  genre: string
  dialect: string
  instruments: string[]
  status: SongStatus
  isPublic: boolean
  duration: string
  createdAt: string
}

type FilterTab = "All" | "Private" | "Public" | "Drafts"

const FILTER_TABS: FilterTab[] = ["All", "Private", "Public", "Drafts"]

// ── Mock data ─────────────────────────────────────────────────────────────────

// MOCK: replace with api-client.getLibrary() when backend is ready
const MOCK_LIBRARY: LibrarySong[] = [
  {
    id: "lib-1",
    title: "Makran Evening",
    genre: "Zahirok",
    dialect: "Makrani",
    instruments: ["Suroz", "Damboora"],
    status: "completed",
    isPublic: true,
    duration: "3:18",
    createdAt: "2026-05-23T10:00:00Z",
  },
  {
    id: "lib-2",
    title: "Desert Pulse",
    genre: "Hip-Hop Fusion",
    dialect: "Sulaimani",
    instruments: ["Modern Drums", "Bass", "Synth"],
    status: "completed",
    isPublic: false,
    duration: "2:42",
    createdAt: "2026-05-22T15:30:00Z",
  },
  {
    id: "lib-3",
    title: "Wedding Doholl",
    genre: "Wedding",
    dialect: "Makrani",
    instruments: ["Doholl", "Rubab"],
    status: "completed",
    isPublic: true,
    duration: "3:05",
    createdAt: "2026-05-21T09:10:00Z",
  },
  {
    id: "lib-4",
    title: "Sufi Breath",
    genre: "Sufi",
    dialect: "Rakhshani",
    instruments: ["Damboora", "Suroz"],
    status: "completed",
    isPublic: false,
    duration: "4:01",
    createdAt: "2026-05-20T19:45:00Z",
  },
  {
    id: "lib-5",
    title: "Night Coast (Draft)",
    genre: "Liko",
    dialect: "Makrani",
    instruments: ["Tamburag"],
    status: "generating",
    isPublic: false,
    duration: "—",
    createdAt: "2026-05-24T08:00:00Z",
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso))
}

function filterAndSearch(
  songs: LibrarySong[],
  query: string,
  filter: FilterTab,
): LibrarySong[] {
  const q = query.trim().toLowerCase()
  return songs.filter((song) => {
    const matchesQuery =
      q.length === 0 ||
      [song.title, song.genre, song.dialect, ...song.instruments]
        .join(" ")
        .toLowerCase()
        .includes(q)

    const matchesFilter =
      filter === "All" ||
      (filter === "Public" && song.isPublic) ||
      (filter === "Private" && !song.isPublic) ||
      (filter === "Drafts" && song.status !== "completed")

    return matchesQuery && matchesFilter
  })
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All")
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [openMoreId, setOpenMoreId] = useState<string | null>(null)

  const songs = useMemo(
    () => filterAndSearch(MOCK_LIBRARY, query, activeFilter),
    [query, activeFilter],
  )

  function togglePlay(id: string) {
    setPlayingId((prev) => (prev === id ? null : id))
  }

  function toggleMore(id: string) {
    setOpenMoreId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-sand">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_14%,rgba(227,122,44,0.22),transparent_29%),radial-gradient(circle_at_16%_24%,rgba(183,62,31,0.2),transparent_27%),radial-gradient(circle_at_84%_18%,rgba(26,58,92,0.82),transparent_35%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_44%,var(--charcoal)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(237,227,211,0.45)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.35)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-charcoal to-transparent" />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-6 md:px-6 md:pt-8 xl:px-8">

        {/* ── Page heading ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-saffron shadow-[0_0_28px_rgba(227,122,44,0.16)]">
              <Library className="size-3.5" aria-hidden="true" />
              Your archive
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-sand sm:text-4xl">
              Your Library
            </h1>
            <p className="mt-2 text-sm leading-6 text-sand/65">
              Songs you created with Zahirok AI.
            </p>
          </div>

          <Link
            href="/create"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron px-5 py-2.5 text-sm font-black text-sand shadow-[0_12px_30px_rgba(227,122,44,0.26)] transition hover:bg-terracotta sm:w-auto"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Create Song
          </Link>
        </div>

        {/* ── Controls ── */}
        <div className="mt-5 rounded-[1.4rem] border border-sand/12 bg-sand/[0.07] p-2 shadow-[0_18px_48px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
          <div className="rounded-[1.1rem] border border-sand/10 bg-charcoal/50 p-3">

            {/* Search + sort row */}
            <div className="flex gap-2">
              <label className="relative flex-1">
                <span className="sr-only">Search your library</span>
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-sand/40"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search songs, genre, dialect…"
                  className="h-10 w-full rounded-full border border-sand/12 bg-sand/8 pl-10 pr-4 text-sm font-semibold text-sand placeholder-sand/38 outline-none transition focus:border-saffron/45 focus:bg-sand/10"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sand/38 transition hover:text-sand/70"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                )}
              </label>

              {/* MOCK: replace with real sort api-client.getLibrary({ sort }) when backend is ready */}
              <button
                type="button"
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-sand/12 bg-sand/8 px-3.5 text-xs font-bold text-sand/65 transition hover:bg-sand/12 hover:text-sand/85"
                aria-label="Sort order: Newest first (mock)"
              >
                Newest first
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Filter tabs */}
            <div
              role="group"
              aria-label="Filter your library"
              className="mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5"
            >
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  aria-pressed={activeFilter === tab}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-black transition ${activeFilter === tab
                      ? "border-saffron bg-saffron text-sand shadow-[0_8px_20px_rgba(227,122,44,0.22)]"
                      : "border-sand/12 bg-sand/8 text-sand/65 hover:bg-sand/12 hover:text-sand"
                    }`}
                >
                  {tab}
                </button>
              ))}

              {/* Live count */}
              <span className="ml-auto flex shrink-0 items-center pl-2 text-[11px] font-bold text-sand/38">
                {songs.length} song{songs.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* ── Song grid ── */}
        {songs.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {songs.map((song) => (
              <LibraryCard
                key={song.id}
                song={song}
                isPlaying={playingId === song.id}
                isMoreOpen={openMoreId === song.id}
                onPlayToggle={() => togglePlay(song.id)}
                onMoreToggle={() => toggleMore(song.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState query={query} filter={activeFilter} />
        )}
      </section>
    </div>
  )
}

// ── LibraryCard ───────────────────────────────────────────────────────────────

function LibraryCard({
  song,
  isPlaying,
  isMoreOpen,
  onPlayToggle,
  onMoreToggle,
}: {
  song: LibrarySong
  isPlaying: boolean
  isMoreOpen: boolean
  onPlayToggle: () => void
  onMoreToggle: () => void
}) {
  const canPlay = song.status === "completed"

  return (
    <article
      className={`group rounded-[1.4rem] border bg-sand/[0.07] p-2.5 text-sand shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:-translate-y-0.5 ${isPlaying
          ? "border-saffron/35 bg-saffron/[0.06] shadow-[0_18px_48px_rgba(227,122,44,0.1)]"
          : "border-sand/12 hover:border-saffron/28 hover:bg-sand/[0.09]"
        }`}
    >
      <div className="rounded-[1.1rem] border border-sand/10 bg-charcoal/45 p-3">

        {/* Top row: genre + status badge */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-saffron">
            {song.genre}
          </p>
          <SongStatusBadge status={song.status} />
        </div>

        {/* Title + more button */}
        <div className="mt-1.5 flex items-start justify-between gap-2">
          <h2 className="line-clamp-2 text-lg font-black leading-snug text-sand">
            {song.title}
          </h2>
          <button
            type="button"
            onClick={onMoreToggle}
            aria-label={isMoreOpen ? "Close options" : "More options"}
            aria-expanded={isMoreOpen}
            className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border transition ${isMoreOpen
                ? "border-saffron/35 bg-saffron/12 text-saffron"
                : "border-sand/12 bg-sand/8 text-sand/45 hover:border-sand/22 hover:text-sand/70"
              }`}
          >
            <MoreHorizontal className="size-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Dialect + duration */}
        <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-sand/50">
          <span>{song.dialect}</span>
          <span className="text-sand/25">·</span>
          <span>{song.duration}</span>
        </div>

        {/* Instrument tags */}
        {song.instruments.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {song.instruments.map((inst) => (
              <span
                key={inst}
                className="rounded-full border border-sand/10 bg-sand/8 px-2.5 py-0.5 text-[11px] font-bold text-sand/65"
              >
                {inst}
              </span>
            ))}
          </div>
        )}

        {/* Visibility + date */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] ${song.isPublic
                ? "border-saffron/30 bg-saffron/10 text-saffron"
                : "border-sand/12 bg-sand/8 text-sand/55"
              }`}
          >
            {song.isPublic ? "🌍 Public" : "🔒 Private"}
          </span>
          <span className="text-[11px] font-semibold text-sand/40">
            {formatDate(song.createdAt)}
          </span>
        </div>

        {/* Waveform */}
        <div className="mt-3">
          <WaveformPlaceholder isActive={isPlaying} />
        </div>

        {/* Primary actions */}
        <div className="mt-3 flex gap-2">
          {/* MOCK: replace with api-client.getStreamUrl(song.id) + real audio playback when backend is ready */}
          <button
            type="button"
            onClick={onPlayToggle}
            disabled={!canPlay}
            aria-label={`${isPlaying ? "Pause" : "Play"} ${song.title}`}
            className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-sm font-black text-sand shadow-[0_10px_24px_rgba(227,122,44,0.22)] transition disabled:cursor-not-allowed disabled:opacity-45 ${isPlaying
                ? "bg-terracotta hover:bg-saffron"
                : "bg-saffron hover:bg-terracotta"
              }`}
          >
            {isPlaying ? (
              <Pause className="size-4 fill-current" aria-hidden="true" />
            ) : (
              <Play className="size-4 fill-current" aria-hidden="true" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            type="button"
            onClick={onMoreToggle}
            aria-label="Options"
            className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-full border px-3.5 text-xs font-bold transition md:hidden ${isMoreOpen
                ? "border-saffron/30 bg-saffron/10 text-saffron"
                : "border-sand/12 bg-sand/6 text-sand/60 hover:bg-sand/10 hover:text-sand/80"
              }`}
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
            Options
          </button>
        </div>

        {/* Secondary actions (revealed by more button) */}
        {isMoreOpen && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {/* MOCK: replace with api-client.remixSong(song.id) when backend is ready */}
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-sand/12 bg-sand/6 px-3 text-xs font-bold text-sand/70 transition hover:border-sand/22 hover:bg-sand/10 hover:text-sand"
            >
              <RefreshCcw className="size-3.5" aria-hidden="true" />
              Remix
            </button>

            {/* MOCK: replace with api-client.downloadSong(song.id) when backend is ready */}
            <button
              type="button"
              disabled
              title="Download available when backend is connected"
              className="inline-flex h-9 cursor-not-allowed items-center justify-center gap-1.5 rounded-full border border-sand/8 bg-sand/4 px-3 text-xs font-bold text-sand/28"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Download
            </button>

            {/* MOCK: replace with api-client.shareSong(song.id) when backend is ready */}
            <button
              type="button"
              disabled
              title="Sharing available when backend is connected"
              className="inline-flex h-9 cursor-not-allowed items-center justify-center gap-1.5 rounded-full border border-sand/8 bg-sand/4 px-3 text-xs font-bold text-sand/28"
            >
              <Share2 className="size-3.5" aria-hidden="true" />
              Share
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState({
  query,
  filter,
}: {
  query: string
  filter: FilterTab
}) {
  const isSearchEmpty = query.trim().length > 0
  const isFilterEmpty = filter !== "All"

  return (
    <div className="mt-5 rounded-[1.4rem] border border-sand/12 bg-sand/[0.05] p-4 text-center shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-saffron/25 bg-saffron/10 text-saffron shadow-[0_0_24px_rgba(227,122,44,0.15)]">
        {isSearchEmpty || isFilterEmpty ? (
          <Search className="size-5" aria-hidden="true" />
        ) : (
          <Library className="size-5" aria-hidden="true" />
        )}
      </div>

      <h2 className="mt-4 text-xl font-black text-sand">
        {isSearchEmpty
          ? `No results for "${query}"`
          : isFilterEmpty
            ? `No ${filter.toLowerCase()} songs yet`
            : "No songs yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-sand/58">
        {isSearchEmpty || isFilterEmpty
          ? "Try a different search or filter to find your tracks."
          : "Create your first Balochi song."}
      </p>

      {!isSearchEmpty && !isFilterEmpty && (
        <Link
          href="/create"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-2.5 text-sm font-black text-sand shadow-[0_10px_26px_rgba(227,122,44,0.26)] transition hover:bg-terracotta"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Create a song
        </Link>
      )}
    </div>
  )
}
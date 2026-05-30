"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Compass,
  Heart,
  Music2,
  Play,
  Pause,
  RefreshCcw,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react"

import { WaveformPlaceholder } from "@/components/songs/waveform-placeholder"

// ── Page-local types ──────────────────────────────────────────────────────────

interface ExploreSong {
  id: string
  title: string
  genre: string
  dialect: string
  creator: string
  instruments: string[]
  duration: string
  plays: number
  likes: number
  createdAt: string
}

type ExploreTab =
  | "Trending"
  | "Latest"
  | "Zahirok"
  | "Wedding"
  | "Sufi"
  | "Naat"
  | "Hip-Hop Fusion"

// ── Constants ─────────────────────────────────────────────────────────────────

const TABS: ExploreTab[] = [
  "Trending",
  "Latest",
  "Zahirok",
  "Wedding",
  "Sufi",
  "Naat",
  "Hip-Hop Fusion",
]

// Cover art gradient per genre — inline style, no Tailwind arbitrary color risk
const COVER_GRADIENTS: Record<string, string> = {
  Zahirok:
    "linear-gradient(135deg,rgba(227,122,44,0.55) 0%,rgba(183,62,31,0.3) 50%,rgba(26,22,18,0.95) 100%)",
  Wedding:
    "linear-gradient(135deg,rgba(183,62,31,0.6) 0%,rgba(227,122,44,0.25) 50%,rgba(26,22,18,0.95) 100%)",
  Sufi: "linear-gradient(135deg,rgba(91,49,155,0.55) 0%,rgba(57,30,100,0.35) 50%,rgba(26,22,18,0.95) 100%)",
  Naat: "linear-gradient(135deg,rgba(30,90,70,0.55) 0%,rgba(20,60,50,0.35) 50%,rgba(26,22,18,0.95) 100%)",
  "Hip-Hop Fusion":
    "linear-gradient(135deg,rgba(50,50,70,0.7) 0%,rgba(35,35,55,0.45) 50%,rgba(26,22,18,0.95) 100%)",
  Liko: "linear-gradient(135deg,rgba(30,70,140,0.55) 0%,rgba(20,50,110,0.35) 50%,rgba(26,22,18,0.95) 100%)",
}

function coverGradient(genre: string): string {
  return (
    COVER_GRADIENTS[genre] ??
    "linear-gradient(135deg,rgba(227,122,44,0.35) 0%,rgba(26,22,18,0.95) 100%)"
  )
}

// ── Mock data ─────────────────────────────────────────────────────────────────

// MOCK: replace with api-client.getExploreFeed() when backend is ready
const MOCK_EXPLORE: ExploreSong[] = [
  {
    id: "ex-1",
    title: "Makran Evening",
    genre: "Zahirok",
    dialect: "Makrani",
    creator: "Jalal Rakhshani",
    instruments: ["Suroz", "Damboora"],
    duration: "3:18",
    plays: 4821,
    likes: 312,
    createdAt: "2026-05-20T10:00:00Z",
  },
  {
    id: "ex-2",
    title: "Wedding Doholl Nights",
    genre: "Wedding",
    dialect: "Makrani",
    creator: "Mahzad Baloch",
    instruments: ["Doholl", "Rubab"],
    duration: "3:05",
    plays: 3240,
    likes: 218,
    createdAt: "2026-05-18T15:00:00Z",
  },
  {
    id: "ex-3",
    title: "Sufi Breath",
    genre: "Sufi",
    dialect: "Rakhshani",
    creator: "Noor Dehwar",
    instruments: ["Damboora", "Suroz"],
    duration: "4:01",
    plays: 2890,
    likes: 195,
    createdAt: "2026-05-17T09:00:00Z",
  },
  {
    id: "ex-4",
    title: "Urban Balochi",
    genre: "Hip-Hop Fusion",
    dialect: "Sulaimani",
    creator: "Dil Nawaz",
    instruments: ["Modern Drums", "Bass", "Synth"],
    duration: "2:42",
    plays: 2104,
    likes: 141,
    createdAt: "2026-05-22T11:30:00Z",
  },
  {
    id: "ex-5",
    title: "Ya Nabi Salawat",
    genre: "Naat",
    dialect: "Rakhshani",
    creator: "Zareena Sajid",
    instruments: ["Suroz", "Tamburag"],
    duration: "5:12",
    plays: 1982,
    likes: 174,
    createdAt: "2026-05-16T08:00:00Z",
  },
  {
    id: "ex-6",
    title: "Desert Pulse",
    genre: "Hip-Hop Fusion",
    dialect: "Sulaimani",
    creator: "Karzan Beat",
    instruments: ["Modern Drums", "Guitar"],
    duration: "2:58",
    plays: 1670,
    likes: 98,
    createdAt: "2026-05-21T14:00:00Z",
  },
  {
    id: "ex-7",
    title: "Coastal Zahirok",
    genre: "Zahirok",
    dialect: "Makrani",
    creator: "Jalal Rakhshani",
    instruments: ["Rubab", "Doholl"],
    duration: "3:44",
    plays: 1455,
    likes: 87,
    createdAt: "2026-05-19T17:00:00Z",
  },
  {
    id: "ex-8",
    title: "Sacred Ground",
    genre: "Sufi",
    dialect: "Rakhshani",
    creator: "Noor Dehwar",
    instruments: ["Damboora"],
    duration: "4:28",
    plays: 1120,
    likes: 79,
    createdAt: "2026-05-15T12:00:00Z",
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(iso))
}

function applyTab(songs: ExploreSong[], tab: ExploreTab): ExploreSong[] {
  if (tab === "Trending") return [...songs].sort((a, b) => b.plays - a.plays)
  if (tab === "Latest")
    return [...songs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  return songs.filter((s) => s.genre === tab)
}

function applySearch(songs: ExploreSong[], query: string): ExploreSong[] {
  const q = query.trim().toLowerCase()
  if (!q) return songs
  return songs.filter((s) =>
    [s.title, s.genre, s.dialect, s.creator, ...s.instruments]
      .join(" ")
      .toLowerCase()
      .includes(q),
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FeedPage() {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState<ExploreTab>("Trending")
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  // MOCK: replace with api-client.getExploreFeed({ tab, query }) when backend is ready
  const visibleSongs = useMemo(
    () => applySearch(applyTab(MOCK_EXPLORE, activeTab), query),
    [activeTab, query],
  )

  // Top 3 by plays — always saffron-featured regardless of active tab
  const featuredSongs = useMemo(
    () => [...MOCK_EXPLORE].sort((a, b) => b.plays - a.plays).slice(0, 3),
    [],
  )

  function togglePlay(id: string) {
    setPlayingId((prev) => (prev === id ? null : id))
  }

  function toggleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-sand">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(227,122,44,0.22),transparent_30%),radial-gradient(circle_at_16%_28%,rgba(183,62,31,0.2),transparent_27%),radial-gradient(circle_at_84%_20%,rgba(26,58,92,0.82),transparent_35%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_44%,var(--charcoal)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(237,227,211,0.45)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.35)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-charcoal to-transparent" />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-6 md:px-6 md:pt-8 xl:px-8">

        {/* ── Page heading ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-saffron shadow-[0_0_28px_rgba(227,122,44,0.16)]">
              <Compass className="size-3.5" aria-hidden="true" />
              Community
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-sand sm:text-4xl">
              Explore Zahirok
            </h1>
            <p className="mt-2 text-sm leading-6 text-sand/65">
              Discover public Balochi songs created by the community.
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

        {/* ── Featured / Trending strip ── */}
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="size-4 text-saffron" aria-hidden="true" />
            <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">
              Trending now
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {featuredSongs.map((song, rank) => (
              <FeaturedCard
                key={song.id}
                song={song}
                rank={rank + 1}
                isPlaying={playingId === song.id}
                onPlayToggle={() => togglePlay(song.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Search + filter controls ── */}
        <div className="mt-6 rounded-[1.4rem] border border-sand/12 bg-sand/[0.07] p-2 shadow-[0_18px_48px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
          <div className="rounded-[1.1rem] border border-sand/10 bg-charcoal/50 p-3">

            {/* Search */}
            <label className="relative block">
              <span className="sr-only">Search public songs</span>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-sand/40"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search songs, creator, dialect, genre…"
                className="h-10 w-full rounded-full border border-sand/12 bg-sand/8 pl-10 pr-10 text-sm font-semibold text-sand placeholder-sand/38 outline-none transition focus:border-saffron/45 focus:bg-sand/10"
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

            {/* Category tabs */}
            <div
              role="group"
              aria-label="Explore by category"
              className="mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5"
            >
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={activeTab === tab}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-black transition ${activeTab === tab
                      ? "border-saffron bg-saffron text-sand shadow-[0_8px_20px_rgba(227,122,44,0.22)]"
                      : "border-sand/12 bg-sand/8 text-sand/65 hover:bg-sand/12 hover:text-sand"
                    }`}
                >
                  {tab}
                </button>
              ))}

              <span className="ml-auto flex shrink-0 items-center pl-2 text-[11px] font-bold text-sand/35">
                {visibleSongs.length} song{visibleSongs.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* ── Song grid ── */}
        {visibleSongs.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleSongs.map((song) => (
              <ExploreCard
                key={song.id}
                song={song}
                isPlaying={playingId === song.id}
                isLiked={likedIds.has(song.id)}
                onPlayToggle={() => togglePlay(song.id)}
                onLikeToggle={() => toggleLike(song.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState query={query} tab={activeTab} />
        )}
      </section>
    </div>
  )
}

// ── FeaturedCard ──────────────────────────────────────────────────────────────

function FeaturedCard({
  song,
  rank,
  isPlaying,
  onPlayToggle,
}: {
  song: ExploreSong
  rank: number
  isPlaying: boolean
  onPlayToggle: () => void
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[1.25rem] border transition hover:-translate-y-0.5 ${isPlaying
          ? "border-saffron/45 shadow-[0_16px_40px_rgba(227,122,44,0.18)]"
          : "border-sand/12 hover:border-saffron/30"
        }`}
    >
      {/* Cover art */}
      <div
        className="relative h-28 w-full"
        style={{ background: coverGradient(song.genre) }}
        aria-hidden="true"
      >
        {/* Decorative bars */}
        <div className="absolute inset-x-4 bottom-3 flex items-end gap-0.5 opacity-40">
          {Array.from({ length: 28 }, (_, i) => (
            <span
              key={i}
              className="w-full rounded-full bg-sand"
              style={{ height: `${8 + ((i * 13 + rank * 7) % 28)}px` }}
            />
          ))}
        </div>

        {/* Rank badge */}
        <div className="absolute left-3 top-3 flex size-7 items-center justify-center rounded-full border border-sand/20 bg-charcoal/60 text-[11px] font-black text-sand/80 backdrop-blur-sm">
          {rank}
        </div>

        {/* Play overlay */}
        <button
          type="button"
          onClick={onPlayToggle}
          aria-label={`${isPlaying ? "Pause" : "Play"} ${song.title}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100"
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-saffron text-sand shadow-[0_8px_24px_rgba(227,122,44,0.4)] transition hover:bg-terracotta">
            {isPlaying ? (
              <Music2 className="size-5" aria-hidden="true" />
            ) : (
              <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
            )}
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="bg-charcoal/60 p-3 backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-saffron">
          {song.genre}
        </p>
        <h3 className="mt-0.5 line-clamp-1 text-sm font-black text-sand">
          {song.title}
        </h3>
        <div className="mt-1 flex items-center justify-between text-[11px] font-semibold text-sand/45">
          <span>{song.creator}</span>
          <span className="flex items-center gap-1">
            <Play className="size-2.5 fill-current" aria-hidden="true" />
            {formatCount(song.plays)}
          </span>
        </div>
      </div>
    </article>
  )
}

// ── ExploreCard ───────────────────────────────────────────────────────────────

function ExploreCard({
  song,
  isPlaying,
  isLiked,
  onPlayToggle,
  onLikeToggle,
}: {
  song: ExploreSong
  isPlaying: boolean
  isLiked: boolean
  onPlayToggle: () => void
  onLikeToggle: () => void
}) {
  const likeCount = isLiked ? song.likes + 1 : song.likes

  return (
    <article
      className={`group rounded-[1.4rem] border text-sand shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:-translate-y-0.5 ${isPlaying
          ? "border-saffron/35 bg-saffron/[0.06] shadow-[0_18px_48px_rgba(227,122,44,0.1)]"
          : "border-sand/12 bg-sand/[0.07] hover:border-saffron/28 hover:bg-sand/[0.09]"
        }`}
    >
      {/* Cover art panel */}
      <div
        className="relative h-32 w-full overflow-hidden rounded-t-[1.3rem]"
        style={{ background: coverGradient(song.genre) }}
        aria-hidden="true"
      >
        <div className="absolute inset-x-4 bottom-4 flex items-end gap-0.5 opacity-35">
          {Array.from({ length: 36 }, (_, i) => (
            <span
              key={i}
              className="w-full rounded-full bg-sand"
              style={{ height: `${10 + ((i * 17 + 3) % 38)}px` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={onPlayToggle}
            aria-label={`${isPlaying ? "Pause" : "Play"} ${song.title}`}
            className="flex size-12 items-center justify-center rounded-full bg-saffron text-sand shadow-[0_8px_24px_rgba(227,122,44,0.4)] transition hover:bg-terracotta"
          >
            {isPlaying ? (
              <Pause className="size-5" aria-hidden="true" />
            ) : (
              <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        <div className="rounded-[1.1rem] border border-sand/10 bg-charcoal/45 p-3">

          {/* Genre + duration */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-saffron">
              {song.genre}
            </p>
            <span className="text-[11px] font-bold text-sand/40">
              {song.duration}
            </span>
          </div>

          {/* Title */}
          <h2 className="mt-1 line-clamp-2 text-lg font-black leading-snug text-sand">
            {song.title}
          </h2>

          {/* Creator row */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-saffron/25 bg-saffron/12 text-saffron">
                <Music2 className="size-3" aria-hidden="true" />
              </span>
              <span className="text-[12px] font-bold text-sand/72">
                {song.creator}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-sand/38">
              {formatDate(song.createdAt)}
            </span>
          </div>

          {/* Dialect */}
          <p className="mt-1.5 text-[11px] font-bold text-sand/45">
            {song.dialect} dialect
          </p>

          {/* Instrument tags */}
          {song.instruments.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {song.instruments.map((inst) => (
                <span
                  key={inst}
                  className="rounded-full border border-sand/10 bg-sand/8 px-2.5 py-0.5 text-[11px] font-bold text-sand/60"
                >
                  {inst}
                </span>
              ))}
            </div>
          )}

          {/* Waveform */}
          <div className="mt-3">
            <WaveformPlaceholder isActive={isPlaying} />
          </div>

          {/* Stats */}
          <div className="mt-3 flex gap-2">
            <span className="flex-1 rounded-xl border border-sand/10 bg-sand/6 px-3 py-1.5 text-center text-[11px] font-black uppercase tracking-[0.12em] text-sand/60">
              <span className="text-saffron">{formatCount(song.plays)}</span>{" "}
              plays
            </span>
            <span className="flex-1 rounded-xl border border-sand/10 bg-sand/6 px-3 py-1.5 text-center text-[11px] font-black uppercase tracking-[0.12em] text-sand/60">
              <span className="text-saffron">{formatCount(likeCount)}</span>{" "}
              likes
            </span>
          </div>

          {/* Actions */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {/* MOCK: replace with api-client.getStreamUrl(song.id) + real playback when backend is ready */}
            <button
              type="button"
              onClick={onPlayToggle}
              aria-pressed={isPlaying}
              aria-label={`${isPlaying ? "Pause" : "Play"} ${song.title}`}
              className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-full text-sm font-black text-sand shadow-[0_8px_22px_rgba(227,122,44,0.2)] transition ${isPlaying
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

            {/* MOCK: replace with api-client.likeSong(song.id) when backend is ready */}
            <button
              type="button"
              onClick={onLikeToggle}
              aria-pressed={isLiked}
              aria-label={`${isLiked ? "Unlike" : "Like"} ${song.title}`}
              className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-full border text-sm font-black transition ${isLiked
                  ? "border-saffron bg-saffron text-sand hover:bg-terracotta"
                  : "border-sand/15 bg-sand/6 text-sand/70 hover:bg-sand/10 hover:text-sand"
                }`}
            >
              <Heart
                className={`size-4 ${isLiked ? "fill-current" : ""}`}
                aria-hidden="true"
              />
              {isLiked ? "Liked" : "Like"}
            </button>

            {/* MOCK: replace with api-client.remixSong(song.id) when backend is ready */}
            <Link
              href="/create"
              aria-label={`Remix ${song.title}`}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-sand/15 bg-sand/6 text-sm font-bold text-sand/70 transition hover:bg-sand/10 hover:text-sand"
            >
              <RefreshCcw className="size-4" aria-hidden="true" />
              Remix
            </Link>

            {/* MOCK: replace with api-client.shareSong(song.id) when backend is ready */}
            <button
              type="button"
              disabled
              title="Sharing available when backend is connected"
              className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-1.5 rounded-full border border-sand/8 bg-sand/4 text-sm font-bold text-sand/28"
            >
              <Share2 className="size-4" aria-hidden="true" />
              Share
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState({ query, tab }: { query: string; tab: ExploreTab }) {
  const isSearch = query.trim().length > 0

  return (
    <div className="mt-5 rounded-[1.4rem] border border-sand/12 bg-sand/[0.05] p-4 text-center shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-saffron/25 bg-saffron/10 text-saffron">
        <Search className="size-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-xl font-black text-sand">
        {isSearch ? `No results for "${query}"` : `No ${tab} songs yet`}
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-sand/55">
        {isSearch
          ? "Try a different search term or browse another category."
          : "Be the first to share a song in this style."}
      </p>
      <Link
        href="/create"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-2.5 text-sm font-black text-sand shadow-[0_10px_26px_rgba(227,122,44,0.26)] transition hover:bg-terracotta"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        Create a song
      </Link>
    </div>
  )
}
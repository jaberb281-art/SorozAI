"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
    ChevronRight,
    Clock3,
    Heart,
    Music2,
    Pause,
    Play,
    Search,
    Sparkles,
    X,
} from "lucide-react"

import { usePlaySong } from "@/hooks/use-play-song"
import { formatCount, getFeedSongs, toPlayerSong, type MockSong } from "@/lib/mock-songs"

// ── Types ────────────────────────────────────────────────────────────────────

interface FeedSection {
    id: string
    title: string
    subtitle: string
    songs: MockSong[]
}

type CategoryFilter =
    | "all"
    | "staff-picks"
    | "best-of-zahirok"
    | "makkuran-folk"
    | "wedding"
    | "sufi-spiritual"
    | "experimental"

const CATEGORIES: { key: CategoryFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "staff-picks", label: "Staff Picks" },
    { key: "best-of-zahirok", label: "Best of Zahirok" },
    { key: "makkuran-folk", label: "Makkuran Folk" },
    { key: "wedding", label: "Wedding" },
    { key: "sufi-spiritual", label: "Sufi / Spiritual" },
    { key: "experimental", label: "Experimental" },
]

// ── Build sections from unified mock data ────────────────────────────────────

// MOCK: replace with api-client.getExploreFeed() when backend is ready
const ALL_FEED = getFeedSongs()

function pickByGenres(genres: string[], limit: number): MockSong[] {
    return ALL_FEED.filter((s) => genres.includes(s.genrePreset)).slice(0, limit)
}

const SECTIONS: FeedSection[] = [
    {
        id: "staff-picks",
        title: "Staff Picks",
        subtitle: "Handpicked Zahirok tracks from the community",
        songs: ALL_FEED.slice(0, 6),
    },
    {
        id: "best-of-zahirok",
        title: "Best of Zahirok",
        subtitle: "The most-loved Zahirok melodies",
        songs: pickByGenres(["Zahirok"], 6),
    },
    {
        id: "makkuran-folk",
        title: "Makkuran Folk",
        subtitle: "Traditional folk sounds from the Makran coast",
        songs: [...pickByGenres(["Zahirok", "Liko", "Sout"], 8).slice(2, 8)],
    },
    {
        id: "wedding",
        title: "Wedding & Celebration",
        subtitle: "Doholl rhythms and festive energy",
        songs: pickByGenres(["Wedding"], 5),
    },
    {
        id: "sufi-spiritual",
        title: "Sufi / Spiritual",
        subtitle: "Devotional and meditative Balochi sounds",
        songs: pickByGenres(["Sufi", "Naat"], 6),
    },
    {
        id: "experimental",
        title: "Experimental / New Sounds",
        subtitle: "Hip-hop fusion, modern pop, and fresh ideas",
        songs: pickByGenres(["Hip-Hop Fusion", "Liko", "Sout", "Modern Balochi Pop"], 5),
    },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function searchSongs(query: string): MockSong[] {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return ALL_FEED.filter((s) =>
        [s.title, s.genrePreset, s.creator, s.dialect].join(" ").toLowerCase().includes(q),
    )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function FeedPage() {
    const [query, setQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all")
    const { playSong, isCurrentSong, isPlaying } = usePlaySong()

    const searchResults = useMemo(() => searchSongs(query), [query])
    const isSearching = query.trim().length > 0

    const visibleSections = useMemo(() => {
        if (activeCategory === "all") return SECTIONS
        return SECTIONS.filter((s) => s.id === activeCategory)
    }, [activeCategory])

    function handlePlay(song: MockSong, sectionSongs: MockSong[]) {
        const queue = sectionSongs.map(toPlayerSong)
        playSong(toPlayerSong(song), queue)
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-sand">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_2%,rgba(227,122,44,0.16),transparent_28%),radial-gradient(circle_at_80%_8%,rgba(26,58,92,0.5),transparent_30%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_50%,var(--charcoal)_100%)]" />

            <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pb-[160px] pt-6 md:px-6 md:pb-[96px] md:pt-8 lg:px-8">

                {/* ── Page header ── */}
                <header className="max-w-2xl">
                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Explore
                    </h1>
                    <p className="mt-2 text-[15px] font-medium leading-6 text-sand/55">
                        Discover Zahirok tracks, Makkuran melodies, folk, wedding, spiritual, and experimental sounds from the community.
                    </p>
                </header>

                {/* ── Search bar ── */}
                <div className="mt-6">
                    <label className="relative block max-w-xl">
                        <span className="sr-only">Search for songs, creators, or genres</span>
                        <Search
                            className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-sand/35"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search songs, creators, genres…"
                            className="h-11 w-full rounded-full border border-sand/10 bg-sand/[0.05] pl-11 pr-10 text-sm font-semibold text-sand placeholder-sand/30 outline-none transition focus:border-saffron/40 focus:bg-sand/[0.08]"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                aria-label="Clear search"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sand/30 transition hover:text-sand/60"
                            >
                                <X className="size-4" aria-hidden="true" />
                            </button>
                        )}
                    </label>
                </div>

                {/* ── Category filter chips ── */}
                {!isSearching && (
                    <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() => setActiveCategory(cat.key)}
                                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                                    activeCategory === cat.key
                                        ? "bg-saffron text-charcoal"
                                        : "border border-sand/12 bg-sand/[0.05] text-sand/60 hover:border-saffron/30 hover:text-sand"
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Search results ── */}
                {isSearching ? (
                    <section className="mt-8">
                        <h2 className="text-lg font-black text-sand">
                            Results for &ldquo;{query}&rdquo;
                        </h2>
                        {searchResults.length > 0 ? (
                            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                {searchResults.map((song) => (
                                    <SongCard
                                        key={song.id}
                                        song={song}
                                        onPlay={() => handlePlay(song, searchResults)}
                                        isPlaying={isCurrentSong(toPlayerSong(song)) && isPlaying}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-12 text-center">
                                <p className="text-sm font-semibold text-sand/45">
                                    No songs match your search. Try a different term.
                                </p>
                                <Link
                                    href="/create"
                                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-2.5 text-sm font-black text-charcoal transition hover:bg-saffron/85"
                                >
                                    <Sparkles className="size-4" aria-hidden="true" />
                                    Create a song
                                </Link>
                            </div>
                        )}
                    </section>
                ) : (
                    /* ── Section rows ── */
                    <div className="mt-6">
                        {visibleSections.map((section, sectionIdx) => (
                            <section
                                key={section.id}
                                className={sectionIdx === 0 ? "" : "mt-10 md:mt-12"}
                            >
                                {/* Section header */}
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-black text-white sm:text-2xl">
                                            {section.title}
                                        </h2>
                                        <p className="mt-1 text-sm font-medium text-sand/40">
                                            {section.subtitle}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="hidden shrink-0 items-center gap-1 text-sm font-bold text-sand/40 transition hover:text-saffron sm:inline-flex"
                                    >
                                        See all
                                        <ChevronRight className="size-4" aria-hidden="true" />
                                    </button>
                                </div>

                                {/* Horizontal card row */}
                                <div className="mt-4 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {section.songs.map((song) => (
                                        <div key={song.id} className="w-[164px] shrink-0 sm:w-[180px] lg:w-[192px]">
                                            <SongCard
                                                song={song}
                                                onPlay={() => handlePlay(song, section.songs)}
                                                isPlaying={isCurrentSong(toPlayerSong(song)) && isPlaying}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── SongCard ────────────────────────────────────────────────────────────────

function SongCard({
    song,
    onPlay,
    isPlaying,
}: {
    song: MockSong
    onPlay: () => void
    isPlaying: boolean
}) {
    return (
        <article className="group">
            {/* Cover art */}
            <div className="relative aspect-square overflow-hidden rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                {/* Gradient fallback */}
                <div
                    className="absolute inset-0"
                    style={{ background: song.gradient }}
                    aria-hidden="true"
                />
                {/* Cover image overlay (if available) */}
                {song.coverImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={song.coverImage}
                        alt={`${song.title} cover artwork`}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                    />
                )}
                {/* Decorative icon (shows through if no image) */}
                {!song.coverImage && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]" aria-hidden="true">
                        <Music2 className="size-14" />
                    </div>
                )}
                {/* Decorative waveform bars */}
                <div className="absolute inset-x-3 bottom-3 flex items-end gap-[2px] opacity-[0.18]" aria-hidden="true">
                    {Array.from({ length: 20 }, (_, i) => (
                        <span
                            key={i}
                            className="w-full rounded-full bg-sand"
                            style={{ height: `${5 + ((i * 13 + 5) % 24)}px` }}
                        />
                    ))}
                </div>

                {/* Badge */}
                {song.badge && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-saffron/90 px-2 py-0.5 text-[10px] font-black text-charcoal shadow-sm">
                        {song.badge}
                    </span>
                )}

                {/* Dialect badge — bottom-left */}
                <span className="absolute bottom-2.5 left-2.5 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[10px] font-bold text-sand/80 backdrop-blur-sm">
                    {song.dialect}
                </span>

                {/* Duration — bottom-right */}
                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-sand/70 backdrop-blur-sm">
                    {song.duration}
                </span>

                {/* Play overlay */}
                <button
                    type="button"
                    onClick={onPlay}
                    aria-label={`${isPlaying ? "Pause" : "Play"} ${song.title}`}
                    className={`absolute inset-0 flex items-center justify-center transition ${isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                    <span className={`flex size-11 items-center justify-center rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-sm transition ${isPlaying ? "bg-saffron text-charcoal" : "bg-black/50 text-white hover:bg-saffron hover:text-charcoal"}`}>
                        {isPlaying ? (
                            <Pause className="size-5 fill-current" aria-hidden="true" />
                        ) : (
                            <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
                        )}
                    </span>
                </button>
            </div>

            {/* Title */}
            <h3 className="mt-2.5 line-clamp-1 text-[13px] font-bold leading-tight text-sand">
                <Link
                    href={`/song/${song.id}`}
                    className="transition hover:text-saffron"
                >
                    {song.title}
                </Link>
            </h3>

            {/* Creator */}
            <p className="mt-0.5 line-clamp-1 text-xs font-medium text-sand/40">
                {song.creator}
            </p>

            {/* Stats row */}
            <div className="mt-1.5 flex items-center gap-3 text-[11px] font-semibold text-sand/30">
                <span className="flex items-center gap-1">
                    <Play className="size-2.5 fill-current" aria-hidden="true" />
                    {formatCount(song.plays)}
                </span>
                <span className="flex items-center gap-1">
                    <Heart className="size-2.5" aria-hidden="true" />
                    {formatCount(song.likes)}
                </span>
                <span className="flex items-center gap-1">
                    <Clock3 className="size-2.5" aria-hidden="true" />
                    {song.duration}
                </span>
            </div>
        </article>
    )
}

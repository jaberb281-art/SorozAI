"use client"

import { useMemo, useRef, useState, type RefObject } from "react"
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
import { profilePathForCreator } from "@/lib/public-profiles"

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

const SUGGESTED_CREATORS = [
    {
        name: "Meeral Gwadar",
        handle: "meeralgwadar",
        followers: "41K Followers",
        avatarClass:
            "bg-[radial-gradient(circle_at_36%_28%,rgba(79,214,201,0.9)_0%,rgba(227,122,44,0.72)_34%,rgba(26,58,92,0.96)_100%)]",
    },
    {
        name: "Shah Baloch",
        handle: "shahbaloch",
        followers: "27K Followers",
        avatarClass:
            "bg-[radial-gradient(circle_at_32%_30%,rgba(246,177,58,0.95)_0%,rgba(227,122,44,0.78)_40%,rgba(15,52,64,0.98)_100%)]",
    },
    {
        name: "Zareena Sajid",
        handle: "chelz",
        followers: "19K Followers",
        avatarClass:
            "bg-[radial-gradient(circle_at_32%_28%,rgba(255,73,170,0.82)_0%,rgba(183,62,31,0.78)_42%,rgba(237,227,211,0.74)_100%)]",
    },
    {
        name: "Azim Dashti",
        handle: "meeralgwadar",
        followers: "23K Followers",
        avatarClass:
            "bg-[radial-gradient(circle_at_40%_30%,rgba(237,227,211,0.86)_0%,rgba(26,58,92,0.78)_45%,rgba(9,9,9,0.98)_100%)]",
    },
    {
        name: "Noor Dehwar",
        handle: "chelz",
        followers: "34K Followers",
        avatarClass:
            "bg-[radial-gradient(circle_at_34%_28%,rgba(227,122,44,0.9)_0%,rgba(57,30,100,0.7)_42%,rgba(9,9,12,0.98)_100%)]",
    },
    {
        name: "James Bakian",
        handle: "jamesbakian",
        followers: "18K Followers",
        avatarClass:
            "bg-[radial-gradient(circle_at_34%_30%,rgba(237,227,211,0.82)_0%,rgba(183,62,31,0.7)_38%,rgba(26,58,92,0.98)_100%)]",
    },
] as const

const EXPLORE_HOOKS = [
    {
        title: "Makran Evening Hook",
        creator: "Shah Baloch",
        handle: "shahbaloch",
        image: "/hooks/makran-evening-hook-thumb.png",
        gradient:
            "bg-[linear-gradient(180deg,rgba(31,78,86,0.95),rgba(11,14,18,0.96)_48%,rgba(92,47,23,0.9))]",
    },
    {
        title: "Wedding Doholl Step",
        creator: "Meeral Gwadar",
        handle: "meeralgwadar",
        image: "/hooks/wedding-doholl-hook-thumb.png",
        gradient:
            "bg-[radial-gradient(circle_at_48%_48%,rgba(79,214,201,0.9)_0%,rgba(227,122,44,0.62)_16%,rgba(24,23,42,0.96)_44%,rgba(9,9,12,1)_100%)]",
    },
    {
        title: "Sufi Dambora Phrase",
        creator: "Noor Dehwar",
        handle: "chelz",
        image: "/hooks/sufi-dambora-hook-thumb.png",
        gradient:
            "bg-[linear-gradient(145deg,rgba(67,45,100,0.86),rgba(12,12,15,0.98)),radial-gradient(circle_at_52%_34%,rgba(237,227,211,0.68),transparent_20%)]",
    },
    {
        title: "Coastal Liko Drift",
        creator: "Azim Dashti",
        handle: "meeralgwadar",
        gradient:
            "bg-[linear-gradient(180deg,rgba(14,71,83,0.96),rgba(9,10,14,0.98)_50%,rgba(25,31,54,0.94))]",
    },
    {
        title: "Turbat Night Call",
        creator: "Zareena Sajid",
        handle: "chelz",
        gradient:
            "bg-[linear-gradient(180deg,rgba(183,62,31,0.78),rgba(22,18,28,0.98)_54%,rgba(9,9,12,1))]",
    },
    {
        title: "Suroz Dawn Loop",
        creator: "James Bakian",
        handle: "jamesbakian",
        gradient:
            "bg-[linear-gradient(180deg,rgba(227,122,44,0.62),rgba(26,58,92,0.86)_52%,rgba(9,9,12,1))]",
    },
] as const

// ── Build sections from unified mock data ────────────────────────────────────

const BEST_OF_COLLECTIONS = [
    {
        genre: "Makkuran",
        title: "Best of Makkuran",
        gradient: "from-orange-500 via-rose-500 to-pink-500",
    },
    {
        genre: "Doholl",
        title: "Best of Doholl",
        gradient: "from-amber-500 via-orange-600 to-red-700",
    },
    {
        genre: "Dambora",
        title: "Best of Dambora",
        gradient: "from-indigo-500 via-purple-600 to-pink-500",
    },
    {
        genre: "Suroz",
        title: "Best of Suroz",
        gradient: "from-emerald-500 via-teal-600 to-cyan-500",
    },
    {
        genre: "Coastal Folk",
        title: "Best of Coastal Folk",
        gradient: "from-sky-500 via-blue-700 to-slate-900",
    },
    {
        genre: "Wedding",
        title: "Best of Wedding",
        gradient: "from-yellow-400 via-orange-500 to-red-600",
    },
] as const

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
    const creatorsRowRef = useRef<HTMLDivElement>(null)
    const hooksRowRef = useRef<HTMLDivElement>(null)
    const bestOfRowRef = useRef<HTMLDivElement>(null)
    const [query, setQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all")
    const [bestOfNotice, setBestOfNotice] = useState<string | null>(null)
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

    function scrollRow(ref: RefObject<HTMLDivElement | null>) {
        ref.current?.scrollBy({ left: 560, behavior: "smooth" })
    }

    return (
        <div className="relative min-h-dvh w-full max-w-full min-w-0 overflow-x-hidden bg-charcoal text-sand">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_2%,rgba(227,122,44,0.16),transparent_28%),radial-gradient(circle_at_80%_8%,rgba(26,58,92,0.5),transparent_30%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_50%,var(--charcoal)_100%)]" />

            <div className="relative z-10 mx-auto w-full max-w-[1280px] min-w-0 px-4 pb-6 pt-6 md:px-6 md:pt-8 lg:px-8 lg:pb-8">

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
                    <div className="mt-5 flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-color:rgba(237,227,211,0.28)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-sand/20">
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
                        {activeCategory === "all" ? (
                            <>
                                <SuggestedCreatorsSection
                                    rowRef={creatorsRowRef}
                                    onNext={() => scrollRow(creatorsRowRef)}
                                />
                                <ExploreHooksSection
                                    rowRef={hooksRowRef}
                                    onNext={() => scrollRow(hooksRowRef)}
                                />
                                <BestOfSection
                                    notice={bestOfNotice}
                                    rowRef={bestOfRowRef}
                                    onNext={() => scrollRow(bestOfRowRef)}
                                    onSeeAll={() => setBestOfNotice("Best Of page coming soon.")}
                                />
                            </>
                        ) : null}

                        {visibleSections.map((section, sectionIdx) => (
                            <section
                                key={section.id}
                                className={sectionIdx === 0 && activeCategory !== "all" ? "" : "mt-10 md:mt-12"}
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
                                <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-color:rgba(237,227,211,0.28)_transparent] [scrollbar-width:thin] sm:gap-4 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-sand/20">
                                    {section.songs.map((song) => (
                                        <div key={song.id} className="w-[min(46vw,164px)] shrink-0 snap-start sm:w-[180px] lg:w-[192px]">
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

function SuggestedCreatorsSection({
    onNext,
    rowRef,
}: {
    onNext: () => void
    rowRef: RefObject<HTMLDivElement | null>
}) {
    return (
        <section>
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white sm:text-2xl">
                    Creators You May Like
                </h2>
                <button
                    type="button"
                    aria-label="Scroll creators"
                    onClick={onNext}
                    className="hidden size-11 shrink-0 items-center justify-center rounded-full border border-sand/10 bg-sand/7 text-white transition hover:bg-saffron hover:text-charcoal md:inline-flex"
                >
                    <ChevronRight className="size-5" aria-hidden="true" />
                </button>
            </div>

            <div
                ref={rowRef}
                className="mt-5 flex snap-x gap-5 overflow-x-auto pb-3 [scrollbar-width:none] md:gap-8 [&::-webkit-scrollbar]:hidden"
            >
                {SUGGESTED_CREATORS.map((creator) => (
                    <Link
                        key={`${creator.name}-${creator.handle}`}
                        href={`/profile/${creator.handle}`}
                        className="group w-[132px] shrink-0 snap-start text-left sm:w-[162px] lg:w-[202px]"
                    >
                        <span
                            className={`block aspect-square rounded-full border border-sand/10 shadow-[0_18px_48px_rgba(0,0,0,0.28)] transition duration-300 group-hover:scale-[1.03] group-hover:border-saffron/35 ${creator.avatarClass}`}
                            aria-hidden="true"
                        />
                        <span className="mt-4 block truncate text-lg font-black leading-tight text-white transition group-hover:text-saffron">
                            {creator.name}
                        </span>
                        <span className="mt-1 block text-sm font-semibold text-sand/48">
                            {creator.followers}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    )
}

function ExploreHooksSection({
    onNext,
    rowRef,
}: {
    onNext: () => void
    rowRef: RefObject<HTMLDivElement | null>
}) {
    return (
        <section className="mt-10 md:mt-12">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-white sm:text-2xl">
                    Hooks
                </h2>
                <Link
                    href="/hooks"
                    className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full border border-sand/12 bg-sand/5 px-4 text-sm font-black text-white transition hover:border-saffron/35 hover:bg-saffron/10"
                >
                    See all
                    <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
            </div>

            <div className="relative mt-4">
                <div
                    ref={rowRef}
                    className="flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
                >
                    {EXPLORE_HOOKS.map((hook) => (
                        <Link
                            key={`${hook.title}-${hook.handle}`}
                            href="/hooks"
                            className={`group relative h-[310px] w-[min(62vw,210px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-sand/10 shadow-[0_18px_46px_rgba(0,0,0,0.26)] transition hover:border-saffron/35 sm:h-[390px] sm:w-[236px] ${hook.gradient}`}
                        >
                            {"image" in hook && hook.image ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={hook.image}
                                    alt={`${hook.title} preview`}
                                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                                />
                            ) : null}
                            <span className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/18 to-transparent" />
                            <span className="absolute bottom-4 left-4 right-4">
                                <span className="block text-lg font-black leading-tight text-white">
                                    {hook.title}
                                </span>
                                <span className="mt-2 flex items-center gap-2">
                                    <span
                                        className="size-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f2d1aa_0%,#e37a2c_36%,#2f8f9a_100%)]"
                                        aria-hidden="true"
                                    />
                                    <span className="truncate text-sm font-bold text-sand/72">
                                        {hook.creator}
                                    </span>
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>

                <button
                    type="button"
                    aria-label="Scroll hooks"
                    onClick={onNext}
                    className="absolute right-2 top-1/2 hidden size-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#242428]/90 text-white shadow-[0_18px_42px_rgba(0,0,0,0.34)] transition hover:bg-saffron hover:text-charcoal md:inline-flex"
                >
                    <ChevronRight className="size-6" aria-hidden="true" />
                </button>
            </div>
        </section>
    )
}

function BestOfSection({
    notice,
    onNext,
    onSeeAll,
    rowRef,
}: {
    notice: string | null
    onNext: () => void
    onSeeAll: () => void
    rowRef: RefObject<HTMLDivElement | null>
}) {
    return (
        <section className="mt-10 md:mt-12">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-white sm:text-2xl">
                        Best of Zahirok
                    </h2>
                    {notice ? (
                        <p className="mt-1 text-sm font-bold text-saffron/85" role="status">
                            {notice}
                        </p>
                    ) : null}
                </div>
                <button
                    type="button"
                    onClick={onSeeAll}
                    className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full border border-sand/12 bg-sand/5 px-4 text-sm font-black text-white transition hover:border-saffron/35 hover:bg-saffron/10"
                >
                    See all
                    <ChevronRight className="size-4" aria-hidden="true" />
                </button>
            </div>

            <div className="relative mt-5">
                <div
                    ref={rowRef}
                    className="flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
                >
                    {BEST_OF_COLLECTIONS.map((collection) => (
                        <button
                            key={collection.title}
                            type="button"
                            onClick={onSeeAll}
                            className="group w-[min(68vw,232px)] shrink-0 snap-start text-left sm:w-[282px] lg:w-[316px]"
                        >
                            <span
                                className={`relative block aspect-[1.05/1] overflow-hidden rounded-[22px] bg-gradient-to-br ${collection.gradient} shadow-[0_22px_52px_rgba(0,0,0,0.28)] transition duration-300 group-hover:scale-[1.015] group-hover:shadow-[0_26px_66px_rgba(227,122,44,0.14)]`}
                            >
                                <span className="absolute inset-x-0 top-0 h-2 bg-black/55" aria-hidden="true" />
                                <span className="absolute -left-8 bottom-8 size-32 rounded-full bg-saffron/45 blur-2xl" aria-hidden="true" />
                                <span className="absolute right-5 top-16 size-40 rounded-full bg-white/18 blur-3xl" aria-hidden="true" />
                                <span className="absolute -bottom-12 right-0 size-44 rounded-full bg-charcoal/38 blur-3xl" aria-hidden="true" />
                                <span className="absolute inset-0 bg-[radial-gradient(circle_at_26%_68%,rgba(255,255,255,0.22),transparent_26%),linear-gradient(90deg,rgba(255,255,255,0.08),transparent_58%)]" aria-hidden="true" />
                                <span className="absolute left-6 top-7 max-w-[82%] text-[32px] font-black leading-none tracking-normal text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.32)] sm:text-[40px]">
                                    {collection.genre}
                                </span>
                            </span>
                            <span className="mt-3 block truncate text-lg font-black text-white transition group-hover:text-saffron sm:text-xl">
                                {collection.title}
                            </span>
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    aria-label="Scroll Best Of collections"
                    onClick={onNext}
                    className="absolute right-2 top-[42%] hidden size-14 -translate-y-1/2 items-center justify-center rounded-full bg-[#242428]/90 text-white shadow-[0_18px_42px_rgba(0,0,0,0.34)] transition hover:bg-saffron hover:text-charcoal md:inline-flex"
                >
                    <ChevronRight className="size-6" aria-hidden="true" />
                </button>
            </div>
        </section>
    )
}

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
            <Link
                href={profilePathForCreator(song.creator)}
                className="mt-0.5 line-clamp-1 text-xs font-medium text-sand/40 transition hover:text-saffron"
            >
                {song.creator}
            </Link>

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

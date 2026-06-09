"use client"

import { useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ArrowRight,
    ChevronRight,
    Pause,
    Play,
    Radio,
    Search,
    Sparkles,
    X,
} from "lucide-react"

import { usePlaySong } from "@/hooks/use-play-song"
import { DemoVideoPoster } from "@/components/media/demo-video"
import { withDemoImageField, withDemoImageUrl } from "@/lib/demo-images"
import type { Song } from "@/lib/types"

// ── Types ────────────────────────────────────────────────────────────────────

type DriftCapture = {
    id: string
    title: string
    capturedAgo: string
    tags: string[]
    gradient: string
    imageUrl?: string
    audioUrl?: string
    waveformData?: number[]
}

type DiscoverInstrument = {
    id: string
    name: string
    description: string
    trackCount: number
    gradient: string
    tags: string[]
    audioPreviewUrl?: string
}

type DiscoverTrack = {
    id: string
    title: string
    creator: string
    duration: string
    tags: string[]
    gradient: string
    imageUrl?: string
    audioUrl?: string
    timeAgo?: string
}

type DiscoverClip = {
    id: string
    title: string
    creator: string
    gradient: string
    image?: string
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_DRIFT_CAPTURES_BASE: DriftCapture[] = [
    {
        id: "cap-1",
        title: "Coastal Evening Drift",
        capturedAgo: "4 min ago",
        tags: ["Calm", "Dambora"],
        gradient: "linear-gradient(135deg, #1a2a3a 0%, #2d4a3e 100%)",
        waveformData: [18, 32, 48, 24, 55, 36, 44, 27, 62, 31, 52, 22, 40, 58, 33],
    },
    {
        id: "cap-2",
        title: "Desert Night Fragment",
        capturedAgo: "11 min ago",
        tags: ["Low", "Suroz"],
        gradient: "linear-gradient(135deg, #2a1a0a 0%, #3a2a10 100%)",
        waveformData: [26, 44, 68, 31, 72, 55, 78, 36, 65, 42, 74, 51, 38, 60, 45],
    },
    {
        id: "cap-3",
        title: "Wedding Drum Moment",
        capturedAgo: "18 min ago",
        tags: ["Bright", "Duholl"],
        gradient: "linear-gradient(135deg, #2a1a0a 0%, #4a2010 100%)",
        waveformData: [42, 64, 36, 58, 74, 48, 68, 33, 52, 71, 44, 59, 62, 80, 55],
    },
    {
        id: "cap-4",
        title: "Makkuran Sunrise",
        capturedAgo: "27 min ago",
        tags: ["Sacred", "Vocal"],
        gradient: "linear-gradient(135deg, #1a0a2a 0%, #2a1a4a 100%)",
        waveformData: [24, 40, 31, 48, 35, 45, 28, 42, 50, 38, 55, 33, 44, 52, 36],
    },
    {
        id: "cap-5",
        title: "Turbat Late Night",
        capturedAgo: "35 min ago",
        tags: ["Yearning", "Instrumental"],
        gradient: "linear-gradient(135deg, #0a1a2a 0%, #1a2a3a 100%)",
        waveformData: [30, 58, 42, 69, 51, 74, 36, 63, 47, 71, 39, 55, 48, 66, 41],
    },
    {
        id: "cap-6",
        title: "Caravan Dawn",
        capturedAgo: "52 min ago",
        tags: ["Calm", "Rabab"],
        gradient: "linear-gradient(135deg, #1a1a0a 0%, #2a2a10 100%)",
        waveformData: [28, 46, 35, 61, 44, 69, 39, 65, 50, 73, 42, 58, 47, 62, 38],
    },
]

const MOCK_DRIFT_CAPTURES: DriftCapture[] = withDemoImageUrl(MOCK_DRIFT_CAPTURES_BASE)

const INSTRUMENTS: DiscoverInstrument[] = [
    {
        id: "dambora",
        name: "Dambora",
        description: "Two-stringed lute — the voice of Balochi storytelling",
        trackCount: 147,
        gradient: "linear-gradient(135deg, #2c1810 0%, #4a3020 100%)",
        tags: ["Dambora"],
    },
    {
        id: "suroz",
        name: "Suroz",
        description: "Bowed fiddle from coastal Makran",
        trackCount: 89,
        gradient: "linear-gradient(135deg, #1a2a3a 0%, #2d4a5e 100%)",
        tags: ["Suroz"],
    },
    {
        id: "duholl",
        name: "Duholl",
        description: "Double-headed drum for celebrations",
        trackCount: 203,
        gradient: "linear-gradient(135deg, #2a0a0a 0%, #4a1a10 100%)",
        tags: ["Duholl"],
    },
    {
        id: "rabab",
        name: "Rabab",
        description: "Deep-bodied lute with resonant strings",
        trackCount: 76,
        gradient: "linear-gradient(135deg, #1a1a0a 0%, #3a3010 100%)",
        tags: ["Rabab"],
    },
    {
        id: "benju",
        name: "Benju",
        description: "Plucked string for rhythmic accompaniment",
        trackCount: 112,
        gradient: "linear-gradient(135deg, #0a1a2a 0%, #1a3a4a 100%)",
        tags: ["Benju"],
    },
    {
        id: "tanburag",
        name: "Tanburag",
        description: "Long-necked fretless lute for drone",
        trackCount: 54,
        gradient: "linear-gradient(135deg, #1a0a2a 0%, #2a1a4a 100%)",
        tags: ["Tanburag"],
    },
    {
        id: "makkuran-vocal",
        name: "Makkuran Vocal",
        description: "Coastal singing tradition of the Makran belt",
        trackCount: 168,
        gradient: "linear-gradient(135deg, #2a1a0a 0%, #3a2a20 100%)",
        tags: ["Makkuran", "vocal"],
    },
    {
        id: "modern-fusion",
        name: "Modern Fusion",
        description: "Balochi instruments meet electronic production",
        trackCount: 91,
        gradient: "linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 100%)",
        tags: ["electronic", "fusion"],
    },
]

const TRENDING_TRACKS_BASE: DiscoverTrack[] = [
    {
        id: "t1",
        title: "Makran Evening",
        creator: "Jalal Rakhshani",
        duration: "3:18",
        tags: ["Makkuran", "Dambora"],
        gradient: "linear-gradient(135deg, #1a0a0a 0%, #3a2010 100%)",
    },
    {
        id: "t2",
        title: "Sufi Breath",
        creator: "Noor Dehwar",
        duration: "4:01",
        tags: ["Sufi", "Vocal"],
        gradient: "linear-gradient(135deg, #0a1a2a 0%, #1a2a4a 100%)",
    },
    {
        id: "t3",
        title: "Wedding Doholl Nights",
        creator: "Mahzad Baloch",
        duration: "3:05",
        tags: ["Duholl", "Festive"],
        gradient: "linear-gradient(135deg, #2a0a0a 0%, #4a2010 100%)",
    },
    {
        id: "t4",
        title: "Coastal Drift",
        creator: "Azim Dashti",
        duration: "3:44",
        tags: ["Suroz", "Coastal"],
        gradient: "linear-gradient(135deg, #0a1a0a 0%, #1a2a1a 100%)",
    },
    {
        id: "t5",
        title: "Dusk on the Coast",
        creator: "Noor Dehwar",
        duration: "4:15",
        tags: ["Makkuran", "Ambient"],
        gradient: "linear-gradient(135deg, #1a1a0a 0%, #2a2a10 100%)",
    },
    {
        id: "t6",
        title: "Caravan Road",
        creator: "Karimi Band",
        duration: "3:08",
        tags: ["Dambora", "Folk"],
        gradient: "linear-gradient(135deg, #2a1a0a 0%, #3a2a10 100%)",
    },
]

const EXPLORE_CLIPS_BASE: DiscoverClip[] = [
    {
        id: "clip-1",
        title: "Makran Evening Hook",
        creator: "Shah Baloch",
        gradient:
            "linear-gradient(180deg, rgba(31,78,86,0.95), rgba(11,14,18,0.96) 48%, rgba(92,47,23,0.9))",
    },
    {
        id: "clip-2",
        title: "Wedding Doholl Step",
        creator: "Meeral Gwadar",
        gradient:
            "radial-gradient(circle at 48% 48%, rgba(79,214,201,0.9) 0%, rgba(227,122,44,0.62) 16%, rgba(24,23,42,0.96) 44%, rgba(9,9,12,1) 100%)",
    },
    {
        id: "clip-3",
        title: "Sufi Dambora Phrase",
        creator: "Noor Dehwar",
        gradient:
            "linear-gradient(145deg, rgba(67,45,100,0.86), rgba(12,12,15,0.98)), radial-gradient(circle at 52% 34%, rgba(237,227,211,0.68), transparent 20%)",
    },
    {
        id: "clip-4",
        title: "Coastal Liko Drift",
        creator: "Azim Dashti",
        gradient: "linear-gradient(180deg, rgba(14,71,83,0.96), rgba(9,10,14,0.98) 50%, rgba(25,31,54,0.94))",
    },
    {
        id: "clip-5",
        title: "Turbat Night Call",
        creator: "Zareena Sajid",
        gradient: "linear-gradient(180deg, rgba(183,62,31,0.78), rgba(22,18,28,0.98) 54%, rgba(9,9,12,1))",
    },
    {
        id: "clip-6",
        title: "Suroz Dawn Loop",
        creator: "James Bakian",
        gradient: "linear-gradient(180deg, rgba(227,122,44,0.62), rgba(26,58,92,0.86) 52%, rgba(9,9,12,1))",
    },
]

const RECENTLY_CREATED_BASE: DiscoverTrack[] = [
    {
        id: "r1",
        title: "Night in Gwadar",
        creator: "Zara K.",
        tags: ["Suroz", "Night"],
        timeAgo: "2 min ago",
        duration: "2:48",
        gradient: "linear-gradient(135deg, #0a1a2a 0%, #1a3a4a 100%)",
    },
    {
        id: "r2",
        title: "Dambora Loop 7",
        creator: "Bilal M.",
        tags: ["Dambora", "Lo-fi"],
        timeAgo: "5 min ago",
        duration: "1:52",
        gradient: "linear-gradient(135deg, #2c1810 0%, #4a3020 100%)",
    },
    {
        id: "r3",
        title: "Wedding March",
        creator: "Aisha R.",
        tags: ["Duholl", "Festive"],
        timeAgo: "7 min ago",
        duration: "3:12",
        gradient: "linear-gradient(135deg, #2a0a0a 0%, #4a1a10 100%)",
    },
    {
        id: "r4",
        title: "Coastal Prayer",
        creator: "Hamid S.",
        tags: ["Vocal", "Sacred"],
        timeAgo: "9 min ago",
        duration: "4:02",
        gradient: "linear-gradient(135deg, #1a0a2a 0%, #2a1a4a 100%)",
    },
    {
        id: "r5",
        title: "Rabab Drone Study",
        creator: "Nadia T.",
        tags: ["Rabab", "Ambient"],
        timeAgo: "12 min ago",
        duration: "3:36",
        gradient: "linear-gradient(135deg, #1a1a0a 0%, #3a3010 100%)",
    },
    {
        id: "r6",
        title: "Benju Pulse",
        creator: "Omar J.",
        tags: ["Benju", "Rhythm"],
        timeAgo: "15 min ago",
        duration: "2:14",
        gradient: "linear-gradient(135deg, #0a1a2a 0%, #1a3a4a 100%)",
    },
    {
        id: "r7",
        title: "Fusion Horizon",
        creator: "Layla P.",
        tags: ["Fusion", "Electronic"],
        timeAgo: "18 min ago",
        duration: "3:55",
        gradient: "linear-gradient(135deg, #0a0a2a 0%, #1a1a4a 100%)",
    },
    {
        id: "r8",
        title: "Tanburag Morning",
        creator: "Rashid Q.",
        tags: ["Tanburag", "Calm"],
        timeAgo: "21 min ago",
        duration: "2:40",
        gradient: "linear-gradient(135deg, #1a0a2a 0%, #2a1a4a 100%)",
    },
    {
        id: "r9",
        title: "Makran Echoes",
        creator: "Sana W.",
        tags: ["Makkuran", "Folk"],
        timeAgo: "24 min ago",
        duration: "3:22",
        gradient: "linear-gradient(135deg, #2a1a0a 0%, #3a2a20 100%)",
    },
]

const TRENDING_TRACKS: DiscoverTrack[] = withDemoImageUrl(TRENDING_TRACKS_BASE)
const EXPLORE_CLIPS: DiscoverClip[] = withDemoImageField(EXPLORE_CLIPS_BASE)
const RECENTLY_CREATED: DiscoverTrack[] = withDemoImageUrl(RECENTLY_CREATED_BASE)

const ALL_SEARCHABLE_TRACKS = [...TRENDING_TRACKS, ...RECENTLY_CREATED]

// ── Helpers ────────────────────────────────────────────────────────────────────

function toPlayableTrack(track: DiscoverTrack): Song {
    return {
        id: track.id,
        title: track.title,
        prompt: `${track.title} — ${track.tags.join(", ")}`,
        genrePreset: "Zahirok",
        instruments: ["Damboora", "Suroz"],
        lyrics: "",
        status: "completed",
        audioUrl: track.audioUrl ?? "/mock/audio-placeholder.mp3",
        mp3Url: track.audioUrl ?? "/mock/audio-placeholder.mp3",
        wavUrl: "/mock/audio-placeholder.wav",
        isPublic: true,
        createdAt: new Date().toISOString(),
        duration: track.duration,
        plays: 0,
        likes: 0,
        remixes: 0,
    }
}

function toPlayableCapture(capture: DriftCapture): Song {
    return {
        id: capture.id,
        title: capture.title,
        prompt: capture.tags.join(", "),
        genrePreset: "Zahirok",
        instruments: ["Damboora", "Suroz"],
        lyrics: "",
        status: "completed",
        audioUrl: capture.audioUrl ?? "/mock/audio-placeholder.mp3",
        mp3Url: capture.audioUrl ?? "/mock/audio-placeholder.mp3",
        wavUrl: "/mock/audio-placeholder.wav",
        isPublic: true,
        createdAt: new Date().toISOString(),
        duration: "0:30",
        plays: 0,
        likes: 0,
        remixes: 0,
    }
}

function buildCreateLikeHref(track: Pick<DiscoverTrack, "title" | "tags">): string {
    const params = new URLSearchParams({
        prompt: `${track.title} style — ${track.tags.join(", ")}`,
    })
    return `/create?${params.toString()}`
}

function buildInstrumentExploreHref(instrument: DiscoverInstrument): string {
    const params = new URLSearchParams({
        start: "instrument",
        prompt: `${instrument.name} — ${instrument.description}`,
    })
    instrument.tags.forEach((tag) => params.append("tags", tag))
    return `/create?${params.toString()}`
}

function searchDiscover(query: string) {
    const q = query.trim().toLowerCase()
    if (!q) return { tracks: [] as DiscoverTrack[], instruments: [] as DiscoverInstrument[] }

    const tracks = ALL_SEARCHABLE_TRACKS.filter((track) =>
        [track.title, track.creator, ...track.tags].join(" ").toLowerCase().includes(q),
    )
    const instruments = INSTRUMENTS.filter((instrument) =>
        [instrument.name, instrument.description, ...instrument.tags].join(" ").toLowerCase().includes(q),
    )

    return { tracks, instruments }
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function FeedPage() {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const { playSong, isCurrentSong, isPlaying } = usePlaySong()

    const searchResults = useMemo(() => searchDiscover(query), [query])
    const isSearching = query.trim().length > 0

    function handlePlayTrack(track: DiscoverTrack, queue: DiscoverTrack[]) {
        playSong(
            toPlayableTrack(track),
            queue.map(toPlayableTrack),
        )
    }

    function handlePlayCapture(capture: DriftCapture) {
        playSong(
            toPlayableCapture(capture),
            MOCK_DRIFT_CAPTURES.map(toPlayableCapture),
        )
    }

    function handlePlayInstrument(instrument: DiscoverInstrument) {
        playSong({
            id: `instrument-preview-${instrument.id}`,
            title: `${instrument.name} sample`,
            prompt: instrument.description,
            genrePreset: "Zahirok",
            instruments: ["Damboora", "Suroz"],
            lyrics: "",
            status: "completed",
            audioUrl: instrument.audioPreviewUrl ?? "/mock/audio-placeholder.mp3",
            mp3Url: instrument.audioPreviewUrl ?? "/mock/audio-placeholder.mp3",
            wavUrl: "/mock/audio-placeholder.wav",
            isPublic: true,
            createdAt: new Date().toISOString(),
            duration: "0:15",
            plays: 0,
            likes: 0,
            remixes: 0,
        })
    }

    return (
        <div className="relative min-h-dvh w-full max-w-full min-w-0 overflow-x-hidden bg-charcoal text-sand">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_2%,rgba(227,122,44,0.16),transparent_28%),radial-gradient(circle_at_80%_8%,rgba(26,58,92,0.5),transparent_30%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_50%,var(--charcoal)_100%)]" />

            <div className="relative z-10 mx-auto w-full max-w-[1280px] min-w-0 px-4 pb-6 pt-6 md:px-6 md:pt-8 lg:px-8 lg:pb-8">
                <header className="max-w-2xl">
                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Discover
                    </h1>
                    <p className="mt-2 text-[15px] font-medium leading-6 text-sand/55">
                        Find sounds, instruments, and moments from the Zahirok community.
                        Start listening — or tap anything to create something like it.
                    </p>
                </header>

                <div className="mt-6">
                    <label className="relative block max-w-xl">
                        <span className="sr-only">Search instruments, sounds, creators</span>
                        <Search
                            className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-sand/35"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search instruments, sounds, creators..."
                            className="h-11 w-full rounded-full border border-sand/10 bg-sand/[0.05] pl-11 pr-10 text-sm font-semibold text-sand placeholder-sand/30 outline-none transition focus:border-saffron/40 focus:bg-sand/[0.08]"
                        />
                        {query ? (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                aria-label="Clear search"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sand/30 transition hover:text-sand/60"
                            >
                                <X className="size-4" aria-hidden="true" />
                            </button>
                        ) : null}
                    </label>
                </div>

                {isSearching ? (
                    <SearchResults
                        instruments={searchResults.instruments}
                        onPlayInstrument={handlePlayInstrument}
                        onPlayTrack={handlePlayTrack}
                        query={query}
                        tracks={searchResults.tracks}
                        isCurrentSong={isCurrentSong}
                        isPlaying={isPlaying}
                    />
                ) : (
                    <div className="mt-8 space-y-10 md:space-y-12">
                        <LiveFromDriftSection
                            captures={MOCK_DRIFT_CAPTURES}
                            isCurrentSong={isCurrentSong}
                            isPlaying={isPlaying}
                            onPlayCapture={handlePlayCapture}
                        />
                        <ExploreByInstrumentSection
                            instruments={INSTRUMENTS}
                            onExplore={(instrument) => router.push(buildInstrumentExploreHref(instrument))}
                            onHearIt={handlePlayInstrument}
                        />
                        <TrendingSection
                            isCurrentSong={isCurrentSong}
                            isPlaying={isPlaying}
                            onCreateLike={(track) => router.push(buildCreateLikeHref(track))}
                            onPlayTrack={handlePlayTrack}
                            tracks={TRENDING_TRACKS}
                        />
                        <ClipsSection
                            clips={EXPLORE_CLIPS}
                            isCurrentSong={isCurrentSong}
                            isPlaying={isPlaying}
                            onCreateLike={(clip) =>
                                router.push(
                                    buildCreateLikeHref({
                                        title: clip.title,
                                        tags: ["Clip", clip.creator],
                                    }),
                                )
                            }
                            onPlayClip={(clip) =>
                                handlePlayTrack(
                                    {
                                        id: clip.id,
                                        title: clip.title,
                                        creator: clip.creator,
                                        duration: "0:30",
                                        tags: ["Clip"],
                                        gradient: clip.gradient,
                                    },
                                    EXPLORE_CLIPS.map((item) => ({
                                        id: item.id,
                                        title: item.title,
                                        creator: item.creator,
                                        duration: "0:30",
                                        tags: ["Clip"],
                                        gradient: item.gradient,
                                    })),
                                )
                            }
                        />
                        <RecentlyCreatedSection
                            isCurrentSong={isCurrentSong}
                            isPlaying={isPlaying}
                            onCreateLike={(track) => router.push(buildCreateLikeHref(track))}
                            onPlayTrack={handlePlayTrack}
                            tracks={RECENTLY_CREATED}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Sections ───────────────────────────────────────────────────────────────────

function SectionHeaderActions({
    createHref = "/create",
    seeAllHref,
    seeAllLabel = "See all",
}: {
    createHref?: string
    seeAllHref?: string
    seeAllLabel?: string
}) {
    return (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
                href={createHref}
                className="inline-flex h-9 items-center gap-1 rounded-full border border-saffron/24 bg-saffron/[0.08] px-3 text-xs font-black text-saffron transition hover:bg-saffron hover:text-charcoal"
            >
                Create something
                <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            {seeAllHref ? (
                <Link
                    href={seeAllHref}
                    className="inline-flex h-9 items-center gap-1 rounded-full border border-sand/12 bg-sand/5 px-3 text-xs font-black text-white transition hover:border-saffron/35 hover:bg-saffron/10"
                >
                    {seeAllLabel}
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                </Link>
            ) : null}
        </div>
    )
}

function LiveFromDriftSection({
    captures,
    isCurrentSong,
    isPlaying,
    onPlayCapture,
}: {
    captures: DriftCapture[]
    isCurrentSong: (song: Song) => boolean
    isPlaying: boolean
    onPlayCapture: (capture: DriftCapture) => void
}) {
    if (captures.length === 0) {
        return (
            <section aria-labelledby="live-drift-title">
                <SectionEyebrow id="live-drift-title">Live from The Drift</SectionEyebrow>
                <div className="mt-6 flex flex-col items-center rounded-2xl border border-sand/10 bg-sand/[0.04] px-6 py-12 text-center">
                    <Radio className="size-10 text-saffron/60" aria-hidden="true" />
                    <p className="mt-4 text-base font-black text-white">The Drift is warming up.</p>
                    <p className="mt-2 max-w-sm text-sm font-semibold text-sand/48">
                        Open the radio and capture your first moment.
                    </p>
                    <Link
                        href="/radio"
                        className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-saffron px-4 text-sm font-black text-charcoal transition hover:bg-saffron/85"
                    >
                        Open The Drift
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        )
    }

    return (
        <section aria-labelledby="live-drift-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <SectionEyebrow id="live-drift-title">Live from The Drift</SectionEyebrow>
                    <p className="mt-1 text-sm font-medium text-sand/45">
                        What the community is capturing right now
                    </p>
                </div>
                <Link
                    href="/radio"
                    className="inline-flex h-9 items-center gap-1 self-start rounded-full border border-sand/12 bg-sand/5 px-3 text-xs font-black text-white transition hover:border-saffron/35 hover:bg-saffron/10 sm:self-auto"
                >
                    Open The Drift
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
            </div>

            <HorizontalScrollRow className="mt-5">
                {captures.map((capture) => {
                    const song = toPlayableCapture(capture)
                    const playing = isCurrentSong(song) && isPlaying

                    return (
                        <article
                            key={capture.id}
                            className="w-[min(78vw,300px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-sand/10 bg-[#141211]/90 shadow-[0_16px_44px_rgba(0,0,0,0.28)]"
                        >
                            <div
                                className="relative h-[120px]"
                                style={{ background: capture.gradient }}
                            >
                                {capture.imageUrl ? (
                                    <DemoVideoPoster
                                        src={capture.imageUrl}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                ) : null}
                                <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-black text-sand/80 backdrop-blur-sm">
                                    30s
                                </span>
                            </div>

                            <WaveformStrip bars={capture.waveformData} className="px-4 py-3" />

                            <div className="px-4 pb-4">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-sm font-black text-white">{capture.title}</h3>
                                </div>
                                <p className="mt-1 text-xs font-semibold text-sand/42">
                                    Captured {capture.capturedAgo}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {capture.tags.slice(0, 2).map((tag) => (
                                        <TagPill key={tag} label={tag} />
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onPlayCapture(capture)}
                                        aria-label={`${playing ? "Pause" : "Play"} ${capture.title}`}
                                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-sand/12 bg-sand/[0.08] px-3 text-xs font-black text-sand transition hover:border-saffron/30 hover:text-saffron"
                                    >
                                        {playing ? (
                                            <Pause className="size-3.5 fill-current" aria-hidden="true" />
                                        ) : (
                                            <Play className="size-3.5 fill-current" aria-hidden="true" />
                                        )}
                                        {playing ? "Pause" : "Play"}
                                    </button>
                                    <Link
                                        href={`/create?capture=${capture.id}`}
                                        className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-full bg-saffron px-3 text-xs font-black text-charcoal transition hover:bg-saffron/85"
                                    >
                                        Turn into song
                                        <ArrowRight className="size-3.5" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </HorizontalScrollRow>
        </section>
    )
}

function ExploreByInstrumentSection({
    instruments,
    onExplore,
    onHearIt,
}: {
    instruments: DiscoverInstrument[]
    onExplore: (instrument: DiscoverInstrument) => void
    onHearIt: (instrument: DiscoverInstrument) => void
}) {
    return (
        <section aria-labelledby="explore-instruments-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <SectionEyebrow id="explore-instruments-title">Explore by Instrument</SectionEyebrow>
                    <p className="mt-1 text-sm font-medium text-sand/45">
                        Every sound in Zahirok starts with an instrument.
                    </p>
                </div>
                <SectionHeaderActions />
            </div>

            <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 lg:grid-rows-2">
                {instruments.map((instrument) => (
                    <article
                        key={instrument.id}
                        className="flex w-[min(72vw,180px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-sand/10 bg-[#141211]/88 shadow-[0_12px_36px_rgba(0,0,0,0.24)] md:w-auto"
                    >
                        <div
                            className="flex min-h-[88px] flex-1 flex-col justify-end p-4"
                            style={{ background: instrument.gradient }}
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-sand/45">
                                {instrument.trackCount} tracks
                            </span>
                            <h3 className="mt-1 text-base font-black text-white">{instrument.name}</h3>
                            <p className="mt-1 line-clamp-2 text-xs font-semibold leading-4 text-sand/62">
                                {instrument.description}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 p-3">
                            <button
                                type="button"
                                onClick={() => onHearIt(instrument)}
                                className="inline-flex h-9 items-center justify-center gap-1 rounded-full border border-sand/12 bg-sand/[0.06] text-[11px] font-black text-sand transition hover:border-saffron/30 hover:text-saffron"
                            >
                                <Play className="size-3 fill-current" aria-hidden="true" />
                                Hear it
                            </button>
                            <button
                                type="button"
                                onClick={() => onExplore(instrument)}
                                className="inline-flex h-9 items-center justify-center gap-1 rounded-full bg-saffron text-[11px] font-black text-charcoal transition hover:bg-saffron/85"
                            >
                                Explore
                                <ArrowRight className="size-3" aria-hidden="true" />
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}

function TrendingSection({
    isCurrentSong,
    isPlaying,
    onCreateLike,
    onPlayTrack,
    tracks,
}: {
    isCurrentSong: (song: Song) => boolean
    isPlaying: boolean
    onCreateLike: (track: DiscoverTrack) => void
    onPlayTrack: (track: DiscoverTrack, queue: DiscoverTrack[]) => void
    tracks: DiscoverTrack[]
}) {
    return (
        <section aria-labelledby="trending-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <SectionEyebrow id="trending-title">Trending this week</SectionEyebrow>
                    <p className="mt-1 text-sm font-medium text-sand/45">
                        The sounds the community keeps coming back to.
                    </p>
                </div>
                <SectionHeaderActions seeAllHref="/feed" seeAllLabel="See all" />
            </div>

            <HorizontalScrollRow className="mt-5">
                {tracks.map((track) => (
                    <TrendingTrackCard
                        key={track.id}
                        isPlaying={isCurrentSong(toPlayableTrack(track)) && isPlaying}
                        onCreateLike={() => onCreateLike(track)}
                        onPlay={() => onPlayTrack(track, tracks)}
                        track={track}
                    />
                ))}
            </HorizontalScrollRow>
        </section>
    )
}

function ClipsSection({
    clips,
    isCurrentSong,
    isPlaying,
    onCreateLike,
    onPlayClip,
}: {
    clips: DiscoverClip[]
    isCurrentSong: (song: Song) => boolean
    isPlaying: boolean
    onCreateLike: (clip: DiscoverClip) => void
    onPlayClip: (clip: DiscoverClip) => void
}) {
    return (
        <section aria-labelledby="clips-title">
            <div className="flex items-center justify-between gap-4">
                <h2 id="clips-title" className="text-xl font-black text-white sm:text-2xl">
                    Clips
                </h2>
                <Link
                    href="/hooks"
                    className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full border border-sand/12 bg-sand/5 px-4 text-sm font-black text-white transition hover:border-saffron/35 hover:bg-saffron/10"
                >
                    See all
                    <ChevronRight className="size-4" aria-hidden="true" />
                </Link>
            </div>

            <HorizontalScrollRow className="mt-4">
                {clips.map((clip) => {
                    const playing =
                        isCurrentSong(
                            toPlayableTrack({
                                id: clip.id,
                                title: clip.title,
                                creator: clip.creator,
                                duration: "0:30",
                                tags: ["Clip"],
                                gradient: clip.gradient,
                            }),
                        ) && isPlaying

                    return (
                        <article
                            key={clip.id}
                            className="group relative h-[310px] w-[min(62vw,210px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-sand/10 shadow-[0_18px_46px_rgba(0,0,0,0.26)] sm:h-[390px] sm:w-[236px]"
                            style={{ background: clip.gradient }}
                        >
                            {clip.image ? (
                                <DemoVideoPoster
                                    src={clip.image}
                                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                />
                            ) : null}
                            <span className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/18 to-transparent" />

                            <button
                                type="button"
                                onClick={() => onPlayClip(clip)}
                                aria-label={`${playing ? "Pause" : "Play"} ${clip.title}`}
                                className="absolute left-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-saffron hover:text-charcoal"
                            >
                                {playing ? (
                                    <Pause className="size-4 fill-current" aria-hidden="true" />
                                ) : (
                                    <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                                )}
                            </button>

                            <div className="absolute inset-x-4 bottom-4">
                                <h3 className="text-lg font-black leading-tight text-white">{clip.title}</h3>
                                <p className="mt-2 text-sm font-bold text-sand/72">{clip.creator}</p>
                                <button
                                    type="button"
                                    onClick={() => onCreateLike(clip)}
                                    className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1 rounded-full bg-saffron/90 text-xs font-black text-charcoal opacity-0 transition group-hover:opacity-100 hover:bg-saffron"
                                >
                                    Create like this
                                    <ArrowRight className="size-3.5" aria-hidden="true" />
                                </button>
                            </div>
                        </article>
                    )
                })}
            </HorizontalScrollRow>
        </section>
    )
}

function RecentlyCreatedSection({
    isCurrentSong,
    isPlaying,
    onCreateLike,
    onPlayTrack,
    tracks,
}: {
    isCurrentSong: (song: Song) => boolean
    isPlaying: boolean
    onCreateLike: (track: DiscoverTrack) => void
    onPlayTrack: (track: DiscoverTrack, queue: DiscoverTrack[]) => void
    tracks: DiscoverTrack[]
}) {
    return (
        <section aria-labelledby="recently-created-title">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <SectionEyebrow id="recently-created-title">Recently created</SectionEyebrow>
                    <p className="mt-1 text-sm font-medium text-sand/45">
                        Live from the Zahirok community.
                    </p>
                </div>
                <SectionHeaderActions />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tracks.map((track) => (
                    <RecentFeedCard
                        key={track.id}
                        isPlaying={isCurrentSong(toPlayableTrack(track)) && isPlaying}
                        onCreateLike={() => onCreateLike(track)}
                        onPlay={() => onPlayTrack(track, tracks)}
                        track={track}
                    />
                ))}
            </div>
        </section>
    )
}

function SearchResults({
    instruments,
    isCurrentSong,
    isPlaying,
    onPlayInstrument,
    onPlayTrack,
    query,
    tracks,
}: {
    instruments: DiscoverInstrument[]
    isCurrentSong: (song: Song) => boolean
    isPlaying: boolean
    onPlayInstrument: (instrument: DiscoverInstrument) => void
    onPlayTrack: (track: DiscoverTrack, queue: DiscoverTrack[]) => void
    query: string
    tracks: DiscoverTrack[]
}) {
    const hasResults = tracks.length > 0 || instruments.length > 0

    return (
        <section className="mt-8">
            <h2 className="text-lg font-black text-sand">
                Results for &ldquo;{query}&rdquo;
            </h2>

            {!hasResults ? (
                <div className="mt-12 text-center">
                    <p className="text-sm font-semibold text-sand/45">
                        Nothing matched your search. Try an instrument name or mood.
                    </p>
                    <Link
                        href="/create"
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-2.5 text-sm font-black text-charcoal transition hover:bg-saffron/85"
                    >
                        <Sparkles className="size-4" aria-hidden="true" />
                        Create a song
                    </Link>
                </div>
            ) : (
                <div className="mt-6 space-y-8">
                    {instruments.length > 0 ? (
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-saffron/70">
                                Instruments
                            </h3>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {instruments.map((instrument) => (
                                    <article
                                        key={instrument.id}
                                        className="rounded-xl border border-sand/10 p-3"
                                        style={{ background: instrument.gradient }}
                                    >
                                        <h4 className="text-sm font-black text-white">{instrument.name}</h4>
                                        <p className="mt-1 text-xs font-semibold text-sand/62">
                                            {instrument.description}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => onPlayInstrument(instrument)}
                                            className="mt-3 inline-flex h-8 items-center gap-1 rounded-full bg-black/30 px-3 text-[11px] font-black text-sand"
                                        >
                                            <Play className="size-3 fill-current" aria-hidden="true" />
                                            Hear it
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {tracks.length > 0 ? (
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-saffron/70">
                                Tracks
                            </h3>
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                {tracks.map((track) => (
                                    <TrendingTrackCard
                                        key={track.id}
                                        compact
                                        isPlaying={isCurrentSong(toPlayableTrack(track)) && isPlaying}
                                        onCreateLike={() => {}}
                                        onPlay={() => onPlayTrack(track, tracks)}
                                        track={track}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </section>
    )
}

// ── Cards & primitives ─────────────────────────────────────────────────────────

function TrendingTrackCard({
    compact = false,
    isPlaying,
    onCreateLike,
    onPlay,
    track,
}: {
    compact?: boolean
    isPlaying: boolean
    onCreateLike: () => void
    onPlay: () => void
    track: DiscoverTrack
}) {
    const widthClass = compact
        ? "w-full"
        : "w-[min(72vw,220px)] shrink-0 snap-start"

    return (
        <article className={`group overflow-hidden rounded-2xl border border-sand/10 bg-[#141211]/88 shadow-[0_14px_40px_rgba(0,0,0,0.24)] ${widthClass}`}>
            <div className="relative aspect-[4/3]" style={{ background: track.gradient }}>
                {track.imageUrl ? (
                    <DemoVideoPoster
                        src={track.imageUrl}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : null}
                <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onPlay}
                        aria-label={`${isPlaying ? "Pause" : "Play"} ${track.title}`}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-saffron hover:text-charcoal"
                    >
                        {isPlaying ? (
                            <Pause className="size-4 fill-current" aria-hidden="true" />
                        ) : (
                            <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                        )}
                    </button>
                    <WaveformStrip
                        bars={[12, 24, 18, 32, 20, 28, 16, 30, 22, 26, 18, 24]}
                        className="min-w-0 flex-1"
                        compact
                    />
                    <span className="shrink-0 text-[10px] font-black tabular-nums text-sand/70">
                        {track.duration}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="line-clamp-1 text-sm font-black text-white">{track.title}</h3>
                <p className="mt-1 text-xs font-semibold text-sand/45">{track.creator}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {track.tags.slice(0, 2).map((tag) => (
                        <TagPill key={tag} label={tag} />
                    ))}
                </div>
                {!compact ? (
                    <button
                        type="button"
                        onClick={onCreateLike}
                        className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1 rounded-full bg-saffron text-xs font-black text-charcoal transition hover:bg-saffron/85"
                    >
                        Create like this
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                    </button>
                ) : null}
            </div>
        </article>
    )
}

function RecentFeedCard({
    isPlaying,
    onCreateLike,
    onPlay,
    track,
}: {
    isPlaying: boolean
    onCreateLike: () => void
    onPlay: () => void
    track: DiscoverTrack
}) {
    return (
        <article className="group overflow-hidden rounded-xl border border-sand/10 bg-[#141211]/88">
            <div className="relative aspect-[4/3]" style={{ background: track.gradient }}>
                {track.imageUrl ? (
                    <DemoVideoPoster
                        src={track.imageUrl}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : null}
                <button
                    type="button"
                    onClick={onPlay}
                    aria-label={`${isPlaying ? "Pause" : "Play"} ${track.title}`}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100"
                >
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-saffron text-charcoal">
                        {isPlaying ? (
                            <Pause className="size-4 fill-current" aria-hidden="true" />
                        ) : (
                            <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                        )}
                    </span>
                </button>
            </div>
            <div className="p-3">
                <h3 className="line-clamp-1 text-sm font-black text-white">{track.title}</h3>
                <p className="mt-0.5 text-xs font-semibold text-sand/45">{track.creator}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {track.tags.slice(0, 2).map((tag) => (
                        <TagPill key={tag} label={tag} />
                    ))}
                </div>
                {track.timeAgo ? (
                    <p className="mt-2 text-[11px] font-semibold text-sand/35">
                        Generated {track.timeAgo}
                    </p>
                ) : null}
                <button
                    type="button"
                    onClick={onCreateLike}
                    className="mt-3 inline-flex h-8 w-full items-center justify-center gap-1 rounded-full border border-saffron/24 bg-saffron/[0.08] text-[11px] font-black text-saffron opacity-0 transition group-hover:opacity-100 hover:bg-saffron hover:text-charcoal"
                >
                    Create like this
                    <ArrowRight className="size-3" aria-hidden="true" />
                </button>
            </div>
        </article>
    )
}

function HorizontalScrollRow({
    children,
    className = "",
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <div className={`relative ${className}`}>
            <div className="flex snap-x gap-3 overflow-x-auto pb-3 scroll-pr-6 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden">
                {children}
            </div>
            <div
                className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-charcoal to-transparent"
                aria-hidden="true"
            />
        </div>
    )
}

function WaveformStrip({
    bars = [12, 24, 18, 32, 20, 28, 16, 30, 22, 26, 18, 24],
    className = "",
    compact = false,
}: {
    bars?: number[]
    className?: string
    compact?: boolean
}) {
    return (
        <div
            className={`flex items-end gap-px ${compact ? "h-6" : "h-8"} ${className}`}
            aria-hidden="true"
        >
            {bars.map((height, index) => (
                <span
                    key={`${height}-${index}`}
                    className="flex-1 rounded-full bg-saffron/55"
                    style={{ height: `${Math.max(compact ? 6 : 8, height)}%` }}
                />
            ))}
        </div>
    )
}

function TagPill({ label }: { label: string }) {
    return (
        <span className="rounded-full border border-saffron/20 bg-saffron/[0.08] px-2 py-0.5 text-[10px] font-black text-saffron/90">
            {label}
        </span>
    )
}

function SectionEyebrow({ children, id }: { children: ReactNode; id?: string }) {
    return (
        <h2
            id={id}
            className="text-xs font-black uppercase tracking-[0.16em] text-saffron/78 sm:text-sm"
        >
            {children}
        </h2>
    )
}

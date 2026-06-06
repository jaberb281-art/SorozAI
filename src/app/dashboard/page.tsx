"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    AudioWaveform,
    ChevronRight,
    Compass,
    MoreHorizontal,
    Mic,
    Music2,
    Pause,
    Play,
    Plus,
    Search,
    Upload,
    X,
} from "lucide-react"

import { usePlaySong } from "@/hooks/use-play-song"
import { formatCount, getFeedSongs, toPlayerSong, type MockSong } from "@/lib/mock-songs"
import type { Song } from "@/lib/types"

// ── Mock data ────────────────────────────────────────────────────────────────

// MOCK: replace with api-client.getHomeFeed() when backend is ready
const FEED = getFeedSongs()

type CollectionSong = {
    id: string
    title: string
    artist: string
    genre: string
    duration: string
    plays: number
    color: string
    coverImage?: string
}

function feedToCollectionSong(s: MockSong, color: string): CollectionSong {
    return { id: s.id, title: s.title, artist: s.creator, genre: s.genrePreset, duration: s.duration, plays: s.plays, color, coverImage: s.coverImage }
}

const COLLECTIONS = [
    {
        id: "col-for-you",
        title: "For You",
        subtitle: "Picked for your taste",
        songs: [
            feedToCollectionSong(FEED[0]!, "bg-saffron/60"),
            feedToCollectionSong(FEED[4]!, "bg-indigo-deep/80"),
        ],
        collage: ["bg-saffron/50", "bg-terracotta/50", "bg-indigo-deep/60", "bg-saffron/30"],
    },
    {
        id: "col-studio",
        title: "Made with Studio",
        subtitle: "Created by the community",
        songs: [
            feedToCollectionSong(FEED[3]!, "bg-zinc-500/50"),
            feedToCollectionSong(FEED[1]!, "bg-purple-600/50"),
        ],
        collage: ["bg-indigo-deep/70", "bg-purple-600/40", "bg-zinc-500/40", "bg-terracotta/40"],
    },
    {
        id: "col-best",
        title: "Best of Zahirok",
        subtitle: "All-time community favorites",
        songs: [
            feedToCollectionSong(FEED[2]!, "bg-terracotta/50"),
            feedToCollectionSong(FEED[5]!, "bg-emerald-700/50"),
        ],
        collage: ["bg-terracotta/50", "bg-saffron/40", "bg-emerald-700/40", "bg-indigo-deep/50"],
    },
] as const

// MOCK: replace with api-client.getMoodPlaylists() when backend is ready
const MOOD_CARDS = [
    {
        id: "mood-late-night",
        title: "Late Night Zahirok",
        gradient:
            "linear-gradient(135deg,rgba(26,58,92,0.8) 0%,rgba(26,22,18,0.95) 100%)",
        coverImage: "/covers/turbat-night.png",
    },
    {
        id: "mood-cinematic",
        title: "Cinematic Balochi",
        gradient:
            "linear-gradient(135deg,rgba(91,49,155,0.6) 0%,rgba(26,22,18,0.95) 100%)",
        coverImage: "/covers/sufi-dambora.png",
    },
    {
        id: "mood-romantic",
        title: "Romantic",
        gradient:
            "linear-gradient(135deg,rgba(183,62,31,0.6) 0%,rgba(227,122,44,0.25) 100%)",
        coverImage: "/covers/makran-evening.png",
    },
    {
        id: "mood-morning",
        title: "Morning Drive",
        gradient:
            "linear-gradient(135deg,rgba(227,122,44,0.55) 0%,rgba(26,58,92,0.4) 100%)",
        coverImage: "/covers/coastal-lullaby.png",
    },
    {
        id: "mood-wedding",
        title: "Wedding Doholl",
        gradient:
            "linear-gradient(135deg,rgba(227,122,44,0.7) 0%,rgba(183,62,31,0.5) 100%)",
        coverImage: "/covers/wedding-doholl.png",
    },
] as const

// MOCK: bridge collection song → Song for the global player store
import { getMockSongById } from "@/lib/mock-songs"

function toSong(s: CollectionSong): Song {
    // Try to get the full MockSong from the unified source
    const mock = getMockSongById(s.id)
    if (mock) return toPlayerSong(mock)

    return {
        id: s.id,
        title: s.title,
        prompt: "",
        genrePreset: s.genre as Song["genrePreset"],
        instruments: [],
        lyrics: "",
        status: "completed",
        audioUrl: "/mock/audio-placeholder.mp3",
        mp3Url: "/mock/audio-placeholder.mp3",
        wavUrl: "/mock/audio-placeholder.wav",
        isPublic: true,
        createdAt: new Date().toISOString(),
        duration: s.duration,
        plays: s.plays,
        likes: 0,
        remixes: 0,
    }
}

function formatPlays(n: number): string {
    return formatCount(n)
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const router = useRouter()
    const [prompt, setPrompt] = useState("")
    const [isAudioMenuOpen, setIsAudioMenuOpen] = useState(false)
    const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null)
    const [composerNotice, setComposerNotice] = useState("")
    const [promptNote, setPromptNote] = useState("")
    const audioMenuRef = useRef<HTMLDivElement>(null)
    const audioInputRef = useRef<HTMLInputElement>(null)
    const { playSong, isCurrentSong, isPlaying } = usePlaySong()

    useEffect(() => {
        if (!isAudioMenuOpen) {
            return
        }

        function handlePointerDown(event: PointerEvent) {
            if (
                audioMenuRef.current &&
                !audioMenuRef.current.contains(event.target as Node)
            ) {
                setIsAudioMenuOpen(false)
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsAudioMenuOpen(false)
            }
        }

        document.addEventListener("pointerdown", handlePointerDown)
        document.addEventListener("keydown", handleEscape)

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [isAudioMenuOpen])

    // MOCK: replace with api-client.generateSong({ prompt }) when backend is ready
    function handleCreate() {
        const trimmed = prompt.trim()
        if (!trimmed) {
            setPromptNote("Describe a song idea first.")
            return
        }
        setPromptNote("")
        router.push(`/create?prompt=${encodeURIComponent(trimmed)}`)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleCreate()
        }
    }

    function handlePlaySong(s: CollectionSong) {
        playSong(toSong(s))
    }

    function handleRecordClick() {
        setIsAudioMenuOpen(false)
        setSelectedAudioFile(null)
        setComposerNotice("Recording feature coming soon.")
    }

    function handleUploadClick() {
        setIsAudioMenuOpen(false)
        setComposerNotice("")
        audioInputRef.current?.click()
    }

    function handleAudioFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        if (file) {
            setSelectedAudioFile(file)
            setComposerNotice("")
        }
    }

    function handleRemoveAudioFile() {
        setSelectedAudioFile(null)
        setComposerNotice("")

        if (audioInputRef.current) {
            audioInputRef.current.value = ""
        }
    }

    return (
        <div className="relative min-h-dvh w-full max-w-full min-w-0 overflow-x-hidden bg-charcoal text-sand">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(227,122,44,0.18),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(26,58,92,0.6),transparent_34%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_46%,var(--charcoal)_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(90deg,rgba(237,227,211,0.3)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.25)_1px,transparent_1px)] [background-size:40px_40px]" />

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-5xl min-w-0 px-4 pb-6 pt-4 md:px-6 md:pt-6 lg:pb-8">

                <div className="hidden items-center justify-end lg:flex">
                    <button
                        type="button"
                        aria-label="Search"
                        onClick={() => router.push("/feed")}
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-sand/10 bg-sand/[0.05] px-4 text-sm font-semibold text-sand/40 transition hover:border-sand/18 hover:text-sand/60"
                    >
                        <Search className="size-4" aria-hidden="true" />
                        Search
                    </button>
                </div>

                {/* ── Hero ── */}
                <section className="mx-auto mt-9 max-w-2xl text-center lg:mt-10">
                    <h1 className="text-[2rem] font-black leading-[1.08] tracking-tight text-sand sm:text-[2.6rem] md:text-[3rem]">
                        <span className="lg:hidden">Let&apos;s make a song</span>
                        <span className="hidden lg:inline">Bring your sound to life</span>
                    </h1>

                    {/* Compact prompt composer — single flat card */}
                    <div className="mx-auto mt-5 max-w-xl rounded-xl border border-sand/10 bg-[#211514]/72 shadow-[0_16px_48px_rgba(0,0,0,0.3)] lg:mt-6 lg:bg-charcoal/60">
                        <div className="px-4 pt-3">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe the Balochi song you want to create…"
                                aria-label="Song prompt"
                                rows={1}
                                className="w-full resize-none bg-transparent text-sm leading-6 text-sand outline-none placeholder:text-sand/35"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-1">
                            <div ref={audioMenuRef} className="relative">
                                <button
                                    type="button"
                                    aria-label="Add audio options"
                                    aria-expanded={isAudioMenuOpen}
                                    aria-controls="dashboard-audio-options-menu"
                                    onClick={() => setIsAudioMenuOpen((v) => !v)}
                                    className="flex size-9 items-center justify-center rounded-full text-sand/40 transition hover:bg-sand/8 hover:text-sand/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
                                >
                                    <Plus className="size-5" aria-hidden="true" />
                                </button>
                                {isAudioMenuOpen && (
                                    <AudioOptionsPopover
                                        onRecord={handleRecordClick}
                                        onUpload={handleUploadClick}
                                    />
                                )}
                                <input
                                    ref={audioInputRef}
                                    type="file"
                                    accept="audio/*"
                                    className="hidden"
                                    onChange={handleAudioFileChange}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleCreate}
                                className="inline-flex h-10 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff3ca0,#e37a2c)] px-5 text-sm font-black text-white shadow-[0_12px_32px_rgba(227,122,44,0.25)] transition hover:brightness-110 lg:bg-saffron lg:text-sand lg:hover:bg-terracotta lg:hover:brightness-100"
                            >
                                <AudioWaveform className="size-4" aria-hidden="true" />
                                Create
                            </button>
                        </div>
                        {(selectedAudioFile || composerNotice) && (
                            <div className="px-3 pb-3 text-left">
                                {selectedAudioFile ? (
                                    <div
                                        role="status"
                                        className="inline-flex max-w-full items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-xs font-bold text-sand shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
                                    >
                                        <AudioWaveform className="size-3.5 shrink-0 text-saffron" aria-hidden="true" />
                                        <span className="min-w-0 truncate">{selectedAudioFile.name}</span>
                                        <span className="shrink-0 text-saffron">Mock upload</span>
                                        <button
                                            type="button"
                                            aria-label={`Remove ${selectedAudioFile.name}`}
                                            onClick={handleRemoveAudioFile}
                                            className="-mr-1 flex size-5 shrink-0 items-center justify-center rounded-full text-sand/55 transition hover:bg-sand/10 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                                        >
                                            <X className="size-3.5" aria-hidden="true" />
                                        </button>
                                    </div>
                                ) : (
                                    <p
                                        role="status"
                                        className="inline-flex max-w-full items-center gap-2 rounded-full border border-sand/10 bg-sand/[0.06] px-3 py-1.5 text-xs font-bold text-sand/70"
                                    >
                                        <Mic className="size-3.5 shrink-0 text-saffron" aria-hidden="true" />
                                        {composerNotice}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    {promptNote && (
                        <p role="status" className="mx-auto mt-3 max-w-xl text-center text-xs font-semibold text-saffron">
                            {promptNote}
                        </p>
                    )}
                </section>

                {/* ── Featured collections (horizontal cards) ── */}
                <MobileForYouSection
                    collection={COLLECTIONS[0]}
                    onPlaySong={handlePlaySong}
                    isCurrentSong={isCurrentSong}
                    isPlaying={isPlaying}
                />

                <section className="mt-9 hidden lg:block">
                    <div className="grid gap-4 lg:grid-cols-3">
                        {COLLECTIONS.map((col) => (
                            <CollectionCard
                                key={col.id}
                                collection={col}
                                onPlaySong={handlePlaySong}
                                isCurrentSong={isCurrentSong}
                                isPlaying={isPlaying}
                            />
                        ))}
                    </div>
                </section>

                {/* ── For Every Mood ── */}
                <section className="mt-12 md:mt-16">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-sand sm:text-2xl">
                            <span className="lg:hidden">Curated Collections</span>
                            <span className="hidden lg:inline">For Every Mood</span>
                        </h2>
                        <Link
                            href="/feed"
                            className="inline-flex items-center gap-1 text-sm font-bold text-sand/50 transition hover:text-saffron"
                        >
                            See all
                            <ChevronRight className="size-4" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {MOOD_CARDS.map((mood) => (
                            <MoodCard key={mood.id} mood={mood} />
                        ))}
                    </div>
                </section>

                {/* ── Explore CTA ── */}
                <section className="mt-12 md:mt-16">
                    <Link
                        href="/feed"
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-saffron/20 bg-saffron/[0.07] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.2)] transition hover:border-saffron/35 hover:bg-saffron/[0.1] sm:p-6"
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-saffron/30 bg-saffron/15 text-saffron">
                                <Compass className="size-5" aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-base font-black text-sand sm:text-lg">
                                    Explore more songs on Zahirok
                                </p>
                                <p className="mt-0.5 text-sm font-semibold text-sand/55">
                                    Discover what the community is creating.
                                </p>
                            </div>
                        </div>
                        <ChevronRight
                            className="size-5 shrink-0 text-saffron/60 transition group-hover:translate-x-1 group-hover:text-saffron"
                            aria-hidden="true"
                        />
                    </Link>
                </section>
            </div>
        </div>
    )
}

// ── CollectionCard (horizontal layout) ───────────────────────────────────────

function AudioOptionsPopover({
    onRecord,
    onUpload,
}: {
    onRecord: () => void
    onUpload: () => void
}) {
    return (
        <div
            id="dashboard-audio-options-menu"
            className="absolute bottom-full left-0 z-30 mb-2 w-40 rounded-xl border border-sand/12 bg-[#111113] p-1.5 text-left text-sm font-bold text-sand shadow-[0_18px_44px_rgba(0,0,0,0.45)]"
        >
            <button
                type="button"
                onClick={onRecord}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sand/88 transition hover:bg-sand/10 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            >
                <Mic className="size-4 text-saffron" aria-hidden="true" />
                Record
            </button>
            <button
                type="button"
                onClick={onUpload}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sand/88 transition hover:bg-sand/10 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            >
                <Upload className="size-4 text-saffron" aria-hidden="true" />
                Upload
            </button>
        </div>
    )
}

function MobileForYouSection({
    collection,
    onPlaySong,
    isCurrentSong,
    isPlaying,
}: {
    collection: (typeof COLLECTIONS)[number]
    onPlaySong: (s: CollectionSong) => void
    isCurrentSong: (s: Song) => boolean
    isPlaying: boolean
}) {
    const firstSong = collection.songs[0]

    return (
        <section className="mt-7 lg:hidden">
            <article className="overflow-hidden rounded-2xl border border-sand/10 bg-sand/[0.055] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            if (firstSong) onPlaySong(firstSong)
                        }}
                        aria-label={`Play ${collection.title}`}
                        className="relative grid size-[84px] shrink-0 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-xl"
                    >
                        {collection.collage.map((bg, i) => {
                            const songImg = collection.songs[i % collection.songs.length]?.coverImage
                            return (
                                <span key={i} className={`${bg} relative flex items-center justify-center`}>
                                    {songImg ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={songImg} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                                    ) : (
                                        <Music2 className="size-4 text-sand/35" aria-hidden="true" />
                                    )}
                                </span>
                            )
                        })}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/18">
                            <span className="flex size-10 items-center justify-center rounded-full bg-white/82 text-charcoal shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                                <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                            </span>
                        </span>
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-base font-black text-white">{collection.title}</h2>
                        <p className="mt-1 text-xs font-semibold text-sand/45">{collection.subtitle}</p>
                    </div>
                </div>

                <div className="mt-4 grid gap-2">
                    {collection.songs.map((song) => {
                        const songObj = toSong(song)
                        const isCurrent = isCurrentSong(songObj)
                        const isThisPlaying = isCurrent && isPlaying

                        return (
                            <div key={song.id} className={`flex items-center gap-2.5 rounded-xl p-1.5 ${isCurrent ? "bg-saffron/10" : ""}`}>
                                <div className={`relative size-11 shrink-0 overflow-hidden rounded-lg ${song.color}`}>
                                    {song.coverImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={song.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                                    ) : (
                                        <Music2 className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-sand/40" aria-hidden="true" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onPlaySong(song)}
                                    aria-label={`${isThisPlaying ? "Pause" : "Play"} ${song.title}`}
                                    className={`flex size-8 shrink-0 items-center justify-center rounded-full transition ${isThisPlaying ? "bg-saffron text-charcoal" : "bg-white/[0.08] text-white hover:bg-saffron hover:text-charcoal"}`}
                                >
                                    {isThisPlaying ? (
                                        <Pause className="size-3.5 fill-current" aria-hidden="true" />
                                    ) : (
                                        <Play className="ml-px size-3.5 fill-current" aria-hidden="true" />
                                    )}
                                </button>
                                <div className="min-w-0 flex-1">
                                    <p className={`truncate text-sm font-black leading-tight ${isCurrent ? "text-saffron" : "text-white"}`}>
                                        {song.title}
                                    </p>
                                    <p className="mt-0.5 truncate text-[11px] font-semibold text-sand/45">
                                        {formatPlays(song.plays)} · {song.genre}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    aria-label={`More options for ${song.title}`}
                                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-sand/45 transition hover:bg-white/[0.08] hover:text-white"
                                >
                                    <MoreHorizontal className="size-4" aria-hidden="true" />
                                </button>
                            </div>
                        )
                    })}
                </div>

                <Link
                    href="/feed"
                    className="mt-4 flex h-10 w-full items-center justify-center rounded-full border border-sand/10 text-sm font-black text-white transition hover:border-saffron/35 hover:bg-saffron/10"
                >
                    See more
                </Link>
            </article>
        </section>
    )
}

function CollectionCard({
    collection,
    onPlaySong,
    isCurrentSong,
    isPlaying,
}: {
    collection: (typeof COLLECTIONS)[number]
    onPlaySong: (s: CollectionSong) => void
    isCurrentSong: (s: Song) => boolean
    isPlaying: boolean
}) {
    return (
        <article className="group overflow-hidden rounded-2xl border border-sand/10 bg-sand/[0.06] shadow-[0_16px_48px_rgba(0,0,0,0.25)] transition hover:border-saffron/25">
            {/* Top: collage + play button + title */}
            <div className="flex items-center gap-3 p-3 pb-0">
                {/* 2x2 album art collage */}
                <div className="relative grid size-20 shrink-0 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-lg">
                    {collection.collage.map((bg, i) => {
                        const songImg = collection.songs[i % collection.songs.length]?.coverImage
                        return (
                            <div key={i} className={`${bg} relative flex items-center justify-center`}>
                                {songImg ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={songImg} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                                ) : (
                                    <Music2 className="size-3 text-sand/30" aria-hidden="true" />
                                )}
                            </div>
                        )
                    })}
                    {/* Play overlay */}
                    <button
                        type="button"
                        onClick={() => {
                            if (collection.songs[0]) onPlaySong(collection.songs[0])
                        }}
                        aria-label={`Play ${collection.title}`}
                        className="absolute inset-0 flex items-center justify-center bg-charcoal/20 opacity-0 transition group-hover:opacity-100"
                    >
                        <span className="flex size-9 items-center justify-center rounded-full bg-saffron text-sand shadow-[0_6px_18px_rgba(227,122,44,0.4)]">
                            <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                        </span>
                    </button>
                </div>
                <div className="min-w-0">
                    <h3 className="text-base font-black text-sand">{collection.title}</h3>
                    <p className="mt-0.5 text-xs font-semibold text-sand/40">
                        {collection.subtitle}
                    </p>
                </div>
            </div>

            {/* Song rows */}
            <div className="mt-2 grid gap-0.5 px-3 pb-1">
                {collection.songs.map((song) => {
                    const songObj = toSong(song)
                    const isCurrent = isCurrentSong(songObj)
                    const isThisPlaying = isCurrent && isPlaying

                    return (
                        <div
                            key={song.id}
                            className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition ${isCurrent
                                ? "bg-saffron/10"
                                : "hover:bg-sand/[0.06]"
                                }`}
                        >
                            {/* Mini thumbnail */}
                            <div className={`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md ${song.color}`}>
                                {song.coverImage ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={song.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                                ) : (
                                    <Music2 className="size-3.5 text-sand/40" aria-hidden="true" />
                                )}
                            </div>
                            {/* Play button */}
                            <button
                                type="button"
                                onClick={() => onPlaySong(song)}
                                aria-label={`${isThisPlaying ? "Pause" : "Play"} ${song.title}`}
                                className={`flex size-7 shrink-0 items-center justify-center rounded-full transition ${isThisPlaying
                                    ? "bg-saffron text-sand"
                                    : "bg-sand/8 text-sand/40 hover:bg-saffron hover:text-sand"
                                    }`}
                            >
                                {isThisPlaying ? (
                                    <Pause className="size-3 fill-current" aria-hidden="true" />
                                ) : (
                                    <Play className="ml-px size-3 fill-current" aria-hidden="true" />
                                )}
                            </button>
                            {/* Title + artist */}
                            <div className="min-w-0 flex-1">
                                <p className={`truncate text-sm font-bold leading-tight ${isCurrent ? "text-saffron" : "text-sand"}`}>
                                    {song.title}
                                </p>
                                <p className="truncate text-[11px] font-semibold leading-tight text-sand/35">
                                    {song.artist}
                                </p>
                            </div>
                            {/* Plays + genre badge */}
                            <div className="hidden shrink-0 items-center gap-2 sm:flex">
                                <span className="text-[11px] font-semibold tabular-nums text-sand/30">
                                    <Play className="mr-0.5 inline size-2.5 fill-current align-[-1px]" aria-hidden="true" />
                                    {formatPlays(song.plays)}
                                </span>
                                <span className="rounded-full border border-sand/10 bg-sand/[0.06] px-2 py-0.5 text-[10px] font-bold text-sand/40">
                                    {song.genre}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* See more */}
            <div className="border-t border-sand/8 px-3 py-2.5">
                <Link
                    href="/feed"
                    className="flex w-full items-center justify-center gap-1 text-xs font-bold text-sand/40 transition hover:text-saffron"
                >
                    See more
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                </Link>
            </div>
        </article>
    )
}

// ── MoodCard (landscape, title below) ────────────────────────────────────────

function MoodCard({ mood }: { mood: (typeof MOOD_CARDS)[number] }) {
    return (
        <Link href="/feed" className="group">
            {/* Landscape card */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-sand/10 shadow-[0_12px_36px_rgba(0,0,0,0.2)] transition group-hover:-translate-y-1 group-hover:border-saffron/30">
                <div
                    className="absolute inset-0"
                    style={{ background: mood.gradient }}
                    aria-hidden="true"
                />
                {mood.coverImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={mood.coverImage}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover opacity-40 transition group-hover:opacity-55"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                    />
                )}
                {!mood.coverImage && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]" aria-hidden="true">
                        <Music2 className="size-14" />
                    </div>
                )}
                {/* Hover play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                    <span className="flex size-10 items-center justify-center rounded-full bg-saffron/90 text-sand shadow-[0_8px_20px_rgba(227,122,44,0.35)]">
                        <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                    </span>
                </div>
            </div>
            {/* Title below */}
            <p className="mt-2 text-sm font-bold leading-tight text-sand/70 transition group-hover:text-sand">
                {mood.title}
            </p>
        </Link>
    )
}

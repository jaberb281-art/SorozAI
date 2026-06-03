"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Flag,
    Heart,
    MessageCircle,
    Minus,
    MoreHorizontal,
    Pause,
    Play,
    Plus,
    Repeat2,
    Send,
    Share2,
    ThumbsDown,
    Volume2,
    VolumeX,
    X,
} from "lucide-react"

import type { GenrePreset, Instrument } from "@/lib/types"

type HookItem = {
    id: string
    title: string
    creator: string
    creatorHandle: string
    caption: string
    hashtags: string[]
    songTitle: string
    plays: number
    likes: number
    comments: number
    duration: string
    createdAt: string
    genre: GenrePreset
    instruments: Instrument[]
    mediaClass: string
    thumbClass: string
    /** Optional thumbnail image for the vertical preview card */
    thumbImage?: string
}

const HOOKS: HookItem[] = [
    {
        id: "hook-makran-evening",
        title: "Makran Evening Hook",
        creator: "Shah Baloch",
        creatorHandle: "shahbaloch",
        caption: "A warm Makkuran refrain over sea-wind percussion.",
        hashtags: ["#zahirouk", "#makkuran", "#doholl", "#damboora", "#balochimusic"],
        songTitle: "Makran Evening Hook",
        plays: 530000,
        likes: 4300,
        comments: 246,
        duration: "0:42",
        createdAt: "2026-05-31T16:30:00Z",
        genre: "Zahirok",
        instruments: ["Damboora", "Doholl", "Suroz"],
        mediaClass:
            "bg-[radial-gradient(circle_at_48%_28%,rgba(245,189,82,0.52),transparent_18%),linear-gradient(180deg,rgba(31,78,86,0.95),rgba(11,14,18,0.96)_48%,rgba(92,47,23,0.9))]",
        thumbClass:
            "bg-[linear-gradient(135deg,rgba(13,89,95,0.92),rgba(22,22,25,0.98)),radial-gradient(circle_at_42%_38%,rgba(227,122,44,0.7),transparent_22%)]",
        thumbImage: "/hooks/makran-evening-hook-thumb.png",
    },
    {
        id: "hook-doholl-night",
        title: "Doholl Night",
        creator: "Meeral Gwadar",
        creatorHandle: "meeralgwadar",
        caption: "Doholl hits, soft claps, and a midnight call-and-response.",
        hashtags: ["#zahirouk", "#makkuran", "#doholl", "#coastal", "#balochimusic"],
        songTitle: "Doholl Night",
        plays: 314000,
        likes: 1600,
        comments: 73,
        duration: "0:36",
        createdAt: "2026-05-30T22:15:00Z",
        genre: "Wedding",
        instruments: ["Doholl", "Damboora", "Modern Drums"],
        mediaClass:
            "bg-[radial-gradient(circle_at_52%_34%,rgba(79,214,201,0.72),transparent_16%),linear-gradient(180deg,rgba(20,20,27,1),rgba(23,31,62,0.96)_42%,rgba(7,7,10,1))]",
        thumbClass:
            "bg-[radial-gradient(circle_at_48%_48%,rgba(79,214,201,0.9)_0%,rgba(227,122,44,0.62)_16%,rgba(24,23,42,0.96)_44%,rgba(9,9,12,1)_100%)]",
        thumbImage: "/hooks/wedding-doholl-hook-thumb.png",
    },
    {
        id: "hook-ya-nabi-salawat",
        title: "Ya Nabi Salawat Hook",
        creator: "Bibi Hani",
        creatorHandle: "bibihani",
        caption: "A gentle devotional phrase shaped for Makkuran harmonies.",
        hashtags: ["#zahirouk", "#makkuran", "#naat", "#suroz", "#balochimusic"],
        songTitle: "Ya Nabi Salawat Hook",
        plays: 188000,
        likes: 2800,
        comments: 119,
        duration: "0:50",
        createdAt: "2026-05-29T10:45:00Z",
        genre: "Naat",
        instruments: ["Suroz", "Damboora"],
        mediaClass:
            "bg-[radial-gradient(circle_at_50%_26%,rgba(237,227,211,0.76),transparent_14%),linear-gradient(180deg,rgba(61,41,81,0.98),rgba(13,13,18,0.98)_50%,rgba(103,58,26,0.88))]",
        thumbClass:
            "bg-[linear-gradient(145deg,rgba(67,45,100,0.86),rgba(12,12,15,0.98)),radial-gradient(circle_at_52%_34%,rgba(237,227,211,0.68),transparent_20%)]",
        thumbImage: "/hooks/sufi-dambora-hook-thumb.png",
    },
    {
        id: "hook-coastal-drift",
        title: "Coastal Drift",
        creator: "Rostam Kech",
        creatorHandle: "rostamkech",
        caption: "Slow Damboora pulse with modern bass and beach-fire ambience.",
        hashtags: ["#zahirouk", "#makkuran", "#damboora", "#makran", "#balochimusic"],
        songTitle: "Coastal Drift",
        plays: 92000,
        likes: 940,
        comments: 38,
        duration: "0:44",
        createdAt: "2026-05-28T20:00:00Z",
        genre: "Modern Balochi Pop",
        instruments: ["Damboora", "Bass", "Synth"],
        mediaClass:
            "bg-[radial-gradient(circle_at_45%_30%,rgba(227,122,44,0.72),transparent_14%),linear-gradient(180deg,rgba(14,71,83,0.96),rgba(9,10,14,0.98)_50%,rgba(25,31,54,0.94))]",
        thumbClass:
            "bg-[linear-gradient(135deg,rgba(19,76,90,0.9),rgba(13,13,18,0.98)),radial-gradient(circle_at_60%_28%,rgba(227,122,44,0.62),transparent_20%)]",
    },
]

function formatCount(value: number) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
    return value.toString()
}

/* ── Bottom strip height + gap constants ──────────────────────────────────── */
const STRIP_ZONE = 84 // px from bottom where strip lives (strip h ~66 + bottom-[14px] + breathing room)

export default function HooksPage() {
    const router = useRouter()
    const viewerRef = useRef<HTMLDivElement | null>(null)
    const moreMenuRef = useRef<HTMLDivElement | null>(null)
    const lastWheelAt = useRef(0)
    const [activeIndex, setActiveIndex] = useState(0)
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
    const [isMuted, setIsMuted] = useState(false)
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
    const [hooksNotice, setHooksNotice] = useState<string | null>(null)
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false)
    const [playlistName, setPlaylistName] = useState("")

    const activeHook = HOOKS[activeIndex]
    const isLiked = likedIds.has(activeHook.id)
    const isSaved = savedIds.has(activeHook.id)
    const likes = activeHook.likes + (isLiked ? 1 : 0)

    const showPreviousHook = useCallback(() => {
        setIsPreviewPlaying(false)
        setIsMoreMenuOpen(false)
        setHooksNotice(null)
        setActiveIndex((i) => (i === 0 ? HOOKS.length - 1 : i - 1))
    }, [])

    const showNextHook = useCallback(() => {
        setIsPreviewPlaying(false)
        setIsMoreMenuOpen(false)
        setHooksNotice(null)
        setActiveIndex((i) => (i + 1) % HOOKS.length)
    }, [])

    useEffect(() => {
        if (!isMoreMenuOpen) return

        function handlePointerDown(event: PointerEvent) {
            if (
                moreMenuRef.current &&
                !moreMenuRef.current.contains(event.target as Node)
            ) {
                setIsMoreMenuOpen(false)
            }
        }

        document.addEventListener("pointerdown", handlePointerDown)

        return () => document.removeEventListener("pointerdown", handlePointerDown)
    }, [isMoreMenuOpen])

    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = prev
        }
    }, [])

    useEffect(() => {
        function handleWheel(e: WheelEvent) {
            e.preventDefault()
            if (Math.abs(e.deltaY) < 24) return
            const now = Date.now()
            if (now - lastWheelAt.current < 650) return
            lastWheelAt.current = now
            if (e.deltaY > 0) showNextHook()
            else showPreviousHook()
        }
        const node = viewerRef.current
        node?.addEventListener("wheel", handleWheel, { passive: false })
        return () => {
            node?.removeEventListener("wheel", handleWheel)
        }
    }, [showNextHook, showPreviousHook])

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const t = e.target as HTMLElement | null
            if (t?.isContentEditable) return
            if (e.key === "Escape") {
                setIsMoreMenuOpen(false)
                setIsCommentsOpen(false)
                setIsPlaylistModalOpen(false)
                return
            }
            if (["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(t?.tagName ?? "")) return
            if (e.key === "ArrowDown") {
                e.preventDefault()
                showNextHook()
            }
            if (e.key === "ArrowUp") {
                e.preventDefault()
                showPreviousHook()
            }
            if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault()
                setIsPreviewPlaying((v) => !v)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [showNextHook, showPreviousHook])

    function toggleLiked() {
        setLikedIds((cur) => {
            const next = new Set(cur)
            if (next.has(activeHook.id)) next.delete(activeHook.id)
            else next.add(activeHook.id)
            return next
        })
    }

    function handleMoreAction(notice: string) {
        setHooksNotice(notice)
        setIsMoreMenuOpen(false)
    }

    function handleSaveToPlaylist() {
        setSavedIds((cur) => new Set(cur).add(activeHook.id))
        setHooksNotice("Added to playlist.")
        setIsPlaylistModalOpen(false)
        setPlaylistName("")
    }

    return (
        <div
            ref={viewerRef}
            className="fixed inset-0 z-40 overflow-hidden bg-[#08080a] text-sand md:left-[var(--app-sidebar-width,228px)]"
        >
            {/* Gradient overlays */}
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,transparent_18%,transparent_50%,rgba(0,0,0,0.75)_100%)]" />

            {/* ── TOP LEFT — back + volume ── */}
            <div className="absolute left-5 top-4 z-50 flex items-center gap-2">
                <TopButton ariaLabel="Go back" onClick={() => router.back()}>
                    <ArrowLeft className="size-[18px]" />
                </TopButton>
                <TopButton
                    ariaLabel={isMuted ? "Unmute" : "Mute"}
                    onClick={() => setIsMuted((v) => !v)}
                >
                    {isMuted ? <VolumeX className="size-[18px]" /> : <Volume2 className="size-[18px]" />}
                </TopButton>
            </div>

            {/* ── TOP RIGHT — create hook ── */}
            <Link
                href="/create"
                className="absolute right-5 top-4 z-50 inline-flex h-10 items-center rounded-full border border-white/12 bg-white/[0.06] px-4 text-[13px] font-bold text-white transition hover:bg-white/10"
            >
                Create hook
            </Link>

            {hooksNotice && (
                <p
                    role="status"
                    className="absolute left-1/2 top-5 z-[70] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full border border-saffron/25 bg-[#18181b]/95 px-4 py-2 text-xs font-bold text-saffron shadow-[0_16px_44px_rgba(0,0,0,0.4)]"
                >
                    {hooksNotice}
                </p>
            )}

            {/* ── CENTER MEDIA CARD ── */}
            {/* Centered in the zone between top bar (56px) and bottom strip zone */}
            <div
                className="absolute inset-x-0 z-10 flex items-center justify-center"
                style={{ top: 56, bottom: STRIP_ZONE }}
            >
                <div
                    className={`relative aspect-[9/16] w-[min(380px,calc((100dvh_-_200px)*9/16))] max-h-full overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.55)] ${activeHook.mediaClass}`}
                >
                    {/* Thumbnail image (if available) or decorative layers */}
                    {activeHook.thumbImage ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={activeHook.thumbImage}
                                alt={`${activeHook.title} preview`}
                                className="absolute inset-0 h-full w-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.18),transparent_14%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%,rgba(0,0,0,0.32))]" />
                            <div className="absolute left-1/2 top-[22%] h-24 w-16 -translate-x-1/2 rounded-full border border-white/18 bg-white/10 blur-[1px]" />
                            <div className="absolute left-1/2 top-[37%] h-52 w-32 -translate-x-1/2 rounded-[42%_42%_26%_26%] border border-white/12 bg-black/24" />
                            <div className="absolute left-[31%] top-[46%] h-36 w-2 rotate-[24deg] rounded-full bg-saffron/55 shadow-[0_0_30px_rgba(227,122,44,0.34)]" />
                            <div className="absolute right-[31%] top-[44%] h-40 w-2 -rotate-[18deg] rounded-full bg-white/28" />
                        </>
                    )}
                    <div className="absolute bottom-10 left-8 right-8 h-20 rounded-full bg-black/25 blur-2xl" />

                    {/* Play/pause */}
                    <button
                        type="button"
                        aria-label={isPreviewPlaying ? "Pause preview" : "Play preview"}
                        onClick={() => setIsPreviewPlaying((v) => !v)}
                        className="absolute left-1/2 top-1/2 inline-flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/40 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition hover:scale-105 hover:bg-black/55"
                    >
                        {isPreviewPlaying ? (
                            <Pause className="size-7" />
                        ) : (
                            <Play className="ml-1 size-7 fill-current" />
                        )}
                    </button>

                </div>
            </div>

            {/* ── LEFT METADATA ── */}
            <div
                className="absolute left-5 z-20 max-w-[min(460px,calc(50%-200px))] min-w-[200px] sm:left-6"
                style={{ bottom: STRIP_ZONE + 8 }}
            >
                <div className="flex items-center gap-2.5">
                    <div className="size-9 shrink-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f2d1aa_0%,#e37a2c_36%,#2f8f9a_100%)] shadow-[0_2px_8px_rgba(0,0,0,0.3)]" />
                    <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold leading-tight text-white">{activeHook.creator}</p>
                        <p className="text-[11px] text-sand/45">@{activeHook.creatorHandle}</p>
                    </div>
                    <button
                        type="button"
                        className="ml-0.5 h-[26px] shrink-0 rounded-full border border-white/16 px-3 text-[11px] font-bold text-white transition hover:bg-white/[0.06]"
                    >
                        Follow
                    </button>
                </div>
                <p className="mt-2 text-[14px] font-semibold leading-[1.45] text-white line-clamp-2">
                    {activeHook.caption}
                </p>
                <p className="mt-1 text-[12px] leading-[1.4] text-sand/50 line-clamp-1 sm:line-clamp-2">
                    {activeHook.hashtags.join(" ")}
                </p>
            </div>

            {/* ── RIGHT ACTION RAIL ── */}
            {/* Centered in same vertical zone as media card, offset right */}
            <div
                className={`absolute right-3 z-30 flex flex-col items-center justify-center gap-2 transition-[right] sm:right-4 ${
                    isCommentsOpen ? "lg:right-[410px]" : "lg:right-5"
                }`}
                style={{ top: 56, bottom: STRIP_ZONE }}
            >
                <RailAction ariaLabel="Previous hook" onClick={showPreviousHook} icon={<ChevronUp className="size-5" />} />
                <RailAction ariaLabel="Next hook" onClick={showNextHook} icon={<ChevronDown className="size-5" />} />

                <div className="h-1.5" />

                <RailLink href="/create" label="REMIX" icon={<Repeat2 className="size-[18px]" />} />
                <RailButton
                    ariaLabel={isLiked ? "Unlike" : "Like"}
                    label={formatCount(likes)}
                    onClick={toggleLiked}
                    active={isLiked}
                    icon={<Heart className={`size-[18px] ${isLiked ? "fill-current" : ""}`} />}
                />
                <RailButton
                    ariaLabel="Comments"
                    label={formatCount(activeHook.comments)}
                    onClick={() => setIsCommentsOpen(true)}
                    icon={<MessageCircle className="size-[18px]" />}
                />
                <RailButton
                    ariaLabel="Share"
                    label="SHARE"
                    onClick={() => setHooksNotice("Share link copied.")}
                    icon={<Share2 className="size-[18px]" />}
                />
                <div ref={moreMenuRef} className="relative">
                    <RailButton
                        ariaLabel="More options"
                        onClick={() => setIsMoreMenuOpen((value) => !value)}
                        active={isMoreMenuOpen}
                        icon={<MoreHorizontal className="size-[18px]" />}
                    />
                    {isMoreMenuOpen && (
                        <HookMoreMenu
                            onHideCreator={() => handleMoreAction("Creator hidden for this session.")}
                            onReport={() => handleMoreAction("Report submitted for review.")}
                            onNotInterested={() => handleMoreAction("We'll show fewer like this.")}
                        />
                    )}
                </div>
            </div>

            {/* ── BOTTOM SONG STRIP ── */}
            <div className="absolute bottom-3 left-3 right-3 z-20 sm:bottom-3.5 sm:left-5 sm:right-5">
                <div className="mx-auto flex h-[64px] max-w-[1080px] items-center gap-2.5 rounded-[18px] border border-white/10 bg-white/[0.06] px-2 pr-2.5 backdrop-blur-md sm:gap-3 sm:px-3 sm:pr-3">
                    {/* Thumbnail / play */}
                    <button
                        type="button"
                        aria-label={isPreviewPlaying ? "Pause" : "Play"}
                        onClick={() => setIsPreviewPlaying((v) => !v)}
                        className={`relative size-10 shrink-0 overflow-hidden rounded-full sm:size-11 ${activeHook.thumbClass}`}
                    >
                        <span className="absolute inset-0 bg-black/20" />
                        <span className="absolute inset-0 flex items-center justify-center text-white">
                            {isPreviewPlaying ? (
                                <Pause className="size-4" />
                            ) : (
                                <Play className="ml-0.5 size-4 fill-current" />
                            )}
                        </span>
                    </button>

                    {/* Song info */}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold leading-tight text-white">{activeHook.songTitle}</p>
                        <p className="mt-0.5 truncate text-[11px] leading-tight text-sand/50">
                            ▸ {formatCount(activeHook.plays)} · {activeHook.creator}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                        <button
                            type="button"
                            aria-pressed={isSaved}
                            onClick={() => setIsPlaylistModalOpen(true)}
                            className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition sm:h-9 sm:px-4 sm:text-[13px] ${
                                isSaved
                                    ? "bg-saffron text-charcoal"
                                    : "bg-white/12 text-white hover:bg-white/18"
                            }`}
                        >
                            <Plus className="size-3.5" />
                            {isSaved ? "SAVED" : "SAVE"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 z-30 h-[3px] bg-white/8">
                <div className="h-full w-1/3 bg-saffron/70 transition-all" />
            </div>

            {isCommentsOpen && (
                <CommentsPanel
                    hook={activeHook}
                    onClose={() => setIsCommentsOpen(false)}
                />
            )}

            {isPlaylistModalOpen && (
                <AddToPlaylistModal
                    playlistName={playlistName}
                    setPlaylistName={setPlaylistName}
                    onClose={() => setIsPlaylistModalOpen(false)}
                    onSave={handleSaveToPlaylist}
                />
            )}
        </div>
    )
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function HookMoreMenu({
    onHideCreator,
    onReport,
    onNotInterested,
}: {
    onHideCreator: () => void
    onReport: () => void
    onNotInterested: () => void
}) {
    return (
        <div className="absolute right-full top-0 z-[80] mr-3 w-64 rounded-xl border border-white/12 bg-[#1f1f22] p-2 text-sm font-bold text-sand shadow-[0_18px_52px_rgba(0,0,0,0.5)]">
            <button
                type="button"
                onClick={onHideCreator}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            >
                <Minus className="size-4 text-sand/70 transition group-hover:text-saffron" aria-hidden="true" />
                Hide Creator
            </button>
            <button
                type="button"
                onClick={onReport}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            >
                <Flag className="size-4 text-sand/70 transition group-hover:text-saffron" aria-hidden="true" />
                Report Inappropriate
            </button>
            <button
                type="button"
                onClick={onNotInterested}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            >
                <ThumbsDown className="size-4 text-sand/70 transition group-hover:text-saffron" aria-hidden="true" />
                Not Interested
            </button>
        </div>
    )
}

function CommentsPanel({
    hook,
    onClose,
}: {
    hook: HookItem
    onClose: () => void
}) {
    const comments = [
        {
            id: "comment-1",
            name: "Mahrang360",
            time: "18w ago",
            body: "This hook is warm and cinematic. The Damboora tone sits beautifully with the vocal.",
            likes: 23,
        },
        {
            id: "comment-2",
            name: hook.creator,
            time: "12w ago",
            body: "I appreciate you listening.",
            likes: 5,
        },
        {
            id: "comment-3",
            name: "Harley Maxwell",
            time: "22w ago",
            body: "That melody feels like a sunset drive along the coast.",
            likes: 20,
        },
    ]

    return (
        <aside className="absolute bottom-3 right-3 top-3 z-[65] flex w-[min(390px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#19191c] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <h2 className="text-xl font-black text-white">Comments</h2>
                <button
                    type="button"
                    aria-label="Close comments"
                    onClick={onClose}
                    className="inline-flex size-11 items-center justify-center rounded-full bg-white/[0.06] text-sand/70 transition hover:bg-white/[0.1] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                >
                    <X className="size-5" aria-hidden="true" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
                <label className="flex min-h-14 items-center gap-3 rounded-full bg-white/[0.07] px-4">
                    <span className="size-9 shrink-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f2d1aa_0%,#e37a2c_36%,#2f8f9a_100%)]" />
                    <span className="sr-only">Write a comment</span>
                    <input
                        type="text"
                        placeholder="Write a comment"
                        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-sand outline-none placeholder:text-sand/55"
                    />
                    <Send className="size-4 text-sand/45" aria-hidden="true" />
                </label>

                <div className="mt-7 flex items-center justify-between">
                    <p className="text-lg font-black text-white">{formatCount(hook.comments)} Comments</p>
                    <button type="button" className="text-sm font-bold text-sand/70 transition hover:text-white">
                        Sort by
                    </button>
                </div>

                <div className="mt-5 grid gap-5">
                    {comments.map((comment, index) => (
                        <article key={comment.id} className="flex gap-3">
                            <div className={`size-9 shrink-0 rounded-full ${index === 1 ? "bg-[radial-gradient(circle_at_30%_30%,#f2d1aa_0%,#e37a2c_36%,#2f8f9a_100%)]" : "bg-white/12"}`} />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-black text-white">{comment.name}</p>
                                    <span className="text-xs font-semibold text-sand/45">{comment.time}</span>
                                    <span className="text-xs font-black text-[#ff3ca0]">on Song</span>
                                </div>
                                <p className="mt-1 text-sm font-semibold leading-6 text-sand/75">{comment.body}</p>
                                <button type="button" className="mt-1 text-xs font-bold text-sand/45 transition hover:text-white">
                                    Reply
                                </button>
                            </div>
                            <div className="flex shrink-0 flex-col items-center gap-1 text-xs font-black text-sand/55">
                                <Heart className="size-4" aria-hidden="true" />
                                {comment.likes}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </aside>
    )
}

function AddToPlaylistModal({
    playlistName,
    setPlaylistName,
    onClose,
    onSave,
}: {
    playlistName: string
    setPlaylistName: (value: string) => void
    onClose: () => void
    onSave: () => void
}) {
    return (
        <div className="absolute inset-0 z-[90] flex items-center justify-center bg-black/72 px-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-[#202024] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.65)] sm:p-7">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-3xl font-black text-white">Add to Playlist</h2>
                    <button
                        type="button"
                        aria-label="Close add to playlist"
                        onClick={onClose}
                        className="inline-flex size-12 items-center justify-center rounded-full bg-white/[0.06] text-sand/70 transition hover:bg-white/[0.1] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                    >
                        <X className="size-5" aria-hidden="true" />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onSave}
                    className="mt-7 flex w-full items-center gap-4 rounded-lg bg-white/[0.055] p-3 text-left transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                >
                    <span className="flex size-12 items-center justify-center rounded-md bg-[radial-gradient(circle_at_30%_30%,#29d44f_0%,#1580ff_70%)] text-white">
                        <Heart className="size-5 fill-current" aria-hidden="true" />
                    </span>
                    <span className="text-lg font-black text-white">Liked Songs</span>
                </button>

                <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <label>
                        <span className="sr-only">Playlist name</span>
                        <input
                            type="text"
                            value={playlistName}
                            onChange={(event) => setPlaylistName(event.target.value)}
                            placeholder="Playlist Name"
                            className="h-14 w-full rounded-lg border border-white/12 bg-transparent px-4 text-base font-semibold text-white outline-none placeholder:text-sand/45 focus:border-saffron/45"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={onSave}
                        className="h-14 rounded-lg border border-white/12 px-5 text-base font-black text-white transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                    >
                        Create Playlist
                    </button>
                </div>
            </div>
        </div>
    )
}

function TopButton({
    ariaLabel,
    onClick,
    children,
}: {
    ariaLabel: string
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={onClick}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition hover:bg-white/12"
        >
            {children}
        </button>
    )
}

function RailAction({
    ariaLabel,
    icon,
    onClick,
}: {
    ariaLabel: string
    icon: React.ReactNode
    onClick?: () => void
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={onClick}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition hover:bg-white/12"
        >
            {icon}
        </button>
    )
}

function RailButton({
    ariaLabel,
    icon,
    label,
    active,
    onClick,
}: {
    ariaLabel: string
    icon: React.ReactNode
    label?: string
    active?: boolean
    onClick?: () => void
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            aria-pressed={active}
            onClick={onClick}
            className={`group flex flex-col items-center gap-0.5 text-[10px] font-bold uppercase tracking-wide transition ${
                active ? "text-saffron" : "text-white"
            }`}
        >
            <span className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition group-hover:bg-white/12">
                {icon}
            </span>
            {label && <span className="mt-px">{label}</span>}
        </button>
    )
}

function RailLink({
    href,
    label,
    icon,
}: {
    href: string
    label: string
    icon: React.ReactNode
}) {
    return (
        <Link
            href={href}
            className="group flex flex-col items-center gap-0.5 text-[10px] font-bold uppercase tracking-wide text-white transition"
        >
            <span className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition group-hover:bg-white/12">
                {icon}
            </span>
            <span className="mt-px">{label}</span>
        </Link>
    )
}

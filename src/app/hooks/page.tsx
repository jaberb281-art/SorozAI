"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Pause,
    Play,
    Plus,
    Repeat2,
    Share2,
    Volume2,
    VolumeX,
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
    const lastWheelAt = useRef(0)
    const [activeIndex, setActiveIndex] = useState(0)
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
    const [isMuted, setIsMuted] = useState(false)
    const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)

    const activeHook = HOOKS[activeIndex]
    const isLiked = likedIds.has(activeHook.id)
    const isSaved = savedIds.has(activeHook.id)
    const likes = activeHook.likes + (isLiked ? 1 : 0)

    const showPreviousHook = useCallback(() => {
        setActiveIndex((i) => (i === 0 ? HOOKS.length - 1 : i - 1))
    }, [])

    const showNextHook = useCallback(() => {
        setActiveIndex((i) => (i + 1) % HOOKS.length)
    }, [])

    useEffect(() => {
        setIsPreviewPlaying(false)
    }, [activeIndex])

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

    function toggleSaved() {
        setSavedIds((cur) => {
            const next = new Set(cur)
            if (next.has(activeHook.id)) next.delete(activeHook.id)
            else next.add(activeHook.id)
            return next
        })
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

                    {/* Hook indicator dots */}
                    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                        {HOOKS.map((_, i) => (
                            <span
                                key={i}
                                className={`size-1.5 rounded-full transition-all ${
                                    i === activeIndex ? "w-4 bg-saffron" : "bg-white/40"
                                }`}
                            />
                        ))}
                    </div>
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
                className="absolute right-3 z-30 flex flex-col items-center justify-center gap-2 sm:right-4 lg:right-5"
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
                    icon={<MessageCircle className="size-[18px]" />}
                />
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
                        <StripButton ariaLabel="Share hook">
                            <Share2 className="size-[15px]" />
                        </StripButton>
                        <StripButton ariaLabel="More options">
                            <MoreHorizontal className="size-[15px]" />
                        </StripButton>
                        <button
                            type="button"
                            aria-pressed={isSaved}
                            onClick={toggleSaved}
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
        </div>
    )
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

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

function StripButton({
    ariaLabel,
    children,
}: {
    ariaLabel: string
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            className="inline-flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/18 sm:size-9"
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

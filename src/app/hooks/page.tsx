"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
    ArrowLeft,
    Bookmark,
    ChevronDown,
    ChevronUp,
    Copy,
    Download,
    Heart,
    Pause,
    Play,
    Plus,
    Repeat2,
    Share2,
    X,
} from "lucide-react"

import { getDemoImage } from "@/lib/demo-images"
import { DemoVideoBackground } from "@/components/media/demo-video"

type Clip = {
    id: string
    title: string
    creator: string
    prompt: string
    tags: string[]
    instrumentTags: string[]
    duration: number
    audioUrl?: string
    imageUrl?: string
    gradientFallback: string
    createdAt: string
    waveformData?: number[]
}

const MOCK_CLIPS: Clip[] = [
    {
        id: "clip-1",
        title: "Makran Evening Hook",
        creator: "Shah Baloch",
        prompt: "A warm Makkuran refrain over sea-wind percussion.",
        tags: ["soroz", "makkuran", "doholl", "damboora", "balochim"],
        instrumentTags: ["doholl", "damboora"],
        duration: 107,
        gradientFallback: "linear-gradient(135deg, #1a0a0a 0%, #3a2010 100%)",
        imageUrl: getDemoImage(0),
        createdAt: "2026-06-09T10:00:00.000Z",
    },
    {
        id: "clip-2",
        title: "Wedding Doholl Step",
        creator: "Meeral Gwadar",
        prompt: "Driving Doholl rhythm for a coastal wedding celebration, fast energy.",
        tags: ["soroz", "wedding", "doholl", "celebration", "makkuran"],
        instrumentTags: ["doholl"],
        duration: 85,
        gradientFallback: "linear-gradient(135deg, #2a0a0a 0%, #4a2010 100%)",
        imageUrl: getDemoImage(1),
        createdAt: "2026-06-09T09:30:00.000Z",
    },
    {
        id: "clip-3",
        title: "Sufi Dambora Phrase",
        creator: "Noor Dehwar",
        prompt: "Dambora melody under a single devotional male voice, slow and meditative.",
        tags: ["soroz", "sufi", "damboora", "vocal", "spiritual"],
        instrumentTags: ["damboora"],
        duration: 132,
        gradientFallback: "linear-gradient(135deg, #0a1a2a 0%, #1a2a4a 100%)",
        imageUrl: getDemoImage(2),
        createdAt: "2026-06-09T08:45:00.000Z",
    },
    {
        id: "clip-4",
        title: "Coastal Liko Drift",
        creator: "Azim Dashti",
        prompt: "Suroz over a low coastal drone, late evening, no percussion.",
        tags: ["soroz", "suroz", "coastal", "ambient", "instrumental"],
        instrumentTags: ["suroz"],
        duration: 98,
        gradientFallback: "linear-gradient(135deg, #0a1a1a 0%, #1a3a3a 100%)",
        imageUrl: getDemoImage(3),
        createdAt: "2026-06-09T07:20:00.000Z",
    },
    {
        id: "clip-5",
        title: "Turbat Night Call",
        creator: "Zareena Sajid",
        prompt: "Female Balochi vocal with Rabab accompaniment, yearning and slow.",
        tags: ["soroz", "vocal", "rabab", "balochi", "female"],
        instrumentTags: ["rabab"],
        duration: 118,
        gradientFallback: "linear-gradient(135deg, #1a0a2a 0%, #2a1a4a 100%)",
        imageUrl: getDemoImage(4),
        createdAt: "2026-06-09T06:10:00.000Z",
    },
]

const KNOWN_INSTRUMENTS = new Set([
    "dambora",
    "damboora",
    "suroz",
    "duholl",
    "doholl",
    "rabab",
    "benju",
    "tanburag",
])

function formatClock(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function buildRemixHref(clipId: string): string {
    return `/create?ref=${clipId}`
}

function buildTagHref(tag: string, instrumentTags: string[]): string {
    const normalized = tag.toLowerCase()
    if (instrumentTags.includes(normalized) || KNOWN_INSTRUMENTS.has(normalized)) {
        return `/feed?instrument=${encodeURIComponent(normalized)}`
    }
    return `/feed?tag=${encodeURIComponent(normalized)}`
}

export default function HooksPage() {
    const router = useRouter()
    const viewerRef = useRef<HTMLDivElement | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const touchStartY = useRef<number | null>(null)
    const lastWheelAt = useRef(0)

    const [activeIndex, setActiveIndex] = useState(0)
    const [slideDirection, setSlideDirection] = useState<1 | -1>(1)
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [notice, setNotice] = useState<string | null>(null)
    const [shareOpen, setShareOpen] = useState(false)

    const activeClip = MOCK_CLIPS[activeIndex]
    const isSaved = savedIds.has(activeClip.id)
    const isLiked = likedIds.has(activeClip.id)
    const visibleTags = activeClip.tags.slice(0, 5)
    const progress = activeClip.duration > 0 ? currentTime / activeClip.duration : 0

    const showPreviousClip = useCallback(() => {
        setSlideDirection(-1)
        setActiveIndex((index) => (index === 0 ? MOCK_CLIPS.length - 1 : index - 1))
    }, [])

    const showNextClip = useCallback(() => {
        setSlideDirection(1)
        setActiveIndex((index) => (index + 1) % MOCK_CLIPS.length)
    }, [])

    const notify = useCallback((message: string) => {
        setNotice(message)
        window.setTimeout(() => setNotice(null), 2600)
    }, [])

    const togglePlayback = useCallback(() => {
        const audio = audioRef.current
        if (!audio) return

        if (audio.paused) {
            void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
        } else {
            audio.pause()
            setIsPlaying(false)
        }
    }, [])

    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = previousOverflow
            audioRef.current?.pause()
        }
    }, [])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        setCurrentTime(0)
        audio.currentTime = 0
        const playPromise = audio.play()
        playPromise
            ?.then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false))
    }, [activeIndex, activeClip.id])

    useEffect(() => {
        const node = viewerRef.current
        if (!node) return

        function handleWheel(event: WheelEvent) {
            event.preventDefault()
            if (Math.abs(event.deltaY) < 24) return
            const now = Date.now()
            if (now - lastWheelAt.current < 650) return
            lastWheelAt.current = now
            if (event.deltaY > 0) showNextClip()
            else showPreviousClip()
        }

        node.addEventListener("wheel", handleWheel, { passive: false })
        return () => node.removeEventListener("wheel", handleWheel)
    }, [showNextClip, showPreviousClip])

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const target = event.target as HTMLElement | null
            if (target?.isContentEditable) return
            if (["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target?.tagName ?? "")) return

            if (event.key === "ArrowDown") {
                event.preventDefault()
                showNextClip()
            }
            if (event.key === "ArrowUp") {
                event.preventDefault()
                showPreviousClip()
            }
            if (event.key === " " || event.code === "Space") {
                event.preventDefault()
                togglePlayback()
            }
            if (event.key === "Escape" && shareOpen) {
                setShareOpen(false)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [shareOpen, showNextClip, showPreviousClip, togglePlayback])

    function handleSeek(clientX: number, rect: DOMRect) {
        const audio = audioRef.current
        if (!audio || activeClip.duration <= 0) return

        const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
        audio.currentTime = ratio * activeClip.duration
        setCurrentTime(audio.currentTime)
    }

    function handleTouchStart(event: React.TouchEvent) {
        touchStartY.current = event.touches[0]?.clientY ?? null
    }

    function handleTouchEnd(event: React.TouchEvent) {
        if (touchStartY.current == null) return
        const delta = touchStartY.current - (event.changedTouches[0]?.clientY ?? touchStartY.current)
        touchStartY.current = null
        if (Math.abs(delta) < 48) return
        if (delta > 0) showNextClip()
        else showPreviousClip()
    }

    function toggleLike() {
        setLikedIds((current) => {
            const next = new Set(current)
            if (next.has(activeClip.id)) {
                next.delete(activeClip.id)
            } else {
                next.add(activeClip.id)
            }
            return next
        })
    }

    function toggleSave() {
        setSavedIds((current) => {
            const next = new Set(current)
            if (next.has(activeClip.id)) {
                next.delete(activeClip.id)
                notify("Removed from Saved.")
            } else {
                next.add(activeClip.id)
                notify("Saved to your library.")
            }
            return next
        })
    }

    async function copyShareLink() {
        const origin = typeof window !== "undefined" ? window.location.origin : ""
        const url = `${origin}/hooks?clip=${activeClip.id}`
        try {
            await navigator.clipboard.writeText(url)
            notify("Link copied to clipboard.")
        } catch {
            notify("Could not copy link.")
        }
        setShareOpen(false)
    }

    async function shareToWhatsApp() {
        const origin = typeof window !== "undefined" ? window.location.origin : ""
        const text = `${activeClip.title} on Soroz — ${activeClip.prompt} ${origin}/hooks?clip=${activeClip.id}`
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer")
        setShareOpen(false)
    }

    async function shareToInstagram() {
        await copyShareLink()
        notify("Link copied — paste it in your Instagram story or bio.")
    }

    function downloadArtwork() {
        if (!activeClip.imageUrl) {
            notify("Artwork download is available when an image is attached.")
            setShareOpen(false)
            return
        }

        const link = document.createElement("a")
        link.href = activeClip.imageUrl
        link.download = `${activeClip.id}.mp4`
        link.click()
        notify("Downloading artwork…")
        setShareOpen(false)
    }

    return (
        <div className="clip-page fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-black text-sand lg:left-[var(--app-sidebar-width,248px)] lg:w-auto">
            <audio
                ref={audioRef}
                src={activeClip.audioUrl ?? "/mock/audio-placeholder.mp3"}
                preload="auto"
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onEnded={() => {
                    setIsPlaying(false)
                    showNextClip()
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            <Link
                href="/feed"
                aria-label="Back to Discover"
                className="absolute left-4 top-4 z-50 inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60 lg:top-5"
            >
                <ArrowLeft className="size-[18px]" aria-hidden="true" />
            </Link>

            <div className="absolute right-4 top-4 z-50 flex items-center gap-2 lg:top-5">
                <div className="hidden items-center gap-1 sm:flex">
                    <NavArrow ariaLabel="Previous clip" onClick={showPreviousClip}>
                        <ChevronUp className="size-4" />
                    </NavArrow>
                    <NavArrow ariaLabel="Next clip" onClick={showNextClip}>
                        <ChevronDown className="size-4" />
                    </NavArrow>
                </div>
                <Link
                    href="/create"
                    className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/12 bg-white/10 px-4 text-[13px] font-black text-white backdrop-blur-sm transition hover:bg-white/16"
                >
                    <Plus className="size-4" aria-hidden="true" />
                    Create
                </Link>
            </div>

            {notice ? (
                <p
                    role="status"
                    className="absolute left-1/2 top-16 z-[70] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full border border-saffron/25 bg-[#18181b]/95 px-4 py-2 text-xs font-bold text-saffron shadow-[0_16px_44px_rgba(0,0,0,0.4)]"
                >
                    {notice}
                </p>
            ) : null}

            <div
                ref={viewerRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="clip-container relative h-dvh w-full max-w-none overflow-hidden max-[499px]:rounded-none min-[500px]:aspect-[9/16] min-[500px]:h-[100vh] min-[500px]:max-w-[430px] min-[500px]:rounded-xl"
            >
            <AnimatePresence mode="wait" custom={slideDirection}>
                <motion.div
                    key={activeClip.id}
                    custom={slideDirection}
                    initial={{ opacity: 0, y: slideDirection > 0 ? "8%" : "-8%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: slideDirection > 0 ? "-8%" : "8%" }}
                    transition={{ duration: 0.42, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <div
                        className="absolute inset-0 z-0"
                        style={{ background: activeClip.gradientFallback }}
                        aria-hidden="true"
                    />
                    {activeClip.imageUrl ? (
                        <DemoVideoBackground
                            src={activeClip.imageUrl}
                            videoKey={activeClip.id}
                            className="clip-artwork absolute inset-0 z-0 h-full w-full object-cover"
                        />
                    ) : null}
                    <div
                        className="clip-overlay pointer-events-none absolute inset-0 z-[1]"
                        style={{
                            background:
                                "linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.85) 100%)",
                        }}
                        aria-hidden="true"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-3 sm:right-5">
                <RailAction
                    ariaLabel="Remix this clip"
                    label="REMIX"
                    primary
                    icon={<Repeat2 className="size-[18px]" />}
                    onClick={() => router.push(buildRemixHref(activeClip.id))}
                />
                <RailAction
                    ariaLabel={isLiked ? "Unlike clip" : "Like clip"}
                    label="LIKE"
                    active={isLiked}
                    icon={
                        <Heart
                            className={`size-[18px] ${isLiked ? "fill-current" : ""}`}
                            aria-hidden="true"
                        />
                    }
                    onClick={toggleLike}
                />
                <RailAction
                    ariaLabel={isSaved ? "Unsave clip" : "Save clip"}
                    label="SAVE"
                    active={isSaved}
                    icon={
                        <Bookmark
                            className={`size-[18px] ${isSaved ? "fill-current" : ""}`}
                            aria-hidden="true"
                        />
                    }
                    onClick={toggleSave}
                />
                <RailAction
                    ariaLabel="Share clip"
                    label="SHARE"
                    icon={<Share2 className="size-[18px]" />}
                    onClick={() => setShareOpen(true)}
                />
            </div>

            <div className="absolute bottom-[72px] left-4 right-20 z-40 max-w-lg sm:bottom-[80px] sm:left-6 sm:right-24">
                <p className="text-base font-semibold text-white">{activeClip.creator}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/85">
                    <span className="mr-2 rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-sand/55">
                        prompt
                    </span>
                    {activeClip.prompt}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {visibleTags.map((tag) => {
                        const isInstrument =
                            activeClip.instrumentTags.includes(tag) ||
                            KNOWN_INSTRUMENTS.has(tag.toLowerCase())

                        return (
                            <Link
                                key={tag}
                                href={buildTagHref(tag, activeClip.instrumentTags)}
                                className={`rounded-full px-2.5 py-1 text-xs font-black transition ${
                                    isInstrument
                                        ? "bg-saffron/15 text-saffron hover:bg-saffron hover:text-charcoal"
                                        : "bg-white/10 text-white/75 hover:bg-white/16 hover:text-white"
                                }`}
                            >
                                #{tag}
                            </Link>
                        )
                    })}
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-50 h-12 border-t border-white/8 bg-black/60 backdrop-blur-md">
                <div className="mx-auto flex h-full max-w-[1280px] items-center gap-3 px-4">
                    <button
                        type="button"
                        onClick={togglePlayback}
                        aria-label={isPlaying ? "Pause clip" : "Play clip"}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-saffron hover:text-charcoal"
                    >
                        {isPlaying ? (
                            <Pause className="size-4 fill-current" aria-hidden="true" />
                        ) : (
                            <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                        )}
                    </button>

                    <div className="min-w-0 flex-1">
                        <button
                            type="button"
                            aria-label="Seek in clip"
                            className="clip-progress-bar relative w-full cursor-pointer"
                            onClick={(event) => handleSeek(event.clientX, event.currentTarget.getBoundingClientRect())}
                            onKeyDown={(event) => {
                                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                                    event.preventDefault()
                                    const audio = audioRef.current
                                    if (!audio) return
                                    const delta = event.key === "ArrowRight" ? 5 : -5
                                    audio.currentTime = Math.min(
                                        activeClip.duration,
                                        Math.max(0, audio.currentTime + delta),
                                    )
                                }
                            }}
                        >
                            <ClipProgressBar progress={progress} />
                        </button>
                        <div className="mt-0.5 flex items-center justify-between gap-3">
                            <p className="truncate text-[11px] font-bold text-white/80">
                                {activeClip.title}
                            </p>
                            <p className="shrink-0 text-[11px] font-black tabular-nums text-sand/55">
                                {formatClock(currentTime)} / {formatClock(activeClip.duration)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {shareOpen ? (
                <ShareSheet
                    clip={activeClip}
                    onClose={() => setShareOpen(false)}
                    onCopyLink={copyShareLink}
                    onDownloadArtwork={downloadArtwork}
                    onShareInstagram={shareToInstagram}
                    onShareWhatsApp={shareToWhatsApp}
                />
            ) : null}
        </div>
    )
}

function ClipProgressBar({ progress }: { progress: number }) {
    return (
        <div
            className="clip-progress-bar h-[3px] w-full rounded-[2px] bg-white/20"
            aria-hidden="true"
        >
            <div
                className="clip-progress-fill h-full rounded-[2px] bg-saffron transition-[width] duration-100 ease-linear"
                style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
            />
        </div>
    )
}

function ShareSheet({
    clip,
    onClose,
    onCopyLink,
    onDownloadArtwork,
    onShareInstagram,
    onShareWhatsApp,
}: {
    clip: Clip
    onClose: () => void
    onCopyLink: () => void
    onDownloadArtwork: () => void
    onShareInstagram: () => void
    onShareWhatsApp: () => void
}) {
    return (
        <div className="absolute inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
            <div
                role="dialog"
                aria-labelledby="share-sheet-title"
                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#19191c] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            >
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 id="share-sheet-title" className="text-lg font-black text-white">
                            Share clip
                        </h2>
                        <p className="mt-1 text-sm font-semibold text-sand/55">{clip.title}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close share sheet"
                        className="inline-flex size-9 items-center justify-center rounded-full bg-white/8 text-sand/70 transition hover:text-white"
                    >
                        <X className="size-4" aria-hidden="true" />
                    </button>
                </div>

                <div className="mt-4 grid gap-2">
                    <ShareOption icon={<Copy className="size-4" />} label="Copy link" onClick={onCopyLink} />
                    <ShareOption
                        icon={<Share2 className="size-4" />}
                        label="Share to Instagram"
                        onClick={onShareInstagram}
                    />
                    <ShareOption
                        icon={<Share2 className="size-4" />}
                        label="Share to WhatsApp"
                        onClick={onShareWhatsApp}
                    />
                    <ShareOption
                        icon={<Download className="size-4" />}
                        label="Download clip image"
                        onClick={onDownloadArtwork}
                    />
                </div>
            </div>
        </div>
    )
}

function ShareOption({
    icon,
    label,
    onClick,
}: {
    icon: ReactNode
    label: string
    onClick: () => void
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-xl bg-white/[0.05] px-4 py-3 text-left text-sm font-bold text-white transition hover:bg-white/[0.08]"
        >
            <span className="text-saffron">{icon}</span>
            {label}
        </button>
    )
}

function NavArrow({
    ariaLabel,
    children,
    onClick,
}: {
    ariaLabel: string
    children: ReactNode
    onClick: () => void
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={onClick}
            className="inline-flex size-8 items-center justify-center rounded-full border border-white/8 bg-black/35 text-white/70 backdrop-blur-sm transition hover:bg-black/50 hover:text-white"
        >
            {children}
        </button>
    )
}

function RailAction({
    active = false,
    ariaLabel,
    icon,
    label,
    onClick,
    primary = false,
}: {
    active?: boolean
    ariaLabel: string
    icon: ReactNode
    label: string
    onClick: () => void
    primary?: boolean
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            aria-pressed={active}
            onClick={onClick}
            className={`group flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-[0.08em] ${
                primary ? "text-saffron" : active ? "text-saffron" : "text-white/85"
            }`}
        >
            <span
                className={`inline-flex size-11 items-center justify-center rounded-full border shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition group-hover:scale-[1.03] ${
                    primary
                        ? "border-saffron/40 bg-saffron text-charcoal"
                        : active
                          ? "border-saffron/35 bg-saffron/15 text-saffron"
                          : "border-white/10 bg-black/35 text-white backdrop-blur-sm group-hover:bg-black/50"
                }`}
            >
                {icon}
            </span>
            {label}
        </button>
    )
}

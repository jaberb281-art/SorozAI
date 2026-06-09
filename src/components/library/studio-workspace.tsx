"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ChevronDown,
    Copy,
    Download,
    Filter,
    Globe2,
    Lock,
    MoreHorizontal,
    Music2,
    Pause,
    Pencil,
    Play,
    Radio,
    RefreshCcw,
    Search,
    Trash2,
    UserRound,
} from "lucide-react"

import { usePlaySong } from "@/hooks/use-play-song"
import { DemoVideoPoster } from "@/components/media/demo-video"
import { getDemoImage } from "@/lib/demo-images"
import type { GenrePreset, Instrument, Song } from "@/lib/types"

// ── Types ────────────────────────────────────────────────────────────────────

export type StudioItemStatus = "generated" | "draft" | "capture" | "preview"

export type StudioItem = {
    id: string
    title: string
    status: StudioItemStatus
    prompt: string
    tags: string[]
    instrumentTags: string[]
    duration: number
    createdAt: string
    imageUrl?: string
    audioUrl?: string
    gradientFallback: string
    sourceId?: string
    sourceTitle?: string
    sourceType?: "track" | "capture"
    isPreview?: boolean
    isPublic?: boolean
}

export type StudioTab = "all" | "drafts" | "captures" | "saved"

export const MOCK_STUDIO_ITEMS: StudioItem[] = [
    {
        id: "item-1",
        title: "Makran Evening",
        status: "generated",
        prompt: "Create a warm Zahirok song about evening memories along the Makran coast.",
        tags: ["Makkuran", "Zahirok"],
        instrumentTags: ["Dambora"],
        duration: 198,
        createdAt: "2026-06-07T14:23:00Z",
        gradientFallback: "linear-gradient(135deg, #1a0a0a 0%, #3a2010 100%)",
        imageUrl: getDemoImage(0),
        isPublic: false,
    },
    {
        id: "item-2",
        title: "Sufi Breath",
        status: "preview",
        prompt: "A spiritual Sufi song with Damboora and Suroz in the Makkuran style.",
        tags: ["Sufi", "Makkuran"],
        instrumentTags: ["Dambora", "Suroz"],
        duration: 241,
        createdAt: "2026-06-06T09:11:00Z",
        gradientFallback: "linear-gradient(135deg, #0a1a2a 0%, #1a2a4a 100%)",
        imageUrl: getDemoImage(1),
        isPreview: true,
    },
    {
        id: "item-3",
        title: "Wedding Doholl Nights",
        status: "generated",
        prompt: "A celebratory wedding song with Doholl drums and Rubab melody.",
        tags: ["Wedding", "Makkuran"],
        instrumentTags: ["Duholl", "Rabab"],
        duration: 185,
        createdAt: "2026-06-05T20:45:00Z",
        gradientFallback: "linear-gradient(135deg, #2a0a0a 0%, #4a2010 100%)",
        imageUrl: getDemoImage(2),
        isPublic: true,
    },
    {
        id: "item-4",
        title: "Coastal Drift (Remix)",
        status: "generated",
        prompt: "Slowed version with acoustic Suroz, stripped to essentials.",
        tags: ["Coastal", "Ambient"],
        instrumentTags: ["Suroz"],
        duration: 224,
        createdAt: "2026-06-04T16:30:00Z",
        gradientFallback: "linear-gradient(135deg, #0a1a1a 0%, #1a3a3a 100%)",
        imageUrl: getDemoImage(3),
        sourceId: "item-3",
        sourceTitle: "Wedding Doholl Nights",
        sourceType: "track",
        isPublic: false,
    },
    {
        id: "item-5",
        title: "Desert Night Draft",
        status: "draft",
        prompt: "Dambora at night, caravan mood, slow build...",
        tags: ["Folk", "Instrumental"],
        instrumentTags: ["Dambora"],
        duration: 47,
        createdAt: "2026-06-03T11:00:00Z",
        gradientFallback: "linear-gradient(135deg, #1a1a0a 0%, #2a2a10 100%)",
        imageUrl: getDemoImage(4),
    },
]

export const MOCK_SAVED_ITEMS: StudioItem[] = []

const STUDIO_TABS: { id: StudioTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "drafts", label: "Drafts" },
    { id: "captures", label: "Captures" },
    { id: "saved", label: "Saved" },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainder = Math.floor(seconds % 60)
    return `${minutes}:${remainder.toString().padStart(2, "0")}`
}

function formatDateLabel(iso: string): string {
    const date = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`

    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date)
}

function statusLabel(status: StudioItemStatus): string {
    switch (status) {
        case "draft":
            return "Draft"
        case "capture":
            return "Capture"
        case "preview":
            return "Preview"
        default:
            return "Generated"
    }
}

function statusBadgeClass(status: StudioItemStatus): string {
    switch (status) {
        case "draft":
            return "border-amber-400/30 bg-amber-400/10 text-amber-200"
        case "capture":
            return "border-sky-400/30 bg-sky-400/10 text-sky-200"
        case "preview":
            return "border-white/15 bg-white/[0.06] text-sand/60"
        default:
            return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
    }
}

function studioItemToSong(item: StudioItem): Song {
    const genrePreset = (item.tags.find((tag) =>
        ["Zahirok", "Sufi", "Wedding", "Lullaby", "Naat"].includes(tag),
    ) ?? "Zahirok") as GenrePreset

    const instruments = item.instrumentTags.map((tag) => {
        const map: Record<string, Instrument> = {
            Dambora: "Damboora",
            Damboora: "Damboora",
            Suroz: "Suroz",
            Duholl: "Doholl",
            Doholl: "Doholl",
            Rabab: "Rubab",
            Rubab: "Rubab",
        }
        return map[tag] ?? "Suroz"
    })

    return {
        id: item.id,
        title: item.title,
        prompt: item.prompt,
        genrePreset,
        instruments: instruments.length > 0 ? instruments : ["Suroz"],
        lyrics: "",
        status: "completed",
        audioUrl: item.audioUrl ?? "/mock/audio-placeholder.mp3",
        mp3Url: item.audioUrl ?? "/mock/audio-placeholder.mp3",
        wavUrl: item.audioUrl ?? "/mock/audio-placeholder.wav",
        isPublic: item.isPublic ?? false,
        createdAt: item.createdAt,
        duration: formatDuration(item.duration),
        plays: 0,
        likes: 0,
        remixes: 0,
    }
}

function filterStudioItems(items: StudioItem[], query: string): StudioItem[] {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) =>
        [item.title, item.prompt, ...item.tags, ...item.instrumentTags]
            .join(" ")
            .toLowerCase()
            .includes(q),
    )
}

function computeStats(items: StudioItem[]) {
    const songs = items.filter((item) => item.status === "generated").length
    const drafts = items.filter((item) => item.status === "draft").length
    const captures = items.filter((item) => item.status === "capture").length
    const totalSeconds = items
        .filter((item) => item.status === "generated")
        .reduce((sum, item) => sum + item.duration, 0)
    const hours = totalSeconds / 3600
    const durationLabel =
        hours >= 1 ? `${hours.toFixed(1)} hrs` : hours >= 0.1 ? `${hours.toFixed(1)} hrs` : `${Math.round(totalSeconds / 60)} min`

    return { songs, drafts, captures, durationLabel }
}

function lineageText(item: StudioItem): string | null {
    if (!item.sourceTitle) return null
    if (item.sourceType === "capture") {
        return `Generated from: ${item.sourceTitle}`
    }
    return `Remixed from: ${item.sourceTitle}`
}

// ── Page sections ─────────────────────────────────────────────────────────────

export function StudioHeader() {
    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-4xl font-black leading-none tracking-tight text-white">My Studio</h1>
            <div className="flex shrink-0 items-center gap-2">
                <Link
                    href="/create"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-white/12 px-4 text-sm font-black text-white transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:h-12 sm:px-5"
                >
                    <span className="text-saffron">+</span>
                    Create
                </Link>
                <Link
                    href="/profile"
                    aria-label="Open profile"
                    className="inline-flex size-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e37a2c,#2f8f9a)] text-white transition hover:opacity-90 sm:size-12"
                >
                    <UserRound className="size-4" aria-hidden={true} />
                </Link>
            </div>
        </header>
    )
}

export function StudioTabBar({
    activeTab,
    onTabChange,
}: {
    activeTab: StudioTab
    onTabChange: (tab: StudioTab) => void
}) {
    return (
        <div
            role="tablist"
            aria-label="My Studio sections"
            className="mt-8 flex snap-x gap-5 overflow-x-auto border-b border-white/12 pb-0.5 [scrollbar-color:rgba(237,227,211,0.28)_transparent] [scrollbar-width:thin] sm:gap-7 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-sand/20"
        >
            {STUDIO_TABS.map((tab) => (
                <button
                    key={tab.id}
                    id={`studio-tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`studio-panel-${tab.id}`}
                    onClick={() => onTabChange(tab.id)}
                    className={`shrink-0 snap-start pb-3 text-sm font-bold sm:text-base ${
                        activeTab === tab.id
                            ? "border-b-2 border-white text-white"
                            : "text-sand/70 transition hover:text-white"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}

export function StudioStatsBar({ items }: { items: StudioItem[] }) {
    const stats = useMemo(() => computeStats(items), [items])

    return (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-sand/50">
            <span>♪ {stats.songs} songs</span>
            <span>✏️ {stats.drafts} drafts</span>
            <span>🎙 {stats.captures} captures</span>
            <span>⬇️ {stats.durationLabel} of music</span>
        </div>
    )
}

export function StudioToolbar({
    query,
    setQuery,
}: {
    query: string
    setQuery: (value: string) => void
}) {
    return (
        <div className="mt-5 flex flex-wrap items-center gap-2">
            <label className="relative min-w-0 flex-1 sm:min-w-[240px]">
                <span className="sr-only">Search for a song, lyrics, or style</span>
                <Search
                    className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-sand/70"
                    aria-hidden={true}
                />
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search for a song, lyrics, or style"
                    className="h-12 w-full rounded-full border border-white/[0.04] bg-white/[0.055] pl-12 pr-4 text-sm font-semibold text-sand outline-none placeholder:text-sand/45 focus:border-saffron/35"
                />
            </label>
            <ToolbarPill>
                <Filter className="size-4" aria-hidden={true} />
                Filters
                <ChevronDown className="size-4 text-sand/55" aria-hidden={true} />
            </ToolbarPill>
            <ToolbarPill>
                Newest
                <ChevronDown className="size-4 text-sand/55" aria-hidden={true} />
            </ToolbarPill>
        </div>
    )
}

function ToolbarPill({ children }: { children: ReactNode }) {
    return (
        <button
            type="button"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white/[0.085] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.12]"
        >
            {children}
        </button>
    )
}

export function StudioEmptyState({ tab }: { tab: StudioTab }) {
    switch (tab) {
        case "drafts":
            return (
                <EmptyState
                    icon={<Pencil className="size-8 text-sand/40" aria-hidden={true} />}
                    title="No drafts yet."
                    body="Start a song and save it as a draft to continue later."
                    ctaLabel="Start creating →"
                    ctaHref="/create"
                />
            )
        case "captures":
            return (
                <EmptyState
                    icon={<Radio className="size-8 text-sand/40" aria-hidden={true} />}
                    title="No captures yet."
                    body="Open The Drift and capture a 30-second moment."
                    ctaLabel="Open The Drift →"
                    ctaHref="/radio"
                />
            )
        case "saved":
            return (
                <EmptyState
                    icon={<Music2 className="size-8 text-sand/40" aria-hidden={true} />}
                    title="Nothing saved yet."
                    body="Browse Discover and save tracks that inspire you."
                    ctaLabel="Go to Discover →"
                    ctaHref="/feed"
                />
            )
        default:
            return (
                <EmptyState
                    icon={<Music2 className="size-8 text-sand/40" aria-hidden={true} />}
                    title="Your studio is empty."
                    body={
                        <>
                            Create your first track and it&apos;ll live here.
                            <br />
                            Every song, draft, and capture in one place.
                        </>
                    }
                    ctaLabel="+ Create your first song →"
                    ctaHref="/create"
                />
            )
    }
}

function EmptyState({
    body,
    ctaHref,
    ctaLabel,
    icon,
    title,
}: {
    body: ReactNode
    ctaHref: string
    ctaLabel: string
    icon: ReactNode
    title: string
}) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-16 text-center">
            <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-white/[0.04]">
                {icon}
            </div>
            <h2 className="text-lg font-black text-white">{title}</h2>
            <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-sand/55">{body}</p>
            <Link
                href={ctaHref}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-saffron transition hover:text-white"
            >
                {ctaLabel}
            </Link>
        </div>
    )
}

// ── Item list ─────────────────────────────────────────────────────────────────

export function StudioItemList({
    items,
    onDelete,
    onNotice,
    onRename,
    onTogglePublic,
}: {
    items: StudioItem[]
    onDelete: (id: string) => void
    onNotice: (message: string) => void
    onRename: (id: string, title: string) => void
    onTogglePublic: (id: string) => void
}) {
    const { playSong, isCurrentSong, isPlaying } = usePlaySong()
    const queue = useMemo(() => items.map(studioItemToSong), [items])

    function handlePlay(item: StudioItem) {
        playSong(studioItemToSong(item), queue)
    }

    return (
        <div className="mt-5 space-y-3">
            {items.map((item) => {
                const playerSong = studioItemToSong(item)
                return (
                    <StudioItemRow
                        key={item.id}
                        item={item}
                        isPlaying={isCurrentSong(playerSong) && isPlaying}
                        onPlay={() => handlePlay(item)}
                        onDelete={() => onDelete(item.id)}
                        onNotice={onNotice}
                        onRename={(title) => onRename(item.id, title)}
                        onTogglePublic={() => onTogglePublic(item.id)}
                    />
                )
            })}
        </div>
    )
}

export function getItemsForTab(
    tab: StudioTab,
    studioItems: StudioItem[],
    savedItems: StudioItem[],
): StudioItem[] {
    switch (tab) {
        case "drafts":
            return studioItems.filter((item) => item.status === "draft")
        case "captures":
            return studioItems.filter((item) => item.status === "capture")
        case "saved":
            return savedItems
        default:
            return studioItems
    }
}

export function filterItemsForStudio(
    tab: StudioTab,
    query: string,
    studioItems: StudioItem[],
    savedItems: StudioItem[],
): StudioItem[] {
    return filterStudioItems(getItemsForTab(tab, studioItems, savedItems), query)
}

// ── Row ───────────────────────────────────────────────────────────────────────

function StudioItemRow({
    item,
    isPlaying,
    onDelete,
    onNotice,
    onPlay,
    onRename,
    onTogglePublic,
}: {
    item: StudioItem
    isPlaying: boolean
    onDelete: () => void
    onNotice: (message: string) => void
    onPlay: () => void
    onRename: (title: string) => void
    onTogglePublic: () => void
}) {
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const lineage = lineageText(item)
    const visibleTags = item.tags.slice(0, 2)
    const isPreview = item.status === "preview" || item.isPreview

    useEffect(() => {
        if (!menuOpen) return

        function handlePointerDown(event: PointerEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setMenuOpen(false)
        }

        document.addEventListener("pointerdown", handlePointerDown)
        document.addEventListener("keydown", handleEscape)
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [menuOpen])

    async function copyLink() {
        const origin = typeof window !== "undefined" ? window.location.origin : ""
        try {
            await navigator.clipboard.writeText(`${origin}/song/${item.id}`)
            onNotice("Link copied to clipboard.")
        } catch {
            onNotice("Could not copy link.")
        }
        setMenuOpen(false)
    }

    function handleDownload(format: "mp3" | "wav") {
        if (isPreview) return
        if (format === "wav") {
            onNotice("WAV download coming soon.")
            setMenuOpen(false)
            return
        }
        const link = document.createElement("a")
        link.href = item.audioUrl ?? "/mock/audio-placeholder.mp3"
        link.download = `${item.id}.mp3`
        link.click()
        onNotice("Downloading MP3…")
        setMenuOpen(false)
    }

    function handleRename() {
        const next = window.prompt("Rename track", item.title)
        if (next?.trim()) {
            onRename(next.trim())
            onNotice("Track renamed.")
        }
        setMenuOpen(false)
    }

    function handleDuplicateDraft() {
        onNotice("Draft duplicated.")
        setMenuOpen(false)
    }

    return (
        <>
            <article className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 transition hover:bg-white/[0.035] sm:p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                    <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
                        <div
                            className="relative size-16 shrink-0 overflow-hidden rounded-xl"
                            style={{ background: item.gradientFallback }}
                        >
                            {item.imageUrl ? (
                                <DemoVideoPoster
                                    src={item.imageUrl}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            ) : null}
                            <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white">
                                {formatDuration(item.duration)}
                            </span>
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="truncate text-base font-semibold text-white">{item.title}</h2>
                                {isPreview ? (
                                    <span className="rounded-md border border-white/12 bg-white/[0.06] px-1.5 py-0.5 text-xs font-semibold text-sand/55">
                                        v1 Preview
                                    </span>
                                ) : null}
                                {visibleTags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-md border border-white/10 bg-white/[0.045] px-1.5 py-0.5 text-xs font-semibold text-sand/70"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-sand/60">{item.prompt}</p>

                            {lineage ? (
                                <p className="mt-1 text-xs font-semibold text-sand/45">{lineage}</p>
                            ) : null}

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-sand/45">
                                <span>{formatDateLabel(item.createdAt)}</span>
                                <span aria-hidden={true}>·</span>
                                <span
                                    className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] ${statusBadgeClass(item.status)}`}
                                >
                                    {statusLabel(item.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 lg:ml-auto lg:justify-end">
                        <PlayButton isPlaying={isPlaying} onClick={onPlay} preview={isPreview} />

                        {item.status === "generated" && !isPreview ? (
                            <>
                                <TextAction
                                    label="Remix →"
                                    onClick={() => router.push(`/create?ref=${item.id}`)}
                                />
                                <IconAction
                                    label="Download"
                                    onClick={() => handleDownload("mp3")}
                                    icon={<Download className="size-4" />}
                                />
                            </>
                        ) : null}

                        {item.status === "draft" ? (
                            <>
                                <TextAction
                                    label="Continue ✏️"
                                    onClick={() => router.push(`/create?draft=${item.id}`)}
                                />
                                <IconAction
                                    label="Download"
                                    onClick={() => handleDownload("mp3")}
                                    icon={<Download className="size-4" />}
                                />
                            </>
                        ) : null}

                        {item.status === "capture" ? (
                            <TextAction
                                label="Turn into song →"
                                onClick={() => router.push(`/create?capture=${item.id}`)}
                            />
                        ) : null}

                        {isPreview ? (
                            <div className="flex w-full flex-col gap-1 sm:w-auto sm:items-end">
                                <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-sand/50">
                                    <Lock className="size-3.5" aria-hidden={true} />
                                    Full song requires Pro
                                </p>
                                <Link
                                    href="/pricing"
                                    className="text-sm font-bold text-saffron/80 transition hover:text-saffron"
                                >
                                    Upgrade →
                                </Link>
                            </div>
                        ) : null}

                        <div ref={menuRef} className="relative">
                            <button
                                type="button"
                                aria-label={`More options for ${item.title}`}
                                aria-expanded={menuOpen}
                                onClick={() => setMenuOpen((open) => !open)}
                                className="inline-flex size-9 items-center justify-center rounded-full bg-white/[0.045] text-sand/45 transition hover:bg-white/[0.08] hover:text-white"
                            >
                                <MoreHorizontal className="size-4" aria-hidden={true} />
                            </button>

                            {menuOpen ? (
                                <StudioActionsMenu
                                    item={item}
                                    onClose={() => setMenuOpen(false)}
                                    onCopyLink={copyLink}
                                    onDelete={() => {
                                        setMenuOpen(false)
                                        setDeleteOpen(true)
                                    }}
                                    onDownloadMp3={() => handleDownload("mp3")}
                                    onDownloadWav={() => handleDownload("wav")}
                                    onDuplicateDraft={handleDuplicateDraft}
                                    onPlay={() => {
                                        onPlay()
                                        setMenuOpen(false)
                                    }}
                                    onRename={handleRename}
                                    onRemix={() => router.push(`/create?ref=${item.id}`)}
                                    onContinue={() => router.push(`/create?draft=${item.id}`)}
                                    onTurnIntoSong={() => router.push(`/create?capture=${item.id}`)}
                                    onTogglePublic={() => {
                                        onTogglePublic()
                                        setMenuOpen(false)
                                    }}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </article>

            {deleteOpen ? (
                <ConfirmDeleteDialog
                    title={item.title}
                    onCancel={() => setDeleteOpen(false)}
                    onConfirm={() => {
                        onDelete()
                        setDeleteOpen(false)
                        onNotice("Track deleted.")
                    }}
                />
            ) : null}
        </>
    )
}

function PlayButton({
    isPlaying,
    onClick,
    preview,
}: {
    isPlaying: boolean
    onClick: () => void
    preview?: boolean
}) {
    return (
        <button
            type="button"
            aria-label={preview ? "Play preview" : isPlaying ? "Pause" : "Play"}
            onClick={onClick}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition hover:border-saffron/30 hover:bg-saffron/10 hover:text-saffron"
        >
            {isPlaying ? (
                <Pause className="size-4 fill-current" aria-hidden={true} />
            ) : (
                <Play className="ml-0.5 size-4 fill-current" aria-hidden={true} />
            )}
        </button>
    )
}

function TextAction({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="text-sm font-bold text-saffron transition hover:text-white"
        >
            {label}
        </button>
    )
}

function IconAction({
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
            aria-label={label}
            onClick={onClick}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-sand/70 transition hover:bg-white/[0.1] hover:text-white"
        >
            {icon}
        </button>
    )
}

function StudioActionsMenu({
    item,
    onClose,
    onContinue,
    onCopyLink,
    onDelete,
    onDownloadMp3,
    onDownloadWav,
    onDuplicateDraft,
    onPlay,
    onRemix,
    onRename,
    onTogglePublic,
    onTurnIntoSong,
}: {
    item: StudioItem
    onClose: () => void
    onContinue: () => void
    onCopyLink: () => void
    onDelete: () => void
    onDownloadMp3: () => void
    onDownloadWav: () => void
    onDuplicateDraft: () => void
    onPlay: () => void
    onRemix: () => void
    onRename: () => void
    onTogglePublic: () => void
    onTurnIntoSong: () => void
}) {
    const isPreview = item.status === "preview" || item.isPreview
    const isDraft = item.status === "draft"
    const isCapture = item.status === "capture"
    const isGenerated = item.status === "generated" && !isPreview

    return (
        <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-white/12 bg-[#111113] p-1.5 shadow-[0_18px_44px_rgba(0,0,0,0.45)]"
        >
            {(isGenerated || isCapture || isPreview) && (
                <MenuItem
                    icon={<Play className="size-4" />}
                    label={isPreview ? "Play preview" : "Play"}
                    onClick={onPlay}
                />
            )}

            {isGenerated && (
                <>
                    <MenuItem icon={<Pencil className="size-4" />} label="Rename" onClick={onRename} />
                    <MenuItem icon={<RefreshCcw className="size-4" />} label="Remix" onClick={onRemix} />
                    <MenuItem icon={<Download className="size-4" />} label="Download MP3" onClick={onDownloadMp3} />
                    <MenuItem
                        icon={<Download className="size-4" />}
                        label="Download WAV"
                        hint="coming soon"
                        onClick={onDownloadWav}
                    />
                    <MenuItem icon={<Copy className="size-4" />} label="Copy link" onClick={onCopyLink} />
                    <MenuItem
                        icon={<Globe2 className="size-4" />}
                        label={item.isPublic ? "Make private" : "Make public"}
                        onClick={onTogglePublic}
                    />
                </>
            )}

            {isDraft && (
                <>
                    <MenuItem icon={<Pencil className="size-4" />} label="Continue editing" onClick={onContinue} />
                    <MenuItem icon={<Copy className="size-4" />} label="Duplicate draft" onClick={onDuplicateDraft} />
                </>
            )}

            {isCapture && (
                <>
                    <MenuItem icon={<Music2 className="size-4" />} label="Turn into song" onClick={onTurnIntoSong} />
                    <MenuItem icon={<Copy className="size-4" />} label="Copy link" onClick={onCopyLink} />
                </>
            )}

            {isPreview && (
                <>
                    <MenuItem
                        icon={<Lock className="size-4" />}
                        label="Download (Pro only)"
                        disabled
                        onClick={onClose}
                    />
                    <MenuItem icon={<Lock className="size-4" />} label="Remix (Pro only)" disabled onClick={onClose} />
                </>
            )}

            <div className="my-1 border-t border-white/8" />
            <MenuItem icon={<Trash2 className="size-4" />} label="Delete" destructive onClick={onDelete} />
        </div>
    )
}

function MenuItem({
    destructive = false,
    disabled = false,
    hint,
    icon,
    label,
    onClick,
}: {
    destructive?: boolean
    disabled?: boolean
    hint?: string
    icon: ReactNode
    label: string
    onClick: () => void
}) {
    return (
        <button
            type="button"
            role="menuitem"
            disabled={disabled}
            onClick={onClick}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron disabled:cursor-not-allowed disabled:opacity-45 ${
                destructive
                    ? "text-red-300 hover:bg-red-500/10"
                    : "text-sand/88 hover:bg-white/[0.08] hover:text-white"
            }`}
        >
            <span className={destructive ? "text-red-300" : "text-sand/65"}>{icon}</span>
            <span className="flex-1">{label}</span>
            {hint ? <span className="text-[10px] font-semibold uppercase text-sand/40">{hint}</span> : null}
        </button>
    )
}

function ConfirmDeleteDialog({
    onCancel,
    onConfirm,
    title,
}: {
    onCancel: () => void
    onConfirm: () => void
    title: string
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div
                role="dialog"
                aria-labelledby="delete-dialog-title"
                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#19191c] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            >
                <h2 id="delete-dialog-title" className="text-lg font-black text-white">
                    Delete &ldquo;{title}&rdquo;?
                </h2>
                <p className="mt-2 text-sm font-semibold text-sand/55">
                    This cannot be undone. The track will be removed from My Studio.
                </p>
                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-full px-4 py-2 text-sm font-bold text-sand/70 transition hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-black text-white transition hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

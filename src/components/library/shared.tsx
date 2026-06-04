"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ChevronDown,
    Filter,
    MessageCircle,
    MoreHorizontal,
    Pause,
    Play,
    RefreshCcw,
    Search,
    Share2,
    ThumbsDown,
    ThumbsUp,
} from "lucide-react"

import { formatCount, toPlayerSong, type MockSong } from "@/lib/mock-songs"
import type { Song } from "@/lib/types"

// ── Types ────────────────────────────────────────────────────────────────────

export type LibrarySong = MockSong & {
    isDraft?: boolean
    isPreview?: boolean
    upgradeRequired?: boolean
}

// MOCK: bridge LibrarySong → Song for the global player store
export function toSong(song: LibrarySong): Song {
    return toPlayerSong(song)
}

// ── Inline mock note ────────────────────────────────────────────────────────

export function MockNote({ text }: { text: string }) {
    return (
        <p role="status" className="mt-2 rounded-lg border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-xs font-semibold text-saffron">
            {text}
        </p>
    )
}

// ── Shared primitives ────────────────────────────────────────────────────────

export function SearchInput({
    value,
    onChange,
    placeholder,
}: {
    value: string
    onChange: (value: string) => void
    placeholder: string
}) {
    return (
        <label className="relative min-w-0 flex-1 sm:min-w-[240px]">
            <span className="sr-only">{placeholder}</span>
            <Search
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-sand/70"
                aria-hidden={true}
            />
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-12 w-full rounded-full border border-white/[0.04] bg-white/[0.055] pl-12 pr-4 text-sm font-semibold text-sand outline-none placeholder:text-sand/45 focus:border-saffron/35"
            />
        </label>
    )
}

export function ToolbarPill({ children }: { children: React.ReactNode }) {
    return (
        <button
            type="button"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white/[0.085] px-4 text-sm font-black text-white transition hover:bg-white/[0.12]"
        >
            {children}
        </button>
    )
}

export function IconPill({
    label,
    active,
    onClick,
    children,
}: {
    label: string
    active?: boolean
    onClick?: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={`inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-black transition ${
                active
                    ? "bg-sand text-[#171717]"
                    : "bg-white/[0.055] text-sand/60 hover:bg-white/[0.09] hover:text-white"
            }`}
        >
            {children}
        </button>
    )
}

export function RoundIcon({
    label,
    active,
    children,
}: {
    label: string
    active?: boolean
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-pressed={active}
            className={`inline-flex size-12 items-center justify-center rounded-full border border-white/10 transition ${
                active ? "bg-white/[0.09] text-white" : "text-sand/70 hover:bg-white/[0.05]"
            }`}
        >
            {children}
        </button>
    )
}

// ── Song toolbar (used by Songs + Studio Projects tabs) ──────────────────────

export function SongToolbar({
    query,
    setQuery,
}: {
    query: string
    setQuery: (query: string) => void
}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search for a song, lyrics, or style"
            />
            <ToolbarPill>
                <Filter className="size-4" aria-hidden={true} />
                Filters
                <ChevronDown className="size-4 text-sand/55" aria-hidden={true} />
            </ToolbarPill>
            <ToolbarPill>
                Newest
                <ChevronDown className="size-4 text-sand/55" aria-hidden={true} />
            </ToolbarPill>
            {["Liked", "Public", "Uploads"].map((chip) => (
                <button
                    key={chip}
                    type="button"
                    className="h-12 rounded-full border border-white/10 px-4 text-sm font-black text-white transition hover:border-saffron/24"
                >
                    {chip}
                </button>
            ))}
        </div>
    )
}

// ── Song row (used by Songs + History tabs) ──────────────────────────────────

export function SongRow({
    song,
    isPlaying,
    onPlay,
    showCheckbox,
    showRemix,
}: {
    song: LibrarySong
    isPlaying: boolean
    onPlay: () => void
    showCheckbox?: boolean
    showRemix?: boolean
}) {
    const router = useRouter()
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)
    const [rowNote, setRowNote] = useState("")

    async function handleShare() {
        try {
            if (typeof window !== "undefined" && navigator.clipboard) {
                await navigator.clipboard.writeText(`${window.location.origin}/song/${song.id}`)
                setRowNote("Song link copied.")
                return
            }
        } catch {
            // fall through
        }
        setRowNote("Song link copied.")
    }

    return (
        <article className="group rounded-2xl bg-white/[0.02] p-3 transition hover:bg-white/[0.04]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    {showCheckbox && (
                        <span className="hidden size-3 rounded-sm border border-white/10 lg:block" />
                    )}
                    <div className={`relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-[78px] ${song.coverClass}`}>
                        {song.coverImage && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                                src={song.coverImage}
                                alt={`${song.title} cover`}
                                className="absolute inset-0 h-full w-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                            />
                        )}
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.12),transparent)]" />
                        <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/68 px-2 py-0.5 text-xs font-black text-white">
                            {song.duration}
                        </span>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href={`/song/${song.id}`}
                                className="truncate text-base font-black text-white transition hover:text-saffron"
                            >
                                {song.title}
                            </Link>
                            <span className="rounded-md border border-white/10 bg-white/[0.045] px-1.5 py-0.5 text-xs font-semibold text-sand/64">
                                {song.isPreview ? "v1 Preview" : song.dialect}
                            </span>
                        </div>

                        <p className="mt-1 truncate text-sm font-semibold text-sand/38">
                            {song.prompt}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <IconPill
                                label={`${isPlaying ? "Pause" : "Play"} ${song.title}`}
                                onClick={onPlay}
                                active={isPlaying}
                            >
                                {isPlaying ? (
                                    <Pause className="size-4 fill-current" aria-hidden={true} />
                                ) : (
                                    <Play className="ml-0.5 size-4 fill-current" aria-hidden={true} />
                                )}
                                <span>{formatCount(song.plays)}</span>
                            </IconPill>
                            <IconPill
                                label="Like song"
                                active={liked}
                                onClick={() => { setLiked((v) => !v); setDisliked(false) }}
                            >
                                <ThumbsUp className={`size-4 ${liked ? "fill-current" : ""}`} aria-hidden={true} />
                            </IconPill>
                            <IconPill
                                label="Dislike song"
                                active={disliked}
                                onClick={() => { setDisliked((v) => !v); setLiked(false) }}
                            >
                                <ThumbsDown className={`size-4 ${disliked ? "fill-current" : ""}`} aria-hidden={true} />
                            </IconPill>
                            <IconPill
                                label="Comments"
                                onClick={() => setRowNote("Comments coming soon.")}
                            >
                                <MessageCircle className="size-4" aria-hidden={true} />
                            </IconPill>
                            <IconPill
                                label="Share"
                                onClick={handleShare}
                            >
                                <Share2 className="size-4" aria-hidden={true} />
                            </IconPill>
                        </div>

                        {rowNote && <MockNote text={rowNote} />}
                    </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3 lg:ml-auto lg:justify-end">
                    {showRemix && (
                        <button
                            type="button"
                            onClick={() => router.push("/create")}
                            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-white/[0.055] px-4 text-sm font-black text-white transition hover:bg-white/[0.09] sm:h-12 sm:flex-none sm:px-5"
                        >
                            <RefreshCcw className="size-4" aria-hidden={true} />
                            Remix
                        </button>
                    )}
                    {song.upgradeRequired && (
                        <button
                            type="button"
                            onClick={() => router.push("/pricing")}
                            className="h-11 flex-1 rounded-full bg-sand px-4 text-sm font-black text-[#161616] transition hover:bg-white sm:flex-none sm:px-5"
                        >
                            Upgrade for full song
                        </button>
                    )}
                    <button
                        type="button"
                        aria-label={`More options for ${song.title}`}
                        onClick={() => setRowNote("More actions coming soon.")}
                        className="inline-flex size-11 items-center justify-center rounded-full bg-white/[0.045] text-sand/45 transition hover:bg-white/[0.08] hover:text-white sm:size-12"
                    >
                        <MoreHorizontal className="size-5" aria-hidden={true} />
                    </button>
                </div>
            </div>
        </article>
    )
}

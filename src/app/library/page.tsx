"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Mic, Plus, Trash2, Upload, X } from "lucide-react"

import { usePlaySong } from "@/hooks/use-play-song"
import { getLibrarySongs, toPlayerSong } from "@/lib/mock-songs"

import { HistoryTab } from "@/components/library/history-tab"
import { PlaylistsTab } from "@/components/library/playlists-tab"
import { CoverArtTab, HooksTab, LikedHooksTab, VoicesTab } from "@/components/library/simple-tabs"
import { SongsTab } from "@/components/library/songs-tab"
import { StudioProjectsTab } from "@/components/library/studio-projects-tab"
import { WorkspacesTab } from "@/components/library/workspaces-tab"
import type { LibrarySong } from "@/components/library/shared"

// ── Tab definitions ─────────────────────────────────────────────────────────

const LIBRARY_TABS = [
    "Songs",
    "Playlists",
    "Workspaces",
    "Studio Projects",
    "Voices",
    "Cover Art",
    "Hooks",
    "Liked Hooks",
    "History",
] as const

type LibraryTab = (typeof LIBRARY_TABS)[number]

function tabId(tab: string) {
    return `library-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`
}

function panelId(tab: string) {
    return `library-panel-${tab.toLowerCase().replace(/\s+/g, "-")}`
}

// ── Mock data (from unified source) ─────────────────────────────────────────

// MOCK: replace with api-client call when backend is ready
const ALL_LIBRARY = getLibrarySongs()

const MOCK_SONGS: LibrarySong[] = (() => {
    const songs = ALL_LIBRARY.slice(0, 4) as LibrarySong[]
    if (songs[1]) {
        songs[1] = { ...songs[1], isPreview: true, upgradeRequired: true }
    }
    return songs
})()

const MOCK_HISTORY: LibrarySong[] = [
    MOCK_SONGS[0],
    MOCK_SONGS[1],
    { ...(MOCK_SONGS[1] as LibrarySong), id: "history-3", title: `${MOCK_SONGS[1]?.title ?? "Song"} Alt` },
    { ...(MOCK_SONGS[0] as LibrarySong), id: "history-4", duration: "4:34" },
    { ...(MOCK_SONGS[2] as LibrarySong), id: "history-5", title: `${MOCK_SONGS[2]?.title ?? "Song"} Draft` },
].filter(Boolean) as LibrarySong[]

function filterSongs(songs: LibrarySong[], query: string): LibrarySong[] {
    const q = query.trim().toLowerCase()
    if (!q) return songs
    return songs.filter((song) =>
        [song.title, song.prompt, song.genrePreset, song.dialect, ...song.instruments]
            .join(" ")
            .toLowerCase()
            .includes(q),
    )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState<LibraryTab>("Songs")
    const [query, setQuery] = useState("")
    const [isAudioMenuOpen, setIsAudioMenuOpen] = useState(false)
    const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null)
    const [libraryNotice, setLibraryNotice] = useState<string | null>(null)
    const audioMenuRef = useRef<HTMLDivElement>(null)
    const audioInputRef = useRef<HTMLInputElement>(null)
    const { playSong, isCurrentSong, isPlaying } = usePlaySong()

    const sourceSongs = activeTab === "History" ? MOCK_HISTORY : MOCK_SONGS
    const songs = useMemo(() => filterSongs(sourceSongs, query), [query, sourceSongs])

    // MOCK: convert visible rows to Song[] for the global player queue
    const queue = useMemo(() => songs.map(toPlayerSong), [songs])

    function handlePlay(song: LibrarySong) {
        playSong(toPlayerSong(song), queue)
    }

    useEffect(() => {
        if (!isAudioMenuOpen) return

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

    function handleUploadClick() {
        setIsAudioMenuOpen(false)
        setLibraryNotice(null)
        audioInputRef.current?.click()
    }

    function handleRecordClick() {
        setIsAudioMenuOpen(false)
        setSelectedAudioFile(null)
        setLibraryNotice("Recording feature coming soon.")
    }

    function handleAudioFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        if (file) {
            setSelectedAudioFile(file)
            setLibraryNotice(null)
        }
    }

    function handleRemoveAudioFile() {
        setSelectedAudioFile(null)
        setLibraryNotice(null)

        if (audioInputRef.current) {
            audioInputRef.current.value = ""
        }
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#101010] text-sand">
            <main className="min-h-screen px-4 pb-[160px] pt-6 md:px-6 md:pb-[96px] xl:px-8">
                <header className="flex items-start justify-between gap-4">
                    <h1 className="text-4xl font-black leading-none tracking-tight text-white">
                        Library
                    </h1>
                    <div className="flex shrink-0 items-center gap-2">
                        <div ref={audioMenuRef} className="relative">
                            <button
                                type="button"
                                aria-label="Add audio options"
                                aria-expanded={isAudioMenuOpen}
                                aria-controls="library-audio-options-menu"
                                onClick={() => setIsAudioMenuOpen((open) => !open)}
                                className={`inline-flex h-12 items-center gap-2 rounded-full border px-5 text-sm font-black text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                                    isAudioMenuOpen
                                        ? "border-saffron/35 bg-white/[0.08]"
                                        : "border-white/12 hover:bg-white/[0.04]"
                                }`}
                            >
                                <Plus className="size-4 text-saffron" aria-hidden={true} />
                                Audio
                            </button>
                            {isAudioMenuOpen && (
                                <LibraryAudioOptionsMenu
                                    onUpload={handleUploadClick}
                                    onRecord={handleRecordClick}
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
                            aria-label="Delete selected items"
                            className="inline-flex size-12 items-center justify-center rounded-full border border-white/10 text-sand/68 transition hover:bg-white/[0.05] hover:text-white"
                        >
                            <Trash2 className="size-4" aria-hidden={true} />
                        </button>
                    </div>
                </header>

                {(selectedAudioFile || libraryNotice) && (
                    <div className="mt-4 flex justify-end">
                        {selectedAudioFile ? (
                            <div
                                role="status"
                                className="inline-flex max-w-full items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-xs font-bold text-sand shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
                            >
                                <Upload className="size-3.5 shrink-0 text-saffron" aria-hidden={true} />
                                <span className="min-w-0 truncate">{selectedAudioFile.name}</span>
                                <span className="shrink-0 text-saffron">Mock upload</span>
                                <button
                                    type="button"
                                    aria-label={`Remove ${selectedAudioFile.name}`}
                                    onClick={handleRemoveAudioFile}
                                    className="-mr-1 flex size-5 shrink-0 items-center justify-center rounded-full text-sand/55 transition hover:bg-sand/10 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                                >
                                    <X className="size-3.5" aria-hidden={true} />
                                </button>
                            </div>
                        ) : (
                            <p
                                role="status"
                                className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-bold text-sand/72"
                            >
                                <Mic className="size-3.5 shrink-0 text-saffron" aria-hidden={true} />
                                {libraryNotice}
                            </p>
                        )}
                    </div>
                )}

                {/* Tab bar */}
                <div
                    role="tablist"
                    aria-label="Library sections"
                    className="mt-8 flex gap-7 overflow-x-auto border-b border-white/12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {LIBRARY_TABS.map((tab) => (
                        <button
                            key={tab}
                            id={tabId(tab)}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab}
                            aria-controls={panelId(tab)}
                            onClick={() => {
                                setActiveTab(tab)
                                setQuery("")
                            }}
                            className={`shrink-0 pb-3 text-base font-bold ${
                                activeTab === tab
                                    ? "border-b-2 border-white text-white"
                                    : "text-sand/70 transition hover:text-white"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab panel */}
                <section
                    id={panelId(activeTab)}
                    role="tabpanel"
                    aria-labelledby={tabId(activeTab)}
                    className="mt-5"
                >
                    {activeTab === "Songs" && (
                        <SongsTab
                            query={query}
                            setQuery={setQuery}
                            songs={songs}
                            isCurrentSong={isCurrentSong}
                            isPlaying={isPlaying}
                            onPlay={handlePlay}
                        />
                    )}
                    {activeTab === "Playlists" && (
                        <PlaylistsTab query={query} setQuery={setQuery} />
                    )}
                    {activeTab === "Workspaces" && (
                        <WorkspacesTab query={query} setQuery={setQuery} />
                    )}
                    {activeTab === "Studio Projects" && (
                        <StudioProjectsTab query={query} setQuery={setQuery} />
                    )}
                    {activeTab === "Voices" && <VoicesTab />}
                    {activeTab === "Cover Art" && <CoverArtTab />}
                    {activeTab === "Hooks" && <HooksTab />}
                    {activeTab === "Liked Hooks" && <LikedHooksTab />}
                    {activeTab === "History" && (
                        <HistoryTab
                            songs={songs}
                            isCurrentSong={isCurrentSong}
                            isPlaying={isPlaying}
                            onPlay={handlePlay}
                        />
                    )}
                </section>
            </main>
        </div>
    )
}

function LibraryAudioOptionsMenu({
    onUpload,
    onRecord,
}: {
    onUpload: () => void
    onRecord: () => void
}) {
    return (
        <div
            id="library-audio-options-menu"
            role="menu"
            aria-label="Audio options"
            className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-white/12 bg-[#111113] p-1.5 text-left text-sm font-bold text-sand shadow-[0_18px_44px_rgba(0,0,0,0.45)]"
        >
            <button
                type="button"
                role="menuitem"
                onClick={onUpload}
                className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sand/88 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            >
                <Upload className="size-4 text-sand/65 transition group-hover:text-saffron" aria-hidden={true} />
                Upload
            </button>
            <button
                type="button"
                role="menuitem"
                onClick={onRecord}
                className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sand/88 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            >
                <Mic className="size-4 text-sand/65 transition group-hover:text-saffron" aria-hidden={true} />
                Record
            </button>
        </div>
    )
}

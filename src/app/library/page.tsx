"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Plus, Trash2 } from "lucide-react"

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
    const { playSong, isCurrentSong, isPlaying } = usePlaySong()

    const sourceSongs = activeTab === "History" ? MOCK_HISTORY : MOCK_SONGS
    const songs = useMemo(() => filterSongs(sourceSongs, query), [query, sourceSongs])

    // MOCK: convert visible rows to Song[] for the global player queue
    const queue = useMemo(() => songs.map(toPlayerSong), [songs])

    function handlePlay(song: LibrarySong) {
        playSong(toPlayerSong(song), queue)
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#101010] text-sand">
            <main className="min-h-screen px-4 pb-[160px] pt-6 md:px-6 md:pb-[96px] xl:px-8">
                <header className="flex items-start justify-between gap-4">
                    <h1 className="text-4xl font-black leading-none tracking-tight text-white">
                        Library
                    </h1>
                    <div className="flex shrink-0 items-center gap-2">
                        <Link
                            href="/create"
                            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/12 px-5 text-sm font-black text-white transition hover:bg-white/[0.04]"
                        >
                            <Plus className="size-4" aria-hidden={true} />
                            Audio
                        </Link>
                        <button
                            type="button"
                            aria-label="Delete selected items"
                            className="inline-flex size-12 items-center justify-center rounded-full border border-white/10 text-sand/68 transition hover:bg-white/[0.05] hover:text-white"
                        >
                            <Trash2 className="size-4" aria-hidden={true} />
                        </button>
                    </div>
                </header>

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

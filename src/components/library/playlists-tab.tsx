"use client"

import { useState } from "react"
import {
    ChevronDown,
    Filter,
    Plus,
    ThumbsUp,
} from "lucide-react"

import { MockNote, SearchInput, ToolbarPill } from "./shared"

export function PlaylistsTab({
    query,
    setQuery,
}: {
    query: string
    setQuery: (query: string) => void
}) {
    const [note, setNote] = useState("")

    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                <SearchInput
                    value={query}
                    onChange={setQuery}
                    placeholder="Search for a song, lyrics, or style"
                />
                <ToolbarPill>
                    <Filter className="size-4" aria-hidden={true} />
                    My playlists
                    <ChevronDown className="size-4 text-sand/55" aria-hidden={true} />
                </ToolbarPill>
            </div>

            <div className="mt-11 grid grid-cols-2 gap-10 sm:grid-cols-[198px_198px]">
                <div>
                    <button
                        type="button"
                        onClick={() => setNote("Playlist creation is coming soon.")}
                        className="flex aspect-square w-full items-center justify-center rounded-2xl border border-white/10 text-center transition hover:bg-white/[0.035]"
                    >
                        <span>
                            <Plus className="mx-auto size-8 text-white" aria-hidden={true} />
                            <span className="mt-7 block text-xl font-black text-white">
                                Create Playlist
                            </span>
                        </span>
                    </button>
                    {note && <MockNote text={note} />}
                </div>

                <div>
                    <div className="relative aspect-square rounded-2xl bg-[radial-gradient(circle_at_40%_40%,rgba(0,185,105,0.92),rgba(0,120,220,0.9)_55%,rgba(18,24,28,1)_100%)] shadow-[0_-16px_0_rgba(30,150,120,0.18)]">
                        <ThumbsUp
                            className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 fill-current text-sand"
                            aria-hidden={true}
                        />
                    </div>
                    <h2 className="mt-5 text-xl font-black text-white">Liked Songs</h2>
                </div>
            </div>
        </>
    )
}

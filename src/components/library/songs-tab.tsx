"use client"

import type { Song } from "@/lib/types"
import { SongRow, SongToolbar, toSong, type LibrarySong } from "./shared"

export function SongsTab({
    query,
    setQuery,
    songs,
    isCurrentSong,
    isPlaying,
    onPlay,
}: {
    query: string
    setQuery: (query: string) => void
    songs: LibrarySong[]
    isCurrentSong: (song: Song) => boolean
    isPlaying: boolean
    onPlay: (song: LibrarySong) => void
}) {
    return (
        <>
            <SongToolbar query={query} setQuery={setQuery} />
            <div className="mt-5 space-y-4">
                {songs.map((song) => {
                    const playerSong = toSong(song)
                    return (
                        <SongRow
                            key={song.id}
                            song={song}
                            isPlaying={isCurrentSong(playerSong) && isPlaying}
                            onPlay={() => onPlay(song)}
                            showCheckbox
                        />
                    )
                })}
            </div>
        </>
    )
}

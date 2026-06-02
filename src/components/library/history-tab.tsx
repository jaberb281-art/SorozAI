"use client"

import type { Song } from "@/lib/types"
import { SongRow, toSong, type LibrarySong } from "./shared"

export function HistoryTab({
    songs,
    isCurrentSong,
    isPlaying,
    onPlay,
}: {
    songs: LibrarySong[]
    isCurrentSong: (song: Song) => boolean
    isPlaying: boolean
    onPlay: (song: LibrarySong) => void
}) {
    return (
        <div className="space-y-4">
            {songs.map((song, index) => {
                const playerSong = toSong(song)
                return (
                    <SongRow
                        key={song.id}
                        song={song}
                        isPlaying={isCurrentSong(playerSong) && isPlaying}
                        onPlay={() => onPlay(song)}
                        showCheckbox={index === 0}
                        showRemix
                    />
                )
            })}
        </div>
    )
}

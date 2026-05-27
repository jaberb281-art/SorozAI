"use client"

import { useCallback } from "react"

import type { Song } from "@/lib/types"
import { usePlayerStore } from "@/stores/player-store"

export function usePlaySong() {
  const currentSong = usePlayerStore((state) => state.currentSong)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const play = usePlayerStore((state) => state.play)
  const pause = usePlayerStore((state) => state.pause)

  const playSong = useCallback(
    (song: Song, queue?: Song[]) => {
      if (currentSong?.id === song.id && isPlaying) {
        pause()
        return
      }

      play(song, queue)
    },
    [currentSong?.id, isPlaying, pause, play],
  )

  const isCurrentSong = useCallback(
    (song: Song) => currentSong?.id === song.id,
    [currentSong?.id],
  )

  return {
    playSong,
    isCurrentSong,
    isPlaying,
  }
}

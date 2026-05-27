import { create } from "zustand"

import type { Song } from "@/lib/types"

type PlayerState = {
    currentSong: Song | null
    isPlaying: boolean
    progress: number // 0–100
    volume: number // 0–1
    isLooping: boolean
    queue: Song[]
    queueIndex: number
}

type PlayerActions = {
    play: (song: Song, queue?: Song[]) => void
    pause: () => void
    resume: () => void
    toggle: () => void
    stop: () => void
    setProgress: (progress: number) => void
    setVolume: (volume: number) => void
    toggleLoop: () => void
    playNext: () => void
    playPrev: () => void
}

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => ({
    currentSong: null,
    isPlaying: false,
    progress: 0,
    volume: 0.8,
    isLooping: false,
    queue: [],
    queueIndex: 0,

    play(song, queue) {
        const resolvedQueue = queue ?? [song]
        const queueIndex = resolvedQueue.findIndex((item) => item.id === song.id)

        set({
            currentSong: song,
            isPlaying: true,
            progress: 0,
            queue: resolvedQueue,
            queueIndex: Math.max(0, queueIndex),
        })
    },

    pause() {
        set({ isPlaying: false })
    },

    resume() {
        if (get().currentSong) {
            set({ isPlaying: true })
        }
    },

    toggle() {
        const { isPlaying, currentSong } = get()

        if (!currentSong) return

        set({ isPlaying: !isPlaying })
    },

    stop() {
        set({ currentSong: null, isPlaying: false, progress: 0, queue: [], queueIndex: 0 })
    },

    setProgress(progress) {
        set({ progress: Math.max(0, Math.min(100, progress)) })
    },

    setVolume(volume) {
        set({ volume: Math.max(0, Math.min(1, volume)) })
    },

    toggleLoop() {
        set((state) => ({ isLooping: !state.isLooping }))
    },

    playNext() {
        const { queue, queueIndex, isLooping } = get()

        if (queue.length === 0) return

        const nextIndex = queueIndex + 1

        if (nextIndex >= queue.length) {
            if (isLooping) {
                set({ currentSong: queue[0], queueIndex: 0, progress: 0, isPlaying: true })
            }
            return
        }

        set({ currentSong: queue[nextIndex], queueIndex: nextIndex, progress: 0, isPlaying: true })
    },

    playPrev() {
        const { queue, queueIndex, progress } = get()

        if (queue.length === 0) return

        // If more than 3 seconds in, restart current song
        if (progress > 5) {
            set({ progress: 0 })
            return
        }

        const prevIndex = queueIndex - 1

        if (prevIndex < 0) return

        set({ currentSong: queue[prevIndex], queueIndex: prevIndex, progress: 0, isPlaying: true })
    },
}))
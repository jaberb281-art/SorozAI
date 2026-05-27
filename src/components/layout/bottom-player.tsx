"use client"

import { useCallback, useEffect, useRef } from "react"
import {
    Music2,
    Pause,
    Play,
    Repeat,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    X,
} from "lucide-react"

import { usePlayerStore } from "@/stores/player-store"
import type { GenrePreset } from "@/lib/types"

// Genre to gradient for the cover art placeholder
const GENRE_GRADIENTS: Record<GenrePreset, string> = {
    Zahirok: "from-saffron/80 to-terracotta/60",
    Liko: "from-amber-500/70 to-orange-700/60",
    Sout: "from-emerald-600/70 to-teal-800/60",
    Naat: "from-violet-600/70 to-indigo-800/60",
    "Modern Balochi Pop": "from-pink-500/70 to-rose-700/60",
    Wedding: "from-yellow-400/70 to-amber-600/60",
    Lullaby: "from-sky-500/70 to-blue-700/60",
    Sufi: "from-purple-600/70 to-violet-900/60",
    "Hip-Hop Fusion": "from-zinc-400/70 to-zinc-700/60",
    "Custom Prompt": "from-sand/40 to-charcoal/60",
}

function GenreCover({ genre, size = "sm" }: { genre: GenrePreset; size?: "sm" | "md" }) {
    const gradient = GENRE_GRADIENTS[genre] ?? GENRE_GRADIENTS["Custom Prompt"]
    const sizeClass = size === "sm" ? "size-10" : "size-12"

    return (
        <div
            className={`${sizeClass} shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3)]`}
            aria-hidden="true"
        >
            <Music2 className="size-4 text-sand/90" aria-hidden="true" />
        </div>
    )
}

export function BottomPlayer() {
    const {
        currentSong,
        isPlaying,
        progress,
        volume,
        isLooping,
        pause,
        resume,
        stop,
        setProgress,
        setVolume,
        toggleLoop,
        playNext,
        playPrev,
    } = usePlayerStore()

    // Simulate progress tick when playing (mock; real audio will drive this)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                const current = usePlayerStore.getState().progress

                if (current >= 100) {
                    clearInterval(intervalRef.current!)
                    usePlayerStore.getState().playNext()
                    return
                }

                setProgress(current + 0.25)
            }, 100)
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isPlaying, setProgress])

    const handleProgressClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const x = event.clientX - rect.left
            const percentage = (x / rect.width) * 100

            setProgress(percentage)
        },
        [setProgress],
    )

    const handleVolumeClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const x = event.clientX - rect.left
            const vol = x / rect.width

            setVolume(vol)
        },
        [setVolume],
    )

    if (!currentSong) return null

    // Duration parsing to display elapsed time
    const durationParts = currentSong.duration.split(":").map(Number)
    const totalSeconds = (durationParts[0] ?? 0) * 60 + (durationParts[1] ?? 0)
    const elapsedSeconds = Math.floor((progress / 100) * totalSeconds)
    const elapsedMin = Math.floor(elapsedSeconds / 60)
    const elapsedSec = elapsedSeconds % 60

    const formatTime = (min: number, sec: number) =>
        `${min}:${String(sec).padStart(2, "0")}`

    return (
        <div className="fixed bottom-14 left-0 right-0 z-[85] border-t border-sand/10 bg-charcoal/96 backdrop-blur-2xl md:bottom-0 md:left-[220px]">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2 md:gap-5 md:px-6 md:py-3">

                {/* Song info */}
                <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none md:w-[220px]">
                    <GenreCover genre={currentSong.genrePreset} />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-black text-sand leading-tight">
                            {currentSong.title}
                        </p>
                        <p className="truncate text-xs font-semibold text-sand/50 leading-tight mt-0.5">
                            {currentSong.genrePreset}
                        </p>
                    </div>
                </div>

                {/* Center controls + progress */}
                <div className="flex flex-1 flex-col items-center gap-1.5">
                    {/* Transport controls */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            type="button"
                            onClick={toggleLoop}
                            aria-label="Toggle loop"
                            aria-pressed={isLooping}
                            className={`hidden size-8 items-center justify-center rounded-full transition hover:bg-sand/10 md:flex ${isLooping ? "text-saffron" : "text-sand/40 hover:text-sand"
                                }`}
                        >
                            <Repeat className="size-3.5" aria-hidden="true" />
                        </button>

                        <button
                            type="button"
                            onClick={playPrev}
                            aria-label="Previous song"
                            className="flex size-10 items-center justify-center rounded-full text-sand/60 transition hover:bg-sand/10 hover:text-sand md:size-8"
                        >
                            <SkipBack className="size-4" aria-hidden="true" />
                        </button>

                        <button
                            type="button"
                            onClick={isPlaying ? pause : resume}
                            aria-label={isPlaying ? "Pause" : "Play"}
                            className="flex size-11 items-center justify-center rounded-full bg-sand text-charcoal shadow-[0_4px_16px_rgba(237,227,211,0.25)] transition hover:bg-saffron hover:text-sand md:size-10"
                        >
                            {isPlaying ? (
                                <Pause className="size-4 fill-current" aria-hidden="true" />
                            ) : (
                                <Play className="size-4 fill-current translate-x-px" aria-hidden="true" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={playNext}
                            aria-label="Next song"
                            className="flex size-10 items-center justify-center rounded-full text-sand/60 transition hover:bg-sand/10 hover:text-sand md:size-8"
                        >
                            <SkipForward className="size-4" aria-hidden="true" />
                        </button>

                        {/* Stop / close - mobile only */}
                        <button
                            type="button"
                            onClick={stop}
                            aria-label="Close player"
                            className="flex size-10 items-center justify-center rounded-full text-sand/40 transition hover:bg-sand/10 hover:text-sand md:hidden"
                        >
                            <X className="size-3.5" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Progress bar + times */}
                    <div className="hidden w-full max-w-[480px] items-center gap-2 md:flex">
                        <span className="w-10 text-right text-[11px] font-semibold tabular-nums text-sand/40">
                            {formatTime(elapsedMin, elapsedSec)}
                        </span>
                        <div
                            role="slider"
                            aria-label="Playback progress"
                            aria-valuenow={Math.round(progress)}
                            aria-valuetext={`${Math.round(progress)}% played`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-orientation="horizontal"
                            tabIndex={0}
                            className="group relative h-1 flex-1 cursor-pointer overflow-hidden rounded-full bg-sand/12 transition-all hover:h-2"
                            onClick={handleProgressClick}
                            onKeyDown={(event) => {
                                if (event.key === "ArrowRight") setProgress(Math.min(100, progress + 2))
                                if (event.key === "ArrowLeft") setProgress(Math.max(0, progress - 2))
                            }}
                        >
                            <div
                                className="absolute inset-y-0 left-0 rounded-full bg-saffron shadow-[0_0_8px_rgba(227,122,44,0.5)] transition-all duration-100"
                                style={{ width: `${progress}%` }}
                            />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-sand opacity-0 shadow transition group-hover:opacity-100"
                                style={{ left: `calc(${progress}% - 6px)` }}
                            />
                        </div>
                        <span className="w-10 text-[11px] font-semibold tabular-nums text-sand/40">
                            {currentSong.duration}
                        </span>
                    </div>
                </div>

                {/* Right controls (desktop only) */}
                <div className="hidden w-[220px] items-center justify-end gap-2 md:flex">
                    <button
                        type="button"
                        onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                        aria-label={volume === 0 ? "Unmute" : "Mute"}
                        className="flex size-8 items-center justify-center rounded-full text-sand/45 transition hover:bg-sand/10 hover:text-sand"
                    >
                        {volume === 0 ? (
                            <VolumeX className="size-4" aria-hidden="true" />
                        ) : (
                            <Volume2 className="size-4" aria-hidden="true" />
                        )}
                    </button>

                    <div
                        role="slider"
                        aria-label="Volume"
                        aria-valuenow={Math.round(volume * 100)}
                        aria-valuetext={`${Math.round(volume * 100)}% volume`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-orientation="horizontal"
                        tabIndex={0}
                        className="group relative h-1 w-20 cursor-pointer overflow-hidden rounded-full bg-sand/12 transition-all hover:h-2"
                        onClick={handleVolumeClick}
                        onKeyDown={(event) => {
                            if (event.key === "ArrowRight") setVolume(Math.min(1, volume + 0.05))
                            if (event.key === "ArrowLeft") setVolume(Math.max(0, volume - 0.05))
                        }}
                    >
                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-sand/60 transition-all duration-100"
                            style={{ width: `${volume * 100}%` }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={stop}
                        aria-label="Close player"
                        className="flex size-8 items-center justify-center rounded-full text-sand/35 transition hover:bg-sand/10 hover:text-sand"
                    >
                        <X className="size-3.5" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    )
}

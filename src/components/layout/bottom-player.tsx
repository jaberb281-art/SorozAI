"use client"

import { useCallback, useEffect, useRef } from "react"
import Link from "next/link"
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
import { AudioWaveform } from "@/components/ui/audio-waveform"
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

function parseDurationSeconds(duration?: string): number | null {
    if (!duration) return null

    const [minutes, seconds] = duration.split(":").map(Number)

    if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
        return null
    }

    const totalSeconds = minutes * 60 + seconds

    return totalSeconds > 0 ? totalSeconds : null
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

    const totalSeconds = parseDurationSeconds(currentSong?.duration)
    const hasTimedDuration = totalSeconds !== null

    // Simulate progress tick when playing (mock; real audio will drive this)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (isPlaying && currentSong) {
            intervalRef.current = setInterval(() => {
                const current = usePlayerStore.getState().progress

                if (!hasTimedDuration) {
                    setProgress(current >= 100 ? 0 : current + 0.2)
                    return
                }

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
    }, [currentSong, hasTimedDuration, isPlaying, setProgress])

    const handleVolumeClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const x = event.clientX - rect.left
            const vol = x / rect.width

            setVolume(vol)
        },
        [setVolume],
    )

    const safeProgress = Number.isFinite(progress) ? progress : 0
    const elapsedSeconds = hasTimedDuration ? Math.floor((safeProgress / 100) * totalSeconds) : 0
    const elapsedMin = Math.floor(elapsedSeconds / 60)
    const elapsedSec = elapsedSeconds % 60

    const handleWaveformSeek = useCallback(
        (time: number) => {
            if (!hasTimedDuration) return
            setProgress((time / totalSeconds) * 100)
        },
        [hasTimedDuration, setProgress, totalSeconds],
    )

    const formatTime = (min: number, sec: number) =>
        `${min}:${String(sec).padStart(2, "0")}`
    const elapsedLabel = hasTimedDuration ? formatTime(elapsedMin, elapsedSec) : "Live"
    const durationLabel = hasTimedDuration ? currentSong?.duration ?? "Live" : "Live"
    const songPath = currentSong?.id.startsWith("station-") ? "/radio" : currentSong ? `/song/${currentSong.id}` : "#"

    if (!currentSong) return null

    return (
        <div className="bottom-player fixed bottom-[var(--app-bottom-player-offset)] left-0 right-0 z-[85] border-t border-sand/10 bg-charcoal/96 backdrop-blur-sm transition-[bottom,left] duration-200 lg:bottom-0 lg:left-[var(--app-sidebar-width,248px)]">
            <div className="mx-auto flex min-h-[var(--app-bottom-player-height)] max-w-7xl items-center gap-3 px-3 py-2 lg:gap-5 lg:px-6 lg:py-3">

                {/* Song info */}
                <div className="flex min-w-0 flex-1 items-center gap-3 lg:flex-none lg:w-[220px]">
                    <Link
                        href={songPath}
                        aria-label="Open song page"
                        title="Open song page"
                        className="group shrink-0 cursor-pointer rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
                    >
                        <span className="block transition duration-200 group-hover:brightness-125">
                            <GenreCover genre={currentSong.genrePreset} />
                        </span>
                    </Link>
                    <Link
                        href={songPath}
                        aria-label="Open song page"
                        title="Open song page"
                        className="group min-w-0 cursor-pointer rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
                    >
                        <p className="truncate text-sm font-black leading-tight text-sand transition group-hover:text-saffron">
                            {currentSong.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs font-semibold leading-tight text-sand/50">
                            {currentSong.genrePreset}
                        </p>
                    </Link>
                </div>

                {/* Center controls + progress */}
                <div className="flex flex-1 flex-col items-center gap-1.5">
                    {/* Transport controls */}
                    <div className="flex items-center gap-2 lg:gap-3">
                        <button
                            type="button"
                            onClick={toggleLoop}
                            aria-label="Toggle loop"
                            aria-pressed={isLooping}
                            className={`hidden size-8 items-center justify-center rounded-full transition hover:bg-sand/10 lg:flex ${isLooping ? "text-saffron" : "text-sand/40 hover:text-sand"
                                }`}
                        >
                            <Repeat className="size-3.5" aria-hidden="true" />
                        </button>

                        <button
                            type="button"
                            onClick={playPrev}
                            aria-label="Previous song"
                            className="flex size-10 items-center justify-center rounded-full text-sand/60 transition hover:bg-sand/10 hover:text-sand lg:size-8"
                        >
                            <SkipBack className="size-4" aria-hidden="true" />
                        </button>

                        <button
                            type="button"
                            onClick={isPlaying ? pause : resume}
                            aria-label={isPlaying ? "Pause" : "Play"}
                            className="flex size-11 items-center justify-center rounded-full bg-sand text-charcoal shadow-[0_4px_16px_rgba(237,227,211,0.25)] transition hover:bg-saffron hover:text-sand lg:size-10"
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
                            className="flex size-10 items-center justify-center rounded-full text-sand/60 transition hover:bg-sand/10 hover:text-sand lg:size-8"
                        >
                            <SkipForward className="size-4" aria-hidden="true" />
                        </button>

                        {/* Stop / close - mobile only */}
                        <button
                            type="button"
                            onClick={stop}
                            aria-label="Close player"
                            className="flex size-10 items-center justify-center rounded-full text-sand/40 transition hover:bg-sand/10 hover:text-sand lg:hidden"
                        >
                            <X className="size-3.5" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Progress bar + times */}
                    <div className="hidden w-full max-w-[480px] items-center gap-2 lg:flex">
                        <span className="w-10 text-right text-[11px] font-semibold tabular-nums text-sand/40">
                            {elapsedLabel}
                        </span>
                        <AudioWaveform
                            audioUrl={hasTimedDuration ? currentSong?.audioUrl ?? null : null}
                            isPlaying={isPlaying}
                            height={48}
                            onSeek={handleWaveformSeek}
                            className="min-w-0 flex-1"
                        />
                        <span className="w-10 text-[11px] font-semibold tabular-nums text-sand/40">
                            {durationLabel}
                        </span>
                    </div>
                </div>

                {/* Right controls (desktop only) */}
                <div className="hidden w-[220px] items-center justify-end gap-2 lg:flex">
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

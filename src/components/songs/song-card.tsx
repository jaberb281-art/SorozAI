"use client"

import Link from "next/link"
import {
  ExternalLink,
  Pause,
  Play,
  RefreshCcw,
  Share2,
  SlidersHorizontal,
} from "lucide-react"

import type { Song } from "@/lib/types"
import { usePlaySong } from "@/hooks/use-play-song"
import { SongStatusBadge } from "@/components/songs/song-status-badge"
import { WaveformPlaceholder } from "@/components/songs/waveform-placeholder"

type SongCardProps = {
  song: Song
  queue?: Song[]
}

export function SongCard({ song, queue }: SongCardProps) {
  const { playSong, isCurrentSong, isPlaying } = usePlaySong()

  const isCurrent = isCurrentSong(song)
  const isThisPlaying = isCurrent && isPlaying

  return (
    <article
      className={`group rounded-[1.5rem] border bg-sand/10 p-2.5 text-sand shadow-[0_18px_54px_rgba(0,0,0,0.24)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(0,0,0,0.32)] ${isCurrent
          ? "border-saffron/40 bg-saffron/6 shadow-[0_22px_70px_rgba(227,122,44,0.12)]"
          : "border-sand/12 hover:border-saffron/35 hover:bg-sand/12"
        }`}
    >
      <div className="rounded-[1.15rem] border border-sand/10 bg-charcoal/45 p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-saffron">
              <SlidersHorizontal className="size-3.5" aria-hidden="true" />
              {song.genrePreset}
            </p>
            <h2 className="mt-2 line-clamp-2 min-h-[3.25rem] text-xl font-black leading-tight text-sand">
              {song.title}
            </h2>
          </div>
          <SongStatusBadge status={song.status} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {song.instruments.map((instrument) => (
            <span
              key={instrument}
              className="rounded-full border border-sand/12 bg-sand/8 px-3 py-1 text-xs font-bold text-sand/72"
            >
              {instrument}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${song.isPublic
                ? "border-saffron/35 bg-saffron/12 text-saffron"
                : "border-sand/15 bg-sand/8 text-sand/62"
              }`}
          >
            {song.isPublic ? "Public" : "Private"}
          </span>
          <span className="text-xs font-semibold text-sand/45">
            {new Intl.DateTimeFormat("en", {
              month: "short",
              day: "numeric",
            }).format(new Date(song.createdAt))}
          </span>
        </div>

        <div className="mt-4">
          {/* Waveform animates when this specific song is playing */}
          <WaveformPlaceholder isActive={isThisPlaying} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => playSong(song, queue)}
            disabled={song.status !== "completed"}
            aria-label={`${isThisPlaying ? "Pause" : "Play"} ${song.title}`}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-black text-sand shadow-[0_12px_30px_rgba(227,122,44,0.22)] transition disabled:cursor-not-allowed disabled:opacity-50 ${isCurrent
                ? "bg-terracotta hover:bg-saffron"
                : "bg-saffron hover:bg-terracotta"
              }`}
          >
            {isThisPlaying ? (
              <Pause className="size-4 fill-current" aria-hidden="true" />
            ) : (
              <Play className="size-4 fill-current" aria-hidden="true" />
            )}
            {isThisPlaying ? "Pause" : "Play"}
          </button>
          <Link
            href={`/song/${song.id}`}
            aria-label={`Open ${song.title}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-sand/15 px-3 text-sm font-bold text-sand transition hover:bg-sand/10"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Open
          </Link>
          <button
            type="button"
            aria-label={`Remix ${song.title}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-sand/15 px-3 text-sm font-bold text-sand transition hover:bg-sand/10"
          >
            <RefreshCcw className="size-4" aria-hidden="true" />
            Remix
          </button>
          <button
            type="button"
            aria-label={`Share ${song.title}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-sand/15 px-3 text-sm font-bold text-sand transition hover:bg-sand/10"
          >
            <Share2 className="size-4" aria-hidden="true" />
            Share
          </button>
        </div>
      </div>
    </article>
  )
}

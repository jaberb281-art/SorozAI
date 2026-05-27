"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  ExternalLink,
  Globe2,
  Heart,
  Pause,
  Play,
  RefreshCcw,
  Share2,
  UserRound,
} from "lucide-react"

import { WaveformPlaceholder } from "@/components/songs/waveform-placeholder"
import { usePlaySong } from "@/hooks/use-play-song"
import type { Song } from "@/lib/types"

type PublicSongCardProps = {
  song: Song
  queue?: Song[]
}

export function PublicSongCard({ song, queue }: PublicSongCardProps) {
  const [liked, setLiked] = useState(false)
  const [message, setMessage] = useState("")
  const { playSong, isCurrentSong, isPlaying } = usePlaySong()
  const likeCount = liked ? song.likes + 1 : song.likes
  const isCurrent = isCurrentSong(song)
  const isThisPlaying = isCurrent && isPlaying

  return (
    <article className="group rounded-[1.5rem] border border-sand/12 bg-sand/10 p-2.5 text-sand shadow-[0_18px_54px_rgba(0,0,0,0.24)] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:border-terracotta/45 hover:bg-sand/12 hover:shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
      <div className="rounded-[1.15rem] border border-sand/10 bg-charcoal/45 p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-saffron">
              {song.genrePreset}
            </p>
            <h2 className="mt-2 line-clamp-2 min-h-[3.25rem] text-xl font-black leading-tight text-sand">
              {song.title}
            </h2>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-saffron/35 bg-saffron/12 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-saffron">
            <Globe2 className="size-3.5" aria-hidden="true" />
            Public
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-sand/10 bg-sand/7 p-2.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-terracotta/30 bg-terracotta/15 text-saffron">
            <UserRound className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-sand">
              ZahiRok Creator
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs font-semibold text-sand/55">
              <CalendarDays className="size-3.5 shrink-0 text-saffron" aria-hidden="true" />
              {formatCreatedDate(song.createdAt)}
            </p>
          </div>
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

        <div className="mt-4">
          <WaveformPlaceholder isActive={isThisPlaying} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <StatPill label="plays" value={song.plays.toString()} />
          <StatPill label="likes" value={likeCount.toString()} />
          <StatPill label="remixes" value={song.remixes.toString()} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          <button
            type="button"
            onClick={() => playSong(song, queue)}
            aria-pressed={isThisPlaying}
            aria-label={`${isThisPlaying ? "Pause" : "Play"} ${song.title}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-saffron px-3 text-sm font-black text-sand shadow-[0_12px_30px_rgba(227,122,44,0.22)] transition hover:bg-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            {isThisPlaying ? (
              <Pause className="size-4" aria-hidden="true" />
            ) : (
              <Play className="size-4" aria-hidden="true" />
            )}
            {isThisPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => setLiked((current) => !current)}
            aria-pressed={liked}
            aria-label={`${liked ? "Unlike" : "Like"} ${song.title}`}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal ${
              liked
                ? "bg-saffron text-sand shadow-[0_12px_30px_rgba(227,122,44,0.22)] hover:bg-terracotta"
                : "border border-sand/15 text-sand hover:bg-sand/10"
            }`}
          >
            <Heart
              className={`size-4 ${liked ? "fill-current" : ""}`}
              aria-hidden="true"
            />
            {liked ? "Liked" : "Like"}
          </button>
          <Link
            href={`/song/${song.id}`}
            aria-label={`Open ${song.title}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-sand/15 px-3 text-sm font-bold text-sand transition hover:bg-sand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Open
          </Link>
          <Link
            href="/create#composer"
            aria-label={`Remix ${song.title}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-sand/15 px-3 text-sm font-bold text-sand transition hover:bg-sand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            <RefreshCcw className="size-4" aria-hidden="true" />
            Remix
          </Link>
          <button
            type="button"
            onClick={() => setMessage("Share options will be connected later.")}
            aria-label={`Share ${song.title}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-sand/15 px-3 text-sm font-bold text-sand transition hover:bg-sand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            <Share2 className="size-4" aria-hidden="true" />
            Share
          </button>
        </div>

        {message ? (
          <p role="status" className="mt-4 rounded-2xl border border-saffron/25 bg-saffron/10 px-4 py-3 text-sm font-semibold text-saffron">
            {message}
          </p>
        ) : null}
      </div>
    </article>
  )
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-2xl border border-sand/10 bg-sand/7 px-3 py-2 text-center text-[11px] font-black uppercase tracking-[0.14em] text-sand/66">
      <span className="text-saffron">{value}</span> {label}
    </span>
  )
}

function formatCreatedDate(createdAt: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(createdAt))
}

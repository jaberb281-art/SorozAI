import { Download, Play, Radio, Share2 } from "lucide-react"

import type { Song } from "@/lib/types"
import { WaveformPlaceholder } from "@/components/songs/waveform-placeholder"

type SongPlayerProps = {
  song: Song
}

export function SongPlayer({ song }: SongPlayerProps) {
  return (
    <section className="rounded-[1.5rem] border border-sand/15 bg-sand/10 p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:p-3.5">
      <div className="rounded-[1.15rem] border border-sand/10 bg-charcoal/55 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-saffron">
              Mock Studio Player
            </p>
            <p className="mt-2 text-sm leading-6 text-sand/65">
              Preview-only UI for {song.title}. Real audio integration comes later.
            </p>
          </div>
          <button
            type="button"
            aria-label={`Play ${song.title}`}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-saffron px-5 text-sm font-black text-sand shadow-[0_16px_40px_rgba(227,122,44,0.26)] transition hover:bg-terracotta sm:w-auto"
          >
            <Play className="size-4" aria-hidden="true" />
            Play
          </button>
        </div>

        <div className="mt-4">
          <WaveformPlaceholder density="large" isActive />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.18em] text-sand/48">
          <span>0:00</span>
          <span className="hidden items-center gap-2 sm:inline-flex">
            <Radio className="size-4 text-saffron" aria-hidden="true" />
            Studio render
          </span>
          <span>{song.duration}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            aria-label={`Download ${song.title} as MP3`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-sand/15 px-4 py-3 text-sm font-bold text-sand transition hover:bg-sand/10 sm:flex-none"
          >
            <Download className="size-4" aria-hidden="true" />
            Download MP3
          </button>
          <button
            type="button"
            aria-label={`Download ${song.title} as WAV`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-sand/15 px-4 py-3 text-sm font-bold text-sand transition hover:bg-sand/10 sm:flex-none"
          >
            <Download className="size-4" aria-hidden="true" />
            Download WAV
          </button>
          <button
            type="button"
            aria-label={`Share ${song.title}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-4 py-3 text-sm font-bold text-saffron transition hover:bg-saffron/15 sm:flex-none"
          >
            <Share2 className="size-4" aria-hidden="true" />
            Share
          </button>
        </div>
      </div>
    </section>
  )
}

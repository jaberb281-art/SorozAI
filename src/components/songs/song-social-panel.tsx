"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Copy,
  Flag,
  Globe2,
  Heart,
  Lock,
  MessageCircle,
  Play,
  RefreshCcw,
  Share2,
  Sparkles,
} from "lucide-react"

import type { Song } from "@/lib/types"

type SongSocialPanelProps = {
  song: Song
}

const comments = [
  "This sounds like home.",
  "The Suroz feeling is beautiful.",
]

export function SongSocialPanel({ song }: SongSocialPanelProps) {
  const [liked, setLiked] = useState(false)
  const [message, setMessage] = useState("")
  const likes = liked ? song.likes + 1 : song.likes

  async function handleCopyLink() {
    const fallbackPath = `/song/${song.id}`

    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${window.location.origin}${fallbackPath}`)
        setMessage("Song link copied.")
        return
      }
    } catch {
      // Fall through to the placeholder message.
    }

    setMessage("Copy link will be connected later.")
  }

  function showPlaceholder(nextMessage: string) {
    setMessage(nextMessage)
  }

  return (
    <section className="rounded-[1.5rem] border border-terracotta/22 bg-terracotta/8 p-2.5 shadow-[0_18px_52px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
      <div className="rounded-[1.15rem] border border-sand/10 bg-charcoal/50 p-3.5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-sand/50">
          Community
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatPill label="plays" value={song.plays.toString()} icon={<Play className="size-3.5" />} />
          <StatPill label="likes" value={likes.toString()} icon={<Heart className="size-3.5" />} />
          <StatPill label="remixes" value={song.remixes.toString()} icon={<RefreshCcw className="size-3.5" />} />
          <span
            className={`inline-flex items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-black uppercase tracking-[0.16em] ${
              song.isPublic
                ? "border-saffron/35 bg-saffron/12 text-saffron"
                : "border-sand/15 bg-sand/8 text-sand/68"
            }`}
          >
            {song.isPublic ? (
              <Globe2 className="size-3.5" aria-hidden="true" />
            ) : (
              <Lock className="size-3.5" aria-hidden="true" />
            )}
            {song.isPublic ? "Public" : "Private"}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setLiked((current) => !current)}
            aria-pressed={liked}
            aria-label={`${liked ? "Unlike" : "Like"} ${song.title}`}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-black transition ${
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
          <button
            type="button"
            onClick={() => showPlaceholder("Share options will be connected later.")}
            aria-label={`Share ${song.title}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-sand/15 px-3 py-2.5 text-sm font-bold text-sand transition hover:bg-sand/10"
          >
            <Share2 className="size-4" aria-hidden="true" />
            Share
          </button>
          <Link
            href="/create#composer"
            aria-label={`Remix ${song.title}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-sand/15 px-3 py-2.5 text-sm font-bold text-sand transition hover:bg-sand/10"
          >
            <RefreshCcw className="size-4" aria-hidden="true" />
            Remix
          </Link>
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={`Copy link to ${song.title}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-sand/15 px-3 py-2.5 text-sm font-bold text-sand transition hover:bg-sand/10"
          >
            <Copy className="size-4" aria-hidden="true" />
            Copy Link
          </button>
          <button
            type="button"
            onClick={() => showPlaceholder("Report flow will be connected later.")}
            aria-label={`Report ${song.title}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-sand/15 px-3 py-2.5 text-sm font-bold text-sand transition hover:bg-sand/10"
          >
            <Flag className="size-4" aria-hidden="true" />
            Report
          </button>
          {song.isPublic ? (
            <Link
              href="/feed"
              aria-label={`View ${song.title} in Feed`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-3 py-2.5 text-sm font-bold text-saffron transition hover:bg-saffron/15"
            >
              <Globe2 className="size-4" aria-hidden="true" />
              View in Feed
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => showPlaceholder("Publishing will be connected later.")}
              aria-label={`Post ${song.title} to Feed`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-3 py-2.5 text-sm font-bold text-saffron transition hover:bg-saffron/15"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Post to Feed
            </button>
          )}
        </div>

        {message ? (
          <p role="status" className="mt-4 rounded-2xl border border-saffron/25 bg-saffron/10 px-4 py-3 text-sm font-semibold text-saffron">
            {message}
          </p>
        ) : null}

        <div className="mt-4 rounded-[1.15rem] border border-sand/10 bg-sand/7 p-3.5">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-4 text-saffron" aria-hidden="true" />
            <h2 className="text-lg font-black text-sand">
              Community comments
            </h2>
          </div>

          <div className="mt-4 grid gap-3">
            {comments.map((comment) => (
              <article
                key={comment}
                className="rounded-2xl border border-sand/10 bg-charcoal/40 px-4 py-3"
              >
                <p className="text-sm font-semibold leading-6 text-sand/78">
                  {comment}
                </p>
              </article>
            ))}
          </div>

          <label className="mt-4 block">
            <span className="sr-only">Write a comment</span>
            <input
              placeholder="Write a comment..."
              className="h-11 w-full rounded-full border border-sand/15 bg-sand/8 px-4 text-sm font-semibold text-sand outline-none transition placeholder:text-sand/45 focus:border-saffron/55 focus:bg-sand/10"
            />
          </label>
          <button
            type="button"
            onClick={() => showPlaceholder("Comments will be connected later.")}
            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full bg-saffron px-4 text-sm font-black text-sand transition hover:bg-terracotta"
          >
            Post comment
          </button>
        </div>
      </div>
    </section>
  )
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <span className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-sand/10 bg-sand/7 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-sand/68">
      <span className="text-saffron" aria-hidden="true">{icon}</span>
      {value} {label}
    </span>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import {
  Ban,
  ChevronRight,
  Clipboard,
  Flag,
  Heart,
  MoreHorizontal,
  Music,
  Play,
  Share2,
  User,
  Users,
} from "lucide-react"

import { getPublicProfile, type PublicProfile } from "@/lib/public-profiles"

export default function PublicProfilePage() {
  const params = useParams<{ handle: string }>()
  const profile = getPublicProfile(params.handle)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!isMoreOpen) return

    function closeOnOutsideClick(event: PointerEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false)
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMoreOpen(false)
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [isMoreOpen])

  useEffect(() => {
    if (!notice) return

    const timeoutId = window.setTimeout(() => {
      setNotice(null)
    }, 2600)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [notice])

  async function copyProfileLink(message = "Profile link copied.") {
    const url = typeof window !== "undefined"
      ? window.location.href
      : `https://zahirok.ai/${profile.handle}`

    try {
      await navigator.clipboard.writeText(url)
      setNotice(message)
    } catch {
      setNotice("Profile link ready to copy.")
    }
  }

  function handleMoreNotice(message: string) {
    setNotice(message)
    setIsMoreOpen(false)
  }

  return (
    <div className="relative min-h-dvh w-full max-w-full overflow-x-hidden bg-[#090909] text-sand">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#090909_0%,#15110f_42%,#090909_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(90deg,rgba(237,227,211,0.34)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.24)_1px,transparent_1px)] [background-size:32px_32px]" />

      <main className="relative z-10 mx-auto w-full max-w-[1180px] px-4 pb-6 pt-5 md:px-6 md:pt-7 lg:px-8 lg:pb-8">
        <section className="relative min-h-[220px] overflow-hidden rounded-[28px] border border-sand/10 bg-[#171314] shadow-[0_28px_80px_rgba(0,0,0,0.38)] md:min-h-[300px]">
          <div
            className="absolute inset-0"
            style={{ background: profile.bannerGradient }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,rgba(255,73,170,0.5),transparent_24%),radial-gradient(circle_at_80%_22%,rgba(255,224,104,0.34),transparent_30%),linear-gradient(to_top,rgba(9,9,9,0.72),transparent_58%)]" aria-hidden="true" />

          <div className="relative flex min-h-[220px] flex-col justify-end gap-6 p-5 sm:p-7 md:min-h-[300px] lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 items-end gap-4">
              <PublicAvatar profile={profile} className="size-20 md:size-24" />
              <div className="min-w-0 pb-1">
                <h1 className="truncate text-3xl font-black tracking-tight text-white md:text-5xl">
                  {profile.displayName}
                </h1>
                <p className="mt-1 text-sm font-bold text-white/82">{profile.handle}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-white/78">
                  <Play className="size-3 fill-current" aria-hidden="true" />
                  {profile.plays}
                  <Heart className="ml-1 size-3 fill-current" aria-hidden="true" />
                  {formatCount(profile.likes)}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:pb-1">
              <button
                type="button"
                aria-pressed={isFollowing}
                onClick={() => setIsFollowing((value) => !value)}
                className={`inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-sm font-black shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron sm:flex-none ${
                  isFollowing
                    ? "bg-white text-charcoal hover:bg-saffron hover:text-white"
                    : "bg-black/24 text-white hover:bg-black/34"
                }`}
              >
                <User className="size-4" aria-hidden="true" />
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button
                type="button"
                aria-label={`Play ${profile.displayName} songs`}
                onClick={() => setNotice("Profile playback coming soon.")}
                className="inline-flex size-14 items-center justify-center rounded-full bg-white text-charcoal shadow-[0_14px_36px_rgba(0,0,0,0.24)] transition hover:bg-saffron hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
              >
                <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <StatPill icon={<Music className="size-3.5" aria-hidden="true" />} label={`${profile.songs.length} songs`} />
            <StatPill icon={<User className="size-3.5" aria-hidden="true" />} label={`${profile.followers} followers`} />
            <StatPill icon={<Users className="size-3.5" aria-hidden="true" />} label={`${profile.following} following`} />
          </div>

          <div className="relative flex items-center gap-2 self-start md:self-auto" ref={moreMenuRef}>
            <button
              type="button"
              aria-label="Open profile actions"
              aria-expanded={isMoreOpen}
              aria-haspopup="menu"
              onClick={() => setIsMoreOpen((value) => !value)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-sand/8 bg-sand/8 text-sand/78 transition hover:bg-sand/12 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
            >
              <MoreHorizontal className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Share profile"
              onClick={() => copyProfileLink()}
              className="inline-flex size-11 items-center justify-center rounded-full border border-sand/8 bg-sand/8 text-sand/78 transition hover:bg-sand/12 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
            >
              <Share2 className="size-4.5" aria-hidden="true" />
            </button>

            {isMoreOpen ? (
              <div
                role="menu"
                aria-label="Public profile actions"
                className="absolute right-0 top-12 z-30 w-[min(210px,calc(100vw-2rem))] rounded-lg border border-white/8 bg-[#242428] py-1.5 shadow-[0_20px_56px_rgba(0,0,0,0.48)]"
              >
                <ActionMenuButton
                  icon={<Clipboard className="size-4" aria-hidden="true" />}
                  label="Copy profile link"
                  onClick={() => {
                    setIsMoreOpen(false)
                    void copyProfileLink()
                  }}
                />
                <ActionMenuButton
                  icon={<Flag className="size-4" aria-hidden="true" />}
                  label="Report profile"
                  onClick={() => handleMoreNotice("Report profile coming soon.")}
                />
                <ActionMenuButton
                  icon={<Ban className="size-4" aria-hidden="true" />}
                  label="Block user"
                  onClick={() => handleMoreNotice("Block user coming soon.")}
                />
              </div>
            ) : null}
          </div>
        </section>

        {notice ? (
          <p
            role="status"
            className="mt-4 inline-flex rounded-full border border-saffron/20 bg-saffron/10 px-4 py-2 text-sm font-black text-saffron"
          >
            {notice}
          </p>
        ) : null}

        <PublicSongsSection profile={profile} />
        <PublicPlaylistsSection profile={profile} />
        <PublicAboutSection
          profile={profile}
          isFollowing={isFollowing}
          onFollow={() => setIsFollowing((value) => !value)}
        />
      </main>
    </div>
  )
}

function PublicSongsSection({ profile }: { profile: PublicProfile }) {
  return (
    <section className="mt-12">
      <h2 className="inline-flex items-center gap-1 text-lg font-black text-white">
        Songs
        <ChevronRight className="size-5 text-sand/60" aria-hidden="true" />
      </h2>

      <div className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
        {profile.songs.map((song) => (
          <button
            key={song.title}
            type="button"
            className="flex min-w-0 items-center gap-3 rounded-lg p-1 text-left transition hover:bg-sand/7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
          >
            <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[#201816]">
              {song.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={song.coverImage}
                  alt={`${song.title} cover artwork`}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-black text-white">{song.title}</span>
                <span className="shrink-0 rounded border border-sand/14 bg-sand/8 px-1.5 py-0.5 text-[10px] font-black text-saffron">
                  {song.version}
                </span>
              </span>
              <span className="mt-1 flex items-center gap-1 text-xs font-bold text-sand/52">
                <Play className="size-2.5 fill-current" aria-hidden="true" />
                {song.plays} · {song.style}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function PublicPlaylistsSection({ profile }: { profile: PublicProfile }) {
  return (
    <section className="mt-14">
      <h2 className="inline-flex items-center gap-1 text-lg font-black text-white">
        Playlists
        <ChevronRight className="size-5 text-sand/60" aria-hidden="true" />
      </h2>
      <div className="mt-6 flex flex-wrap gap-5">
        {profile.playlists.map((playlist) => (
          <button
            key={playlist.title}
            type="button"
            className="w-[160px] rounded-lg p-1 text-left transition hover:bg-sand/7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
          >
            <span className="block size-16 overflow-hidden rounded-lg bg-[#201816]">
              {playlist.coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={playlist.coverImage}
                  alt={`${playlist.title} playlist artwork`}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </span>
            <span className="mt-2 block truncate text-sm font-black text-white">{playlist.title}</span>
            <span className="mt-0.5 block text-xs font-semibold text-sand/48">{playlist.count}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function PublicAboutSection({
  isFollowing,
  onFollow,
  profile,
}: {
  isFollowing: boolean
  onFollow: () => void
  profile: PublicProfile
}) {
  return (
    <section className="mt-14">
      <h2 className="text-lg font-black text-white">About</h2>
      <div className="mt-4 rounded-[28px] border border-sand/8 bg-sand/8 p-5 shadow-[0_18px_52px_rgba(0,0,0,0.22)] md:p-8">
        <div className="grid gap-8 md:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] md:items-center">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <PublicAvatar profile={profile} className="size-24 md:size-28" />
            <div className="min-w-0">
              <h3 className="truncate text-2xl font-black text-white md:text-3xl">
                {profile.displayName}
              </h3>
              <button
                type="button"
                aria-pressed={isFollowing}
                onClick={onFollow}
                className={`mt-3 inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${
                  isFollowing
                    ? "bg-saffron text-white hover:bg-terracotta"
                    : "bg-white text-charcoal hover:bg-saffron hover:text-white"
                }`}
              >
                <User className="size-3.5" aria-hidden="true" />
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          <div>
            {profile.bio ? (
              <p className="text-sm font-bold leading-6 text-sand/62">{profile.bio}</p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-sand/14 bg-sand/8 px-3 py-1 text-xs font-black text-sand/72"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PublicAvatar({
  className,
  profile,
}: {
  className: string
  profile: PublicProfile
}) {
  return (
    <span
      className={`shrink-0 rounded-full border border-white/18 shadow-[0_14px_42px_rgba(0,0,0,0.34)] ${className}`}
      style={{ background: profile.avatarGradient }}
      aria-hidden="true"
    />
  )
}

function StatPill({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <span className="inline-flex h-10 items-center gap-2 rounded-full border border-sand/8 bg-sand/8 px-4 text-sm font-black text-white">
      {icon}
      {label}
    </span>
  )
}

function ActionMenuButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex h-11 w-full items-center gap-3 px-4 text-left text-sm font-black text-sand/88 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-saffron"
    >
      <span className="text-sand/52">{icon}</span>
      {label}
    </button>
  )
}

function formatCount(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
  return value.toString()
}

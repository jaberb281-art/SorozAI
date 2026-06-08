"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ChangeEvent } from "react"
import { useEffect, useRef, useState } from "react"
import {
  AudioLines,
  Dice5,
  Minus,
  Music2,
  Play,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Upload,
  WandSparkles,
} from "lucide-react"

import { formatCount, getFeedSongs } from "@/lib/mock-songs"

const showcaseSongs = getFeedSongs().slice(0, 6)

const floatingCards = [
  {
    title: "Makran Nightfall",
    creator: "Zareena Sajid",
    coverImage: "/covers/makran-evening.png",
    className: "-left-4 top-[46%] -rotate-[7deg] xl:left-[2%]",
  },
  {
    title: "Doholl Wedding",
    creator: "Meerali Gwadar",
    coverImage: "/covers/wedding-doholl.png",
    className: "-right-4 top-[46%] rotate-[6deg] xl:right-[2%]",
  },
  {
    title: "Suroz Breath",
    creator: "Noor Dehwar",
    coverImage: "/covers/sufi-dambora.png",
    className: "hidden",
  },
]

const proofLabels = [
  "Balochi Vocals",
  "Dambora",
  "Doholl",
  "Suroz",
  "Makran Dialect",
  "Coastal Folk",
]

const features = [
  {
    title: "Start with a simple prompt",
    body: "Describe a mood, story, or place. Zahirok helps turn it into a song idea.",
    visual: "prompt",
  },
  {
    title: "Built around Balochi sound",
    body: "Use styles inspired by dambora, dohol, suroz, folk vocals, and coastal rhythms.",
    visual: "sound",
  },
  {
    title: "Create and share",
    body: "Draft songs, explore community creations, and save ideas to your workspace.",
    visual: "share",
  },
  {
    title: "Advanced creation controls",
    body: "Adjust lyrics, styles, vocal gender, weirdness, and style influence.",
    visual: "controls",
  },
  {
    title: "Hooks for short videos",
    body: "Create short musical moments for reels, stories, and cinematic previews.",
    visual: "hooks",
  },
  {
    title: "A future studio for creators",
    body: "Studio tools, remixing, stems, and collaboration can grow into the full Zahirok workflow.",
    visual: "studio",
  },
]

const faqs = [
  {
    question: "What is Zahirok AI?",
    answer:
      "Zahirok AI is a Balochi-focused music creation interface for turning prompts, lyrics, and styles into song ideas.",
  },
  {
    question: "Is Zahirok only for Balochi music?",
    answer:
      "The first release focuses on Balochi music and Makkuran-style creation, but the system can expand over time.",
  },
  {
    question: "Can I upload or record audio?",
    answer:
      "Upload and record flows are currently frontend mock features. Real audio workflows can be connected later.",
  },
  {
    question: "Do I need music experience?",
    answer:
      "No. You can start with a simple idea, then refine lyrics, style, and options.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Current frontend flows are demo/mock. Pricing and real credits can be connected later.",
  },
]

const footerLinks = [
  { label: "Create", href: "/create" },
  { label: "Explore", href: "/feed" },
  { label: "Library", href: "/library" },
  { label: "Pricing", href: "/pricing" },
  { label: "Terms", href: "/terms" },
]

export default function HomePage() {
  return (
    <main className="min-h-dvh w-full max-w-full overflow-x-hidden bg-[#0d0d0f] text-sand">
      <LandingNavbar />
      <LandingHero />
      <ProofStrip />
      <SongShowcaseSection />
      <FeatureGridSection />
      <FaqSection />
      <FinalCtaSection />
      <LandingFooter />
    </main>
  )
}

function LandingNavbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
        <Link
          href="/"
          aria-label="Zahirok home"
          className="flex min-w-0 items-center gap-2 sm:gap-2.5"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-saffron/30 bg-saffron/10 text-saffron shadow-[0_0_28px_rgba(227,122,44,0.18)] sm:size-10">
            <Music2 className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-black uppercase tracking-[0.14em] text-white sm:text-2xl sm:tracking-[0.18em]">
            Zahirok
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/auth/sign-in"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/12 bg-black/10 px-3 text-sm font-bold text-white/88 backdrop-blur-xl transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:h-12 sm:px-5"
          >
            Log in
          </Link>
          <Link
            href="/auth/sign-up"
            className="inline-flex h-10 items-center justify-center rounded-full [background:var(--gradient-brand)] px-3 text-sm font-black text-white shadow-[0_14px_36px_rgba(227,122,44,0.28)] transition hover:[background:var(--gradient-brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:h-12 sm:px-6"
          >
            <span className="hidden sm:inline">Join Zahirok for free</span>
            <span className="sm:hidden">Join free</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}

function LandingHero() {
  return (
    <section className="relative isolate flex min-h-[min(760px,86dvh)] items-center overflow-hidden bg-balochi-pattern-faint px-4 pb-8 pt-24 text-center sm:px-6 sm:pb-10 sm:pt-28 lg:px-8">
      <div className="absolute inset-0 -z-30 bg-[#0c0b0b]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/zahirok-hero-bg.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_26%,rgba(227,122,44,0.3),transparent_23%),radial-gradient(circle_at_18%_18%,rgba(255,60,160,0.18),transparent_24%),radial-gradient(circle_at_84%_22%,rgba(26,58,92,0.48),transparent_30%),linear-gradient(180deg,rgba(12,12,14,0.34)_0%,rgba(12,12,14,0.72)_62%,#0d0d0f_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(rgba(237,227,211,0.65)_1px,transparent_1px)] [background-size:3px_3px]" />

      <div className="pointer-events-none absolute inset-0 hidden xl:block">
        {floatingCards.map((card) => (
          <FloatingSongCard key={card.title} {...card} />
        ))}
      </div>

      <div className="relative z-10 mx-auto min-w-0 w-full max-w-5xl">
        <h1 className="mx-auto max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl xl:text-7xl">
          Make any Balochi song you can imagine
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-6 text-white/72 sm:text-base sm:leading-7">
          Start with a simple idea. Zahirok turns your words, mood, and dialect into a song draft.
        </p>

        <HeroComposer />
      </div>
    </section>
  )
}

function HeroComposer() {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [prompt, setPrompt] = useState("")
  const [notice, setNotice] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isMenuOpen])

  function openCreate() {
    const trimmed = prompt.trim()
    setNotice("")
    router.push(trimmed ? `/create?prompt=${encodeURIComponent(trimmed)}` : "/create")
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setNotice(`${file.name} - Mock upload`)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        openCreate()
      }}
      className="mx-auto mt-6 w-full max-w-[900px] rounded-2xl border border-white/10 bg-black/40 p-3 text-left shadow-[0_20px_58px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-4 lg:p-5"
    >
      <label className="sr-only" htmlFor="landing-prompt">
        Chat to make Balochi music
      </label>
      <textarea
        id="landing-prompt"
        value={prompt}
        onChange={(event) => {
          setPrompt(event.target.value)
          setNotice("")
        }}
        rows={1}
        placeholder="Chat to make Balochi music"
        className="h-10 max-h-10 min-h-10 w-full resize-none bg-transparent text-base font-bold leading-6 text-white outline-none placeholder:text-white/36 sm:h-14 sm:max-h-14 sm:min-h-14"
      />

      <div className="mt-2 flex h-11 items-center justify-between gap-2 border-t border-white/8 pt-2 sm:h-12">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-label="Add audio options"
              aria-expanded={isMenuOpen}
              aria-controls="landing-audio-options"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex size-9 items-center justify-center rounded-full bg-white/8 text-white/78 transition hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:size-10"
            >
              <Plus className="size-4 sm:size-5" aria-hidden="true" />
            </button>
            {isMenuOpen && (
              <div
                id="landing-audio-options"
                role="menu"
                aria-label="Audio options"
                className="absolute bottom-full left-0 z-30 mb-2 w-40 rounded-xl border border-white/12 bg-[#141416] p-1.5 text-sm font-bold text-white shadow-[0_20px_54px_rgba(0,0,0,0.5)]"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false)
                    fileInputRef.current?.click()
                  }}
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-white/82 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                >
                  <Upload className="size-4 text-white/55 transition group-hover:text-saffron" aria-hidden="true" />
                  Upload
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setNotice("Recording feature coming soon.")
                  }}
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-white/82 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                >
                  <AudioLines className="size-4 text-white/55 transition group-hover:text-saffron" aria-hidden="true" />
                  Record
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white/9 px-3 text-xs font-black text-white/82 transition hover:bg-white/13 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Advanced
          </button>

          {notice && (
            <p role="status" className="sr-only min-w-0 truncate rounded-full border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-xs font-bold text-saffron sm:not-sr-only sm:block">
              {notice}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <button
            type="button"
            aria-label="Randomize prompt"
            onClick={() => {
              setPrompt("A Zahirok song about Makran evenings, dohol rhythm, and a coastal wedding")
              setNotice("")
            }}
            className="inline-flex size-9 items-center justify-center rounded-full bg-white/8 text-white/76 transition hover:bg-white/12 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:size-10"
          >
            <Dice5 className="size-4 sm:size-5" aria-hidden="true" />
          </button>
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full [background:var(--gradient-brand)] px-3 text-xs font-black text-white shadow-[0_14px_28px_rgba(227,122,44,0.3)] transition hover:[background:var(--gradient-brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <WandSparkles className="size-4" aria-hidden="true" />
            Create
          </button>
        </div>
      </div>
    </form>
  )
}

function FloatingSongCard({
  className,
  coverImage,
  creator,
  title,
}: {
  className: string
  coverImage: string
  creator: string
  title: string
}) {
  return (
    <div className={`absolute w-48 rounded-[1.25rem] border border-white/10 bg-white/[0.08] p-2.5 shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl xl:w-52 ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.05rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverImage} alt="" aria-hidden="true" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex size-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur">
          <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
        </span>
        <div className="absolute inset-x-3 bottom-3">
          <p className="text-sm font-black text-white">{title}</p>
          <p className="mt-0.5 text-xs font-bold text-white/62">{creator}</p>
        </div>
      </div>
    </div>
  )
}

function ProofStrip() {
  return (
    <section className="border-y border-white/[0.06] bg-[#0f0f11] px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
        <p className="w-full text-xs font-black uppercase tracking-[0.28em] text-white/28 sm:w-auto">
          Built for Balochi creators
        </p>
        {proofLabels.map((label) => (
          <span key={label} className="text-sm font-black text-white/55 sm:text-base">
            {label}
          </span>
        ))}
      </div>
    </section>
  )
}

function SongShowcaseSection() {
  return (
    <section className="bg-[#111113] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <SectionHeading
        title="Balochi music ideas, instantly shaped into sound"
        body="From wedding rhythms to coastal folk, explore song drafts inspired by Balochistan's sound."
        align="center"
      />

      <div className="mx-auto mt-10 flex max-w-[1500px] snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] sm:mt-12 sm:gap-5 [&::-webkit-scrollbar]:hidden">
        {showcaseSongs.map((song) => (
          <ShowcaseCard key={song.id} song={song} />
        ))}
      </div>
    </section>
  )
}

function ShowcaseCard({ song }: { song: (typeof showcaseSongs)[number] }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setIsPlaying((playing) => !playing)}
      className="group w-[min(78vw,260px)] shrink-0 snap-start text-left outline-none sm:w-[280px] lg:w-[300px]"
      aria-label={`${isPlaying ? "Pause" : "Play"} ${song.title}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-saffron">
        {song.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={song.coverImage} alt={`${song.title} cover`} className="h-full w-full object-cover" />
        ) : (
          <div className={`h-full w-full ${song.coverClass}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent" />
        <span className="absolute left-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-white/16 text-white backdrop-blur-md">
          {isPlaying ? (
            <AudioLines className="size-5" aria-hidden="true" />
          ) : (
            <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
          )}
        </span>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="rounded-lg bg-black/40 px-2.5 py-1.5 text-xs font-black text-white backdrop-blur">
            <Play className="mr-1 inline size-3 fill-current align-[-1px]" aria-hidden="true" />
            {formatCount(song.plays)}
          </span>
          <span className="rounded-lg bg-black/40 px-2.5 py-1.5 text-xs font-black text-white backdrop-blur">
            {formatCount(song.likes)} likes
          </span>
        </div>
      </div>
      <h3 className="mt-4 truncate text-lg font-black text-white">{song.title}</h3>
      <p className="mt-1 text-sm font-bold text-white/48">{song.creator}</p>
    </button>
  )
}

function FeatureGridSection() {
  return (
    <section className="bg-[#111113] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Everything you need to make Balochi music your way"
          body="A cinematic creation surface for prompt writing, style shaping, hooks, and future studio workflows."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  body,
  title,
  visual,
}: {
  body: string
  title: string
  visual: string
}) {
  return (
    <article className="flex min-h-[300px] flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:min-h-[340px] sm:p-6">
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="mt-4 text-sm font-semibold leading-6 text-white/58">{body}</p>
      <FeatureVisual type={visual} />
    </article>
  )
}

function FeatureVisual({ type }: { type: string }) {
  if (type === "prompt") {
    return (
      <div className="mt-auto flex items-center justify-center pb-2 pt-8 sm:pt-10">
        <div className="grid size-32 place-items-center rounded-full bg-[radial-gradient(circle,#e37a2c_0%,#b73e1f_45%,rgba(227,122,44,0.04)_70%)] shadow-[0_0_0_14px_rgba(227,122,44,0.08),0_0_60px_rgba(227,122,44,0.24)] sm:size-36 sm:shadow-[0_0_0_16px_rgba(227,122,44,0.08),0_0_60px_rgba(227,122,44,0.24)]">
          <Sparkles className="size-11 text-white" aria-hidden="true" />
        </div>
      </div>
    )
  }

  if (type === "studio") {
    return (
      <div className="mt-auto pt-8 sm:pt-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cards/explore-public-songs.png" alt="" aria-hidden="true" className="h-32 w-full rounded-xl object-cover opacity-82 sm:h-40" />
      </div>
    )
  }

  if (type === "controls") {
    return (
      <div className="mt-auto space-y-4 pt-8 sm:pt-10">
        {["Vocal color", "Weirdness", "Style influence"].map((label, index) => (
          <div key={label}>
            <div className="flex items-center justify-between text-[var(--text-micro)] font-black uppercase tracking-[0.14em] text-white/40">
              <span>{label}</span>
              <span>{index === 0 ? "Warm" : "50%"}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/8">
              <div className="h-full rounded-full [background:var(--gradient-brand)]" style={{ width: `${52 + index * 12}%` }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === "hooks") {
    return (
      <div className="mt-auto flex justify-center pt-8 sm:pt-10">
        <div className="relative h-40 w-28 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(227,122,44,0.54),rgba(12,12,14,0.95))] sm:h-44 sm:w-32">
          <div className="absolute inset-x-4 bottom-5 h-16 rounded-full bg-saffron/40 blur-xl" />
          <Play className="absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 fill-current text-white" aria-hidden="true" />
        </div>
      </div>
    )
  }

  if (type === "share") {
    return (
      <div className="relative mt-auto h-40 pt-8 sm:h-44 sm:pt-10">
        <div className="absolute bottom-6 left-2 rounded-xl bg-indigo-deep px-5 py-3 text-xl font-black text-white shadow-xl sm:left-3 sm:px-6 sm:py-4 sm:text-2xl">1k</div>
        <div className="absolute bottom-12 left-20 rounded-xl [background:var(--gradient-brand)] px-7 py-5 text-2xl font-black text-white shadow-xl sm:left-24 sm:px-8 sm:py-6 sm:text-3xl">5k</div>
        <div className="absolute bottom-20 right-2 rounded-xl bg-terracotta px-5 py-3 text-xl font-black text-white shadow-xl sm:right-4 sm:px-6 sm:py-4 sm:text-2xl">13k</div>
      </div>
    )
  }

  return (
    <div className="mt-auto pt-8 sm:pt-10">
      <div className="grid gap-3">
        <div className="h-12 rounded-lg bg-[linear-gradient(90deg,#0c7df2,#1188ff)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">Vocals</div>
        <div className="ml-10 h-12 rounded-lg bg-saffron px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#171717]">Doholl</div>
        <div className="ml-14 h-12 rounded-lg bg-[#08b45b] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white sm:ml-20">Dambora</div>
      </div>
    </div>
  )
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="bg-[#101012] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="Frequently asked questions"
          body="Everything you need to know about creating with Zahirok."
          align="center"
        />

        <div className="mt-10 divide-y divide-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={faq.question} className="py-1">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-black text-white transition hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:py-6 sm:text-lg"
                >
                  {faq.question}
                  {isOpen ? (
                    <Minus className="size-5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Plus className="size-5 shrink-0" aria-hidden="true" />
                  )}
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm font-semibold leading-6 text-white/56 sm:pb-6 sm:text-base sm:leading-7">
                    {faq.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section className="bg-[#101012] px-4 pb-16 pt-2 text-center sm:px-6 sm:pb-20 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(227,122,44,0.2),transparent_32%),rgba(255,255,255,0.045)] px-5 py-12 shadow-[0_28px_90px_rgba(0,0,0,0.28)] sm:rounded-[2rem] sm:px-6 sm:py-16">
        <h2 className="text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-6xl">
          Ready to make your first Zahirok track?
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/auth/sign-up"
            className="inline-flex h-12 w-full items-center justify-center rounded-full [background:var(--gradient-brand)] px-7 text-sm font-black text-white shadow-[0_18px_42px_rgba(227,122,44,0.28)] transition hover:[background:var(--gradient-brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:w-auto"
          >
            Join Zahirok for free
          </Link>
          <Link
            href="/create"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/12 bg-white/[0.055] px-7 text-sm font-black text-white transition hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:w-auto"
          >
            Explore the demo
          </Link>
        </div>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0d0d0f] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full border border-saffron/30 bg-saffron/10 text-saffron">
              <Music2 className="size-4" aria-hidden="true" />
            </span>
            <span className="text-lg font-black uppercase tracking-[0.18em] text-white">Zahirok</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-white/42">
            (c) 2026 Zahirok AI. Built for Balochi creators.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-white/48">
          {footerLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

function SectionHeading({
  align = "left",
  body,
  title,
}: {
  align?: "left" | "center"
  body: string
  title: string
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
      <h2 className="text-3xl font-black leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl lg:text-7xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-white/58 sm:mt-6 sm:text-xl sm:leading-8">
        {body}
      </p>
    </div>
  )
}

import Link from "next/link"
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Mic2,
  Music2,
  PenLine,
  Play,
  Radio,
  SlidersHorizontal,
  Sparkles,
  SquarePlay,
  Waves,
} from "lucide-react"

import { LandingPrompt } from "@/components/home/landing-prompt"

// ── Data ────────────────────────────────────────────────────────────────────

const exampleSongs = [
  {
    title: "Makran Evening",
    genre: "Zahirok",
    instruments: "Suroz + Damboora",
    duration: "3:18",
    stats: "35K plays · 606 likes",
    coverImage: "/covers/makran-evening.png",
  },
  {
    title: "Desert Pulse",
    genre: "Hip-Hop Fusion",
    instruments: "Drums + Bass",
    duration: "2:58",
    stats: "16K plays · 461 likes",
    coverImage: "/covers/desert-pulse.png",
  },
  {
    title: "Wedding Doholl Nights",
    genre: "Wedding",
    instruments: "Doholl + Rubab",
    duration: "3:05",
    stats: "22K plays · 549 likes",
    coverImage: "/covers/wedding-doholl.png",
  },
  {
    title: "Sufi Breath",
    genre: "Sufi",
    instruments: "Damboora + Suroz",
    duration: "4:01",
    stats: "27K plays · 642 likes",
    coverImage: "/covers/sufi-dambora.png",
  },
]

const productRoutes = [
  {
    title: "Create from a prompt",
    body: "Write a memory, mood, or lyric and turn it into a Balochi-inspired song.",
    href: "/create",
    icon: PenLine,
  },
  {
    title: "Explore public songs",
    body: "Discover what the Zahirok community is creating across genres and styles.",
    href: "/feed",
    icon: Compass,
  },
  {
    title: "Try Hooks",
    body: "Browse short music previews in a TikTok-style viewer with swipe navigation.",
    href: "/hooks",
    icon: SquarePlay,
  },
  {
    title: "Open Studio",
    body: "Advanced multi-track creation tools for serious Balochi producers.",
    href: "/studio",
    icon: SlidersHorizontal,
  },
]

const features = [
  {
    title: "Prompt-first creation",
    body: "Write a memory, poem, or lyric idea and Zahirok shapes it into a song direction.",
    icon: PenLine,
  },
  {
    title: "Balochi genre presets",
    body: "Start with Zahirok, wedding, Sufi, lullaby, or modern fusion styles rooted in Makkuran tradition.",
    icon: Music2,
  },
  {
    title: "Traditional instruments",
    body: "Shape your sound with Suroz, Damboora, Rubab, Tamburag, and Doholl-inspired textures.",
    icon: Radio,
  },
  {
    title: "Explore and remix",
    body: "Browse public songs, remix ideas, and discover what other creators are making on the feed.",
    icon: Compass,
  },
  {
    title: "Voice of Balochistan",
    body: "Future contributors can help improve Balochi pronunciation and vocal quality with consent.",
    icon: Mic2,
  },
  {
    title: "Affordable pricing",
    body: "Start free with 5 songs per month. Upgrade only when you need longer tracks and cleaner exports.",
    icon: Sparkles,
  },
]

const culturalCards = [
  {
    title: "Makkuran-first dialect",
    body: "The MVP is built around Makkuran phrasing, pronunciation, and folk melody patterns.",
    icon: BookOpen,
  },
  {
    title: "Traditional instruments",
    body: "Prompt with Suroz, Damboora, Doholl, Rubab, and regional textures that feel rooted.",
    icon: Radio,
  },
  {
    title: "Balochi genres",
    body: "Shape ideas around Zahirok folk, wedding energy, Sufi moods, Naat devotion, and modern fusion.",
    icon: Music2,
  },
  {
    title: "Community voice",
    body: "A consent-first path for the community to improve vocal quality over time.",
    icon: Mic2,
  },
]

const steps = [
  {
    title: "Write your prompt or lyrics",
    body: "Start with a memory, poem, place, or full lyric idea in Makkuran style.",
    icon: PenLine,
  },
  {
    title: "Choose genre and instruments",
    body: "Guide the feeling with Zahirok folk, wedding, Sufi, or fusion presets.",
    icon: SlidersHorizontal,
  },
  {
    title: "Generate, save, and share",
    body: "Create a preview, keep it in your library, or share it with listeners on the feed.",
    icon: Sparkles,
  },
]

const pricingPreview = [
  {
    name: "Free",
    price: "$0",
    allowance: "5 songs/month",
    detail: "Explore the studio and try short song ideas.",
  },
  {
    name: "Basic",
    price: "$3/month",
    allowance: "30 songs/month",
    detail: "Create more often with room for drafts and experiments.",
  },
  {
    name: "Pro",
    price: "$7/month",
    allowance: "100 songs/month",
    detail: "Higher limits for committed artists and cultural projects.",
  },
]

const footerLinks = [
  { label: "Create", href: "/create" },
  { label: "Explore", href: "/feed" },
  { label: "Pricing", href: "/pricing" },
  { label: "Sign in", href: "/auth/sign-in" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
]

// ── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-charcoal text-sand">
      {/* ── HERO ── */}
      <section className="relative isolate overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/zahirok-hero-bg.png" alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.18]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_6%,rgba(227,122,44,0.22),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(26,58,92,0.72),transparent_36%),linear-gradient(145deg,rgba(17,17,17,0.92)_0%,rgba(26,23,20,0.88)_48%,rgba(17,24,39,0.92)_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(237,227,211,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(237,227,211,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />

        {/* Header */}
        <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Zahirok home">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-saffron/30 bg-saffron/12 text-saffron shadow-[0_0_20px_rgba(227,122,44,0.18)]">
              <Music2 className="size-4" aria-hidden="true" />
            </span>
            <span className="text-[1rem] font-extrabold uppercase leading-none tracking-[0.08em] text-white">
              Zahirok
            </span>
          </Link>

          <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              href="/feed"
              className="hidden rounded-full px-3 py-2 text-sm font-semibold text-sand/60 transition hover:bg-white/[0.04] hover:text-sand md:inline-flex"
            >
              Explore
            </Link>
            <Link
              href="/auth/sign-in"
              className="hidden rounded-full px-3 py-2 text-sm font-semibold text-sand/60 transition hover:bg-white/[0.04] hover:text-saffron sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/create"
              className="inline-flex h-10 items-center justify-center rounded-full bg-saffron px-4 text-sm font-black text-charcoal shadow-[0_14px_32px_rgba(227,122,44,0.24)] transition hover:bg-terracotta"
            >
              Create Song
            </Link>
          </nav>
        </header>

        {/* Hero content */}
        <div className="mx-auto flex min-h-[calc(80vh-4rem)] max-w-5xl flex-col items-center justify-center px-4 pb-12 pt-6 text-center sm:px-6 sm:pb-16 lg:px-8">
          <div className="w-full max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-saffron sm:text-xs">
              <Waves className="size-3.5" aria-hidden="true" />
              Balochi AI Music Studio
            </p>
            <h1 className="mx-auto mt-5 max-w-4xl text-[2.25rem] font-black leading-[1.08] tracking-[-0.02em] text-sand sm:text-5xl md:text-6xl lg:text-[4.5rem] lg:leading-[0.96]">
              Bring your Balochi sound to life
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-sand/70 sm:text-lg sm:leading-8">
              Create songs from lyrics, poetry, memories, and prompts — shaped by Makkuran melodies, Damboora, Suroz, and Doholl-inspired sounds.
            </p>

            <LandingPrompt />

            {/* Product route cards */}
            <div className="mx-auto mt-6 grid max-w-4xl gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
              {productRoutes.map((route) => (
                <Link
                  key={route.title}
                  href={route.href}
                  className="group rounded-2xl border border-sand/10 bg-sand/[0.05] p-4 transition hover:-translate-y-0.5 hover:border-saffron/30 hover:bg-sand/[0.08]"
                >
                  <route.icon className="size-5 text-saffron" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-black text-sand">{route.title}</h3>
                  <p className="mt-1.5 text-xs font-medium leading-[1.5] text-sand/50">{route.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SONG EXAMPLES ── */}
      <section className="border-y border-sand/8 bg-[#161616] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="SONG EXAMPLES"
            title="Hear Balochi ideas become songs"
            body="From Zahirok melodies to wedding Doholl, Sufi Damboora, and modern fusion — Zahirok turns memory into music."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {exampleSongs.map((song) => (
              <ExampleSongCard key={song.title} {...song} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT FEATURES ── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="CREATOR TOOLS"
            title="Everything you need to create Balochi music"
            body="Prompt-first creation, traditional instruments, community discovery, and an upgrade path when you're ready."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CULTURAL PROMISE ── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="CULTURAL PROMISE"
            title="Built for the sound of Balochistan"
            body="Zahirok is shaped around cultural memory, regional instruments, and tools designed for Makkuran creators."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {culturalCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-y border-sand/8 bg-[#161616] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="HOW IT WORKS"
            title="From idea to song"
            body="A simple prompt-first flow for turning memories, lyrics, and cultural references into a song preview."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <StepCard key={step.title} step={index + 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* ── VOICE OF BALOCHISTAN ── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-saffron/18 bg-saffron/[0.08] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-saffron">
              Voice of Balochistan
            </p>
            <h2 className="mt-3 text-3xl font-black text-sand sm:text-4xl">
              Your voice is the future of our sound
            </h2>
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-sand/74">
              Future contributors can help improve Balochi pronunciation, rhythm, and vocal quality with clear consent.
            </p>
          </div>
          <Link
            href="/voice-of-balochistan"
            className="inline-flex h-12 items-center justify-center rounded-full border border-saffron/35 bg-charcoal/50 px-5 text-sm font-black text-saffron transition hover:bg-saffron/10"
          >
            Learn about voice contribution
          </Link>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="border-y border-sand/8 bg-[#161616] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="PRICING"
              title="Start free, grow when you need more"
              body="Simple tiers for exploring, creating, and publishing Balochi music."
            />
            <Link
              href="/pricing"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-sand/15 bg-sand/[0.07] px-5 text-sm font-bold text-sand transition hover:bg-sand/[0.12]"
            >
              View pricing
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pricingPreview.map((tier) => (
              <article
                key={tier.name}
                className="rounded-[1.5rem] border border-sand/12 bg-sand/[0.07] p-5"
              >
                <h3 className="text-xl font-black text-sand">{tier.name}</h3>
                <p className="mt-2 text-3xl font-black text-saffron">{tier.price}</p>
                <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-sand/58">
                  {tier.allowance}
                </p>
                <p className="mt-4 text-sm font-semibold leading-6 text-sand/68">
                  {tier.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mx-auto flex size-12 items-center justify-center rounded-full border border-saffron/25 bg-saffron/12 text-saffron">
            <Sparkles className="size-5" aria-hidden="true" />
          </p>
          <h2 className="mt-5 text-3xl font-black text-sand sm:text-5xl">
            Create the next Balochi sound
          </h2>
          <Link
            href="/create"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-saffron px-6 text-sm font-black text-charcoal shadow-[0_18px_42px_rgba(227,122,44,0.24)] transition hover:bg-terracotta"
          >
            Create Song
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-sand/8 bg-[#131313] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-sand">
              Zahirok
            </p>
            <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-sand/50">
              Balochi AI music studio — built for memory, melody, and future creators.
            </p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-4 text-sm font-bold text-sand/55"
          >
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition hover:text-sand">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SectionHeading({
  body,
  eyebrow,
  title,
}: {
  body: string
  eyebrow: string
  title: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-saffron">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black text-sand sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base font-medium leading-7 text-sand/68">{body}</p>
    </div>
  )
}

function ExampleSongCard({
  coverImage,
  duration,
  genre,
  instruments,
  stats,
  title,
}: {
  coverImage?: string
  duration: string
  genre: string
  instruments: string
  stats: string
  title: string
}) {
  return (
    <Link
      href="/feed"
      aria-label={`Explore songs like ${title}`}
      className="group relative block overflow-hidden rounded-[1.65rem] border border-sand/12 bg-[linear-gradient(145deg,rgba(237,227,211,0.08),rgba(237,227,211,0.035))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-saffron/35 hover:bg-sand/[0.08] sm:p-5"
    >
      {/* Cover image background */}
      {coverImage && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={coverImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.15] transition group-hover:opacity-[0.22]"
        />
      )}
      <div className="pointer-events-none absolute inset-x-4 top-0 h-20 rounded-full bg-saffron/8 blur-2xl transition group-hover:bg-saffron/14" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-saffron">
            {genre}
          </p>
          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight text-sand sm:text-2xl">
            {title}
          </h3>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-saffron/80">
            {instruments}
          </p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-saffron text-charcoal shadow-[0_10px_24px_rgba(227,122,44,0.24)] transition group-hover:bg-terracotta sm:size-11">
          <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-5 flex h-20 items-end gap-1 rounded-xl border border-sand/8 bg-charcoal/30 px-3 py-2.5" aria-hidden="true">
        {Array.from({ length: 32 }, (_, i) => (
          <span
            key={i}
            className={`w-full rounded-full transition ${i < 10 ? "bg-saffron" : "bg-sand/50"}`}
            style={{ height: `${14 + ((i * 19) % 48)}px` }}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs font-bold text-sand/55">
        <span>{stats}</span>
        <span className="rounded-full border border-sand/10 bg-sand/7 px-2 py-1 text-sand/65">
          {duration}
        </span>
      </div>
    </Link>
  )
}

function FeatureCard({
  body,
  icon: Icon,
  title,
}: {
  body: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: "true" }>
  title: string
}) {
  return (
    <article className="rounded-[1.5rem] border border-sand/10 bg-sand/[0.06] p-5">
      <span className="flex size-10 items-center justify-center rounded-full bg-saffron/12 text-saffron">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-black text-sand">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-sand/60">{body}</p>
    </article>
  )
}

function StepCard({
  body,
  icon: Icon,
  step,
  title,
}: {
  body: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: "true" }>
  step: number
  title: string
}) {
  return (
    <article className="rounded-[1.5rem] border border-sand/12 bg-sand/[0.07] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-saffron">
          Step {step}
        </span>
        <Icon className="size-5 text-saffron" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-lg font-black text-sand">{title}</h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-sand/68">{body}</p>
      <p className="mt-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-sand/50">
        <CheckCircle2 className="size-4 text-saffron" aria-hidden="true" />
        Studio ready
      </p>
    </article>
  )
}

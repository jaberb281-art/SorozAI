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
  Waves,
} from "lucide-react"

import { LandingPrompt } from "@/components/home/landing-prompt"

const exampleSongs = [
  {
    title: "Makran Evening",
    genre: "Zahirok",
    instruments: "Suroz + Damboora",
    duration: "3:18",
    stats: "12K plays, 1.8K likes",
  },
  {
    title: "Desert Pulse",
    genre: "Hip-Hop Fusion",
    instruments: "Drums + Bass",
    duration: "2:42",
    stats: "8.4K plays, 920 likes",
  },
  {
    title: "Wedding Doholl",
    genre: "Celebration Folk",
    instruments: "Doholl + Benju",
    duration: "3:05",
    stats: "15K plays, 2.1K likes",
  },
  {
    title: "Sufi Damboora",
    genre: "Spiritual Folk",
    instruments: "Damboora + Soft vocals",
    duration: "4:01",
    stats: "9.7K plays, 1.4K likes",
  },
]

const culturalCards = [
  {
    title: "Balochi genres",
    body: "Shape ideas around Zahirok, folk songs, wedding energy, Sufi moods, and modern fusion.",
    icon: Music2,
  },
  {
    title: "Traditional instruments",
    body: "Prompt with Suroz, Damboora, Benju, Doholl, and regional textures that feel rooted.",
    icon: Radio,
  },
  {
    title: "Dialect-aware future",
    body: "Built toward pronunciation and phrasing that can respect Makrani, Rakhshani, and Sulaimani voices.",
    icon: BookOpen,
  },
  {
    title: "Community voice contribution",
    body: "A consent-first path for the community to improve vocal quality over time.",
    icon: Mic2,
  },
]

const productFeatures = [
  {
    title: "Balochi genre presets",
    body: "Start with Zahirok, wedding, Sufi, lullaby, or modern fusion styles.",
    icon: Music2,
  },
  {
    title: "Traditional instrument textures",
    body: "Shape your sound with Suroz, Damboora, Rubab, Tamburag, and Doholl-inspired options.",
    icon: Radio,
  },
  {
    title: "Prompt-first creation",
    body: "Write a memory, poem, lyric idea, or mood and turn it into a song direction.",
    icon: PenLine,
  },
  {
    title: "Lyrics or instrumental",
    body: "Create with your own lyrics or keep it instrumental for cinematic background music.",
    icon: SlidersHorizontal,
  },
  {
    title: "Private or public songs",
    body: "Save ideas privately or share finished tracks with the ZahiRok community.",
    icon: CheckCircle2,
  },
  {
    title: "Remix and explore",
    body: "Open public songs, remix ideas, and discover what other creators are making.",
    icon: Compass,
  },
  {
    title: "Voice of Balochistan",
    body: "Future contributors can help improve pronunciation and vocal quality with consent.",
    icon: Mic2,
  },
  {
    title: "Built for affordable creators",
    body: "Start free and upgrade only when you need longer songs and cleaner exports.",
    icon: Sparkles,
  },
  {
    title: "Future dialect support",
    body: "Designed with Makrani, Rakhshani, Sulaimani, and mixed regional voices in mind.",
    icon: BookOpen,
  },
]

const steps = [
  {
    title: "Write your prompt or lyrics",
    body: "Start with a memory, poem, place, or full lyric idea.",
    icon: PenLine,
  },
  {
    title: "Choose genre and instruments",
    body: "Guide the feeling with cultural styles and studio controls.",
    icon: SlidersHorizontal,
  },
  {
    title: "Generate, save, and share",
    body: "Create a preview, keep it in your library, or share it with listeners.",
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
  { label: "Explore", href: "/feed" },
  { label: "Pricing", href: "/pricing" },
  { label: "Voice of Balochistan", href: "/voice-of-balochistan" },
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
]

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-charcoal text-sand">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_6%,rgba(227,122,44,0.22),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(26,58,92,0.72),transparent_36%),linear-gradient(145deg,#111111_0%,#222222_48%,#111827_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(237,227,211,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(237,227,211,0.18)_1px,transparent_1px)] [background-size:46px_46px]" />

        <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3 rounded-full">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-saffron/35 bg-saffron/15 text-saffron shadow-[0_0_24px_rgba(227,122,44,0.22)]">
              <Music2 className="size-4" aria-hidden="true" />
            </span>
            <span className="truncate text-xs font-black uppercase tracking-[0.24em] sm:tracking-[0.28em]">
              ZahiRok AI
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/auth/sign-in"
              className="hidden rounded-full px-3 py-2 text-sm font-semibold text-sand/72 transition hover:bg-white/[0.04] hover:text-saffron sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/create"
              className="inline-flex h-10 items-center justify-center rounded-full bg-saffron px-4 text-sm font-black text-sand shadow-[0_16px_36px_rgba(227,122,44,0.24)] transition hover:bg-terracotta"
            >
              Create Song
            </Link>
          </div>
        </header>

        <div className="mx-auto flex min-h-[calc(84vh-4.25rem)] max-w-5xl flex-col items-center justify-center px-4 pb-12 pt-8 text-center sm:px-6 sm:pb-16 lg:px-8 lg:pb-18 lg:pt-8">
          <div className="w-full max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-saffron sm:text-xs">
              <Waves className="size-3.5" aria-hidden="true" />
              Cinematic Balochi AI Studio
            </p>
            <h1 className="mx-auto mt-5 max-w-4xl text-[2.375rem] font-black leading-tight tracking-[-0.02em] text-sand sm:text-5xl md:text-6xl md:leading-[0.98] lg:text-[4.5rem] lg:leading-[0.96]">
              Bring your Balochi sound to life
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-sand/76 sm:text-lg sm:leading-8">
              Create Balochi-inspired music from lyrics, poetry, memories, and
              prompts.
            </p>

            <LandingPrompt />

            <div className="mx-auto mt-5 grid max-w-5xl gap-3 text-left md:grid-cols-2">
              <HeroPromoCard
                href="/voice-of-balochistan"
                icon={Mic2}
                title="Voice of Balochistan"
                body="Help improve Balochi pronunciation and vocal quality with clear consent."
                cta="Learn more"
                variant="voice"
              />
              <HeroPromoCard
                href="/feed"
                icon={Compass}
                title="Explore public songs"
                body="Hear songs shared by ZahiRok creators and discover new Balochi-inspired ideas."
                cta="Explore feed"
                variant="feed"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sand/8 bg-[#191919] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="SONG EXAMPLES"
            title="Hear Balochi ideas become songs"
            body="From Zahirok melodies to wedding Doholl, Sufi Damboora, and modern Balochi fusion - ZahiRok turns memory into music."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {exampleSongs.map((song) => (
              <ExampleSongCard key={song.title} {...song} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Creator studio"
            title="Everything you need to create Balochi music your way"
            body="From Zahirok melodies to wedding Doholl, Sufi Damboora, and modern fusion - ZahiRok gives creators a simple studio for Balochi-inspired songs."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productFeatures.map((feature) => (
              <ProductFeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Cultural promise"
            title="Built for the sound of Balochistan"
            body="ZahiRok is shaped around cultural memory, regional instruments, and future-ready tools for creators."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {culturalCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-sand/8 bg-[#191919] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="How it works"
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
              Future contributors can help improve Balochi pronunciation,
              rhythm, and vocal quality with clear consent.
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

      <section className="border-y border-sand/8 bg-[#191919] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Pricing"
              title="Start free, grow when you need more"
              body="Simple tiers for exploring, creating, and publishing more Balochi music ideas."
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
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-saffron px-6 text-sm font-black text-sand shadow-[0_18px_42px_rgba(227,122,44,0.24)] transition hover:bg-terracotta"
          >
            Create Song
          </Link>
        </div>
      </section>

      <footer className="border-t border-sand/8 bg-[#151515] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-sand">
              ZahiRok AI
            </p>
            <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-sand/58">
              Built for Balochi music, memory, and future creators.
            </p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-4 text-sm font-bold text-sand/64"
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
  className = "",
  duration,
  genre,
  instruments,
  stats,
  title,
}: {
  className?: string
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
      className={`group relative block rounded-[1.65rem] border border-sand/12 bg-[linear-gradient(145deg,rgba(237,227,211,0.1),rgba(237,227,211,0.045))] p-4 shadow-[0_28px_70px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-saffron/35 hover:bg-sand/[0.09] sm:p-5 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-4 top-0 h-24 rounded-full bg-saffron/10 blur-2xl transition group-hover:bg-saffron/16" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-saffron">
            {genre}
          </p>
          <h3 className="mt-2 line-clamp-2 text-2xl font-black leading-tight text-sand">
            {title}
          </h3>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-saffron">
            {instruments}
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-saffron text-sand shadow-[0_14px_28px_rgba(227,122,44,0.24)] transition group-hover:bg-terracotta">
          <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-6 flex h-24 items-end gap-1 rounded-2xl border border-sand/10 bg-charcoal/32 px-3 py-3" aria-hidden="true">
        {Array.from({ length: 36 }, (_, index) => (
          <span
            key={index}
            className={`w-full rounded-full transition ${
              index < 10 ? "bg-saffron" : "bg-sand/62"
            }`}
            style={{ height: `${18 + ((index * 19) % 56)}px` }}
          />
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 text-xs font-bold text-sand/62">
        <span>{stats}</span>
        <span className="rounded-full border border-sand/10 bg-sand/7 px-2 py-1 text-sand/72">
          {duration}
        </span>
      </div>
    </Link>
  )
}

function HeroPromoCard({
  body,
  cta,
  href,
  icon: Icon,
  title,
  variant,
}: {
  body: string
  cta: string
  href: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: "true" }>
  title: string
  variant: "voice" | "feed"
}) {
  return (
    <Link
      href={href}
      className="group grid gap-4 overflow-hidden rounded-[1.45rem] border border-sand/12 bg-sand/[0.055] p-3 shadow-[0_18px_48px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-saffron/35 hover:bg-sand/[0.08] sm:grid-cols-[1fr_9rem] sm:items-center"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-saffron/12 text-saffron">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <h2 className="text-base font-black text-sand">{title}</h2>
        </div>
        <p className="mt-2 text-sm font-semibold leading-6 text-sand/66">
          {body}
        </p>
        <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-saffron">
          {cta}
        </p>
      </div>

      <div className="relative h-24 overflow-hidden rounded-2xl border border-sand/10 bg-charcoal/42">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(227,122,44,0.22),transparent_42%)]" />
        {variant === "voice" ? (
          <div className="absolute inset-x-3 bottom-4 flex h-14 items-center justify-center gap-1" aria-hidden="true">
            {Array.from({ length: 20 }, (_, index) => (
              <span
                key={index}
                className="w-1 rounded-full bg-saffron/75"
                style={{ height: `${10 + ((index * 13) % 34)}px` }}
              />
            ))}
          </div>
        ) : (
          <div className="absolute inset-3 rounded-xl border border-sand/10 bg-sand/8 p-2" aria-hidden="true">
            <div className="flex items-center justify-between">
              <span className="h-2 w-16 rounded-full bg-sand/28" />
              <span className="flex size-7 items-center justify-center rounded-full bg-saffron text-sand">
                <Play className="ml-0.5 size-3 fill-current" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-3 flex h-8 items-end gap-1">
              {Array.from({ length: 18 }, (_, index) => (
                <span
                  key={index}
                  className="w-full rounded-full bg-sand/58"
                  style={{ height: `${7 + ((index * 11) % 24)}px` }}
                />
              ))}
            </div>
          </div>
        )}
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
    <article className="rounded-[1.5rem] border border-sand/12 bg-sand/[0.07] p-5">
      <span className="flex size-10 items-center justify-center rounded-full bg-saffron/12 text-saffron">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-black text-sand">{title}</h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-sand/68">{body}</p>
    </article>
  )
}

function ProductFeatureCard({
  body,
  icon: Icon,
  title,
}: {
  body: string
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: "true" }>
  title: string
}) {
  const isFeatured =
    title === "Prompt-first creation" ||
    title === "Traditional instrument textures" ||
    title === "Voice of Balochistan"

  return (
    <article
      className={`group rounded-[1.65rem] border border-sand/12 bg-[linear-gradient(145deg,rgba(237,227,211,0.095),rgba(237,227,211,0.04))] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-saffron/35 sm:p-5 ${
        isFeatured ? "relative overflow-hidden" : ""
      }`}
    >
      {isFeatured ? (
        <div className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-full bg-saffron/10 blur-2xl transition group-hover:bg-saffron/16" />
      ) : null}
      <FeatureVisual title={title} />
      <div className="relative mt-5 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-saffron/12 text-saffron">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg font-black leading-tight text-sand">{title}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-sand/68">
            {body}
          </p>
        </div>
      </div>
    </article>
  )
}

function FeatureVisual({ title }: { title: string }) {
  if (title === "Balochi genre presets") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-sand/10 bg-charcoal/38 p-3">
        <div className="flex flex-wrap gap-2">
          {["Zahirok", "Wedding", "Sufi", "Fusion"].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-saffron/25 bg-saffron/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-saffron"
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-4 grid gap-2">
          <div className="h-3 rounded-full bg-sand/18" />
          <div className="h-3 w-2/3 rounded-full bg-sand/12" />
        </div>
      </div>
    )
  }

  if (title === "Traditional instrument textures") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-sand/10 bg-[radial-gradient(circle_at_30%_20%,rgba(227,122,44,0.22),transparent_35%),rgba(237,227,211,0.06)] p-3">
        <div className="flex items-end gap-1.5" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span
              key={index}
              className="h-16 w-full rounded-full bg-saffron/70"
              style={{ height: `${18 + ((index * 13) % 44)}px` }}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Suroz", "Damboora", "Doholl"].map((chip) => (
            <span key={chip} className="rounded-full bg-charcoal/45 px-2.5 py-1 text-[11px] font-bold text-sand/72">
              {chip}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (title === "Prompt-first creation") {
    return (
      <div className="rounded-2xl border border-sand/10 bg-charcoal/42 p-3">
        <div className="rounded-xl bg-sand/8 px-3 py-2 text-xs font-semibold leading-5 text-sand/60">
          A song about Makran evenings...
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="h-2 flex-1 rounded-full bg-sand/12" />
          <span className="rounded-full bg-saffron px-3 py-1.5 text-[11px] font-black text-sand">
            Create
          </span>
        </div>
      </div>
    )
  }

  if (title === "Lyrics or instrumental") {
    return (
      <div className="rounded-2xl border border-sand/10 bg-charcoal/38 p-3">
        <div className="grid grid-cols-2 gap-2">
          <span className="rounded-full bg-saffron px-3 py-2 text-center text-xs font-black text-sand">
            Lyrics
          </span>
          <span className="rounded-full border border-sand/12 bg-sand/8 px-3 py-2 text-center text-xs font-bold text-sand/68">
            Instrumental
          </span>
        </div>
        <div className="mt-3 grid gap-2">
          <div className="h-2 rounded-full bg-sand/18" />
          <div className="h-2 w-4/5 rounded-full bg-sand/12" />
          <div className="h-2 w-2/3 rounded-full bg-sand/12" />
        </div>
      </div>
    )
  }

  if (title === "Private or public songs") {
    return (
      <div className="rounded-2xl border border-sand/10 bg-charcoal/38 p-3">
        <div className="grid grid-cols-2 gap-2">
          <span className="rounded-full border border-sand/12 bg-sand/8 px-3 py-2 text-center text-xs font-bold text-sand/68">
            Private
          </span>
          <span className="rounded-full bg-saffron/90 px-3 py-2 text-center text-xs font-black text-sand">
            Public
          </span>
        </div>
        <div className="mt-3 h-10 rounded-xl bg-sand/8" />
      </div>
    )
  }

  if (title === "Remix and explore") {
    return (
      <div className="rounded-2xl border border-sand/10 bg-charcoal/38 p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-saffron text-sand">
            <Play className="ml-0.5 size-3.5 fill-current" aria-hidden="true" />
          </span>
          <span className="rounded-full border border-sand/12 bg-sand/8 px-3 py-1.5 text-xs font-bold text-sand/72">
            Remix
          </span>
        </div>
        <div className="mt-3 flex h-10 items-end gap-1" aria-hidden="true">
          {Array.from({ length: 20 }, (_, index) => (
            <span
              key={index}
              className="w-full rounded-full bg-sand/60"
              style={{ height: `${8 + ((index * 17) % 30)}px` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (title === "Voice of Balochistan") {
    return (
      <div className="rounded-2xl border border-sand/10 bg-[radial-gradient(circle_at_50%_10%,rgba(227,122,44,0.2),transparent_38%),rgba(237,227,211,0.06)] p-3">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-saffron/15 text-saffron">
          <Mic2 className="size-5" aria-hidden="true" />
        </div>
        <div className="mt-3 flex h-9 items-center justify-center gap-1" aria-hidden="true">
          {Array.from({ length: 22 }, (_, index) => (
            <span
              key={index}
              className="w-1 rounded-full bg-saffron/70"
              style={{ height: `${8 + ((index * 11) % 26)}px` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (title === "Built for affordable creators") {
    return (
      <div className="rounded-2xl border border-sand/10 bg-charcoal/38 p-3">
        <div className="flex flex-wrap gap-2">
          {["Free", "Basic", "Pro"].map((chip) => (
            <span key={chip} className="rounded-full bg-sand/8 px-3 py-1.5 text-xs font-black text-sand/72">
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-sand/10">
          <div className="h-full w-2/3 rounded-full bg-saffron" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-sand/10 bg-charcoal/38 p-3">
      <div className="grid grid-cols-3 gap-2">
        {["Makrani", "Rakhshani", "Sulaimani"].map((chip) => (
          <span key={chip} className="rounded-full bg-sand/8 px-2 py-1.5 text-center text-[11px] font-bold text-sand/68">
            {chip}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2" aria-hidden="true">
        {Array.from({ length: 15 }, (_, index) => (
          <span
            key={index}
            className={`size-2 rounded-full ${
              index % 3 === 0 ? "bg-saffron" : "bg-sand/20"
            }`}
          />
        ))}
      </div>
    </div>
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

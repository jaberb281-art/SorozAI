"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Minus, Music2, Play, Plus } from "lucide-react"

import { DemoVideoPoster } from "@/components/media/demo-video"
import { getDemoImage } from "@/lib/demo-images"
import { getFeedSongs } from "@/lib/mock-songs"
import { profilePathForCreator } from "@/lib/public-profiles"

const showcaseSongs = getFeedSongs().slice(0, 5)

const floatingCards = [
  {
    title: "Makran Nightfall",
    creator: "Zareena Sajid",
    artwork: getDemoImage(0),
    className: "-left-4 top-[46%] -rotate-[7deg] xl:left-[2%]",
  },
  {
    title: "Doholl Wedding",
    creator: "Meeral Gwadar",
    artwork: getDemoImage(1),
    className: "-right-4 top-[46%] rotate-[6deg] xl:right-[2%]",
  },
]

const marqueeItems = [
  "Built for Balochi creators",
  "Balochi Vocals",
  "Dambora",
  "Doholl",
  "Suroz",
  "Makran Dialect",
  "Coastal Folk",
]

const howItWorksSteps = [
  {
    number: "01",
    title: "Describe your sound",
    body: 'Type a mood, a place, or a story. "A slow Dambora melody at sunset on the Makran coast."',
  },
  {
    number: "02",
    title: "Shape the details",
    body: "Pick your instruments — Dambora, Suroz, Doholl — choose vocal style, language, and energy.",
  },
  {
    number: "03",
    title: "Hear it come alive",
    body: "Soroz generates a full song draft in seconds. Download, share, or remix it.",
  },
]

const honestFeatures = [
  {
    title: "Built around Balochi sound",
    body: "Every style, instrument, and dialect in Soroz comes from Balochi, Makkuran, and coastal folk traditions.",
    visual: "instruments",
  },
  {
    title: "Advanced creation tools",
    body: "Lyrics editor, vocal gender, weirdness, BPM, key, and style influence — the tools serious creators need.",
    visual: "controls",
  },
]

const faqs = [
  {
    question: "What is Soroz AI?",
    answer:
      "Soroz is an AI music creation tool built specifically for Balochi, Makkuran, and coastal folk traditions. You describe a mood, style, or lyrics — Soroz generates a song draft.",
  },
  {
    question: "Is Soroz only for Balochi music?",
    answer:
      "Soroz is optimized for Balochi sound and instruments, but you can create in any style. The Balochi instrument library and dialect support are what make it unique.",
  },
  {
    question: "Can I upload or record audio?",
    answer:
      "Voice upload and audio reference features are in development. Currently you can describe your desired vocal style and the AI will match it.",
  },
  {
    question: "Do I need music experience?",
    answer: "No. If you can describe a feeling or a place, Soroz can turn it into music.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Soroz offers free credits to start. Each generation uses credits. Upgrade for more credits and longer songs.",
  },
]

const footerLinks = [
  { label: "Create", href: "/create" },
  { label: "Explore", href: "/feed" },
  { label: "Pricing", href: "/pricing" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
]

export default function HomePage() {
  return (
    <main className="min-h-dvh w-full max-w-full overflow-x-hidden bg-[#0d0d0f] text-sand">
      <LandingNavbar />
      <LandingHero />
      <InstrumentMarquee />
      <HowItWorksSection />
      <SongShowcaseSection />
      <DriftTeaserSection />
      <HonestFeaturesSection />
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
          aria-label="Soroz home"
          className="flex min-w-0 items-center gap-2 sm:gap-2.5"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-saffron/30 bg-saffron/10 text-saffron shadow-[0_0_28px_rgba(227,122,44,0.18)] sm:size-10">
            <Music2 className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-black uppercase tracking-[0.14em] text-white sm:text-2xl sm:tracking-[0.18em]">
            Soroz
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
            <span className="hidden sm:inline">Join Soroz for free</span>
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
        <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.06] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl xl:text-7xl">
          The AI that knows
          <br className="hidden sm:block" />
          <span className="sm:whitespace-nowrap"> what a Dambora sounds like.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm font-semibold leading-6 text-white/72 sm:text-base sm:leading-7">
          Soroz is the first AI music tool built for Balochi, Makkuran, and coastal folk traditions.
          Start with a mood, a lyric, or just an instrument — and hear it become a song.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/auth/sign-up"
            className="inline-flex h-12 w-full min-w-[180px] items-center justify-center rounded-full [background:var(--gradient-brand)] px-7 text-sm font-black text-white shadow-[0_18px_42px_rgba(227,122,44,0.28)] transition hover:[background:var(--gradient-brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:w-auto"
          >
            Join for free
          </Link>
          <Link
            href="/feed"
            className="inline-flex h-12 w-full min-w-[180px] items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-7 text-sm font-black text-white transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:w-auto"
          >
            Explore tracks
          </Link>
        </div>
      </div>
    </section>
  )
}

function FloatingSongCard({
  artwork,
  className,
  creator,
  title,
}: {
  artwork: string
  className: string
  creator: string
  title: string
}) {
  return (
    <div
      className={`absolute w-48 rounded-[1.25rem] border border-white/10 bg-white/[0.08] p-2.5 shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl xl:w-52 ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.05rem]">
        <DemoVideoPoster src={artwork} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex size-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur">
          <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
        </span>
        <div className="absolute inset-x-3 bottom-3">
          <p className="text-sm font-black text-white">{title}</p>
          <Link
            href={profilePathForCreator(creator)}
            className="mt-0.5 inline-block text-xs font-bold text-white/62 transition hover:text-saffron"
          >
            {creator}
          </Link>
        </div>
      </div>
    </div>
  )
}

function InstrumentMarquee() {
  const loop = [...marqueeItems, ...marqueeItems]

  return (
    <section className="overflow-hidden border-y border-white/[0.06] bg-[#0f0f11] py-5">
      <div className="landing-marquee flex w-max items-center gap-8">
        {loop.map((label, index) => (
          <span key={`${label}-${index}`} className="inline-flex shrink-0 items-center gap-8">
            <span
              className={`text-sm font-black uppercase tracking-[0.18em] ${
                label === "Built for Balochi creators" ? "text-white/28" : "text-white/55"
              } sm:text-base`}
            >
              {label}
            </span>
            <span className="text-white/20" aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section className="bg-[#111113] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="How Soroz works"
          body="Three steps. No music experience needed."
          align="center"
        />

        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {howItWorksSteps.map((step) => (
            <article key={step.number}>
              <p className="text-5xl font-black leading-none text-white/12 sm:text-6xl">{step.number}</p>
              <h3 className="mt-4 text-xl font-black text-white">{step.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-white/58 sm:text-base">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SongShowcaseSection() {
  return (
    <section className="bg-[#0f0f11] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <SectionHeading
        title="Hear what Soroz creates"
        body="From wedding rhythms to coastal folk — real drafts shaped by Balochi instruments and dialect."
        align="center"
      />

      <div className="mx-auto mt-10 flex max-w-[1500px] snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] sm:mt-12 sm:gap-5 [&::-webkit-scrollbar]:hidden">
        {showcaseSongs.map((song, index) => (
          <ShowcaseCard key={song.id} song={song} artwork={getDemoImage(index)} />
        ))}
      </div>
    </section>
  )
}

function ShowcaseCard({
  artwork,
  song,
}: {
  artwork: string
  song: (typeof showcaseSongs)[number]
}) {
  return (
    <div className="group w-[min(78vw,260px)] shrink-0 snap-start sm:w-[280px] lg:w-[300px]">
      <Link
        href="/feed"
        className="block outline-none focus-visible:ring-2 focus-visible:ring-saffron"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition group-hover:-translate-y-1">
          <DemoVideoPoster src={artwork} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-white/16 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
            <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
          </span>
        </div>
        <h3 className="mt-4 truncate text-lg font-black text-white transition group-hover:text-saffron">
          {song.title}
        </h3>
      </Link>
      <Link
        href={profilePathForCreator(song.creator)}
        className="mt-1 inline-block truncate text-sm font-bold text-white/48 transition hover:text-saffron"
      >
        {song.creator}
      </Link>
    </div>
  )
}

function DriftTeaserSection() {
  return (
    <section className="bg-[#0a0a0c] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-4xl rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(227,122,44,0.12),transparent_38%),rgba(255,255,255,0.03)] px-6 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-10 sm:py-14">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-saffron">Live from The Drift</p>
        <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-4xl">
          A living radio of Balochi sound.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-6 text-white/58 sm:text-base">
          Tune in, capture 30 seconds, turn it into a full song.
        </p>

        <DriftWaveform className="mx-auto mt-8 max-w-lg" />

        <p className="mt-6 text-sm font-bold text-white/72">Desert Night Radio is playing now.</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
          66 BPM · Dambora · Calm
        </p>

        <Link
          href="/radio"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-black text-saffron transition hover:text-white"
        >
          Open The Drift
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

function DriftWaveform({ className = "" }: { className?: string }) {
  const bars = [18, 32, 48, 24, 55, 36, 44, 27, 62, 31, 52, 22, 40, 58, 33, 46, 38, 54, 29, 50]

  return (
    <div className={`flex h-16 items-end justify-center gap-1 ${className}`} aria-hidden="true">
      {bars.map((height, index) => (
        <span
          key={index}
          className="landing-drift-bar w-1 rounded-full bg-saffron/70"
          style={{
            height: `${height}%`,
            animationDelay: `${index * 0.08}s`,
          }}
        />
      ))}
    </div>
  )
}

function HonestFeaturesSection() {
  return (
    <section className="bg-[#111113] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-5 lg:grid-cols-2">
          {honestFeatures.map((feature) => (
            <article
              key={feature.title}
              className="flex min-h-[320px] flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-6"
            >
              <h3 className="text-xl font-black text-white">{feature.title}</h3>
              <p className="mt-4 text-sm font-semibold leading-6 text-white/58">{feature.body}</p>
              <FeatureVisual type={feature.visual} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureVisual({ type }: { type: string }) {
  if (type === "controls") {
    return (
      <div className="mt-auto space-y-4 pt-8">
        {["Weirdness", "Style influence"].map((label) => (
          <div key={label}>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
              <span>{label}</span>
              <span>50%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/8">
              <div className="h-full w-1/2 rounded-full [background:var(--gradient-brand)]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-auto flex flex-wrap gap-2 pt-8">
      {["Suroz", "Dambora", "Duholl", "Rabab", "Benju", "Makkuran"].map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-black text-white/70"
        >
          {tag}
        </span>
      ))}
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
          body="Everything you need to know about creating with Soroz."
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
        <h2 className="text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
          Ready to make your first
          <br />
          Soroz track?
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/auth/sign-up"
            className="inline-flex h-12 w-full items-center justify-center rounded-full [background:var(--gradient-brand)] px-7 text-sm font-black text-white shadow-[0_18px_42px_rgba(227,122,44,0.28)] transition hover:[background:var(--gradient-brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:w-auto"
          >
            Join Soroz for free
          </Link>
          <Link
            href="/feed"
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
        <p className="text-sm font-semibold text-white/42">
          © 2026 Soroz AI. Built for Balochi creators.
        </p>
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
      <h2 className="text-3xl font-black leading-[1.04] tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-white/58 sm:mt-5 sm:text-lg sm:leading-8">
        {body}
      </p>
    </div>
  )
}

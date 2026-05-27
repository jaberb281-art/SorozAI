import Link from "next/link"
import { Compass, Mic2, Play, Sparkles } from "lucide-react"

import { PromptComposer } from "@/components/create/prompt-composer"

const recentExamples = [
  {
    title: "Makran Evening",
    genre: "Zahirok",
    instruments: "Suroz + Damboora",
    duration: "3:18",
  },
  {
    title: "Desert Pulse",
    genre: "Hip-Hop Fusion",
    instruments: "Drums + Bass",
    duration: "2:42",
  },
  {
    title: "Wedding Doholl",
    genre: "Celebration Folk",
    instruments: "Doholl + Benju",
    duration: "3:05",
  },
  {
    title: "Sufi Damboora",
    genre: "Spiritual Folk",
    instruments: "Damboora + Soft vocals",
    duration: "4:01",
  },
]

export default function CreatePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-sand">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(227,122,44,0.2),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(26,58,92,0.7),transparent_34%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_46%,var(--charcoal)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(90deg,rgba(237,227,211,0.42)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.32)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-charcoal/82 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-charcoal to-transparent" />

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-8 pt-6 text-center md:px-8 md:pb-10 md:pt-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-saffron shadow-[0_0_28px_rgba(227,122,44,0.16)] md:px-4 md:py-2 md:text-[11px]">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Creator studio
        </p>

        <h1 className="mt-3 max-w-2xl text-3xl font-black leading-[1.08] text-sand sm:text-[2.35rem] md:text-4xl">
          Bring your Balochi sound to life
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-sand/72 md:text-base md:leading-7">
          Describe a song idea, choose your style, and create a
          Balochi-inspired track.
        </p>

        <PromptComposer />

        <div className="mt-6 grid w-full gap-3 text-left md:grid-cols-2">
          <StudioPromoCard
            href="/voice-of-balochistan"
            icon={Mic2}
            title="Voice of Balochistan"
            body="Help improve Balochi pronunciation and vocal quality with clear consent."
            cta="Learn more"
            variant="voice"
          />
          <StudioPromoCard
            href="/feed"
            icon={Compass}
            title="Explore public songs"
            body="Hear songs shared by ZahiRok creators and discover new Balochi-inspired ideas."
            cta="Explore feed"
            variant="feed"
          />
        </div>

        <section className="mt-8 w-full text-left">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">
                Recent examples
              </p>
              <h2 className="mt-2 text-2xl font-black text-sand">
                Recent ZahiRok examples
              </h2>
            </div>
            <Link
              href="/feed"
              className="inline-flex h-10 items-center justify-center rounded-full border border-sand/15 bg-sand/8 px-4 text-sm font-bold text-sand transition hover:bg-sand/12"
            >
              View feed
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {recentExamples.map((song) => (
              <RecentExampleCard key={song.title} {...song} />
            ))}
          </div>
        </section>
      </section>
    </div>
  )
}

function StudioPromoCard({
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
      className="group grid gap-4 overflow-hidden rounded-[1.45rem] border border-sand/12 bg-sand/[0.06] p-3 shadow-[0_18px_48px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-saffron/35 hover:bg-sand/[0.085] sm:grid-cols-[1fr_9rem] sm:items-center"
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

function RecentExampleCard({
  duration,
  genre,
  instruments,
  title,
}: {
  duration: string
  genre: string
  instruments: string
  title: string
}) {
  return (
    <Link
      href="/feed"
      className="group rounded-[1.25rem] border border-sand/12 bg-sand/[0.065] p-3 transition hover:-translate-y-0.5 hover:border-saffron/35 hover:bg-sand/[0.09]"
      aria-label={`Explore ${title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-saffron">
            {genre}
          </p>
          <h3 className="mt-1 line-clamp-2 text-base font-black text-sand">
            {title}
          </h3>
        </div>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-saffron text-sand">
          <Play className="ml-0.5 size-3.5 fill-current" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 flex h-12 items-end gap-1" aria-hidden="true">
        {Array.from({ length: 22 }, (_, index) => (
          <span
            key={index}
            className={`w-full rounded-full ${
              index < 7 ? "bg-saffron" : "bg-sand/58"
            }`}
            style={{ height: `${8 + ((index * 17) % 34)}px` }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs font-bold text-sand/62">
        <span className="truncate">{instruments}</span>
        <span>{duration}</span>
      </div>
    </Link>
  )
}

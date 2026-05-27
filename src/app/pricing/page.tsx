import Link from "next/link"
import {
  BadgeDollarSign,
  Check,
  CreditCard,
  Crown,
  HelpCircle,
  Music,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react"

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Start shaping Balochi song ideas without a card.",
    features: [
      "5 songs/month",
      "Up to 30 seconds",
      "Watermark",
      "22 kHz",
      "MP3 only",
    ],
    action: "Start free",
    href: "/auth/sign-up",
  },
  {
    name: "Basic",
    price: "$3",
    cadence: "month",
    description: "The everyday creator plan for longer, cleaner songs.",
    features: [
      "30 songs/month",
      "Up to 90 seconds",
      "No watermark",
      "44.1 kHz",
      "MP3 + WAV",
    ],
    action: "Upgrade to Basic",
    href: "/auth/sign-up",
    featured: true,
    badge: "Best for most creators.",
  },
  {
    name: "Pro",
    price: "$7",
    cadence: "month",
    description: "For releases, client work, and serious sound design.",
    features: [
      "100 songs/month",
      "Up to 4 minutes",
      "48 kHz HD",
      "Voice cloning",
      "Stems",
      "Commercial use",
    ],
    action: "Go Pro",
    href: "/auth/sign-up",
  },
  {
    name: "Lifetime",
    price: "$30",
    cadence: "one-time",
    description: "A limited launch offer for early ZahiRok supporters.",
    features: [
      "Basic forever",
      "30 songs/month",
      "Up to 90 seconds",
      "No watermark",
      "Limited launch offer",
    ],
    action: "Claim launch offer",
    href: "/auth/sign-up",
  },
  {
    name: "Team / Studio",
    price: "$25",
    cadence: "month",
    description: "Shared creation space for studios, teams, and collectives.",
    features: [
      "5 seats",
      "500 songs/month",
      "Shared library",
      "Team workflows",
      "Studio-ready management",
    ],
    action: "Explore team plan",
    href: "/auth/sign-up",
  },
]

const faqs = [
  {
    question: "Can I use free songs commercially?",
    answer:
      "Free songs are intended for testing and personal exploration. Commercial rights are planned for paid tiers, with Pro designed for release-ready usage.",
  },
  {
    question: "What do I get with Basic?",
    answer:
      "Basic increases monthly songs, supports up to 90 seconds, removes the watermark, and unlocks MP3 + WAV exports at 44.1 kHz.",
  },
  {
    question: "What is Pro for?",
    answer:
      "Pro is for creators who need longer songs, HD quality, stems, voice cloning, and commercial-use rights for serious projects.",
  },
  {
    question: "Are payments active now?",
    answer:
      "No. Pricing is frontend-only for now. Stripe, regional payment methods, and billing automation will be connected later.",
  },
]

export default function PricingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-sand">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_11%,rgba(227,122,44,0.22),transparent_30%),radial-gradient(circle_at_12%_28%,rgba(183,62,31,0.2),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(26,58,92,0.86),transparent_35%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_45%,var(--charcoal)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(237,227,211,0.45)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.35)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-charcoal to-transparent" />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-8 pt-8 md:px-6 md:pb-10 md:pt-10 xl:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-saffron shadow-[0_0_28px_rgba(227,122,44,0.16)]">
            <BadgeDollarSign className="size-4" aria-hidden="true" />
            ZAHIROK PRICING
          </p>
          <h1 className="mt-4 text-3xl font-black leading-tight text-sand sm:text-4xl md:text-5xl">
            Create Balochi music at a price built for the community
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-sand/72 md:text-base md:leading-7">
            Start free, upgrade when you need longer songs, higher quality, and
            commercial rights.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {tiers.slice(0, 3).map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {tiers.slice(3).map((tier) => (
            <PricingCard key={tier.name} tier={tier} compact />
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <InfoPanel
            icon={<Wallet className="size-5" aria-hidden="true" />}
            title="Regional pricing"
          >
            <p>
              ZahiRok AI pricing is planned with Pakistan and Iran-side
              Balochi-majority regions in mind. Local payment options like
              JazzCash, EasyPaisa, and USDT are planned, with Stripe support
              later for global cards and subscriptions.
            </p>
          </InfoPanel>

          <InfoPanel
            icon={<Users className="size-5" aria-hidden="true" />}
            title="Community discounts"
          >
            <p>
              Discount programs are planned for students and educators,
              Featured Artists, Voice of Balochistan contributors, and a future
              Sadaqah tier for community-supported access.
            </p>
          </InfoPanel>
        </div>

        <section className="mt-4 rounded-[1.5rem] border border-sand/15 bg-sand/10 p-2.5 shadow-[0_18px_52px_rgba(0,0,0,0.26)] backdrop-blur-2xl">
          <div className="rounded-[1.15rem] border border-sand/10 bg-charcoal/50 p-4 md:p-5">
            <div className="flex items-center gap-3">
              <HelpCircle className="size-5 text-saffron" aria-hidden="true" />
              <h2 className="text-2xl font-black text-sand">FAQ</h2>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-2xl border border-sand/10 bg-sand/7 p-4"
                >
                  <h3 className="text-base font-black text-sand">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-sand/68">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </div>
  )
}

function PricingCard({
  compact = false,
  tier,
}: {
  compact?: boolean
  tier: {
    action: string
    badge?: string
    cadence: string
    description: string
    featured?: boolean
    features: string[]
    href: string
    name: string
    price: string
  }
}) {
  return (
    <article
      className={`relative rounded-[1.5rem] border p-2.5 shadow-[0_18px_52px_rgba(0,0,0,0.25)] backdrop-blur-2xl ${
        tier.featured
          ? "border-saffron/40 bg-saffron/12 shadow-[0_22px_64px_rgba(227,122,44,0.14)]"
          : "border-sand/15 bg-sand/10"
      }`}
    >
      <div className="h-full rounded-[1.15rem] border border-sand/10 bg-charcoal/55 p-4">
        {tier.badge ? (
          <p className="mb-4 inline-flex rounded-full border border-saffron/30 bg-saffron/15 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-saffron">
            {tier.badge}
          </p>
        ) : null}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-sand">{tier.name}</h2>
            <p className="mt-2 text-sm leading-6 text-sand/66">
              {tier.description}
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-saffron/25 bg-saffron/12 text-saffron">
            {tier.featured ? (
              <Crown className="size-5" aria-hidden="true" />
            ) : compact ? (
              <Music className="size-5" aria-hidden="true" />
            ) : (
              <CreditCard className="size-5" aria-hidden="true" />
            )}
          </span>
        </div>

        <div className="mt-5 flex items-end gap-2">
          <span className="text-3xl font-black leading-none text-sand">
            {tier.price}
          </span>
          <span className="pb-1 text-sm font-bold text-sand/52">
            / {tier.cadence}
          </span>
        </div>

        <ul className="mt-5 grid gap-2 text-sm font-semibold text-sand/72">
          {tier.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 rounded-xl bg-sand/7 px-3 py-2"
            >
              <Check className="size-4 shrink-0 text-saffron" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>

        <Link
          href={tier.href}
          aria-label={`${tier.action} for ${tier.name} plan`}
          className={`mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-black transition ${
            tier.featured
              ? "bg-saffron text-sand shadow-[0_16px_36px_rgba(227,122,44,0.24)] hover:bg-terracotta"
              : "border border-sand/15 bg-sand/8 text-sand hover:border-terracotta/50 hover:bg-sand/12"
          }`}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {tier.action}
        </Link>
      </div>
    </article>
  )
}

function InfoPanel({
  children,
  icon,
  title,
}: {
  children: React.ReactNode
  icon: React.ReactNode
  title: string
}) {
  return (
    <section className="rounded-[1.5rem] border border-sand/15 bg-sand/10 p-2.5 shadow-[0_18px_52px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
      <div className="h-full rounded-[1.15rem] border border-sand/10 bg-charcoal/50 p-4">
        <div className="flex items-center gap-3">
          <span className="text-saffron">{icon}</span>
          <h2 className="text-2xl font-black text-sand">{title}</h2>
        </div>
        <div className="mt-4 text-sm leading-6 text-sand/70">{children}</div>
      </div>
    </section>
  )
}

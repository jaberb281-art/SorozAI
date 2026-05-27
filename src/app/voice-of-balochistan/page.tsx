"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import {
  CheckCircle2,
  FileAudio,
  Globe2,
  HeartHandshake,
  HelpCircle,
  Mic2,
  Music2,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Upload,
  UsersRound,
  Volume2,
} from "lucide-react"

import { submitVoiceDonation } from "@/lib/api-client"
import type { VoiceDialect, VoiceRecordingType } from "@/lib/api-contracts"

const whyCards = [
  {
    title: "Native pronunciation",
    text: "Help future ZahiRok models hear real Balochi sounds, phrasing, and mouth-feel.",
    icon: <Volume2 className="size-5" aria-hidden="true" />,
  },
  {
    title: "Balochi dialect diversity",
    text: "Support Rakhshani, Makrani, Sulaimani, and mixed regional voices across communities.",
    icon: <Globe2 className="size-5" aria-hidden="true" />,
  },
  {
    title: "Community-owned cultural data",
    text: "Build a stronger foundation for Balochi AI tools guided by consent and respect.",
    icon: <UsersRound className="size-5" aria-hidden="true" />,
  },
]

const steps = [
  "Record a 30-60 second clip",
  "Add dialect and short transcript",
  "Review consent terms",
  "Submit for team review",
  "Accepted contributors may receive Pro access",
]

const ethics = [
  "We only use submitted voices with consent.",
  "Voice donations help train aggregated models.",
  "Individual voices are not cloned from donations.",
  "Featured Artist voice models require separate signed consent.",
  "Users can request withdrawal according to future policy.",
]

const benefits = [
  "6 months free Pro for accepted submissions",
  "Chance to join Featured Artist program",
  "Help preserve Balochi sound",
  "Support future Balochi AI tools",
]

const faqs = [
  {
    question: "Will my voice be cloned?",
    answer:
      "No. General voice donations are used for aggregated training only. Individual voice cloning requires separate signed consent.",
  },
  {
    question: "What should I record?",
    answer:
      "Clear speech, poetry, or singing in Balochi for 30-60 seconds.",
  },
  {
    question: "Can I submit from a phone?",
    answer:
      "Yes, phone recordings are acceptable if clear and quiet.",
  },
  {
    question: "Is this active now?",
    answer: "Not yet. This is a frontend preview.",
  },
]

export default function VoiceOfBalochistanPage() {
  const [message, setMessage] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await submitVoiceDonation({
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      dialect: String(formData.get("dialect") ?? "Mixed / Not sure") as VoiceDialect,
      recordingType: String(formData.get("recordingType") ?? "Speaking") as VoiceRecordingType,
      transcript: String(formData.get("transcript") ?? ""),
      consentAccepted: formData.get("consentAccepted") === "on",
    })

    setMessage(response.message)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-sand">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(227,122,44,0.24),transparent_30%),radial-gradient(circle_at_14%_28%,rgba(183,62,31,0.21),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(26,58,92,0.86),transparent_36%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_45%,var(--charcoal)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(237,227,211,0.45)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.35)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-charcoal to-transparent" />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-8 pt-8 md:px-6 md:pb-10 md:pt-10 xl:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-saffron shadow-[0_0_28px_rgba(227,122,44,0.16)]">
              <Mic2 className="size-4" aria-hidden="true" />
              VOICE OF BALOCHISTAN
            </p>
            <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight text-sand sm:text-4xl md:text-5xl">
              Help teach AI how Balochi really sounds
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-sand/72 md:text-base md:leading-7">
              Contribute short voice clips and help build better Balochi
              pronunciation, rhythm, and vocal quality for future generations
              of AI music.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contribution-form"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-saffron px-5 text-sm font-black text-sand shadow-[0_16px_40px_rgba(227,122,44,0.26)] transition hover:bg-terracotta"
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Start contribution
              </a>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-sand/15 bg-sand/8 px-5 text-sm font-bold text-sand transition hover:bg-sand/12"
              >
                <ScrollText className="size-4" aria-hidden="true" />
                Learn how it works
              </a>
            </div>
          </div>

          <Panel>
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-full border border-saffron/30 bg-saffron/15 text-saffron">
                <Music2 className="size-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sand/50">
                  Program preview
                </p>
                <h2 className="mt-1 text-2xl font-black text-sand">
                  Cultural voice contribution
                </h2>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-sand/70">
              This preview shows the future contribution flow. Uploads,
              reviews, consent records, and contributor rewards will be
              connected later.
            </p>
            <div className="mt-5 grid gap-2 text-sm font-semibold text-sand/76">
              <MiniMetric label="Clip length" value="30-60 sec" />
              <MiniMetric label="Audio" value="Phone OK" />
              <MiniMetric label="Status" value="Preview only" />
            </div>
          </Panel>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {whyCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </section>

        <section id="how-it-works" className="mt-5 scroll-mt-24 md:scroll-mt-28">
          <Panel>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-saffron" aria-hidden="true" />
              <h2 className="text-2xl font-black text-sand">How it works</h2>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-5">
              {steps.map((step, index) => (
                <article
                  key={step}
                  className="rounded-2xl border border-sand/10 bg-sand/7 p-4"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-saffron text-sm font-black text-sand">
                    {index + 1}
                  </span>
                  <p className="mt-4 text-sm font-bold leading-6 text-sand/82">
                    {step}
                  </p>
                </article>
              ))}
            </div>
          </Panel>
        </section>

        <section
          id="contribution-form"
          className="mt-4 scroll-mt-24 md:scroll-mt-28"
        >
          <Panel>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div>
                <div className="flex items-center gap-3">
                  <FileAudio className="size-5 text-saffron" aria-hidden="true" />
                  <h2 className="text-2xl font-black text-sand">
                    Contribution form preview
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-sand/68">
                  This form is a frontend-only preview. It does not upload,
                  store, or submit any real voice data yet.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 grid gap-3.5">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <Field label="Full name">
                      <input
                        name="fullName"
                        placeholder="Your name"
                        className="h-12 w-full rounded-2xl border border-sand/18 bg-sand/10 px-4 text-sm font-semibold text-sand outline-none transition placeholder:text-sand/52 focus:border-saffron/55 focus:bg-sand/12"
                      />
                    </Field>
                    <Field label="Email">
                      <input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-2xl border border-sand/18 bg-sand/10 px-4 text-sm font-semibold text-sand outline-none transition placeholder:text-sand/52 focus:border-saffron/55 focus:bg-sand/12"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <Field label="Dialect">
                      <select
                        name="dialect"
                        className="h-12 w-full rounded-2xl border border-sand/18 bg-sand/10 px-4 text-sm font-semibold text-sand outline-none transition focus:border-saffron/55 focus:bg-sand/12 [&>option]:bg-charcoal [&>option]:text-sand"
                      >
                        <option>Rakhshani</option>
                        <option>Makrani</option>
                        <option>Sulaimani</option>
                        <option>Mixed / Not sure</option>
                      </select>
                    </Field>
                    <Field label="Recording type">
                      <select
                        name="recordingType"
                        className="h-12 w-full rounded-2xl border border-sand/18 bg-sand/10 px-4 text-sm font-semibold text-sand outline-none transition focus:border-saffron/55 focus:bg-sand/12 [&>option]:bg-charcoal [&>option]:text-sand"
                      >
                        <option>Speaking</option>
                        <option>Singing</option>
                        <option>Poetry</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Transcript">
                    <textarea
                      name="transcript"
                      placeholder="Type a short transcript of what you recorded..."
                      className="min-h-28 w-full resize-none rounded-2xl border border-sand/18 bg-sand/10 px-4 py-3 text-sm font-semibold text-sand outline-none transition placeholder:text-sand/52 focus:border-saffron/55 focus:bg-sand/12"
                    />
                  </Field>

                  <button
                    type="button"
                    aria-label="Upload audio placeholder"
                    className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-saffron/35 bg-saffron/10 px-4 py-5 text-center text-sm font-bold text-saffron transition hover:border-terracotta/60 hover:bg-terracotta/10"
                  >
                    <Upload className="size-6" aria-hidden="true" />
                    Upload audio placeholder
                    <span className="text-xs font-semibold text-sand/48">
                      Real upload will be connected later
                    </span>
                  </button>

                  <label className="flex items-start gap-3 rounded-2xl border border-sand/10 bg-sand/7 p-4 text-sm font-semibold leading-6 text-sand/72">
                    <input
                      name="consentAccepted"
                      type="checkbox"
                      className="mt-1 size-4 accent-saffron"
                    />
                    <span>
                      I understand this is a preview and future submissions
                      will require clear consent terms before any data is used.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-saffron px-5 text-sm font-black text-sand shadow-[0_16px_40px_rgba(227,122,44,0.24)] transition hover:bg-terracotta"
                  >
                    <Sparkles className="size-4" aria-hidden="true" />
                    Submit preview
                  </button>

                  {message ? (
                    <p role="status" className="rounded-2xl border border-saffron/25 bg-saffron/10 px-4 py-3 text-sm font-semibold text-saffron">
                      {message}
                    </p>
                  ) : null}
                </form>
              </div>

              <div className="rounded-[1.15rem] border border-terracotta/20 bg-terracotta/8 p-4">
                <ShieldCheck className="size-7 text-saffron" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-black text-sand">
                  Consent first
                </h3>
                <p className="mt-3 text-sm leading-6 text-sand/70">
                  The real contribution flow will include explicit consent,
                  review, withdrawal policy details, and separate agreements
                  for any Featured Artist voice model.
                </p>
              </div>
            </div>
          </Panel>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Panel>
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-saffron" aria-hidden="true" />
              <h2 className="text-2xl font-black text-sand">
                Consent and ethics
              </h2>
            </div>
            <ul className="mt-5 grid gap-2 text-sm font-semibold leading-6 text-sand/76">
              {ethics.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-2xl border border-sand/10 bg-sand/7 p-4"
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-saffron"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <div className="flex items-center gap-3">
              <HeartHandshake
                className="size-5 text-saffron"
                aria-hidden="true"
              />
              <h2 className="text-2xl font-black text-sand">
                Contributor benefits
              </h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <article
                  key={benefit}
                  className="rounded-2xl border border-sand/10 bg-sand/7 p-4"
                >
                  <p className="text-sm font-bold leading-6 text-sand/82">
                    {benefit}
                  </p>
                </article>
              ))}
            </div>
          </Panel>
        </div>

        <section className="mt-5">
          <Panel>
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
          </Panel>
        </section>
      </section>
    </div>
  )
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-sand/15 bg-sand/10 p-2.5 shadow-[0_18px_52px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
      <div className="h-full rounded-[1.15rem] border border-sand/10 bg-charcoal/50 p-4 md:p-5">
        {children}
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  text,
  title,
}: {
  icon: ReactNode
  text: string
  title: string
}) {
  return (
    <article className="rounded-[1.5rem] border border-sand/15 bg-sand/10 p-2.5 shadow-[0_18px_52px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
      <div className="h-full rounded-[1.15rem] border border-sand/10 bg-charcoal/50 p-4">
        <span className="flex size-11 items-center justify-center rounded-full border border-saffron/25 bg-saffron/12 text-saffron">
          {icon}
        </span>
        <h2 className="mt-5 text-xl font-black text-sand">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-sand/68">{text}</p>
      </div>
    </article>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-sand/10 bg-sand/7 px-4 py-3">
      <span>{label}</span>
      <span className="font-black text-sand">{value}</span>
    </div>
  )
}

function Field({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-sand/66">
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  )
}

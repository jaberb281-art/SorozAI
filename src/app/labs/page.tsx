"use client"

import { useState } from "react"

const LABS = [
  {
    title: "Genre Wheel",
    status: "Preview",
    description: "Spin the wheel to discover Balochi styles, moods, and instruments.",
    visual: "genre",
  },
  {
    title: "Zahirok Radio",
    status: "Coming soon",
    description: "24/7 generated Balochi-inspired music streams from the community.",
    visual: "radio",
  },
  {
    title: "Rhythm Lab",
    status: "Preview",
    description: "Experiment with Doholl, Damboora, Suroz, and modern beat patterns.",
    visual: "rhythm",
  },
] as const

const GENRE_WORDS = [
  "Zahirok",
  "Liko",
  "Damboora",
  "Suroz",
  "Doholl",
  "Makkuran",
  "Sufi",
  "Wedding",
  "Coastal",
  "Night drive",
  "Folk",
  "Hip-hop",
  "Rubab",
  "Turbat",
  "Gwadar",
]

export default function LabsPage() {
  const [labNote, setLabNote] = useState("")

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#101010] text-sand">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(227,122,44,0.1),transparent_28%),linear-gradient(180deg,#111113_0%,#0d0d0f_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(237,227,211,0.42)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(237,227,211,0.08),transparent_42%)]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-8 pt-14 md:px-8 lg:pt-16">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-black tracking-tight text-white md:text-6xl">
            Labs
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-sand/64">
            Experimental tools for creating and discovering Balochi music with Zahirok.
          </p>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-3">
          {LABS.map((lab) => (
            // MOCK: replace with real Labs experiment route later
            <button
              key={lab.title}
              type="button"
              aria-label={`${lab.title} experiment - ${lab.status}`}
              onClick={() => setLabNote(`${lab.title} is coming soon.`)}
              className="group block w-full rounded-[1.35rem] text-left outline-none transition duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-4 focus-visible:ring-offset-[#101010]"
            >
              <div className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition group-hover:border-saffron/28 group-hover:bg-white/[0.06]">
                <LabVisual visual={lab.visual} status={lab.status} />
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-white">{lab.title}</h2>
                  <span className="rounded-full border border-saffron/24 bg-saffron/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-saffron">
                    {lab.status}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-sand/58">
                  {lab.description}
                </p>
              </div>
            </button>
          ))}
        </section>

        {labNote && (
          <p role="status" className="mx-auto mt-8 max-w-md rounded-xl border border-saffron/25 bg-saffron/10 px-5 py-3 text-center text-sm font-semibold text-saffron">
            {labNote}
          </p>
        )}
      </main>
    </div>
  )
}

function LabVisual({ status, visual }: { status: string; visual: string }) {
  if (visual === "genre") {
    return (
      <div className="relative h-[326px] bg-[#1b1b1c] p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(227,122,44,0.1),transparent_32%)]" />
        <div className="relative flex h-full flex-wrap content-start gap-x-4 gap-y-5 overflow-hidden">
          {GENRE_WORDS.map((word, index) => (
            <span
              key={word}
              className={`text-sm font-black ${
                index % 4 === 0
                  ? "text-saffron"
                  : index % 4 === 1
                    ? "text-rose-400"
                    : index % 4 === 2
                      ? "text-amber-300"
                      : "text-sky-300"
              }`}
              style={{
                transform: `rotate(${(index % 5) * 5 - 10}deg)`,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (visual === "radio") {
    return (
      <div className="relative h-[326px] overflow-hidden bg-[linear-gradient(135deg,rgba(18,93,112,0.82),rgba(13,16,28,0.9)),radial-gradient(circle_at_62%_24%,rgba(237,227,211,0.7),transparent_20%)]">
        <div className="absolute inset-0 scale-110 bg-[radial-gradient(circle_at_26%_78%,rgba(227,122,44,0.55),transparent_22%),radial-gradient(circle_at_78%_28%,rgba(80,210,230,0.62),transparent_27%),radial-gradient(circle_at_54%_52%,rgba(237,227,211,0.25),transparent_18%)] blur-xl" />
        <div className="absolute inset-x-8 bottom-8 h-16 rounded-full bg-black/18 blur-2xl" />
      </div>
    )
  }

  return (
    <div className="relative h-[326px] overflow-hidden bg-black p-5">
      <span className="absolute left-4 top-4 rounded-full bg-saffron px-3 py-1 text-xs font-black uppercase text-[#101010]">
        {status}
      </span>
      <div className="flex h-full items-center justify-center">
        <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
          {Array.from({ length: 98 }, (_, index) => {
            const active = [4, 9, 17, 24, 33, 39, 48, 53, 61, 70, 76, 82, 91].includes(index)
            return (
              <span
                key={index}
                className={`size-4 rounded-[4px] border border-white/10 ${
                  active
                    ? index % 3 === 0
                      ? "bg-saffron shadow-[0_0_18px_rgba(227,122,44,0.55)]"
                      : index % 3 === 1
                        ? "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.55)]"
                        : "bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.55)]"
                    : "bg-white/[0.055]"
                }`}
              />
            )
          })}
        </div>
      </div>
      <p className="absolute bottom-8 left-0 right-0 text-center font-mono text-3xl font-black tracking-[0.2em] text-white">
        RHYTHM
      </p>
    </div>
  )
}

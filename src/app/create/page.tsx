"use client"

import { useEffect, useRef, useState } from "react"
import {
  Check,
  ChevronDown,
  Download,
  Loader2,
  Play,
  Share2,
  Sparkles,
  X,
} from "lucide-react"

import {
  GENRE_PRESETS,
  MODERN_INSTRUMENTS,
  TRADITIONAL_INSTRUMENTS,
} from "@/lib/music-options"
import type { GenrePreset, Instrument } from "@/lib/types"
import { InstrumentCard } from "@/components/create/instrument-card"

// ── Page-local types ──────────────────────────────────────────────────────────

type Dialect = "Makrani" | "Rakhshani" | "Sulaimani"
type Visibility = "private" | "public"
type StudioStatus = "idle" | "queued" | "generating" | "mixing" | "done"

interface GeneratedSong {
  title: string
  genre: GenrePreset
  dialect: Dialect
  duration: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DIALECTS: Dialect[] = ["Makrani", "Rakhshani", "Sulaimani"]

const STATUS_LABELS: Record<StudioStatus, string> = {
  idle: "",
  queued: "Your track is queued…",
  generating: "Generating melody…",
  mixing: "Mixing instruments…",
  done: "Track ready!",
}

const GENERATION_STAGES: Exclude<StudioStatus, "idle" | "done">[] = [
  "queued",
  "generating",
  "mixing",
]

const VISIBILITY_META = {
  private: { emoji: "🔒", label: "Private", description: "Only you" },
  public: { emoji: "🌍", label: "Public", description: "Everyone" },
} as const

// MOCK: replace with api-client.generateSong() title from backend when ready
const MOCK_TITLES: Partial<Record<GenrePreset, string[]>> = {
  Zahirok: ["Makran Evening", "Desert Wind", "Coastal Drift"],
  Liko: ["Coastal Rhythm", "Ocean Beat", "Tide Song"],
  Sout: ["Mountain Echo", "Highland Call", "Valley Hymn"],
  Naat: ["Sacred Ground", "Holy Verse", "Devotion"],
  "Modern Balochi Pop": ["New Horizon", "City Lights", "Urban Balochi"],
  Wedding: ["Joyful Doholl", "Wedding Dance", "Celebration"],
  Lullaby: ["Soft Cradle", "Quiet Night", "Sleep Song"],
  Sufi: ["Inner Journey", "Sufi Breath", "Wandering Soul"],
  "Hip-Hop Fusion": ["Street Zahirok", "Concrete Desert", "Balochi Bars"],
  "Custom Prompt": ["Untitled Track", "New Creation", "My Song"],
}

function getMockTitle(genre: GenrePreset | ""): string {
  if (!genre) return "Untitled Track"
  const list = MOCK_TITLES[genre] ?? ["Untitled Track"]
  return list[Math.floor(Math.random() * list.length)]
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CreatePage() {
  // Composition state
  const [prompt, setPrompt] = useState("")
  const [lyrics, setLyrics] = useState("")
  const [showLyrics, setShowLyrics] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<GenrePreset | "">("")
  const [dialect, setDialect] = useState<Dialect>("Makrani")
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([
    "Suroz",
    "Damboora",
  ])
  const [visibility, setVisibility] = useState<Visibility>("private")
  const [instrumentalOnly, setInstrumentalOnly] = useState(false)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [validation, setValidation] = useState("")

  // Generation state
  const [status, setStatus] = useState<StudioStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [generatedSong, setGeneratedSong] = useState<GeneratedSong | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // MOCK: replace with api-client.generateSong() + polling api-client.getGenerationStatus() when backend is ready
  useEffect(() => {
    function clearTimer() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    if (status === "idle" || status === "done") {
      clearTimer()
      return
    }

    if (status === "queued") {
      const t = setTimeout(() => {
        setStatus("generating")
        setProgress(8)
      }, 1200)
      return () => clearTimeout(t)
    }

    if (status === "generating") {
      clearTimer()
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 62) {
            clearTimer()
            setStatus("mixing")
            return 62
          }
          return prev + 3
        })
      }, 160)
      return clearTimer
    }

    if (status === "mixing") {
      clearTimer()
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearTimer()
            // MOCK: replace with api-client.getGeneratedSong(jobId) when backend is ready
            setGeneratedSong({
              title: getMockTitle(selectedGenre),
              genre: (selectedGenre as GenrePreset) || "Zahirok",
              dialect,
              duration: "3:24",
            })
            setStatus("done")
            return 100
          }
          return prev + 2
        })
      }, 110)
      return clearTimer
    }
  }, [status, selectedGenre, dialect])

  function toggleInstrument(instrument: Instrument) {
    setSelectedInstruments((prev) =>
      prev.includes(instrument)
        ? prev.filter((i) => i !== instrument)
        : [...prev, instrument],
    )
  }

  function handleCreate() {
    if (!instrumentalOnly && prompt.trim().length === 0 && lyrics.trim().length === 0) {
      setValidation("Add a prompt or some lyrics, or turn on Instrumental Only.")
      return
    }
    setValidation("")
    setGeneratedSong(null)
    setProgress(2)
    // MOCK: replace with api-client.generateSong({ prompt, lyrics, genre: selectedGenre, dialect, instruments: selectedInstruments, isPublic: visibility === "public", instrumentalOnly }) when backend is ready
    setStatus("queued")
  }

  function handleReset() {
    setStatus("idle")
    setProgress(0)
    setGeneratedSong(null)
    setPrompt("")
    setLyrics("")
  }

  const isGenerating = status !== "idle" && status !== "done"
  const isIdle = status === "idle"
  const isDone = status === "done"
  const stageIndex = GENERATION_STAGES.indexOf(
    status as Exclude<StudioStatus, "idle" | "done">,
  )

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-sand">
      {/* Background — identical to /dashboard */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(227,122,44,0.2),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(26,58,92,0.7),transparent_34%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_46%,var(--charcoal)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(90deg,rgba(237,227,211,0.42)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.32)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-charcoal/82 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-charcoal to-transparent" />

      {/* Page content */}
      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 pb-16 pt-6 md:px-6 md:pt-8">

        {/* ── Heading ── */}
        <div className="mb-6 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-saffron shadow-[0_0_28px_rgba(227,122,44,0.16)]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Create Studio
          </p>
          <h1 className="mt-3 text-3xl font-black leading-[1.08] text-sand sm:text-[2.1rem]">
            Create a Balochi song
          </h1>
          <p className="mt-2.5 text-sm leading-6 text-sand/65">
            Write a prompt, add lyrics, choose style, and generate a Zahirok track.
          </p>
        </div>

        {/* ── Studio card ── */}
        <div className="rounded-[1.4rem] border border-sand/10 bg-charcoal/55 shadow-[0_24px_64px_rgba(0,0,0,0.35)] backdrop-blur-xl">

          {/* ════ FORM (idle + generating) ════ */}
          {(isIdle || isGenerating) && (
            <>
              {/* Prompt */}
              <div className="p-4 pb-0">
                <label
                  htmlFor="create-prompt"
                  className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-sand/45"
                >
                  Describe your song
                </label>
                <textarea
                  id="create-prompt"
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value)
                    if (validation) setValidation("")
                  }}
                  disabled={isGenerating}
                  rows={3}
                  placeholder="A late-night drive through the Makran coast, warm breeze, the sound of Suroz fading into the distance…"
                  className="w-full resize-none rounded-xl border border-sand/10 bg-sand/6 px-3.5 py-2.5 text-sm text-sand placeholder-sand/28 transition focus:border-saffron/35 focus:bg-sand/8 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* ── Lyrics section ── */}
              <div className="mt-3 px-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sand/45">
                    Your Lyrics
                    <span className="ml-1.5 font-semibold normal-case tracking-normal text-sand/32">
                      (optional)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLyrics((v) => !v)}
                    disabled={isGenerating}
                    className="flex items-center gap-1 text-[11px] font-bold text-saffron/80 transition hover:text-saffron disabled:opacity-40"
                  >
                    <ChevronDown
                      className={`size-3.5 transition-transform duration-200 ${showLyrics ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                    {showLyrics ? "Hide" : "Add lyrics"}
                  </button>
                </div>

                {showLyrics && (
                  <textarea
                    value={lyrics}
                    onChange={(e) => {
                      setLyrics(e.target.value)
                      if (validation) setValidation("")
                    }}
                    disabled={isGenerating}
                    rows={6}
                    placeholder={"Write your verses here…\n\nVerse 1:\n\nChorus:\n\nVerse 2:"}
                    className="mt-2 w-full resize-none rounded-xl border border-sand/10 bg-sand/6 px-3.5 py-2.5 font-mono text-sm leading-relaxed text-sand placeholder-sand/28 transition focus:border-saffron/35 focus:bg-sand/8 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                )}
              </div>

              {/* ── Advanced options toggle ── */}
              <div className="mt-3 px-4">
                <button
                  type="button"
                  onClick={() => setIsAdvancedOpen((v) => !v)}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-sand/50 transition hover:text-sand/75 disabled:opacity-40"
                  aria-expanded={isAdvancedOpen}
                >
                  <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${isAdvancedOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                  Advanced options
                </button>

                {isAdvancedOpen && (
                  <div className="mt-2.5 rounded-2xl border border-sand/10 bg-sand/[0.04] p-2 sm:p-2.5">

                    {/* Genre preset */}
                    <OptionGroup title="Genre">
                      {GENRE_PRESETS.map((g) => (
                        <ChoicePill
                          key={g}
                          label={g}
                          active={selectedGenre === g}
                          onClick={() =>
                            setSelectedGenre((prev) => (prev === g ? "" : g))
                          }
                        />
                      ))}
                    </OptionGroup>

                    {/* Dialect */}
                    <OptionGroup title="Dialect">
                      {DIALECTS.map((d) => (
                        <ChoicePill
                          key={d}
                          label={d}
                          active={dialect === d}
                          onClick={() => setDialect(d)}
                        />
                      ))}
                    </OptionGroup>

                    {/* Traditional instruments */}
                    <OptionGroup title="Traditional Instruments">
                      <div className="grid w-full grid-cols-2 gap-1.5 md:grid-cols-5">
                        {TRADITIONAL_INSTRUMENTS.map((inst) => (
                          <InstrumentCard
                            key={inst}
                            instrument={inst}
                            selected={selectedInstruments.includes(inst)}
                            onToggle={toggleInstrument}
                          />
                        ))}
                      </div>
                    </OptionGroup>

                    {/* Modern instruments */}
                    <OptionGroup title="Modern Instruments">
                      <div className="grid w-full grid-cols-2 gap-1.5 md:grid-cols-4">
                        {MODERN_INSTRUMENTS.map((inst) => (
                          <InstrumentCard
                            key={inst}
                            instrument={inst}
                            selected={selectedInstruments.includes(inst)}
                            onToggle={toggleInstrument}
                          />
                        ))}
                      </div>
                    </OptionGroup>

                    {/* Visibility */}
                    <OptionGroup title="Visibility">
                      <div className="grid w-full grid-cols-2 gap-1.5">
                        {(["private", "public"] as const).map((v) => {
                          const meta = VISIBILITY_META[v]
                          return (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setVisibility(v)}
                              aria-pressed={visibility === v}
                              className={`flex items-center gap-2 rounded-xl border p-2 text-left transition ${visibility === v
                                  ? "border-saffron bg-saffron text-sand shadow-[0_8px_24px_rgba(227,122,44,0.18)]"
                                  : "border-sand/12 bg-sand/8 text-sand/72 hover:border-sand/20 hover:bg-sand/12 hover:text-sand"
                                }`}
                            >
                              <span className="min-w-0">
                                <span className="block text-[13px] font-black leading-none">
                                  {meta.emoji} {meta.label}
                                </span>
                                <span
                                  className={`mt-0.5 block text-[11px] font-semibold leading-tight ${visibility === v ? "text-sand/80" : "text-sand/48"
                                    }`}
                                >
                                  {meta.description}
                                </span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </OptionGroup>

                    {/* Instrumental Only + Generate Lyrics */}
                    <div className="mt-2 flex flex-col gap-2 border-t border-sand/10 pt-2 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={() => setInstrumentalOnly((v) => !v)}
                        aria-pressed={instrumentalOnly}
                        className="flex h-9 w-full items-center justify-between rounded-full border border-sand/15 bg-charcoal/20 p-1 text-left sm:w-56"
                      >
                        <span className="px-3 text-[13px] font-bold">
                          Instrumental Only
                        </span>
                        <span
                          className={`flex h-7 w-12 items-center rounded-full p-0.5 transition ${instrumentalOnly ? "bg-saffron" : "bg-sand/15"
                            }`}
                        >
                          <span
                            className={`size-5 rounded-full bg-sand transition-transform duration-200 ${instrumentalOnly ? "translate-x-5" : "translate-x-0"
                              }`}
                          />
                        </span>
                      </button>

                      {/* MOCK: replace with api-client.generateLyrics({ prompt, genre: selectedGenre, dialect }) when backend is ready */}
                      <button
                        type="button"
                        onClick={() => setShowLyrics(true)}
                        className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-sand/12 bg-transparent px-3 text-xs font-bold text-sand/55 transition hover:border-sand/22 hover:text-sand/80 sm:w-auto"
                      >
                        <Sparkles
                          className="size-3.5 text-saffron/70"
                          aria-hidden="true"
                        />
                        Generate Lyrics with AI
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Validation */}
              {validation && (
                <div className="mx-4 mt-3 rounded-xl border border-terracotta/30 bg-terracotta/10 px-3.5 py-2.5 text-sm font-semibold text-terracotta">
                  {validation}
                </div>
              )}

              {/* ── Generation progress ── */}
              {isGenerating && (
                <div className="mx-4 mt-3 rounded-2xl border border-saffron/20 bg-saffron/8 p-3">
                  <div className="flex items-center gap-2.5">
                    <Loader2
                      className="size-4 shrink-0 animate-spin text-saffron"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-bold text-saffron">
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="ml-auto text-xs font-bold tabular-nums text-sand/45">
                      {progress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand/10">
                    <div
                      className="h-full rounded-full bg-saffron shadow-[0_0_10px_rgba(227,122,44,0.45)] transition-all duration-300"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Generation progress"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Stage chips */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {GENERATION_STAGES.map((stage, i) => {
                      const isCurrent = stage === status
                      const isPast = i < stageIndex
                      return (
                        <span
                          key={stage}
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] transition ${isCurrent
                              ? "border-saffron/40 bg-saffron/15 text-saffron"
                              : isPast
                                ? "border-sand/12 bg-sand/6 text-sand/40 line-through"
                                : "border-sand/8 bg-transparent text-sand/22"
                            }`}
                        >
                          {stage}
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Create button */}
              <div className="p-4 pt-3">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={isGenerating}
                  className="h-11 w-full rounded-full bg-saffron text-sm font-black text-sand shadow-[0_10px_28px_rgba(227,122,44,0.28)] transition hover:bg-terracotta disabled:opacity-60 disabled:shadow-none"
                >
                  {isGenerating ? "Generating…" : "Create"}
                </button>
              </div>
            </>
          )}

          {/* ════ RESULT CARD (done) ════ */}
          {isDone && generatedSong && (
            <div className="p-4">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-saffron" aria-hidden="true" />
                  <span className="text-sm font-black text-saffron">Track ready</span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Start over"
                  className="flex size-7 items-center justify-center rounded-full border border-sand/12 text-sand/40 transition hover:border-sand/22 hover:text-sand/65"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Song info + play */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-sand">
                    {generatedSong.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-saffron/30 bg-saffron/10 px-2.5 py-0.5 text-[11px] font-black text-saffron">
                      {generatedSong.genre}
                    </span>
                    <span className="rounded-full border border-sand/15 bg-sand/8 px-2.5 py-0.5 text-[11px] font-bold text-sand/65">
                      {generatedSong.dialect}
                    </span>
                    <span className="rounded-full border border-sand/15 bg-sand/8 px-2.5 py-0.5 text-[11px] font-bold text-sand/65">
                      {generatedSong.duration}
                    </span>
                  </div>
                </div>

                {/* MOCK: replace with real audio playback via api-client.getStreamUrl(songId) when backend is ready */}
                <button
                  type="button"
                  aria-label={`Play ${generatedSong.title}`}
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-saffron text-sand shadow-[0_8px_20px_rgba(227,122,44,0.3)] transition hover:bg-terracotta"
                >
                  <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
                </button>
              </div>

              {/* Mock waveform */}
              <div
                className="mt-4 flex h-14 items-end gap-px"
                aria-hidden="true"
                role="presentation"
              >
                {Array.from({ length: 52 }, (_, i) => (
                  <span
                    key={i}
                    className={`w-full rounded-full ${i < 15 ? "bg-saffron" : "bg-sand/30"
                      }`}
                    style={{ height: `${10 + ((i * 17 + 5) % 36)}px` }}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[10px] font-bold text-sand/32">
                <span>0:00</span>
                <span>{generatedSong.duration}</span>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                {/* MOCK: replace with api-client.downloadSong(songId) when backend is ready */}
                <button
                  type="button"
                  disabled
                  title="Download available when backend is connected"
                  className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-sand/10 bg-sand/5 px-3 py-2.5 text-xs font-bold text-sand/30"
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  Download
                </button>

                {/* MOCK: replace with api-client.shareSong(songId) when backend is ready */}
                <button
                  type="button"
                  disabled
                  title="Sharing available when backend is connected"
                  className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-sand/10 bg-sand/5 px-3 py-2.5 text-xs font-bold text-sand/30"
                >
                  <Share2 className="size-3.5" aria-hidden="true" />
                  Share
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3 py-2.5 text-xs font-bold text-saffron transition hover:bg-saffron/18"
                >
                  Create another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function OptionGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-2.5 first:mt-0">
      <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-sand/45">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function ChoicePill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-7 items-center rounded-full border px-2 py-0.5 text-[11.5px] font-bold leading-none transition sm:px-2.5 ${active
          ? "border-saffron bg-saffron text-sand shadow-[0_8px_20px_rgba(227,122,44,0.22)]"
          : "border-sand/12 bg-sand/8 text-sand/72 hover:bg-sand/12 hover:text-sand"
        }`}
    >
      {label}
    </button>
  )
}
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  AudioWaveform,
  CheckCircle2,
  FileText,
  Globe2,
  Loader2,
  Lock,
  Mic2,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Upload,
  WandSparkles,
} from "lucide-react"

import {
  GENRE_PRESETS,
  MODERN_INSTRUMENTS,
  TRADITIONAL_INSTRUMENTS,
} from "@/lib/music-options"
import type { GenrePreset, Instrument, SongStatus } from "@/lib/types"
import { InstrumentCard } from "@/components/create/instrument-card"
import { GeneratedSongPreview } from "@/components/songs/generated-song-preview"

const GENERATION_STAGES = [
  "Preparing your idea",
  "Checking lyrics and style",
  "Annotating Balochi pronunciation",
  "Generating vocal layer",
  "Composing instruments",
  "Mixing final track",
  "Saving to library",
  "Completed",
]

const PROMPT_EXAMPLES = [
  "A Soroz song about Makran evenings with Suroz and Damboora",
  "A wedding song with Doholl, Rubab, and joyful Balochi lyrics",
  "A sad folk song about leaving home and remembering the sea",
  "A Sufi Balochi song with Damboora and soft vocals",
  "A modern Balochi hip-hop fusion track about identity and future",
]

type Visibility = "private" | "public"

export function PromptComposer() {
  const [prompt, setPrompt] = useState("")
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isExamplesOpen, setIsExamplesOpen] = useState(false)
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<GenrePreset>("Soroz")
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([
    "Suroz",
    "Damboora",
  ])
  const [instrumentalOnly, setInstrumentalOnly] = useState(false)
  const [visibility, setVisibility] = useState<Visibility>("private")
  const [generatedIsPublic, setGeneratedIsPublic] = useState(false)
  const [status, setStatus] = useState<SongStatus | "idle">("idle")
  const [progress, setProgress] = useState(0)
  const [validation, setValidation] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const isWorking = status === "queued" || status === "generating"
  const isPipelineVisible = isWorking || status === "completed"
  const currentStageIndex = getCurrentStageIndex(progress, status)

  useEffect(() => {
    if (status !== "queued") {
      return
    }

    const timeout = window.setTimeout(() => {
      setStatus("generating")
    }, 450)

    return () => window.clearTimeout(timeout)
  }, [status])

  useEffect(() => {
    if (status !== "generating") {
      return
    }

    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 2, 100)

        if (next === 100) {
          window.clearInterval(interval)
          setStatus("completed")
          setShowPreview(true)
        }

        return next
      })
    }, 90)

    return () => window.clearInterval(interval)
  }, [status])

  function toggleInstrument(instrument: Instrument) {
    setSelectedInstruments((current) =>
      current.includes(instrument)
        ? current.filter((item) => item !== instrument)
        : [...current, instrument],
    )
  }

  // MOCK: replace with api-client.generateSong() + polling api-client.getGenerationStatus() when backend is ready
  function handleCreate() {
    if (!instrumentalOnly && prompt.trim().length === 0) {
      setValidation("Add a prompt or turn on Instrumental Only.")
      return
    }

    setValidation("")
    setShowPreview(false)
    setGeneratedIsPublic(visibility === "public")
    setProgress(2)
    setStatus("queued")
  }

  function focusPrompt() {
    const promptInput = document.getElementById("prompt-composer")

    if (promptInput instanceof HTMLTextAreaElement) {
      promptInput.focus()
    }
  }

  function handlePasteLyrics() {
    setIsPlusMenuOpen(false)
    focusPrompt()
  }

  function handleExampleClick(example: string) {
    setPrompt(example)
    setValidation("")
    window.setTimeout(focusPrompt, 0)
  }

  return (
    <div id="composer" className="mx-auto mt-4 w-full max-w-[840px] scroll-mt-24 md:mt-5 md:scroll-mt-28">
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="rounded-[1.4rem] border border-sand/15 bg-sand/10 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-2xl md:rounded-[1.6rem]"
      >
        <div className="rounded-[1.05rem] border border-sand/10 bg-charcoal/55 p-2.5 md:rounded-[1.15rem] md:p-3">
          <textarea
            id="prompt-composer"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the Balochi song you want to create..."
            aria-label="Song prompt"
            aria-invalid={validation ? true : undefined}
            aria-describedby={validation ? "prompt-composer-error" : undefined}
            className="h-10 min-h-10 max-h-24 w-full resize-none bg-transparent text-[0.95rem] leading-6 text-sand outline-none placeholder:text-sand/45 md:h-12 md:min-h-12 md:max-h-28 md:text-base"
          />

          <div className="mt-2 flex flex-col gap-2.5 border-t border-sand/10 pt-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPlusMenuOpen((value) => !value)}
                  aria-expanded={isPlusMenuOpen}
                  aria-controls="prompt-options-menu"
                  aria-label="Open prompt options"
                  className="flex size-10 items-center justify-center rounded-full border border-sand/15 text-sand/80 transition hover:bg-sand/10 hover:text-sand"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>

                {isPlusMenuOpen ? (
                  <div id="prompt-options-menu" className="absolute left-0 top-12 z-20 w-64 rounded-2xl border border-sand/12 bg-charcoal/95 p-2 text-left text-sm font-bold text-sand shadow-2xl shadow-charcoal/50 backdrop-blur-xl">
                    <button
                      type="button"
                      onClick={handlePasteLyrics}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-sand/10"
                    >
                      <FileText className="size-4 text-saffron" aria-hidden="true" />
                      Paste Lyrics
                    </button>
                    <button
                      type="button"
                      disabled
                      className="flex w-full cursor-not-allowed items-center justify-between gap-3 rounded-xl px-3 py-3 text-sand/42"
                    >
                      <span className="flex items-center gap-3">
                        <Upload className="size-4" aria-hidden="true" />
                        Upload Reference
                      </span>
                      <span className="rounded-full border border-sand/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]">
                        Soon
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled
                      className="flex w-full cursor-not-allowed items-center justify-between gap-3 rounded-xl px-3 py-3 text-sand/42"
                    >
                      <span className="flex items-center gap-3">
                        <Mic2 className="size-4" aria-hidden="true" />
                        Record Voice
                      </span>
                      <span className="rounded-full border border-sand/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]">
                        Soon
                      </span>
                    </button>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setIsAdvancedOpen((value) => !value)}
                aria-expanded={isAdvancedOpen}
                aria-controls="advanced-song-options"
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-sand/15 px-4 text-sm font-bold text-sand/85 transition hover:bg-sand/10 hover:text-sand sm:flex-none"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                Advanced
              </button>
            </div>

            <div className="grid w-full grid-cols-[auto_1fr] items-center gap-2 sm:flex sm:w-auto sm:justify-end">
              <button
                type="button"
                title="Enhance Prompt"
                aria-label="Enhance Prompt"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-sand/15 px-3 text-sm font-bold text-sand/80 transition hover:bg-sand/10 hover:text-sand sm:px-4"
              >
                <WandSparkles className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Enhance</span>
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={isWorking}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-saffron px-5 text-sm font-black text-sand shadow-[0_16px_40px_rgba(227,122,44,0.26)] transition hover:bg-terracotta disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isWorking ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <AudioWaveform className="size-4" aria-hidden="true" />
                )}
                Create
              </button>
            </div>
          </div>

          <div className="mt-2 border-t border-sand/10 pt-2 text-left">
            <button
              type="button"
              onClick={() => setIsExamplesOpen((value) => !value)}
              aria-expanded={isExamplesOpen}
              aria-controls="prompt-example-panel"
              className="text-xs font-black uppercase tracking-[0.18em] text-sand/48 transition hover:text-saffron"
            >
              Need inspiration?
            </button>

            {isExamplesOpen ? (
              <div
                id="prompt-example-panel"
                className="mt-2 grid gap-1.5 rounded-2xl border border-sand/10 bg-sand/7 p-2"
              >
                {PROMPT_EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => handleExampleClick(example)}
                    className="rounded-xl px-3 py-2 text-left text-xs font-bold leading-5 text-sand/72 transition hover:bg-terracotta/10 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal active:bg-saffron/15 active:text-sand"
                  >
                    {example}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {isAdvancedOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              id="advanced-song-options"
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-2xl border border-sand/10 bg-sand/7 p-2.5 text-sand sm:p-3">
                <OptionGroup title="Genre preset">
                  {GENRE_PRESETS.map((genre) => (
                    <ChoiceButton
                      key={genre}
                      active={selectedGenre === genre}
                      onClick={() => setSelectedGenre(genre)}
                    >
                      {genre}
                    </ChoiceButton>
                  ))}
                </OptionGroup>

                <OptionGroup title="Traditional instruments">
                  <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-5">
                    {TRADITIONAL_INSTRUMENTS.map((instrument) => (
                      <InstrumentCard
                        key={instrument}
                        instrument={instrument}
                        selected={selectedInstruments.includes(instrument)}
                        onToggle={toggleInstrument}
                      />
                    ))}
                  </div>
                </OptionGroup>

                <OptionGroup title="Modern instruments">
                  <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
                    {MODERN_INSTRUMENTS.map((instrument) => (
                      <InstrumentCard
                        key={instrument}
                        instrument={instrument}
                        selected={selectedInstruments.includes(instrument)}
                        onToggle={toggleInstrument}
                      />
                    ))}
                  </div>
                </OptionGroup>

                <OptionGroup title="Visibility">
                  <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                    <VisibilityOption
                      active={visibility === "private"}
                      description="Saved only to your library"
                      icon={<Lock className="size-4" aria-hidden="true" />}
                      label="Private"
                      onClick={() => setVisibility("private")}
                    />
                    <VisibilityOption
                      active={visibility === "public"}
                      description="Can appear in the Soroz feed"
                      icon={<Globe2 className="size-4" aria-hidden="true" />}
                      label="Public"
                      onClick={() => setVisibility("public")}
                    />
                  </div>
                </OptionGroup>

                <div className="mt-3 flex flex-col gap-2 border-t border-sand/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setInstrumentalOnly((current) => !current)}
                    className="flex h-10 w-full items-center justify-between rounded-full border border-sand/15 bg-charcoal/20 p-1 text-left sm:w-64"
                    aria-pressed={instrumentalOnly}
                  >
                    <span className="px-3 text-sm font-bold">
                      Instrumental Only
                    </span>
                    <span
                      className={`flex h-8 w-14 items-center rounded-full p-1 transition ${instrumentalOnly ? "bg-saffron" : "bg-sand/15"
                        }`}
                    >
                      <span
                        className={`size-6 rounded-full bg-sand transition ${instrumentalOnly ? "translate-x-6" : "translate-x-0"
                          }`}
                      />
                    </span>
                  </button>

                  <button
                    type="button"
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-sand/15 bg-sand/7 px-3 text-sm font-bold text-sand/72 transition hover:border-saffron/25 hover:bg-saffron/10 hover:text-saffron sm:w-auto"
                  >
                    <Sparkles className="size-4 text-saffron" aria-hidden="true" />
                    Generate Lyrics with AI
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>

        {validation ? (
          <p id="prompt-composer-error" role="alert" className="px-4 pt-3 text-sm font-semibold text-saffron">
            {validation}
          </p>
        ) : null}

        {isPipelineVisible ? (
          <GenerationPipeline
            currentStageIndex={currentStageIndex}
            progress={status === "completed" ? 100 : progress}
            status={status}
          />
        ) : null}

      </motion.div>

      {showPreview ? (
        <GeneratedSongPreview
          genre={selectedGenre}
          instruments={selectedInstruments}
          isPublic={generatedIsPublic}
        />
      ) : null}
    </div>
  )
}

function VisibilityOption({
  active,
  description,
  icon,
  label,
  onClick,
}: {
  active: boolean
  description: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${active
          ? "border-saffron bg-saffron text-sand shadow-[0_12px_30px_rgba(227,122,44,0.2)]"
          : "border-sand/12 bg-sand/8 text-sand/72 hover:border-terracotta/45 hover:bg-sand/12 hover:text-sand"
        }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${active
            ? "border-sand/20 bg-sand/12"
            : "border-sand/10 bg-charcoal/30 text-saffron"
          }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-black">{label}</span>
        <span
          className={`mt-0.5 block text-xs font-semibold leading-4 ${active ? "text-sand/82" : "text-sand/52"
            }`}
        >
          {description}
        </span>
      </span>
    </button>
  )
}

function getCurrentStageIndex(
  progress: number,
  status: SongStatus | "idle",
) {
  if (status === "completed") {
    return GENERATION_STAGES.length - 1
  }

  if (status === "queued") {
    return 0
  }

  if (status !== "generating") {
    return 0
  }

  const activeStageCount = GENERATION_STAGES.length - 1
  const stageSize = 100 / activeStageCount

  return Math.min(
    GENERATION_STAGES.length - 2,
    Math.max(0, Math.floor(progress / stageSize)),
  )
}

function GenerationPipeline({
  currentStageIndex,
  progress,
  status,
}: {
  currentStageIndex: number
  progress: number
  status: SongStatus | "idle"
}) {
  return (
    <div className="px-4 pb-2 pt-4">
      <div className="rounded-2xl border border-terracotta/25 bg-terracotta/10 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.16)]" aria-live="polite">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-saffron">
              Soroz generation pipeline
            </p>
            <p className="mt-1 text-sm font-black text-sand">
              {GENERATION_STAGES[currentStageIndex]}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-sand/50">
            <span>Estimated time: 30-90 seconds</span>
            <span className="rounded-full border border-sand/10 bg-sand/7 px-2 py-1 text-sand/45">
              Mock preview
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-sand/55">
            <span>{status === "queued" ? "Queued" : status}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sand/10">
            <div
              role="progressbar"
              aria-label="Generation progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-full rounded-full bg-saffron shadow-[0_0_24px_rgba(227,122,44,0.28)] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {GENERATION_STAGES.map((stage, index) => {
            const isComplete =
              status === "completed" || index < currentStageIndex
            const isCurrent = index === currentStageIndex

            return (
              <span
                key={stage}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${isCurrent
                    ? "border-saffron bg-saffron text-sand"
                    : isComplete
                      ? "border-saffron/35 bg-saffron/10 text-saffron"
                      : "border-sand/10 bg-sand/7 text-sand/45"
                  }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                ) : null}
                {stage}
              </span>
            )
          })}
        </div>

        <p className="mt-2 text-xs font-semibold text-sand/45">
          Mock generation preview - backend not connected yet.
        </p>
      </div>
    </div>
  )
}

function OptionGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-4 first:mt-0">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-sand/50">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function ChoiceButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-9 items-center rounded-full border px-2.5 py-1.5 text-[13px] font-bold leading-none transition sm:px-3 ${active
          ? "border-saffron bg-saffron text-sand shadow-[0_10px_26px_rgba(227,122,44,0.22)]"
          : "border-sand/12 bg-sand/8 text-sand/72 hover:bg-sand/12 hover:text-sand"
        }`}
    >
      {children}
    </button>
  )
}
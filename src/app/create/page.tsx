"use client"

import { useEffect, useMemo, useRef, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Heart,
  Loader2,
  Mic2,
  Music2,
  Pause,
  Play,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from "lucide-react"

import { usePlaySong } from "@/hooks/use-play-song"
import type { GenrePreset, Instrument, Song } from "@/lib/types"

// MVP: only Makkuran dialect is supported in first release
const MVP_DIALECT = "Makkuran" as const
type Dialect = typeof MVP_DIALECT
type StudioStatus = "idle" | "queued" | "generating" | "mixing" | "done"
type LyricsMode = "Write" | "Prompt" | "Instrumental"
type CreateMode = "Simple" | "Advanced"
type InputTab = "Audio" | "Voice" | "Inspo"

interface GeneratedSong {
  id: string
  title: string
  prompt: string
  lyrics: string
  genre: GenrePreset
  dialect: Dialect
  instruments: Instrument[]
  duration: string
  createdAt: string
  isPublic: boolean
  likes: number
  plays: number
}

const STATUS_LABELS: Record<StudioStatus, string> = {
  idle: "Ready",
  queued: "Queued",
  generating: "Generating melody",
  mixing: "Mixing instruments",
  done: "Track ready",
}

const GENERATION_STAGES: Exclude<StudioStatus, "idle" | "done">[] = [
  "queued",
  "generating",
  "mixing",
]

const MOCK_TITLES = [
  "Makran Evening",
  "Coastal Zahirok",
  "Suroz at Dawn",
  "Damboora Night",
  "Memory of Gwadar",
  "Kech Valley Song",
] as const

const INPUT_TAB_ICONS = {
  Audio: Music2,
  Voice: Mic2,
  Inspo: Sparkles,
} as const

const STYLE_SUGGESTIONS = ["Zahirok folk", "Damboora", "Suroz", "Warm vocals"]

const MODEL_OPTIONS = [
  { id: "v1", label: "v1", tag: "Current", available: true },
  { id: "v1-folk", label: "v1 Folk Preview", tag: "Coming soon", available: false },
  { id: "v1-studio", label: "v1 Studio Draft", tag: "Coming soon", available: false },
] as const

// MOCK: Makkuran/Balochi-inspired lyric fragments for the Wand button
const MOCK_LYRIC_IDEAS = [
  "\n[Verse]\nThe Makran wind carries forgotten names\nDamboora strings echo across the dunes",
  "\n[Chorus]\nO Gwadar, your tides sing the old songs\nEvery wave a verse, every shore a home",
  "\n[Bridge]\nSuroz cries at dawn, the valley listens\nStones remember what the people forgot",
  "\n[Verse]\nFrom Turbat to the coast, the road hums\nA melody older than the hills themselves",
  "\n[Chorus]\nBalochi hearts beat in Makkuran time\nThe rhythm of the land, the pulse of the sea",
] as const

function getMockTitle(): string {
  return MOCK_TITLES[Math.floor(Math.random() * MOCK_TITLES.length)]
}

function getRandomLyricIdea(): string {
  return MOCK_LYRIC_IDEAS[Math.floor(Math.random() * MOCK_LYRIC_IDEAS.length)]
}

function makeGeneratedSong({
  prompt,
  lyrics,
}: {
  prompt: string
  lyrics: string
}): GeneratedSong {
  return {
    id: `mock-create-${Date.now()}`,
    title: getMockTitle(),
    prompt,
    lyrics,
    genre: "Zahirok",
    dialect: MVP_DIALECT,
    instruments: ["Damboora", "Suroz"],
    duration: "3:24",
    createdAt: new Date().toISOString(),
    isPublic: false,
    likes: 0,
    plays: 0,
  }
}

// MOCK: bridge generated song to Song for the global player store
function toPlayerSong(song: GeneratedSong): Song {
  return {
    id: song.id,
    title: song.title,
    prompt: song.prompt,
    genrePreset: song.genre,
    instruments: song.instruments,
    lyrics: song.lyrics,
    status: "completed",
    audioUrl: "/mock/audio-placeholder.mp3",
    mp3Url: "/mock/audio-placeholder.mp3",
    wavUrl: "/mock/audio-placeholder.wav",
    isPublic: song.isPublic,
    createdAt: song.createdAt,
    duration: song.duration,
    plays: song.plays,
    likes: song.likes,
    remixes: 0,
  }
}

// Wrap in Suspense because useSearchParams requires it in Next.js 16
export default function CreatePage() {
  return (
    <Suspense fallback={null}>
      <CreatePageInner />
    </Suspense>
  )
}

function CreatePageInner() {
  const searchParams = useSearchParams()
  const [createMode, setCreateMode] = useState<CreateMode>("Simple")
  const [inputTab, setInputTab] = useState<InputTab>("Audio")
  const [lyricsMode, setLyricsMode] = useState<LyricsMode>("Write")
  const [lyrics, setLyrics] = useState("")
  const [stylePrompt, setStylePrompt] = useState("")
  const [status, setStatus] = useState<StudioStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [generatedSongs, setGeneratedSongs] = useState<GeneratedSong[]>([])
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [importedPrompt, setImportedPrompt] = useState(false)
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [modelNote, setModelNote] = useState("")
  const [panelNote, setPanelNote] = useState("")
  const [sortLabel, setSortLabel] = useState<"Newest" | "Oldest">("Newest")
  const [toolbarNote, setToolbarNote] = useState("")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingGenerationRef = useRef({ prompt: "", lyrics: "" })
  const { playSong, isCurrentSong, isPlaying } = usePlaySong()
  const prefilled = useRef(false)

  // Prefill style prompt from dashboard ?prompt= query param (once only)
  useEffect(() => {
    if (prefilled.current) return
    const incoming = searchParams.get("prompt")
    if (incoming) {
      prefilled.current = true
      setStylePrompt(incoming)
      setImportedPrompt(true)
    }
  }, [searchParams])

  const hasCreationInput =
    lyricsMode === "Instrumental" ||
    lyrics.trim().length > 0 ||
    stylePrompt.trim().length > 0
  const isGenerating = status === "queued" || status === "generating" || status === "mixing"
  const canCreate = hasCreationInput && !isGenerating
  const stageIndex = GENERATION_STAGES.indexOf(
    status as Exclude<StudioStatus, "idle" | "done">,
  )
  const queue = useMemo(() => generatedSongs.map(toPlayerSong), [generatedSongs])

  // MOCK: replace with api-client call when backend is ready
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
        setProgress(12)
      }, 900)
      return () => clearTimeout(t)
    }

    if (status === "generating") {
      clearTimer()
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 64) {
            clearTimer()
            setStatus("mixing")
            return 64
          }
          return prev + 4
        })
      }, 170)
      return clearTimer
    }

    if (status === "mixing") {
      clearTimer()
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearTimer()
            setGeneratedSongs((songs) => [
              makeGeneratedSong(pendingGenerationRef.current),
              ...songs,
            ])
            setStatus("done")
            return 100
          }
          return prev + 3
        })
      }, 120)
      return clearTimer
    }
  }, [status])

  function handleCreate() {
    if (!canCreate) return

    pendingGenerationRef.current = {
      prompt: stylePrompt.trim() || "Zahirok folk with Damboora and Suroz",
      lyrics: lyricsMode === "Instrumental" ? "" : lyrics.trim(),
    }

    setProgress(3)
    setStatus("queued")
  }

  function handlePlay(song: GeneratedSong) {
    playSong(toPlayerSong(song), queue)
  }

  function handleWand() {
    if (lyricsMode === "Instrumental") {
      setPanelNote("Switch out of Instrumental to generate lyrics.")
      return
    }
    setPanelNote("")
    setLyrics((prev) => prev + getRandomLyricIdea())
  }

  function toggleLiked(songId: string) {
    setLikedIds((cur) => {
      const next = new Set(cur)
      if (next.has(songId)) next.delete(songId)
      else next.add(songId)
      return next
    })
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#111111] text-sand">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(227,122,44,0.14),transparent_24%),radial-gradient(circle_at_82%_10%,rgba(26,58,92,0.48),transparent_28%),linear-gradient(135deg,#141414_0%,#191716_48%,#101010_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(90deg,rgba(237,227,211,0.35)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.25)_1px,transparent_1px)] [background-size:36px_36px]" />

      <main className="relative z-10 flex min-h-screen flex-col gap-4 px-3 pb-[168px] pt-3 md:grid md:grid-cols-[minmax(470px,520px)_minmax(0,1fr)] md:gap-0 md:px-0 md:pb-[96px] md:pt-0">
        {/* ── LEFT PANEL ── */}
        <section className="rounded-2xl border border-sand/10 bg-[#181818]/95 shadow-[0_20px_60px_rgba(0,0,0,0.34)] md:min-h-screen md:rounded-none md:border-y-0 md:border-l-0 md:border-r md:bg-[#171717]/92">
          <div className="flex h-full flex-col p-4 md:p-5">
            {/* Top controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-10 items-center gap-2 rounded-full border border-sand/12 bg-black/20 px-4 text-sm font-black">
                <Music2 className="size-4 text-saffron" aria-hidden="true" />
                75
              </div>

              <div className="inline-flex h-10 rounded-full border border-sand/10 bg-black/20 p-1">
                {(["Simple", "Advanced"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setCreateMode(mode)}
                    aria-pressed={createMode === mode}
                    className={`rounded-full px-3.5 text-sm font-black transition ${
                      createMode === mode
                        ? "bg-sand/12 text-sand"
                        : "text-sand/50 hover:text-sand/75"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Model dropdown */}
              <div className="relative ml-auto">
                <button
                  type="button"
                  onClick={() => { setIsModelOpen((v) => !v); setModelNote("") }}
                  aria-expanded={isModelOpen}
                  aria-haspopup="listbox"
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-sand/10 bg-black/20 px-4 text-sm font-black text-sand transition hover:border-sand/20"
                >
                  v1
                  <ChevronDown className={`size-4 text-sand/45 transition-transform ${isModelOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {isModelOpen && (
                  <div role="listbox" aria-label="Select model" className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-sand/12 bg-[#1e1e20] p-1 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                    {MODEL_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        role="option"
                        aria-selected={opt.id === "v1"}
                        onClick={() => {
                          if (opt.available) {
                            setIsModelOpen(false)
                            setModelNote("")
                          } else {
                            setModelNote("This model is not available yet.")
                          }
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold transition ${
                          opt.id === "v1"
                            ? "bg-sand/10 text-white"
                            : "text-sand/60 hover:bg-sand/[0.06] hover:text-sand"
                        }`}
                      >
                        {opt.label}
                        <span className={`text-[10px] font-black uppercase tracking-wider ${opt.available ? "text-saffron" : "text-sand/40"}`}>
                          {opt.tag}
                        </span>
                      </button>
                    ))}
                    {modelNote && (
                      <p role="status" className="mt-1 rounded-lg border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-xs font-semibold text-saffron">
                        {modelNote}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Input tabs */}
            <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-[1.45rem] border border-sand/8 bg-black/18">
              {(["Audio", "Voice", "Inspo"] as const).map((tab) => {
                const Icon = INPUT_TAB_ICONS[tab]
                const isActive = inputTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setInputTab(tab)}
                    aria-pressed={isActive}
                    className={`flex h-16 items-center justify-center gap-2 border-r border-sand/8 text-sm font-black last:border-r-0 transition ${
                      isActive
                        ? "bg-sand/[0.08] text-sand"
                        : "text-sand/50 hover:bg-sand/[0.04] hover:text-sand/75"
                    }`}
                  >
                    {!isActive && <Plus className="size-4" aria-hidden="true" />}
                    <Icon className={`size-4 ${isActive ? "text-saffron" : "text-saffron/70"}`} aria-hidden="true" />
                    <span>{tab}</span>
                  </button>
                )
              })}
            </div>

            {/* Tab content */}
            {inputTab === "Audio" ? (
              <>
                {/* Lyrics section */}
                <div className="mt-5 rounded-[1.35rem] border border-sand/8 bg-sand/[0.045] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 text-sm font-black">
                      <ChevronDown className="size-4 text-sand/70" aria-hidden="true" />
                      Lyrics
                    </div>
                    <div className="ml-auto inline-flex rounded-full bg-black/20 p-1">
                      {(["Write", "Prompt", "Instrumental"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => { setLyricsMode(mode); setPanelNote("") }}
                          aria-pressed={lyricsMode === mode}
                          className={`rounded-full px-3 py-1.5 text-xs font-black transition ${
                            lyricsMode === mode
                              ? "bg-sand/12 text-sand"
                              : "text-sand/50 hover:text-sand/75"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    disabled={lyricsMode === "Instrumental" || isGenerating}
                    rows={9}
                    placeholder={
                      "[Verse]\nA late evening over the Makran coast\nDamboora answers the wind\n\n[Chorus]\nSing in warm Makkuran phrasing..."
                    }
                    className="mt-5 h-56 w-full resize-none bg-transparent text-sm leading-6 text-sand outline-none placeholder:text-sand/30 disabled:cursor-not-allowed disabled:opacity-35"
                  />

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleWand}
                        className="inline-flex size-10 items-center justify-center rounded-full bg-sand/[0.07] text-sand/58 transition hover:bg-sand/[0.12] hover:text-sand"
                        aria-label="Generate lyric idea"
                      >
                        <Wand2 className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPanelNote("Advanced settings are coming soon.")}
                        className="inline-flex size-10 items-center justify-center rounded-full bg-sand/[0.07] text-sand/58 transition hover:bg-sand/[0.12] hover:text-sand"
                        aria-label="Lyric settings"
                      >
                        <SlidersHorizontal className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <span className="rounded-full border border-saffron/22 bg-saffron/8 px-3 py-1 text-[11px] font-black text-saffron">
                      Makkuran dialect
                    </span>
                  </div>

                  {panelNote && (
                    <p role="status" className="mt-3 rounded-lg border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-xs font-semibold text-saffron">
                      {panelNote}
                    </p>
                  )}
                </div>

                {/* Styles section */}
                <div className="mt-4 rounded-[1.35rem] border border-sand/8 bg-sand/[0.045] p-4">
                  <div className="flex items-center gap-2 text-sm font-black">
                    <ChevronDown className="size-4 text-sand/70" aria-hidden="true" />
                    Styles
                    {importedPrompt && (
                      <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-saffron/70">
                        Prompt imported from Dashboard
                      </span>
                    )}
                  </div>
                  <textarea
                    value={stylePrompt}
                    onChange={(e) => { setStylePrompt(e.target.value); setImportedPrompt(false) }}
                    disabled={isGenerating}
                    rows={4}
                    placeholder="Zahirok folk, Damboora, Suroz, warm Makkuran vocals..."
                    className="mt-4 min-h-24 w-full resize-none bg-transparent text-sm leading-6 text-sand outline-none placeholder:text-sand/30 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STYLE_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() =>
                          setStylePrompt((value) =>
                            value ? `${value}, ${suggestion}` : suggestion,
                          )
                        }
                        disabled={isGenerating}
                        className="rounded-full border border-sand/10 bg-black/18 px-3 py-1.5 text-xs font-bold text-sand/58 transition hover:border-saffron/30 hover:text-sand disabled:opacity-40"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Voice / Inspo placeholder */
              <div className="mt-5 flex min-h-[320px] flex-1 items-center justify-center rounded-[1.35rem] border border-sand/8 bg-sand/[0.045] p-6 text-center">
                <div>
                  {inputTab === "Voice" ? (
                    <Mic2 className="mx-auto size-10 text-saffron/50" aria-hidden="true" />
                  ) : (
                    <Sparkles className="mx-auto size-10 text-saffron/50" aria-hidden="true" />
                  )}
                  <p className="mt-4 text-sm font-semibold text-sand/55">
                    {inputTab === "Voice"
                      ? "Voice controls are coming soon."
                      : "Inspiration prompts are coming soon."}
                  </p>
                </div>
              </div>
            )}

            {/* Bottom: progress + create */}
            <div className="mt-auto pt-5">
              <GenerationProgress
                status={status}
                progress={progress}
                isGenerating={isGenerating}
                stageIndex={stageIndex}
              />

              <button
                type="button"
                onClick={handleCreate}
                disabled={!canCreate}
                className="mt-3 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-saffron text-base font-black text-[#171717] shadow-[0_14px_34px_rgba(227,122,44,0.22)] transition hover:bg-[#f09a4f] disabled:cursor-not-allowed disabled:bg-sand/10 disabled:text-sand/28 disabled:shadow-none"
              >
                {isGenerating ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Music2 className="size-4" aria-hidden="true" />
                )}
                Create
              </button>
            </div>
          </div>
        </section>

        {/* ── RIGHT PANEL (Workspace) ── */}
        <section className="flex min-h-[640px] flex-col rounded-2xl border border-sand/10 bg-[#111111]/82 shadow-[0_20px_60px_rgba(0,0,0,0.26)] md:min-h-screen md:rounded-none md:border-0 md:bg-transparent">
          <div className="flex flex-1 flex-col px-4 py-5 md:px-5 md:py-7 xl:px-6">
            <div className="flex flex-wrap items-center gap-2 text-lg font-black">
              <span>Workspaces</span>
              <ChevronRight className="size-4 text-sand/35" aria-hidden="true" />
              <span className="text-sand/68">My Workspace</span>
            </div>

            {/* Workspace toolbar */}
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <label className="relative min-w-[220px] flex-1">
                <span className="sr-only">Search workspace</span>
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-sand/45"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Search"
                  className="h-12 w-full rounded-full border border-sand/7 bg-sand/[0.055] pl-12 pr-4 text-sm font-semibold text-sand outline-none placeholder:text-sand/42 focus:border-saffron/35"
                />
              </label>

              <button
                type="button"
                onClick={() => setToolbarNote("Filters coming soon.")}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-sand/[0.08] px-4 text-sm font-black text-sand transition hover:bg-sand/[0.12]"
              >
                <Filter className="size-4" aria-hidden="true" />
                Filters
                <ChevronDown className="size-4 text-sand/55" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setSortLabel((v) => v === "Newest" ? "Oldest" : "Newest")}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-sand/[0.08] px-4 text-sm font-black text-sand transition hover:bg-sand/[0.12]"
              >
                {sortLabel}
                <ChevronDown className="size-4 text-sand/55" aria-hidden="true" />
              </button>

              {["Liked", "Public", "Uploads"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setToolbarNote(`${chip} filter coming soon.`)}
                  className="h-12 rounded-full border border-sand/10 px-4 text-sm font-black text-sand transition hover:border-saffron/28"
                >
                  {chip}
                </button>
              ))}

              {/* Pagination — single page, disabled */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="inline-flex size-11 items-center justify-center rounded-full bg-sand/[0.08] text-sand/30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <span className="inline-flex h-11 min-w-16 items-center justify-center rounded-full border border-sand/10 text-sm font-black">
                  1
                </span>
                <button
                  type="button"
                  disabled
                  className="inline-flex size-11 items-center justify-center rounded-full bg-sand/[0.08] text-sand/30"
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {toolbarNote && (
              <p role="status" className="mt-3 max-w-sm rounded-lg border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-xs font-semibold text-saffron">
                {toolbarNote}
              </p>
            )}

            {/* Generation banner */}
            {isGenerating && (
              <div className="mt-5 rounded-2xl border border-saffron/18 bg-saffron/[0.06] p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="size-5 animate-spin text-saffron" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-black text-saffron">
                      {STATUS_LABELS[status]}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-sand/48">
                      Building a mock Zahirok track for this workspace.
                    </p>
                  </div>
                  <span className="ml-auto text-xs font-black tabular-nums text-sand/58">
                    {progress}%
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand/10">
                  <div
                    className="h-full rounded-full bg-saffron transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Generated songs */}
            <div className="flex flex-1 flex-col">
              {generatedSongs.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-24 text-center">
                  <div>
                    <p className="text-base font-black text-sand/55">No songs found</p>
                    <p className="mt-2 text-sm font-semibold text-sand/38">
                      Create your first Zahirok track from the left panel.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 grid gap-3">
                  {generatedSongs.map((song) => {
                    const playerSong = toPlayerSong(song)
                    const active = isCurrentSong(playerSong)
                    const playing = active && isPlaying
                    const isLiked = likedIds.has(song.id)

                    return (
                      <article
                        key={song.id}
                        className="group rounded-2xl border border-sand/8 bg-sand/[0.045] p-3 transition hover:border-saffron/20 hover:bg-sand/[0.065]"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handlePlay(song)}
                            aria-label={`${playing ? "Pause" : "Play"} ${song.title}`}
                            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-saffron text-[#151515] shadow-[0_10px_24px_rgba(227,122,44,0.18)] transition hover:bg-[#f09a4f]"
                          >
                            {playing ? (
                              <Pause className="size-5 fill-current" aria-hidden="true" />
                            ) : (
                              <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
                            )}
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="truncate text-base font-black text-sand">
                                {song.title}
                              </h2>
                              <span className="rounded-full border border-saffron/20 bg-saffron/8 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-saffron">
                                {song.dialect}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-xs font-semibold text-sand/45">
                              {song.genre} with {song.instruments.join(", ")}
                            </p>
                          </div>

                          <div className="hidden h-10 flex-1 items-end gap-px md:flex">
                            {Array.from({ length: 46 }, (_, i) => (
                              <span
                                key={i}
                                className={`w-full rounded-full ${
                                  i < 18 ? "bg-saffron/70" : "bg-sand/20"
                                }`}
                                style={{ height: `${8 + ((i * 13 + 9) % 28)}px` }}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-3 text-xs font-bold text-sand/45">
                            <span>{song.duration}</span>
                            <button
                              type="button"
                              onClick={() => toggleLiked(song.id)}
                              aria-label={isLiked ? "Unlike song" : "Like song"}
                              aria-pressed={isLiked}
                              className={`inline-flex size-9 items-center justify-center rounded-full transition ${
                                isLiked
                                  ? "bg-saffron/15 text-saffron"
                                  : "text-sand/45 hover:bg-sand/8 hover:text-sand"
                              }`}
                            >
                              <Heart className={`size-4 ${isLiked ? "fill-current" : ""}`} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Challenges card */}
            <div className="mt-6 rounded-[1.45rem] border border-sand/12 bg-sand/[0.055] p-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-sand/14 bg-black/18 text-sm font-black">
                  0/1
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-black">Challenges</p>
                    <Clock3 className="size-4 text-sand/55" aria-hidden="true" />
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-sand/72">
                    Earn credits per completed creation
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-3 text-sm font-semibold text-sand/45">
                  <span className="hidden sm:inline">Time left</span>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-black tabular-nums text-emerald-400">
                    09:04
                  </span>
                  <ChevronDown className="size-5 rotate-180 text-sand/65" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function GenerationProgress({
  status,
  progress,
  isGenerating,
  stageIndex,
}: {
  status: StudioStatus
  progress: number
  isGenerating: boolean
  stageIndex: number
}) {
  if (!isGenerating && status !== "done") return null

  return (
    <div className="rounded-2xl border border-sand/8 bg-black/18 p-3">
      <div className="flex items-center gap-2">
        {isGenerating ? (
          <Loader2 className="size-4 animate-spin text-saffron" aria-hidden="true" />
        ) : (
          <Sparkles className="size-4 text-saffron" aria-hidden="true" />
        )}
        <span className="text-sm font-black text-sand">{STATUS_LABELS[status]}</span>
        <span className="ml-auto text-xs font-black tabular-nums text-sand/45">
          {progress}%
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand/10">
        <div
          className="h-full rounded-full bg-saffron transition-all duration-300"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Generation progress"
          style={{ width: `${progress}%` }}
        />
      </div>
      {isGenerating && (
        <div className="mt-2 flex gap-1.5">
          {GENERATION_STAGES.map((stage, index) => (
            <span
              key={stage}
              className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] ${
                stage === status
                  ? "border-saffron/35 bg-saffron/10 text-saffron"
                  : index < stageIndex
                    ? "border-sand/12 bg-sand/8 text-sand/38"
                    : "border-sand/8 text-sand/25"
              }`}
            >
              {stage}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

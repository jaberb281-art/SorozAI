"use client"

import { useEffect, useMemo, useRef, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  AudioLines,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Dices,
  Drum,
  Filter,
  Folder,
  FolderSearch,
  Guitar,
  Heart,
  Info,
  KeyboardMusic,
  Maximize2,
  Loader2,
  Mic2,
  Music2,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  WavesHorizontal,
  X,
} from "lucide-react"

import { usePlaySong } from "@/hooks/use-play-song"
import type { GenrePreset, Instrument, Song } from "@/lib/types"

// MVP: only Makkuran dialect is supported in first release
const MVP_DIALECT = "Makkuran" as const
type Dialect = typeof MVP_DIALECT
type StudioStatus = "idle" | "queued" | "generating" | "mixing" | "done"
type LyricsMode = "write" | "prompt" | "instrumental"
type CreateMode = "Simple" | "Advanced"
type InputTab = "Audio" | "Voice" | "Inspo"
type VocalGender = "male" | "female"

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

const STYLE_SUGGESTIONS = ["sombrio", "sweet vocal", "trap/rap", "sound design", "atmospheric guitars"]

type StyleChipIconKind = "suroz" | "benju" | "rabab" | "duholl" | "dambora" | "vocal" | "coastal"

const ADVANCED_STYLE_CHIPS: { label: string; icon: StyleChipIconKind }[] = [
  { label: "Suroz", icon: "suroz" },
  { label: "Benju", icon: "benju" },
  { label: "Rabab", icon: "rabab" },
  { label: "Duholl", icon: "duholl" },
  { label: "Dambora", icon: "dambora" },
  { label: "Makkuran vocal", icon: "vocal" },
  { label: "Coastal folk", icon: "coastal" },
]

const SIMPLE_PROMPT_IDEAS = [
  "Jazzy pop song about being invisible",
  "Sombrio Zahirok melody with sweet vocals and atmospheric guitars",
  "Trap/rap rhythm with Damboora textures and a cinematic hook",
  "Dreamy coastal song about missing someone at sunrise",
  "Soft folk-pop track with layered harmonies and warm percussion",
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
  title,
}: {
  prompt: string
  lyrics: string
  title?: string
}): GeneratedSong {
  return {
    id: `mock-create-${Date.now()}`,
    title: title || getMockTitle(),
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
  const [lyricsMode, setLyricsMode] = useState<LyricsMode>("write")
  const [lyrics, setLyrics] = useState("")
  const [lyricsPrompt, setLyricsPrompt] = useState("")
  const [stylePrompt, setStylePrompt] = useState("")
  const [songTitle, setSongTitle] = useState("")
  const [vocalGender, setVocalGender] = useState<VocalGender>("male")
  const [weirdness, setWeirdness] = useState(50)
  const [styleInfluence, setStyleInfluence] = useState(50)
  const [status, setStatus] = useState<StudioStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [generatedSongs, setGeneratedSongs] = useState<GeneratedSong[]>([])
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [importedPrompt, setImportedPrompt] = useState(false)
  const [panelNote, setPanelNote] = useState("")
  const [isAudioMenuOpen, setIsAudioMenuOpen] = useState(false)
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null)
  const [composerNotice, setComposerNotice] = useState("")
  const [isLyricsOpen, setIsLyricsOpen] = useState(true)
  const [isLyricsExpanded, setIsLyricsExpanded] = useState(false)
  const [isStylesOpen, setIsStylesOpen] = useState(true)
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(true)
  const [sortLabel, setSortLabel] = useState<"Newest" | "Oldest">("Newest")
  const [toolbarNote, setToolbarNote] = useState("")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingGenerationRef = useRef({ prompt: "", lyrics: "", title: "" })
  const audioMenuRef = useRef<HTMLDivElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
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

  useEffect(() => {
    if (!isAudioMenuOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (
        audioMenuRef.current &&
        !audioMenuRef.current.contains(event.target as Node)
      ) {
        setIsAudioMenuOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAudioMenuOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isAudioMenuOpen])

  const hasCreationInput =
    lyricsMode === "instrumental" ||
    lyrics.trim().length > 0 ||
    lyricsPrompt.trim().length > 0 ||
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
      lyrics: lyricsMode === "instrumental" ? "" : lyrics.trim() || lyricsPrompt.trim(),
      title: songTitle.trim(),
    }

    setProgress(3)
    setStatus("queued")
  }

  function handlePlay(song: GeneratedSong) {
    playSong(toPlayerSong(song), queue)
  }

  function handleWand() {
    if (lyricsMode === "instrumental") {
      setPanelNote("Switch out of Instrumental to generate lyrics.")
      return
    }
    setPanelNote("")
    setLyrics((prev) => prev + getRandomLyricIdea())
  }

  function handleRandomDescription() {
    const idea = SIMPLE_PROMPT_IDEAS[Math.floor(Math.random() * SIMPLE_PROMPT_IDEAS.length)]
    setStylePrompt(idea)
    setImportedPrompt(false)
  }

  function handleTopTabClick(tab: InputTab) {
    setInputTab(tab)
    setIsAudioMenuOpen(false)

    if (tab === "Voice") {
      setSelectedAudioFile(null)
      setComposerNotice("Voice feature coming soon.")
    } else if (tab === "Inspo") {
      setSelectedAudioFile(null)
      setComposerNotice("Inspiration feature coming soon.")
    } else {
      setComposerNotice("")
    }
  }

  function handleBrowseAudio() {
    setInputTab("Audio")
    setIsAudioMenuOpen(false)
    setSelectedAudioFile(null)
    setComposerNotice("Audio browser coming soon.")
  }

  function handleUploadAudioClick() {
    setInputTab("Audio")
    setIsAudioMenuOpen(false)
    setComposerNotice("")
    audioInputRef.current?.click()
  }

  function handleRecordAudio() {
    setInputTab("Audio")
    setIsAudioMenuOpen(false)
    setSelectedAudioFile(null)
    setComposerNotice("Recording feature coming soon.")
  }

  function handleAudioFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (file) {
      setInputTab("Audio")
      setSelectedAudioFile(file)
      setComposerNotice("")
    }
  }

  function handleRemoveAudioFile() {
    setSelectedAudioFile(null)
    setComposerNotice("")

    if (audioInputRef.current) {
      audioInputRef.current.value = ""
    }
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
    <div className="relative overflow-x-hidden bg-[#111111] text-sand">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(227,122,44,0.14),transparent_24%),radial-gradient(circle_at_82%_10%,rgba(26,58,92,0.48),transparent_28%),linear-gradient(135deg,#141414_0%,#191716_48%,#101010_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(90deg,rgba(237,227,211,0.35)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.25)_1px,transparent_1px)] [background-size:36px_36px]" />

      <main className="relative z-10 grid grid-cols-1 gap-3 px-3 py-3 xl:h-dvh xl:min-h-0 xl:grid-cols-[minmax(420px,500px)_minmax(0,1fr)] xl:gap-0 xl:overflow-hidden xl:px-0 xl:py-0">
        {/* ── LEFT PANEL ── */}
        <section className="rounded-2xl border border-sand/10 bg-[#181818]/95 shadow-[0_20px_60px_rgba(0,0,0,0.34)] xl:h-full xl:min-h-0 xl:rounded-none xl:border-y-0 xl:border-l-0 xl:border-r xl:bg-[#171717]/92">
          <div className="flex h-full min-h-0 flex-col overflow-x-visible p-3 pb-28 sm:p-4 sm:pb-32 lg:pb-4 xl:overflow-y-auto xl:p-5 xl:pb-6">
            {/* Top controls */}
            <div className="flex flex-wrap items-center gap-3">
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
            </div>

            {/* Input tabs */}
            <div className="relative z-30 mt-4 grid grid-cols-3 overflow-visible rounded-[1.25rem] border border-sand/8 bg-black/18 sm:mt-5 sm:rounded-[1.45rem]">
              {(["Audio", "Voice", "Inspo"] as const).map((tab) => {
                const isActive = inputTab === tab

                if (tab === "Audio") {
                  const isAudioActive = isActive || isAudioMenuOpen

                  return (
                    <div key={tab} ref={audioMenuRef} className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setInputTab("Audio")
                          setComposerNotice("")
                          setIsAudioMenuOpen((open) => !open)
                        }}
                        aria-label="Add audio options"
                        aria-expanded={isAudioMenuOpen}
                        aria-controls="create-audio-options-menu"
                        aria-pressed={isAudioActive}
                        className={`relative flex h-12 w-full items-center justify-center gap-1.5 border-r border-sand/8 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-saffron sm:h-14 sm:gap-2 ${
                          isAudioActive
                            ? "bg-sand/[0.08] text-sand"
                            : "text-sand/50 hover:bg-sand/[0.04] hover:text-sand/75"
                        }`}
                      >
                        <Plus className={`size-4 ${isAudioActive ? "text-saffron" : "text-saffron/70"}`} aria-hidden="true" />
                        <span>{tab}</span>
                        <span
                          className={`absolute bottom-0 left-4 right-4 h-1 rounded-full bg-saffron transition-opacity ${
                            isAudioActive ? "opacity-100" : "opacity-0"
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {isAudioMenuOpen && (
                        <CreateAudioOptionsMenu
                          onBrowse={handleBrowseAudio}
                          onUpload={handleUploadAudioClick}
                          onRecord={handleRecordAudio}
                        />
                      )}
                      <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={handleAudioFileChange}
                      />
                    </div>
                  )
                }

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTopTabClick(tab)}
                    aria-pressed={isActive}
                    className={`relative flex h-12 items-center justify-center gap-1.5 border-r border-sand/8 text-sm font-black last:border-r-0 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-saffron sm:h-14 sm:gap-2 ${
                      isActive
                        ? "bg-sand/[0.08] text-sand"
                        : "text-sand/50 hover:bg-sand/[0.04] hover:text-sand/75"
                    }`}
                  >
                    <Plus className={`size-4 ${isActive ? "text-saffron" : "text-saffron/70"}`} aria-hidden="true" />
                    <span>{tab}</span>
                    {tab === "Voice" && (
                      <span className="rounded-full bg-[#ff3ca0] px-1.5 py-0.5 text-[10px] font-black leading-none text-[#171717]">
                        New
                      </span>
                    )}
                    <span
                      className={`absolute bottom-0 left-4 right-4 h-1 rounded-full bg-saffron transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                )
              })}
            </div>

            {(selectedAudioFile || composerNotice) && (
              <div className="mt-3">
                {selectedAudioFile ? (
                  <div
                    role="status"
                    className="inline-flex max-w-full items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-xs font-bold text-sand shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
                  >
                    <Music2 className="size-3.5 shrink-0 text-saffron" aria-hidden="true" />
                    <span className="min-w-0 truncate">{selectedAudioFile.name}</span>
                    <span className="shrink-0 text-saffron">Mock upload</span>
                    <button
                      type="button"
                      aria-label={`Remove ${selectedAudioFile.name}`}
                      onClick={handleRemoveAudioFile}
                      className="-mr-1 flex size-5 shrink-0 items-center justify-center rounded-full text-sand/55 transition hover:bg-sand/10 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <p
                    role="status"
                    className="inline-flex max-w-full items-center gap-2 rounded-full border border-sand/10 bg-sand/[0.06] px-3 py-1.5 text-xs font-bold text-sand/70"
                  >
                    <Music2 className="size-3.5 shrink-0 text-saffron" aria-hidden="true" />
                    {composerNotice}
                  </p>
                )}
              </div>
            )}

            {/* Tab content */}
            {createMode === "Simple" && inputTab === "Audio" ? (
              <div className="mt-4 rounded-[1.35rem] border border-sand/8 bg-sand/[0.045] p-3 sm:mt-5 sm:p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor="simple-song-description"
                      className="text-sm font-black text-sand/82"
                    >
                      Song Description
                    </label>
                    <textarea
                      id="simple-song-description"
                      value={stylePrompt}
                      onChange={(event) => {
                        setStylePrompt(event.target.value)
                        setImportedPrompt(false)
                      }}
                      disabled={isGenerating}
                      rows={3}
                      placeholder="Jazzy pop song about being invisible"
                      className="mt-4 min-h-24 w-full resize-none bg-transparent text-base font-semibold leading-6 text-sand outline-none placeholder:text-sand/38 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-28"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRandomDescription}
                    disabled={isGenerating}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-sand/[0.08] text-sand/70 transition hover:bg-saffron hover:text-[#171717] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                    aria-label="Random song description"
                  >
                    <Dices className="size-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-b border-sand/8 pb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCreateMode("Advanced")
                      setIsLyricsOpen(true)
                      setLyricsMode("write")
                    }}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-sand/[0.08] px-4 text-sm font-black text-sand transition hover:bg-sand/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    Lyrics
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setLyricsMode((mode) => mode === "instrumental" ? "write" : "instrumental")
                    }
                    aria-pressed={lyricsMode === "instrumental"}
                    className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                      lyricsMode === "instrumental"
                        ? "border-saffron/35 bg-saffron/12 text-saffron"
                        : "border-sand/10 bg-black/10 text-sand/60 hover:text-sand"
                    }`}
                  >
                    <span
                      className={`size-4 rounded-full border ${
                        lyricsMode === "instrumental"
                          ? "border-saffron bg-saffron shadow-[inset_0_0_0_3px_#171717]"
                          : "border-sand/18 bg-sand/[0.05]"
                      }`}
                      aria-hidden="true"
                    />
                    Instrumental
                  </button>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-black text-sand/34">Suggestions</p>
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {STYLE_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          setStylePrompt((value) =>
                            value ? `${value}, ${suggestion}` : suggestion,
                          )
                          setImportedPrompt(false)
                        }}
                        disabled={isGenerating}
                        className="shrink-0 rounded-full bg-sand/[0.08] px-4 py-2 text-sm font-black text-sand/82 transition hover:bg-saffron hover:text-[#171717] disabled:opacity-40"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : inputTab === "Audio" ? (
              <>
                {/* Lyrics section */}
                <div className="mt-4 rounded-[1.25rem] border border-sand/8 bg-sand/[0.045] p-3 sm:mt-5 sm:rounded-[1.35rem] sm:p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsLyricsOpen((isOpen) => !isOpen)}
                      aria-expanded={isLyricsOpen}
                      aria-controls="create-lyrics-section"
                      className="flex items-center gap-2 rounded-lg text-sm font-black text-sand transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                    >
                      <ChevronDown
                        className={`size-4 text-sand/70 transition-transform ${isLyricsOpen ? "" : "-rotate-90"}`}
                        aria-hidden="true"
                      />
                      Lyrics
                    </button>
                    {isLyricsOpen && (
                      <div className="ml-auto inline-flex rounded-full bg-black/20 p-1">
                        {(["write", "prompt", "instrumental"] as const).map((mode) => (
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
                            {mode === "instrumental" ? "Instrumental" : mode[0].toUpperCase() + mode.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {isLyricsOpen && (
                    <div id="create-lyrics-section">
                      <div
                        className={`mt-4 flex flex-col rounded-2xl bg-black/18 p-3 transition-[min-height] duration-300 sm:mt-5 sm:p-4 ${
                          isLyricsExpanded
                            ? "min-h-[540px] sm:min-h-[620px] xl:min-h-[calc(100dvh-190px)]"
                            : "min-h-44 sm:min-h-52"
                        }`}
                      >
                    {lyricsMode === "write" && (
                      <textarea
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                        disabled={isGenerating}
                        rows={5}
                        placeholder={"[Verse]\nThis is where you write your rhymes\nor give our Magic Wand a try ↙\nSection [tags] can help instruct your\nsongs to feel more tight and structured"}
                        className="min-h-28 flex-1 resize-none bg-transparent text-sm leading-6 text-sand outline-none placeholder:text-sand/32 disabled:cursor-not-allowed disabled:opacity-35 sm:min-h-32"
                      />
                    )}

                    {lyricsMode === "prompt" && (
                      <textarea
                        value={lyricsPrompt}
                        onChange={(e) => setLyricsPrompt(e.target.value)}
                        disabled={isGenerating}
                        rows={5}
                        placeholder={"What do you want your lyrics to be about? Suno will write\nnew lyrics every generation. Leave this blank for a random\ntopic."}
                        className="min-h-28 flex-1 resize-none bg-transparent text-sm leading-6 text-sand outline-none placeholder:text-sand/32 disabled:cursor-not-allowed disabled:opacity-35 sm:min-h-32"
                      />
                    )}

                    {lyricsMode === "instrumental" && (
                      <div className="flex min-h-28 flex-1 items-start rounded-xl bg-sand/[0.055] px-4 py-3 text-sm font-semibold leading-6 text-sand/72 sm:min-h-32">
                        This song will be instrumental, with no vocals or lyrics.
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPanelNote("Lyrics library controls are coming soon.")}
                          className="inline-flex size-10 items-center justify-center rounded-full bg-sand/[0.07] text-sand/58 transition hover:bg-sand/[0.12] hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                          aria-label="Lyrics settings"
                        >
                          <SlidersHorizontal className="size-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={handleWand}
                          className="inline-flex size-10 items-center justify-center rounded-full bg-sand/[0.07] text-sand/58 transition hover:bg-saffron hover:text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                          aria-label="Generate lyric idea"
                        >
                          <Wand2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      <span className="h-1 w-14 rounded-full bg-sand/28" aria-hidden="true" />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsLyricsExpanded((isExpanded) => !isExpanded)}
                          aria-pressed={isLyricsExpanded}
                          className={`inline-flex size-10 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                            isLyricsExpanded
                              ? "bg-sand text-[#171717] hover:bg-white"
                              : "bg-sand/[0.07] text-sand/58 hover:bg-sand/[0.12] hover:text-sand"
                          }`}
                          aria-label={isLyricsExpanded ? "Collapse lyrics editor" : "Expand lyrics editor"}
                        >
                          <Maximize2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                      </div>

                      {panelNote && (
                        <p role="status" className="mt-3 rounded-lg border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-xs font-semibold text-saffron">
                          {panelNote}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Styles section */}
                <div className="mt-3 rounded-[1.25rem] border border-sand/8 bg-sand/[0.045] p-3 sm:mt-4 sm:rounded-[1.35rem] sm:p-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsStylesOpen((isOpen) => !isOpen)}
                      aria-expanded={isStylesOpen}
                      aria-controls="create-styles-section"
                      className="flex items-center gap-2 rounded-lg text-sm font-black text-sand transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                    >
                      <ChevronDown
                        className={`size-4 text-sand/70 transition-transform ${isStylesOpen ? "" : "-rotate-90"}`}
                        aria-hidden="true"
                      />
                      Styles
                    </button>
                    {importedPrompt && (
                      <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-saffron/70">
                        Prompt imported from Dashboard
                      </span>
                    )}
                  </div>
                  {isStylesOpen && (
                    <div id="create-styles-section" className="mt-3 flex min-h-36 flex-col rounded-2xl bg-black/18 p-3 sm:mt-4 sm:min-h-44 sm:p-4">
                    <textarea
                      value={stylePrompt}
                      onChange={(e) => { setStylePrompt(e.target.value); setImportedPrompt(false) }}
                      disabled={isGenerating}
                      rows={4}
                      placeholder="Suroz, Benju, Rabab, Duholl, Dambora, Makkuran vocal, coastal folk"
                      className="min-h-24 flex-1 resize-none bg-transparent text-sm leading-6 text-sand outline-none placeholder:text-sand/32 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPanelNote("Style library controls are coming soon.")}
                        className="inline-flex size-10 items-center justify-center rounded-full bg-sand/[0.07] text-sand/58 transition hover:bg-sand/[0.12] hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                        aria-label="Style library"
                      >
                        <SlidersHorizontal className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setStylePrompt((value) =>
                            value ? `${value}, Suroz` : "Suroz",
                          )
                        }
                        disabled={isGenerating}
                        className="inline-flex size-10 items-center justify-center rounded-full bg-saffron text-[#171717] transition hover:bg-[#f09a4f] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                        aria-label="Generate style idea"
                      >
                        <Wand2 className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setStylePrompt("")}
                        disabled={isGenerating}
                        className="inline-flex size-10 items-center justify-center rounded-full bg-sand/[0.07] text-sand/58 transition hover:bg-sand/[0.12] hover:text-sand disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                        aria-label="Refresh styles"
                      >
                        <RefreshCw className="size-4" aria-hidden="true" />
                      </button>

                      {ADVANCED_STYLE_CHIPS.map((chip) => (
                        <button
                          key={chip.label}
                          type="button"
                          onClick={() =>
                            setStylePrompt((value) =>
                              value ? `${value}, ${chip.label}` : chip.label,
                            )
                          }
                          disabled={isGenerating}
                          className="group inline-flex items-center gap-2 rounded-full bg-sand/[0.08] py-1.5 pl-2 pr-3 text-xs font-black text-sand transition hover:bg-saffron hover:text-[#171717] disabled:opacity-40"
                        >
                          <span className="inline-flex size-6 items-center justify-center rounded-full bg-black/22 text-saffron transition group-hover:text-[#171717]">
                            <StyleChipGlyph icon={chip.icon} />
                          </span>
                          {chip.label}
                        </button>
                      ))}
                    </div>
                    </div>
                  )}
                </div>

                {/* More Options section */}
                <div className="mt-3 rounded-[1.25rem] border border-sand/8 bg-sand/[0.045] p-3 sm:mt-4 sm:rounded-[1.35rem] sm:p-4">
                  <button
                    type="button"
                    onClick={() => setIsMoreOptionsOpen((isOpen) => !isOpen)}
                    aria-expanded={isMoreOptionsOpen}
                    aria-controls="create-more-options-section"
                    className="flex items-center gap-2 rounded-lg text-sm font-black text-sand transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                  >
                    <ChevronDown
                      className={`size-4 text-sand/70 transition-transform ${isMoreOptionsOpen ? "" : "-rotate-90"}`}
                      aria-hidden="true"
                    />
                    More Options
                  </button>

                  {isMoreOptionsOpen && (
                    <div id="create-more-options-section" className="mt-4 grid gap-2 rounded-2xl bg-black/18 p-2">
                    <div className="flex min-h-12 items-center gap-3 rounded-xl bg-black/30 px-3">
                      <div className="flex min-w-0 items-center gap-1.5 text-xs font-black text-sand">
                        Vocal Gender
                        <Info className="size-3 text-sand/45" aria-hidden="true" />
                      </div>
                      <div className="ml-auto inline-flex rounded-full bg-sand/[0.04] p-1">
                        {(["male", "female"] as const).map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => setVocalGender(gender)}
                            aria-pressed={vocalGender === gender}
                            className={`rounded-full px-3 py-1.5 text-xs font-black capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                              vocalGender === gender
                                ? "bg-sand/14 text-sand"
                                : "text-sand/42 hover:text-sand/72"
                            }`}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>

                    <ComposerSlider
                      label="Weirdness"
                      value={weirdness}
                      onChange={setWeirdness}
                    />
                    <ComposerSlider
                      label="Style Influence"
                      value={styleInfluence}
                      onChange={setStyleInfluence}
                    />
                    </div>
                  )}
                </div>

                {/* Title and workspace section */}
                <div className="mt-3 overflow-hidden rounded-[1.25rem] border border-sand/8 bg-sand/[0.045] sm:mt-4 sm:rounded-[1.35rem]">
                  <label className="flex h-14 items-center gap-3 px-4">
                    <Music2 className="size-4 shrink-0 text-sand/72" aria-hidden="true" />
                    <span className="sr-only">Song title</span>
                    <input
                      type="text"
                      value={songTitle}
                      onChange={(event) => setSongTitle(event.target.value)}
                      disabled={isGenerating}
                      placeholder="Song Title (Optional)"
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-sand outline-none placeholder:text-sand/35 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </label>

                  <div className="flex min-h-14 items-center gap-3 border-t border-sand/8 px-4">
                    <Folder className="size-4 shrink-0 text-sand/72" aria-hidden="true" />
                    <span className="text-sm font-black text-sand">Save to...</span>
                    <button
                      type="button"
                      onClick={() => setComposerNotice("Workspace selection coming soon.")}
                      className="ml-auto rounded-full bg-sand/[0.08] px-4 py-2 text-xs font-black text-sand transition hover:bg-sand/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                    >
                      My Workspace
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Voice / Inspo placeholder */
              <div className="mt-4 flex min-h-[220px] flex-1 items-center justify-center rounded-[1.25rem] border border-sand/8 bg-sand/[0.045] p-5 text-center sm:mt-5 sm:min-h-[280px] sm:rounded-[1.35rem] sm:p-6">
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
            <div className="fixed bottom-[calc(var(--app-mobile-tab-bar-height)+0.75rem)] left-3 right-3 z-50 rounded-2xl border border-sand/10 bg-[#181818]/96 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.38)] backdrop-blur-xl lg:static lg:mx-0 lg:mt-4 lg:border-0 lg:bg-transparent lg:p-0 lg:pt-5 lg:shadow-none lg:backdrop-blur-none xl:mt-auto">
              <GenerationProgress
                status={status}
                progress={progress}
                isGenerating={isGenerating}
                stageIndex={stageIndex}
              />

              <div className="mt-2 flex items-center gap-2 sm:mt-3 sm:gap-3">
                {createMode === "Advanced" && (
                  <button
                    type="button"
                    onClick={() => {
                      setLyrics("")
                      setLyricsPrompt("")
                      setStylePrompt("")
                      setSongTitle("")
                      setVocalGender("male")
                      setWeirdness(50)
                      setStyleInfluence(50)
                      setImportedPrompt(false)
                      setComposerNotice("")
                      setSelectedAudioFile(null)
                      if (audioInputRef.current) {
                        audioInputRef.current.value = ""
                      }
                    }}
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-sand/[0.08] text-sand/60 transition hover:bg-sand/[0.12] hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:size-14"
                    aria-label="Clear composer"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={!canCreate}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-saffron text-base font-black text-[#171717] shadow-[0_14px_34px_rgba(227,122,44,0.22)] transition hover:bg-[#f09a4f] disabled:cursor-not-allowed disabled:bg-sand/10 disabled:text-sand/28 disabled:shadow-none sm:h-14"
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
          </div>
        </section>

        {/* ── RIGHT PANEL (Workspace) ── */}
        <section className="flex flex-col rounded-2xl border border-sand/10 bg-[#111111]/82 shadow-[0_20px_60px_rgba(0,0,0,0.26)] xl:h-full xl:min-h-0 xl:rounded-none xl:border-0 xl:bg-transparent">
          <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-5 sm:py-6 xl:overflow-y-auto xl:px-6 xl:py-7">
            <div className="flex flex-wrap items-center gap-2 text-lg font-black">
              <span>Workspaces</span>
              <ChevronRight className="size-4 text-sand/35" aria-hidden="true" />
              <span className="text-sand/68">My Workspace</span>
            </div>

            {/* Workspace toolbar */}
            <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-7">
              <label className="relative min-w-0 flex-[1_1_100%] sm:flex-[1_1_220px]">
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
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-sand/[0.08] px-4 text-sm font-black text-sand transition hover:bg-sand/[0.12] sm:h-12 sm:flex-none"
              >
                <Filter className="size-4" aria-hidden="true" />
                Filters
                <ChevronDown className="size-4 text-sand/55" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setSortLabel((v) => v === "Newest" ? "Oldest" : "Newest")}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-sand/[0.08] px-4 text-sm font-black text-sand transition hover:bg-sand/[0.12] sm:h-12 sm:flex-none"
              >
                {sortLabel}
                <ChevronDown className="size-4 text-sand/55" aria-hidden="true" />
              </button>

              {["Liked", "Public", "Uploads"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setToolbarNote(`${chip} filter coming soon.`)}
                  className="h-11 flex-1 rounded-full border border-sand/10 px-3 text-sm font-black text-sand transition hover:border-saffron/28 sm:h-12 sm:flex-none sm:px-4"
                >
                  {chip}
                </button>
              ))}

              {/* Pagination — single page, disabled */}
              <div className="ml-0 flex items-center gap-2 sm:ml-auto">
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

            {/* Challenges temporarily hidden for MVP frontend polish. */}
          </div>
        </section>
      </main>
    </div>
  )
}

function StyleChipGlyph({ icon }: { icon: StyleChipIconKind }) {
  const className = "size-3.5"

  switch (icon) {
    case "suroz":
      return <AudioLines className={className} aria-hidden="true" />
    case "benju":
      return <KeyboardMusic className={className} aria-hidden="true" />
    case "rabab":
      return <Guitar className={className} aria-hidden="true" />
    case "duholl":
      return <Drum className={className} aria-hidden="true" />
    case "dambora":
      return <Music2 className={className} aria-hidden="true" />
    case "vocal":
      return <Mic2 className={className} aria-hidden="true" />
    case "coastal":
      return <WavesHorizontal className={className} aria-hidden="true" />
  }
}

function ComposerSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="grid min-h-12 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 rounded-xl bg-black/30 px-3 py-2 sm:flex sm:py-0">
      <label className="flex min-w-0 items-center gap-1.5 text-xs font-black text-sand sm:w-24 sm:shrink-0">
        {label}
        <Info className="size-3 text-sand/45" aria-hidden="true" />
      </label>
      <div className="relative col-span-2 min-w-0 flex-1 sm:col-span-1">
        <div
          className="pointer-events-none absolute left-0 right-0 top-1/2 h-5 -translate-y-1/2 opacity-45"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, transparent 0, transparent 11px, rgba(237,227,211,0.34) 12px, rgba(237,227,211,0.34) 13px)",
          }}
          aria-hidden="true"
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={label}
          className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent accent-[#ff3ca0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          style={{
            background: `linear-gradient(to right, transparent 0%, transparent ${value}%, transparent ${value}%, transparent 100%)`,
          }}
        />
      </div>
      <span className="w-9 text-right text-xs font-black tabular-nums text-sand">
        {value}%
      </span>
    </div>
  )
}

function CreateAudioOptionsMenu({
  onBrowse,
  onUpload,
  onRecord,
}: {
  onBrowse: () => void
  onUpload: () => void
  onRecord: () => void
}) {
  return (
    <div
      id="create-audio-options-menu"
      role="menu"
      aria-label="Audio options"
      className="absolute left-0 top-full z-50 mt-2 w-44 max-w-[calc(100vw-2rem)] rounded-xl border border-sand/12 bg-[#111113] p-1.5 text-left text-sm font-bold text-sand shadow-[0_18px_44px_rgba(0,0,0,0.45)]"
    >
      <button
        type="button"
        role="menuitem"
        onClick={onBrowse}
        className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sand/88 transition hover:bg-sand/10 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
      >
        <FolderSearch className="size-4 text-sand/65 transition group-hover:text-saffron" aria-hidden="true" />
        Browse
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={onUpload}
        className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sand/88 transition hover:bg-sand/10 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
      >
        <Upload className="size-4 text-sand/65 transition group-hover:text-saffron" aria-hidden="true" />
        Upload
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={onRecord}
        className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sand/88 transition hover:bg-sand/10 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
      >
        <Mic2 className="size-4 text-sand/65 transition group-hover:text-saffron" aria-hidden="true" />
        Record
      </button>
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

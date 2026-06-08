"use client"

import { useEffect, useMemo, useRef, useState, Suspense } from "react"
import type { ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Dices,
  Filter,
  Folder,
  FolderSearch,
  Heart,
  Info,
  Maximize2,
  Loader2,
  MoreHorizontal,
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
type CreatePageMode = "create" | "lyrics" | "instrument" | "voice" | "remix"
type ModeSection = "description" | "lyrics" | "styles" | "moreOptions" | "title"
type SuggestionTarget = "description" | "styles"
type ModePlaceholder = "voice" | "track"
type DurationOption = "30s" | "1min" | "2min" | "4min"
type VariationCount = 1 | 2 | 4
type TrackInputTab = "upload" | "workspace"
type MusicKey =
  | "Auto"
  | "C major"
  | "G major"
  | "D major"
  | "A minor"
  | "E minor"
  | "D minor"
  | "F major"
  | "Bb major"
type MusicControl = "bpm" | "key"

const SONG_DESCRIPTION_MAX_LENGTH = 200
const SONG_DESCRIPTION_WARNING_LENGTH = 180
const USER_CREDITS = 75
const LANGUAGE_OPTIONS = ["Balochi", "Urdu", "English", "Arabic", "Brahui"] as const
type SongLanguage = (typeof LANGUAGE_OPTIONS)[number]

const RTL_LYRICS_LANGUAGES = new Set<SongLanguage>(["Balochi", "Urdu", "Arabic"])
const LYRICS_STRUCTURE_TAGS = [
  "[Intro]",
  "[Verse]",
  "[Chorus]",
  "[Bridge]",
  "[Outro]",
  "[Instrumental]",
  "[Hook]",
] as const

const DURATION_OPTIONS: {
  value: DurationOption
  label: string
  credits: number
}[] = [
  { value: "30s", label: "30s", credits: 5 },
  { value: "1min", label: "1min", credits: 8 },
  { value: "2min", label: "2min", credits: 10 },
  { value: "4min", label: "4min", credits: 20 },
]

const DURATION_CREDIT_COST: Record<DurationOption, number> = {
  "30s": 5,
  "1min": 8,
  "2min": 10,
  "4min": 20,
}

const VARIATION_OPTIONS: VariationCount[] = [1, 2, 4]
const TRACK_INPUT_ACCEPT = ".mp3,.wav,.flac,.m4a"
const TRACK_INPUT_ALLOWED_EXTENSIONS = new Set(["mp3", "wav", "flac", "m4a"])
const TRACK_INPUT_MAX_SIZE_BYTES = 50 * 1024 * 1024
const TRACK_INPUT_MAX_SIZE_LABEL = "50MB"
const TRACK_INPUT_MAX_DURATION_LABEL = "8 minutes"
const TRACK_INPUT_PLACEHOLDER_DURATION = "~3:20"
const BPM_QUICK_PICKS = [
  { label: "Slow", value: 70 },
  { label: "Mid", value: 100 },
  { label: "Fast", value: 130 },
  { label: "Driving", value: 160 },
] as const
const KEY_OPTIONS: MusicKey[] = [
  "Auto",
  "C major",
  "G major",
  "D major",
  "A minor",
  "E minor",
  "D minor",
  "F major",
  "Bb major",
]

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
  bpm: number
  musicKey: MusicKey
  creditsUsed: number
  variationIndex: number
  variationCount: VariationCount
}

interface PendingGeneration {
  prompt: string
  lyrics: string
  title: string
  duration: DurationOption
  bpm: number
  musicKey: MusicKey
  creditsUsed: number
  variationCount: VariationCount
  modeLabel: string
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

const modeConfig = {
  create: {
    label: "Create Song",
    createMode: "Simple",
    inputTab: "Audio",
    lockCreateMode: false,
    defaultLyricsMode: "write",
    topPlaceholder: null,
    sectionOrder: ["lyrics", "styles", "moreOptions", "title"],
    suggestionTarget: "description",
    suggestionTags: STYLE_SUGGESTIONS,
    prominentControls: [],
    surpriseTarget: "description",
    surprisePrompts: SIMPLE_PROMPT_IDEAS,
  },
  lyrics: {
    label: "Lyrics to Song",
    createMode: "Advanced",
    inputTab: "Audio",
    lockCreateMode: true,
    defaultLyricsMode: "write",
    topPlaceholder: null,
    sectionOrder: ["lyrics", "description", "styles", "moreOptions", "title"],
    suggestionTarget: "description",
    suggestionTags: [
      "Zahirok chorus",
      "coastal longing",
      "wedding hook",
      "call and response",
      "poetic bridge",
    ],
    prominentControls: [],
    surpriseTarget: "description",
    surprisePrompts: [
      "Poetic Balochi lyrics about a voice crossing the Makran coast",
      "A heartfelt chorus about returning home after years away",
      "Wedding lyrics with call-and-response energy and a bright hook",
      "A longing verse and memorable chorus about desert rain",
      "A modern folk lyric about identity, family, and the sea",
    ],
  },
  instrument: {
    label: "Instrument First",
    createMode: "Advanced",
    inputTab: "Audio",
    lockCreateMode: true,
    defaultLyricsMode: "instrumental",
    topPlaceholder: null,
    sectionOrder: ["styles", "moreOptions", "title"],
    suggestionTarget: "styles",
    suggestionTags: [
      "Suroz lead",
      "Dambora pulse",
      "Duholl groove",
      "Benju texture",
      "ambient intro",
    ],
    prominentControls: ["bpm", "key"],
    surpriseTarget: "styles",
    surprisePrompts: [
      "Suroz lead, Dambora pulse, Duholl groove, coastal folk build",
      "Benju texture, Rabab counter melody, warm percussion, cinematic intro",
      "Dambora ostinato, deep Duholl rhythm, atmospheric guitars, no vocals",
      "Fast coastal dance rhythm with Suroz flourishes and bright Benju",
      "Slow instrumental Zahirok with Rabab, Suroz, and spacious ambience",
    ],
  },
  voice: {
    label: "Voice Style",
    createMode: "Advanced",
    inputTab: "Voice",
    lockCreateMode: true,
    defaultLyricsMode: "write",
    topPlaceholder: "voice",
    sectionOrder: ["description", "lyrics", "styles", "moreOptions", "title"],
    suggestionTarget: "description",
    suggestionTags: [
      "warm male vocal",
      "soft female vocal",
      "Makkuran phrasing",
      "low harmony",
      "spoken intro",
    ],
    prominentControls: [],
    surpriseTarget: "description",
    surprisePrompts: [
      "Warm Makkuran vocal style with a low intimate lead and soft harmonies",
      "Expressive female vocal over a gentle Zahirok folk-pop arrangement",
      "Spoken Balochi intro that opens into a melodic coastal chorus",
      "Layered harmonies around a tender hook about missing home",
      "Raw emotional vocal take with Damboora textures and soft percussion",
    ],
  },
  remix: {
    label: "Remix",
    createMode: "Advanced",
    inputTab: "Audio",
    lockCreateMode: true,
    defaultLyricsMode: "write",
    topPlaceholder: "track",
    sectionOrder: ["description", "lyrics", "styles", "moreOptions", "title"],
    suggestionTarget: "description",
    suggestionTags: [
      "keep original hook",
      "faster tempo",
      "folk to trap",
      "club percussion",
      "cinematic drop",
    ],
    prominentControls: ["key"],
    surpriseTarget: "description",
    surprisePrompts: [
      "Keep the original hook, add brighter percussion, and lift the chorus",
      "Turn the reference into a faster folk-trap remix with a cinematic drop",
      "Preserve the vocal mood while adding Duholl rhythm and Benju sparkle",
      "Make a spacious night-drive remix with deep bass and Suroz accents",
      "Rebuild the track as a celebratory coastal dance version",
    ],
  },
} satisfies Record<
  CreatePageMode,
  {
    label: string
    createMode: CreateMode
    inputTab: InputTab
    lockCreateMode: boolean
    defaultLyricsMode: LyricsMode
    topPlaceholder: ModePlaceholder | null
    sectionOrder: readonly ModeSection[]
    suggestionTarget: SuggestionTarget
    suggestionTags: readonly string[]
    prominentControls: readonly MusicControl[]
    surpriseTarget: SuggestionTarget
    surprisePrompts: readonly string[]
  }
>

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

function resolveCreatePageMode(mode: string | null): CreatePageMode {
  if (mode === "default" || mode === "create" || mode == null) {
    return "create"
  }

  if (mode in modeConfig) {
    return mode as CreatePageMode
  }

  return "create"
}

function hasModeSection(
  sections: readonly ModeSection[],
  section: ModeSection,
): boolean {
  return sections.includes(section)
}

function hasProminentControl(
  controls: readonly MusicControl[],
  control: MusicControl,
): boolean {
  return controls.includes(control)
}

function formatElapsedTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function formatSongDate(createdAt: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(createdAt))
}

function formatFileSize(bytes: number): string {
  const megabytes = bytes / (1024 * 1024)
  return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)}MB`
}

function makeGeneratedSong({
  bpm,
  creditsUsed,
  duration,
  musicKey,
  prompt,
  lyrics,
  title,
  variationCount,
  variationIndex,
}: {
  bpm: number
  creditsUsed: number
  duration: DurationOption
  musicKey: MusicKey
  prompt: string
  lyrics: string
  title?: string
  variationCount: VariationCount
  variationIndex: number
}): GeneratedSong {
  const baseTitle = title || getMockTitle()
  return {
    id: `mock-create-${Date.now()}-${variationIndex}-${Math.random().toString(36).slice(2, 8)}`,
    title:
      variationCount > 1
        ? `${baseTitle} V${variationIndex}`
        : baseTitle,
    prompt,
    lyrics,
    genre: "Zahirok",
    dialect: MVP_DIALECT,
    instruments: ["Damboora", "Suroz"],
    duration,
    createdAt: new Date().toISOString(),
    isPublic: false,
    likes: 0,
    plays: 0,
    bpm,
    musicKey,
    creditsUsed,
    variationIndex,
    variationCount,
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
  const initialPrompt = searchParams.get("prompt")?.slice(0, SONG_DESCRIPTION_MAX_LENGTH) ?? ""
  const [createMode, setCreateMode] = useState<CreateMode>("Simple")
  const [inputTab, setInputTab] = useState<InputTab>("Audio")
  const [lyricsMode, setLyricsMode] = useState<LyricsMode>("write")
  const [lyrics, setLyrics] = useState("")
  const [lyricsPrompt, setLyricsPrompt] = useState("")
  const [songDescription, setSongDescription] = useState(initialPrompt)
  const [stylePrompt, setStylePrompt] = useState("")
  const [songTitle, setSongTitle] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<SongLanguage>("Balochi")
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>("2min")
  const [variationCount, setVariationCount] = useState<VariationCount>(2)
  const [bpm, setBpm] = useState(100)
  const [musicKey, setMusicKey] = useState<MusicKey>("Auto")
  const [vocalGender, setVocalGender] = useState<VocalGender>("male")
  const [weirdness, setWeirdness] = useState(50)
  const [styleInfluence, setStyleInfluence] = useState(50)
  const [status, setStatus] = useState<StudioStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [generatedSongs, setGeneratedSongs] = useState<GeneratedSong[]>([])
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [importedPrompt, setImportedPrompt] = useState(Boolean(initialPrompt))
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
  const [generationStartedAt, setGenerationStartedAt] = useState<number | null>(null)
  const [generationElapsedSeconds, setGenerationElapsedSeconds] = useState(0)
  const [activeGeneration, setActiveGeneration] = useState<PendingGeneration | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingGenerationRef = useRef<PendingGeneration>({
    prompt: "",
    lyrics: "",
    title: "",
    duration: "2min",
    bpm: 100,
    musicKey: "Auto",
    creditsUsed: 10,
    variationCount: 2,
    modeLabel: "Create Song",
  })
  const audioMenuRef = useRef<HTMLDivElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const lyricsTextareaRef = useRef<HTMLTextAreaElement>(null)
  const { playSong, isCurrentSong, isPlaying } = usePlaySong()
  const prefilled = useRef(Boolean(initialPrompt))
  const lastSurprisePromptRef = useRef<string | null>(null)
  const activeMode = resolveCreatePageMode(searchParams.get("mode"))
  const currentModeConfig = modeConfig[activeMode]
  const effectiveCreateMode = currentModeConfig.lockCreateMode
    ? currentModeConfig.createMode
    : createMode
  const effectiveInputTab = currentModeConfig.lockCreateMode
    ? currentModeConfig.inputTab
    : inputTab
  const lyricsDir = RTL_LYRICS_LANGUAGES.has(selectedLanguage) ? "rtl" : "ltr"
  const isSongDescriptionWarning =
    songDescription.length >= SONG_DESCRIPTION_WARNING_LENGTH
  const durationCreditCost = DURATION_CREDIT_COST[selectedDuration]
  const totalCreditCost = durationCreditCost * variationCount
  const isBpmProminent = hasProminentControl(currentModeConfig.prominentControls, "bpm")
  const isKeyProminent = hasProminentControl(currentModeConfig.prominentControls, "key")
  const descriptionFieldLabel =
    currentModeConfig.topPlaceholder === "track"
      ? "Remix transformation prompt"
      : "Song Description"

  // Prefill song description from dashboard ?prompt= query param (once only)
  useEffect(() => {
    if (prefilled.current) return

    const incoming = searchParams.get("prompt")
    if (!incoming) return

    const timeoutId = window.setTimeout(() => {
      prefilled.current = true
      setSongDescription(incoming.slice(0, SONG_DESCRIPTION_MAX_LENGTH))
      setImportedPrompt(true)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [searchParams])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCreateMode(currentModeConfig.createMode)
      setInputTab(currentModeConfig.inputTab)
      setLyricsMode(currentModeConfig.defaultLyricsMode)
      setIsLyricsOpen(hasModeSection(currentModeConfig.sectionOrder, "lyrics"))
      setIsStylesOpen(hasModeSection(currentModeConfig.sectionOrder, "styles"))
      setIsAudioMenuOpen(false)
      setComposerNotice("")
      setPanelNote("")
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [currentModeConfig])

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
    songDescription.trim().length > 0 ||
    stylePrompt.trim().length > 0
  const isGenerating = status === "queued" || status === "generating" || status === "mixing"
  const canCreate = hasCreationInput && !isGenerating
  const stageIndex = GENERATION_STAGES.indexOf(
    status as Exclude<StudioStatus, "idle" | "done">,
  )
  const queue = useMemo(() => generatedSongs.map(toPlayerSong), [generatedSongs])
  // Active style chips are derived from the comma-separated style prompt, so the
  // icon buttons reflect (and toggle) the same value the textarea already holds.
  const activeStyleTokens = useMemo(
    () =>
      new Set(
        stylePrompt
          .split(",")
          .map((token) => token.trim().toLowerCase())
          .filter(Boolean),
      ),
    [stylePrompt],
  )

  useEffect(() => {
    if (!isGenerating || generationStartedAt == null) return

    const elapsedTimer = window.setInterval(() => {
      setGenerationElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - generationStartedAt) / 1000)),
      )
    }, 1000)

    return () => window.clearInterval(elapsedTimer)
  }, [generationStartedAt, isGenerating])

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
            setGeneratedSongs((songs) => {
              const pending = pendingGenerationRef.current
              const nextSongs = Array.from({ length: pending.variationCount }, (_, index) =>
                makeGeneratedSong({
                  bpm: pending.bpm,
                  creditsUsed: pending.creditsUsed,
                  duration: pending.duration,
                  musicKey: pending.musicKey,
                  prompt: pending.prompt,
                  lyrics: pending.lyrics,
                  title: pending.title,
                  variationCount: pending.variationCount,
                  variationIndex: index + 1,
                }),
              )

              return [...nextSongs, ...songs]
            })
            setStatus("done")
            setGenerationStartedAt(null)
            setActiveGeneration(null)
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
    const promptParts = [
      songDescription.trim(),
      stylePrompt.trim() ? `Styles: ${stylePrompt.trim()}` : "",
      `Duration: ${selectedDuration}`,
      `Variations: ${variationCount}`,
      `BPM: ${bpm}`,
      `Key: ${musicKey}`,
    ].filter(Boolean)

    const pendingGeneration: PendingGeneration = {
      prompt: promptParts.join("\n") || "Zahirok folk with Damboora and Suroz",
      lyrics: lyricsMode === "instrumental" ? "" : lyrics.trim() || lyricsPrompt.trim(),
      title: songTitle.trim(),
      duration: selectedDuration,
      bpm,
      musicKey,
      creditsUsed: totalCreditCost,
      variationCount,
      modeLabel: currentModeConfig.label,
    }
    pendingGenerationRef.current = pendingGeneration

    setProgress(3)
    setActiveGeneration(pendingGeneration)
    setGenerationElapsedSeconds(0)
    setGenerationStartedAt(Date.now())
    setStatus("queued")
  }

  function handleCancelGeneration() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setStatus("idle")
    setProgress(0)
    setGenerationStartedAt(null)
    setGenerationElapsedSeconds(0)
    setActiveGeneration(null)
  }

  function handlePlay(song: GeneratedSong) {
    playSong(toPlayerSong(song), queue)
  }

  // Bring the composer into view and focus it (composer lives in the left panel,
  // which is stacked above the workspace on mobile).
  function handleStartCreating() {
    setCreateMode("Simple")
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      window.requestAnimationFrame(() => {
        document.getElementById("song-description")?.focus()
      })
    }
  }

  function handleWand() {
    if (lyricsMode === "instrumental") {
      setPanelNote("Switch out of Instrumental to generate lyrics.")
      return
    }
    setPanelNote("")
    setLyrics((prev) => prev + getRandomLyricIdea())
  }

  function handleSurpriseMe() {
    const prompts = currentModeConfig.surprisePrompts
    const candidates =
      prompts.length > 1
        ? prompts.filter((prompt) => prompt !== lastSurprisePromptRef.current)
        : prompts
    const idea = candidates[Math.floor(Math.random() * candidates.length)]

    lastSurprisePromptRef.current = idea

    if (currentModeConfig.surpriseTarget === "styles") {
      setStylePrompt(idea)
    } else {
      setSongDescription(idea.slice(0, SONG_DESCRIPTION_MAX_LENGTH))
      setImportedPrompt(false)
    }
  }

  function handleSongDescriptionChange(value: string) {
    setSongDescription(value.slice(0, SONG_DESCRIPTION_MAX_LENGTH))
    setImportedPrompt(false)
  }

  function appendSuggestionTag(suggestion: string) {
    if (currentModeConfig.suggestionTarget === "styles") {
      setStylePrompt((value) => (value ? `${value}, ${suggestion}` : suggestion))
      setImportedPrompt(false)
      return
    }

    setSongDescription((value) => {
      const next = value ? `${value}, ${suggestion}` : suggestion
      return next.slice(0, SONG_DESCRIPTION_MAX_LENGTH)
    })
    setImportedPrompt(false)
  }

  function insertLyricsStructureTag(tag: (typeof LYRICS_STRUCTURE_TAGS)[number]) {
    if (isGenerating) return

    setLyricsMode("write")
    setPanelNote("")

    const textarea = lyricsTextareaRef.current
    let nextCursorPosition = 0

    setLyrics((value) => {
      const start = textarea?.selectionStart ?? value.length
      const end = textarea?.selectionEnd ?? value.length
      const before = value.slice(0, start)
      const after = value.slice(end)
      const prefix = before && !before.endsWith("\n") ? "\n" : ""
      const suffix = after && !after.startsWith("\n") ? "\n" : ""

      nextCursorPosition = before.length + prefix.length + tag.length
      return `${before}${prefix}${tag}${suffix}${after}`
    })

    window.requestAnimationFrame(() => {
      lyricsTextareaRef.current?.focus()
      lyricsTextareaRef.current?.setSelectionRange(
        nextCursorPosition,
        nextCursorPosition,
      )
    })
  }

  // Toggle a style label in/out of the comma-separated style prompt.
  function toggleStyleChip(label: string) {
    setStylePrompt((value) => {
      const tokens = value
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean)
      const exists = tokens.some((token) => token.toLowerCase() === label.toLowerCase())
      const next = exists
        ? tokens.filter((token) => token.toLowerCase() !== label.toLowerCase())
        : [...tokens, label]
      return next.join(", ")
    })
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

      <main className="relative z-10 grid grid-cols-1 gap-3 px-3 py-3 lg:h-dvh lg:min-h-0 lg:grid-cols-[minmax(420px,480px)_minmax(0,1fr)] lg:gap-0 lg:overflow-hidden lg:px-0 lg:py-0">
        {/* ── LEFT PANEL ── */}
        <section className="rounded-2xl border border-sand/10 bg-[#181818]/95 shadow-[0_20px_60px_rgba(0,0,0,0.34)] lg:h-full lg:min-h-0 lg:rounded-none lg:border-y-0 lg:border-l-0 lg:border-r lg:bg-[#171717]/92">
          <div className="flex h-full min-h-0 flex-col overflow-x-visible p-3 pb-28 sm:p-4 sm:pb-32 lg:overflow-y-auto lg:p-5 lg:pb-6 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
            {/* Top controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-10 rounded-full border border-sand/10 bg-black/20 p-1">
                {(["Simple", "Advanced"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      if (!currentModeConfig.lockCreateMode) {
                        setCreateMode(mode)
                      }
                    }}
                    aria-pressed={effectiveCreateMode === mode}
                    className={`rounded-full px-3.5 text-sm font-black transition ${
                      effectiveCreateMode === mode
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
                const isActive = effectiveInputTab === tab

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
                      <span className="rounded-full bg-[#e37a2c] px-1.5 py-0.5 text-[var(--text-micro)] font-black leading-none text-[#171717]">
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

            {currentModeConfig.topPlaceholder === "track" ? (
              <TrackInput
                generatedTracks={generatedSongs}
                isGenerating={isGenerating}
              />
            ) : currentModeConfig.topPlaceholder ? (
              <ModePlaceholderPanel type={currentModeConfig.topPlaceholder} />
            ) : null}

            <LanguageSelector
              value={selectedLanguage}
              onChange={setSelectedLanguage}
            />

            {/* Tab content */}
            {effectiveCreateMode === "Simple" && effectiveInputTab === "Audio" ? (
              <SongDescriptionPanel
                id="song-description"
                label={descriptionFieldLabel}
                value={songDescription}
                importedPrompt={importedPrompt}
                isGenerating={isGenerating}
                isWarning={isSongDescriptionWarning}
                suggestionTags={currentModeConfig.suggestionTags}
                onChange={handleSongDescriptionChange}
                onRandom={handleSurpriseMe}
                onSuggestionClick={appendSuggestionTag}
                actions={
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
                }
              />
            ) : effectiveInputTab === "Audio" || currentModeConfig.lockCreateMode ? (
              <>
                {currentModeConfig.sectionOrder[0] === "description" && (
                  <SongDescriptionPanel
                    id="song-description"
                    label={descriptionFieldLabel}
                    value={songDescription}
                    importedPrompt={importedPrompt}
                    isGenerating={isGenerating}
                    isWarning={isSongDescriptionWarning}
                    suggestionTags={currentModeConfig.suggestionTags}
                    onChange={handleSongDescriptionChange}
                    onRandom={handleSurpriseMe}
                    onSuggestionClick={appendSuggestionTag}
                  />
                )}

                {hasModeSection(currentModeConfig.sectionOrder, "lyrics") && (
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
                      <>
                        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {LYRICS_STRUCTURE_TAGS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => insertLyricsStructureTag(tag)}
                              disabled={isGenerating}
                              className="shrink-0 rounded-full bg-sand/[0.08] px-3 py-1.5 text-xs font-black text-sand/72 transition hover:bg-saffron hover:text-[#171717] disabled:opacity-40"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                        <textarea
                        ref={lyricsTextareaRef}
                        value={lyrics}
                        onChange={(e) => setLyrics(e.target.value)}
                        dir={lyricsDir}
                        disabled={isGenerating}
                        rows={5}
                        placeholder={"[Verse]\nThis is where you write your rhymes\nor give our Magic Wand a try ↙\nSection [tags] can help instruct your\nsongs to feel more tight and structured"}
                        className={`min-h-28 flex-1 resize-none bg-transparent text-[var(--text-body)] leading-6 text-sand outline-none placeholder:text-sand/45 disabled:cursor-not-allowed disabled:opacity-35 sm:min-h-32 sm:text-sm ${
                          lyricsDir === "rtl" ? "text-right" : ""
                        }`}
                      />
                      </>
                    )}

                    {lyricsMode === "prompt" && (
                      <textarea
                        value={lyricsPrompt}
                        onChange={(e) => setLyricsPrompt(e.target.value)}
                        dir={lyricsDir}
                        disabled={isGenerating}
                        rows={5}
                        placeholder={"What do you want your lyrics to be about? Suno will write\nnew lyrics every generation. Leave this blank for a random\ntopic."}
                        className={`min-h-28 flex-1 resize-none bg-transparent text-[var(--text-body)] leading-6 text-sand outline-none placeholder:text-sand/45 disabled:cursor-not-allowed disabled:opacity-35 sm:min-h-32 sm:text-sm ${
                          lyricsDir === "rtl" ? "text-right" : ""
                        }`}
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
                )}

                {hasModeSection(currentModeConfig.sectionOrder, "description") &&
                  currentModeConfig.sectionOrder[0] !== "description" && (
                  <SongDescriptionPanel
                    id="song-description"
                    label={descriptionFieldLabel}
                    value={songDescription}
                    importedPrompt={importedPrompt}
                    isGenerating={isGenerating}
                    isWarning={isSongDescriptionWarning}
                    suggestionTags={currentModeConfig.suggestionTags}
                    onChange={handleSongDescriptionChange}
                    onRandom={handleSurpriseMe}
                    onSuggestionClick={appendSuggestionTag}
                  />
                )}

                {/* Styles section */}
                {hasModeSection(currentModeConfig.sectionOrder, "styles") && (
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
                      <span className="ml-auto text-[var(--text-micro)] font-bold uppercase tracking-wide text-saffron/70">
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
                      className="min-h-24 flex-1 resize-none bg-transparent text-[var(--text-body)] leading-6 text-sand outline-none placeholder:text-sand/45 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
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
                        onClick={() => {
                          if (currentModeConfig.surpriseTarget === "styles") {
                            handleSurpriseMe()
                            return
                          }

                          setStylePrompt((value) =>
                            value ? `${value}, Suroz` : "Suroz",
                          )
                        }}
                        disabled={isGenerating}
                        className="inline-flex size-10 items-center justify-center rounded-full bg-saffron text-[#171717] transition hover:bg-[#f09a4f] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                        aria-label={
                          currentModeConfig.surpriseTarget === "styles"
                            ? "Surprise me"
                            : "Generate style idea"
                        }
                      >
                        {currentModeConfig.surpriseTarget === "styles" ? (
                          <Dices className="size-4" aria-hidden="true" />
                        ) : (
                          <Wand2 className="size-4" aria-hidden="true" />
                        )}
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
                    </div>

                    {/* Icon-first style options — names exposed via aria-label/title */}
                    <div className="mt-3 flex flex-wrap gap-2 sm:gap-2.5">
                      {ADVANCED_STYLE_CHIPS.map((chip) => {
                        const isActive = activeStyleTokens.has(chip.label.toLowerCase())
                        return (
                          <button
                            key={chip.label}
                            type="button"
                            onClick={() => toggleStyleChip(chip.label)}
                            disabled={isGenerating}
                            aria-label={chip.label}
                            aria-pressed={isActive}
                            title={chip.label}
                            className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron disabled:cursor-not-allowed disabled:opacity-40 ${
                              isActive
                                ? "border-saffron bg-saffron text-[#171717] shadow-[0_8px_20px_rgba(227,122,44,0.22)]"
                                : "border-sand/10 bg-sand/[0.07] text-saffron/80 hover:border-saffron/40 hover:text-saffron"
                            }`}
                          >
                            <StyleChipGlyph icon={chip.icon} />
                          </button>
                        )
                      })}
                    </div>
                    {currentModeConfig.suggestionTarget === "styles" && (
                      <SuggestionTags
                        tags={currentModeConfig.suggestionTags}
                        isGenerating={isGenerating}
                        onClick={appendSuggestionTag}
                      />
                    )}
                    </div>
                  )}
                </div>
                )}

                {/* More Options section */}
                {hasModeSection(currentModeConfig.sectionOrder, "moreOptions") && (
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
                )}

                {/* Title and workspace section */}
                {hasModeSection(currentModeConfig.sectionOrder, "title") && (
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
                )}
              </>
            ) : (
              <ModePlaceholderPanel type={effectiveInputTab === "Voice" ? "voice" : "track"} />
            )}

            <GenerationSettingsPanel
              key={activeMode}
              bpm={bpm}
              duration={selectedDuration}
              isBpmProminent={isBpmProminent}
              isGenerating={isGenerating}
              isKeyProminent={isKeyProminent}
              musicKey={musicKey}
              totalCreditCost={totalCreditCost}
              variationCount={variationCount}
              onBpmChange={setBpm}
              onDurationChange={setSelectedDuration}
              onKeyChange={setMusicKey}
              onVariationChange={setVariationCount}
            />

            {/* Bottom: progress + create */}
            <div className="fixed bottom-[calc(var(--app-mobile-tab-bar-height)+0.75rem)] left-3 right-3 z-50 rounded-2xl border border-sand/10 bg-[#181818]/96 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.38)] backdrop-blur-xl lg:static lg:mx-0 lg:mt-auto lg:border-0 lg:bg-transparent lg:p-0 lg:pt-5 lg:shadow-none lg:backdrop-blur-none">
              <GenerationProgress
                status={status}
                progress={progress}
                isGenerating={isGenerating}
                stageIndex={stageIndex}
              />

              <p className="mt-2 text-center text-xs font-bold text-sand/48 sm:mt-3">
                You have {USER_CREDITS} credits remaining
              </p>

              <div className="mt-2 flex items-center gap-2 sm:gap-3">
                {effectiveCreateMode === "Advanced" && (
                  <button
                    type="button"
                    onClick={() => {
                      setLyrics("")
                      setLyricsPrompt("")
                      setSongDescription("")
                      setStylePrompt("")
                      setSongTitle("")
                      setSelectedLanguage("Balochi")
                      setSelectedDuration("2min")
                      setVariationCount(2)
                      setBpm(100)
                      setMusicKey("Auto")
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
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-saffron text-base font-black text-[#171717] shadow-[0_14px_34px_rgba(227,122,44,0.22)] transition hover:bg-[#f09a4f] disabled:cursor-not-allowed disabled:border disabled:border-sand/15 disabled:bg-sand/[0.12] disabled:text-sand/55 disabled:shadow-none sm:h-14"
                >
                  {isGenerating ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Music2 className="size-4" aria-hidden="true" />
                  )}
                  {isGenerating ? "Generating..." : `Generate — ${totalCreditCost} credits`}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── RIGHT PANEL (Workspace) ── */}
        <section className="flex flex-col rounded-2xl border border-sand/10 bg-[#111111]/82 shadow-[0_20px_60px_rgba(0,0,0,0.26)] lg:h-full lg:min-h-0 lg:rounded-none lg:border-0 lg:bg-transparent">
          <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-5 sm:py-6 lg:overflow-y-auto lg:px-6 lg:py-7 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
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

            {isGenerating && activeGeneration && (
              <GenerationJobCard
                elapsedSeconds={generationElapsedSeconds}
                pendingGeneration={activeGeneration}
                onCancel={handleCancelGeneration}
              />
            )}

            {/* Generated songs */}
            <div className="flex flex-1 flex-col">
              {generatedSongs.length === 0 ? (
                <div className="flex flex-1 items-center justify-center py-24 text-center">
                  <div className="flex flex-col items-center">
                    <span className="flex size-14 items-center justify-center rounded-2xl border border-saffron/20 bg-saffron/[0.08] text-saffron">
                      <Music2 className="size-7" aria-hidden="true" />
                    </span>
                    <p className="mt-5 text-base font-black text-sand/72">No tracks yet</p>
                    <p className="mt-2 max-w-xs text-sm font-semibold text-sand/40">
                      Describe your song on the left and generate your first Makkuran track.
                    </p>
                    <button
                      type="button"
                      onClick={handleStartCreating}
                      className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-saffron px-5 text-sm font-black text-[#171717] shadow-[0_12px_30px_rgba(227,122,44,0.2)] transition hover:bg-[#f09a4f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                    >
                      <Sparkles className="size-4" aria-hidden="true" />
                      Start creating
                    </button>
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
                      <GeneratedTrackCard
                        key={song.id}
                        isLiked={isLiked}
                        playing={playing}
                        song={song}
                        onOpenActions={() => setToolbarNote("Track actions coming soon.")}
                        onPlay={() => handlePlay(song)}
                        onToggleLiked={() => toggleLiked(song.id)}
                      />
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

function GeneratedTrackCard({
  isLiked,
  onOpenActions,
  onPlay,
  onToggleLiked,
  playing,
  song,
}: {
  isLiked: boolean
  onOpenActions: () => void
  onPlay: () => void
  onToggleLiked: () => void
  playing: boolean
  song: GeneratedSong
}) {
  return (
    <article className="group rounded-2xl border border-sand/8 bg-sand/[0.045] p-3 transition hover:border-saffron/20 hover:bg-sand/[0.065]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPlay}
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
            <span className="rounded-full border border-saffron/20 bg-saffron/8 px-2 py-0.5 text-[var(--text-micro)] font-black uppercase tracking-[0.12em] text-saffron">
              {song.dialect}
            </span>
          </div>
          <p className="mt-1 truncate text-xs font-semibold text-sand/45">
            {formatSongDate(song.createdAt)} | {song.duration} | {song.bpm} BPM | {song.musicKey}
          </p>
        </div>

        <div className="hidden h-10 flex-1 items-end gap-px md:flex" aria-hidden="true">
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
          <span className="hidden tabular-nums sm:inline">{song.duration}</span>
          <button
            type="button"
            onClick={onToggleLiked}
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
          <button
            type="button"
            onClick={onOpenActions}
            aria-label={`Open actions for ${song.title}`}
            className="inline-flex size-9 items-center justify-center rounded-full text-sand/45 transition hover:bg-sand/8 hover:text-sand"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}

// ── Custom Balochi instrument/style icons (inline SVG, inherit currentColor) ──
// Hand-drawn line glyphs so each style reads as a distinct, real instrument
// rather than a generic Lucide shape.

type StyleIconProps = { className?: string }

const SVG_BASE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
}

// Suroz — bowed spike fiddle: round body, long neck, bow across the strings
function SurozIcon({ className }: StyleIconProps) {
  return (
    <svg className={className} {...SVG_BASE}>
      <circle cx="7.5" cy="16.3" r="3.4" />
      <path d="M9.9 13.9 18.5 5.3" />
      <path d="M17.6 4.4 19.8 6.6" />
      <path d="M3.6 11.4 20.4 17" />
    </svg>
  )
}

// Benju — keyed box zither: a body with a row of keys/buttons and a string
function BenjuIcon({ className }: StyleIconProps) {
  return (
    <svg className={className} {...SVG_BASE}>
      <rect x="3" y="9" width="18" height="8" rx="1.8" />
      <circle cx="7" cy="13" r="1" />
      <circle cx="10.5" cy="13" r="1" />
      <circle cx="14" cy="13" r="1" />
      <path d="M17.5 11v4" />
    </svg>
  )
}

// Rabab — short-necked lute: rounded body with sound hole, short pegged neck
function RababIcon({ className }: StyleIconProps) {
  return (
    <svg className={className} {...SVG_BASE}>
      <circle cx="8.6" cy="16.4" r="4.3" />
      <circle cx="8.6" cy="16.4" r="1.3" />
      <path d="M11.3 13.2 16.8 7.4" />
      <path d="M15.9 6.5 18 8.6" />
      <path d="M17.4 5 19.5 7.1" />
    </svg>
  )
}

// Duholl — double-headed barrel drum with diagonal rope lacing
function DuhollIcon({ className }: StyleIconProps) {
  return (
    <svg className={className} {...SVG_BASE}>
      <rect x="3.3" y="8.5" width="17.4" height="7" rx="3.5" />
      <path d="M4.4 9.2 6.8 14.8" />
      <path d="M8.4 8.6 10.8 15.4" />
      <path d="M12.4 8.6 14.8 15.4" />
      <path d="M16.4 9 18.6 14.6" />
    </svg>
  )
}

// Dambora — long-necked two-string lute: small body, very long neck, 2 strings
function DamboraIcon({ className }: StyleIconProps) {
  return (
    <svg className={className} {...SVG_BASE}>
      <circle cx="7.2" cy="17" r="3.2" />
      <path d="M9.2 14.6 18.7 5.1" />
      <path d="M8.3 13.7 17.8 4.2" />
      <path d="M18 4 20 6" />
    </svg>
  )
}

// Makkuran vocal — a singer with sound waves projecting from the voice
function MakkuranVocalIcon({ className }: StyleIconProps) {
  return (
    <svg className={className} {...SVG_BASE}>
      <circle cx="8.5" cy="7" r="3" />
      <path d="M3.8 19c0-3 2.1-4.8 4.7-4.8 1.5 0 2.8.6 3.6 1.6" />
      <path d="M16 7.2c1.1 1.4 1.1 3.9 0 5.3" />
      <path d="M18.7 5c1.9 2.4 1.9 6.9 0 9.3" />
    </svg>
  )
}

// Coastal folk — layered sea waves under a low sun
function CoastalFolkIcon({ className }: StyleIconProps) {
  return (
    <svg className={className} {...SVG_BASE}>
      <circle cx="17" cy="6.6" r="2.4" />
      <path d="M3 13.5q2.25-2.2 4.5 0t4.5 0 4.5 0 4.5 0" />
      <path d="M3 17.5q2.25-2.2 4.5 0t4.5 0 4.5 0 4.5 0" />
    </svg>
  )
}

function StyleChipGlyph({ icon, className = "size-5" }: { icon: StyleChipIconKind; className?: string }) {
  switch (icon) {
    case "suroz":
      return <SurozIcon className={className} />
    case "benju":
      return <BenjuIcon className={className} />
    case "rabab":
      return <RababIcon className={className} />
    case "duholl":
      return <DuhollIcon className={className} />
    case "dambora":
      return <DamboraIcon className={className} />
    case "vocal":
      return <MakkuranVocalIcon className={className} />
    case "coastal":
      return <CoastalFolkIcon className={className} />
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
          className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent accent-[#e37a2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
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

function TrackInput({
  generatedTracks,
  isGenerating,
}: {
  generatedTracks: GeneratedSong[]
  isGenerating: boolean
}) {
  const [activeTab, setActiveTab] = useState<TrackInputTab>("upload")
  const [selectedUpload, setSelectedUpload] = useState<File | null>(null)
  const [selectedWorkspaceTrackId, setSelectedWorkspaceTrackId] = useState<string | null>(null)
  const [playingReferenceId, setPlayingReferenceId] = useState<string | null>(null)
  const [fileError, setFileError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectedWorkspaceTrack =
    generatedTracks.find((track) => track.id === selectedWorkspaceTrackId) ?? null
  const selectedReference = selectedUpload
    ? {
        detail: `Upload | ${formatFileSize(selectedUpload.size)}`,
        duration: TRACK_INPUT_PLACEHOLDER_DURATION,
        id: "uploaded-reference",
        removable: true,
        sourceLabel: "Uploaded track",
        title: selectedUpload.name,
      }
    : selectedWorkspaceTrack
      ? {
          detail: `Workspace | ${formatSongDate(selectedWorkspaceTrack.createdAt)}`,
          duration: selectedWorkspaceTrack.duration,
          id: `workspace-${selectedWorkspaceTrack.id}`,
          removable: false,
          sourceLabel: "Workspace track",
          title: selectedWorkspaceTrack.title,
        }
      : null

  function togglePlaying(referenceId: string) {
    setPlayingReferenceId((current) =>
      current === referenceId ? null : referenceId,
    )
  }

  function clearFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function handleUploadChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const extension = file.name.split(".").pop()?.toLowerCase() ?? ""

    if (!TRACK_INPUT_ALLOWED_EXTENSIONS.has(extension)) {
      setFileError("Use an MP3, WAV, FLAC, or M4A file.")
      setSelectedUpload(null)
      clearFileInput()
      return
    }

    if (file.size > TRACK_INPUT_MAX_SIZE_BYTES) {
      setFileError(
        `Choose a file under ${TRACK_INPUT_MAX_SIZE_LABEL}. This file is ${formatFileSize(file.size)}.`,
      )
      setSelectedUpload(null)
      clearFileInput()
      return
    }

    setFileError("")
    setSelectedUpload(file)
    setSelectedWorkspaceTrackId(null)
    setPlayingReferenceId(null)
  }

  function handleRemoveUpload() {
    setSelectedUpload(null)
    setPlayingReferenceId(null)
    setFileError("")
    clearFileInput()
  }

  function handleSelectWorkspaceTrack(trackId: string) {
    setSelectedWorkspaceTrackId(trackId)
    setSelectedUpload(null)
    setFileError("")
    setPlayingReferenceId(null)
    clearFileInput()
  }

  return (
    <div className="mt-4 rounded-[1.35rem] border border-sand/8 bg-sand/[0.045] p-3 sm:mt-5 sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Upload className="size-4 shrink-0 text-saffron" aria-hidden="true" />
          <span className="text-sm font-black text-sand/82">Track reference</span>
        </div>
        <span className="ml-auto text-[var(--text-micro)] font-black uppercase tracking-[0.12em] text-sand/42">
          Max {TRACK_INPUT_MAX_SIZE_LABEL} | Max {TRACK_INPUT_MAX_DURATION_LABEL}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 rounded-full border border-sand/8 bg-black/18 p-1">
        {(["upload", "workspace"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab === tab}
            className={`h-9 rounded-full text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
              activeTab === tab
                ? "bg-sand/12 text-sand"
                : "text-sand/50 hover:text-sand/75"
            }`}
          >
            {tab === "upload" ? "Upload" : "From workspace"}
          </button>
        ))}
      </div>

      {activeTab === "upload" ? (
        <div className="mt-3">
          <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-sand/14 bg-black/18 px-4 py-5 text-center transition hover:border-saffron/35 hover:bg-saffron/[0.045]">
            <input
              ref={fileInputRef}
              type="file"
              accept={TRACK_INPUT_ACCEPT}
              disabled={isGenerating}
              className="sr-only"
              onChange={handleUploadChange}
            />
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-saffron/12 text-saffron">
              <Upload className="size-5" aria-hidden="true" />
            </span>
            <span className="mt-3 text-sm font-black text-sand">
              Upload reference track
            </span>
            <span className="mt-1 text-xs font-semibold text-sand/45">
              MP3, WAV, FLAC, or M4A
            </span>
          </label>
          {fileError && (
            <p role="alert" className="mt-2 rounded-lg border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-xs font-semibold text-saffron">
              {fileError}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-3 grid gap-2">
          {generatedTracks.length === 0 ? (
            <div className="rounded-2xl border border-sand/8 bg-black/18 px-4 py-6 text-center text-sm font-semibold text-sand/48">
              Generate your first track to remix it later.
            </div>
          ) : (
            generatedTracks.map((track) => {
              const isSelected = selectedWorkspaceTrackId === track.id
              const playId = `workspace-row-${track.id}`
              const isPlaying = playingReferenceId === playId

              return (
                <div
                  key={track.id}
                  className={`flex items-center gap-3 rounded-2xl border p-2 transition ${
                    isSelected
                      ? "border-saffron/35 bg-saffron/[0.08]"
                      : "border-sand/8 bg-black/18 hover:border-saffron/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => togglePlaying(playId)}
                    disabled={isGenerating}
                    aria-label={`${isPlaying ? "Pause" : "Play"} ${track.title}`}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-sand/[0.08] text-sand/70 transition hover:bg-saffron hover:text-[#171717] disabled:opacity-40"
                  >
                    {isPlaying ? (
                      <Pause className="size-4 fill-current" aria-hidden="true" />
                    ) : (
                      <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectWorkspaceTrack(track.id)}
                    disabled={isGenerating}
                    aria-pressed={isSelected}
                    className="min-w-0 flex-1 rounded-xl px-1.5 py-1 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron disabled:opacity-45"
                  >
                    <span className="block truncate text-sm font-black text-sand">
                      {track.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-semibold text-sand/45">
                      {formatSongDate(track.createdAt)} | {track.duration}
                    </span>
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}

      {selectedReference && (
        <div className="mt-3 rounded-2xl border border-saffron/24 bg-saffron/[0.065] p-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => togglePlaying(selectedReference.id)}
              disabled={isGenerating}
              aria-label={`${playingReferenceId === selectedReference.id ? "Pause" : "Play"} ${selectedReference.title}`}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-saffron text-[#171717] transition hover:bg-[#f09a4f] disabled:opacity-45"
            >
              {playingReferenceId === selectedReference.id ? (
                <Pause className="size-4 fill-current" aria-hidden="true" />
              ) : (
                <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-saffron/24 bg-black/16 px-2 py-0.5 text-[var(--text-micro)] font-black uppercase tracking-[0.12em] text-saffron">
                  {selectedReference.sourceLabel}
                </span>
                <span className="text-xs font-bold text-sand/48">
                  {selectedReference.duration}
                </span>
              </div>
              <p className="mt-1 truncate text-sm font-black text-sand">
                {selectedReference.title}
              </p>
              <p className="mt-0.5 truncate text-xs font-semibold text-sand/45">
                {selectedReference.detail}
              </p>
            </div>

            {selectedReference.removable && (
              <button
                type="button"
                onClick={handleRemoveUpload}
                disabled={isGenerating}
                aria-label={`Remove ${selectedReference.title}`}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sand/55 transition hover:bg-sand/10 hover:text-sand disabled:opacity-40"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <TrackInputWaveform />
        </div>
      )}
    </div>
  )
}

function TrackInputWaveform() {
  return (
    <div className="mt-3 flex h-10 items-end gap-px" aria-hidden="true">
      {Array.from({ length: 40 }, (_, index) => (
        <span
          key={index}
          className={`w-full rounded-full ${
            index < 16 ? "bg-saffron/72" : "bg-sand/18"
          }`}
          style={{ height: `${7 + ((index * 11 + 5) % 27)}px` }}
        />
      ))}
    </div>
  )
}

function ModePlaceholderPanel({ type }: { type: ModePlaceholder }) {
  const Icon = type === "voice" ? Mic2 : Upload
  const title = type === "voice" ? "Voice style" : "Track reference"
  const description =
    type === "voice"
      ? "Voice controls are coming soon."
      : "Track controls are coming soon."

  return (
    <div className="mt-4 flex min-h-[140px] items-center justify-center rounded-[1.25rem] border border-sand/8 bg-sand/[0.045] p-5 text-center sm:mt-5 sm:rounded-[1.35rem] sm:p-6">
      <div>
        <Icon className="mx-auto size-10 text-saffron/50" aria-hidden="true" />
        <p className="mt-4 text-sm font-black text-sand/72">{title}</p>
        <p className="mt-2 text-sm font-semibold text-sand/55">{description}</p>
      </div>
    </div>
  )
}

function LanguageSelector({
  onChange,
  value,
}: {
  onChange: (language: SongLanguage) => void
  value: SongLanguage
}) {
  return (
    <div className="mt-4 rounded-[1.25rem] border border-sand/8 bg-sand/[0.045] p-3 sm:mt-5 sm:rounded-[1.35rem] sm:p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-black text-sand/82">Language</span>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {LANGUAGE_OPTIONS.map((language) => (
            <button
              key={language}
              type="button"
              onClick={() => onChange(language)}
              aria-pressed={value === language}
              className={`rounded-full px-3 py-1.5 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                value === language
                  ? "bg-sand/12 text-sand"
                  : "bg-black/10 text-sand/50 hover:text-sand/75"
              }`}
            >
              {language}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SongDescriptionPanel({
  actions,
  id,
  importedPrompt,
  isGenerating,
  isWarning,
  label = "Song Description",
  onChange,
  onRandom,
  onSuggestionClick,
  suggestionTags,
  value,
}: {
  actions?: ReactNode
  id: string
  importedPrompt: boolean
  isGenerating: boolean
  isWarning: boolean
  label?: string
  onChange: (value: string) => void
  onRandom: () => void
  onSuggestionClick: (suggestion: string) => void
  suggestionTags: readonly string[]
  value: string
}) {
  return (
    <div className="mt-4 rounded-[1.35rem] border border-sand/8 bg-sand/[0.045] p-3 sm:mt-5 sm:p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <label htmlFor={id} className="text-sm font-black text-sand/82">
              {label}
            </label>
            {importedPrompt && (
              <span className="text-[var(--text-micro)] font-bold uppercase tracking-wide text-saffron/70">
                Prompt imported
              </span>
            )}
          </div>
          <textarea
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            disabled={isGenerating}
            rows={3}
            maxLength={SONG_DESCRIPTION_MAX_LENGTH}
            aria-describedby={`${id}-counter`}
            placeholder="Jazzy pop song about being invisible"
            className="mt-3 min-h-16 w-full resize-none bg-transparent text-base font-semibold leading-6 text-sand outline-none placeholder:text-sand/40 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-20"
          />
          <p
            id={`${id}-counter`}
            className={`mt-1 text-right text-xs font-black tabular-nums ${
              isWarning ? "text-saffron" : "text-sand/42"
            }`}
          >
            {value.length} / {SONG_DESCRIPTION_MAX_LENGTH}
          </p>
        </div>
        <button
          type="button"
          onClick={onRandom}
          disabled={isGenerating}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-sand/[0.08] text-sand/70 transition hover:bg-saffron hover:text-[#171717] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          aria-label="Surprise me"
          title="Surprise me"
        >
          <Dices className="size-5" aria-hidden="true" />
        </button>
      </div>

      {actions}

      <SuggestionTags
        tags={suggestionTags}
        isGenerating={isGenerating}
        onClick={onSuggestionClick}
      />
    </div>
  )
}

function SuggestionTags({
  isGenerating,
  onClick,
  tags,
}: {
  isGenerating: boolean
  onClick: (suggestion: string) => void
  tags: readonly string[]
}) {
  return (
    <div className="mt-3">
      <p className="text-sm font-black text-sand/45">Suggestions</p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible">
        {tags.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onClick(suggestion)}
            disabled={isGenerating}
            className="shrink-0 rounded-full bg-sand/[0.08] px-4 py-2 text-sm font-black text-sand/82 transition hover:bg-saffron hover:text-[#171717] disabled:opacity-40"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

function GenerationSettingsPanel({
  bpm,
  duration,
  isBpmProminent,
  isGenerating,
  isKeyProminent,
  musicKey,
  onBpmChange,
  onDurationChange,
  onKeyChange,
  onVariationChange,
  totalCreditCost,
  variationCount,
}: {
  bpm: number
  duration: DurationOption
  isBpmProminent: boolean
  isGenerating: boolean
  isKeyProminent: boolean
  musicKey: MusicKey
  onBpmChange: (value: number) => void
  onDurationChange: (value: DurationOption) => void
  onKeyChange: (value: MusicKey) => void
  onVariationChange: (value: VariationCount) => void
  totalCreditCost: number
  variationCount: VariationCount
}) {
  const isTuningProminent = isBpmProminent || isKeyProminent
  const [isTuningOpen, setIsTuningOpen] = useState(isTuningProminent)

  return (
    <div className="mt-3 rounded-[1.25rem] border border-sand/8 bg-sand/[0.045] p-3 sm:mt-4 sm:rounded-[1.35rem] sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-black text-sand">Generation</span>
        <span className="ml-auto rounded-full border border-saffron/20 bg-saffron/8 px-2.5 py-1 text-xs font-black text-saffron">
          {totalCreditCost} credits
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        <OptionPillGroup
          label="Duration"
          options={DURATION_OPTIONS.map((option) => ({
            label: option.label,
            meta: `${option.credits}`,
            value: option.value,
          }))}
          value={duration}
          disabled={isGenerating}
          onChange={onDurationChange}
        />

        <OptionPillGroup
          label="Variations"
          options={VARIATION_OPTIONS.map((option) => ({
            label: `${option}`,
            value: option,
          }))}
          value={variationCount}
          disabled={isGenerating}
          onChange={onVariationChange}
        />
      </div>

      <details
        className="mt-3 rounded-2xl bg-black/18 p-3 open:border open:border-sand/8"
        open={isTuningOpen}
        onToggle={(event) => setIsTuningOpen(event.currentTarget.open)}
      >
        <summary className="cursor-pointer list-none text-xs font-black uppercase tracking-[0.16em] text-sand/48 marker:hidden">
          BPM / Key
        </summary>

        <div className="mt-3 grid gap-3">
          <div
            className={`rounded-xl bg-black/30 p-3 ${
              isBpmProminent ? "ring-1 ring-saffron/25" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-sand">BPM</span>
              <span className="ml-auto text-xs font-black tabular-nums text-saffron">
                {bpm}
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={200}
              value={bpm}
              disabled={isGenerating}
              onChange={(event) => onBpmChange(Number(event.target.value))}
              className="mt-3 h-6 w-full cursor-pointer appearance-none bg-transparent accent-[#e37a2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="BPM"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {BPM_QUICK_PICKS.map((pick) => (
                <button
                  key={pick.label}
                  type="button"
                  onClick={() => onBpmChange(pick.value)}
                  disabled={isGenerating}
                  aria-pressed={bpm === pick.value}
                  className={`rounded-full px-2.5 py-1 text-xs font-black transition disabled:opacity-40 ${
                    bpm === pick.value
                      ? "bg-saffron text-[#171717]"
                      : "bg-sand/[0.08] text-sand/58 hover:text-sand"
                  }`}
                >
                  {pick.label} {pick.value}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`rounded-xl bg-black/30 p-3 ${
              isKeyProminent ? "ring-1 ring-saffron/25" : ""
            }`}
          >
            <span className="text-xs font-black text-sand">Key</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {KEY_OPTIONS.map((keyOption) => (
                <button
                  key={keyOption}
                  type="button"
                  onClick={() => onKeyChange(keyOption)}
                  disabled={isGenerating}
                  aria-pressed={musicKey === keyOption}
                  className={`rounded-full px-2.5 py-1.5 text-xs font-black transition disabled:opacity-40 ${
                    musicKey === keyOption
                      ? "bg-saffron text-[#171717]"
                      : "bg-sand/[0.08] text-sand/62 hover:text-sand"
                  }`}
                >
                  {keyOption}
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  )
}

function OptionPillGroup<T extends string | number>({
  disabled,
  label,
  onChange,
  options,
  value,
}: {
  disabled: boolean
  label: string
  onChange: (value: T) => void
  options: { label: string; meta?: string; value: T }[]
  value: T
}) {
  return (
    <div className="rounded-xl bg-black/18 p-2">
      <div className="mb-2 px-1 text-xs font-black text-sand/58">{label}</div>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {options.map((option) => (
          <button
            key={`${option.value}`}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            aria-pressed={value === option.value}
            className={`min-h-10 rounded-full border px-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${
              value === option.value
                ? "border-saffron bg-saffron text-[#171717]"
                : "border-sand/10 bg-sand/[0.07] text-sand/72 hover:border-saffron/28 hover:text-sand"
            }`}
          >
            {option.label}
            {option.meta && (
              <span className="ml-1 text-[var(--text-micro)] opacity-70">
                {option.meta}cr
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function GenerationJobCard({
  elapsedSeconds,
  onCancel,
  pendingGeneration,
}: {
  elapsedSeconds: number
  onCancel: () => void
  pendingGeneration: PendingGeneration
}) {
  const promptSnippet =
    pendingGeneration.prompt.length > 120
      ? `${pendingGeneration.prompt.slice(0, 120).trim()}...`
      : pendingGeneration.prompt

  return (
    <div className="mt-5 rounded-2xl border border-saffron/18 bg-saffron/[0.06] p-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-saffron/12 text-saffron">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-saffron">
              Generating your track...
            </p>
            <span className="rounded-full border border-sand/10 bg-black/18 px-2 py-0.5 text-[var(--text-micro)] font-black uppercase tracking-[0.12em] text-sand/52">
              {pendingGeneration.modeLabel}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-sand/52">
            Elapsed {formatElapsedTime(elapsedSeconds)}
          </p>
          <p className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-sand/70">
            {promptSnippet || "Zahirok folk with Damboora and Suroz"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[var(--text-micro)] font-black uppercase tracking-[0.12em] text-sand/42">
            <span>{pendingGeneration.duration}</span>
            <span>{pendingGeneration.variationCount} variations</span>
            <span>{pendingGeneration.creditsUsed} credits</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-sand/10 bg-black/18 px-3 py-1.5 text-xs font-black text-sand/70 transition hover:border-saffron/30 hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
          Cancel
        </button>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-sand/10">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-saffron" />
      </div>
    </div>
  )
}

interface GenerationProgressProps {
  status: StudioStatus
  progress: number
  isGenerating: boolean
  stageIndex: number
  etaSeconds?: number
  queuePosition?: number
}

function GenerationProgress({
  status,
  progress,
  isGenerating,
  stageIndex,
  etaSeconds,
  queuePosition,
}: GenerationProgressProps) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(
    etaSeconds ?? null
  )

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    const timeout = window.setTimeout(() => {
      if (etaSeconds == null) {
        setSecondsLeft(null)
        return
      }

      setSecondsLeft(etaSeconds)
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev == null || prev <= 1) {
            if (interval) {
              clearInterval(interval)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 0)

    return () => {
      window.clearTimeout(timeout)
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [etaSeconds])

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
      {(secondsLeft != null || queuePosition != null) && (
        <p className="mt-2 text-sm text-sand/60">
          {queuePosition != null && secondsLeft == null
            ? `Position ${queuePosition} in queue`
            : secondsLeft === 0
              ? "Almost done..."
              : secondsLeft != null
                ? `~${secondsLeft}s remaining`
                : null}
        </p>
      )}
      {isGenerating && (
        <div className="mt-2 flex gap-1.5">
          {GENERATION_STAGES.map((stage, index) => (
            <span
              key={stage}
              className={`rounded-full border px-2 py-0.5 text-[var(--text-micro)] font-black uppercase tracking-[0.12em] ${
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

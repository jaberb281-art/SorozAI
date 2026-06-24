"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
    Bookmark,
    Drum,
    Gauge,
    Globe2,
    Heart,
    Mic2,
    Pause,
    Play,
    Radio,
    SlidersHorizontal,
    Waves,
} from "lucide-react"

import { usePlaySong } from "@/hooks/use-play-song"
import type { GenrePreset, Instrument, Song } from "@/lib/types"
import { usePlayerStore } from "@/stores/player-store"

type StationGroup = "For Focus" | "For Emotion" | "For Movement" | "By Instrument" | "For Creators"

type Station = {
    id: string
    name: string
    group: StationGroup
    description: string
    emotionalCue: string
    mood: string
    energy: string
    voice: string
    instrument: Instrument
    instrumentLabel: string
    region: string
    genrePreset: GenrePreset
    tempo: string
}

type CapturedMoment = {
    capturedAt: string
    id: string
    duration: "30 seconds"
    instrument: string
    region: string
    mood: string
    stationName: string
    status: "captured"
    voice: string
}

const TUNE_CONTROLS = [
    {
        label: "Mood",
        icon: Heart,
        options: ["Calm", "Yearning", "Bright", "Sacred"],
    },
    {
        label: "Energy",
        icon: Gauge,
        options: ["Low", "Medium", "Driving", "Ceremonial"],
    },
    {
        label: "Voice",
        icon: Mic2,
        options: ["Male Lead", "Female Lead", "Choir", "Instrumental"],
    },
    {
        label: "Instrument",
        icon: Drum,
        options: ["Dambora", "Suroz", "Dohol", "Rubab"],
    },
    {
        label: "Language/Region",
        icon: Globe2,
        options: ["Makkuran", "Balochi", "Urdu Blend", "Global"],
    },
] as const

const STATIONS: Station[] = [
    {
        id: "station-desert-night-radio",
        name: "Desert Night Radio",
        group: "For Focus",
        description: "Slow strings, soft voice textures, and late-road atmosphere.",
        emotionalCue: "Soft dambora phrases over a low modern texture.",
        mood: "Calm",
        energy: "Low",
        voice: "Instrumental",
        instrument: "Damboora",
        instrumentLabel: "Dambora",
        region: "Global",
        genrePreset: "Soroz",
        tempo: "66 BPM",
    },
    {
        id: "station-deep-focus",
        name: "Deep Focus",
        group: "For Focus",
        description: "Slow instrumental patterns for coding, writing, and long concentration.",
        emotionalCue: "Soft dambora phrases over a low modern texture.",
        mood: "Calm",
        energy: "Low",
        voice: "Instrumental",
        instrument: "Damboora",
        instrumentLabel: "Dambora",
        region: "Makkuran",
        genrePreset: "Soroz",
        tempo: "68 BPM",
    },
    {
        id: "station-quiet-room",
        name: "Quiet Room",
        group: "For Focus",
        description: "Minimal phrases, spacious percussion, and warm silence between every note.",
        emotionalCue: "Muted suroz tones with a coastal room tone.",
        mood: "Calm",
        energy: "Low",
        voice: "Instrumental",
        instrument: "Suroz",
        instrumentLabel: "Suroz",
        region: "Global",
        genrePreset: "Lullaby",
        tempo: "62 BPM",
    },
    {
        id: "station-night-work",
        name: "Night Work",
        group: "For Focus",
        description: "A darker late-session stream for edits, drafts, and quiet momentum.",
        emotionalCue: "Sub bass, restrained synth, and distant suroz color.",
        mood: "Nostalgic",
        energy: "Medium",
        voice: "Instrumental",
        instrument: "Synth",
        instrumentLabel: "Synth",
        region: "Global",
        genrePreset: "Hip-Hop Fusion",
        tempo: "82 BPM",
    },
    {
        id: "station-heartbreak",
        name: "Heartbreak",
        group: "For Emotion",
        description: "Tender melodic turns for longing, distance, and unfinished words.",
        emotionalCue: "A close vocal lead with fragile dambora support.",
        mood: "Yearning",
        energy: "Low",
        voice: "Male Lead",
        instrument: "Damboora",
        instrumentLabel: "Dambora",
        region: "Balochi",
        genrePreset: "Soroz",
        tempo: "72 BPM",
    },
    {
        id: "station-hope",
        name: "Hope",
        group: "For Emotion",
        description: "Open harmonies and patient percussion that gradually lift the room.",
        emotionalCue: "Warm rubab phrases with a clear chorus shape.",
        mood: "Bright",
        energy: "Medium",
        voice: "Female Lead",
        instrument: "Rubab",
        instrumentLabel: "Rubab",
        region: "Global",
        genrePreset: "Modern Balochi Pop",
        tempo: "96 BPM",
    },
    {
        id: "station-nostalgia",
        name: "Nostalgia Radio",
        group: "For Emotion",
        description: "Memory-heavy melodies for family stories, old roads, and lost summers.",
        emotionalCue: "Dusty tape warmth with Makkuran vocal inflection.",
        mood: "Nostalgic",
        energy: "Low",
        voice: "Male Lead",
        instrument: "Suroz",
        instrumentLabel: "Suroz",
        region: "Makkuran",
        genrePreset: "Sout",
        tempo: "76 BPM",
    },
    {
        id: "station-spiritual-dawn",
        name: "Spiritual Dawn",
        group: "For Emotion",
        description: "A reverent morning stream with devotional restraint and soft rise.",
        emotionalCue: "Choir-like responses around suroz and hand percussion.",
        mood: "Sacred",
        energy: "Low",
        voice: "Choir",
        instrument: "Suroz",
        instrumentLabel: "Suroz",
        region: "Balochi",
        genrePreset: "Sufi",
        tempo: "70 BPM",
    },
    {
        id: "station-long-drive",
        name: "Long Drive",
        group: "For Movement",
        description: "Rolling rhythm for highway hours, city exits, and open-road thinking.",
        emotionalCue: "Modern drums carry a coastal melodic hook.",
        mood: "Bright",
        energy: "Driving",
        voice: "Female Lead",
        instrument: "Modern Drums",
        instrumentLabel: "Modern drums",
        region: "Global",
        genrePreset: "Modern Balochi Pop",
        tempo: "104 BPM",
    },
    {
        id: "station-wedding-fire",
        name: "Wedding Fire",
        group: "For Movement",
        description: "Ceremonial impact with call-and-response energy and bright drum heat.",
        emotionalCue: "Layered doholl pressure, claps, and festive vocal sparks.",
        mood: "Bright",
        energy: "Ceremonial",
        voice: "Choir",
        instrument: "Doholl",
        instrumentLabel: "Dohol",
        region: "Balochi",
        genrePreset: "Wedding",
        tempo: "116 BPM",
    },
    {
        id: "station-coastal-rhythm",
        name: "Coastal Rhythm",
        group: "For Movement",
        description: "Sea-wind percussion and elastic bass for movement without rush.",
        emotionalCue: "The dambora pulses are shaped by a modern low end.",
        mood: "Calm",
        energy: "Medium",
        voice: "Instrumental",
        instrument: "Bass",
        instrumentLabel: "Bass",
        region: "Makkuran",
        genrePreset: "Liko",
        tempo: "94 BPM",
    },
    {
        id: "station-desert-strings",
        name: "Desert Strings",
        group: "By Instrument",
        description: "String-forward atmospheres with dry space, shadow, and patient phrasing.",
        emotionalCue: "The rubab and suroz trade short cinematic motifs.",
        mood: "Nostalgic",
        energy: "Low",
        voice: "Instrumental",
        instrument: "Rubab",
        instrumentLabel: "Rubab",
        region: "Global",
        genrePreset: "Soroz",
        tempo: "74 BPM",
    },
    {
        id: "station-dambora-radio",
        name: "Dambora Lines",
        group: "By Instrument",
        description: "Endless dambora-led variations from raw folk takes to polished studio lines.",
        emotionalCue: "Plucked cycles, intimate breaths, and warm tape body.",
        mood: "Yearning",
        energy: "Medium",
        voice: "Male Lead",
        instrument: "Damboora",
        instrumentLabel: "Dambora",
        region: "Makkuran",
        genrePreset: "Soroz",
        tempo: "86 BPM",
    },
    {
        id: "station-suroz-radio",
        name: "Suroz Echoes",
        group: "By Instrument",
        description: "Bow-led streams with expressive slides and long emotional arcs.",
        emotionalCue: "The suroz melodies hover over restrained percussion.",
        mood: "Sacred",
        energy: "Low",
        voice: "Instrumental",
        instrument: "Suroz",
        instrumentLabel: "Suroz",
        region: "Balochi",
        genrePreset: "Sufi",
        tempo: "69 BPM",
    },
    {
        id: "station-dohol-fire",
        name: "Dohol Fire",
        group: "By Instrument",
        description: "Percussion-first power for ceremonies, edits, and high-impact hooks.",
        emotionalCue: "Layered doholl hits with handclaps and vocal shouts.",
        mood: "Bright",
        energy: "Ceremonial",
        voice: "Choir",
        instrument: "Doholl",
        instrumentLabel: "Dohol",
        region: "Balochi",
        genrePreset: "Wedding",
        tempo: "120 BPM",
    },
    {
        id: "station-cinematic",
        name: "Cinematic",
        group: "For Creators",
        description: "Score-like ideas for scenes, openings, travel films, and dramatic edits.",
        emotionalCue: "Wide pads, suroz leads, and slow-build percussion.",
        mood: "Nostalgic",
        energy: "Medium",
        voice: "Instrumental",
        instrument: "Synth",
        instrumentLabel: "Synth",
        region: "Global",
        genrePreset: "Custom Prompt",
        tempo: "88 BPM",
    },
    {
        id: "station-storytelling",
        name: "Storytelling",
        group: "For Creators",
        description: "Narrative vocal beds that leave space for spoken word and lyrics.",
        emotionalCue: "Low strings, quiet drums, and conversational melody.",
        mood: "Yearning",
        energy: "Low",
        voice: "Male Lead",
        instrument: "Guitar",
        instrumentLabel: "Guitar",
        region: "Global",
        genrePreset: "Sout",
        tempo: "78 BPM",
    },
    {
        id: "station-remixable",
        name: "Remixable",
        group: "For Creators",
        description: "Loop-friendly station ideas with clean sections and strong hooks.",
        emotionalCue: "Modern drums frame short Balochi-inspired motifs.",
        mood: "Bright",
        energy: "Driving",
        voice: "Instrumental",
        instrument: "Modern Drums",
        instrumentLabel: "Modern drums",
        region: "Global",
        genrePreset: "Hip-Hop Fusion",
        tempo: "100 BPM",
    },
    {
        id: "station-vocal-ideas",
        name: "Vocal Ideas",
        group: "For Creators",
        description: "Melody sketches for toplines, refrains, and future song drafts.",
        emotionalCue: "Female lead fragments with simple dambora support.",
        mood: "Hopeful",
        energy: "Medium",
        voice: "Female Lead",
        instrument: "Damboora",
        instrumentLabel: "Dambora",
        region: "Balochi",
        genrePreset: "Modern Balochi Pop",
        tempo: "92 BPM",
    },
]

const GROUPS: StationGroup[] = ["For Focus", "For Emotion", "For Movement", "By Instrument", "For Creators"]
const CURATED_STATION_IDS = [
    "station-desert-night-radio",
    "station-deep-focus",
    "station-heartbreak",
    "station-long-drive",
    "station-dambora-radio",
    "station-cinematic",
] as const

function stationToSong(station: Station): Song {
    return {
        id: station.id,
        title: station.name,
        prompt: station.description,
        genrePreset: station.genrePreset,
        instruments: [station.instrument],
        lyrics: station.emotionalCue,
        status: "completed",
        audioUrl: "/mock/audio-placeholder.mp3",
        mp3Url: "/mock/audio-placeholder.mp3",
        wavUrl: "/mock/audio-placeholder.wav",
        isPublic: true,
        createdAt: new Date("2026-06-08T08:00:00+05:00").toISOString(),
        duration: "Live",
        plays: 0,
        likes: 0,
        remixes: 0,
    }
}

function stationSignalLabel(station: Station) {
    return station.name.replace(/\s+Radio$/, "")
}

function capturedMomentPrompt(moment: CapturedMoment) {
    return `Turn this captured radio moment into a full song: ${moment.stationName}, ${moment.duration}, ${moment.mood} mood, ${moment.voice}, ${moment.instrument}, ${moment.region}.`
}

export default function RadioPage() {
    const [selectedStationId, setSelectedStationId] = useState(STATIONS[0]!.id)
    const [savedStations, setSavedStations] = useState<Set<string>>(new Set())
    const [capturedMoments, setCapturedMoments] = useState<CapturedMoment[]>([])
    const [captureNotice, setCaptureNotice] = useState("")
    const [showAllStations, setShowAllStations] = useState(false)
    const [tunePanelOpen, setTunePanelOpen] = useState(false)
    const [retuning, setRetuning] = useState(false)
    const [pendingTune, setPendingTune] = useState<{ label: string; option: string } | null>(null)
    const [selectedTune, setSelectedTune] = useState<Record<string, string>>({
        Energy: "Low",
        Instrument: "Dambora",
        "Language/Region": "Makkuran",
        Mood: "Calm",
        Voice: "Instrumental",
    })
    const { isCurrentSong, isPlaying, playSong } = usePlaySong()
    const currentSong = usePlayerStore((state) => state.currentSong)
    const retuneTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const selectedStation = STATIONS.find((station) => station.id === selectedStationId) ?? STATIONS[0]!
    const playerStation = currentSong ? STATIONS.find((station) => station.id === currentSong.id) : null
    const activeStation = playerStation ?? selectedStation
    const queue = useMemo(() => STATIONS.map(stationToSong), [])
    const activeSong = useMemo(() => stationToSong(activeStation), [activeStation])
    const activeIsPlaying = isCurrentSong(activeSong) && isPlaying
    const curatedStations = useMemo(
        () =>
            CURATED_STATION_IDS.map((stationId) => STATIONS.find((station) => station.id === stationId)).filter(
                Boolean,
            ) as Station[],
        [],
    )
    const groupedStations = useMemo(
        () =>
            GROUPS.map((group) => ({
                group,
                stations: STATIONS.filter((station) => station.group === group),
            })),
        [], 
    )
    const latestCapturedMoment = capturedMoments[0]

    useEffect(() => {
        return () => {
            if (retuneTimeoutRef.current) {
                clearTimeout(retuneTimeoutRef.current)
            }
        }
    }, [])

    function playStation(station: Station) {
        setSelectedStationId(station.id)
        playSong(stationToSong(station), queue)
    }

    function handleTuneSelect(label: string, option: string) {
        if (retuneTimeoutRef.current) {
            clearTimeout(retuneTimeoutRef.current)
        }

        setPendingTune({ label, option })
        setRetuning(true)

        retuneTimeoutRef.current = setTimeout(() => {
            setSelectedTune((current) => ({ ...current, [label]: option }))
            setPendingTune(null)
            setRetuning(false)
            retuneTimeoutRef.current = null
        }, 650)
    }

    function toggleSavedStation(stationId: string) {
        setSavedStations((current) => {
            const next = new Set(current)
            if (next.has(stationId)) {
                next.delete(stationId)
            } else {
                next.add(stationId)
            }
            return next
        })
    }

    function captureMoment() {
        const moment: CapturedMoment = {
            capturedAt: new Date().toISOString(),
            duration: "30 seconds",
            id: `moment-${Date.now()}`,
            instrument: selectedTune.Instrument ?? activeStation.instrumentLabel,
            mood: selectedTune.Mood ?? activeStation.mood,
            region: selectedTune["Language/Region"] ?? activeStation.region,
            stationName: activeStation.name,
            status: "captured",
            voice: selectedTune.Voice ?? activeStation.voice,
        }

        setCapturedMoments((current) => [moment, ...current])
        setCaptureNotice("Captured the last 30 seconds.")
    }

    return (
        <div className="min-h-dvh overflow-x-hidden bg-[#08080a] text-sand">
            <style>{`
                @keyframes radio-playhead {
                    0% { transform: translateX(-42%); opacity: 0; }
                    16% { opacity: 0.22; }
                    84% { opacity: 0.22; }
                    100% { transform: translateX(142%); opacity: 0; }
                }

                @keyframes radio-retune {
                    0% { transform: translateX(-38%); opacity: 0.06; }
                    50% { opacity: 0.34; }
                    100% { transform: translateX(138%); opacity: 0.06; }
                }

                .radio-playhead {
                    animation: radio-playhead 5.5s linear infinite;
                }

                .radio-retune {
                    animation: radio-retune 1.15s ease-in-out infinite;
                }
            `}</style>
            <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pb-[calc(var(--app-bottom-safe-area)+1.25rem)] pt-5 sm:px-6 lg:px-8 lg:pb-[calc(var(--app-bottom-player-height)+1.5rem)]">
                <section className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#111114] shadow-[0_28px_90px_rgba(0,0,0,0.42)]">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(227,122,44,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.055),transparent_44%)]" aria-hidden={true} />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-saffron/50 to-transparent" aria-hidden={true} />

                    <div className="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:p-8">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full border border-saffron/24 bg-saffron/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-saffron">
                                    <Radio className="size-3.5" aria-hidden={true} />
                                    Now Playing
                                </span>
                                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-sand/52">
                                    Endless AI stream
                                </span>
                            </div>

                            <h1 className="mt-5 text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-6xl">
                                {activeStation.name}
                            </h1>
                            <p className="mt-4 max-w-2xl text-[16px] font-semibold leading-7 text-sand/70 sm:text-lg">
                                {activeStation.description}
                            </p>
                            <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-sand/46">
                                {activeStation.emotionalCue}
                            </p>
                            <p className="mt-4 max-w-xl text-sm font-black leading-6 text-saffron/82">
                                Endless AI streams you can tune, capture, and turn into songs.
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-bold text-sand/60">
                                <SignalPill label={activeStation.mood} />
                                <SignalPill label={activeStation.energy} />
                                <SignalPill label={activeStation.voice} />
                                <SignalPill label={activeStation.instrumentLabel} />
                                <SignalPill label={activeStation.region} />
                            </div>

                            <div className="mt-7 flex flex-wrap gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => playStation(activeStation)}
                                    className="inline-flex h-12 items-center gap-2 rounded-full bg-saffron px-5 text-sm font-black text-[#171210] shadow-[0_16px_42px_rgba(227,122,44,0.22)] transition hover:bg-saffron/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                                >
                                    {activeIsPlaying ? (
                                        <Pause className="size-4 fill-current" aria-hidden={true} />
                                    ) : (
                                        <Play className="ml-0.5 size-4 fill-current" aria-hidden={true} />
                                    )}
                                    {activeIsPlaying ? "Pause" : "Play Station"}
                                </button>
                                <button
                                    type="button"
                                    onClick={captureMoment}
                                    className="inline-flex h-12 items-center gap-2 rounded-full border border-saffron/38 bg-saffron/12 px-5 text-sm font-black text-saffron shadow-[0_12px_34px_rgba(227,122,44,0.12)] transition hover:bg-saffron/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                                >
                                    <Waves className="size-4 text-saffron" aria-hidden={true} />
                                    Capture 30s
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTunePanelOpen((open) => !open)}
                                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/12 bg-white/[0.045] px-5 text-sm font-black text-white transition hover:bg-white/[0.075] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                                >
                                    <SlidersHorizontal className="size-4 text-saffron" aria-hidden={true} />
                                    Tune
                                </button>
                                <button
                                    type="button"
                                    aria-label={savedStations.has(activeStation.id) ? "Unsave station" : "Save station"}
                                    aria-pressed={savedStations.has(activeStation.id)}
                                    onClick={() => toggleSavedStation(activeStation.id)}
                                    className={`inline-flex h-12 items-center gap-2 rounded-full border px-4 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                                        savedStations.has(activeStation.id)
                                            ? "border-saffron/35 bg-saffron/12 text-saffron"
                                            : "border-white/10 bg-white/[0.025] text-sand/62 hover:bg-white/[0.06] hover:text-white"
                                    }`}
                                >
                                    <Bookmark className={`size-4 ${savedStations.has(activeStation.id) ? "fill-current" : ""}`} aria-hidden={true} />
                                    Save
                                </button>
                            </div>

                            {latestCapturedMoment && (
                                <div
                                    role="status"
                                    className="mt-4 max-w-xl rounded-xl border border-saffron/20 bg-saffron/[0.075] px-4 py-3 text-sm font-semibold text-sand/82"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0">
                                            <p className="font-black text-saffron">
                                                {captureNotice || "Captured the last 30 seconds."}
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-sand/58">
                                                Last captured: {latestCapturedMoment.stationName} / 30s captured / {latestCapturedMoment.mood}, {latestCapturedMoment.instrument}, {latestCapturedMoment.voice}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/create?prompt=${encodeURIComponent(capturedMomentPrompt(latestCapturedMoment))}`}
                                            className="shrink-0 rounded-full border border-saffron/25 bg-black/20 px-3 py-1.5 text-xs font-black text-saffron transition hover:bg-saffron/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                                        >
                                            Turn into song →
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={`relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[1.15rem] border border-white/[0.08] bg-black/22 p-4 transition sm:p-5 ${retuning ? "border-saffron/24 shadow-[0_0_44px_rgba(227,122,44,0.08)]" : ""}`}>
                            {retuning && (
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(227,122,44,0.10),transparent)] radio-retune" aria-hidden={true} />
                            )}
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-[0.16em] text-sand/38">
                                        {retuning ? "Retuning" : "Signal"}
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-white">
                                        {retuning ? "Shaping next variation..." : `${activeStation.tempo} / ${stationSignalLabel(activeStation)}`}
                                    </p>
                                </div>
                                <span className={`size-3 rounded-full ${activeIsPlaying ? "animate-pulse bg-saffron shadow-[0_0_18px_rgba(227,122,44,0.8)]" : retuning ? "animate-pulse bg-saffron/80" : "bg-white/22"}`} />
                            </div>

                            <div className="my-8 flex min-h-32 items-center justify-center">
                                <StationVisualizer active={activeIsPlaying} retuning={retuning} />
                            </div>

                            <div className="grid gap-2 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3">
                                <div className="flex items-center justify-between gap-3 text-xs font-bold text-sand/52">
                                    <span>Next variation</span>
                                    <span>{activeStation.region}</span>
                                </div>
                                <p className="text-sm font-semibold leading-6 text-sand/78">
                                    Coming next: {activeStation.voice.toLowerCase()} motif with modern texture.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="tune-stream" className="rounded-[1.25rem] border border-white/[0.09] bg-[#101014] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-saffron/80">
                                Tune the Stream
                            </p>
                            <h2 className="mt-1 text-2xl font-black text-white">
                                Tune your sound
                            </h2>
                        </div>
                        <p className="max-w-md text-sm font-medium leading-6 text-sand/44">
                            Adjust mood, voice, instruments, and region. The station keeps evolving without becoming a fixed playlist.
                        </p>
                    </div>

                    <div className="mt-5 rounded-xl border border-white/[0.075] bg-black/18 p-3">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap gap-2.5">
                                <TuneSummary label="Mood" value={selectedTune.Mood} />
                                <TuneSummary label="Voice" value={selectedTune.Voice} />
                                <TuneSummary label="Instrument" value={selectedTune.Instrument} />
                                <TuneSummary label="Region" value={selectedTune["Language/Region"]} />
                            </div>

                            <div className="flex items-center gap-3">
                                <p className={`text-xs font-black uppercase tracking-[0.14em] transition ${retuning ? "text-saffron" : "text-sand/30"}`}>
                                    {retuning ? "Retuning..." : "Ready"}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setTunePanelOpen((open) => !open)}
                                    className="inline-flex h-10 items-center gap-2 rounded-full border border-saffron/24 bg-saffron/10 px-4 text-xs font-black text-saffron transition hover:bg-saffron/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                                >
                                    <SlidersHorizontal className="size-3.5" aria-hidden={true} />
                                    {tunePanelOpen ? "Close" : "Tune"}
                                </button>
                            </div>
                        </div>

                        {tunePanelOpen && (
                            <div className="mt-4 grid gap-3 border-t border-white/[0.07] pt-4 lg:grid-cols-5">
                                {TUNE_CONTROLS.map((control) => (
                                    <TuneControl
                                        key={control.label}
                                        icon={control.icon}
                                        label={control.label}
                                        options={control.options}
                                        pending={pendingTune?.label === control.label ? pendingTune.option : null}
                                        selected={selectedTune[control.label] ?? control.options[0]}
                                        onSelect={(option) => handleTuneSelect(control.label, option)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section className="grid gap-5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sand/36">
                                Sound Worlds
                            </p>
                            <h2 className="mt-1 text-2xl font-black text-white">
                                Start from a station
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAllStations((show) => !show)}
                            className="mt-3 inline-flex h-10 w-fit items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-4 text-xs font-black text-white transition hover:border-saffron/25 hover:bg-saffron/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:mt-0"
                        >
                            {showAllStations ? "Show curated" : "View all stations"}
                        </button>
                    </div>

                    <div className="grid gap-5">
                        <StationRow
                            activeStationId={activeStation.id}
                            group="Curated stations"
                            onPlay={playStation}
                            onSave={toggleSavedStation}
                            onSelect={playStation}
                            playing={activeIsPlaying}
                            savedStations={savedStations}
                            showHeading={false}
                            stations={curatedStations}
                        />

                        {showAllStations && groupedStations.map(({ group, stations }) => (
                            <StationRow
                                key={group}
                                activeStationId={activeStation.id}
                                group={group}
                                onPlay={playStation}
                                onSave={toggleSavedStation}
                                onSelect={playStation}
                                playing={activeIsPlaying}
                                savedStations={savedStations}
                                stations={stations}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

function SignalPill({ label }: { label: string }) {
    return (
        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
            {label}
        </span>
    )
}

function TuneSummary({ label, value }: { label: string; value: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-sand/66">
            <span className="text-sand/34">{label}:</span>
            <span className="text-white">{value}</span>
        </span>
    )
}

function StationVisualizer({ active, retuning }: { active: boolean; retuning: boolean }) {
    return (
        <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d10] px-4">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(227,122,44,0.08),transparent_28%,rgba(183,62,31,0.08)_72%,transparent)]" aria-hidden={true} />
            <div className="relative flex h-full items-center gap-[3px]" aria-hidden={true}>
                {Array.from({ length: 88 }).map((_, index) => (
                    <span
                        key={index}
                        className={`w-full rounded-full transition-all duration-500 ${
                            active ? "bg-saffron/70" : "bg-sand/12"
                        }`}
                        style={{
                            height: `${16 + ((index * 17 + 11) % 92)}px`,
                            opacity: active ? 0.34 + ((index % 7) * 0.07) : 0.42,
                        }}
                    />
                ))}
            </div>
            <div className={`pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-saffron/18 to-transparent ${active || retuning ? "radio-playhead" : ""}`} aria-hidden={true} />
            {retuning && (
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(237,227,211,0.08),transparent)] radio-retune" aria-hidden={true} />
            )}
            <div className="absolute inset-x-4 top-1/2 h-px bg-saffron/22" aria-hidden={true} />
        </div>
    )
}

function TuneControl({
    icon: Icon,
    label,
    onSelect,
    options,
    pending,
    selected,
}: {
    icon: typeof TUNE_CONTROLS[number]["icon"]
    label: string
    onSelect: (option: string) => void
    options: readonly string[]
    pending: string | null
    selected: string
}) {
    return (
        <div className="min-w-0 rounded-xl border border-white/[0.08] bg-black/24 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-sand/46">
                    <Icon className="size-3.5 shrink-0 text-saffron" aria-hidden={true} />
                    <span className="truncate">{label}</span>
                </div>
                <span className="h-1.5 w-1.5 rounded-full bg-saffron/70" aria-hidden={true} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
                {options.map((option) => {
                    const active = selected === option
                    const isPending = pending === option

                    return (
                        <button
                            key={option}
                            type="button"
                            aria-pressed={active}
                            onClick={() => onSelect(option)}
                            className={`rounded-full px-2.5 py-1.5 text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                                active
                                    ? "bg-saffron text-[#171210] shadow-[0_6px_18px_rgba(227,122,44,0.18)]"
                                    : isPending
                                        ? "border border-saffron/35 bg-saffron/10 text-saffron"
                                    : "border border-white/10 bg-white/[0.045] text-sand/62 hover:bg-white/[0.08] hover:text-white"
                            }`}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function StationRow({
    activeStationId,
    group,
    onPlay,
    onSave,
    onSelect,
    playing,
    savedStations,
    showHeading = true,
    stations,
}: {
    activeStationId: string
    group: string
    onPlay: (station: Station) => void
    onSave: (stationId: string) => void
    onSelect: (station: Station) => void
    playing: boolean
    savedStations: Set<string>
    showHeading?: boolean
    stations: Station[]
}) {
    return (
        <section
            aria-label={showHeading ? undefined : group}
            aria-labelledby={showHeading ? `radio-${group.toLowerCase().replace(/\s+/g, "-")}` : undefined}
        >
            {showHeading && (
                <div className="mb-2.5 flex items-center justify-between gap-4">
                    <h3 id={`radio-${group.toLowerCase().replace(/\s+/g, "-")}`} className="text-base font-black text-white sm:text-lg">
                        {group}
                    </h3>
                    <Waves className="size-4 text-sand/28" aria-hidden={true} />
                </div>
            )}

            <div className="grid gap-3 xl:grid-cols-2">
                {stations.map((station) => {
                    const active = station.id === activeStationId
                    const stationPlaying = active && playing
                    const saved = savedStations.has(station.id)

                    return (
                        <article
                            key={station.id}
                            className={`group relative overflow-hidden rounded-[1.05rem] border p-3.5 transition ${
                                active
                                    ? "border-saffron/45 bg-saffron/[0.055] shadow-[0_16px_52px_rgba(227,122,44,0.14),inset_0_0_0_1px_rgba(227,122,44,0.08)]"
                                    : "border-white/[0.075] bg-[#111114] hover:border-saffron/24 hover:bg-[#151518]"
                            }`}
                        >
                            <div className={`absolute inset-y-4 left-0 w-[3px] rounded-full ${active ? "bg-saffron" : "bg-saffron/34"}`} aria-hidden={true} />
                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                                <button
                                    type="button"
                                    aria-label={`${stationPlaying ? "Pause" : "Play"} ${station.name}`}
                                    onClick={() => onPlay(station)}
                                    className={`flex size-11 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                                        stationPlaying
                                            ? "bg-saffron text-[#171210]"
                                            : "border border-white/12 bg-white/[0.055] text-white hover:bg-saffron hover:text-[#171210]"
                                    }`}
                                >
                                    {stationPlaying ? (
                                        <Pause className="size-4 fill-current" aria-hidden={true} />
                                    ) : (
                                        <Play className="ml-0.5 size-4 fill-current" aria-hidden={true} />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onSelect(station)}
                                    className="min-w-0 flex-1 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                                >
                                    <span className="flex flex-wrap items-center gap-2">
                                        <span className="text-base font-black leading-tight text-white">
                                            {station.name}
                                        </span>
                                        {stationPlaying && (
                                            <span className="rounded-full bg-saffron px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#171210]">
                                                Live
                                            </span>
                                        )}
                                        {saved && (
                                            <span className="rounded-full border border-saffron/24 bg-saffron/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-saffron">
                                                Saved
                                            </span>
                                        )}
                                    </span>
                                    <span className="mt-1 block text-sm font-medium leading-6 text-sand/55">
                                        {station.description}
                                    </span>
                                    <span className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-sand/42">
                                        <span>{station.instrumentLabel}</span>
                                        <span>/</span>
                                        <span>{station.voice}</span>
                                        <span>/</span>
                                        <span>{station.region}</span>
                                    </span>
                                </button>

                                <div className="flex shrink-0 items-center gap-2 sm:self-stretch">
                                    <button
                                        type="button"
                                        aria-label={`${saved ? "Unsave" : "Save"} ${station.name}`}
                                        aria-pressed={saved}
                                        onClick={() => onSave(station.id)}
                                        className={`flex size-10 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                                            saved
                                                ? "bg-saffron/12 text-saffron"
                                                : "text-sand/44 hover:bg-white/[0.06] hover:text-white"
                                        }`}
                                    >
                                        <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} aria-hidden={true} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

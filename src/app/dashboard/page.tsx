import type { ComponentType } from "react"
import Link from "next/link"
import {
    ArrowRight,
    AudioWaveform,
    Clock3,
    Drum,
    PenLine,
    Play,
    Radio,
    Repeat2,
    Sparkles,
} from "lucide-react"

type StudioActionKind = "lyrics" | "instrument" | "radio" | "remix"

type StudioAction = {
    title: string
    description: string
    href: string
    cta: string
    icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
    image: string
    kind: StudioActionKind
    waveform: number[]
}

type CapturedMoment = {
    stationName: string
    duration: string
    href: string
    image: string
    tags: string[]
    waveform: number[]
}

type RecentWorkItem = {
    title: string
    type: "Draft" | "Song" | "Capture"
    metadata: string
    duration: string
    href: string
    action: string
    image: string
    waveform: number[]
}

type StartingPoint = {
    title: string
    cue: string
    href: string
    image: string
    accent: string
    waveform: number[]
}

const HERO_IMAGE = "/hero/zahirok-hero-bg.png"

const QUICK_START: StudioAction[] = [
    {
        title: "Write Lyrics",
        description: "Start from a verse, hook, or full song idea.",
        href: "/create?mode=lyrics",
        cta: "Write now",
        icon: PenLine,
        image: "/covers/makran-evening.png",
        kind: "lyrics",
        waveform: [18, 32, 48, 24, 55, 36, 44, 27, 62, 31, 52, 22],
    },
    {
        title: "Start with Instrument",
        description: "Build around a rhythm, texture, or sound.",
        href: "/create?mode=instrument",
        cta: "Choose sound",
        icon: Drum,
        image: "/covers/sufi-dambora.png",
        kind: "instrument",
        waveform: [42, 64, 36, 58, 74, 48, 68, 33, 52, 71, 44, 59],
    },
    {
        title: "Tune Radio",
        description: "Find a live stream and capture the best 30 seconds.",
        href: "/radio",
        cta: "Open radio",
        icon: Radio,
        image: "/covers/desert-pulse.png",
        kind: "radio",
        waveform: [26, 44, 68, 31, 72, 55, 78, 36, 65, 42, 74, 51],
    },
    {
        title: "Remix a Song",
        description: "Turn an existing idea into a new direction.",
        href: "/create?mode=remix",
        cta: "Start remix",
        icon: Repeat2,
        image: "/cards/explore-public-songs.png",
        kind: "remix",
        waveform: [57, 24, 70, 42, 61, 33, 79, 46, 54, 66, 29, 73],
    },
]

const LAST_CAPTURED: CapturedMoment = {
    stationName: "Desert Night Radio",
    duration: "0:30",
    href: "/create?prompt=Turn%20Desert%20Night%20Radio%2030s%20capture%20into%20a%20complete%20song",
    image: "/covers/desert-pulse.png",
    tags: ["Calm", "Dambora"],
    waveform: [24, 44, 35, 62, 48, 71, 40, 58, 76, 51, 69, 37, 55, 43, 64, 31, 59, 46],
}

const RECENT_WORK: RecentWorkItem[] = [
    {
        title: "Wedding hook idea",
        type: "Draft",
        metadata: "Verse sketch",
        duration: "draft",
        href: "/create?draft=wedding-hook-idea",
        action: "Continue",
        image: "/covers/wedding-doholl.png",
        waveform: [20, 30, 25, 42, 32, 46, 28, 38, 34, 48],
    },
    {
        title: "Long Road demo",
        type: "Song",
        metadata: "Dambora, low voice",
        duration: "3:42",
        href: "/library",
        action: "Open",
        image: "/covers/coastal-lullaby.png",
        waveform: [44, 62, 38, 70, 55, 66, 47, 73, 52, 61],
    },
    {
        title: "Desert Night 30s",
        type: "Capture",
        metadata: "Calm radio moment",
        duration: "0:30",
        href: "/create?prompt=Turn%20Desert%20Night%2030s%20capture%20into%20a%20song",
        action: "Turn into song",
        image: "/covers/desert-pulse.png",
        waveform: [30, 58, 42, 69, 51, 74, 36, 63, 47, 71],
    },
]

const STARTING_POINTS: StartingPoint[] = [
    {
        title: "Deep Focus",
        cue: "quiet writing texture",
        href: "/radio",
        image: "/covers/sufi-dambora.png",
        accent: "from-[#24384a]/55 via-[#11100f]/80 to-[#0b0d10]",
        waveform: [24, 40, 31, 48, 35, 45, 28, 42],
    },
    {
        title: "Long Drive",
        cue: "late-road rhythm",
        href: "/radio",
        image: "/covers/coastal-lullaby.png",
        accent: "from-[#784016]/52 via-[#15110d]/82 to-[#0d0b09]",
        waveform: [35, 52, 42, 61, 48, 66, 38, 58],
    },
    {
        title: "Heartbreak",
        cue: "soft vocal ache",
        href: "/create?prompt=Heartbreak%20song%20with%20warm%20strings%20and%20a%20low%20voice",
        image: "/covers/makran-evening.png",
        accent: "from-[#56293b]/52 via-[#151014]/82 to-[#0c090b]",
        waveform: [52, 31, 59, 28, 66, 37, 49, 24],
    },
    {
        title: "Cinematic",
        cue: "scene-ready motif",
        href: "/create?prompt=Cinematic%20song%20idea%20with%20dambora%20texture%20and%20wide%20space",
        image: "/covers/turbat-night.png",
        accent: "from-[#5b5036]/46 via-[#151411]/82 to-[#0d0d0c]",
        waveform: [28, 58, 44, 72, 39, 62, 53, 68],
    },
    {
        title: "Celebration",
        cue: "wedding energy",
        href: "/create?prompt=Celebration%20song%20with%20dohol%20rhythm%20and%20bright%20chorus",
        image: "/covers/wedding-doholl.png",
        accent: "from-[#7a451c]/58 via-[#18110b]/84 to-[#0e0a07]",
        waveform: [62, 46, 74, 58, 81, 51, 70, 64],
    },
]

export default function DashboardPage() {
    return (
        <div className="relative min-h-dvh overflow-x-hidden bg-[#090909] text-sand">
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_6%,rgba(227,122,44,0.13),transparent_31%),radial-gradient(circle_at_78%_12%,rgba(42,67,86,0.26),transparent_30%),linear-gradient(180deg,#11100f_0%,#090909_58%,#080808_100%)]"
                aria-hidden={true}
            />
            <div className="pointer-events-none absolute inset-0 bg-balochi-pattern-faint opacity-30" aria-hidden={true} />

            <main className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-4 pb-[calc(var(--app-bottom-safe-area)+1.25rem)] pt-5 sm:px-6 lg:px-8 lg:pb-[calc(var(--app-bottom-player-height)+1.5rem)]">
                <HeroSection capture={LAST_CAPTURED} />

                <CaptureCard moment={LAST_CAPTURED} />

                <section aria-labelledby="quick-start-title" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="sm:col-span-2 xl:col-span-4">
                        <SectionHeader
                            eyebrow="Quick Start"
                            title="Choose your first sound"
                            description="Start with lyrics, instruments, radio, or a remix."
                        />
                    </div>
                    {QUICK_START.map((action) => (
                        <QuickStartCard key={action.title} action={action} />
                    ))}
                </section>

                <RecentWorkPanel items={RECENT_WORK} />

                <TryFirstPanel points={STARTING_POINTS} />
            </main>
        </div>
    )
}

function HeroSection({ capture }: { capture: CapturedMoment }) {
    return (
        <section
            aria-labelledby="studio-home-title"
            className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#141211]/88 shadow-[0_30px_96px_rgba(0,0,0,0.36)]"
        >
            <div
                className="absolute inset-0 bg-cover bg-center opacity-[0.22] mix-blend-screen"
                style={{ backgroundImage: `url(${HERO_IMAGE})` }}
                aria-hidden={true}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,9,0.95)_0%,rgba(9,9,9,0.82)_45%,rgba(9,9,9,0.52)_100%)]" aria-hidden={true} />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron/45 to-transparent" aria-hidden={true} />

            <div className="relative z-10 grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.04fr_0.96fr] lg:p-8">
                <div className="flex min-w-0 flex-col justify-between gap-7">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full border border-saffron/18 bg-saffron/[0.07] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-saffron/90">
                            <Sparkles className="size-3.5" aria-hidden={true} />
                            Studio Launchpad
                        </p>
                        <h1
                            id="studio-home-title"
                            className="mt-5 max-w-3xl text-3xl font-black leading-[1.08] tracking-normal text-white sm:text-[2.35rem] lg:text-[2.85rem]"
                        >
                            Create songs from lyrics, instruments, and captured moments.
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-sand/66 sm:text-base sm:leading-7">
                            Start with words, tune a live stream, or continue a sound you already found.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2.5 sm:flex-row">
                        <HeroAction href="/create" icon={AudioWaveform} label="Create Song" primary />
                        <HeroAction href="/radio" icon={Radio} label="Open Radio" />
                        <HeroAction href="/create?draft=wedding-hook-idea" icon={Clock3} label="Continue Draft" quiet />
                    </div>
                </div>

                <LastCapturePreview capture={capture} />
            </div>
        </section>
    )
}

function LastCapturePreview({ capture }: { capture: CapturedMoment }) {
    return (
        <article className="relative min-h-[300px] overflow-hidden rounded-xl border border-white/[0.1] bg-[#0e0d0d]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-75"
                style={{ backgroundImage: `url(${capture.image})` }}
                aria-hidden={true}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(8,8,8,0.35)_40%,rgba(8,8,8,0.9)_100%)]" aria-hidden={true} />
            <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                <span className="rounded-full border border-white/12 bg-black/34 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
                    Last Capture Preview
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron/24 bg-saffron/12 px-2.5 py-1 text-[11px] font-black text-saffron backdrop-blur-sm">
                    <span className="size-1.5 rounded-full bg-saffron shadow-[0_0_14px_rgba(227,122,44,0.8)]" />
                    captured
                </span>
            </div>

            <div className="absolute inset-x-4 bottom-4">
                <div className="rounded-xl border border-white/[0.1] bg-black/48 p-3 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label={`Play ${capture.stationName}`}
                            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-saffron text-[#171210] shadow-[0_14px_32px_rgba(227,122,44,0.25)] transition hover:bg-[#f0a23b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
                        >
                            <Play className="ml-0.5 size-4 fill-current" aria-hidden={true} />
                        </button>
                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-lg font-black text-white">{capture.stationName}</h2>
                            <p className="mt-0.5 text-sm font-bold text-sand/62">30s captured</p>
                        </div>
                    </div>
                    <div className="mt-3">
                        <WaveformStrip bars={capture.waveform} tone="warm" />
                    </div>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-1.5">
                            {capture.tags.map((tag) => (
                                <span key={tag} className="rounded-full border border-white/12 bg-white/[0.06] px-2 py-0.5 text-[11px] font-black text-sand/76">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <Link
                            href={capture.href}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-saffron/28 bg-saffron/[0.1] px-3 text-xs font-black text-saffron transition hover:bg-saffron/[0.15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
                        >
                            Turn into song
                            <ArrowRight className="size-3.5" aria-hidden={true} />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}

function SectionHeader({
    description,
    eyebrow,
    title,
}: {
    description: string
    eyebrow: string
    title: string
}) {
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p id="quick-start-title" className="text-xs font-black uppercase tracking-[0.16em] text-saffron/78">
                    {eyebrow}
                </p>
                <h2 className="mt-1 text-xl font-black tracking-normal text-white sm:text-2xl">{title}</h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-6 text-sand/48">{description}</p>
        </div>
    )
}

function QuickStartCard({ action }: { action: StudioAction }) {
    const Icon = action.icon

    return (
        <Link
            href={action.href}
            className={`group relative min-h-[210px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#141211]/78 shadow-[0_14px_44px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:border-saffron/28 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${quickStartChrome(action.kind)}`}
        >
            <div className="relative h-24 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-70 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-[0.82]"
                    style={{ backgroundImage: `url(${action.image})` }}
                    aria-hidden={true}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/22 to-[#141211]" aria-hidden={true} />
                <QuickStartVisual kind={action.kind} waveform={action.waveform} />
            </div>
            <div className="relative z-10 p-3.5 pt-0">
                <div className="flex items-start gap-3">
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.05] text-saffron">
                        <Icon className="size-[18px]" aria-hidden={true} />
                    </span>
                    <div className="min-w-0">
                        <h3 className="text-base font-black leading-tight text-white">{action.title}</h3>
                        <p className="mt-1.5 text-sm font-semibold leading-5 text-sand/56">{action.description}</p>
                    </div>
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-black text-saffron/86 transition group-hover:text-saffron">
                    {action.cta}
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden={true} />
                </span>
            </div>
        </Link>
    )
}

function CaptureCard({ moment }: { moment: CapturedMoment }) {
    return (
        <section
            aria-labelledby="capture-card-title"
            className="relative overflow-hidden rounded-2xl border border-saffron/20 bg-[#17120f]/92 shadow-[0_24px_82px_rgba(0,0,0,0.34)]"
        >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron/60 to-transparent" aria-hidden={true} />
            <div className="grid min-h-[340px] lg:grid-cols-[0.88fr_1.12fr]">
                <div className="relative min-h-[220px] overflow-hidden lg:min-h-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${moment.image})` }}
                        aria-hidden={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17120f] via-black/12 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/12 lg:to-[#17120f]" aria-hidden={true} />
                    <button
                        type="button"
                        aria-label={`Play ${moment.stationName}`}
                        className="absolute bottom-4 left-4 inline-flex size-14 items-center justify-center rounded-full bg-saffron text-[#171210] shadow-[0_18px_42px_rgba(0,0,0,0.42)] transition hover:bg-[#f0a23b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
                    >
                        <Play className="ml-0.5 size-6 fill-current" aria-hidden={true} />
                    </button>
                </div>

                <div className="relative z-10 flex flex-col justify-center p-5 sm:p-6">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-saffron/84">Continue from capture</p>
                    <h2 id="capture-card-title" className="mt-2 text-2xl font-black text-white sm:text-3xl">Desert Night Radio</h2>
                    <p className="mt-2 text-sm font-bold text-sand/62">30s captured from the live stream</p>

                    <div className="mt-6">
                        <WaveformStrip bars={moment.waveform} tone="warm" />
                        <div className="mt-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.12em] text-sand/38">
                            <span>0:00</span>
                            <span>{moment.duration}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {moment.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-saffron/20 bg-saffron/[0.09] px-2.5 py-1 text-xs font-black text-saffron/90">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <Link
                        href={moment.href}
                        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-saffron px-3 text-sm font-black text-[#171210] transition hover:bg-[#f0a23b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron sm:w-fit sm:px-5"
                    >
                        Turn into song
                        <ArrowRight className="size-4" aria-hidden={true} />
                    </Link>
                </div>
            </div>
        </section>
    )
}

function RecentWorkPanel({ items }: { items: RecentWorkItem[] }) {
    return (
        <section
            aria-labelledby="recent-work-title"
            className="rounded-xl border border-white/[0.08] bg-[#131211]/76 p-4 shadow-[0_14px_44px_rgba(0,0,0,0.18)]"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 id="recent-work-title" className="text-xl font-black text-white">Recent work</h2>
                    <p className="mt-1 text-sm font-semibold text-sand/48">Songs, captures, and drafts in motion.</p>
                </div>
                <Link
                    href="/library"
                    className="hidden h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs font-black text-sand/62 transition hover:border-saffron/24 hover:text-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron sm:inline-flex"
                >
                    My Studio
                    <ArrowRight className="size-3.5" aria-hidden={true} />
                </Link>
            </div>

            <div className="mt-4 grid gap-2">
                {items.map((item) => (
                    <RecentWorkTrack key={`${item.type}-${item.title}`} item={item} />
                ))}
            </div>
        </section>
    )
}

function TryFirstPanel({ points }: { points: StartingPoint[] }) {
    return (
        <section aria-labelledby="try-first-title">
            <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-saffron/72">Try first</p>
                    <h2 id="try-first-title" className="mt-1 text-lg font-black text-white">Mood starts</h2>
                </div>
                <p className="hidden max-w-sm text-sm font-semibold text-sand/42 sm:block">
                    Quick sound worlds with their own color and motion.
                </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {points.map((point) => (
                    <MoodTile key={point.title} point={point} />
                ))}
            </div>
        </section>
    )
}

function HeroAction({
    href,
    icon,
    label,
    primary = false,
    quiet = false,
}: {
    href: string
    icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
    label: string
    primary?: boolean
    quiet?: boolean
}) {
    const Icon = icon
    const className = primary
        ? "bg-saffron text-[#171210] shadow-[0_14px_34px_rgba(227,122,44,0.22)] hover:bg-[#f0a23b]"
        : quiet
            ? "border border-white/10 bg-white/[0.045] text-sand/82 hover:border-white/18 hover:bg-white/[0.07] hover:text-white"
            : "border border-saffron/22 bg-saffron/[0.08] text-white hover:border-saffron/38 hover:bg-saffron/[0.12]"

    return (
        <Link
            href={href}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${className}`}
        >
            <Icon className={`size-4 ${primary ? "" : "text-saffron"}`} aria-hidden={true} />
            {label}
        </Link>
    )
}

function QuickStartVisual({ kind, waveform }: { kind: StudioActionKind; waveform: number[] }) {
    if (kind === "lyrics") {
        return (
            <div className="absolute inset-x-4 bottom-4 space-y-1.5" aria-hidden={true}>
                {[72, 48, 86, 58].map((width, index) => (
                    <span key={index} className="block h-1 rounded-full bg-white/36" style={{ width: `${width}%` }} />
                ))}
            </div>
        )
    }

    if (kind === "radio") {
        return (
            <div className="absolute inset-x-4 bottom-4 rounded-full border border-saffron/20 bg-black/24 px-3 py-2 backdrop-blur-sm" aria-hidden={true}>
                <WaveformStrip bars={waveform} tone="warm" compact />
            </div>
        )
    }

    if (kind === "remix") {
        return (
            <div className="absolute inset-x-4 bottom-4 space-y-1.5" aria-hidden={true}>
                <LayeredWaveform bars={waveform} />
            </div>
        )
    }

    return (
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-1.5" aria-hidden={true}>
            {waveform.slice(0, 10).map((height, index) => (
                <span key={index} className="flex-1 rounded-full bg-saffron/55" style={{ height: `${Math.max(12, height * 0.45)}px` }} />
            ))}
        </div>
    )
}

function RecentWorkTrack({ item }: { item: RecentWorkItem }) {
    return (
        <Link
            href={item.href}
            className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.028] p-2.5 transition hover:border-saffron/22 hover:bg-white/[0.045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron sm:grid-cols-[auto_minmax(0,1fr)_150px_auto]"
        >
            <CoverThumb image={item.image} label={item.title} />
            <span className="min-w-0">
                <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-black text-white">{item.title}</span>
                    <span className="shrink-0 rounded-full border border-white/[0.08] bg-black/22 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-sand/48">
                        {item.type}
                    </span>
                </span>
                <span className="mt-0.5 block truncate text-xs font-semibold text-sand/45">{item.metadata}</span>
            </span>
            <span className="hidden min-w-0 items-center gap-2 sm:flex">
                <MiniWaveform bars={item.waveform} />
                <span className="shrink-0 text-xs font-black tabular-nums text-sand/45">{item.duration}</span>
            </span>
            <span className="hidden shrink-0 items-center gap-1.5 text-xs font-black text-saffron/76 transition group-hover:text-saffron sm:inline-flex">
                {item.action}
                <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden={true} />
            </span>
            <span className="shrink-0 text-xs font-black tabular-nums text-sand/45 sm:hidden">{item.duration}</span>
        </Link>
    )
}

function MoodTile({ point }: { point: StartingPoint }) {
    return (
        <Link
            href={point.href}
            className={`group relative min-h-[118px] overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-br ${point.accent} p-3 transition hover:-translate-y-0.5 hover:border-saffron/22 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron`}
        >
            <div
                className="absolute inset-y-0 right-0 w-[58%] bg-cover bg-center opacity-[0.22] transition group-hover:opacity-[0.28]"
                style={{ backgroundImage: `url(${point.image})` }}
                aria-hidden={true}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/16 via-transparent to-black/34" aria-hidden={true} />
            <div className="relative z-10 flex min-h-[94px] flex-col justify-between">
                <span>
                    <span className="block text-sm font-black text-white">{point.title}</span>
                    <span className="mt-0.5 block text-xs font-semibold text-sand/54">{point.cue}</span>
                </span>
                <MiniWaveform bars={point.waveform} />
            </div>
        </Link>
    )
}

function CoverThumb({ image, label }: { image: string; label: string }) {
    return (
        <span
            aria-label={label}
            role="img"
            className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.04] shadow-[0_10px_24px_rgba(0,0,0,0.22)]"
        >
            <span
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
                aria-hidden={true}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/[0.04]" aria-hidden={true} />
        </span>
    )
}

function WaveformStrip({
    bars,
    compact = false,
    tone = "neutral",
}: {
    bars: number[]
    compact?: boolean
    tone?: "neutral" | "warm"
}) {
    const color = tone === "warm" ? "from-saffron/28 to-saffron/86" : "from-sand/20 to-sand/68"

    return (
        <div className={`flex items-center gap-1 ${compact ? "h-8" : "h-14"}`} aria-hidden={true}>
            {bars.map((height, index) => (
                <span
                    key={`${height}-${index}`}
                    className={`flex-1 rounded-full bg-gradient-to-t ${color}`}
                    style={{ height: `${Math.max(16, height)}%` }}
                />
            ))}
        </div>
    )
}

function MiniWaveform({ bars }: { bars: number[] }) {
    return (
        <span className="flex h-6 min-w-0 flex-1 items-center gap-0.5" aria-hidden={true}>
            {bars.map((height, index) => (
                <span
                    key={`${height}-${index}`}
                    className="w-1 flex-1 rounded-full bg-sand/28 transition group-hover:bg-saffron/48"
                    style={{ height: `${Math.max(18, height)}%` }}
                />
            ))}
        </span>
    )
}

function LayeredWaveform({ bars }: { bars: number[] }) {
    return (
        <div className="space-y-1.5">
            <div className="flex h-5 items-center gap-1">
                {bars.slice(0, 8).map((height, index) => (
                    <span key={`top-${index}`} className="flex-1 rounded-full bg-saffron/52" style={{ height: `${Math.max(18, height)}%` }} />
                ))}
            </div>
            <div className="ml-6 flex h-5 items-center gap-1">
                {bars.slice(4, 12).map((height, index) => (
                    <span key={`bottom-${index}`} className="flex-1 rounded-full bg-[#8ea0b5]/42" style={{ height: `${Math.max(18, 86 - height)}%` }} />
                ))}
            </div>
        </div>
    )
}

function quickStartChrome(kind: StudioActionKind): string {
    if (kind === "lyrics") return "hover:shadow-[0_18px_54px_rgba(128,74,46,0.16)]"
    if (kind === "instrument") return "hover:shadow-[0_18px_54px_rgba(227,122,44,0.14)]"
    if (kind === "radio") return "hover:shadow-[0_18px_54px_rgba(55,77,95,0.18)]"
    return "hover:shadow-[0_18px_54px_rgba(88,72,108,0.16)]"
}

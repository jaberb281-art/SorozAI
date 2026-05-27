import Link from "next/link"
import { notFound } from "next/navigation"
import {
    ArrowLeft,
    Globe2,
    Lock,
} from "lucide-react"

import { SongPlayer } from "@/components/songs/song-player"
import { SongSocialPanel } from "@/components/songs/song-social-panel"
import { SongStatusBadge } from "@/components/songs/song-status-badge"
import { getSongById } from "@/lib/api-client"

type SongDetailPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function SongDetailPage({ params }: SongDetailPageProps) {
    const { id } = await params
    const songDetail = await getSongById(id)

    if (!songDetail) {
        notFound()
    }

    const { song } = songDetail

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-sand">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_14%,rgba(227,122,44,0.22),transparent_29%),radial-gradient(circle_at_16%_24%,rgba(183,62,31,0.2),transparent_27%),radial-gradient(circle_at_84%_18%,rgba(26,58,92,0.82),transparent_35%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_44%,var(--charcoal)_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(237,227,211,0.45)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.35)_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/85 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-charcoal to-transparent" />

            <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-8 pt-8 md:px-6 md:pb-10 md:pt-10 xl:px-8">
                <Link
                    href="/library"
                    className="inline-flex items-center gap-2 rounded-full border border-sand/15 bg-sand/8 px-4 py-2 text-sm font-bold text-sand/82 transition hover:bg-sand/12 hover:text-sand"
                >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back to Library
                </Link>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
                    <div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.24em] text-saffron">
                                    Song Detail
                                </p>
                                <h1 className="mt-3 text-3xl font-black leading-tight text-sand sm:text-4xl md:text-5xl">
                                    {song.title}
                                </h1>
                            </div>
                            <SongStatusBadge status={song.status} />
                        </div>

                        <div className="mt-8">
                            <SongPlayer song={song} />
                        </div>
                    </div>

                    <aside className="rounded-[1.5rem] border border-sand/15 bg-sand/10 p-2.5 shadow-[0_20px_56px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                        <div className="rounded-[1.15rem] border border-sand/10 bg-charcoal/50 p-4">
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-sand/50">
                                Track Metadata
                            </p>
                            <div className="mt-4 grid gap-3">
                                <MetadataCard label="Genre" value={song.genrePreset} />
                                <MetadataCard
                                    label="Instruments"
                                    value={song.instruments.join(", ")}
                                />
                                <MetadataCard
                                    label="Visibility"
                                    value={song.isPublic ? "Public" : "Private"}
                                    icon={
                                        song.isPublic ? (
                                            <Globe2 className="size-4" aria-hidden="true" />
                                        ) : (
                                            <Lock className="size-4" aria-hidden="true" />
                                        )
                                    }
                                />
                                <MetadataCard label="Duration" value={song.duration} />
                                <MetadataCard
                                    label="Created date"
                                    value={new Intl.DateTimeFormat("en", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    }).format(new Date(song.createdAt))}
                                />
                            </div>
                        </div>
                    </aside>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <section className="rounded-[1.5rem] border border-sand/15 bg-sand/10 p-2.5 shadow-[0_20px_56px_rgba(0,0,0,0.26)] backdrop-blur-2xl">
                        <div className="rounded-[1.15rem] border border-sand/10 bg-charcoal/50 p-4 sm:p-5">
                            <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">
                                Lyrics / Prompt
                            </p>
                            <div className="mt-4 text-base leading-8 text-sand/78">
                                <span className="block font-black text-sand">
                                    Prompt
                                </span>
                                <span className="mt-2 block text-sand/72">
                                    {song.prompt}
                                </span>
                                <span className="mt-6 block font-black text-sand">
                                    Lyrics
                                </span>
                                <span className="mt-2 block text-sand/72">
                                    {song.lyrics}
                                </span>
                            </div>
                        </div>
                    </section>

                    <SongSocialPanel song={song} />
                </div>
            </section>
        </div>
    )
}

function MetadataCard({
    icon,
    label,
    value,
}: {
    icon?: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="rounded-2xl border border-sand/10 bg-sand/8 p-4">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-sand/45">
                {icon}
                {label}
            </p>
            <p className="mt-2 text-sm font-bold leading-6 text-sand">{value}</p>
        </div>
    )
}

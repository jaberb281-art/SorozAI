"use client"

import { useState } from "react"
import Link from "next/link"
import {
    ChevronDown,
    Grid3X3,
    Heart,
    List,
    Plus,
    Sparkles,
    Wand2,
} from "lucide-react"

import { MockNote, RoundIcon } from "./shared"
import { profilePathForCreator } from "@/lib/public-profiles"

// ── Voices tab ──────────────────────────────────────────────────────────────

export function VoicesTab() {
    return (
        <>
            <div className="grid grid-cols-2 border-b border-white/12">
                {["My Voices", "Following"].map((tab, index) => (
                    <button
                        key={tab}
                        type="button"
                        className={`pb-3 text-base font-black ${
                            index === 0 ? "border-b-2 border-white text-white" : "text-sand/70"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mt-16">
                <button type="button" className="text-center">
                    <span className="mx-auto flex size-40 items-center justify-center rounded-[42%] bg-[radial-gradient(circle_at_50%_50%,rgba(52,20,190,0.95),rgba(23,20,90,0.92)_56%,rgba(12,12,16,1)_100%)]">
                        <Plus className="size-7 text-white" aria-hidden={true} />
                    </span>
                    <span className="mt-3 inline-flex rounded-full bg-white/[0.09] px-4 py-2 text-sm font-black text-white">
                        Create new Voice
                    </span>
                </button>
            </div>

            <p className="mt-32 text-center text-lg font-semibold text-sand/82">
                You have no Voices in your library. Create some to see them here.
            </p>
        </>
    )
}

// ── Cover Art tab ───────────────────────────────────────────────────────────

export function CoverArtTab() {
    const [note, setNote] = useState("")

    return (
        <div className="min-h-[560px]">
            <div className="flex justify-end gap-2">
                <RoundIcon label="Favorites">
                    <Heart className="size-4 fill-current" aria-hidden={true} />
                </RoundIcon>
                <RoundIcon label="List view">
                    <List className="size-5" aria-hidden={true} />
                </RoundIcon>
                <RoundIcon label="Grid view" active>
                    <Grid3X3 className="size-5" aria-hidden={true} />
                </RoundIcon>
            </div>

            <div className="flex min-h-[260px] items-center justify-center text-center">
                <div>
                    <Sparkles className="mx-auto size-10 text-sand/45" aria-hidden={true} />
                    <p className="mt-6 text-base font-semibold text-white">
                        No cover art generated yet
                    </p>
                </div>
            </div>

            <div className="mt-8 rounded-2xl bg-white/[0.08] p-5">
                <div className="flex flex-wrap gap-7">
                    {["Image to Video", "Text to Video", "Text to Image"].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            className={`pb-3 text-base font-semibold ${
                                tab === "Text to Image"
                                    ? "border-b border-white text-white"
                                    : "text-sand/45"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <textarea
                    rows={3}
                    placeholder="Describe what you want to see..."
                    className="mt-4 w-full resize-none bg-transparent text-base text-sand outline-none placeholder:text-sand/82"
                />

                <div className="mt-4 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-white/[0.08] px-5 text-base font-black text-white"
                    >
                        Basic
                        <ChevronDown className="size-4" aria-hidden={true} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setNote("Cover art generation is coming soon.")}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-saffron/55 px-6 text-base font-black text-sand"
                    >
                        <Wand2 className="size-4" aria-hidden={true} />
                        Generate - 5 left
                    </button>
                </div>

                {note && <MockNote text={note} />}
            </div>
        </div>
    )
}

// ── Hooks tab ───────────────────────────────────────────────────────────────

export function HooksTab() {
    return (
        <div className="flex min-h-[420px] flex-col items-center justify-start pt-8 text-center">
            <p className="text-lg font-semibold text-sand/78">
                You have not created any hooks yet. Try it out!
            </p>
            <Link
                href="/hooks"
                className="mt-6 inline-flex h-12 items-center gap-3 rounded-full bg-sand px-6 text-lg font-black text-[#151515]"
            >
                <Plus className="size-5" aria-hidden={true} />
                Create hook
            </Link>
        </div>
    )
}

// ── Liked Hooks tab ─────────────────────────────────────────────────────────

interface HookCard {
    id: string
    title: string
    creator: string
    coverClass: string
}

const MOCK_HOOKS: HookCard[] = [
    {
        id: "hook-1",
        title: "Kech Valley Loop",
        creator: "Ruvin Dashti",
        coverClass:
            "bg-[linear-gradient(180deg,rgba(8,55,42,0.78),rgba(8,12,12,0.95)),radial-gradient(circle_at_50%_18%,rgba(227,122,44,0.65),transparent_12%)]",
    },
    {
        id: "hook-2",
        title: "Makran Coast Beat",
        creator: "Karzan Beat",
        coverClass:
            "bg-[linear-gradient(160deg,rgba(183,62,31,0.64),rgba(22,18,28,0.95)),radial-gradient(circle_at_42%_35%,rgba(237,227,211,0.5),transparent_20%)]",
    },
]

export function LikedHooksTab() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MOCK_HOOKS.map((hook) => (
                <article
                    key={hook.id}
                    className={`relative h-[410px] overflow-hidden rounded-2xl border border-white/10 ${hook.coverClass}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-base font-black text-white">{hook.title}</h2>
                        <Link
                            href={profilePathForCreator(hook.creator)}
                            className="mt-2 inline-block text-sm font-semibold text-sand/82 transition hover:text-saffron"
                        >
                            {hook.creator}
                        </Link>
                    </div>
                </article>
            ))}
        </div>
    )
}

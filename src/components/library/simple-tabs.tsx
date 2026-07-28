"use client"

import { useState } from "react"
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
                You have no voices in My Studio. Create some to see them here.
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

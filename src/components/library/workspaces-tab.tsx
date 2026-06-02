"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { MockNote, SearchInput } from "./shared"

export function WorkspacesTab({
    query,
    setQuery,
}: {
    query: string
    setQuery: (query: string) => void
}) {
    const [note, setNote] = useState("")

    return (
        <>
            <div className="flex flex-wrap items-center gap-5">
                <SearchInput value={query} onChange={setQuery} placeholder="Search" />
                <button
                    type="button"
                    onClick={() => setNote("Workspace creation is coming soon.")}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-white/[0.085] px-6 text-lg font-black text-white transition hover:bg-white/[0.12]"
                >
                    <Plus className="size-5" aria-hidden={true} />
                    New Workspace
                </button>
            </div>

            {note && <div className="mt-4 max-w-md"><MockNote text={note} /></div>}

            <div className="mt-12 space-y-4">
                <button
                    type="button"
                    onClick={() => setNote("Workspace creation is coming soon.")}
                    className="flex items-center gap-5 text-left"
                >
                    <span className="flex size-[60px] items-center justify-center rounded-lg bg-white/[0.12]">
                        <Plus className="size-7 text-sand/80" aria-hidden={true} />
                    </span>
                    <span className="text-base font-black text-white">Create New Workspace</span>
                </button>

                <button
                    type="button"
                    className="flex w-full items-center gap-5 rounded-2xl bg-white/[0.035] p-2 text-left transition hover:bg-white/[0.06]"
                >
                    <span className="size-[60px] rounded-lg bg-[linear-gradient(135deg,rgba(227,122,44,0.65),rgba(220,40,120,0.7)),radial-gradient(circle_at_35%_40%,rgba(30,130,70,0.62),transparent_32%)]" />
                    <span>
                        <span className="block text-base font-black text-saffron">My Workspace</span>
                        <span className="mt-1 block text-sm font-semibold text-sand/72">
                            4 Songs · 7m ago
                        </span>
                    </span>
                </button>
            </div>
        </>
    )
}

"use client"

import { useState } from "react"
import {
    ChevronDown,
    FileMusic,
    Filter,
    Plus,
} from "lucide-react"

import { MockNote, SearchInput, ToolbarPill } from "./shared"

export function StudioProjectsTab({
    query,
    setQuery,
}: {
    query: string
    setQuery: (query: string) => void
}) {
    const [note, setNote] = useState("")

    return (
        <>
            <div className="flex flex-wrap items-center gap-2">
                <SearchInput value={query} onChange={setQuery} placeholder="Search projects" />
                <ToolbarPill>
                    <Filter className="size-4" aria-hidden={true} />
                    Filters
                    <ChevronDown className="size-4 text-sand/55" aria-hidden={true} />
                </ToolbarPill>
                <ToolbarPill>
                    Newest First
                    <ChevronDown className="size-4 text-sand/55" aria-hidden={true} />
                </ToolbarPill>
            </div>

            <div className="mt-5 grid gap-8 lg:grid-cols-[398px_1fr]">
                <div>
                    <button
                        type="button"
                        onClick={() => setNote("Studio projects are coming soon.")}
                        className="flex h-[238px] w-full items-center justify-center rounded-xl bg-white/[0.055] text-center transition hover:bg-white/[0.08]"
                    >
                        <span>
                            <Plus className="mx-auto size-7 text-white" aria-hidden={true} />
                            <span className="mt-4 block text-xl font-bold text-white">New Project</span>
                        </span>
                    </button>
                    {note && <MockNote text={note} />}
                </div>

                <div className="flex min-h-[360px] items-center justify-center text-center">
                    <div>
                        <FileMusic className="mx-auto size-12 text-sand/55" aria-hidden={true} />
                        <p className="mt-7 text-xl font-black text-white">
                            No studio projects found
                        </p>
                        <p className="mt-4 text-lg font-semibold text-sand/62">
                            Create your first studio project to get started.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

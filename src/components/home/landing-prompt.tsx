"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AudioWaveform, Plus, SlidersHorizontal, WandSparkles } from "lucide-react"

const DEFAULT_PROMPT =
  "A Zahirok song about Makran evenings with Suroz and Damboora"

export function LandingPrompt() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    router.push("/create")
  }

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      router.push("/create")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-6 max-w-[820px] rounded-[1.45rem] border border-sand/12 bg-sand/[0.06] p-2 shadow-[0_18px_54px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:mt-7"
    >
      <div className="rounded-[1.1rem] border border-sand/10 bg-charcoal/72 p-3">
        <label className="sr-only" htmlFor="landing-song-prompt">
          Describe the Balochi song you want to create
        </label>
        <textarea
          id="landing-song-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={handleTextareaKeyDown}
          aria-label="Describe the Balochi song you want to create"
          rows={2}
          className="h-16 min-h-16 w-full resize-none bg-transparent text-left text-sm font-semibold leading-6 text-sand outline-none transition placeholder:text-sand/45 sm:text-base"
          placeholder={DEFAULT_PROMPT}
        />
        <div className="mt-3 flex flex-col gap-2 border-t border-sand/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Add options"
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-sand/15 text-sand/80 transition hover:bg-sand/10 hover:text-sand"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Open advanced creation options"
              onClick={() => router.push("/create")}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-sand/15 px-4 text-sm font-bold text-sand/82 transition hover:bg-sand/10 hover:text-sand sm:flex-none"
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Advanced
            </button>
          </div>
          <div className="grid grid-cols-[auto_1fr] items-center gap-2 sm:flex sm:justify-end">
            <button
              type="button"
              aria-label="Enhance prompt"
              className="inline-flex h-10 items-center justify-center rounded-full border border-sand/15 px-3 text-sand/78 transition hover:bg-sand/10 hover:text-sand"
            >
              <WandSparkles className="size-4" aria-hidden="true" />
            </button>
            <button
              type="submit"
              aria-label="Create your first song"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-saffron px-5 text-sm font-black text-sand transition hover:bg-terracotta sm:h-11 sm:px-6"
            >
              <AudioWaveform className="size-4" aria-hidden="true" />
              Create
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

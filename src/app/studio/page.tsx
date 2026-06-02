import { SlidersHorizontal } from "lucide-react"

export default function StudioPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#101010] text-sand">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(227,122,44,0.1),transparent_28%),linear-gradient(180deg,#111113_0%,#0d0d0f_100%)]" />

            <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 pb-[160px] text-center md:pb-[96px]">
                <span className="flex size-16 items-center justify-center rounded-full border border-saffron/25 bg-saffron/10 text-saffron">
                    <SlidersHorizontal className="size-7" aria-hidden={true} />
                </span>
                <h1 className="mt-6 text-4xl font-black tracking-tight text-white">
                    Studio
                </h1>
                <p className="mt-4 max-w-md text-base font-semibold leading-7 text-sand/60">
                    Advanced Zahirok creation tools will appear here.
                </p>
                {/* MOCK: replace with real Studio workspace when it ships */}
                <p className="mt-2 text-sm text-sand/40">
                    Multi-track editing, stem control, and collaboration features are planned for a future release.
                </p>
            </main>
        </div>
    )
}

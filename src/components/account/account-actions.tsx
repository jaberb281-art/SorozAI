"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AccountActions() {
    const router = useRouter()
    const [note, setNote] = useState("")

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setNote("Profile editing coming soon.")}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-saffron px-4 text-sm font-bold text-sand shadow-[0_12px_30px_rgba(227,122,44,0.2)] transition hover:bg-terracotta"
                >
                    Edit profile
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-sand/15 px-4 text-sm font-bold text-sand/76 transition hover:bg-sand/10 hover:text-sand"
                >
                    Sign out
                </button>
            </div>
            {note && (
                <p role="status" className="mt-3 rounded-lg border border-saffron/25 bg-saffron/10 px-3 py-2 text-xs font-semibold text-saffron">
                    {note}
                </p>
            )}
        </div>
    )
}

export function UpgradeButton() {
    const router = useRouter()

    return (
        <button
            type="button"
            onClick={() => router.push("/pricing")}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-saffron px-4 text-sm font-black text-sand transition hover:bg-terracotta"
        >
            Upgrade to Basic
        </button>
    )
}

export function PlanUpgradeButton({ planName }: { planName: string }) {
    const router = useRouter()

    return (
        <button
            type="button"
            onClick={() => router.push("/pricing")}
            aria-label={`Upgrade to ${planName} plan`}
            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-saffron px-4 text-sm font-black text-sand transition hover:bg-terracotta"
        >
            Upgrade
        </button>
    )
}

export function DeleteAccountButton() {
    const [note, setNote] = useState("")

    return (
        <div>
            <button
                type="button"
                onClick={() => setNote("Account deletion is not connected yet.")}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-terracotta/45 bg-terracotta/15 px-4 text-sm font-black text-sand transition hover:bg-terracotta"
            >
                Delete account
            </button>
            {note && (
                <p role="status" className="mt-3 rounded-lg border border-terracotta/25 bg-terracotta/10 px-3 py-2 text-xs font-semibold text-terracotta">
                    {note}
                </p>
            )}
        </div>
    )
}

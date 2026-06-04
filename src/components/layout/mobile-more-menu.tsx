"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { Check, ChevronDown, Monitor, Moon, Music2, Sun, X } from "lucide-react"

export function MobileMoreMenu({ onClose }: { onClose: () => void }) {
    const [isThemeOpen, setIsThemeOpen] = useState(false)

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose()
            }
        }

        document.addEventListener("keydown", handleEscape)

        return () => {
            document.removeEventListener("keydown", handleEscape)
        }
    }, [onClose])

    const primaryItems = [
        { label: "My Taste", href: "/account" },
        { label: "Invite friends", href: "/profile" },
        { label: "Account", href: "/account" },
    ]

    const navItems = [
        { label: "Hooks", href: "/hooks" },
        { label: "Labs", href: "/labs" },
        { label: "Help", href: "/terms" },
        { label: "About", href: "/" },
        { label: "Blog", href: "/feed" },
        { label: "Feedback", href: "/notifications" },
        { label: "Careers", href: "/studio" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Your Privacy Choices", href: "/privacy" },
    ]

    return (
        <div
            className="fixed inset-0 z-[95] bg-black/62 px-3 py-4 backdrop-blur-sm lg:hidden"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-label="More menu"
                className="ml-auto flex h-full w-full max-w-sm flex-col overflow-hidden border border-white/[0.06] bg-[#101012] text-white shadow-[0_28px_90px_rgba(0,0,0,0.65)]"
            >
                <div className="flex shrink-0 items-center justify-end px-4 py-3">
                    <button
                        type="button"
                        aria-label="Close more menu"
                        onClick={onClose}
                        className="inline-flex size-10 items-center justify-center rounded-full bg-white/[0.08] text-white transition hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                    >
                        <X className="size-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-color:rgba(237,227,211,0.25)_transparent] [scrollbar-width:thin]">
                    <nav aria-label="Account menu" className="grid gap-1">
                        {primaryItems.map((item) => (
                            <MobileMoreLink key={item.label} href={item.href} onClick={onClose}>
                                {item.label}
                            </MobileMoreLink>
                        ))}

                        <Link
                            href="/pricing"
                            onClick={onClose}
                            className="flex min-h-9 items-center gap-2 rounded-lg px-0 text-sm font-semibold text-white transition hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                        >
                            Subscription
                            <span className="rounded-full bg-white/12 px-2 py-0.5 text-[9px] font-black text-white">
                                75 Credits
                            </span>
                        </Link>

                        <button
                            type="button"
                            aria-expanded={isThemeOpen}
                            onClick={() => setIsThemeOpen((open) => !open)}
                            className="mt-1 flex min-h-10 w-full items-center justify-between rounded-lg px-0 text-left text-sm font-semibold text-white transition hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                        >
                            Theme
                            <ChevronDown className={`size-4 text-white/72 transition ${isThemeOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                        </button>

                        {isThemeOpen && (
                            <div className="mb-2 grid border-y border-white/[0.08] py-2">
                                <ThemeChoice icon={<Moon className="size-4" aria-hidden="true" />} label="Dark" active />
                                <ThemeChoice icon={<Sun className="size-4" aria-hidden="true" />} label="Light" />
                                <ThemeChoice icon={<Monitor className="size-4" aria-hidden="true" />} label="System" />
                            </div>
                        )}
                    </nav>

                    {!isThemeOpen && <div className="my-2 border-t border-white/[0.08]" />}

                    <nav aria-label="Zahirok links" className="grid gap-1">
                        {navItems.map((item) => (
                            <MobileMoreLink key={item.label} href={item.href} onClick={onClose}>
                                {item.label}
                            </MobileMoreLink>
                        ))}
                    </nav>

                    <div className="mt-3 border-t border-white/[0.08] pt-2">
                        <button
                            type="button"
                            className="flex min-h-9 w-full items-center rounded-lg px-0 text-left text-sm font-semibold text-white transition hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="grid shrink-0 grid-cols-5 border-t border-white/[0.08] px-5 py-3 text-white/46">
                    <span className="text-center text-xl font-semibold">X</span>
                    <span className="text-center text-xl font-semibold">◎</span>
                    <span className="text-center text-xl font-semibold">▶</span>
                    <Music2 className="mx-auto size-5" aria-hidden="true" />
                    <span className="text-center text-xl font-semibold">●</span>
                </div>
            </section>
        </div>
    )
}

function MobileMoreLink({
    children,
    href,
    onClick,
}: {
    children: ReactNode
    href: string
    onClick: () => void
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex min-h-9 items-center rounded-lg px-0 text-sm font-semibold text-white transition hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
            {children}
        </Link>
    )
}

function ThemeChoice({
    active,
    icon,
    label,
}: {
    active?: boolean
    icon: ReactNode
    label: string
}) {
    return (
        <button
            type="button"
            className="flex min-h-9 items-center gap-3 rounded-lg px-0 text-sm font-semibold text-white transition hover:text-saffron focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
            <span className="text-white/86">{icon}</span>
            <span className="flex-1 text-left">{label}</span>
            {active && <Check className="size-4 text-white/86" aria-hidden="true" />}
        </button>
    )
}

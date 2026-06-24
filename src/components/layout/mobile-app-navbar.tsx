"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, MoreHorizontal, Music2, Search } from "lucide-react"

import { MobileMoreMenu } from "@/components/layout/mobile-more-menu"

export function MobileAppNavbar() {
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)

    return (
        <>
            <header className="fixed left-0 right-0 top-0 z-[85] flex h-14 items-center justify-between gap-3 bg-[#08080a]/78 px-4 text-sand backdrop-blur-md lg:hidden">
                <Link href="/dashboard" aria-label="Soroz studio" className="flex min-w-0 items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-saffron/25 bg-saffron/10 text-saffron">
                        <Music2 className="size-4" aria-hidden="true" />
                    </span>
                    <span className="truncate text-lg font-black uppercase tracking-[0.14em] text-white">
                        Soroz
                    </span>
                </Link>

                <div className="flex shrink-0 items-center gap-1.5">
                    <Link
                        href="/pricing"
                        className="inline-flex h-9 items-center justify-center rounded-full bg-white/[0.08] px-4 text-xs font-black text-white transition hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                    >
                        Upgrade
                    </Link>
                    <Link
                        href="/feed"
                        aria-label="Discover"
                        className="inline-flex size-9 items-center justify-center rounded-full bg-white/[0.08] text-white transition hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron [&_svg]:pointer-events-none"
                    >
                        <Search className="size-4" aria-hidden="true" />
                    </Link>
                    <Link
                        href="/notifications"
                        aria-label="Notifications"
                        className="inline-flex size-9 items-center justify-center rounded-full bg-white/[0.08] text-white transition hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron [&_svg]:pointer-events-none"
                    >
                        <Bell className="size-4" aria-hidden="true" />
                    </Link>
                    <button
                        type="button"
                        aria-label="Open more menu"
                        aria-expanded={isMoreMenuOpen}
                        aria-haspopup="dialog"
                        onClick={() => setIsMoreMenuOpen(true)}
                        className="inline-flex size-9 items-center justify-center rounded-full bg-white/[0.08] text-white transition hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron [&_svg]:pointer-events-none"
                    >
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                    </button>
                </div>
            </header>

            {isMoreMenuOpen && (
                <MobileMoreMenu onClose={() => setIsMoreMenuOpen(false)} />
            )}
        </>
    )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BookOpen,
    Compass,
    DollarSign,
    LogIn,
    Mic2,
    Music,
    PlusCircle,
    User,
} from "lucide-react"

const NAV_ITEMS = [
    { href: "/create", label: "Create", icon: PlusCircle },
    { href: "/library", label: "Library", icon: BookOpen },
    { href: "/feed", label: "Explore", icon: Compass },
    { href: "/voice-of-balochistan", label: "Voice", icon: Mic2 },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
    { href: "/account", label: "Account", icon: User },
] as const

// Mock credits; will come from api-client.getAccount() once backend is live
const MOCK_CREDITS = { remaining: 3, limit: 5, tier: "Free" }

export function AppSidebar() {
    const pathname = usePathname()
    const isCreateActive = pathname === "/create"

    return (
        <aside className="fixed inset-y-0 left-0 z-[90] hidden w-[220px] flex-col border-r border-sand/8 bg-charcoal/95 backdrop-blur-2xl md:flex">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sand/8 px-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-saffron/30 bg-saffron/15 text-saffron shadow-[0_0_20px_rgba(227,122,44,0.22)]">
                    <Music className="size-4" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.26em] text-sand">
                    ZAHIROK AI
                </span>
            </div>

            {/* Create CTA */}
            <div className="px-3 pt-4">
                <Link
                    href="/create"
                    aria-current={isCreateActive ? "page" : undefined}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-saffron px-4 py-2.5 text-sm font-black text-sand shadow-[0_10px_28px_rgba(227,122,44,0.28)] transition hover:bg-terracotta"
                >
                    <PlusCircle className="size-4" aria-hidden="true" />
                    Create Song
                </Link>
            </div>

            {/* Nav */}
            <nav aria-label="Primary desktop navigation" className="mt-3 flex flex-col gap-0.5 px-2">
                {NAV_ITEMS.filter((item) => item.href !== "/create").map((item) => {
                    const Icon = item.icon
                    const isActive =
                        pathname === item.href ||
                        (item.href === "/library" && pathname.startsWith("/song/"))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${isActive
                                    ? "bg-saffron/12 text-saffron"
                                    : "hover:bg-white/[0.04]"
                                }`}
                        >
                            <Icon
                                className={`size-4 shrink-0 transition ${isActive ? "text-saffron" : "text-[#EDE3D3]/60 group-hover:text-[#E37A2C]/85"}`}
                                aria-hidden="true"
                            />
                            <span
                                className={`transition ${isActive ? "text-saffron" : "text-[#EDE3D3]/70 group-hover:text-[#EDE3D3]/90"}`}
                            >
                                {item.label}
                            </span>
                            {isActive ? (
                                <span className="ml-auto size-1.5 rounded-full bg-saffron" />
                            ) : null}
                        </Link>
                    )
                })}
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Credits widget */}
            <div className="border-t border-sand/8 p-3 pb-[calc(0.75rem+72px)]">
                <div className="rounded-2xl border border-sand/10 bg-sand/6 p-3">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#EDE3D3]/58">
                            {MOCK_CREDITS.tier} plan
                        </span>
                        <Link
                            href="/pricing"
                            className="rounded-full border border-saffron/30 bg-saffron/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-saffron transition hover:bg-saffron/18"
                        >
                            Upgrade
                        </Link>
                    </div>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-[#EDE3D3]/62">
                        <span>Songs this month</span>
                        <span className="text-sand">
                            {MOCK_CREDITS.remaining}
                            <span className="text-[#EDE3D3]/45">/{MOCK_CREDITS.limit}</span>
                        </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-sand/10">
                        <div
                            className="h-full rounded-full bg-saffron shadow-[0_0_10px_rgba(227,122,44,0.4)] transition-all duration-500"
                            role="progressbar"
                            aria-label="Monthly song credits remaining"
                            aria-valuemin={0}
                            aria-valuemax={MOCK_CREDITS.limit}
                            aria-valuenow={MOCK_CREDITS.remaining}
                            aria-valuetext={`${MOCK_CREDITS.remaining} of ${MOCK_CREDITS.limit} songs remaining this month`}
                            style={{
                                width: `${(MOCK_CREDITS.remaining / MOCK_CREDITS.limit) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                <Link
                    href="/auth/sign-in"
                    className="group mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-[#EDE3D3]/60 transition hover:bg-white/[0.04] hover:text-[#EDE3D3]/80"
                >
                    <LogIn className="size-4 shrink-0 text-[#EDE3D3]/50 transition group-hover:text-[#E37A2C]/80" aria-hidden="true" />
                    Sign in
                </Link>
            </div>
        </aside>
    )
}

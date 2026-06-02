"use client"

import { useEffect, useState } from "react"
import type { ComponentType } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Bell,
    BookOpen,
    ChevronDown,
    ChevronLeft,
    FlaskConical,
    Home,
    Library,
    MoreHorizontal,
    Music,
    Search,
    SlidersHorizontal,
    SquarePlay,
    X,
} from "lucide-react"

type NavItem = {
    href: string
    label: string
    icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
    isMock?: boolean
}

const MAIN_NAV_ITEMS: NavItem[] = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/feed", label: "Explore", icon: Search },
    { href: "/create", label: "Create", icon: Music },
    // MOCK: placeholder route until Studio ships
    { href: "/studio", label: "Studio", icon: SlidersHorizontal },
    { href: "/library", label: "Library", icon: Library },
    { href: "/hooks", label: "Hooks", icon: SquarePlay },
    { href: "/notifications", label: "Notifications", icon: Bell },
] as const

const SECONDARY_NAV_ITEMS: NavItem[] = [
    { href: "/labs", label: "Labs", icon: FlaskConical },
] as const

const CONSENT_OPTIONS = [
    {
        key: "performance",
        title: "Performance Cookies",
        description: "Help us understand which Zahirok features feel fast, useful, and ready for improvement.",
    },
    {
        key: "functional",
        title: "Functional Cookies",
        description: "Remember interface preferences such as workspace filters, language choices, and display options.",
    },
    {
        key: "marketing",
        title: "Marketing Cookies",
        description: "Support measuring campaign performance and future Zahirok creator announcements.",
    },
] as const

type ConsentKey = (typeof CONSENT_OPTIONS)[number]["key"]

const MORE_ITEMS = [
    "Invite friends",
    "Earn Credits",
    "What's new?",
    "Help",
    "About",
    "Blog",
    "Careers",
    "Feedback",
] as const

const SOCIAL_ITEMS = [
    { label: "X", text: "X" },
    { label: "Instagram", text: "IG" },
    { label: "YouTube", text: "YT" },
    { label: "TikTok", text: "TT" },
    { label: "Discord", text: "DC" },
] as const

function isActivePath(pathname: string, href: string) {
    if (href === "/library") return pathname === "/library" || pathname.startsWith("/song/")
    return pathname === href
}

export function AppSidebar() {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMoreOpen, setIsMoreOpen] = useState(false)
    const [isPoliciesOpen, setIsPoliciesOpen] = useState(false)
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
    const [consentPreferences, setConsentPreferences] = useState<Record<ConsentKey, boolean>>({
        performance: false,
        functional: false,
        marketing: false,
    })

    const isPoliciesActive = pathname === "/terms" || pathname === "/privacy" || isPoliciesOpen

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--app-sidebar-width",
            isCollapsed ? "76px" : "228px",
        )

        return () => {
            document.documentElement.style.removeProperty("--app-sidebar-width")
        }
    }, [isCollapsed])

    function toggleCollapsed() {
        setIsCollapsed((value) => !value)
        setIsMoreOpen(false)
        setIsPoliciesOpen(false)
    }

    function toggleConsentPreference(key: ConsentKey) {
        setConsentPreferences((current) => ({
            ...current,
            [key]: !current[key],
        }))
    }

    function rejectAllConsent() {
        setConsentPreferences({
            performance: false,
            functional: false,
            marketing: false,
        })
    }

    function openPoliciesMenu() {
        setIsPoliciesOpen((value) => !value)
        setIsMoreOpen(false)
    }

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-[90] hidden h-screen flex-col border-r border-white/[0.11] bg-[#0f0f10] text-sand backdrop-blur-2xl transition-[width] duration-200 md:flex ${
                isCollapsed ? "w-[76px]" : "w-[228px]"
            }`}
        >
            <div className="relative flex h-full min-h-0 flex-col px-3 pb-4 pt-0">
                <div className="shrink-0">
                    <div className={`flex h-[72px] items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
                        {!isCollapsed && (
                            <Link href="/dashboard" className="flex items-center gap-2" aria-label="Zahirok AI home">
                                <span className="flex size-[32px] items-center justify-center rounded-full border border-saffron/25 bg-saffron/10 text-saffron shadow-[0_0_16px_rgba(227,122,44,0.12)]">
                                    <Music className="size-[17px]" aria-hidden={true} />
                                </span>
                                <span className="text-[1.1rem] font-extrabold uppercase leading-none tracking-[0.06em] text-white">
                                    Zahirok
                                </span>
                            </Link>
                        )}
                        {isCollapsed && (
                            <span className="flex size-[32px] items-center justify-center rounded-full border border-saffron/25 bg-saffron/10 text-saffron shadow-[0_0_16px_rgba(227,122,44,0.12)]">
                                <Music className="size-[17px]" aria-hidden={true} />
                            </span>
                        )}
                        <button
                            type="button"
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            aria-pressed={isCollapsed}
                            onClick={toggleCollapsed}
                            className={`inline-flex size-7 items-center justify-center rounded-full text-sand/45 transition hover:bg-white/[0.05] hover:text-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${
                                isCollapsed ? "absolute left-1/2 top-[52px] -translate-x-1/2" : ""
                            }`}
                        >
                            <ChevronLeft
                                className={`size-[17px] transition-transform ${isCollapsed ? "rotate-180" : ""}`}
                                aria-hidden={true}
                            />
                        </button>
                    </div>

                    <div className={`flex h-11 items-center gap-3 ${isCollapsed ? "mt-7 justify-center" : ""}`}>
                        <div className="size-10 shrink-0 rounded-full bg-[radial-gradient(circle_at_28%_28%,#ff4fb5_0%,#ff5533_42%,#6d5dfc_100%)] shadow-[0_0_18px_rgba(227,122,44,0.13)]" />
                        {!isCollapsed && (
                            <>
                                <div className="min-w-0">
                                    <p className="truncate text-[14px] font-bold leading-tight text-white">jaberb281</p>
                                    <p className="mt-0.5 text-[12.5px] font-semibold leading-tight text-sand/48">75 Credits</p>
                                </div>
                                <button
                                    type="button"
                                    aria-label="Open profile menu"
                                    className="ml-auto inline-flex size-7 items-center justify-center rounded-full text-sand/38 transition hover:bg-white/[0.05] hover:text-sand"
                                >
                                    <ChevronDown className="size-3.5" aria-hidden={true} />
                                </button>
                            </>
                        )}
                    </div>

                    {!isCollapsed && (
                        <Link
                            href="/pricing"
                            className="mb-3 mt-3 flex h-10 w-full items-center justify-center rounded-full border border-white/12 bg-transparent px-4 text-[14px] font-black text-white transition hover:border-saffron/35 hover:bg-saffron/8"
                        >
                            Upgrade to Pro
                        </Link>
                    )}
                </div>

                <nav
                    aria-label="Primary desktop navigation"
                    className={`flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                        isCollapsed ? "mt-6 items-center" : "pr-1"
                    }`}
                >
                    {MAIN_NAV_ITEMS.map((item) => (
                        <SidebarLink
                            key={`${item.label}-${item.href}`}
                            item={item}
                            active={isActivePath(pathname, item.href)}
                            collapsed={isCollapsed}
                        />
                    ))}
                </nav>

                <nav
                    aria-label="Secondary desktop navigation"
                    className={`mt-auto flex shrink-0 flex-col gap-0.5 pt-4 ${isCollapsed ? "items-center" : ""}`}
                >
                    {SECONDARY_NAV_ITEMS.map((item) => (
                        <SidebarLink
                            key={item.label}
                            item={item}
                            active={isActivePath(pathname, item.href)}
                            collapsed={isCollapsed}
                        />
                    ))}

                    <button
                        type="button"
                        aria-expanded={isPoliciesOpen}
                        aria-haspopup="menu"
                        aria-label={isCollapsed ? "Terms and policies" : undefined}
                        title={isCollapsed ? "Terms & Policies" : undefined}
                        onClick={openPoliciesMenu}
                        className={`group flex h-9 items-center gap-3 rounded-lg px-2 text-left text-[14px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${
                            isPoliciesActive ? "text-white" : "text-sand/48 hover:bg-white/[0.04] hover:text-sand/78"
                        } ${isCollapsed ? "w-11 justify-center" : "w-full"}`}
                    >
                        <BookOpen
                            className={`size-[18px] shrink-0 transition ${isPoliciesActive ? "text-white" : "text-sand/45 group-hover:text-sand/75"}`}
                            aria-hidden={true}
                        />
                        {!isCollapsed && <span>Terms & Policies</span>}
                    </button>

                    <button
                        type="button"
                        aria-expanded={isMoreOpen}
                        aria-haspopup="menu"
                        onClick={() => {
                            setIsMoreOpen((value) => !value)
                            setIsPoliciesOpen(false)
                        }}
                        className={`group flex h-9 items-center gap-3 rounded-lg px-2 text-left text-[14px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${
                            isMoreOpen ? "text-white" : "text-sand/48 hover:bg-white/[0.04] hover:text-sand/78"
                        } ${isCollapsed ? "w-11 justify-center" : "w-full"}`}
                    >
                        <MoreHorizontal
                            className={`size-[18px] shrink-0 transition ${isMoreOpen ? "text-white" : "text-sand/45 group-hover:text-sand/75"}`}
                            aria-hidden={true}
                        />
                        {!isCollapsed && <span>More</span>}
                    </button>
                </nav>

                {isPoliciesOpen && (
                    <div
                        role="menu"
                        aria-label="Terms and policies"
                        className={`absolute bottom-[104px] z-[130] w-[192px] rounded-lg border border-white/8 bg-[#242428] p-1 shadow-[0_20px_56px_rgba(0,0,0,0.42)] ${
                            isCollapsed ? "left-[68px]" : "left-[68px]"
                        }`}
                    >
                        <Link
                            href="/terms"
                            role="menuitem"
                            onClick={() => setIsPoliciesOpen(false)}
                            className="block rounded-md px-4 py-3 text-sm font-black text-sand/88 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-saffron"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/privacy"
                            role="menuitem"
                            onClick={() => setIsPoliciesOpen(false)}
                            className="block rounded-md px-4 py-3 text-sm font-black text-sand/88 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-saffron"
                        >
                            Privacy Policy
                        </Link>
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setIsPoliciesOpen(false)
                                setIsPrivacyModalOpen(true)
                            }}
                            className="block w-full rounded-md px-4 py-3 text-left text-sm font-black text-sand/88 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-saffron"
                        >
                            Your Privacy Choices
                        </button>
                    </div>
                )}

                {isMoreOpen && (
                    <div
                        role="menu"
                        aria-label="More navigation"
                        className={`absolute bottom-[104px] z-[120] max-h-[calc(100vh-128px)] w-[240px] overflow-y-auto rounded-lg border border-white/8 bg-[#242428] py-1 shadow-[0_20px_56px_rgba(0,0,0,0.42)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                            isCollapsed ? "left-[68px]" : "left-[68px]"
                        }`}
                    >
                        {/* MOCK: replace with real links/settings later */}
                        <div className="py-1">
                            {MORE_ITEMS.map((label) => (
                                <button
                                    key={label}
                                    type="button"
                                    role="menuitem"
                                    className="block h-12 w-full px-4 text-left text-sm font-black text-sand/88 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-saffron"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                            {SOCIAL_ITEMS.map((item) => {
                                return (
                                    <button
                                        key={item.label}
                                        type="button"
                                        aria-label={item.label}
                                        className="inline-flex size-7 items-center justify-center rounded-full text-sand/50 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
                                    >
                                        <span className="text-[10px] font-black" aria-hidden={true}>
                                            {item.text}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {isPrivacyModalOpen && (
                    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="privacy-preference-title"
                            className="flex max-h-[min(760px,calc(100vh-48px))] w-full max-w-[700px] flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#111113] text-sand shadow-[0_28px_90px_rgba(0,0,0,0.58)]"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                                <h2 id="privacy-preference-title" className="text-xl font-black text-white">
                                    Privacy Preference Center
                                </h2>
                                <button
                                    type="button"
                                    aria-label="Close privacy preference center"
                                    onClick={() => setIsPrivacyModalOpen(false)}
                                    className="inline-flex size-9 items-center justify-center rounded-full text-sand/60 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
                                >
                                    <X className="size-5" aria-hidden={true} />
                                </button>
                            </div>

                            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 text-sm leading-6 text-sand/68 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {/* MOCK: replace with real consent management before launch */}
                                <p>
                                    When you use Zahirok AI, we may use cookies and similar technologies to keep the app
                                    working, remember simple preferences, and understand how creators use the product.
                                    You can choose which optional categories are active below. These choices are mock
                                    preferences until real consent management is connected.
                                </p>

                                <h3 className="mt-7 text-base font-black text-white">Manage Consent Preferences</h3>

                                <div className="mt-4 overflow-hidden rounded-xl border border-white/12">
                                    <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4">
                                        <div>
                                            <p className="font-black text-white">Strictly Necessary Cookies</p>
                                            <p className="mt-1 text-xs text-sand/50">
                                                Required for security, routing, and core app behavior.
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-xs font-black uppercase tracking-[0.08em] text-sand/70">
                                            Always Active
                                        </span>
                                    </div>

                                    {CONSENT_OPTIONS.map((option) => (
                                        <ConsentPreferenceRow
                                            key={option.key}
                                            title={option.title}
                                            description={option.description}
                                            enabled={consentPreferences[option.key]}
                                            onToggle={() => toggleConsentPreference(option.key)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={rejectAllConsent}
                                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-6 text-sm font-black text-white transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
                                >
                                    Reject All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsPrivacyModalOpen(false)}
                                    className="inline-flex h-12 items-center justify-center rounded-full bg-saffron px-6 text-sm font-black text-charcoal transition hover:bg-saffron/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
                                >
                                    Confirm My Choices
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    )
}

function ConsentPreferenceRow({
    title,
    description,
    enabled,
    onToggle,
}: {
    title: string
    description: string
    enabled: boolean
    onToggle: () => void
}) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 last:border-b-0">
            <div className="min-w-0">
                <p className="font-black text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-sand/50">{description}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`${title}: ${enabled ? "enabled" : "disabled"}`}
                onClick={onToggle}
                className={`relative h-8 w-14 shrink-0 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${
                    enabled ? "bg-saffron" : "bg-white"
                }`}
            >
                <span
                    className={`absolute top-1 size-6 rounded-full bg-[#0d0d0e] transition ${
                        enabled ? "left-7" : "left-1"
                    }`}
                    aria-hidden={true}
                />
            </button>
        </div>
    )
}

function SidebarLink({
    item,
    active,
    collapsed,
}: {
    item: NavItem
    active: boolean
    collapsed: boolean
}) {
    const Icon = item.icon
    const className = `group flex h-9 items-center gap-3 rounded-lg px-2 text-[14px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${
        active ? "text-white" : "text-sand/48 hover:bg-white/[0.04] hover:text-sand/78"
    } ${collapsed ? "w-11 justify-center" : "w-full"}`

    if (item.isMock) {
        return (
            <a
                href={item.href}
                className={className}
                onClick={(event) => event.preventDefault()}
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
            >
                <Icon
                    className={`size-[18px] shrink-0 transition ${active ? "text-white" : "text-sand/45 group-hover:text-sand/75"}`}
                    aria-hidden={true}
                />
                {!collapsed && <span>{item.label}</span>}
            </a>
        )
    }

    return (
        <Link
            href={item.href}
            aria-current={active ? "page" : undefined}
            aria-label={collapsed ? item.label : undefined}
            title={collapsed ? item.label : undefined}
            className={className}
        >
            <Icon
                className={`size-[18px] shrink-0 transition ${active ? "text-white" : "text-sand/45 group-hover:text-sand/75"}`}
                aria-hidden={true}
            />
            {!collapsed && <span>{item.label}</span>}
        </Link>
    )
}

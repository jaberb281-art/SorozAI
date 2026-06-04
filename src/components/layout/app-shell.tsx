"use client"

import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { BottomPlayer } from "@/components/layout/bottom-player"
import { MobileTabBar } from "@/components/layout/mobile-tab-bar"

/** Routes where global music playback BottomPlayer should appear */
const PLAYER_ROUTES = [
    "/dashboard",
    "/create",
    "/library",
    "/feed",
    "/song/",
    "/notifications",
    "/labs",
    "/studio",
]

function shouldShowBottomPlayer(pathname: string): boolean {
    return PLAYER_ROUTES.some((route) =>
        route.endsWith("/") ? pathname.startsWith(route) : pathname === route,
    )
}

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isPublicRoute = pathname === "/" || pathname.startsWith("/auth/")

    if (isPublicRoute) {
        return <>{children}</>
    }

    const showPlayer = shouldShowBottomPlayer(pathname)
    const showMobileTabBar = pathname !== "/hooks"

    return (
        <div
            className="flex min-h-dvh overflow-x-hidden bg-charcoal"
            data-has-bottom-player={showPlayer ? "true" : "false"}
            data-has-mobile-tab-bar={showMobileTabBar ? "true" : "false"}
        >
            {/* Desktop sidebar */}
            <AppSidebar />

            {/* Main scrollable area; the shell owns fixed-nav safe-area spacing. */}
            <main className="flex min-h-dvh w-full min-w-0 flex-col pb-[var(--app-bottom-safe-area)] transition-[margin-left,padding-bottom] duration-200 lg:ml-[var(--app-sidebar-width,228px)] lg:w-auto lg:flex-1 lg:pb-[var(--app-desktop-bottom-safe-area)]">
                <div className="flex-1">
                    {children}
                </div>
            </main>

            {/* Persistent bottom player — only on music-playback routes */}
            {showPlayer && <BottomPlayer />}

            {/* Mobile tab bar */}
            {showMobileTabBar && <MobileTabBar />}
        </div>
    )
}

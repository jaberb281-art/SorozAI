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

    return (
        <div className="flex min-h-screen overflow-x-hidden bg-charcoal">
            {/* Desktop sidebar */}
            <AppSidebar />

            {/* Main scrollable area — offset by sidebar width */}
            <main className="flex min-h-screen w-full min-w-0 flex-col transition-[margin-left] duration-200 md:ml-[var(--app-sidebar-width,228px)] md:w-auto md:flex-1">
                {/* pb: with player = mobile 140px (player+tab) / desktop 80px; without = mobile 68px (tab only) / desktop 16px */}
                <div className={`flex-1 ${showPlayer ? "pb-[140px] md:pb-[80px]" : "pb-[68px] md:pb-4"}`}>
                    {children}
                </div>
            </main>

            {/* Persistent bottom player — only on music-playback routes */}
            {showPlayer && <BottomPlayer />}

            {/* Mobile tab bar */}
            <MobileTabBar />
        </div>
    )
}

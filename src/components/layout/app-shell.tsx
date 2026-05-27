"use client"

import { usePathname } from "next/navigation"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { BottomPlayer } from "@/components/layout/bottom-player"
import { MobileTabBar } from "@/components/layout/mobile-tab-bar"

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isPublicRoute = pathname === "/" || pathname.startsWith("/auth/")

    if (isPublicRoute) {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen overflow-x-hidden bg-charcoal">
            {/* Desktop sidebar */}
            <AppSidebar />

            {/* Main scrollable area
          md: offset by sidebar width (220px)
          always: pad bottom for player (72px) + mobile tab bar (56px) */}
            <main className="flex min-h-screen w-full min-w-0 flex-col md:ml-[220px] md:w-auto md:flex-1">
                {/* pb accounts for: mobile = player (72px) + tab bar (56px), desktop = player (72px) */}
                <div className="flex-1 pb-[140px] md:pb-[80px]">
                    {children}
                </div>
            </main>

            {/* Persistent bottom player — only renders when a song is loaded */}
            <BottomPlayer />

            {/* Mobile tab bar */}
            <MobileTabBar />
        </div>
    )
}

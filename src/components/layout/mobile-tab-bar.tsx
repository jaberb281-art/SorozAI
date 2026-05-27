"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Compass, PlusCircle, User } from "lucide-react"

const MOBILE_NAV = [
    { href: "/create", label: "Create", icon: PlusCircle },
    { href: "/library", label: "Library", icon: BookOpen },
    { href: "/feed", label: "Explore", icon: Compass },
    { href: "/account", label: "Account", icon: User },
] as const

export function MobileTabBar() {
    const pathname = usePathname()

    return (
        <nav aria-label="Primary mobile navigation" className="fixed bottom-0 left-0 right-0 z-[80] flex h-14 items-stretch border-t border-sand/8 bg-charcoal/96 backdrop-blur-2xl md:hidden">
            {MOBILE_NAV.map((item) => {
                const Icon = item.icon
                const isActive =
                    pathname === item.href ||
                    (item.href === "/library" && pathname.startsWith("/song/"))

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-black uppercase tracking-[0.14em] transition ${isActive ? "text-saffron" : "text-sand/45 hover:text-sand/70"
                            }`}
                    >
                        <Icon
                            className={`size-5 ${isActive ? "text-saffron" : "text-sand/40"}`}
                            aria-hidden="true"
                        />
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}

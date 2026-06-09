"use client"

import { useMemo, useState } from "react"

import {
    MOCK_SAVED_ITEMS,
    MOCK_STUDIO_ITEMS,
    StudioEmptyState,
    StudioHeader,
    StudioItemList,
    StudioStatsBar,
    StudioTabBar,
    StudioToolbar,
    filterItemsForStudio,
    type StudioItem,
    type StudioTab,
} from "@/components/library/studio-workspace"

export default function LibraryPage() {
    const [activeTab, setActiveTab] = useState<StudioTab>("all")
    const [query, setQuery] = useState("")
    const [studioItems, setStudioItems] = useState<StudioItem[]>(MOCK_STUDIO_ITEMS)
    const [savedItems] = useState<StudioItem[]>(MOCK_SAVED_ITEMS)
    const [notice, setNotice] = useState<string | null>(null)

    const visibleItems = useMemo(
        () => filterItemsForStudio(activeTab, query, studioItems, savedItems),
        [activeTab, query, savedItems, studioItems],
    )

    function handleTabChange(tab: StudioTab) {
        setActiveTab(tab)
        setQuery("")
    }

    function handleDelete(id: string) {
        setStudioItems((items) => items.filter((item) => item.id !== id))
    }

    function handleRename(id: string, title: string) {
        setStudioItems((items) =>
            items.map((item) => (item.id === id ? { ...item, title } : item)),
        )
    }

    function handleTogglePublic(id: string) {
        setStudioItems((items) =>
            items.map((item) =>
                item.id === id ? { ...item, isPublic: !item.isPublic } : item,
            ),
        )
        setNotice("Visibility updated.")
        window.setTimeout(() => setNotice(null), 2600)
    }

    function handleNotice(message: string) {
        setNotice(message)
        window.setTimeout(() => setNotice(null), 2600)
    }

    return (
        <div className="min-h-dvh w-full max-w-full min-w-0 overflow-x-hidden bg-[#101010] text-sand">
            <main className="min-h-dvh w-full max-w-full min-w-0 px-4 pb-6 pt-6 md:px-6 lg:pb-8 xl:px-8">
                <StudioHeader />

                {notice ? (
                    <p
                        role="status"
                        className="mt-4 inline-flex max-w-full rounded-full border border-saffron/25 bg-saffron/10 px-3 py-1.5 text-xs font-bold text-saffron"
                    >
                        {notice}
                    </p>
                ) : null}

                <StudioTabBar activeTab={activeTab} onTabChange={handleTabChange} />
                <StudioStatsBar items={studioItems} />
                <StudioToolbar query={query} setQuery={setQuery} />

                <section
                    id={`studio-panel-${activeTab}`}
                    role="tabpanel"
                    aria-labelledby={`studio-tab-${activeTab}`}
                >
                    {visibleItems.length === 0 ? (
                        <div className="mt-5">
                            <StudioEmptyState tab={activeTab} />
                        </div>
                    ) : (
                        <StudioItemList
                            items={visibleItems}
                            onDelete={handleDelete}
                            onNotice={handleNotice}
                            onRename={handleRename}
                            onTogglePublic={handleTogglePublic}
                        />
                    )}
                </section>
            </main>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Settings } from "lucide-react"

type NotificationTab = "Notifications" | "Activity"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationTab>("Notifications")
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090909] text-sand">
      <section className="min-h-screen w-full border-white/10 bg-[#121214] pb-[160px] md:max-w-[600px] md:border-r md:pb-[96px] lg:max-w-[640px]">
        <div className="grid h-[70px] grid-cols-[1fr_1fr_62px] border-b border-white/12">
          {(["Notifications", "Activity"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => {
                setActiveTab(tab)
                setShowSettings(false)
              }}
              className={`relative flex items-center justify-center text-lg font-black transition ${
                activeTab === tab ? "text-white" : "text-sand/58 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          ))}

          <button
            type="button"
            aria-label="Notification settings"
            aria-expanded={showSettings}
            onClick={() => setShowSettings((value) => !value)}
            className={`flex items-center justify-center text-sand/62 transition hover:bg-white/[0.04] hover:text-white ${
              showSettings ? "text-white" : ""
            }`}
          >
            <Settings className="size-5" aria-hidden={true} />
          </button>
        </div>

        {showSettings ? (
          <div className="border-b border-white/10 bg-white/[0.035] px-6 py-5">
            {/* MOCK: replace with real notification settings later */}
            <p className="text-sm font-black text-white">Notification settings</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-sand/55">
              Email, push, and community activity preferences will be managed here.
            </p>
          </div>
        ) : null}

        <div className="px-6 pt-8 text-center">
          {activeTab === "Notifications" ? (
            <EmptyState
              title="No notifications here yet"
              description="Updates about your Zahirok songs, follows, and community activity will appear here."
            />
          ) : (
            <EmptyState
              title="No activity yet"
              description="Likes, plays, remixes, and comments will appear here."
            />
          )}
        </div>
      </section>
    </div>
  )
}

function EmptyState({
  description,
  title,
}: {
  description: string
  title: string
}) {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      <p className="mx-auto mt-3 max-w-xs text-sm font-semibold leading-6 text-sand/45">
        {description}
      </p>
    </div>
  )
}

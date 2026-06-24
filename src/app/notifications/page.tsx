"use client"

import { useEffect, useState } from "react"
import { BellRing, Settings, SlidersHorizontal, X } from "lucide-react"

type NotificationTab = "Notifications" | "Activity"
type NotificationSettingKey =
  | "notifications"
  | "announcements"
  | "postReactions"
  | "followingPosts"
  | "newFollowers"
  | "comments"
  | "mentions"
  | "songReady"
  | "credits"

const INTERACTION_SETTINGS = [
  {
    key: "announcements",
    title: "Announcements",
    description: "New Soroz features, creator updates, and remix events",
  },
  {
    key: "postReactions",
    title: "Likes and plays on your songs",
  },
  {
    key: "followingPosts",
    title: "New songs from people you follow",
  },
  {
    key: "newFollowers",
    title: "New followers",
  },
  {
    key: "comments",
    title: "Comments on your songs",
  },
  {
    key: "mentions",
    title: "Mentions",
  },
] satisfies Array<{
  key: NotificationSettingKey
  title: string
  description?: string
}>

const CREATION_SETTINGS = [
  {
    key: "songReady",
    title: "Song generation complete",
    description: "Know when a Soroz track is ready to review",
  },
  {
    key: "credits",
    title: "Credits and plan alerts",
    description: "Low-credit reminders and account notices",
  },
] satisfies Array<{
  key: NotificationSettingKey
  title: string
  description?: string
}>

const DEFAULT_NOTIFICATION_SETTINGS: Record<NotificationSettingKey, boolean> = {
  notifications: true,
  announcements: true,
  postReactions: true,
  followingPosts: true,
  newFollowers: true,
  comments: true,
  mentions: true,
  songReady: true,
  credits: false,
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationTab>("Notifications")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settings, setSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS)

  useEffect(() => {
    if (!isSettingsOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener("keydown", closeOnEscape)

    return () => {
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [isSettingsOpen])

  function toggleSetting(key: NotificationSettingKey) {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090909] text-sand">
      <section className="min-h-screen w-full border-white/10 bg-[#121214] pb-6 md:max-w-[600px] md:border-r md:pb-8 lg:max-w-[640px]">
        <div className="grid h-[70px] grid-cols-[1fr_1fr_62px] border-b border-white/12">
          {(["Notifications", "Activity"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => {
                setActiveTab(tab)
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
            aria-label="Open notification settings"
            aria-expanded={isSettingsOpen}
            onClick={() => setIsSettingsOpen(true)}
            className={`flex items-center justify-center text-sand/62 transition hover:bg-white/[0.04] hover:text-white ${
              isSettingsOpen ? "text-white" : ""
            }`}
          >
            <Settings className="size-5" aria-hidden={true} />
          </button>
        </div>

        <div className="px-6 pt-8 text-center">
          {activeTab === "Notifications" ? (
            <EmptyState
              title="No notifications here yet"
              description="Updates about your Soroz songs, follows, and community activity will appear here."
            />
          ) : (
            <EmptyState
              title="No activity yet"
              description="Likes, plays, remixes, and comments will appear here."
            />
          )}
        </div>
      </section>

      {isSettingsOpen ? (
        <NotificationSettingsModal
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onToggle={toggleSetting}
        />
      ) : null}
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

function NotificationSettingsModal({
  onClose,
  onToggle,
  settings,
}: {
  onClose: () => void
  onToggle: (key: NotificationSettingKey) => void
  settings: Record<NotificationSettingKey, boolean>
}) {
  return (
    <div
      className="fixed inset-0 z-[170] flex items-start justify-center overflow-y-auto bg-black/74 px-4 py-5 backdrop-blur-sm sm:px-6 md:items-center md:py-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-settings-title"
        className="relative flex max-h-[calc(100dvh-40px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[2rem] border border-sand/10 bg-[#1d1d20] text-sand shadow-[0_32px_110px_rgba(0,0,0,0.68)] md:max-h-[min(820px,calc(100dvh-56px))]"
      >
        <div className="flex shrink-0 items-start justify-between gap-5 px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-saffron">
              <BellRing className="size-4" aria-hidden={true} />
              Soroz alerts
            </p>
            <h2
              id="notification-settings-title"
              className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl"
            >
              Notification Settings
            </h2>
          </div>

          <button
            type="button"
            aria-label="Close notification settings"
            onClick={onClose}
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-sand/8 text-sand/72 transition hover:bg-sand/12 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron sm:size-14"
          >
            <X className="size-6" aria-hidden={true} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 sm:px-8 sm:pb-8 [scrollbar-color:rgba(237,227,211,0.45)_transparent]">
          <div className="rounded-[1.35rem] border border-sand/8 bg-sand/8 p-4 sm:p-5">
            <SettingRow
              title="Notifications"
              description="Master control for product, creator, and community alerts."
              enabled={settings.notifications}
              icon={<SlidersHorizontal className="size-5" aria-hidden={true} />}
              prominent
              onToggle={() => onToggle("notifications")}
            />
          </div>

          <SettingsGroup title="Interactions">
            {INTERACTION_SETTINGS.map((setting) => (
              <SettingRow
                key={setting.key}
                title={setting.title}
                description={setting.description}
                enabled={settings[setting.key]}
                disabled={!settings.notifications}
                onToggle={() => onToggle(setting.key)}
              />
            ))}
          </SettingsGroup>

          <SettingsGroup title="Creation">
            {CREATION_SETTINGS.map((setting) => (
              <SettingRow
                key={setting.key}
                title={setting.title}
                description={setting.description}
                enabled={settings[setting.key]}
                disabled={!settings.notifications}
                onToggle={() => onToggle(setting.key)}
              />
            ))}
          </SettingsGroup>

          <p className="px-1 pt-4 text-xs font-semibold leading-5 text-sand/42">
            These preferences are a frontend preview only and will be wired to
            account settings when notification services are connected.
          </p>
        </div>
      </section>
    </div>
  )
}

function SettingsGroup({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section className="mt-6">
      <h3 className="px-1 text-lg font-black text-white">{title}</h3>
      <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-sand/8 bg-sand/8 px-4 sm:px-5">
        {children}
      </div>
    </section>
  )
}

function SettingRow({
  description,
  disabled = false,
  enabled,
  icon,
  onToggle,
  prominent = false,
  title,
}: {
  description?: string
  disabled?: boolean
  enabled: boolean
  icon?: React.ReactNode
  onToggle: () => void
  prominent?: boolean
  title: string
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b border-sand/8 py-5 last:border-b-0 ${
        disabled ? "opacity-45" : ""
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="mt-0.5 hidden size-9 shrink-0 items-center justify-center rounded-full bg-saffron/12 text-saffron sm:flex">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <p
            className={`font-black leading-snug text-white ${
              prominent ? "text-lg" : "text-base"
            }`}
          >
            {title}
          </p>
          {description ? (
            <p className="mt-1 max-w-[32rem] text-sm font-semibold leading-5 text-sand/58">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${title}: ${enabled ? "enabled" : "disabled"}`}
        disabled={disabled}
        onClick={onToggle}
        className={`relative h-8 w-14 shrink-0 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron ${
          enabled
            ? "bg-saffron shadow-[0_0_24px_rgba(227,122,44,0.28)]"
            : "bg-sand/24"
        } ${disabled ? "cursor-not-allowed" : "hover:brightness-110"}`}
      >
        <span
          className={`absolute top-1 size-6 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.24)] transition ${
            enabled ? "left-7" : "left-1"
          }`}
          aria-hidden={true}
        />
      </button>
    </div>
  )
}

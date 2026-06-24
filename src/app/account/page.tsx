import Link from "next/link"
import {
  BadgeDollarSign,
  CreditCard,
  Crown,
  Globe2,
  Mail,
  MapPin,
  Music,
  ShieldAlert,
  Sparkles,
  UserRound,
} from "lucide-react"

import { AccountActions, DeleteAccountButton, PlanUpgradeButton, UpgradeButton } from "@/components/account/account-actions"
import { getAccount } from "@/lib/api-client"

const plans = [
  {
    name: "Free",
    price: "Current",
    details: ["5 songs/mo", "30 seconds", "Watermark", "MP3 only"],
    action: "Current Plan",
    current: true,
  },
  {
    name: "Basic",
    price: "$3/mo",
    details: ["30 songs/mo", "90 seconds", "No watermark", "MP3 + WAV"],
    action: "Upgrade",
    current: false,
  },
  {
    name: "Pro",
    price: "$7/mo",
    details: ["100 songs/mo", "4 minutes", "HD", "Voice cloning", "Stems"],
    action: "Upgrade",
    current: false,
  },
]

export default async function AccountPage() {
  const account = await getAccount()
  const creditsUsed = account.creditsLimit - account.creditsRemaining
  const creditsPercent = Math.round((creditsUsed / account.creditsLimit) * 100)
  const memberSince = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(account.createdAt))
  const planName = account.tier.charAt(0).toUpperCase() + account.tier.slice(1)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-charcoal text-sand">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_14%,rgba(227,122,44,0.22),transparent_29%),radial-gradient(circle_at_16%_24%,rgba(183,62,31,0.2),transparent_27%),radial-gradient(circle_at_84%_18%,rgba(26,58,92,0.82),transparent_35%),linear-gradient(135deg,var(--charcoal)_0%,var(--deep-indigo)_44%,var(--charcoal)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(237,227,211,0.45)_1px,transparent_1px),linear-gradient(rgba(237,227,211,0.35)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-charcoal/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-charcoal to-transparent" />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-8 pt-8 md:px-6 md:pb-10 md:pt-10 xl:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-saffron shadow-[0_0_28px_rgba(227,122,44,0.16)]">
              <UserRound className="size-4" aria-hidden="true" />
              SOROZ ACCOUNT
            </p>
            <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight text-sand sm:text-4xl md:text-5xl">
              Account & Billing
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-sand/72 md:text-base md:leading-7">
              Manage your profile, plan, credits, and billing settings.
            </p>
          </div>

          <Link
            href="/create#composer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron px-5 py-3 text-sm font-black text-sand shadow-[0_16px_40px_rgba(227,122,44,0.26)] transition hover:bg-terracotta sm:w-auto"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Create Song
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.85fr)]">
          <AccountPanel>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-full border border-saffron/30 bg-saffron/15 text-saffron shadow-[0_0_24px_rgba(227,122,44,0.2)]">
                  <Music className="size-7" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-2xl font-black text-sand">
                    {account.name}
                  </h2>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-sand/64">
                    <Mail className="size-4 text-saffron" aria-hidden="true" />
                    {account.email}
                  </p>
                </div>
              </div>

              <AccountActions />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoTile icon={<MapPin className="size-4" aria-hidden="true" />} label="Country" value={account.country} />
              <InfoTile icon={<Globe2 className="size-4" aria-hidden="true" />} label="Member since" value={memberSince} />
            </div>
          </AccountPanel>

          <AccountPanel>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-saffron">
                  Current plan
                </p>
                <h2 className="mt-2 text-3xl font-black text-sand">{planName}</h2>
              </div>
              <span className="rounded-full border border-sand/12 bg-sand/8 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-sand/70">
                {creditsUsed} / {account.creditsLimit} used
              </span>
            </div>

            <div className="mt-5 grid gap-2 text-sm font-semibold text-sand/72">
              <PlanMetric label="Monthly songs" value={account.creditsLimit.toString()} />
              <PlanMetric label="Max duration" value="30 seconds" />
              <PlanMetric label="Watermark" value="Yes" />
              <PlanMetric label="Format" value="MP3 only" />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.18em] text-sand/50">
                <span>Credits used</span>
                <span>{account.creditsRemaining} remaining</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-sand/10">
                <div
                  className="h-full rounded-full bg-saffron shadow-[0_0_24px_rgba(227,122,44,0.28)]"
                  role="progressbar"
                  aria-label="Credits used"
                  aria-valuemin={0}
                  aria-valuemax={account.creditsLimit}
                  aria-valuenow={creditsUsed}
                  aria-valuetext={`${creditsUsed} of ${account.creditsLimit} credits used`}
                  style={{ width: `${creditsPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <UpgradeButton />
              <Link
                href="/pricing"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-sand/15 px-4 text-sm font-bold text-sand transition hover:bg-sand/10"
              >
                View pricing
              </Link>
            </div>
          </AccountPanel>
        </div>

        <section className="mt-4">
          <div className="mb-4 flex items-center gap-3">
            <Crown className="size-5 text-saffron" aria-hidden="true" />
            <h2 className="text-2xl font-black text-sand">Upgrade options</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.name} {...plan} />
            ))}
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <AccountPanel>
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-saffron" aria-hidden="true" />
              <h2 className="text-2xl font-black text-sand">Billing</h2>
            </div>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-sand/72">
              <PlanMetric label="Payment methods" value="Not connected yet" />
              <PlanMetric label="Billing history" value="No invoices yet" />
            </div>
            <button
              type="button"
              disabled
              className="mt-6 inline-flex h-11 w-full cursor-not-allowed items-center justify-center rounded-full border border-sand/10 bg-sand/5 px-4 text-sm font-bold text-sand/42"
            >
              Manage billing - Coming soon
            </button>
          </AccountPanel>

          <section className="rounded-[1.5rem] border border-terracotta/25 bg-terracotta/8 p-2.5 shadow-[0_18px_48px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
            <div className="rounded-[1.15rem] border border-terracotta/15 bg-charcoal/50 p-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="size-5 text-terracotta" aria-hidden="true" />
                <h2 className="text-2xl font-black text-sand">Danger zone</h2>
              </div>
              <h3 className="mt-5 text-lg font-black text-sand">Delete account</h3>
              <p className="mt-2 text-sm leading-6 text-sand/68">
                This will permanently remove your account and songs when backend
                is connected.
              </p>
              <div className="mt-6">
                <DeleteAccountButton />
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

function AccountPanel({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-sand/15 bg-sand/10 p-2.5 shadow-[0_18px_52px_rgba(0,0,0,0.26)] backdrop-blur-2xl">
      <div className="h-full rounded-[1.15rem] border border-sand/10 bg-charcoal/50 p-4">
        {children}
      </div>
    </section>
  )
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-sand/10 bg-sand/7 p-4">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-sand/45">
        <span className="text-saffron">{icon}</span>
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-sand">{value}</p>
    </div>
  )
}

function PlanMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-sand/10 bg-sand/7 px-4 py-3">
      <span>{label}</span>
      <span className="font-black text-sand">{value}</span>
    </div>
  )
}

function PlanCard({
  action,
  current,
  details,
  name,
  price,
}: {
  action: string
  current: boolean
  details: string[]
  name: string
  price: string
}) {
  return (
    <article
      className={`rounded-[1.5rem] border p-2.5 shadow-[0_18px_52px_rgba(0,0,0,0.22)] backdrop-blur-2xl ${
        current
          ? "border-saffron/35 bg-saffron/12"
          : "border-sand/15 bg-sand/10"
      }`}
    >
      <div className="h-full rounded-[1.15rem] border border-sand/10 bg-charcoal/50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-sand">{name}</h3>
            <p className="mt-2 text-sm font-black text-saffron">{price}</p>
          </div>
          <BadgeDollarSign className="size-5 text-saffron" aria-hidden="true" />
        </div>
        <ul className="mt-5 grid gap-2 text-sm font-semibold text-sand/72">
          {details.map((detail) => (
            <li key={detail} className="rounded-xl bg-sand/7 px-3 py-2">
              {detail}
            </li>
          ))}
        </ul>
        {current ? (
          <button
            type="button"
            disabled
            aria-label={`${action} for ${name} plan`}
            className="mt-5 inline-flex h-11 w-full cursor-default items-center justify-center rounded-full border border-sand/10 bg-sand/7 px-4 text-sm font-black text-sand/52"
          >
            {action}
          </button>
        ) : (
          <PlanUpgradeButton planName={name} />
        )}
      </div>
    </article>
  )
}

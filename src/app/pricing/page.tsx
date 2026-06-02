"use client"

import { Fragment, useMemo, useState } from "react"
import {
  Check,
  ChevronDown,
  CircleDollarSign,
  Lock,
  Search,
} from "lucide-react"

type BillingCycle = "monthly" | "annual"
type PlanName = "Free Plan" | "Basic Plan" | "Pro Plan"

interface Plan {
  name: PlanName
  badge?: string
  description: string
  monthlyPrice: number
  button: string
  current?: boolean
  features: string[]
  highlighted?: boolean
}

interface FaqItem {
  question: string
  answer: string
}

interface CompareRow {
  feature: string
  free: string | boolean
  basic: string | boolean
  pro: string | boolean
}

interface CompareGroup {
  title: string
  rows: CompareRow[]
}

const CURRENCIES = ["USD", "EUR", "GBP", "AUD", "PKR"] as const

const PLANS: Plan[] = [
  {
    name: "Free Plan",
    description: "Start exploring Balochi song ideas without a card.",
    monthlyPrice: 0,
    button: "Current Plan",
    current: true,
    features: [
      "5 short songs/month",
      "Watermark",
      "Makkuran dialect",
      "MP3 only",
    ],
  },
  {
    name: "Basic Plan",
    badge: "Popular",
    description: "For creators making cleaner demos and private drafts.",
    monthlyPrice: 3,
    button: "Subscribe",
    highlighted: true,
    features: [
      "30 songs/month",
      "No watermark",
      "MP3 + WAV",
      "Private library",
      "Community feed publishing",
    ],
  },
  {
    name: "Pro Plan",
    badge: "Best Value",
    description: "For serious releases, longer tracks, and priority creation.",
    monthlyPrice: 7,
    button: "Subscribe",
    highlighted: true,
    features: [
      "100 songs/month",
      "Priority queue",
      "Longer songs",
      "Stems/download options mock",
      "Commercial use mock",
      "Voice features coming soon",
    ],
  },
]

const FAQS: FaqItem[] = [
  {
    question: "What are the differences between plans?",
    answer:
      "Free is for trying short Makkuran songs. Basic adds more monthly songs, no watermark, WAV downloads, private library features, and community publishing. Pro adds priority queue, longer songs, advanced download options, and commercial-use mock rights.",
  },
  {
    question: "Do I get commercial use rights?",
    answer:
      "Commercial use is represented as a Pro mock feature in this frontend preview. Final terms will be added when checkout and licensing are connected.",
  },
  {
    question: "What happens if I exhaust my monthly credits?",
    answer:
      "You can wait for the next monthly reset. Purchased add-on credits are planned for later and will be connected after billing support ships.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "This page is frontend-only, but the intended billing flow will support plan changes from account settings once payments are integrated.",
  },
  {
    question: "When will voice features launch?",
    answer:
      "Voice features are planned after the Makkuran MVP is stable. Voice of Balochistan contribution tools will arrive before broader featured voice models.",
  },
]

const COMPARE_GROUPS: CompareGroup[] = [
  {
    title: "Song Generation",
    rows: [
      { feature: "Monthly songs", free: "5", basic: "30", pro: "100" },
      { feature: "Max duration", free: "Short", basic: "Standard", pro: "Longer songs" },
      { feature: "Watermark", free: "Included", basic: "No watermark", pro: "No watermark" },
      { feature: "Available dialect", free: "Makkuran", basic: "Makkuran", pro: "Makkuran" },
      { feature: "Download format", free: "MP3", basic: "MP3 + WAV", pro: "MP3 + WAV + mock stems" },
    ],
  },
  {
    title: "Creation Features",
    rows: [
      { feature: "Prompt to song", free: true, basic: true, pro: true },
      { feature: "Custom lyrics", free: true, basic: true, pro: true },
      { feature: "Instrumental mode", free: true, basic: true, pro: true },
      { feature: "Makkuran folk style", free: true, basic: true, pro: true },
      { feature: "Community publishing", free: false, basic: true, pro: true },
      { feature: "Priority queue", free: false, basic: false, pro: true },
    ],
  },
  {
    title: "Voice / Advanced",
    rows: [
      { feature: "Voice of Balochistan contribution", free: true, basic: true, pro: true },
      { feature: "Featured voice models", free: false, basic: false, pro: "Coming soon" },
      { feature: "Stem downloads", free: false, basic: false, pro: true },
      { feature: "Commercial use", free: false, basic: false, pro: "Mock included" },
    ],
  },
]

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly")
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("USD")
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [currencyQuery, setCurrencyQuery] = useState("")
  const [openFaq, setOpenFaq] = useState<string>(FAQS[0].question)
  const [subscribeNote, setSubscribeNote] = useState("")

  const currencies = useMemo(() => {
    const q = currencyQuery.trim().toLowerCase()
    if (!q) return CURRENCIES
    return CURRENCIES.filter((item) => item.toLowerCase().includes(q))
  }, [currencyQuery])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#101010] text-sand">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(227,122,44,0.36),transparent_32%),radial-gradient(circle_at_84%_8%,rgba(186,130,32,0.34),transparent_28%),linear-gradient(180deg,rgba(116,45,31,0.72)_0%,rgba(38,18,18,0.55)_42%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-[0.1] [background-image:radial-gradient(rgba(237,227,211,0.5)_1px,transparent_1px)] [background-size:7px_7px]" />

      <main className="relative z-10 px-5 pb-[170px] pt-8 md:px-8 md:pb-[112px] xl:px-12">
        <CurrencySelector
          currency={currency}
          currencyQuery={currencyQuery}
          currencies={currencies}
          isOpen={isCurrencyOpen}
          onQueryChange={setCurrencyQuery}
          onSelect={(value) => {
            setCurrency(value)
            setIsCurrencyOpen(false)
            setCurrencyQuery("")
          }}
          onToggle={() => setIsCurrencyOpen((value) => !value)}
        />

        <section className="mx-auto max-w-4xl pt-24 text-center">
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            Manage your Zahirok plan
          </h1>
          <p className="mt-5 text-base font-semibold text-sand/78">
            Select the plan that best fits your creative needs.
          </p>

          <BillingToggle billing={billing} onChange={setBilling} />
        </section>

        <section className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.name}
              billing={billing}
              currency={currency}
              plan={plan}
              onSubscribe={() => setSubscribeNote("Payments are not connected yet.")}
            />
          ))}
        </section>

        {subscribeNote && (
          <p role="status" className="mx-auto mt-6 max-w-md rounded-xl border border-saffron/25 bg-saffron/10 px-5 py-3 text-center text-sm font-semibold text-saffron">
            {subscribeNote}
          </p>
        )}

        <p className="mx-auto mt-9 max-w-3xl text-center text-sm leading-6 text-sand/70">
          Credits included in subscriptions do not carry over month to month.
          Purchased add-on credits will be supported later.
        </p>

        <FaqSection openFaq={openFaq} onToggle={setOpenFaq} />

        <CompareSection />
      </main>
    </div>
  )
}

function CurrencySelector({
  currency,
  currencyQuery,
  currencies,
  isOpen,
  onQueryChange,
  onSelect,
  onToggle,
}: {
  currency: (typeof CURRENCIES)[number]
  currencyQuery: string
  currencies: readonly (typeof CURRENCIES)[number][]
  isOpen: boolean
  onQueryChange: (value: string) => void
  onSelect: (value: (typeof CURRENCIES)[number]) => void
  onToggle: () => void
}) {
  return (
    <div className="absolute right-5 top-8 z-20 md:right-8 xl:right-12">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={onToggle}
        className="inline-flex h-14 items-center gap-3 rounded-full bg-saffron/26 px-6 text-base font-black text-white transition hover:bg-saffron/34"
      >
        <CircleDollarSign className="size-4" aria-hidden={true} />
        {currency}
        <ChevronDown
          className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden={true}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Choose currency"
          className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-saffron/24 bg-[#332b1c]/95 shadow-[0_18px_48px_rgba(0,0,0,0.35)]"
        >
          {/* MOCK: replace with real currency/local pricing later */}
          <label className="relative block border-b border-sand/10">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-sand/60"
              aria-hidden={true}
            />
            <input
              value={currencyQuery}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search"
              className="h-11 w-full bg-transparent pl-9 pr-3 text-sm font-semibold text-sand outline-none placeholder:text-sand/45"
            />
          </label>
          {currencies.map((item) => (
            <button
              key={item}
              type="button"
              role="option"
              aria-selected={item === currency}
              onClick={() => onSelect(item)}
              className={`flex h-12 w-full items-center gap-3 px-5 text-left text-sm font-black transition ${
                item === currency
                  ? "bg-sand/82 text-[#171717]"
                  : "text-sand hover:bg-sand/10"
              }`}
            >
              <CircleDollarSign className="size-4" aria-hidden={true} />
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function BillingToggle({
  billing,
  onChange,
}: {
  billing: BillingCycle
  onChange: (value: BillingCycle) => void
}) {
  return (
    <div className="mt-9 inline-flex items-center gap-4 rounded-full bg-black/10 px-2 py-1">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-bold ${
          billing === "monthly" ? "text-white" : "text-sand/56"
        }`}
      >
        <span
          className={`size-5 rounded-full border ${
            billing === "monthly" ? "border-saffron bg-saffron" : "border-sand/28"
          }`}
        />
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-base font-bold ${
          billing === "annual" ? "text-white" : "text-sand/56"
        }`}
      >
        <span
          className={`flex size-5 items-center justify-center rounded-full border ${
            billing === "annual" ? "border-saffron bg-saffron" : "border-sand/28"
          }`}
        >
          {billing === "annual" && (
            <Check className="size-3 text-[#171717]" aria-hidden={true} />
          )}
        </span>
        Annual
        <span className="rounded-full bg-saffron px-2 py-1 text-[11px] font-black text-white">
          SAVE 20%
        </span>
      </button>
    </div>
  )
}

function PricingCard({
  billing,
  currency,
  plan,
  onSubscribe,
}: {
  billing: BillingCycle
  currency: string
  plan: Plan
  onSubscribe: () => void
}) {
  const monthlyPrice =
    billing === "annual" ? Math.round(plan.monthlyPrice * 0.8 * 100) / 100 : plan.monthlyPrice
  const price = plan.monthlyPrice === 0 ? 0 : monthlyPrice

  return (
    <article
      className={`relative flex min-h-[540px] flex-col rounded-[1.65rem] border p-7 shadow-[0_24px_72px_rgba(0,0,0,0.28)] backdrop-blur-xl ${
        plan.highlighted
          ? "border-saffron/50 bg-white/[0.065]"
          : "border-white/12 bg-white/[0.055]"
      }`}
    >
      {plan.badge && (
        <span className="absolute right-7 top-9 rounded-full bg-saffron px-3 py-1 text-xs font-black uppercase text-white">
          {plan.badge}
        </span>
      )}

      <h2 className="text-3xl font-black text-white">{plan.name}</h2>
      <p className="mt-3 min-h-12 text-sm font-semibold leading-6 text-sand/66">
        {plan.description}
      </p>

      <div className="mt-7">
        <span className="text-3xl font-black text-white">
          {currency === "USD" ? "$" : currency} {price}
        </span>
        <span className="ml-1 text-base font-semibold text-sand/64">/month</span>
        {billing === "annual" && plan.monthlyPrice > 0 && (
          <p className="mt-2 text-sm font-semibold text-saffron/82">
            Annual billing shown with 20% savings.
          </p>
        )}
      </div>

      {/* MOCK: replace with checkout/payment integration later */}
      <button
        type="button"
        disabled={plan.current}
        onClick={plan.current ? undefined : onSubscribe}
        className={`mt-9 h-16 rounded-full text-lg font-black transition ${
          plan.current
            ? "cursor-default bg-black/16 text-sand/36"
            : plan.highlighted
              ? "bg-sand text-[#141414] hover:bg-white"
              : "bg-black/18 text-white hover:bg-white/[0.08]"
        }`}
      >
        {plan.button}
      </button>

      <ul className="mt-10 grid gap-4 text-base font-semibold text-white">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-400">
              <Check className="size-3.5" aria-hidden={true} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function FaqSection({
  openFaq,
  onToggle,
}: {
  openFaq: string
  onToggle: (question: string) => void
}) {
  return (
    <section className="mx-auto mt-28 max-w-5xl">
      <div className="text-center">
        <h2 className="text-4xl font-black text-white">FAQs</h2>
        <p className="mt-2 text-base font-semibold text-sand/78">
          You've got questions. We've got answers.
        </p>
      </div>

      <div className="mt-10">
        {FAQS.map((faq) => {
          const open = openFaq === faq.question
          return (
            <article key={faq.question} className="border-b border-white/8">
              <button
                type="button"
                onClick={() => onToggle(open ? "" : faq.question)}
                aria-expanded={open}
                className={`flex w-full items-center justify-between gap-4 px-5 py-7 text-left text-xl font-black text-white transition ${
                  open ? "bg-white/[0.045]" : "hover:bg-white/[0.025]"
                }`}
              >
                {faq.question}
                <ChevronDown
                  className={`size-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                  aria-hidden={true}
                />
              </button>
              {open && (
                <p className="px-5 pb-7 text-base font-semibold leading-7 text-sand/70">
                  {faq.answer}
                </p>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

function CompareSection() {
  return (
    <section className="mt-28">
      <h2 className="text-center text-4xl font-black text-white">
        Compare Zahirok plans
      </h2>

      <div className="mt-10 overflow-x-auto">
        <table className="min-w-[980px] w-full border-collapse border border-white/10 text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="w-1/4 p-6 text-sm font-black uppercase tracking-[0.16em] text-sand/55">
                Feature
              </th>
              {PLANS.map((plan) => (
                <th key={plan.name} className="border-l border-white/10 p-6 text-center">
                  <span className="text-2xl font-black text-white">{plan.name}</span>
                  {plan.badge && (
                    <span className="ml-2 rounded-full bg-white/[0.1] px-2 py-1 text-[10px] font-black uppercase text-sand/78">
                      {plan.badge}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_GROUPS.map((group) => (
              <Fragment key={group.title}>
                <tr className="bg-white/[0.055]">
                  <td
                    colSpan={4}
                    className="px-6 py-5 text-sm font-black uppercase tracking-[0.12em] text-sand/72"
                  >
                    {group.title}
                  </td>
                </tr>
                {group.rows.map((row) => (
                  <tr key={`${group.title}-${row.feature}`} className="border-t border-white/10">
                    <td className="px-6 py-5 text-base font-black text-white">
                      {row.feature}
                    </td>
                    <CompareCell value={row.free} />
                    <CompareCell value={row.basic} />
                    <CompareCell value={row.pro} />
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function CompareCell({ value }: { value: string | boolean }) {
  return (
    <td className="border-l border-white/10 px-6 py-5 text-center text-base font-semibold text-sand/84">
      {value === true ? (
        <Check className="mx-auto size-5 text-lime-500" aria-hidden={true} />
      ) : value === false ? (
        <Lock className="mx-auto size-5 text-sand/45" aria-hidden={true} />
      ) : (
        value
      )}
    </td>
  )
}

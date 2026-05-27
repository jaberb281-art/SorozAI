"use client"

import { useState } from "react"
import Link from "next/link"
import { LockKeyhole, Mail, Phone, Sparkles, UserRound } from "lucide-react"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthShell } from "@/components/auth/auth-shell"

export default function SignUpPage() {
  const [message, setMessage] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage("Signup backend will be connected later.")
  }

  return (
    <AuthShell>
      <AuthCard
        title="Create your account"
        subtitle="Start building Balochi songs, lyrics, and sound ideas with AI."
      >
        <form onSubmit={handleSubmit} className="mt-5 grid gap-3.5">
          <AuthField
            icon={<UserRound className="size-4" aria-hidden="true" />}
            label="Full name"
            name="name"
            placeholder="Your name"
            type="text"
          />
          <AuthField
            icon={<Mail className="size-4" aria-hidden="true" />}
            label="Email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
          <AuthField
            icon={<LockKeyhole className="size-4" aria-hidden="true" />}
            label="Password"
            name="password"
            placeholder="Create a password"
            type="password"
          />

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-full bg-saffron px-5 text-sm font-black text-sand shadow-[0_16px_40px_rgba(227,122,44,0.25)] transition hover:bg-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            Create account
          </button>

          <button
            type="button"
            onClick={() => setMessage("Google signup will be connected later.")}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-sand/15 bg-sand/8 px-5 text-sm font-bold text-sand transition hover:bg-sand/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Continue with Google
          </button>

          <button
            type="button"
            disabled
            className="inline-flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-full border border-sand/10 bg-sand/5 px-5 text-sm font-bold text-sand/42"
          >
            <Phone className="size-4" aria-hidden="true" />
            Phone OTP - Coming soon
          </button>

          {message ? (
            <p role="status" className="rounded-2xl border border-saffron/25 bg-saffron/10 px-4 py-3 text-sm font-semibold text-saffron">
              {message}
            </p>
          ) : null}
        </form>

        <p className="mt-5 text-center text-sm font-medium text-sand/78">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="rounded-full font-black text-saffron transition hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  )
}

function AuthField({
  icon,
  label,
  name,
  placeholder,
  type,
}: {
  icon: React.ReactNode
  label: string
  name: string
  placeholder: string
  type: string
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-sand/66">
        {label}
      </span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-sand/18 bg-sand/10 px-4 text-sand transition focus-within:border-saffron/55 focus-within:bg-sand/12">
        <span className="text-saffron">{icon}</span>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-semibold text-sand outline-none placeholder:text-sand/52"
        />
      </span>
    </label>
  )
}

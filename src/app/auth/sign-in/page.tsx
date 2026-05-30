"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Apple, Mail, Phone } from "lucide-react"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthShell } from "@/components/auth/auth-shell"

const AUTH_OPTIONS = [
  {
    label: "Continue with Google",
    icon: <span className="text-sm font-black" aria-hidden="true">G</span>,
  },
  {
    label: "Continue with Apple",
    icon: <Apple className="size-4" aria-hidden="true" />,
  },
  {
    label: "Continue with Phone",
    icon: <Phone className="size-4" aria-hidden="true" />,
  },
  {
    label: "Continue with Email",
    icon: <Mail className="size-4" aria-hidden="true" />,
  },
]

export default function SignInPage() {
  const router = useRouter()

  // MOCK: real auth will call api-client.signIn() then redirect — for now simulate sign-in
  function handleSignIn() {
    router.push("/dashboard")
  }

  return (
    <AuthShell>
      <AuthCard
        title="Welcome to ZahiRok AI"
        subtitle="Sign in to create, save, and share Balochi-inspired songs."
      >
        <div className="mt-5 grid gap-3">
          {AUTH_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={handleSignIn}
              aria-label={option.label}
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-sand/15 bg-sand/8 px-5 text-sm font-bold text-sand transition hover:border-saffron/35 hover:bg-sand/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-sand/10 text-saffron">
                {option.icon}
              </span>
              {option.label}
            </button>
          ))}
        </div>

        <p className="mt-5 text-center text-xs font-semibold leading-5 text-sand/58">
          By continuing, you agree to our{" "}
          <Link
            href="#"
            className="font-black text-saffron transition hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="font-black text-saffron transition hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          >
            Terms of Use
          </Link>
          .
        </p>

        <p className="mt-5 text-center text-sm font-medium text-sand/78">
          New here?{" "}
          <Link
            href="/auth/sign-up"
            className="rounded-full font-black text-saffron transition hover:text-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  )
}
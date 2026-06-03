"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Apple, ArrowRight, Eye, EyeOff, X } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  // MOCK: replace with real auth provider later
  function handleMockAuth() {
    router.push("/dashboard")
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    handleMockAuth()
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111111] px-4 py-6 text-white">
      <AuthBackground />

      <section className="relative z-10 w-full max-w-md rounded-[28px] border border-white/16 bg-black/96 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.58)] sm:p-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Close sign up"
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-white/62 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
        >
          <X className="size-4" aria-hidden={true} />
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Sign Up</h1>
          <p className="mt-2 text-sm font-semibold text-white/58">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-black text-saffron underline-offset-2 transition hover:text-saffron/80 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          <SocialButton label="Continue with Google" onClick={handleMockAuth}>
            <span className="text-2xl font-black leading-none" aria-hidden={true}>
              <span className="text-[#4285f4]">G</span>
            </span>
          </SocialButton>
          <SocialButton label="Continue with Apple" onClick={handleMockAuth}>
            <Apple className="size-6 fill-current" aria-hidden={true} />
          </SocialButton>
        </div>

        <Divider />

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            type="email"
            name="email"
            placeholder="*Email Address"
            autoComplete="email"
            className="h-12 rounded-2xl border border-white/36 bg-transparent px-4 text-sm font-semibold text-white outline-none placeholder:text-white/52 transition focus:border-saffron"
          />

          <label className="relative block">
            <span className="sr-only">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              className="h-12 w-full rounded-2xl border border-white/36 bg-transparent px-4 pr-12 text-sm font-semibold text-white outline-none placeholder:text-white/52 transition focus:border-saffron"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-white/72 transition hover:bg-white/[0.06] hover:text-white"
            >
              {showPassword ? <Eye className="size-5" aria-hidden={true} /> : <EyeOff className="size-5" aria-hidden={true} />}
            </button>
          </label>

          <button
            type="submit"
            className="mt-3 inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-saffron px-5 text-base font-black text-black transition hover:bg-saffron/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
          >
            Create Account
            <ArrowRight className="size-5" aria-hidden={true} />
          </button>
        </form>

        <p className="mt-5 text-center text-xs font-semibold leading-5 text-white/58">
          By continuing, you acknowledge that you agree to the{" "}
          <Link
            href="/terms"
            className="font-black text-saffron underline-offset-2 transition hover:text-saffron/80 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-black text-saffron underline-offset-2 transition hover:text-saffron/80 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </main>
  )
}

function AuthBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_10%,rgba(227,122,44,0.22),transparent_24%),radial-gradient(circle_at_78%_82%,rgba(183,62,31,0.18),transparent_26%),linear-gradient(135deg,#101010_0%,#191919_52%,#0c0c0c_100%)]" />
      <div className="absolute inset-0 opacity-25 blur-[2px] [background-image:linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute left-1/2 top-1/2 h-[340px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron/10 blur-[100px]" />
    </>
  )
}

function SocialButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 items-center justify-center gap-4 rounded-full border border-white/42 bg-transparent px-5 text-sm font-black text-white transition hover:border-saffron hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
    >
      <span className="flex w-7 items-center justify-center">{children}</span>
      {label}
    </button>
  )
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-4">
      <span className="h-px flex-1 bg-white/18" />
      <span className="text-xs font-bold text-white/55">or</span>
      <span className="h-px flex-1 bg-white/18" />
    </div>
  )
}

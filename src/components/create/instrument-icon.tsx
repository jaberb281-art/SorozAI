import { AudioLines, Guitar, Music2, SlidersHorizontal } from "lucide-react"

import type { Instrument } from "@/lib/types"

type InstrumentIconProps = {
  name: Instrument
  className?: string
}

export function InstrumentIcon({ name, className = "size-10" }: InstrumentIconProps) {
  switch (name) {
    case "Suroz":
      return <SurozIcon className={className} />
    case "Rubab":
      return <RubabIcon className={className} />
    case "Tamburag":
      return <TamburagIcon className={className} />
    case "Damboora":
      return <DambooraIcon className={className} />
    case "Doholl":
      return <DohollIcon className={className} />
    case "Modern Drums":
      return <AudioLines className={className} aria-hidden="true" />
    case "Bass":
      return <Guitar className={className} aria-hidden="true" />
    case "Synth":
      return <SlidersHorizontal className={className} aria-hidden="true" />
    case "Guitar":
      return <Guitar className={className} aria-hidden="true" />
    default:
      return <Music2 className={className} aria-hidden="true" />
  }
}

function SurozIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3.5"
      aria-hidden="true"
    >
      <path d="M35 8v32" />
      <path d="M30 12h10" />
      <path d="M34 40c-7 2-11 6-11 11 0 4 4 7 9 7s9-3 9-7c0-5-3-9-7-11Z" />
      <path d="M28 17c6 7 10 15 12 24" />
      <path d="M49 15 18 48" />
      <path d="M45 13 52 20" />
    </svg>
  )
}

function RubabIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3.5"
      aria-hidden="true"
    >
      <path d="M39 11 26 31" />
      <path d="M39 11h11" />
      <path d="M44 16 31 35" />
      <path d="M23 30c-8 3-13 8-13 15 0 8 7 13 16 13s16-5 16-13c0-7-5-12-13-15" />
      <path d="M21 43h12" />
      <path d="M26 32v23" />
    </svg>
  )
}

function TamburagIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3.5"
      aria-hidden="true"
    >
      <path d="M44 7 24 42" />
      <path d="M40 6h11" />
      <path d="M21 40c-7 2-11 6-11 11 0 5 5 8 11 8s11-3 11-8c0-5-4-9-11-11Z" />
      <path d="M26 24 43 34" />
      <path d="M31 15 48 25" />
      <path d="M20 43v12" />
    </svg>
  )
}

function DambooraIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3.5"
      aria-hidden="true"
    >
      <path d="M34 8v31" />
      <path d="M29 10h10" />
      <path d="M26 35c-9 2-15 7-15 14 0 7 7 11 16 11s16-4 16-11c0-7-6-12-15-14" />
      <path d="M27 37v18" />
      <path d="M20 47h15" />
      <path d="M34 17c6 4 9 10 10 18" />
    </svg>
  )
}

function DohollIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3.5"
      aria-hidden="true"
    >
      <path d="M17 19c5-4 25-4 30 0v26c-5 4-25 4-30 0V19Z" />
      <path d="M17 19c5 4 25 4 30 0" />
      <path d="M17 45c5-4 25-4 30 0" />
      <path d="m18 25 28 13" />
      <path d="M46 25 18 38" />
      <path d="M10 31h7" />
      <path d="M47 31h7" />
    </svg>
  )
}

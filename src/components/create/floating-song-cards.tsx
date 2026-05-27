"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"

const FLOATING_SONGS = [
  {
    title: "Makran Evening",
    genre: "Zahirok",
    className: "left-8 top-36 rotate-[-6deg]",
    delay: 0,
  },
  {
    title: "Desert Pulse",
    genre: "Hip-Hop Fusion",
    className: "right-10 top-44 rotate-[5deg]",
    delay: 0.2,
  },
  {
    title: "Suroz Memory",
    genre: "Sufi",
    className: "bottom-20 right-24 rotate-[-4deg]",
    delay: 0.4,
  },
]

export function FloatingSongCards() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden lg:block">
      {FLOATING_SONGS.map((song) => (
        <motion.div
          key={song.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 0.48, y: [0, -10, 0] }}
          transition={{
            delay: song.delay,
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute w-64 rounded-2xl border border-sand/10 bg-sand/8 p-4 text-sand shadow-2xl shadow-charcoal/40 backdrop-blur-xl ${song.className}`}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-saffron/15 px-3 py-1 text-xs font-semibold text-saffron">
              {song.genre}
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-sand/10">
              <Play className="ml-0.5 size-4" aria-hidden="true" />
            </span>
          </div>
          <p className="text-lg font-bold">{song.title}</p>
          <div className="mt-4 flex h-10 items-end gap-1">
            {Array.from({ length: 22 }).map((_, index) => (
              <span
                key={index}
                className="w-full rounded-full bg-saffron/60"
                style={{ height: `${18 + ((index * 17) % 30)}px` }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

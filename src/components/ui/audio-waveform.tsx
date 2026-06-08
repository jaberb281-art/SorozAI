"use client"

import { useEffect, useRef } from "react"
import WaveSurfer from "wavesurfer.js"

interface AudioWaveformProps {
  audioUrl: string | null
  isPlaying: boolean
  height?: number
  onSeek?: (time: number) => void
  className?: string
}

export function AudioWaveform({
  audioUrl,
  isPlaying,
  height = 48,
  onSeek,
  className = "",
}: AudioWaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return

    const ws = WaveSurfer.create({
      container: containerRef.current,
      url: audioUrl,
      waveColor: "rgba(255, 255, 255, 0.15)",
      progressColor: "#e37a2c",
      height,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      interact: true,
      backend: "WebAudio",
    })

    ws.on("seeking", (currentTime) => {
      if (onSeek) {
        onSeek(currentTime)
      }
    })

    wavesurferRef.current = ws

    return () => {
      ws.destroy()
      wavesurferRef.current = null
    }
  }, [audioUrl, height, onSeek])

  useEffect(() => {
    const ws = wavesurferRef.current
    if (!ws) return
    if (isPlaying) {
      ws.play().catch(() => {
        // autoplay may be blocked - ignore silently
      })
    } else {
      ws.pause()
    }
  }, [isPlaying])

  if (!audioUrl) {
    // Placeholder bars when no audio is loaded
    return (
      <div
        className={`flex items-center gap-[2px] ${className}`}
        style={{ height }}
        aria-hidden="true"
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="w-[2px] rounded-full bg-white/10"
            style={{
              height: `${20 + Math.sin(i * 0.8) * 14}px`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      style={{ height }}
    />
  )
}

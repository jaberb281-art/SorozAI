"use client"

import type { CSSProperties } from "react"

export function isVideoAsset(src: string): boolean {
    return /\.(mp4|webm|ogg)(\?|#|$)/i.test(src)
}

export function DemoVideoPoster({
    className = "",
    src,
    style,
}: {
    className?: string
    src: string
    style?: CSSProperties
}) {
    if (!isVideoAsset(src)) {
        return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
                src={src}
                alt=""
                className={className}
                style={style}
                onError={(event) => {
                    ;(event.target as HTMLImageElement).style.display = "none"
                }}
            />
        )
    }

    return (
        <video muted preload="metadata" playsInline aria-hidden className={className} style={style}>
            <source src={src} type="video/mp4" />
        </video>
    )
}

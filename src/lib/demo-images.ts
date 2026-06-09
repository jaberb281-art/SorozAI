/**
 * Shared demo artwork paths from /public/clips (MP4).
 * Use getDemoImage(index) for deterministic assignment (avoids hydration mismatch).
 */
export const DEMO_IMAGES = [
    "/clips/clip1.mp4",
    "/clips/clip2.mp4",
    "/clips/clip3.mp4",
    "/clips/clip4.mp4",
    "/clips/clip5.mp4",
    "/clips/clip6.mp4",
    "/clips/clip7.mp4",
    "/clips/clip8.mp4",
] as const

/** Alias — clip assets are videos, not static images. */
export const DEMO_VIDEOS = DEMO_IMAGES

export function getDemoImage(index: number): string {
    return DEMO_IMAGES[index % DEMO_IMAGES.length]
}

/** Assign demo image when imageUrl is missing. */
export function withDemoImageUrl<T extends { imageUrl?: string }>(
    items: T[],
    startIndex = 0,
): T[] {
    return items.map((item, index) => ({
        ...item,
        imageUrl: item.imageUrl ?? getDemoImage(startIndex + index),
    }))
}

/** Assign demo image when `image` is missing (Discover clips row). */
export function withDemoImageField<T extends { image?: string }>(
    items: T[],
    startIndex = 0,
): T[] {
    return items.map((item, index) => ({
        ...item,
        image: item.image ?? getDemoImage(startIndex + index),
    }))
}

import type { Song } from "./types"

export const MOCK_SONGS: Song[] = [
    {
        id: "song-1",
        title: "Makran Evening",
        prompt:
            "Create a warm Zahirok song about evening memories along the Makran coast.",
        genrePreset: "Zahirok",
        instruments: ["Suroz", "Damboora"],
        lyrics:
            "A traditional Balochi-inspired song about memory, land, and longing.",
        status: "completed",
        audioUrl: "/mock/audio-1.mp3",
        mp3Url: "/mock/audio-1.mp3",
        wavUrl: "/mock/audio-1.wav",
        isPublic: true,
        createdAt: "2026-05-23T10:00:00Z",
        duration: "3:18",
        plays: 124,
        likes: 18,
        remixes: 6,
    },
    {
        id: "song-2",
        title: "Desert Pulse",
        prompt:
            "Make a modern Balochi hip-hop fusion track with desert rhythm and deep bass.",
        genrePreset: "Hip-Hop Fusion",
        instruments: ["Modern Drums", "Bass", "Synth"],
        lyrics:
            "A modern Balochi fusion track with energetic drums and cultural rhythm.",
        status: "completed",
        audioUrl: "/mock/audio-2.mp3",
        mp3Url: "/mock/audio-2.mp3",
        wavUrl: "/mock/audio-2.wav",
        isPublic: false,
        createdAt: "2026-05-23T11:00:00Z",
        duration: "2:42",
        plays: 57,
        likes: 9,
        remixes: 2,
    },
]

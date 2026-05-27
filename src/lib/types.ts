export type GenrePreset =
    | "Zahirok"
    | "Liko"
    | "Sout"
    | "Naat"
    | "Modern Balochi Pop"
    | "Wedding"
    | "Lullaby"
    | "Sufi"
    | "Hip-Hop Fusion"
    | "Custom Prompt"

export type Instrument =
    | "Suroz"
    | "Rubab"
    | "Tamburag"
    | "Damboora"
    | "Doholl"
    | "Modern Drums"
    | "Bass"
    | "Synth"
    | "Guitar"

export type SongStatus = "queued" | "generating" | "completed" | "failed"

export type SongRequest = {
    prompt: string
    genrePreset: GenrePreset
    instruments: Instrument[]
    lyrics: string
    instrumentalOnly: boolean
    isPublic: boolean
}

export type Song = {
    id: string
    title: string
    prompt: string
    genrePreset: GenrePreset
    instruments: Instrument[]
    lyrics: string
    status: SongStatus
    audioUrl: string
    mp3Url: string
    wavUrl: string
    isPublic: boolean
    createdAt: string
    duration: string
    plays: number
    likes: number
    remixes: number
}

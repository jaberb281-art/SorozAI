import type { GenrePreset, Instrument, Song, SongStatus } from "./types"

// POST /api/songs/generate
export type GenerateSongRequest = {
  prompt: string
  lyrics?: string
  genrePreset: GenrePreset
  instruments: Instrument[]
  isPublic: boolean
  instrumentalOnly: boolean
}

export type GenerateSongResponse = {
  songId: string
  jobId: string
  status: SongStatus
}

// GET /api/songs/:id/status
export type GenerationStage =
  | "queued"
  | "preparing"
  | "checking_style"
  | "annotating_pronunciation"
  | "generating_vocals"
  | "composing_instruments"
  | "mixing"
  | "uploading"
  | "completed"
  | "failed"

export type GenerationStatusResponse = {
  songId: string
  jobId: string
  status: SongStatus
  currentStage: GenerationStage
  progress: number
  message: string
  error?: string
}

// GET /api/songs/:id
export type SongComment = {
  id: string
  songId: string
  authorName: string
  body: string
  createdAt: string
}

export type SongSocialStats = {
  plays: number
  likes: number
  remixes: number
}

export type SongDetailResponse = {
  song: Song
  comments?: SongComment[]
  socialStats?: SongSocialStats
}

// GET /api/library
export type LibraryResponse = {
  songs: Song[]
  total: number
  page: number
  pageSize: number
}

// GET /api/explore
export type ExploreFeedResponse = {
  songs: Song[]
  total: number
  page: number
  pageSize: number
}

// GET /api/me
export type UserTier = "free" | "basic" | "pro" | "lifetime" | "team"

export type AccountResponse = {
  id: string
  name: string
  email: string
  country: string
  tier: UserTier
  creditsRemaining: number
  creditsLimit: number
  createdAt: string
}

// POST /api/voice/donation
export type VoiceDialect =
  | "Rakhshani"
  | "Makrani"
  | "Sulaimani"
  | "Mixed / Not sure"

export type VoiceRecordingType = "Speaking" | "Singing" | "Poetry"

export type VoiceDonationRequest = {
  fullName: string
  email: string
  dialect: VoiceDialect
  recordingType: VoiceRecordingType
  transcript: string
  consentAccepted: boolean
}

export type VoiceDonationResponse = {
  donationId: string
  status: "received" | "pending_review" | "accepted" | "rejected"
  message: string
}

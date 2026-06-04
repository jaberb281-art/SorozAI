export type PublicProfileSong = {
  coverImage?: string
  plays: number
  style: string
  title: string
  version: string
}

export type PublicProfilePlaylist = {
  coverImage?: string
  count: string
  title: string
}

export type PublicProfile = {
  avatarGradient: string
  bannerGradient: string
  bio: string
  displayName: string
  followers: number
  following: number
  handle: string
  likes: number
  playlists: PublicProfilePlaylist[]
  plays: string
  songs: PublicProfileSong[]
  tags: string[]
}

export const mockPublicProfiles: Record<string, PublicProfile> = {
  chelz: {
    displayName: "Chelz ✨💫⭐",
    handle: "@chelz1",
    avatarGradient:
      "radial-gradient(circle_at_35%_28%,#ede3d3 0%,#d94f35 35%,#1a3a5c 100%)",
    bannerGradient:
      "linear-gradient(160deg,rgba(255,97,79,0.98),rgba(227,122,44,0.96) 42%,rgba(246,177,58,0.9) 78%,rgba(28,17,14,0.98))",
    plays: "19K",
    likes: 116,
    followers: 34,
    following: 89,
    tags: ["hip hop", "r&b", "female vocals", "rap", "soulful"],
    songs: [
      { title: "Intra-Chelz", version: "v5", plays: 16, style: "Reggaeton", coverImage: "/covers/turbat-night.png" },
      { title: "Motive - Chelz", version: "v5.5", plays: 16, style: "Hip-Hop", coverImage: "/covers/sufi-dambora.png" },
      { title: "Midnight Mindstate - Chelz", version: "v5.5", plays: 20, style: "Hip-Hop", coverImage: "/covers/desert-pulse.png" },
      { title: "El Take Taken-Chelz", version: "v5", plays: 58, style: "R&B", coverImage: "/covers/wedding-doholl.png" },
      { title: "Soy Una Negra-Chelz", version: "v5", plays: 227, style: "Reggaeton", coverImage: "/covers/coastal-lullaby.png" },
      { title: "Sore Loser-Chelz", version: "v5", plays: 23, style: "Soul", coverImage: "/covers/makran-evening.png" },
      { title: "For All I Know-Chelz", version: "v5", plays: 25, style: "Rap", coverImage: "/covers/desert-pulse.png" },
      { title: "I Wonder If You See Me-Chelz", version: "v5", plays: 56, style: "R&B", coverImage: "/covers/makran-evening.png" },
      { title: "Calls-Chelz", version: "v5", plays: 9, style: "Pop", coverImage: "/covers/turbat-night.png" },
    ],
    playlists: [{ title: "Chelz_Hitz", count: "29 songs", coverImage: "/covers/sufi-dambora.png" }],
    bio: "",
  },
  shahbaloch: {
    displayName: "Shah Baloch",
    handle: "@shahbaloch",
    avatarGradient:
      "radial-gradient(circle_at_32%_30%,#f6b13a 0%,#e37a2c 42%,#0f3440 100%)",
    bannerGradient:
      "linear-gradient(150deg,rgba(26,58,92,0.96),rgba(227,122,44,0.74) 48%,rgba(11,10,10,0.98))",
    plays: "530K",
    likes: 4300,
    followers: 128,
    following: 47,
    tags: ["zahirok", "makkuran", "doholl", "damboora", "coastal"],
    songs: [
      { title: "Makran Evening Hook", version: "v4.5", plays: 530, style: "Zahirok", coverImage: "/covers/makran-evening.png" },
      { title: "Sea Wind Doholl", version: "v4", plays: 84, style: "Wedding", coverImage: "/covers/wedding-doholl.png" },
      { title: "Gwadar Firelight", version: "v5", plays: 71, style: "Folk", coverImage: "/covers/turbat-night.png" },
    ],
    playlists: [{ title: "Makran Sketches", count: "12 songs", coverImage: "/covers/makran-evening.png" }],
    bio: "Warm coastal hooks shaped around Damboora, Doholl, and Makkuran vocals.",
  },
  meeralgwadar: {
    displayName: "Meeral Gwadar",
    handle: "@meeralgwadar",
    avatarGradient:
      "radial-gradient(circle_at_34%_26%,#4fd6c9 0%,#e37a2c 38%,#1a3a5c 100%)",
    bannerGradient:
      "linear-gradient(155deg,rgba(20,20,27,1),rgba(79,214,201,0.78) 38%,rgba(227,122,44,0.82) 74%,rgba(9,9,12,1))",
    plays: "314K",
    likes: 1600,
    followers: 76,
    following: 52,
    tags: ["wedding", "doholl", "coastal", "claps", "makkuran"],
    songs: [
      { title: "Doholl Night", version: "v5", plays: 314, style: "Wedding", coverImage: "/covers/wedding-doholl.png" },
      { title: "Turbat Steps", version: "v4", plays: 92, style: "Dance", coverImage: "/covers/turbat-night.png" },
      { title: "Coastline Call", version: "v5", plays: 61, style: "Liko", coverImage: "/covers/coastal-lullaby.png" },
    ],
    playlists: [{ title: "Gwadar Nights", count: "8 songs", coverImage: "/covers/coastal-lullaby.png" }],
    bio: "Festival rhythms, night-drive bass, and coastal Balochi phrases.",
  },
  jamesbakian: {
    displayName: "James Bakian",
    handle: "@jamesbakian",
    avatarGradient:
      "radial-gradient(circle_at_30%_30%,#ede3d3 0%,#b73e1f 36%,#1a3a5c 100%)",
    bannerGradient:
      "linear-gradient(160deg,rgba(183,62,31,0.98),rgba(227,122,44,0.88) 48%,rgba(26,58,92,0.86) 100%)",
    plays: "88K",
    likes: 912,
    followers: 41,
    following: 39,
    tags: ["cinematic", "folk", "zahirok", "suroz", "warm vocals"],
    songs: [
      { title: "Desert Signal", version: "v5", plays: 72, style: "Zahirok", coverImage: "/covers/desert-pulse.png" },
      { title: "Suroz Amber", version: "v4.5", plays: 45, style: "Folk", coverImage: "/covers/makran-evening.png" },
      { title: "Night Caravan", version: "v5.5", plays: 31, style: "Fusion", coverImage: "/covers/turbat-night.png" },
    ],
    playlists: [{ title: "Cinema Balochi", count: "14 songs", coverImage: "/covers/desert-pulse.png" }],
    bio: "Cinematic folk sketches with Zahirok phrasing and modern low end.",
  },
}

const creatorProfileHandles: Record<string, string> = {
  "azim dashti": "meeralgwadar",
  "bibi hani": "shahbaloch",
  "dil nawaz": "meeralgwadar",
  "distinctinstructor3079": "chelz",
  "harley maxwell": "jamesbakian",
  "jalal rakhshani": "jamesbakian",
  "karimi band": "shahbaloch",
  "karzan beat": "jamesbakian",
  "mahrang360": "meeralgwadar",
  "mahzad baloch": "meeralgwadar",
  "meeral gwadar": "meeralgwadar",
  "noor dehwar": "chelz",
  "rostam kech": "jamesbakian",
  "ruvin dashti": "shahbaloch",
  "shah baloch": "shahbaloch",
  "zareena sajid": "chelz",
}

export function getPublicProfile(handle: string): PublicProfile {
  const key = normalizeProfileHandle(handle)
  return mockPublicProfiles[key] ?? createFallbackPublicProfile(key)
}

export function normalizeProfileHandle(value: string): string {
  return value.replace(/^@/, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "")
}

export function profilePathForCreator(name: string): string {
  return `/profile/${creatorProfileHandles[name.trim().toLowerCase()] ?? normalizeProfileHandle(name)}`
}

export function profilePathForHandle(handle: string): string {
  return `/profile/${normalizeProfileHandle(handle)}`
}

function createFallbackPublicProfile(handle: string): PublicProfile {
  const displayName = handle
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Zahirok Creator"

  return {
    displayName,
    handle: `@${handle || "creator"}`,
    avatarGradient:
      "radial-gradient(circle_at_30%_30%,#ede3d3 0%,#e37a2c 36%,#1a3a5c 100%)",
    bannerGradient:
      "linear-gradient(155deg,rgba(227,122,44,0.92),rgba(183,62,31,0.74) 45%,rgba(9,9,9,0.98))",
    plays: "12K",
    likes: 128,
    followers: 18,
    following: 24,
    tags: ["zahirok", "balochi", "folk", "raw vocals"],
    songs: [
      { title: `${displayName} Zahirok`, version: "v5", plays: 18, style: "Zahirok", coverImage: "/covers/makran-evening.png" },
      { title: "Coastal Draft", version: "v4.5", plays: 11, style: "Liko", coverImage: "/covers/coastal-lullaby.png" },
      { title: "Damboora Pulse", version: "v5", plays: 9, style: "Folk", coverImage: "/covers/desert-pulse.png" },
    ],
    playlists: [{ title: `${displayName} Picks`, count: "6 songs", coverImage: "/covers/turbat-night.png" }],
    bio: "A Zahirok community creator exploring Balochi melodies and modern production.",
  }
}

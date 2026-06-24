# Soroz AI Frontend / Backend Handoff

This document summarizes the current frontend MVP, the mock-only layer, and the backend work needed for future integration.

## 1. Current Frontend Routes

- `/`
  - Public marketing landing page with public navbar, prompt-first hero, song examples, feature grid, pricing preview, voice section, and footer.
  - Does not render `AppSidebar`, `MobileTabBar`, `BottomPlayer`, or the free plan widget.
- `/auth/sign-in`
  - Public, frontend-only sign-in UI with placeholder social/email/phone actions.
  - Does not render the dashboard shell.
- `/auth/sign-up`
  - Public, frontend-only sign-up UI for future account creation.
  - Does not render the dashboard shell.
- `/create`
  - Logged-in home and quick create studio for the MVP.
  - Renders inside `AppShell` with `AppSidebar`, `MobileTabBar`, `BottomPlayer`, and the sidebar free plan widget.
  - Includes a compact prompt composer, advanced genre/instrument controls, visibility selector, hidden-by-default prompt examples, mock staged generation pipeline, promo cards, and recent examples.
- `/library`
  - Saved/generated songs surface with search, filters, song cards, mock waveform previews, and links to song detail pages.
- `/feed`
  - Public explore feed for songs marked public, with search, genre filters, public song cards, local like/play/share interactions, and links to song detail pages.
- `/song/[id]`
  - Dynamic song detail/player page with metadata, mock waveform player, lyrics/prompt, social stats, sharing actions, comments preview, and not-found behavior for unknown IDs.
- `/pricing`
  - Pricing page with Free, Basic, Pro, Lifetime, and Team / Studio tiers plus regional pricing and FAQ.
- `/voice-of-balochistan`
  - Voice contribution program preview with informational sections and frontend-only voice donation form.
- `/account`
  - Account and billing preview with mock profile data, plan/credits card, upgrade options, billing placeholder, and danger zone.

No `/home` or `/studio` route exists. `/create` intentionally acts as the logged-in home/create page for the MVP. A more advanced workspace can be introduced later after backend workspace data exists.

## 2. Current Frontend-Only Mock Layer

- `src/lib/types.ts`
  - Shared product domain types such as `Song`, `SongStatus`, `GenrePreset`, and `Instrument`.
- `src/lib/api-contracts.ts`
  - TypeScript contracts for future backend request/response shapes.
- `src/lib/mock-songs.ts`
  - Local mock song records used by the mock client.
- `src/lib/api-client.ts`
  - Frontend-only async mock client. It currently returns mock data with small artificial delays.

The UI should keep calling `src/lib/api-client.ts`. When backend endpoints are ready, the internal implementations in `api-client.ts` should be replaced with real `fetch` calls while keeping UI components mostly unchanged.

## 3. Future Backend Endpoints Needed

- `POST /api/songs/generate`
  - Start a song generation job.
- `GET /api/songs/:id/status`
  - Return generation job status, current stage, progress, and errors.
- `GET /api/songs/:id`
  - Return song detail, comments, and social stats.
- `GET /api/library`
  - Return authenticated user library songs with pagination/filter support.
- `GET /api/explore`
  - Return public feed songs with pagination/filter support.
- `GET /api/me`
  - Return authenticated account/profile/plan/credits data.
- `POST /api/voice/donation`
  - Accept voice contribution metadata and uploaded audio reference.
- Auth provider integration
  - Email/password, Google OAuth, and phone OTP.
- Billing/checkout endpoints
  - Stripe and regional payment methods later.

## 4. Frontend Placeholders

- Generation pipeline is mock-only.
- Audio playback/player state is mock-only; no real audio file playback, storage, or streaming is wired.
- Likes, comments, remixes, play state, share messages, and reports are local-only UI behavior and are not persisted.
- Public/private publish actions are placeholders.
- Account profile, tier, and credits are mock data.
- Voice donation form does not upload real files or store real data.
- Pricing buttons do not connect to checkout or billing.
- Auth pages are UI-only and do not authenticate users.
- Upload/reference actions are placeholders and do not store files.

## 5. Backend Responsibilities

- Authentication and session management.
- Database schema and persistence.
- Song generation job creation.
- Queue and status tracking.
- Audio file storage and secure access.
- User library storage and retrieval.
- Public explore feed.
- Social actions: likes, comments, remixes, shares, and play counts.
- Billing, subscriptions, credits, invoices, and checkout.
- Voice donation upload, consent storage, contributor review, and withdrawal policy support.
- Moderation and reporting workflows.

## 6. Frontend Responsibilities Remaining

- Responsive polish across all routes.
- Accessibility pass for forms, navigation, player controls, and interactive cards.
- Reusable component cleanup where duplication grows.
- Loading states for `api-client` calls.
- Error states for failed requests.
- Empty states for all data surfaces.
- Mobile QA across Create, Library, Feed, Song Detail, Account, Pricing, Auth, and Voice pages.
- Final visual consistency pass before backend integration.

## 7. Integration Strategy

Frontend UI components should continue calling `src/lib/api-client.ts` instead of importing database, provider, or backend logic directly.

When backend implementation begins:

1. Keep the exported function names and TypeScript contracts in `api-client.ts`.
2. Replace the mock implementations with real `fetch` calls to backend endpoints.
3. Normalize backend responses inside `api-client.ts` if needed.
4. Keep UI components focused on rendering, state, and interaction.
5. Add loading and error states around calls that become network-bound.

This keeps the frontend/backend boundary clean and makes the current mock MVP easy to swap over to real services later.

## 8. Current Build Status

- `npm run build` is passing.
- Verified routes:
  - `/`
  - `/auth/sign-in`
  - `/auth/sign-up`
  - `/create`
  - `/library`
  - `/feed`
  - `/song/song-1`
  - `/account`
  - `/pricing`
  - `/voice-of-balochistan`

Route shell behavior is intentionally split:

- Public routes without dashboard shell:
  - `/`
  - `/auth/sign-in`
  - `/auth/sign-up`
- Dashboard routes with `AppShell`:
  - `/create`
  - `/library`
  - `/feed`
  - `/song/[id]`
  - `/pricing`
  - `/voice-of-balochistan`
  - `/account`

## 9. Do Not Implement Yet

The following responsibilities should wait for backend and team confirmation before implementation:

- Real authentication.
- Database writes and persistence.
- Payment checkout.
- Real file/audio upload.
- Real song generation API calls.
- Real comments/likes persistence.
- Real audio playback/storage/streaming.
- Voice donation storage.
- Moderation workflows.
- Production queue/status tracking.
- A full Suno-like advanced workspace, `/home`, or `/studio` route.

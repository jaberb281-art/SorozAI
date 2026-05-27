# ZahiRok AI — Frontend MVP

ZahiRok AI is a frontend MVP for a Balochi AI music creation platform. It lets users create Balochi-inspired songs from lyrics, poetry, memories, and prompts.

This repository currently contains the frontend only.

## Current Status

The frontend MVP is ready for team review.

Implemented:

- Public landing page
- Public sign-in/sign-up placeholder pages
- AppShell dashboard layout
- `/create` as logged-in home + quick create studio
- Library page
- Public explore/feed page
- Song detail/player page
- Pricing page
- Account page
- Voice of Balochistan page
- Mock API client layer
- API contract types
- Frontend/backend handoff documentation
- Frontend QA checklist

## Route Structure

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/auth/sign-in` | Public sign-in placeholder |
| `/auth/sign-up` | Public sign-up placeholder |
| `/create` | Logged-in home + quick create studio |
| `/library` | Saved/generated songs |
| `/feed` | Public explore feed |
| `/song/[id]` | Song detail/player page |
| `/pricing` | Pricing page |
| `/voice-of-balochistan` | Voice contribution page |
| `/account` | Account and billing preview |

No `/home` or `/studio` route exists yet. For the MVP, `/create` intentionally acts as the logged-in home/create studio.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React
- Lucide React
- Mock API client
- Local mock song data

## Getting Started

```bash
npm install
npm run dev
npm run build
```

## Mock-Only Areas

The following areas are currently frontend-only placeholders:

- Authentication
- Google/Apple/Phone sign-in
- Song generation
- Audio upload/storage
- Real audio playback
- Database persistence
- Likes/comments/remixes
- Payments/subscriptions
- Voice donations
- User credits
- Account billing data

## Important Files

| File | Purpose |
|---|---|
| `src/lib/types.ts` | Shared product/domain types |
| `src/lib/api-contracts.ts` | Future backend API request/response contracts |
| `src/lib/api-client.ts` | Mock frontend API client |
| `src/lib/mock-songs.ts` | Local mock song data |
| `FRONTEND_BACKEND_HANDOFF.md` | Backend integration handoff |
| `FRONTEND_QA_CHECKLIST.md` | Manual QA checklist |

## Backend Integration Direction

Frontend pages and components should continue calling `src/lib/api-client.ts`.

When backend endpoints are ready, replace the mock implementations inside `api-client.ts` with real `fetch` calls. This keeps UI components clean and avoids spreading backend logic across the frontend.

## Notes for Review

This project is intended for frontend/product review first. UI, route structure, mock API boundary, and handoff documentation are prepared so backend work can begin later with clearer contracts.

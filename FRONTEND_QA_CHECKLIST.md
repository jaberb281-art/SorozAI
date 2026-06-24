# Soroz AI Frontend QA Checklist

Use this checklist before backend integration and after any layout, navigation, or player changes.

## 1. Build Checks

- [ ] Run `npm run build`.
- [ ] Confirm there are no TypeScript errors.
- [ ] Confirm every app route compiles without route-level build errors.
- [ ] Confirm dynamic song routes compile and render known IDs.

## 2. Layout Checks

- [ ] `AppShell` renders once from `src/app/layout.tsx`.
- [ ] Public routes (`/`, `/auth/sign-in`, `/auth/sign-up`) do not show `AppSidebar`, `MobileTabBar`, `BottomPlayer`, or the free plan widget.
- [ ] Dashboard routes (`/create`, `/library`, `/feed`, `/song/[id]`, `/pricing`, `/voice-of-balochistan`, `/account`) render with `AppShell`.
- [ ] Desktop sidebar appears on dashboard routes at desktop widths and highlights the active route.
- [ ] `MobileTabBar` appears on dashboard routes at mobile widths and highlights the active route.
- [ ] `BottomPlayer` does not cover dashboard page content on mobile or desktop.
- [ ] Dashboard page content has enough bottom padding when the player and mobile tabs are visible.
- [ ] No horizontal overflow on mobile.
- [ ] No page-level `StudioNavbar` usage remains.
- [ ] No duplicate navigation/sidebar/mobile tab bars appear.
- [ ] No `/home` or `/studio` route exists.

## 3. Route Checklist

### `/`

- [ ] Route loads without errors.
- [ ] Public landing page renders directly and does not redirect to `/create`.
- [ ] Public navbar appears without dashboard sidebar, mobile tabs, bottom player, or free plan widget.
- [ ] Hero composer, song examples, feature grid, pricing preview, voice section, and footer are visible.

### `/create`

- [ ] Route behaves as the logged-in home + quick create studio.
- [ ] Dashboard shell, sidebar, MobileTabBar, BottomPlayer, and free plan widget appear where expected.
- [ ] Heading reads `Bring your Balochi sound to life`.
- [ ] Composer is visible and usable on mobile and desktop.
- [ ] Prompt textarea fits comfortably.
- [ ] Prompt examples are hidden by default behind the inspiration affordance or advanced flow.
- [ ] Promo cards and recent examples stack cleanly.
- [ ] Create CTA and composer controls have comfortable tap targets.

### `/library`

- [ ] Song cards render.
- [ ] Search input is usable on mobile.
- [ ] Filter chips scroll or wrap without horizontal page overflow.
- [ ] Cards stack cleanly on mobile and grid correctly on desktop.

### `/feed`

- [ ] Public song cards render.
- [ ] Search input is usable on mobile.
- [ ] Filter chips scroll or wrap without horizontal page overflow.
- [ ] Cards stack cleanly on mobile and grid correctly on desktop.

### `/song/song-1`

- [ ] Known song detail page renders.
- [ ] Back to Library link works.
- [ ] Player, metadata, lyrics, and social panel are visible.
- [ ] Mobile layout stacks cleanly.

### `/song/song-2`

- [ ] Known song detail page renders.
- [ ] Song-specific title, metadata, and duration appear.
- [ ] Social panel remains usable on mobile.

### `/song/unknown-song`

- [ ] Unknown song returns the Next.js `notFound` state.
- [ ] No client-side crash appears.

### `/account`

- [ ] Account page renders mock account data.
- [ ] Plan, credits, billing, and danger-zone panels stack cleanly on mobile.
- [ ] Buttons have comfortable spacing.

### `/pricing`

- [ ] Route renders as a dashboard route inside `AppShell`.
- [ ] Pricing cards stack cleanly on mobile.
- [ ] Featured plan styling remains visible.
- [ ] FAQ and info panels are readable on mobile.

### `/voice-of-balochistan`

- [ ] Route renders as a dashboard route inside `AppShell`.
- [ ] Voice contribution form renders.
- [ ] Form controls are usable on mobile.
- [ ] Consent checkbox and submit button are visible.
- [ ] Submission shows the mock client response.

### `/auth/sign-in`

- [ ] Route renders as a public auth page with no dashboard shell.
- [ ] Auth card is centered and readable on mobile.
- [ ] Inputs and buttons are usable.
- [ ] UI-only messages appear for placeholder actions.
- [ ] Auth actions do not imply real authentication is connected.

### `/auth/sign-up`

- [ ] Route renders as a public auth page with no dashboard shell.
- [ ] Auth card is centered and readable on mobile.
- [ ] Inputs and buttons are usable.
- [ ] UI-only messages appear for placeholder actions.
- [ ] Auth actions do not imply real account creation is connected.

## 4. Create Flow Checks

- [ ] Prompt examples fill the textarea.
- [ ] Empty prompt validation works unless Instrumental Only is enabled.
- [ ] Advanced panel opens and closes.
- [ ] Genre preset selection updates active state.
- [ ] Traditional instruments select and deselect correctly.
- [ ] Modern instruments select and deselect correctly.
- [ ] Visibility toggles between private and public.
- [ ] Instrumental Only toggle works.
- [ ] Generation pipeline runs from queued to completed.
- [ ] Generated song preview appears after mock generation completes.

## 5. Library Checks

- [ ] Songs render from mock data.
- [ ] Search filters by title, prompt, genre, instruments, and lyrics.
- [ ] Public, Private, Completed, and Generating filters work.
- [ ] Empty state appears when no songs match.
- [ ] Song cards link to the detail page.
- [ ] Play button uses the shared player.
- [ ] Next and previous playback use the filtered song queue.

## 6. Feed Checks

- [ ] Only public songs appear.
- [ ] Search filters public songs.
- [ ] Genre filters work.
- [ ] Empty state appears when no songs match.
- [ ] Like toggles locally.
- [ ] Play button uses the shared player.
- [ ] Next and previous playback use the filtered feed queue.
- [ ] Open action links to the song detail page.
- [ ] Remix action links to the composer placeholder flow.
- [ ] Share action shows the placeholder message.

## 7. Song Detail Checks

- [ ] Known songs render.
- [ ] Unknown song returns `notFound`.
- [ ] Player uses duration from song data.
- [ ] Metadata uses song data.
- [ ] Lyrics and prompt display correctly.
- [ ] Like, share, remix, copy link, report, and publish actions work as frontend placeholders.
- [ ] Comments preview appears.
- [ ] Social panel remains usable on mobile.

## 8. Account, Pricing, Auth, and Voice Checks

- [ ] Account page uses mock API data from the mock client.
- [ ] Pricing cards stack on mobile and align on desktop.
- [ ] Auth forms are UI-only and do not call real authentication services.
- [ ] Voice donation form submits through the mock client.
- [ ] Placeholder messages are clear and do not imply real backend persistence.

## 9. Mock-Only Warnings

- [ ] No real auth.
- [ ] No real payments.
- [ ] No real audio generation.
- [ ] No real upload.
- [ ] No real comments or likes persistence.
- [ ] No real database.
- [ ] No real audio playback, storage, or streaming.
- [ ] Voice donations are frontend-only/mock.
- [ ] `/create` is intentionally the logged-in home/create route for MVP; no `/home` or `/studio` route exists.

## 10. Pre-Backend Integration Checklist

- [ ] `src/lib/api-client.ts` is the only mock data boundary.
- [ ] API contracts are reviewed before backend work starts.
- [ ] Frontend/backend handoff doc is updated.
- [ ] Public/dashboard route split is confirmed.
- [ ] Advanced Suno-like workspace remains future work until backend/workspace data exists.
- [ ] Mobile QA passed.
- [ ] Desktop QA passed.
- [ ] `npm run build` passed.

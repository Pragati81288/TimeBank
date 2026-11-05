# Project memory

## Product intent & audience

- TimeBank Skill Exchange Platform: students swap skills using time-credit currency.
- Core features: time-credit wallets, skill matching, session management, exchange requests, ratings, badges, notifications.
- Backend: Java Spring Boot with H2 in-memory database (frontend built with Vite + React).
- Two new features in progress: (1) Time Credit Welcome Bonus — 10 TC per new account, one-time only; (2) Character Avatar Selection — 16 illustrated avatars stored as avatar IDs in DB, displayed app-wide.

## Brand personality & voice

- Pinterest-inspired, community-oriented, friendly, approachable.
- Pastel aesthetic; encourages sharing and mutual help.

## Visual design & UX direction

- Pastel color palette (pink, lavender, peach, cream, baby blue, mint green), Pinterest-style card layouts, soft corners, generous whitespace.
- Vite-React frontend using JSX, Tailwind CSS, Lucide React icons.
- `@/` path alias maps to `src/`; prefer over deep relative imports.
- Pages built so far: landing, sign-in, sign-up, dashboard, skills, matches, exchanges, wallet, plus shared dialogs.
- Avatar feature: 16 unique illustrated characters (diverse hairstyles, outfits, accessories, genders, cute expressions, pastel backgrounds) stored as local image assets; avatar ID stored in DB.
- Avoid non-standard packages unless explicitly requested.

## Decisions, constraints & rationale

- Java backend cannot be compiled/run in current environment (no Java runtime). All backend changes are unverified.
- H2 in-memory database resets on every restart — existing demo accounts and seeded data do not persist between runs.
- The account "Pragati" does not exist in seeded data; cannot retroactively grant credits to it.
- Seeded demo accounts already have non-zero credits, so they would not qualify for the zero-balance welcome bonus.
- User entity partially updated: avatar field changed from colour to avatar ID. Response DTO and profile-update DTO updated.
- Backend currently in BROKEN state — will not compile. Old colour field still referenced in: exchange participant mapper, demo-account seeding. Skill listing entity lacks avatar field.
- Frontend still references old colour field — will break against new backend once compiled.
- Welcome bonus not yet implemented: no registration grant, no startup backfill, no one-time guard, no transaction entry.
- Avatar illustrations, picker, and app-wide display not yet built.
- Exchanges page balance display not yet added.
- Frontend build (`npm run build`) currently passes but only because frontend is untouched.
- Work blocked by file-edit tool usage limit; must resume in a new session.
- Storage currently in H2; Supabase migration remains an open decision.

## Open questions & assumptions

- Move data storage to Supabase, or keep H2? (pending user decision)
- Still to build: notifications page, profile page, settings page, README with setup steps.
- Resume order: (1) fix backend compile errors (exchange mapper, demo seeding, skill listing avatar field), (2) implement welcome bonus in backend, (3) create 16 avatar illustrations + picker, (4) update all frontend pages to display avatars, (5) add balance to exchanges page, (6) run frontend build.
- Backend functionality remains unverified due to no Java runtime.
- Small frontend cleanup items flagged before running full build.
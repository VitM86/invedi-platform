# Invedi Platform — frontend

White-label / multi-tenant marketplace for premium **new-build developments** in Europe
(initial focus: Portugal & Spain). This repo is the **frontend** (Next.js). It is currently a
hi-fidelity prototype with mock data — there is no backend yet; this is where backend
integration will happen.

**Live (prototype):** https://invedi-platform.vercel.app

---

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens in `src/app/globals.css`)
- **Mapbox GL JS v3** (terrain bird-view + live Explore/project maps)
- Deployed on **Vercel** (project `invedi-platform`)

## Prerequisites

- **Node.js 20+** (developed on Node 24)
- npm (a `package-lock.json` is committed)

## Getting started

```bash
git clone git@github.com:VitM86/invedi-platform.git
cd invedi-platform
npm install
cp .env.example .env.local   # then fill in the Mapbox token (optional for local dev)
npm run dev                  # http://localhost:3000
```

Without a Mapbox token the app still runs — every map falls back to a static placeholder.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) on `localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | optional (recommended) | Public Mapbox token (`pk.…`). Browser-safe; restrict by URL before production. See `.env.example`. |

`.env.local` is gitignored. On Vercel, env vars live in **Project → Settings → Environment Variables**.

## Project structure

```
src/
  app/                     # routes (App Router)
    page.tsx               # landing (/)
    explore/               # /explore — map / regions / grid discovery
    projects/[slug]/       # project page (+ units/[id] unit pages)
    comporta/              # terrain bird-view map demo
    globals.css            # design tokens (colors, fonts, animations)
  components/
    wireframe/             # product UI: header, footer, cards, landing/, project/, explore/, unit/
    map/                   # Mapbox components (TerrainMap, overlays)
  lib/
    mock-data.ts           # ⬅ all placeholder data (projects, units, regions, sales status)
    images.ts              # image assignment (exterior-first, deterministic)
public/images/             # local images (regions, exteriors, gallery renders)
scripts/                   # one-off dev utilities (image fetch, screenshots) — not app code
```

## Prototype notes (for backend integration)

- **All data is mock** and lives in [`src/lib/mock-data.ts`](src/lib/mock-data.ts) — projects,
  units, regions, and the sales-status fields. This is the seam to replace with a real API/DB.
- **`% sold` and `sales started`** are display-only mock values (see `salesStatusFor`); units
  count / availability are derived from the unit list. Promote to real fields when data lands.
- **Units gate** (project page) is a **prototype, not auth** — any email unlocks the detailed
  units table for the session (`src/components/wireframe/UnlockProvider.tsx`). Real auth is TBD.
- **Images** are prototype-only (Wikimedia Commons, CC) — replace with owned/licensed assets
  before production. Each project leads with an exterior shot (`src/lib/images.ts`).
- Search the codebase for `TODO(open-question)` — these flag decisions deferred to real data /
  product calls.

## Deployment & workflow

- Hosted on **Vercel** (project `invedi-platform`, aliased to `invedi-platform.vercel.app`).
- Recommended flow once the GitHub↔Vercel integration is connected:
  - push to **`main`** → Vercel builds & deploys to **production**;
  - open a **branch + Pull Request** → Vercel posts a **preview URL** for review before merge.
- Until the integration is connected, production is deployed manually with `vercel deploy --prod`.

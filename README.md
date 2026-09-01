# SR Stays

Verified PG (Paying Guest) discovery & management marketing site — built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS v4.

Content and structure are based on [SR-Stays-Landing-Page.md](./SR-Stays-Landing-Page.md).

This is a monorepo: the Next.js app lives in [`frontend/`](./frontend), and the FastAPI backend lives in [`backend/`](./backend). Run all commands below from inside `frontend/`.

## Stack

- **Next.js 16** (App Router, React Server Components)
- **TypeScript**
- **Tailwind CSS v4** — brand palette locked to Red `#E31E24` / Black `#1A1A1A` / White `#FFFFFF`
- Dynamically generated favicon & Open Graph image (`next/og`)
- SEO: per-page metadata, JSON-LD (`MobileApplication`, `FAQPage`, `LocalBusiness`), `sitemap.xml`, `robots.txt`, web manifest

## Project structure

```
frontend/src/
  app/
    layout.tsx              Root layout, global metadata, MobileApplication JSON-LD
    page.tsx                Homepage — assembles all landing sections
    sitemap.ts               Dynamic sitemap.xml
    robots.ts                Dynamic robots.txt
    manifest.ts               Web app manifest
    icon.tsx                  Generated favicon
    opengraph-image.tsx       Generated OG/Twitter share image
    pg-in-<city>/page.tsx     One static SEO landing page per city (Hyderabad, Bangalore,
                               Pune, Chennai, Mumbai, Delhi NCR)
  components/
    sections/                 Hero, Problem/Solution, Seeker & Owner features,
                               Maintenance, How It Works, Cities, Testimonials,
                               Why Choose Us, Download App, FAQ
    navbar.tsx, footer.tsx, logo.tsx, feature-card.tsx, json-ld.tsx
    city-page-content.tsx     Shared render logic + metadata builder for city pages
  lib/
    site-config.ts             Site-wide constants (name, URL, social links)
    cities.ts                  City data (used by homepage + city pages + sitemap)
    faqs.ts                    FAQ content (used by homepage + FAQPage JSON-LD)
```

### Why per-city folders instead of a `[city]` dynamic route

Next.js's App Router does not reliably support mixing literal text with a
dynamic segment in one folder name (e.g. `pg-in-[city]`) — it was tested and
silently drops the `pg-in-` prefix from the route regex, 404-ing every city
page. Since there are only 6 cities and the blueprint requires exact URLs
like `/pg-in-hyderabad` (no slash), each city gets its own thin `page.tsx`
that renders the shared `CityPageContent` component with a hardcoded slug.
To add a new city: add it to `src/lib/cities.ts`, then add one folder
`src/app/pg-in-<slug>/page.tsx` copying an existing one.

## Getting started

```bash
cd frontend
npm install
npm run dev       # http://localhost:3000
```

Other scripts:

```bash
npm run lint       # ESLint
npm run build      # Production build
npm run start      # Serve the production build locally
```

## Before going live

- [ ] Replace placeholder social links, app store/Google Play URLs, and contact
      email in `frontend/src/lib/site-config.ts`
- [ ] Swap the inline text logo (`frontend/src/components/logo.tsx`) for the real SR
      Stays logo file if/when available
- [ ] Replace the generated favicon/OG image (`frontend/src/app/icon.tsx`,
      `frontend/src/app/opengraph-image.tsx`) with real brand assets if desired
- [ ] Update `siteConfig.url` in `frontend/src/lib/site-config.ts` to the final domain
      (used in canonical URLs, sitemap, JSON-LD)
- [ ] Wire up real listings data from the `backend/` API — search and city
      pages currently use static placeholder content
- [ ] Add real testimonials, ratings, and Privacy/Terms/Refund policy pages
      (footer links currently point to `#`)

## Deploying to Vercel

This is a monorepo — the Next.js app is in `frontend/`, not the repo root.
Whichever option you use, **Vercel needs to know that**:

- **Project Settings → General → Root Directory → `frontend`.** Without this,
  Vercel looks for a Next.js app at the repo root and the build fails.
- `vercel.json` for the frontend now lives at `frontend/vercel.json`
  (it just adds a few security headers and pins the framework).

### Option A — Vercel's built-in Git integration (simplest)

1. Push this repo to GitHub.
2. In the [Vercel dashboard](https://vercel.com/new), import the repo.
3. Set **Root Directory** to `frontend` (see above) — Vercel then
   auto-detects Next.js with no further configuration needed.
4. Every push to `main` deploys to production automatically; every PR gets a
   preview deployment.

### Option B — GitHub Actions workflow (included in this repo)

`.github/workflows/deploy.yml` deploys via the Vercel CLI instead of Vercel's
native Git integration — useful if you want deploys gated behind CI passing,
or want deploy logs in GitHub Actions. Its jobs already run from `frontend/`.

To use it:

1. In the Vercel dashboard, create a project linked to this repo **but
   disable its Git integration** (Project Settings → Git → disconnect), to
   avoid double deployments from both Vercel and this workflow. Set its
   Root Directory to `frontend` as described above.
2. Get a token: Vercel dashboard → Settings → Tokens.
3. Get your Org ID and Project ID: run `npx vercel link` from inside
   `frontend/` locally once, then read `frontend/.vercel/project.json`.
4. Add these as GitHub repo secrets (Settings → Secrets and variables →
   Actions):
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
5. Push to `main` → production deploy. Open a PR → preview deploy.

`.github/workflows/ci.yml` runs lint, type-check, and build on every push and
PR regardless of which deploy option you choose.

## SEO notes

- One `<h1>` per page, structured `<h2>`/`<h3>` hierarchy throughout
- `MobileApplication` JSON-LD site-wide, `FAQPage` JSON-LD on the homepage and
  each city page, `LocalBusiness` JSON-LD on each city page
- `sitemap.xml` and `robots.txt` are generated at build time from
  `src/lib/cities.ts` — add a city there and it's automatically included
- Mobile-first responsive layout throughout

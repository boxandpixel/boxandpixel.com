# Box + Pixel — Claude Code Project Guide

This file is the source of truth for how this project is built and how Claude should assist with it. Update it as decisions are made.

---

## Project Overview

- **Site:** boxandpixel.com
- **Client/Owner:** Box + Pixel
- **Type:** Web Development Studio
- **Rebuild:** Astro, plain CSS + CSS Modules, Sanity-backed blog.
- **Goal:** three pages: home with positioning/differentiator and services overview. case studies landing, and contact.

---

## Tech Stack

| Layer       | Choice                                            |
|-------------|---------------------------------------------------|
| Framework   | Astro 7 (static output)                           |
| Language    | TypeScript (strict)                               |
| Styling     | Plain CSS + CSS Modules (`.module.css`)           |
| CMS         | Sanity (blog only) — `@sanity/astro`              |
| Rich text   | `astro-portabletext`                              |
| Images      | `@sanity/image-url` for Sanity assets             |
| Font        | Figtree Variable + JetBrains Mono Variable        |
| Deployment  | Netlify (`@astrojs/netlify` adapter)              |
| Email       | Resend (`resend`) — contact form only             |
| Package mgr | npm                                               |

**Tailwind is gone.** `tailwindcss`, `@astrojs/tailwind`, and `tailwind.config.cjs` were removed, along with the old purple/turquoise/pink palette. Do not add utility classes to markup — everything is CSS Modules + custom properties now.

---

## Color Scheme

**The site is dark-first.** The palette is editor-derived (One Dark / Tokyo Night family) — near-black navy neutrals with a small set of saturated syntax accents. This is deliberate: the studio sells development, and the palette should read as a development environment.

**Nord was tried and rejected** (Aug 2026). Its desaturated arctic ground was calmer but read as bland — the accents stopped registering as deliberate against the lighter base. If a future palette change is proposed, the lesson is that the near-black ground is doing real work: it is what makes a single saturated accent land.

Defined as CSS custom properties in `/src/styles/global.css`. Use these variable names everywhere — never hardcode hex values in components.

```css
:root {
  /* Neutrals */
  --color-base:         #0B0F17;  /* Page background */
  --color-raised:       #171E2A;  /* Raised bands, form fields */
  --color-line:         #232B3A;  /* Decorative hairlines */
  --color-line-strong:  #6A7791;  /* Interactive bounds — inputs */
  --color-muted:        #8A94A6;  /* Secondary text */
  --color-body:         #C7CEDB;  /* Body copy */
  --color-bright:       #E8ECF3;  /* Headings */

  /* Accents — the full One Dark ramp, at canonical values */
  --color-cyan:         #56B6C2;  /* 8.10 AAA */
  --color-blue:         #61AFEF;  /* 8.12 AAA */
  --color-purple:       #C678DD;  /* 6.51 AA  */
  --color-green:        #98C379;  /* 9.51 AAA */
  --color-yellow:       #E5C07B;  /* 11.10 AAA */
  --color-orange:       #D19A66;  /* 7.79 AAA */
  --color-red:          #E06C75;  /* 6.00 AA  */

  /* Semantic aliases — prefer these in components */
  --color-bg:            var(--color-base);
  --color-surface:       var(--color-raised);
  --color-border:        var(--color-line);
  --color-border-strong: var(--color-line-strong);
  --color-heading:       var(--color-bright);
  --color-text:          var(--color-body);

  --color-accent:            var(--color-cyan);    /* Primary */
  --color-accent-secondary:  var(--color-blue);    /* Second tier */
  --color-highlight:         var(--color-purple);  /* Display headline */
  --color-success:           var(--color-green);
  --color-warn:              var(--color-yellow);
  --color-stat:              var(--color-orange);
  --color-danger:            var(--color-red);
}
```

**Declare the ramp, ration the application.** All seven hues are declared because they are the vocabulary; that is not licence to use them. Three roles — `accent-secondary`, `success`, `stat` — have no consumer yet. They are reserved slots, not dead code: give them their intended job or leave them alone, and add a new alias rather than repurposing one for a one-off.

**Always consume a semantic alias, never a raw hue.** `var(--color-red)` in a component tells the next reader nothing; `var(--color-danger)` says why.

### Usage rules

| Token | Use for | Do not use for | Contrast vs base |
|---|---|---|---|
| `base` | Page background | Text | — |
| `raised` | Alternating bands, form fields, footer | Text | 1.15 |
| `border` | Decorative dividers and hairlines **only** | Input outlines, any bound a user must find | 1.35 |
| `border-strong` | Input outlines, interactive bounds | Decorative dividers (too loud) | 4.26 |
| `muted` | Secondary text, meta, nav separators | Body copy at small sizes | 6.27 AA |
| `text` | Body copy | Headings | 12.13 AAA |
| `heading` | Headings, hover states on dark | Long body copy | 16.19 AAA |
| `accent` (cyan) | CTAs, links, eyebrows, focus rings | Body text, large flat fills | 8.10 AAA |
| `accent-secondary` (blue) | Second-tier actions, case studies | Competing with the primary CTA | 8.12 AAA |
| `highlight` (purple) | Display headline accent | UI chrome, buttons, nav | 6.51 AA |
| `success` (green) | Confirmations | Decoration | 9.51 AAA |
| `warn` (yellow) | Warnings — recoverable states | Errors (use `danger`) | 11.10 AAA |
| `stat` (orange) | Numbers, metrics, meta | Body text | 7.79 AAA |
| `danger` (red) | Errors, destructive states | Warnings (use `warn`) | 6.00 AA |

**Two rules that are easy to get wrong:**

1. **`--color-border` vs `--color-border-strong`.** The decorative hairline measures 1.35:1 against the page — invisible as a form-field outline, and a WCAG 1.4.11 failure (non-text UI needs 3:1). Anything a user must locate and interact with uses `--color-border-strong`.
2. **Hover brightens, never darkens.** On a dark ground, `a:hover` goes to `--color-heading`. Darkening reads as "disabled."

Band alternation (`bg` → `surface`) is only 1.15:1. That is intentional and normal for dark UIs — the hairline border does the separating, not the fill.

Before adding any new color, run the contrast check against the background it will actually sit on. Do not add a fourth accent without asking.

---

## Font Map

**Two families**, both imported once in the root layout (`src/layouts/Layout.astro`):

```ts
import '@fontsource-variable/figtree';
import '@fontsource-variable/jetbrains-mono';
```

| Family | Variable | Used for |
|---|---|---|
| Figtree Variable | `--font-family-base` | Headlines, body copy — everything readable |
| JetBrains Mono Variable | `--font-family-mono` | Nav, eyebrows, buttons, form labels |

**Mono is for chrome, never for prose.** It carries the developer signal on labels and UI, and that signal is diluted the moment it lands on a paragraph. Headlines stay Figtree — mono at display size reads gimmicky and hurts legibility.

Type scale lives as CSS custom properties in `/src/styles/global.css`. All fluid sizes use `clamp()`; mobile is the floor, desktop the ceiling.

| Role | CSS Variable | Weight | Mobile | Desktop |
|---|---|---|---|---|
| Display (hero) | `--font-size-display` | 700 | 52px | 112px |
| H1 | `--font-size-h1` | 700 | 36px | 56px |
| Lead (hero sub) | `--font-size-lead` | 300 | 20px | 30px |
| H2 | `--font-size-h2` | 700 | 24px | 30px |
| H3 | `--font-size-h3` | 600 | 20px | 24px |
| H4 | `--font-size-h4` | 600 | 18px | 20px |
| Body | `--font-size-body` | 400 | 16px | 18px |
| Body strong | — | 600 | inherits body | — |
| Small / meta | `--font-size-small` | 400 | 14px | 14px |
| XS / caption | `--font-size-xs` | 400 | 12px | 12px |
| CTA / Button | `--font-size-small` | 600 | 14px | 14px (mono) |
| Nav | `--font-size-small` | 500 | 14px | 14px (mono) |

`--font-size-display` and `--font-size-lead` are hero-only. The gap between them is deliberate: at the old h4 size the subheading read as a caption under a billboard.

---

## Spacing & Layout

Defined as CSS custom properties in `/src/styles/global.css`.

```css
:root {
  --space-xs:   TBD;   /* e.g. 4px */
  --space-sm:   TBD;   /* e.g. 8px */
  --space-md:   TBD;   /* e.g. 16px */
  --space-lg:   TBD;   /* e.g. 32px */
  --space-xl:   TBD;   /* e.g. 64px */
  --space-2xl:  TBD;   /* e.g. 128px */

  --max-width:  TBD;   /* e.g. 1200px — max content width */
  --gutter:     TBD;   /* e.g. 24px — page side padding */
}
```

---

## Site Structure

Astro uses file-based routing from `/src/pages/`. Page copy source files live in `/content/`.

| Page         | Route file                       | Route           | Prerendered? |
|--------------|----------------------------------|-----------------|--------------|
| Home         | `src/pages/index.astro`          | `/`             | Yes          |
| Care plans   | `src/pages/care.astro`           | `/care`         | Yes          |
| Process      | `src/pages/process.astro`        | `/process`      | Yes          |
| For designers| `src/pages/designers.astro`      | `/designers`    | Yes          |
| About        | `src/pages/about.astro`          | `/about`        | Yes          |
| Privacy      | `src/pages/privacy.astro`        | `/privacy`      | Yes          |
| Contact      | `src/pages/contact.astro`        | `/contact`      | Yes          |
| Thanks       | `src/pages/thanks.astro`         | `/thanks`       | Yes          |
| Contact API  | `src/pages/api/contact.ts`       | `/api/contact`  | **No**       |

**There is no blog.** The routes were removed. `/src/lib` (Sanity client helpers,
GROQ queries, types) and the `@sanity/astro` integration are still wired up but
currently unused — kept because case studies are the likely next CMS-backed
section. If case studies end up hardcoded instead, delete `/src/lib`, `/studio`,
the integration in `astro.config.mjs`, and the `@sanity/*` + `astro-portabletext`
dependencies.

Case studies are planned but not built yet. Add the route, then add it to
`navLinks` in `src/data/nav.ts` — that array is the whole nav, and the mobile
menu toggle reappears as soon as it is non-empty.

`/api/contact` is the only route with `export const prerender = false`. Everything
else is static HTML.

---

## CMS — Sanity

- **Project ID:** `8a5r7mk5` (not a secret — it ships in the bundle)
- **Dataset:** `production`
- **Account:** brian@boxandpixel.com — **not** the personal brian.gunzenhauser@gmail.com account that owns "Personal Site" (`myjv8qkr`). Check the account before any write — see [Sanity account switching](#sanity-account-switching).
- **API version:** `2026-07-13`, pinned in `astro.config.mjs`
- **Studio:** standalone package in `/studio`, deployed to Sanity's hosting. Not embedded in the Astro app — the site stays fully static with no React shipped to visitors.

Config lives in `astro.config.mjs` via the `@sanity/astro` integration, which exposes the `sanity:client` virtual module. Import the client from there:

```ts
import { sanityClient } from "sanity:client";
```

### Sanity account switching

There are two Sanity accounts on this machine:

| Account                        | Owns                              | Used for            |
|--------------------------------|-----------------------------------|---------------------|
| brian@boxandpixel.com          | Box + Pixel Website (`8a5r7mk5`)  | **This repo**       |
| brian.gunzenhauser@gmail.com   | Personal Site (`myjv8qkr`)        | The personal site   |

Auth lives in **two independent surfaces, both machine-wide** — neither is scoped per project, so opening a different repo does **not** switch accounts for you:

1. **Sanity MCP server** — registered at *user* scope in `~/.claude.json`, so it loads in every repo with one shared OAuth session.
2. **Sanity CLI** — one credential file at `~/.config/sanity/config.json`, one logged-in user at a time. This is what `studio` dev/deploy uses.

**Check who you are:**

```bash
npx sanity debug          # CLI  → look at User: Email
```

For the MCP, call its `whoami` tool. Two things must be true: `email` is the account you intend, and `authMethod` is `OAuth` — if it ever reads `Bearer token`, a static token is back in play and needs removing.

**Verify by email, not user ID.** The same person has different Sanity user IDs on the two surfaces (MCP reports `gJoGg6VrD`, CLI reports `pAE73hd7u`, both for brian@boxandpixel.com). Matching IDs across surfaces will mislead you.

**To switch accounts:**

```bash
npx sanity logout
npx sanity login          # pick the target account
npx sanity debug          # confirm the email flipped
```

For the MCP: `/mcp` → Sanity → clear authentication, re-authenticate as the target account, then call `whoami` to confirm. Switch both back when returning to this repo.

**Getting it wrong is fail-safe, not destructive.** Each OAuth session only sees its own account's projects — `list_projects` as the business account returns *only* `8a5r7mk5`. A wrong-account write cannot silently land in the other project; it fails or finds nothing. Same for the CLI: deploying to a project you're not a member of errors out. The cost of forgetting to switch is a confusing error, not corrupted content.

### Content types in Sanity

| Type        | Used For                        |
|-------------|---------------------------------|
| `post`      | Blog posts                      |
| TBD         | Add types as schema grows       |

`post` fields: `title`, `slug`, `publishedAt`, `excerpt`, `coverImage` (with required alt), `body` (Portable Text + inline images). Defined in `/studio/schemaTypes/post.ts`.

### Client and queries

- Image URL builder + date helper: `/src/lib/sanity.ts`
- Named GROQ query strings: `/src/lib/queries.ts` — do not inline GROQ in `.astro` components. Wrap every query in `defineQuery` from `groq`.
- Sanity document types: `/src/lib/types.ts`

Blog pages are static. `[slug].astro` uses `getStaticPaths()`, so **content changes require a rebuild** — wire a Sanity webhook to the host's deploy hook. Only switch a route to SSR if it genuinely needs request-time data.

Static builds fetch server-side at build time, so no CORS origin is needed for the site itself. The Studio needs one only if you host it somewhere other than Sanity.

---

## Assets

Images live in `/public/images/`. Reference them as `/images/filename.ext`.

| Asset             | File                              | Ink                              | Used In              |
|-------------------|-----------------------------------|----------------------------------|----------------------|
| Logo (light ink)  | `/public/images/logo-dark.svg`    | `#E8ECF3` + `#56B6C2`            | **Header + Footer**  |
| Logo (dark ink)   | `/public/images/logo.svg`         | `#0B0F17` + `#56B6C2`            | Unused on site       |
| Logo (original)   | `/public/box+pixel.svg`           | old palette                      | Superseded           |
| Favicon           | `/public/favicon.svg`             | `#56B6C2`                        | Root layout          |
| Headshot          | `/public/images/brian-gunzenhauser.webp` | 600×600, pre-cropped circle, transparent corners | About (placeholder, from briangunzenhauser.com) |
| Headshot (1x/2x)  | `/public/images/brian-gunzenhauser-384.webp` | 384×384 resize of the above, 27 KB | About `src`; the 600px original is the `srcset` fallback for 3x screens |
| OG default image  | `/public/images/og-default.jpg`   | 1200×630, logo + home headline ("Building websites that perform.") on the horizon backdrop | Share previews, every page (`Layout` `image` prop overrides) |
| Apple touch icon  | `/public/apple-touch-icon.png`    | 180×180, cyan mark on `#0B0F17`  | iOS home screen, iMessage fallback |

**The site is dark everywhere, so both header and footer use `logo-dark.svg`** (the light-ink variant). `logo.svg` is kept, recolored to match, for light contexts off-site — email signatures, decks, invoices.

**Logo colors are baked into inline `style="fill:"` declarations** and cannot inherit CSS, since the logos load as `<img>`. Any future palette change must update these files by hand — 8 neutral fills and 5 accent fills per logo, 5 in the favicon. If that becomes a recurring chore, convert the logo to an inline Astro component using `currentColor`.

Add rows here as section-specific images are assigned.

---

## Design Direction

- **Tone:** Senior, precise, client-safe. Expert without being clubby.
- **Style:** Dark-first and editor-derived. Near-black navy ground, hairline structure, monospace on chrome, one cyan accent doing the work.
- **Visual references / inspiration:** Code editors (One Dark, Tokyo Night); the Linear / Vercel register for layout restraint.
- **The positioning (Sept 2026, in revision):** *the long tail is the business.* Design and builds are the entry; ongoing stewardship on retainer is the relationship and the revenue. Audience is **designers/agencies and site owners, as equals**. See `refs/box-and-pixel-positioning-2026-09.md`, which supersedes parts of the Aug doc. Headline: *"Building websites that perform."* with "perform" accented in yellow (Oct 21, 2026; replaced "The web studio that grows with you."; the footer tagline matches). **Never claim single-person accountability** ("one senior developer"): it raises bus-factor risk for the buyer. Only claim continuity safeguards that are true: domain and hosting are client-owned; repos and documentation are not yet (see the Sept doc). Sell stewardship **outcomes** (health, performance, security, roadmap), never hours. **Do not regress to a fidelity claim.** Built-as-drawn is proof, below the fold, never the lead.
- **The designer guardrail:** B+P now openly owns the client relationship after launch (the client pays B+P directly). The old rule against headlines that put B+P in front of the client is **retired**. The new test: **no copy may threaten the designer's *design* work.** Frame the long tail as relief ("launch it and hand it off; we keep it healthy and send the design work back to you").
- **Voice: no "we", "us" or "our".** Box + Pixel is one person today, and clients know it. "We" claims a team that doesn't exist; revisit once a PM or partner joins. Pick the voice by what the sentence does:
  - **Headlines:** drop the subject and lead with the reader — "Your design, built and kept running."
  - **Claims and promises:** "Box + Pixel" as the subject, varied with role nouns ("the studio that built it", "a senior developer").
  - **No first person anywhere on the site** (Oct 2026). No "I", "me" or "my" in Box + Pixel's voice — including the About bio and contact invitations. Refer to "Brian" or "Box + Pixel" so the person and the studio stay distinct. Third-person pronouns for Brian are fine in the About bio; use them to avoid starting consecutive sentences with "Brian". Reader-voice FAQ questions ("Do I own my site?") are fine: that's the client speaking.
  - Vary "Box + Pixel" with "Brian" and role nouns so third person doesn't read stiff, and don't put a single-person claim on site-owner pages (bus factor).
- **Serial (Oxford) comma, always.** "Secure, fast, and growing" — never "secure, fast and growing". One rule site-wide, including meta descriptions and the unlinked pages.
- **AI framing:** oversight is the headline, speed is the proof. "Agentic AI workflows, with a human at the helm." (Oct 2026; replaced "Agents do the typing, a senior developer signs off", which implied Box + Pixel does none of the hands-on work — a liability.) Keep "agentic AI" as a keyword. "At the helm" replaced "in the loop", which cast the human as a checkpoint in the AI's process rather than the one steering it. "Workflows" is deliberately vague: the tooling changes fast, so don't name specific tools or claim what the agents do. Never lead with cheaper/faster.
- **The tension to steer by:** the design has to read unmistakably developer **and** stay safe in a client meeting. Terminal-green, ASCII art, and hacker signifiers fail the second test — they read hobbyist, which undercuts the claim.
- **Launch scope (Oct 2026): home, process, about + contact.** The nav is About plus the Contact button (Process is footer-only) (`src/data/nav.ts`; the header drops its off-canvas menu if the list is ever empty). Home order: Hero → About intro (surface band, outlined CTA to `/about`) → contact CTA. **Selected work is parked (Oct 20, 2026)** until clients approve case studies: it is commented out in `src/pages/index.astro`, with restore steps beside it. `/about`, `/process` and `/privacy` are linked from the footer; `/care` and `/designers` still build but are unlinked. Revision notes: `refs/revision-20261001.md`. **Retainers are on hold (Oct 6, 2026)** until strategy and pricing are settled: no tiers, prices, "from $X" filters or stewardship band on the launch pages. Home and `/process` are a starting point, not the final positioning. Page briefs live in `refs/page-briefs.md`.
- **Things to avoid:** Multi-accent rainbows. Mono on prose. Light surfaces (the site is dark-first now — no white cards). Any new color that has not been contrast-checked.

---

## File & Folder Structure

```
/src
  /components        # Shared UI components (.astro + co-located .module.css)
    Header.astro     # Sticky header: logo left, nav right
    Nav.astro        # Renders `src/data/nav.ts` + the Contact button
    Footer.astro     # Dark footer, logo-dark.svg
    Hero.astro       # Headline + optional subheading; size="display" on home
    ServiceCallout.astro  # Repeatable service/focus band
    Section.astro    # Band wrapper: eyebrow, title, intro, "see more" link; default | surface
    AudienceSplit.astro   # Two linked audience cards (designers / site owners)
    ProcessSteps.astro    # Numbered build → launch → care steps
    WorkCards.astro       # Case study preview cards (accent-secondary client, stat tenure)
    PlanTiers.astro       # Care plan tiers with prices (stat color)
    SplitList.astro       # Two titled lists side by side (covered / not covered)
    Faq.astro             # Native <details> FAQ list
    Prose.astro           # Long-form text column (privacy, terms)
    ContactForm.astro     # Posts to /api/contact, no-JS friendly
  /data
    plans.ts         # Care plan tiers, shared by home and /care
  /layouts
    Layout.astro     # html shell, skip link, Header, <main>, Footer, meta, GA
  /lib
    sanity.ts        # urlFor() image builder, formatDate()
    queries.ts       # Named GROQ query strings
    types.ts         # Sanity document types
  /pages             # File-based routes
    index.astro
    contact.astro
    thanks.astro     # Post-submit landing
    /api
      contact.ts     # prerender = false — Resend send + redirect
  /styles
    global.css       # CSS custom properties, reset, base element styles
    contact.module.css    # Page-level styles
/studio              # Sanity Studio — its own npm package
  /schemaTypes
    post.ts
    index.ts
  sanity.config.ts
  sanity.cli.ts
/content             # Source .txt copy (one per page)
/public
  /images            # logo.svg (light bg), logo-dark.svg (dark bg)
```

**Styles.** Component styles are co-located with the component (`Foo.astro` + `Foo.module.css`). Page-level styles live in `/src/styles/<page>.module.css` — **not** in `/src/pages/`, which is route-only and will warn on any non-route file.

**Two logo variants.** The mark is near-white and disappears on the light background, so `/images/logo.svg` (Depth + Current ink) is for light surfaces and `/images/logo-dark.svg` for the Depth-colored footer. Pick the right one for the background.

---

## Build Conventions

### General
- Astro components are static by default. Only add a client directive (`client:load`, `client:visible`) when interactivity actually requires it.
- No inline styles — use CSS Modules or CSS custom properties
- All colors, fonts, and spacing via CSS variables defined in `global.css`
- Links: plain `<a href="...">` — Astro has no router component
- Astro collapses the newline between text and an inline `<a>` on the next line, so the space disappears. Write `text{" "}` before the line break.
- Images: use `<Image />` from `astro:assets` where possible; otherwise `<img>` with explicit `width`, `height`, and `alt`

### CSS
- `global.css` holds custom properties, the reset, and base element styles only. Nothing component-specific.
- One `.module.css` file per component, co-located in the same folder, imported in the component's frontmatter:
  ```astro
  ---
  import styles from './Card.module.css';
  ---
  <div class={styles.cardWrapper}>...</div>
  ```
- Class names in camelCase (e.g. `.heroTitle`, `.cardWrapper`)
- No global selectors inside module files
- Prefer modern CSS: custom properties, `clamp()` for fluid type, flexbox/grid, logical properties. No preprocessor.

### TypeScript
- Strict mode on
- Define types for all Sanity document shapes in `/src/lib/types.ts`
- No `any` — use `unknown` and narrow

### Components
- One component per file
- Props interface defined in the component frontmatter above the markup

### SEO / Metadata
- `Layout.astro` takes `title` and `description` props; every page passes them
- OG image defined per page where relevant

### Performance
- Lazy-load below-the-fold images (`loading="lazy"`)
- No third-party scripts unless necessary

---

## Development

### Site

```bash
npm run dev       # dev server at localhost:4321
npm run check     # astro check (TypeScript + .astro diagnostics)
npm run build     # runs check, then builds to /dist
npm run preview   # preview the production build
```

`npm run build` runs `astro check` first, so a type error fails the build. No ESLint is configured.

### Studio

```bash
cd studio
npm run dev       # Studio at localhost:3333
npm run deploy    # deploy to boxandpixel.sanity.studio
```

The Studio authenticates via the Sanity CLI. Confirm the account first — `npx sanity debug` must show brian@boxandpixel.com, not the personal Gmail account. (There is no `sanity whoami` command; `debug` is the identity check.) See [Sanity account switching](#sanity-account-switching).

---

## Deployment

- **Target:** Netlify, via the `@astrojs/netlify` adapter
- **Environment variables needed:**
  - `PUBLIC_SANITY_PROJECT_ID` = `8a5r7mk5`
  - `PUBLIC_SANITY_DATASET` = `production`
  - `RESEND_API_KEY` — **server only**, set in Netlify's env settings
  - `CONTACT_TO_EMAIL` — where form submissions are delivered
  - `CONTACT_FROM_EMAIL` — a Resend-verified sender

Astro exposes only `PUBLIC_`-prefixed vars to the client. The Sanity pair is public by design. No Sanity API token is needed — the site only reads published content from a public dataset. A token becomes necessary only if we add mutations or private-dataset reads, and it must be server-side only.

`RESEND_API_KEY` has no `PUBLIC_` prefix precisely so it never reaches the bundle. It is read in `src/pages/api/contact.ts`, which runs as a Netlify Function.

**The adapter does not cost us the static build.** Astro 7 removed `output: "hybrid"` — `output: "static"` (the default) now covers both cases, prerendering everything except routes that explicitly set `prerender = false`. Adding an adapter alone changes nothing about how pages are generated.

Because the blog is statically generated, publishing in Sanity does not update the live site until a rebuild. Set up a Sanity webhook → host deploy hook.

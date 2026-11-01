# design.md — Animated Personal Portfolio (Next.js + GSAP)

> **Audience:** an AI coding agent (Claude Code, Cursor, Copilot, etc.) building this site from scratch.
> **Reference:** architecture and motion approach modeled on `github.com/Tajmirul/portfolio-2.0` (MIT).
> **Rule zero:** this is a *re-creation of the approach*, not a copy. Do NOT copy that repo's source files, copy text, images, SVGs or personal content. Write original code and use the owner's own content. If any code is ever lifted verbatim, the MIT notice + a credit link are required.

> **Owner:** Abi Kurian Varghese — B.Tech CSE student (SNGCE / KTU, 2023–2027), Kochi, Kerala. Full-stack developer (React, Next.js, Astro, TypeScript, Supabase, Firebase). All real content for the site is in §4 and §15, taken from the owner's resume. Use it verbatim; do not embellish.

---

## 0. How to read this document

Every section is tagged:

- **[VERIFIED]** — read directly from the reference repo (`package.json`, `tailwind.config.ts`, folder listing).
- **[PROPOSED]** — a design decision made by this spec. The reference site's live visuals were not inspected, so colors, section order and copy are proposals. The owner may override any of them.
- **[SLOT]** — content the owner must supply. Never invent personal facts, clients, stats or testimonials. Use obvious placeholders (`{{PROJECT_1_TITLE}}`).

---

## 1. Product goal

A single-page, scroll-driven personal portfolio whose main differentiator is **motion quality**: smooth inertial scrolling, text reveals, pinned/scrubbed sections, and tasteful micro-interactions. Content is secondary to feel, but must stay readable, fast and accessible.

**Positioning:** this is an engineering portfolio. It must read like the work of someone who builds and understands systems: precise, plain-spoken and specific. No creative/media content anywhere (no video, color grading, music or camera material).

**Success criteria**
1. Feels like one continuous, buttery scroll experience at 60fps on a mid-range phone.
2. A visitor understands *who the owner is, what they do, and how to contact them* within 10 seconds.
3. Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.
4. Looks designed by a person, not generated (see §12 "Anti-generic rules").

---

## 2. Tech stack

### 2.1 Verified from the reference [VERIFIED]

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router, `app/` directory), dev with `next dev --turbopack` |
| UI library | React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3.4 + `tailwindcss-animate` |
| Component pattern | shadcn/ui-style: `class-variance-authority`, `clsx`, `tailwind-merge`, `components.json` |
| Animation | `gsap` + `@gsap/react` (`useGSAP` hook) |
| Smooth scroll | `lenis` |
| Icons | `lucide-react` + custom SVGs converted to components via `@svgr/cli` |
| Rich text from strings | `html-react-parser` |
| Analytics | `@next/third-parties` (Google Analytics component) |
| Package manager | `pnpm` |
| Lint/format | ESLint (next config) + Prettier (`.prettierrc.json`) |

**Owner fit:** the owner already works in React, Next.js, TypeScript, Tailwind and Astro, so this stack needs no learning curve. Keep Next.js 15 as specified. Do not switch to Astro unless the owner asks; the Lenis/GSAP setup in §5 is identical either way.

### 2.2 Folder layout [VERIFIED top level, PROPOSED internals]

```
/
├─ app/                  # routes, layout.tsx, page.tsx, globals.css, fonts
├─ components/
│  ├─ ui/                # primitives (Button, Badge, ...) shadcn-style
│  ├─ sections/          # Hero, About, Work, Experience, Contact, Footer
│  ├─ icons/
│  │  └─ svgs/           # raw .svg sources → generated TSX via `pnpm svgr:icons`
│  └─ providers/         # SmoothScroll (Lenis) provider
├─ lib/                  # utils.ts (cn), gsap.ts (plugin registration), data/
├─ types/                # shared TS types (Project, Experience, ...)
├─ public/               # images, og image, favicon, resume.pdf
├─ components.json
├─ tailwind.config.ts
├─ next.config.ts
└─ package.json
```

Scripts to include:
```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "svgr:icons": "svgr --title-prop --no-dimensions --typescript -d components/icons -- components/icons/svgs"
}
```

**Version note:** use GSAP ≥ 3.13 so `SplitText`, `ScrollTrigger` and `ScrollSmoother`-free workflows are all available from the single `gsap` package without a paid plugin registry.

---

## 3. Design tokens

### 3.1 Structural tokens [VERIFIED]

- **Color system:** shadcn-style HSL CSS variables consumed as `hsl(var(--token))`. Tokens: `background`, `background-light`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive` (each with `-foreground` pairs where applicable), plus `border`, `input`, `ring`, `chart-1..5`.
- **Dark mode:** `darkMode: ['class']`. The site is designed dark-first.
- **Radius:** `--radius` var; `lg = var(--radius)`, `md = calc(var(--radius) - 2px)`, `sm = calc(var(--radius) - 4px)`.
- **Fonts (overrides the reference repo's Instrument Serif + IBM Plex Sans + IBM Plex Mono):** three families via `next/font/google`, exposed in Tailwind 4 `@theme` as `--font-display`, `--font-sans`, `--font-mono`:
  - **Display:** Instrument Serif (400, normal + italic). Used for the name, section titles and project titles. Mix roman with italic inside one heading for a human, editorial feel.
  - **Body:** IBM Plex Sans (400, 500). Long-form reading text only.
  - **Mono:** IBM Plex Mono (400, 500). Used for header nav, buttons, quick facts, labels, metadata, stack lists, the footer and all small UI text.
  - **Banned for this site:** Inter, Roboto, IBM Plex Sans, Open Sans, Poppins, Montserrat, DM Sans, Space Grotesk, Geist, system-ui as a visible face. These read as default AI output.
- **Container:** centered, `padding: 1rem`, max width **1148px** at `xl` and `2xl`.
- **Section spacing:** custom spacing token `section = 250px` (use `py-section` on desktop; scale down on mobile, see §3.3).
- **Extra breakpoint:** `xs: 420px`.
- **Extra duration:** `duration-7000` (7s) for slow ambient transitions.

### 3.2 Palette [PROPOSED — owner may replace]

Dark, high-contrast, one confident accent. Define in `app/globals.css` under `:root` / `.dark`:

```css
:root {
  --background: 0 0% 4%;           /* near-black, not pure #000 */
  --background-light: 0 0% 8%;     /* raised surfaces / alternating sections */
  --foreground: 0 0% 96%;
  --card: 0 0% 7%;
  --card-foreground: 0 0% 96%;
  --muted: 0 0% 14%;
  --muted-foreground: 0 0% 62%;    /* must keep ≥ 4.5:1 on background */
  --primary: 72 100% 55%;          /* PLACEHOLDER accent — owner to choose */
  --primary-foreground: 0 0% 6%;
  --secondary: 0 0% 12%;
  --secondary-foreground: 0 0% 96%;
  --accent: 0 0% 16%;
  --accent-foreground: 0 0% 96%;
  --destructive: 0 72% 52%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 18%;
  --input: 0 0% 18%;
  --ring: 72 100% 55%;
  --radius: 0.75rem;
}
```

Rules:
- Exactly **one** accent hue. Use it for: primary CTA, link hover, active marker, selection color, focus ring. Nowhere else.
- No gradients on text. No purple→blue "AI" gradients. Flat color + type contrast does the work.
- Use `::selection` with the accent so small details feel intentional.

### 3.3 Typography scale [PROPOSED]

| Role | Font | Size (mobile to desktop) | Notes |
|---|---|---|---|
| Name (hero) | Instrument Serif | `clamp(3rem, 11vw, 9.5rem)` | sentence case, `leading-[0.92]`, `tracking-tight`, set on two lines: "Abi Kurian" / "Varghese" (see 4.1) |
| Section title | Instrument Serif | `clamp(2.25rem, 6vw, 4.5rem)` | sentence case, italic on one key word |
| Subhead | IBM Plex Sans | 1.25 to 1.5rem | weight 500 |
| Body | IBM Plex Sans | 1rem to 1.125rem | `leading-relaxed`, max 62ch |
| UI: nav, buttons, labels, quick facts, stack, footer | IBM Plex Mono | 0.75 to 0.8125rem | uppercase only for tiny labels; `tracking-wide`; never Inter-like sans for UI |

**Buttons:** rectangular, no radius, 1px border, mono text, a trailing arrow glyph that shifts 4px on hover, filled accent only for the single primary CTA. No pills, no gradients, no shadows.

**Long name safety:** the full name "Abi Kurian Varghese" must never overflow or force horizontal scroll. Use `text-balance`, `overflow-wrap: anywhere` as a last-resort fallback, and test at 320, 360 and 390px. In the header, show the full name from `sm` up and the monogram "AKV" below `sm`.

Spacing: `py-section` (250px) is the desktop value. Use `py-24 md:py-40 lg:py-section` so mobile does not become a desert.

---

## 4. Page architecture and real content

One route (`/`), full-width sections inside `<main>`. All copy below is from the owner's resume. Items marked **[PROPOSED copy]** are drafts for owner approval; everything else is factual and must be rendered as written.

### 4.1 Sections in order

1. **Header** — fixed. Wordmark "Abi Kurian Varghese" in mono at left (monogram "AKV" below `sm`); anchor nav right: About, Work, Stack, Experience, Contact. Hides on scroll down, shows on scroll up. Active link tracks the current section. Mobile menu.
2. **Hero**
   - H1 (Instrument Serif): `Abi Kurian Varghese`, broken into two lines: "Abi Kurian" then "Varghese" (italic on "Varghese"). Left-aligned.
   - Role line **[PROPOSED copy]**: "Full-stack developer"
   - Subline **[PROPOSED copy]**: "Computer Science student in Kochi. I build offline-first web apps and work with local AI models."
   - CTAs: "View work" (primary), "Get in touch" (outline).
   - **Hero has nothing above the name.** No eyebrow or kicker text (no "Kochi, Kerala / B.Tech CSE 2023-2027" line), no index or label text (no "Index 00 / Portfolio Specifications"), and no "Scroll to explore" cue or arrow. The name is the first thing on the page; location and degree appear only in About quick facts.
   - Optional hero visual: the owner has built 3D scroll-based canvas animations before; a restrained version (one subtle canvas or video loop) is welcome, but must degrade to a static image on mobile and reduced-motion.
3. **About** — three short paragraphs in IBM Plex Sans, left column; quick facts and the visual from 4.4 sit in the right columns on desktop. **[PROPOSED copy]**, built only from resume facts:
   > I'm a Computer Science student at SNGCE, Kochi, building full-stack Progressive Web Apps with secure backends in PostgreSQL and Firebase. I like understanding a system well enough to explain why it was built the way it was.
   >
   > Most of my work sits where data has to stay correct. A finance tracker that syncs offline changes to the cloud without losing parity, protected by Row Level Security. A campus bus tracker that uses a geolocation algorithm to decide how often it syncs.
   >
   > I also work below the web layer: Linux, C and socket programming, and relational schema design in MySQL. Lately I've been building with generative AI pipelines and running local models with Ollama.
   - **Quick facts** render as a mono spec sheet: two columns (label in muted, value in foreground), rows separated by hairlines, no bullets, no icons, no pills. Rows: Based in / Kochi, Kerala. Studying / B.Tech CSE, 2023 to 2027. College / SNGCE, KTU. Working with / Next.js, React, Supabase, Firebase. Exploring / Generative AI, local models.
   - No portrait. Use the visual in 4.4.
4. **Stack** — marquee or grouped grid. Groups exactly as listed on the resume:
   - Languages: JavaScript / TypeScript, Dart, Python, C, SQL
   - Web: React, Astro, Next.js, Node.js, Tailwind CSS
   - Data & cloud: Supabase, Firebase (Cloud Firestore), MongoDB, MySQL
   - OS & networking: Kali Linux, Ubuntu, WSL, VirtualBox
   - AI dev tools: Ollama, Claude Code, Roo Code, OpenCode
   - Tools: Git, GitHub, VS Code
5. **Selected Work** — ruled index with hover-to-expand rows. Full behavior in 4.5.
6. **Experience & Education** — vertical timeline with the scrubbed line (§5.3):
   - **ICT Academy of Kerala** — Machine Learning & Gen AI Intern (Remote), Jul 2026 – Aug 2026. Intensive program on generative AI pipelines, model training and prompting architectures. Built practical deployments of intelligent AI systems with local models such as Ollama.
   - **HackerRank** — Software Engineer Intern (Remote), June 2026. Assessed and verified core algorithmic logic, efficient data structuring and backend problem-solving.
   - **APJ Abdul Kalam Technological University / SNGCE, Kochi** — B.Tech Computer Science & Engineering, 2023 – 2027.
   - Smaller "Also" row: Academic seminar — *Personalized Intelligent Job Recommendation Based on Deep Learning in Elasticsearch Environment*; Certification — *Build with Gemini 3 via AI Studio*, Google for Developers.
7. **Contact**
   - Oversized email link with copy-to-clipboard: `abikurianvarghese@gmail.com`
   - LinkedIn: `linkedin.com/in/abi-kurian-varghese`
   - GitHub: `github.com/abikurian`
   - Location: Kochi, Kerala, India
   - **Do not publish the phone number on the public site** by default (scraping/spam risk). Offer it only inside the downloadable resume if the owner wants.
8. **Footer** — IBM Plex Mono, left-aligned on the same grid, hairline above. Contains: "Abi Kurian Varghese", Kochi, Kerala, year, email, LinkedIn, GitHub, "Back to top". No logo, no multi-column link farm, no "made with love" line.

### 4.2 Project data (`lib/data/projects.ts`)

Render exactly these facts. Do not add metrics, user counts, links or screenshots that the owner has not supplied.

```ts
export const projects: Project[] = [
  {
    slug: 'finance-tracker-pwa',
    title: 'Personal Finance Tracker PWA',
    featured: true,
    role: 'Full-stack',
    stack: ['React', 'Supabase', 'Dexie.js', 'Tailwind CSS'],
    summary:
      'Financial app with OCR receipt processing and expense prediction. A two-way sync engine keeps offline and cloud data in parity, protected by strict Row Level Security.',
  },
  {
    slug: 'smart-yatra-transit',
    title: 'Smart Yatra Transit',
    role: 'System architecture, presentation, live demo setup',
    stack: ['Flutter', 'Dart', 'Firebase'],
    summary:
      'Real-time fleet management app for tracking campus buses. Includes a custom geolocation algorithm that dynamically optimizes cloud sync frequency.',
    team: 'Built with two project partners', // names only if owner approves, see §15
  },
  {
    slug: 'smart-voting-system',
    title: 'AI-Powered Smart Voting System',
    stack: ['Python', 'Next.js', 'MongoDB'],
    summary:
      'Voting platform using machine learning for secure user verification and a tamper-proof tabulation environment.',
  },
  {
    slug: 'student-faculty-dbms',
    title: 'Student-Faculty DBMS',
    stack: ['MySQL', 'Relational schema design'],
    summary:
      'SQL schema management engine for multi-table entities with deep key relationships, complex joins and query indexing for high-throughput retrieval.',
  },
  {
    slug: 'network-system-config',
    title: 'Network & System Configuration',
    stack: ['Linux', 'C', 'Kali', 'Ubuntu', 'WSL', 'VirtualBox'],
    summary:
      'Terminal-driven system configuration and network socket programming across Linux environments in VirtualBox and WSL.',
    textOnly: true, // no image card; render as a compact row
  },
];
```

Layout hint: card 1 spans full container width with a large media area; cards 2–3 sit in an asymmetric two-column row (different heights); cards 4–5 render as compact list rows with hover reveal. If the owner wants to mention earlier Astro/React portfolios (glassmorphism, 3D canvas, brutalist layouts), put them in a one-line "Previous portfolios" footnote under Work, not as a card.

### 4.3 Types

```ts
// types/index.ts
export type Project = {
  slug: string;
  title: string;
  featured?: boolean;
  role?: string;
  stack: string[];
  summary: string;
  team?: string;
  textOnly?: boolean;
  cover?: { src: string; alt: string; width: number; height: number };
  href?: string;
  repo?: string;
  video?: string; // muted, playsInline, preload="none"
};
export type Experience = {
  org: string; role: string; start: string; end?: string; mode?: 'Remote' | 'On-site'; points: string[];
};
```

All content lives in `lib/data/*.ts`; **never hard-code copy inside JSX**.

### 4.4 About visual (replaces the portrait): live architecture diagram

An inline SVG, drawn in the accent color on hairlines, no fills, no gradients. It shows how the Personal Finance Tracker PWA keeps data in sync, using only facts from the resume:

`Device (React + Dexie.js, offline store)` to `Sync engine (two-way)` to `Supabase (Row Level Security)`, plus a small `Receipt OCR` node feeding the device store.

Behavior:
- Lines draw in on scroll (`stroke-dashoffset`, scrubbed) when the About section enters.
- After drawing, small square packets travel along the lines on a slow loop (about 6s). A packet reaches the sync engine, pauses briefly, then continues.
- Hovering a node highlights it and shows a one-line mono caption below the diagram (for example "Row Level Security: each user reads only their own rows").
- Mono labels, 12px, left-aligned to nodes. Straight orthogonal lines only, no curves, no icons.
- Reduced motion: render the final drawn state, no travelling packets.
- Mobile: same diagram scaled to container width, no hover captions; show the three captions as a static list under it.
- Keep labels accurate to the resume; do not add services, numbers or features that are not listed.

### 4.5 Selected Work: hover-to-expand index

Each project is a full-width row on the ruled index. Collapsed row: index number, title (display serif), one-line summary, year, and the stack in mono. Expanded row reveals the full details.

Expanded content (from the project data only): full summary, role, the key technical decision(s), complete stack, optional links, optional media slot.

Interaction:
- **Desktop hover (pointer: fine):** after an 80ms hover-intent delay the row expands. Height animates via `grid-template-rows: 0fr to 1fr` (or GSAP on a wrapper), 0.5s, `power3.out`. Inside, the detail columns stagger in (`y: 16 to 0`, `opacity`, 0.05s stagger). The hovered row's index and title shift to the accent color; the other rows dim to about 45% opacity. A thin accent line draws across the top of the row.
- **Only one row open at a time.** Moving the pointer to another row closes the previous one smoothly. Leaving the list closes all (or returns to the featured row open by default).
- **Keyboard:** each row's header is a `button` with `aria-expanded` and `aria-controls`; focus expands, Enter/Space toggles, Esc collapses.
- **Touch (no hover):** tap toggles the row (accordion). First row open by default.
- **Reduced motion:** no height or stagger animation; toggle instantly.
- Expanded content must be in the DOM (visually collapsed, not `display:none` removed) so it stays readable by assistive tech and indexable.
- No cards, borders or shadows around the expanded area. It is separated only by spacing and hairlines.

---

## 5. Motion system

Motion is the product. Treat it as a system, not decoration.

### 5.1 Global setup

`lib/gsap.ts` registers plugins once:
```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
export { gsap, ScrollTrigger, SplitText, useGSAP };
```

### 5.2 Lenis ⇄ GSAP sync (required, do exactly this)

```tsx
'use client';
import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
```
Mount in `app/layout.tsx`. Anchor-nav clicks must call `lenis.scrollTo(target)` (expose lenis via context) rather than native `scrollIntoView`.

### 5.3 Reusable animation primitives (build these first, as hooks/components)

| Primitive | Behavior | Defaults |
|---|---|---|
| `<RevealText>` | Split into lines (SplitText), mask-reveal each line upward | `yPercent: 110 → 0`, `duration 0.9`, `stagger 0.08`, `ease: 'power4.out'`, trigger `top 85%`, `once: true` |
| `<FadeUp>` | Generic block reveal | `y: 40 → 0`, `opacity 0 → 1`, `0.8s`, `power3.out` |
| `<Marquee>` | Seamless infinite x-loop | CSS or GSAP; duplicate children; pauses on hover |
| `<Magnetic>` | Button follows cursor within ~40px radius, springs back | `gsap.quickTo`, `elastic.out` release; **desktop pointer: fine only** |
| `<ScrubLine>` | Timeline line draws with scroll | `scaleY: 0 → 1`, `scrub: true`, `transformOrigin: top` |
| `<ParallaxImage>` | Image moves slower than container | `yPercent: -10 → 10`, `scrub: true` |

### 5.4 Hero entrance (load sequence)

1. Header fades down (0.6s).
2. Hero title lines reveal upward, staggered.
3. Subline + CTAs fade up.
4. (No scroll cue. Nothing else is added to the hero.)
Total ≤ 1.8s. Page content must be readable if JS fails (set initial hidden states from JS, not CSS, or gate with a `.js` class).

### 5.5 Rules (non-negotiable)

- Always animate with `useGSAP({ scope: ref })` so contexts are cleaned up (React strict mode double-invokes effects).
- Animate **only** `transform` and `opacity` (plus clip-path where needed). Never animate `width/height/top/left`.
- Call `ScrollTrigger.refresh()` after fonts and images load.
- Use `matchMedia` (`gsap.matchMedia()`) to branch desktop vs mobile; disable pin/scrub-heavy effects below `md`.
- Respect `prefers-reduced-motion: reduce`: no smooth scroll, no parallax, no marquee autoplay; keep simple opacity fades ≤ 200ms.
- `will-change: transform` only on elements actively animating; remove after.
- Never block interaction on animation completion.

---

## 6. Components (build order)

1. `cn()` util (`clsx` + `tailwind-merge`).
2. `Button` (cva variants: `primary | outline | ghost`; sizes `sm | md | lg`; optional `asChild`-style link rendering). Focus-visible ring uses `--ring`.
3. `Container` (`container mx-auto`, relies on tailwind container config).
4. `Section` wrapper (`id`, `aria-labelledby`, vertical padding token).
5. `SectionHeading` (small numbered label + the display font title + `RevealText`).
6. Motion primitives from §5.3.
7. `Header` + `MobileMenu` (focus trap, `Esc` to close, body scroll lock that works with Lenis: `lenis.stop()` / `lenis.start()`).
8. Sections in the order of §4.
9. `ProjectCard`, `TimelineItem`, `SkillPill`, `SocialLink`, `CopyEmail`.
10. `Analytics` (`GoogleAnalytics` from `@next/third-parties/google`, only rendered when `NEXT_PUBLIC_GA_ID` is set).

---

## 7. Interaction details

- **Links/buttons:** hover = accent color shift + 2px underline that scales from left (`origin-left`). 200–250ms `ease-out`.
- **Project card hover (desktop):** image `scale 1.05` over 0.6s; a pill ("View") follows the cursor via `quickTo`.
- **Copy email:** click copies, label swaps to "Copied" for 1.5s, `aria-live="polite"`.
- **Cursor:** native cursor by default. A custom cursor is optional and must be off on touch devices.
- **Scroll progress:** optional 2px accent bar at the top, driven by ScrollTrigger.

---

## 8. Responsive behavior

- Mobile first. Breakpoints: `xs 420`, `sm 640`, `md 768`, `lg 1024`, `xl 1148+` (container cap).
- Below `md`: single column, no pinning, no cursor effects, marquee slower, hero title wraps on 2–3 lines.
- Touch targets ≥ 44×44px.
- Test at 360, 390, 768, 1024, 1440, 1920 widths. No horizontal scroll at any width.

---

## 9. Performance budget

- Images via `next/image` with explicit `width/height`, `sizes`, AVIF/WebP, `priority` only on hero LCP image.
- Fonts via `next/font` (Instrument Serif + IBM Plex Sans + IBM Plex Mono), `display: 'swap'`, subset Latin, load only used weights.
- Dynamic-import heavy client components below the fold.
- Project preview videos: `muted loop playsInline preload="none"`, start on intersection, `poster` set.
- Total JS on first load target < 200KB gzip. Avoid adding dependencies beyond §2.
- No layout shift from animations (reserve space; animate transforms only).

---

## 10. Accessibility

- Semantic landmarks: `header`, `main`, `section[aria-labelledby]`, `footer`.
- One `h1` (hero). Section titles are `h2`.
- When SplitText wraps characters/lines, keep the original text accessible: set `aria-label` on the heading and `aria-hidden` on split spans.
- Visible focus styles on every interactive element; logical tab order; skip-to-content link.
- Color contrast ≥ 4.5:1 body, ≥ 3:1 large text/UI.
- Motion: see §5.5 reduced-motion rules.
- Meaningful `alt` on project images; decorative images `alt=""`.

---

## 11. SEO & metadata

- `metadata` export in `app/layout.tsx`: title template, description, `openGraph`, `twitter`, canonical, `metadataBase`.
- Generated `opengraph-image` (1200×630) and favicon set in `app/`.
- JSON-LD `Person` schema (name, jobTitle, url, sameAs).
- `app/sitemap.ts` and `app/robots.ts`.

---

## 12. Anti-generic rules (the "doesn't look AI-made" section)

The agent must actively avoid the default look of generated sites:

1. **No** gradient-blob backgrounds, glassmorphism cards stacked 3-deep, or neon-glow everything.
2. **No** emoji as section icons. Use real icons or none.
3. **No** "Crafting digital experiences" / "passionate developer" style filler copy. Use `{{SLOT}}` placeholders and let the owner write specifics.
4. **No** uniform card grids where every card is the same size with the same shadow. Vary scale: one large feature project, then smaller ones; mix aspect ratios.
5. Use **big type and real whitespace** as the main design device, not boxes and borders.
6. Keep radius and shadow vocabulary tiny: one radius token, almost no shadows (use borders and surface-tone steps instead).
7. Every animation must answer "what does this clarify or emphasize?" If nothing, remove it.
8. Imperfection is fine: asymmetric layout, an off-grid image, an oversized number. Perfect symmetry reads as template.

### 12.1 Engineering-portfolio direction (overrides any card/box styling above)

**No decorative micro-labels anywhere:** no eyebrow/kicker text above headings, no "Index 00" or "Portfolio Specifications" style tags, no "Scroll to explore" prompts, no tiny uppercase tracking-wide captions used as decoration. Mono text is for real content only (nav, buttons, quick facts, stack, dates, footer). Section numbering, if used, is a plain numeral beside the title, never a label phrase.

**Layout: no boxes.**
- Do **not** use bordered, rounded, shadowed cards anywhere. No tinted rounded containers, no icon-in-a-circle tiles, no pill badges for tech names.
- Projects render as a **ruled index**: full-width rows separated by 1px hairlines. Each row: index number (01, 02...), project title in the display serif, one-line summary, stack in a monospace font, year. On hover the row shifts in the accent color and a small preview appears. The featured project gets an expanded case-study row, not a bigger card.
- Stack renders as plain typed text lists grouped by label (like a spec sheet), not logo grids or pills.
- Text is mostly **left-aligned** on an asymmetric grid (e.g. 12-col, headings on cols 1–5, content on 6–12). Center alignment only for nothing; avoid it entirely.
- IBM Plex Mono is the second visual voice next to the display serif: dates, stack, indexes, labels, nav, buttons, footer.
- Section dividers are hairlines and big index numerals, not background color blocks and not wave/blob shapes.

**Case-study content for each project (facts from the resume only):** problem it solves → what was built → one or two technical decisions (e.g. two-way sync with Row Level Security, geolocation-based sync frequency) → stack. Short, factual, no marketing language.

**Copy voice (applies to every string on the site):**
- Plain, specific, first person, short sentences. Say what was built and how, not how great it is.
- Banned words and patterns: passionate, cutting-edge, seamless, robust, leverage, innovative, journey, crafting, elevate, "I build X that Y", three-adjective strings, rhetorical questions, "Whether you're...", exclamation marks, and em dashes in body copy.
- No fabricated numbers or claims. If a fact is not in section 4, leave it out.
- Headings are labels ("Selected work", "Experience"), not slogans.

**Visual restraint:** one radius value (or none; square corners are fine and more distinctive), no shadows, no glow, no glass, no gradients. Depth comes from type scale, spacing and hairlines. Use at most two font sizes per section outside the headings.

---

## 13. Build plan for the agent

**Phase 1 — Foundation:** scaffold Next 15 + TS + Tailwind 3.4, install deps from §2, configure `tailwind.config.ts` per §3.1, fonts, globals, `cn`, providers, Lenis sync.
**Phase 2 — Primitives:** Button, Section, SectionHeading, RevealText, FadeUp, Marquee, Magnetic.
**Phase 3 — Sections (static):** build all sections from `lib/data` with no animation; verify layout at all breakpoints.
**Phase 4 — Motion pass:** add hero sequence, reveals, scrub line, parallax, marquee, card hovers; gate by `matchMedia` + reduced motion.
**Phase 5 — Polish:** a11y audit, metadata/OG, analytics, Lighthouse, cross-browser (Safari iOS especially for Lenis/pinning).
**Phase 6 — Content swap:** replace every `{{SLOT}}` with owner content.

---

## 14. Acceptance checklist

- [ ] `pnpm build` passes with zero TS/ESLint errors.
- [ ] Lenis + ScrollTrigger in sync (pinned/scrubbed items don't jitter or drift).
- [ ] No GSAP leaks: navigating/hot-reloading doesn't stack duplicate triggers.
- [ ] Reduced-motion mode is usable and clean.
- [ ] Keyboard-only navigation reaches every control; mobile menu traps focus.
- [ ] Lighthouse mobile targets from §1 met.
- [ ] No horizontal overflow at 360px.
- [ ] No copied code, copy, images or branding from the reference repo.
- [ ] All personal content is owner-supplied.

---

## 15. Remaining owner-supplied items [SLOT]

Real text content is already in §4. The agent must leave clearly marked placeholders for only these:

- Cover image or short looping preview video for each project card (and live/repo links where they exist)
- Final accent color (see the palette note in §3.2)
- Approval of the [PROPOSED copy] lines in §4.1 (role line, hero subline, About paragraph)
- Whether to name the two Smart Yatra Transit project partners on the site (default: **do not**, use "built with two project partners")
- Resume PDF for download (decide whether it includes the phone number)
- Google Analytics measurement ID (optional)
- Domain name

**Agent rules for content:** never invent clients, metrics, testimonials, dates, links or job duties beyond what is written in §4. If something is missing, render a visible `{{SLOT_NAME}}` placeholder in development and hide the element in production builds.
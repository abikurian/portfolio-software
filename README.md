# Abi Kurian Varghese: Portfolio

Personal engineering portfolio of Abi Kurian Varghese, a Computer Science student (SNGCE, KTU) and full-stack developer based in Kochi, Kerala. Built around motion and interaction: smooth scrolling, stacked section transitions, a reactive hero grid and scroll-linked counters.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4 (CSS-first config with `@theme` in `app/globals.css`) |
| Animation | GSAP + ScrollTrigger (`@gsap/react`), Framer Motion (header nav highlight) |
| Smooth scroll | Lenis, synced to GSAP's ticker |
| Fonts | `next/font/google` (see `app/layout.tsx`) |
| Package manager | pnpm |

## Features

- **Full-screen hero** with an interactive canvas grid that warps toward the cursor and ripples on click (static on touch devices and with reduced motion)
- **Header nav** with a sliding highlight, active-section tracking and a full-screen menu on mobile
- **Stacked section transitions:** the next section rises over the current one, which stays frozen (desktop only)
- **Big scroll-linked numerals** that alternate sides by section and update on scroll or hover (for example, the project name and number while hovering Selected Work)
- **Selected Work** list where each row expands on hover (tap on touch) to show full details
- **Cursor follower** ring on desktop pointers
- **Tech marquee** at the bottom of the hero
- Light and dark section themes (black and lemon) driven by CSS tokens
- Respects `prefers-reduced-motion` everywhere; no animation-only content

## Getting started

Requirements: Node.js 20.9 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

### Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

### Testing on a phone

Run the dev server on your network and open the printed address on your phone (same Wi-Fi):

```bash
pnpm next dev -H 0.0.0.0
```

If Next.js blocks the request, add your computer's LAN address to `allowedDevOrigins` in `next.config`.

## Project structure

Paths are approximate; check the repo for the exact layout.

```
app/              Routes, root layout, global styles and design tokens
components/
  ui/             Reusable pieces (kinetic grid, story-scroll, cursor, counters)
  sections/       Hero, About, Work, Skills, Experience, Contact
lib/
  data/           All site content: projects, skills, experience
  utils.ts        Helpers (class merging)
public/           Static assets
design.md         Design and build spec
rules.md          Rules for keeping the design human, not AI-generic
about.md          Source notes about the owner and projects
```

## Editing content

All copy and project data lives in `lib/data`. Edit those files rather than the components.

- **Projects:** `Local Workforce Recruitment Portal` stays pinned first as the active project. Each project has a title, stack list (optional) and description. Optional lists must be omitted or empty arrays, never `null`.
- **Experience and skills:** edit the corresponding data files; the sections and counters update automatically.

## Design principles

The visual rules are written down so the site stays consistent:

- `design.md` describes tokens, layout, motion and accessibility targets.
- `rules.md` lists what to avoid (generic gradients, boxy cards, filler copy, cliché labels). Read it before changing the UI.

Key conventions:

- Colors come from CSS tokens in `globals.css`; two themes (`theme-dark`, `theme-lemon`) switch them per section.
- Animate only `transform` and `opacity`.
- Create GSAP animations with `useGSAP` so they are cleaned up on unmount.
- One Lenis instance for the whole app. Never call `ScrollTrigger.refresh()` from scroll or hover handlers.
- Hover-only behavior must also work on tap and keyboard.

## Accessibility and performance

- Skip link, semantic landmarks, visible focus states and keyboard-operable rows and menu
- Reduced motion: no stacking, rotation, marquee or grid animation
- Stacked-section effect, cursor follower and magnetic buttons are enabled only on larger screens with a fine pointer
- Targets: Lighthouse mobile Performance 90 or higher, Accessibility 95 or higher

## Deployment

Works on any Next.js host. For Vercel: import the repository, keep the default settings, and deploy. Set `NEXT_PUBLIC_GA_ID` only if you enable analytics.

## Credits

The animation approach was inspired by the open-source [Tajmirul/portfolio-2.0](https://github.com/Tajmirul/portfolio-2.0) (MIT). No code or content is copied from it. The stacked scroll transition is adapted from a 21st.dev component, and the interactive grid and sliding nav from community components, all rewritten to fit this site.

## License

All rights reserved unless a license file is added. Content (text, projects, personal details) belongs to Abi Kurian Varghese.

# ARISE — Project Context for AI Agents

> This file is the single source of truth for the project's design system, architecture, and conventions. Keep it in sync with AGENTS.md.

---

## 1. PROJECT OVERVIEW

**ARISE** is an open-source, gamified self-improvement web application that transforms real-life habits, fitness, learning, and productivity into an RPG-style progression system. Think *Solo Leveling meets Notion*.

| Stack | Details |
|---|---|
| Framework | Next.js 16.2.9 (App Router, React Server Components) |
| React | 19.2.4 (React 19 stable) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first config, **no** `tailwind.config.js`) |
| UI Library | shadcn/ui v4.11 (`base-nova` style, CSS variables, Lucide icons) |
| Animation | Framer Motion 12.40 |
| Auth / Backend | Supabase (SSR cookie-based auth via `@supabase/ssr`) |
| Icons | Lucide React 1.20 |
| Path alias | `@/*` → `./src/*` |

---

## 2. DESIGN SYSTEM — "Dark Cyberpunk RPG HUD"

The entire visual identity is built around a **dark cyberpunk RPG HUD** (Heads-Up Display) aesthetic, directly inspired by *Solo Leveling*. Every element — cards, buttons, inputs, panels — uses angular `clip-path` corners, scan-line overlays, pulsing cyan accents, and Orbitron type to evoke a futuristic hunting system interface.

### 2.1 Color Palette

| Token | Hex | Tailwind Token | Usage |
|---|---|---|---|
| **Background** | `#000000` | `bg-black` | All page backgrounds, card backgrounds |
| **Foreground** | `#ffffff` | `text-white` | Primary text, headings |
| **Accent (Cyan)** | `#00d4ff` | `text-cyan-400` / `bg-cyan-500` | Interactive highlights, glows, active states, progress bars, hover borders |
| **Cyan Glow** | `#00d4ff` | `--color-cyan-glow` | Box shadows (`shadow-[0_0_8px_#00d4ff]`), radial gradients |
| **Cyan Dim** | `rgba(0,212,255,0.1)` | `--color-cyan-glow-dim` | Subtle bg fills, ghost borders |
| **Secondary BG** | `#121212` | `bg-neutral-900` / `--color-secondary` | Card fills, muted surfaces, input backgrounds |
| **Deep Surface** | `#0a0a0a` | `bg-neutral-950` | Elevated card fills, table/cell backgrounds |
| **Border** | `#1a1a1a` | `border-neutral-800` / `--color-border` | All borders, dividers, input borders |
| **Subtle Border** | `#171717` | `border-neutral-900` | Intra-component separators, grid lines |
| **Muted Text** | `#888888` | `text-neutral-400` / `--color-muted-foreground` | Descriptions, secondary labels |
| **Dim Text** | `#525252` | `text-neutral-600` | Tertiary labels, metadata tags, system labels |
| **Faint Text** | `#404040` | `text-neutral-700` | Least-emphasis text (placeholder, HUD footer) |
| **Ghost Text** | `#262626` | `text-neutral-800` | Watermarks, footer metrics, decorative monospace |
| **Error (Red)** | `red-500/400/300` | `border-red-500/50`, `text-red-400` | Validation errors, destructive actions |
| **Success (Green)** | `green-500` | `text-green-500`, `bg-green-500` | Active/online status, ping indicators |
| **Ring / Focus** | `#00d4ff` | `ring-cyan-500` | Focus-visible outlines |
| **Outline Focus** | `rgba(0,212,255,0.2)` | `outline-color` | Default outline color for all elements |

**Rule**: There is no light mode. The entire app is dark-only. `#000000` is the universal base.

### 2.2 Typography

| Role | Font | CSS Variable | Weight | Usage |
|---|---|---|---|---|
| **Body** | Inter (Google Fonts) | `--font-inter` | 400–600 | Paragraphs, descriptions, input text, helper text |
| **Display / HUD** | Orbitron (Google Fonts) | `--font-orbitron` | 600–900 | Headings, labels, buttons, section titles, badges, system tags, nav links |

**Typographic patterns**:
- **Labels**: `font-orbitron text-[8px]–[10px] tracking-[0.25em]–[0.3em] uppercase text-neutral-600`
- **Section titles**: `font-orbitron text-2xl–4xl font-bold tracking-wider uppercase`
- **Body text**: `font-sans text-sm text-neutral-400 leading-relaxed`
- **Metric values**: `font-orbitron text-xs font-bold text-cyan-400`
- **HUD metadata**: `font-mono text-[8px]–[9px] tracking-wider text-neutral-800`

**Headline gradient**: `text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-cyan-400` — used on hero text and welcome messages.

### 2.3 The Clip-Path Motif (Angular Corners)

This is the single most defining visual pattern. Almost every interactive element and card uses `clip-path: polygon()` to create **chamfered (cut-corner) rectangles** instead of rounded corners. The standard polygon:

```css
clip-path: polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%);
```

**Convention**: Cut the top-left and bottom-right corners. The inset values vary by element size:

| Element | Cut size | Clip-path |
|---|---|---|
| Buttons / Submit | 6px | `polygon(0 6px, 6px 0, 100% 0, 100% calc(100%-6px), calc(100%-6px) 100%, 0 100%)` |
| Cards / Panels | 8–12px | Same pattern with 8px or 12px offsets |
| Inputs | 4px | Same pattern with 4px offsets |
| Badges / Checkboxes | 2–3px | Same pattern with 2–3px offsets |
| Icons (in SystemCard) | 3px | Same pattern with 3px offsets |
| Mobile menu | 8px | Same pattern with 8px offsets |

**Rounded corners (`rounded-*`) are never used on primary UI elements.** Only avatars and spinners use `rounded-full`.

### 2.4 Corner Accent Lines

HUD panels and cards feature decorative corner accent `<span>` elements — short horizontal and vertical lines at the corners:

- **Cyan accents** (top-left, bottom-right): `bg-cyan-500/70` or `bg-cyan-500/50`, 1px wide/tall, ~20px long
- **Dim accents** (top-right, bottom-left): `bg-neutral-700/50`, 1px wide/tall, ~20px long

This pattern is used in: `AuthCard`, `HunterStatusPanel`, dashboard status cards, dashboard profile panel.

### 2.5 Scan-Line Overlay

The `.hud-scanline` class adds a slowly-moving horizontal scan line across the element:

```css
.hud-scanline::after {
  /* 2px gradient line that translates vertically over 6s */
  background: linear-gradient(to-right, transparent, rgba(0,212,255,0.2), transparent);
  animation: scan 6s linear infinite;
}
```

Used on: `AuthCard`, `HunterStatusPanel`.

### 2.6 Cyberpunk Grid Background

A repeating CSS grid of 1px lines that creates a technical blueprint effect:

```
bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)]
bg-[size:4rem_4rem]
[mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]
opacity-70
```

Used on: Hero section, auth background, dashboard.

### 2.7 Hunter Silhouette SVG

A stylized standing figure SVG with a cyan-to-black gradient (`#00d4ff → #000000`), placed at very low opacity (`opacity-[0.06]` to `opacity-10`) as a background decorative element. Used on: hero section, auth background.

### 2.8 Status Indicators

| Pattern | Implementation | Usage |
|---|---|---|
| **Pulse dot** | `w-1.5 h-1.5 bg-cyan-500 animate-pulse rounded-full` | System status badges |
| **Ping dot** | `w-1 h-1 bg-green-500 rounded-full animate-ping` | Active/online status |
| **System label** | `font-orbitron text-[9px] tracking-[0.3em] text-neutral-600 uppercase` | "System Online", "SYS.VER // 1.0.0" |
| **HUD footer** | `font-mono text-[8px] text-neutral-800 tracking-wider` | "ARISE.SYS // AUTH_MODULE" |

---

## 3. COMPONENT ARCHITECTURE

### 3.1 Current Directory Structure

```
src/
├── app/                       # Next.js App Router
│   ├── (auth)/               # Route group for auth pages (no URL prefix)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── auth/                 # Auth actions + OAuth callback
│   │   ├── actions.ts        # All server actions (login, signup, onboarding, etc.)
│   │   └── callback/route.ts # OAuth callback handler
│   ├── dashboard/page.tsx    # Protected dashboard — renders <StatusDashboard> (STATUS screen)
│   ├── onboarding/           # Onboarding flow
│   │   ├── page.tsx          # Redirects to current step
│   │   ├── layout.tsx        # Onboarding layout wrapper
│   │   ├── system-acceptance/page.tsx
│   │   ├── player-registration/page.tsx
│   │   └── body-metrics/page.tsx
│   ├── layout.tsx            # Root layout (fonts, metadata)
│   ├── page.tsx              # Landing page (public home)
│   └── globals.css           # Theme tokens + animations
├── components/
│   ├── auth/                 # Auth page components
│   │   ├── AuthLayout.tsx, AuthBackground.tsx, AuthCard.tsx
│   │   ├── LoginForm.tsx, SignupForm.tsx
│   ├── dashboard/            # STATUS screen (Solo Leveling HUD dashboard)
│   │   ├── mock-data.ts               # Typed mock arrays (player, attributes, quests, skills)
│   │   ├── primitives.tsx             # HudPanel, PanelHeader, ProgressBar, CornerAccents, StatTile
│   │   ├── DashboardBackground.tsx    # Grid + glow + memoized floating particles
│   │   ├── SystemNav.tsx              # Centered SYSTEM title + tabs (STATUS active)
│   │   ├── ProfileFrame.tsx           # Circular holographic frame: rings, scanner, avatar
│   │   ├── LeftColumn.tsx             # Status + Attributes + Stat Points + Inventory
│   │   ├── CenterColumn.tsx           # ProfileFrame + Life Performance + Physical Fitness
│   │   ├── RightColumn.tsx            # Active Quests + Skills + Mental Discipline
│   │   └── StatusDashboard.tsx        # Top-level 3-col composition (client)
│   ├── landing/              # Landing page sections
│   │   ├── Navbar.tsx, HeroSection.tsx, Footer.tsx
│   │   ├── CoreSystemsSection.tsx, SystemCard.tsx
│   │   ├── OpenSourceSection.tsx, HunterStatusPanel.tsx
│   ├── onboarding/           # Onboarding components
│   │   ├── OnboardingLayout.tsx, OnboardingBackground.tsx
│   │   ├── OnboardingCard.tsx, OnboardingInput.tsx, StepProgress.tsx
│   │   ├── SystemAcceptanceForm.tsx, PlayerRegistrationForm.tsx
│   │   └── BodyMetricsForm.tsx
│   ├── ui/                   # Reusable UI primitives (shadcn + custom)
│   │   ├── button.tsx, badge.tsx, card.tsx
│   │   ├── animated-group.tsx, text-effect.tsx
│   │   └── radial-orbital-timeline.tsx, radial-orbital-timeline-demo.tsx
│   └── icons/                # Custom SVG icons (e.g., Github.tsx)
├── lib/
│   ├── utils.ts              # cn() utility (clsx + tailwind-merge)
│   └── onboarding/           # Onboarding state utilities
│       ├── index.ts, state.ts
├── utils/
│   └── supabase/             # Supabase clients
│       ├── client.ts         # Browser client
│       ├── server.ts         # Server components
│       └── proxy.ts          # Middleware client
├── proxy.ts                  # Next.js middleware (route protection)
└── supabase/migrations/      # Database migrations (run manually in Supabase)
```

### 3.2 Component Categories

| Category | Components | Pattern |
|---|---|---|
| **Auth** | `AuthLayout`, `AuthBackground`, `AuthCard`, `LoginForm`, `SignupForm` | Two-column layout: left branding panel (desktop only) + right form card |
| **Landing** | `Navbar`, `HeroSection`, `HunterStatusPanel`, `CoreSystemsSection`, `SystemCard`, `OpenSourceSection`, `Footer` | Full-page sections with consistent section headers |
| **Onboarding** | `OnboardingLayout`, `OnboardingBackground`, `OnboardingCard`, `SystemAcceptanceForm`, `PlayerRegistrationForm`, `BodyMetricsForm` | Step-by-step onboarding card flow |
| **UI Primitives** | `Button`, `Badge`, `Card` (shadcn), `AnimatedGroup`, `TextEffect`, `RadialOrbitalTimeline` | shadcn base + custom variants |
| **Icons** | `Github` | Inline SVG components |

### 3.3 Button Component

The `Button` component (`src/components/ui/button.tsx`) is the most complex UI primitive and the canonical example of the clip-path technique. It uses `before:`/`after:` pseudo-elements as border and background layers:

- **`before:`** = border layer (slightly larger, sits at `-z-20`)
- **`after:`** = inner background layer (inset 1px, sits at `-z-10`)
- Both use `clip-path` with slightly different polygon insets (border: 6px, inner: 5.5px)

**7 variants**: `primary`, `secondary`, `cyan`, `ghost`, `outline`, `link`, `destructive`
**3 sizes**: `sm` (h-8), `default` (h-10), `lg` (h-12)
**All text is uppercase Orbitron** with explicit `tracking-widest`.

| Variant | Border (before) | Inner (after) | Text |
|---|---|---|---|
| `primary` | `bg-neutral-800` → hover `bg-cyan-500` | `bg-white` → hover `bg-black` | `text-black` → hover `text-white` |
| `secondary` | `bg-neutral-800` → hover `bg-neutral-700` | `bg-black` | `text-neutral-400` → hover `text-white` |
| `cyan` | `bg-cyan-500/30` → hover `bg-cyan-400` | `bg-cyan-950/20` → hover `bg-cyan-950/50` | `text-cyan-400` → hover `text-cyan-300` |
| `ghost` | `bg-transparent` → hover `bg-neutral-800` | `bg-transparent` | `text-neutral-500` → hover `text-neutral-200` |
| `outline` | `bg-white/20` → hover `bg-white/40` | `bg-transparent` → hover `bg-white/10` | `text-white/80` → hover `text-white` |
| `link` | `bg-transparent` | `bg-transparent` | `text-cyan-400` → hover `text-cyan-300` + underline |
| `destructive` | `bg-red-500/30` → hover `bg-red-400` | `bg-red-950/20` → hover `bg-red-950/50` | `text-red-300` → hover `text-red-200` |

### 3.4 Section Header Pattern

Every landing page section follows this header pattern:

```tsx
<div className="flex items-center gap-3">
  <span className="w-1.5 h-1.5 bg-cyan-500" />           {/* cyan dot */}
  <span className="font-orbitron text-[10px] tracking-widest text-cyan-400 font-semibold uppercase">
    MODULE DIRECTORY                                        {/* section tag */}
  </span>
</div>
<h2 className="font-orbitron text-2xl md:text-3xl font-bold tracking-wider text-white uppercase">
  CORE PROGRESSION SYSTEMS                                 {/* section title */}
</h2>
<p className="font-sans text-neutral-500 text-xs md:text-sm leading-relaxed">
  Every module is designed to...                           {/* section description */}
</p>
```

### 3.5 Form Input Pattern

All form inputs use the `InputField` sub-component pattern (defined locally in `LoginForm` and `SignupForm`, not shared):

- Label: `font-orbitron text-[9px] tracking-widest text-neutral-500 uppercase`
- Input: `bg-neutral-900/60 border border-neutral-800 focus:border-cyan-500/50` + clip-path
- Error state: `border-red-500/50 focus:border-red-400/70`
- Placeholder text: `text-neutral-700`
- Left icon: positioned at `left-3 top-1/2 -translate-y-1/2 text-neutral-700`
- Right adornment: positioned at `right-3 top-1/2 -translate-y-1/2`

### 3.6 Auth Card Layout

Auth pages share `AuthLayout` → `AuthCard` wrapping:
- `AuthLayout`: Two-column split (left: `AuthBackground`, right: form card area)
- `AuthCard`: HUD card with corner accents, scanline, `ARISE // AUTH SYSTEM` header
- All auth pages: Login, Signup, Forgot Password, Reset Password

---

## 4. ANIMATIONS & MOTION

### 4.1 Animation Libraries

| Library | Usage |
|---|---|
| **Framer Motion** | Page transitions, hover/tap states, staggered reveals, `AnimatePresence` for mount/unmount |
| **tw-animate-css** | CSS animation utilities imported in globals.css |
| **CSS @keyframes** | `scan`, `progressFill`, `gridReveal`, `orbitalPulse`, `orbitalPing` |

### 4.2 Framer Motion Patterns

| Pattern | Implementation | Where Used |
|---|---|---|
| **Card entrance** | `initial={{ opacity: 0, y: 24 }}` `animate={{ opacity: 1, y: 0 }}` `transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}` | AuthCard |
| **Stagger group** | `<AnimatedGroup preset="blur-slide">` | Hero content, CTA buttons |
| **Hover/tap** | `whileHover={{ scale: 1.01 }}` `whileTap={{ scale: 0.99 }}` | Buttons, submit buttons |
| **Error appear** | `<AnimatePresence>` + `initial/animate/exit` | Form errors |
| **Success state** | `initial={{ opacity: 0, scale: 0.97 }}` `animate={{ opacity: 1, scale: 1 }}` | Signup success |
| **Particle float** | `animate={{ y: [0, -900], opacity: [0, 0.7, 0] }}` `transition={{ repeat: Infinity }}` | AuthBackground particles |
| **Scan line** | `animate={{ top: ['0%', '100%'] }}` `transition={{ repeat: Infinity }}` | AuthBackground scan line |

### 4.3 `AnimatedGroup` Presets

Available animation presets: `fade`, `slide`, `scale`, `blur`, `blur-slide`, `zoom`, `flip`, `bounce`, `rotate`, `swing`.

### 4.4 `TextEffect` Presets

Available text animation presets: `blur`, `shake`, `scale`, `fade`, `slide`. Splits text by word, character, or line.

### 4.5 CSS-Only Animations

| Keyframe | Duration | Easing | Purpose |
|---|---|---|---|
| `scan` | 6s/8s | linear, infinite | Vertical scan line |
| `progressFill` | 1.5s | `cubic-bezier(0.16, 1, 0.3, 1)` forwards | Progress bar horizontal fill |
| `gridReveal` | view-timeline | linear both | Scroll-driven section reveal |
| `orbitalPulse` | — | 50% opacity dip | Timeline node pulse |
| `orbitalPing` | — | scale(2) + fade out | Timeline node ping ring |

---

## 5. ROUTING & AUTH

### 5.1 Route Map

| Path | Component | Type |
|---|---|---|
| `/` | `HomePage` | Server Component |
| `/login` | `(auth)/login/page.tsx` | Client page (AuthLayout) |
| `/signup` | `(auth)/signup/page.tsx` | Client page (AuthLayout) |
| `/forgot-password` | `(auth)/forgot-password/page.tsx` | Client page (AuthLayout) |
| `/reset-password` | `(auth)/reset-password/page.tsx` | Client page (AuthLayout) |
| `/auth/callback` | `auth/callback/route.ts` | GET route (OAuth exchange) |
| `/onboarding` | `onboarding/page.tsx` | Protected, redirects to current step |
| `/onboarding/system-acceptance` | `onboarding/system-acceptance/page.tsx` | Protected step 1 |
| `/onboarding/player-registration` | `onboarding/player-registration/page.tsx` | Protected step 2 |
| `/onboarding/body-metrics` | `onboarding/body-metrics/page.tsx` | Protected step 3 |
| `/dashboard` | `dashboard/page.tsx` | Protected Server Component (after onboarding) |

### 5.2 Middleware (`src/proxy.ts`)

- **Protected routes** (`/dashboard`, `/inside-system`, `/onboarding`): Redirects unauthenticated users to `/login?next=<return_url>`
- **Auth routes** (`/login`, `/signup`, `/forgot-password`, `/reset-password`): Redirects authenticated users to `/dashboard` or their onboarding step
- Uses Supabase middleware client (`@supabase/ssr`) for cookie-based session validation

### 5.3 Onboarding Flow

The onboarding is a 3-step process:
1. **System Acceptance** (`/onboarding/system-acceptance`) — User accepts the ARISE contract
2. **Player Registration** (`/onboarding/player-registration`) — User provides name, age, and primary goal
3. **Body Metrics** (`/onboarding/body-metrics`) — User enters height and weight

On completion, user is redirected to `/dashboard`.

**Storage**: Onboarding data is stored in Supabase:
- `public.onboarding_contracts` — Stores contract acceptance
- `public.player_profiles` — Stores player registration + body metrics

⚠️ **Important**: Run the migration in `supabase/migrations/20260620000000_onboarding_schema.sql` in your Supabase SQL Editor before the onboarding flow will work.

### 5.4 Server Actions (`src/app/auth/actions.ts`)

All auth operations use Next.js Server Actions:
- `login(formData)`, `signup(formData)`, `logout()`
- `acceptSystemContract()`, `declineSystemContract()`
- `submitPlayerRegistration(formData)`, `submitBodyMetrics(formData)`
- `forgotPassword(formData)`, `resetPassword(formData)`

### 5.5 Supabase Clients

| File | Context | Usage |
|---|---|---|
| `src/utils/supabase/client.ts` | Browser | Client components |
| `src/utils/supabase/server.ts` | Server | Server components (`createServerClient` + `cookies()`) |
| `src/utils/supabase/proxy.ts` | Middleware | Route protection (`createServerClient` + request/response cookies) |

---

## 6. PRODUCTION STANDARDS

### 6.1 General

- **No `tailwind.config.js`**: Tailwind v4 uses CSS-first configuration in `globals.css` `@theme {}` block
- **Path alias**: Use `@/` for all imports (`@/components/`, `@/lib/`, `@/utils/`)
- **Client components**: Mark with `'use client'` directive; keep server components default
- **No CSS modules**: All styling via Tailwind utility classes + `globals.css`
- **Conditional classes**: Use `cn()` from `@/lib/utils` (combines `clsx` + `tailwind-merge`)
- **Icon sizing**: Always use explicit size props (e.g. `<Icon size={13} />` or `<Icon className="w-4 h-4" />`)
- **Font usage**: `font-orbitron` for HUD/display elements, `font-sans` (Inter) for body/description text
- **Uppercase**: All Orbitron text uses `uppercase` class
- **Tracking**: Orbitron uses `tracking-widest` (labels/buttons) or `tracking-wider` (headings); body text inherits

### 6.2 Performance

- **Image optimization**: Use `next/image` for all images (automatic optimization, lazy loading)
- **Font optimization**: Google Fonts loaded via `next/font/google` with `display: swap`
- **Lazy load components**: Use `dynamic()` for heavy client components when possible
- **Minimize client bundles**: Keep data-fetching in Server Components; use client components only for interactivity
- **Preload critical assets**: Use `priority` prop on above-fold images

### 6.3 Component Patterns

- **Pre-computed static data**: Define arrays/objects outside components to avoid SSR hydration mismatches (see `PARTICLES` and `STATS` in `AuthBackground`, `attributes` in `HunterStatusPanel`)
- **`useTransition`**: Use for async server action calls (login, signup, OAuth) — not `useState` for loading
- **Form validation**: Client-side validation before calling server actions; set errors in local state
- **Error display**: `AnimatePresence` + `motion.p`/`motion.div` for mount/unmount transitions
- **Loading state**: Custom spinner (`border border-cyan-700 border-t-cyan-400 animate-spin`) with `{isPending ? <Spinner /> : icon}` pattern

### 6.4 File Naming

- Pages: `page.tsx` (App Router convention)
- Components: `PascalCase.tsx` (e.g. `AuthCard.tsx`, `HeroSection.tsx`)
- Layouts: `layout.tsx` (App Router convention)
- Utilities: `camelCase.ts` (e.g. `utils.ts`, `client.ts`, `server.ts`)
- Middleware: `proxy.ts` (assigned as `middleware.ts` equivalent by Next.js config)
- Route handlers: `route.ts` (e.g. `auth/callback/route.ts`)
- Server actions: `actions.ts` (e.g. `app/auth/actions.ts`)

### 6.5 State Management

- **No global state library** — React local state + server actions + Supabase auth
- **Form state**: `useState` per field, with error clearing on change
- **Scroll state**: `useEffect` + `addEventListener('scroll', ...)` (Navbar)
- **Menu state**: Simple boolean `useState` toggle (Navbar mobile menu)

### 6.6 Code Quality

- Run `npm run lint` before committing
- Run `npm run build` to verify production build
- Use TypeScript strictly — avoid `any` types
- Keep components focused — extract when > 200 lines
- Document complex logic with comments

---

## 7. LAYOUT & SPACING

### 7.1 Page Layout

| Section | Container | Padding | BG |
|---|---|---|---|
| Navbar | `max-w-7xl mx-auto px-6` | `py-4` (scroll: `py-3`) | Transparent → `bg-black/80 backdrop-blur-md` on scroll |
| Hero | `max-w-7xl mx-auto px-6` | `pt-32 pb-20` | `bg-black` + grid + glow |
| Core Systems | `max-w-7xl mx-auto px-6` | `py-24` | `bg-black border-y border-neutral-900` |
| Open Source | `max-w-7xl mx-auto px-6` | `py-16` | `bg-black` |
| Footer | `max-w-7xl mx-auto px-6` | `py-8` | `bg-black border-t border-neutral-900` |
| Auth pages | Two-column flex split | `p-6 sm:p-10` | `bg-black` |
| Onboarding | Centered single card | `p-6 sm:p-8` | `bg-black` + grid |
| Dashboard | `max-w-7xl mx-auto px-6` | `py-12` | `bg-black` + grid |

### 7.2 Grid System

- **Landing hero**: `grid grid-cols-1 lg:grid-cols-12` — 7-col left + 5-col right
- **Core systems cards**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- **Open source**: `grid grid-cols-1 lg:grid-cols-12` — 5-col left + 7-col right
- **Dashboard stats**: `grid grid-cols-1 sm:grid-cols-3 gap-4`
- **Hunter stats**: `grid grid-cols-3 gap-2`

### 7.3 Card Sizing

- Auth card: `max-w-[420px]`
- Onboarding card: `max-w-[480px]`
- System cards: `min-h-[180px]`
- Hunter status panel: `max-w-sm`
- Status cards: auto-height with `p-5`

---

## 8. ENVIRONMENT VARIABLES

Defined in `.env.local`:

| Variable | Source | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | Yes |
| `NEXT_PUBLIC_SITE_URL` | App base URL (for OAuth redirects) | Yes |

---

## 9. DATABASE SETUP

After cloning the project, you must run the onboarding migration in Supabase:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → **SQL Editor**
3. Copy the contents of `supabase/migrations/20260620000000_onboarding_schema.sql`
4. Run the SQL

This creates the required tables:
- `public.onboarding_contracts` — Tracks contract acceptance
- `public.player_profiles` — Stores player data (name, age, goal, body metrics)

---

## 10. KNOWN ISSUES & TECH DEBT

- **Duplicated InputField/CheckboxField**: `LoginForm` and `SignupForm` each define their own `InputField` and `CheckboxField` sub-components. These should be extracted to a shared component.
- **Dashboard STATUS screen (visual-only)**: The `/dashboard` route renders a Solo Leveling-inspired STATUS HUD (`src/components/dashboard/`). It is **mock-data only** — all RPG metrics (level, XP, attributes, quests, skills, fortitude score) are static constants in `mock-data.ts`. Only identity fields (name, avatar, age) come from the real Supabase session. The SKILLS / INVENTORY / QUESTS tabs are inactive placeholders (STATUS-only build). No backend feature integration yet.
- **ESLint suppressions**: Legacy dashboard used `// eslint-disable-next-line @next/next/no-img-element` for avatars — the current `StatusDashboard`/`ProfileFrame` use `next/image`.

---

## 11. KEY REFERENCE FILES

| Purpose | Path |
|---|---|
| Theme tokens | `src/app/globals.css` |
| Root layout | `src/app/layout.tsx` |
| Landing page | `src/app/page.tsx` |
| Button component | `src/components/ui/button.tsx` |
| Auth card pattern | `src/components/auth/AuthCard.tsx` |
| HUD panel pattern | `src/components/landing/HunterStatusPanel.tsx` |
| System card pattern | `src/components/landing/SystemCard.tsx` |
| Section header pattern | `src/components/landing/CoreSystemsSection.tsx` |
| Form input pattern | `src/components/auth/LoginForm.tsx` |
| Auth layout | `src/components/auth/AuthLayout.tsx` |
| Auth background | `src/components/auth/AuthBackground.tsx` |
| Onboarding layout | `src/components/onboarding/OnboardingLayout.tsx` |
| Onboarding state | `src/lib/onboarding/state.ts` |
| Middleware | `src/proxy.ts` |
| Auth actions | `src/app/auth/actions.ts` |
| Supabase clients | `src/utils/supabase/` |
| CN utility | `src/lib/utils.ts` |
| shadcn config | `components.json` |
| TS config | `tsconfig.json` |
| Database migration | `supabase/migrations/20260620000000_onboarding_schema.sql` |
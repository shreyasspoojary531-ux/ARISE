'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { DashboardBackground } from './DashboardBackground'
import { MobileNav } from './MobileNav'
import { NAV_TABS, type NavTab } from './mock-data'
import { cn } from '@/lib/utils'

interface DashboardContextValue {
  playerName: string
  avatarUrl?: string | null
  age: string
  level: number
  rank: string
}

const DashboardContext = createContext<DashboardContextValue>({
  playerName: 'Hunter',
  avatarUrl: null,
  age: '—',
  level: 24,
  rank: 'C',
})

export function useDashboard() {
  return useContext(DashboardContext)
}

interface DashboardShellProps extends DashboardContextValue {
  logoutAction: (formData: FormData) => void | Promise<void>
  children: React.ReactNode
}

/**
 * DashboardShell — wraps all dashboard sub-pages.
 * Provides:
 *  - DashboardBackground (grid, glow, particles)
 *  - SystemNav (desktop, full-width HUD rail with center notch)
 *  - MobileNav (mobile, sticky header + slide-out drawer)
 *  - DashboardContext (session data for child components)
 *
 * Responsive contract:
 *  - Desktop (lg+): fixed viewport, no page scroll — identical to before.
 *  - Mobile (<lg): the page scrolls naturally; content flows vertically.
 *    The `lg:h-screen lg:overflow-hidden` / `lg:h-full lg:overflow-hidden`
 *    prefixes guarantee the desktop output is byte-for-byte unchanged.
 */
export function DashboardShell({
  playerName,
  avatarUrl,
  age,
  level,
  rank,
  logoutAction,
  children,
}: DashboardShellProps) {
  return (
    <DashboardContext.Provider value={{ playerName, avatarUrl, age, level, rank }}>
      <div className="relative min-h-screen w-full bg-black text-white lg:h-screen lg:w-screen scrollbar-hidden lg:overflow-hidden">
        <DashboardBackground />
        <div className="relative z-10 flex min-h-screen flex-col lg:h-full">
          {/* Desktop nav — untouched, rendered only at lg+. */}
          <div className="hidden lg:block">
            <SystemNav
              playerName={playerName}
              avatarUrl={avatarUrl}
              level={level}
              rank={rank}
              logoutAction={logoutAction}
            />
          </div>
          {/* Mobile nav — sticky header + drawer, rendered only below lg. */}
          <MobileNav
            playerName={playerName}
            avatarUrl={avatarUrl}
            level={level}
            rank={rank}
            logoutAction={logoutAction}
          />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </DashboardContext.Provider>
  )
}

// ── SystemNav — Full-Width HUD Rail with Center Notch ─────────────────────
//
// Architecture: a single SVG draws the notched HUD line that stretches across
// the full viewport. The rail runs horizontally near the top, dips into a
// shallow angular notch in the center where navigation tabs float directly
// on the line — no rectangular container, no boxed panel. The tabs ARE part
// of the line structure. Energy nodes, junction markers, and tick marks
// illuminate the rail as HUD indicators.

function SystemNav({
  playerName,
  avatarUrl,
  level,
  rank,
  logoutAction,
}: {
  playerName: string
  avatarUrl?: string | null
  level: number
  rank: string
  logoutAction: (formData: FormData) => void | Promise<void>
}) {
  const pathname = usePathname()

  // Guard against hydration mismatch: usePathname() is null during SSR but
  // resolves on the client. We freeze the active tab to 'STATUS' until the
  // component has mounted client-side, then recompute from the real path.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Resolve active tab from the current pathname.
  const activeTab: NavTab = (() => {
    if (!mounted) return 'STATUS'
    if (pathname.includes('/skills')) return 'SKILLS'
    if (pathname.includes('/inventory')) return 'INVENTORY'
    if (pathname.includes('/quests')) return 'QUESTS'
    return 'STATUS'
  })()

  // Map tabs to routes (STATUS is the root `/dashboard`).
  const tabRoute: Record<NavTab, string> = {
    STATUS: '/dashboard',
    SKILLS: '/dashboard/skills',
    INVENTORY: '/dashboard/inventory',
    QUESTS: '/dashboard/quests',
  }

  return (
    <nav className="relative z-20 flex-shrink-0 h-[60px]">
      {/* ── SVG HUD Rail with center notch ─────────────────────────────── */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 h-full w-full"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Full-width gradient: fades at edges, peaks at center */}
          <linearGradient id="nav-rail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(0,212,255,0)" />
            <stop offset="5%" stopColor="rgba(0,212,255,0.1)" />
            <stop offset="15%" stopColor="rgba(0,212,255,0.35)" />
            <stop offset="35%" stopColor="rgba(0,212,255,0.52)" />
            <stop offset="50%" stopColor="rgba(0,212,255,0.65)" />
            <stop offset="65%" stopColor="rgba(0,212,255,0.52)" />
            <stop offset="85%" stopColor="rgba(0,212,255,0.35)" />
            <stop offset="95%" stopColor="rgba(0,212,255,0.1)" />
            <stop offset="100%" stopColor="rgba(0,212,255,0)" />
          </linearGradient>

          {/* Bloom filter — soft wide glow behind the sharp line */}
          <filter id="rail-bloom" x="-5%" y="-200%" width="110%" height="600%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node glow filter — intensive bloom for energy nodes */}
          {/* <filter id="node-bloom" x="-500%" y="-500%" width="1100%" height="1100%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter> */}
        </defs>

        {/* ── Ultra-subtle fill behind the notch area ──────────────────── */}
        <path
          d="M540,8 L632,50 L808,50 L900,8 Z"
          fill="rgba(0,212,255,0.012)"
        />

        {/* ── Broad bloom layer (wide diffuse glow behind the line) ───── */}
        {/* <path
          d="M0,8 H540 L632,50 H808 L900,8 H1440"
          stroke="rgba(0,212,255,0.07)"
          strokeWidth="12"
          fill="none"
          vectorEffect="non-scaling-stroke"
        /> */}

        {/* ── Main rail line — gradient stroke + bloom filter ──────────── */}
        <path
          d="M0,9 H452 L528,90 H913 L981,9 H1440"
          stroke="url(#nav-rail)"
          strokeWidth="1.5"
          fill="none"
          vectorEffect="non-scaling-stroke"
          filter="url(#rail-bloom)"
        />

        {/* ── Scanning light bar — sweeps along the rail ──────────────── */}
        <rect y="4" width="80" height="8" rx="1" fill="rgba(0,212,255,0.06)">
          <animate attributeName="x" from="-80" to="1520" dur="7s" repeatCount="indefinite" />
        </rect>

        {/* ── Tick marks — left section ───────────────────────────────── */}
        {[
          { x: 80, o: 0.15 },
          { x: 160, o: 0.25 },
          { x: 240, o: 0.18 },
          { x: 320, o: 0.22 },
          { x: 400, o: 0.15 },
          { x: 480, o: 0.2 },
        ].map(({ x, o }) => (
          <line
            key={`tl-${x}`}
            x1={x}
            y1="4"
            x2={x}
            y2="12"
            stroke={`rgba(0,212,255,${o})`}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* ── Tick marks — right section ──────────────────────────────── */}
        {[
          { x: 960, o: 0.2 },
          { x: 1040, o: 0.15 },
          { x: 1120, o: 0.22 },
          { x: 1200, o: 0.18 },
          { x: 1280, o: 0.25 },
          { x: 1360, o: 0.15 },
        ].map(({ x, o }) => (
          <line
            key={`tr-${x}`}
            x1={x}
            y1="4"
            x2={x}
            y2="12"
            stroke={`rgba(0,212,255,${o})`}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* ── Tick marks — notch bottom (inverted, pointing up) ──────── */}
        {[
          { x: 660, o: 0.12 },
          { x: 690, o: 0.18 },
          { x: 720, o: 0.15 },
          { x: 750, o: 0.18 },
          { x: 780, o: 0.12 },
        ].map(({ x, o }) => (
          <line
            key={`nb-${x}`}
            x1={x}
            y1="47"
            x2={x}
            y2="53"
            stroke={`rgba(0,212,255,${o})`}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* ── Junction markers — bright dots at shoulder corners ──────── */}
        {/* Left shoulder */}
        <circle cx="540" cy="8" r="3" fill="rgba(0,212,255,0.35)" vectorEffect="non-scaling-stroke" />
        <circle cx="540" cy="8" r="1.5" fill="rgba(0,212,255,0.85)" vectorEffect="non-scaling-stroke" />
        {/* Right shoulder */}
        <circle cx="900" cy="8" r="3" fill="rgba(0,212,255,0.35)" vectorEffect="non-scaling-stroke" />
        <circle cx="900" cy="8" r="1.5" fill="rgba(0,212,255,0.85)" vectorEffect="non-scaling-stroke" />
        {/* Notch bottom-left corner */}
        <circle cx="632" cy="50" r="2" fill="rgba(0,212,255,0.3)" vectorEffect="non-scaling-stroke" />
        {/* Notch bottom-right corner */}
        <circle cx="808" cy="50" r="2" fill="rgba(0,212,255,0.3)" vectorEffect="non-scaling-stroke" />

        {/* ── Energy nodes — pulsing strategic glow points ───────────── */}
        {/* Left cluster */}
        <circle cx="160" cy="8" r="2.5" fill="rgba(0,212,255,0.5)" filter="url(#node-bloom)" vectorEffect="non-scaling-stroke" className="nav-node-live" />
        <circle cx="360" cy="8" r="1.5" fill="rgba(0,212,255,0.3)" vectorEffect="non-scaling-stroke" />
        <circle cx="460" cy="8" r="1" fill="rgba(0,212,255,0.2)" vectorEffect="non-scaling-stroke" />
        {/* Right cluster */}
        <circle cx="980" cy="8" r="1" fill="rgba(0,212,255,0.2)" vectorEffect="non-scaling-stroke" />
        <circle cx="1080" cy="8" r="1.5" fill="rgba(0,212,255,0.3)" vectorEffect="non-scaling-stroke" />
        <circle cx="1280" cy="8" r="2.5" fill="rgba(0,212,255,0.5)" filter="url(#node-bloom)" vectorEffect="non-scaling-stroke" className="nav-node-live" />

        {/* ── Notch center energy node — strategic pulse ─────────────── */}
        <circle cx="720" cy="50" r="2" fill="rgba(0,212,255,0.45)" filter="url(#node-bloom)" vectorEffect="non-scaling-stroke" className="nav-node-live" />

        {/* ── Corner brackets at viewport edges ───────────────────────── */}
        {/* Top-left */}
        <line x1="0" y1="2" x2="0" y2="14" stroke="rgba(0,212,255,0.3)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="8" x2="14" y2="8" stroke="rgba(0,212,255,0.3)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {/* Top-right */}
        <line x1="1440" y1="2" x2="1440" y2="14" stroke="rgba(0,212,255,0.3)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="1440" y1="8" x2="1426" y2="8" stroke="rgba(0,212,255,0.3)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* ── Content row: Logo (left) → Energy readout → Spacer → Profile (right) */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1500px] items-center px-4 sm:px-6">
        {/* ── ARISE Logo — 33% larger, stronger cyan glow ──────────────── */}
        <Link
          href="/"
          aria-label="ARISE home"
          className="group relative z-20 flex items-center gap-3"
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 object-contain drop-shadow-[0_0_12px_rgba(0,212,255,0.5)] transition-transform duration-200 group-hover:scale-110"
          />
          <span className="hidden font-orbitron text-lg font-black tracking-[0.3em] text-neutral-200 transition-colors group-hover:text-white sm:block">
            A<span className="text-cyan-400 [text-shadow:0_0_14px_rgba(0,212,255,0.8)]">R</span>ISE
          </span>
        </Link>

        {/* ── Energy Point readout — HUD stat markers ──────────────────── */}
        <div className="hidden lg:flex items-center gap-3 ml-8">
          <span className="flex items-center gap-1.5">
            <span className="font-orbitron text-[7px] tracking-[0.3em] text-neutral-600 uppercase">EP</span>
            <span className="flex gap-[2px]">
              {[0.15, 0.1, 0.1, 0.1, 0.05].map((o, i) => (
                <span
                  key={i}
                  className="h-2 w-[3px] bg-cyan-500"
                  style={{ opacity: o }}
                />
              ))}
            </span>
            <span className="font-orbitron text-[9px] font-bold text-cyan-400/60 tracking-wider">0</span>
          </span>

          <span className="h-3 w-px bg-neutral-800" />

          <span className="flex items-center gap-1.5">
            <span className="font-orbitron text-[7px] tracking-[0.3em] text-neutral-600 uppercase">LV</span>
            <span className="font-orbitron text-[9px] font-bold text-cyan-400/60 tracking-wider">{level}</span>
          </span>

          <span className="h-3 w-px bg-neutral-800" />

          <span className="flex items-center gap-1.5">
            <span className="font-orbitron text-[7px] tracking-[0.3em] text-neutral-600 uppercase">RANK</span>
            <span className="font-orbitron text-[9px] font-bold text-cyan-400/70 tracking-wider">{rank}</span>
          </span>
        </div>

        {/* Spacer pushes profile to the right edge */}
        <div className="flex-1" />

        {/* ── Profile avatar + Logout (right side) — scaled down, vertically centered ── */}
        <div className="relative z-20 flex items-center gap-2">
          <Link
            href="/dashboard"
            aria-label="Profile"
            className="group relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105"
          >
            {/* Glowing ring */}
            <span className="pointer-events-none absolute inset-0 rounded-full border border-cyan-500/20 transition-colors duration-200 group-hover:border-cyan-400/70 group-hover:shadow-[0_0_10px_-2px_rgba(0,212,255,0.4)]" />
            {/* Cross-hair bracket ticks */}
            <span className="pointer-events-none absolute -top-px left-1/2 h-1 w-px -translate-x-1/2 bg-cyan-400/70" />
            <span className="pointer-events-none absolute -bottom-px left-1/2 h-1 w-px -translate-x-1/2 bg-cyan-400/70" />
            <span className="pointer-events-none absolute top-1/2 -left-px h-px w-1 -translate-y-1/2 bg-cyan-400/70" />
            <span className="pointer-events-none absolute top-1/2 -right-px h-px w-1 -translate-y-1/2 bg-cyan-400/70" />
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={playerName}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full border border-neutral-800 object-cover"
              />
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 font-orbitron text-[8px] font-bold text-cyan-300">
                {playerName[0]?.toUpperCase()}
              </span>
            )}
            {/* Online ping indicator */}
            <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Logout"
              className="group relative flex h-8 w-8 items-center justify-center border border-neutral-800 bg-black/40 text-neutral-500 transition-all duration-200 hover:border-red-500/50 hover:text-red-400 hover:shadow-[0_0_16px_-6px_rgba(239,68,68,0.6)] [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
            >
              {/* Corner accents */}
              <span className="pointer-events-none absolute left-0 top-0 h-1.5 w-px bg-neutral-700 transition-colors group-hover:bg-red-500/60" />
              <span className="pointer-events-none absolute left-0 top-0 h-px w-1.5 bg-neutral-700 transition-colors group-hover:bg-red-500/60" />
              <span className="pointer-events-none absolute right-0 bottom-0 h-1.5 w-px bg-neutral-700 transition-colors group-hover:bg-red-500/60" />
              <span className="pointer-events-none absolute right-0 bottom-0 h-px w-1.5 bg-neutral-700 transition-colors group-hover:bg-red-500/60" />
              <LogOut className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-px" />
            </button>
          </form>
        </div>
      </div>

      {/* ── Navigation tabs — floating inside the notch, spread wide ──────
           No box, no container panel. Tabs sit on the HUD line structure.
           Wide max-width + generous gap keeps them spacious and balanced. */}
      <div className="absolute inset-x-0 bottom-[7px] z-20 flex items-center justify-center gap-6 sm:gap-10">
        {NAV_TABS.map((tab) => {
          const active = tab === activeTab
          const href = tabRoute[tab]

          return (
            <Link
              key={tab}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative px-2 py-0.5 font-orbitron text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] uppercase transition-all duration-300',
                active
                  ? 'text-cyan-300 [text-shadow:0_0_14px_rgba(0,212,255,0.8),0_0_28px_rgba(0,212,255,0.4)]'
                  : 'text-neutral-500 hover:text-neutral-200 hover:[text-shadow:0_0_6px_rgba(0,212,255,0.2)]',
              )}
            >
              {active && (
                <>
                  {/* Glowing underline — sits on the notch-bottom line */}
                  <span className="absolute -bottom-[5px] left-1/2 h-[2px] w-4/5 -translate-x-1/2 bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.9),0_0_20px_rgba(0,212,255,0.4)]" />
                  {/* Diamond pointer below the underline */}
                  <span className="absolute -bottom-[9px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border border-cyan-400/60 bg-black shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
                </>
              )}
              <span className="relative">{tab}</span>
            </Link>
          )
        })}

      </div>
    </nav>
  )
}

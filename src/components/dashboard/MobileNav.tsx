'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, ChevronRight } from 'lucide-react'
import { NAV_TABS, type NavTab } from './mock-data'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  playerName: string
  avatarUrl?: string | null
  level: number
  rank: string
  logoutAction: (formData: FormData) => void | Promise<void>
}

/**
 * MobileNav — sticky header + slide-out drawer (mobile only, `lg:hidden`).
 *
 * Desktop navigation (SystemNav HUD rail) is rendered separately and is never
 * touched. This component is responsible for mobile only:
 *   - A compact sticky top bar (logo + LV/RANK + hamburger)
 *   - A right-side slide-out drawer with the same tabs as desktop, but stacked
 *   - Backdrop blur behind the drawer
 *
 * The drawer reuses the exact same route mapping + active-tab resolution logic
 * as SystemNav (mounted-flag guard against hydration mismatch).
 */
export function MobileNav({ playerName, avatarUrl, level, rank, logoutAction }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Resolve the active tab from the pathname. usePathname() is null during SSR
  // but resolves client-side; freeze to STATUS until mounted to match SSR output
  // and avoid hydration mismatch (same pattern as SystemNav).
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydration guard requires a synchronous browser-state flag (identical to SystemNav)
  useEffect(() => { setMounted(true) }, [])

  const activeTab: NavTab = (() => {
    if (!mounted) return 'STATUS'
    if (pathname.includes('/skills')) return 'SKILLS'
    if (pathname.includes('/inventory')) return 'INVENTORY'
    if (pathname.includes('/quests')) return 'QUESTS'
    return 'STATUS'
  })()

  // Tab → route map (STATUS is the root /dashboard).
  const tabRoute: Record<NavTab, string> = {
    STATUS: '/dashboard',
    SKILLS: '/dashboard/skills',
    INVENTORY: '/dashboard/inventory',
    QUESTS: '/dashboard/quests',
  }

  const tabSubtitles: Record<NavTab, string> = {
    STATUS: 'Hunter overview',
    SKILLS: 'Active skill tree',
    INVENTORY: 'Collected resources',
    QUESTS: 'Mission log',
  }

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [open])

  // Close the drawer whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Syncing UI state to router path is an external-system reaction
    setOpen(false)
  }, [pathname])

  return (
    <>
      {/* ── Sticky header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-14 flex-shrink-0 items-center justify-between border-b border-neutral-900 bg-black/80 px-4 backdrop-blur-md lg:hidden">
        <Link
          href="/"
          aria-label="ARISE home"
          className="group relative z-20 flex items-center gap-1"
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={48}
            height={48}
            className="h-11 w-11 object-contain drop-shadow-[0_0_12px_rgba(0,212,255,0.5)]"
          />
          <span className="font-orbitron text-base font-black tracking-[0.25em] text-neutral-200">
            A<span className="text-cyan-400 [text-shadow:0_0_12px_rgba(0,212,255,0.8)]">R</span>ISE
          </span>
        </Link>

        {/* LV / RANK chip */}
        <div className="flex items-center gap-2 border border-neutral-800 bg-black/40 px-2 py-1 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]">
          <span className="flex items-center gap-1">
            <span className="font-orbitron text-[7px] tracking-[0.25em] text-neutral-600 uppercase">LV</span>
            <span className="font-orbitron text-[9px] font-bold text-cyan-400">{level}</span>
          </span>
          <span className="h-2.5 w-px bg-neutral-800" />
          <span className="flex items-center gap-1">
            <span className="font-orbitron text-[7px] tracking-[0.25em] text-neutral-600 uppercase">RANK</span>
            <span className="font-orbitron text-[9px] font-bold text-cyan-400">{rank}</span>
          </span>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          className="group relative flex h-9 w-9 items-center justify-center border border-neutral-800 bg-black/40 text-neutral-400 transition-colors duration-200 hover:border-cyan-500/50 hover:text-cyan-400 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
        >
          <span className="pointer-events-none absolute left-0 top-0 h-1.5 w-px bg-neutral-700 transition-colors group-hover:bg-cyan-500/60" />
          <span className="pointer-events-none absolute left-0 top-0 h-px w-1.5 bg-neutral-700 transition-colors group-hover:bg-cyan-500/60" />
          <span className="pointer-events-none absolute right-0 bottom-0 h-1.5 w-px bg-neutral-700 transition-colors group-hover:bg-cyan-500/60" />
          <span className="pointer-events-none absolute right-0 bottom-0 h-px w-1.5 bg-neutral-700 transition-colors group-hover:bg-cyan-500/60" />
          <Menu className="h-4 w-4" />
        </button>
      </header>

      {/* ── Drawer + backdrop ──────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />

            {/* Drawer panel */}
            <motion.aside
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="fixed right-0 top-0 z-50 flex h-full w-[84%] max-w-[330px] flex-col border-l border-cyan-500/25 bg-neutral-950/95 shadow-[0_0_40px_-8px_rgba(0,212,255,0.25)] backdrop-blur-xl lg:hidden"
              style={{
                clipPath:
                  'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-neutral-900 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse inline-block" />
                  <span className="font-orbitron text-[10px] tracking-[0.3em] text-neutral-300 font-semibold uppercase">
                    Navigation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="group relative flex h-8 w-8 items-center justify-center border border-neutral-800 bg-black/40 text-neutral-400 transition-colors hover:border-red-500/50 hover:text-red-400 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Tab links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="flex flex-col gap-1.5">
                  {NAV_TABS.map((tab) => {
                    const active = tab === activeTab

                    return (
                      <li key={tab}>
                        <Link
                          href={tabRoute[tab]}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'group relative flex items-center justify-between border px-4 py-3 transition-colors duration-200 [clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]',
                            active
                              ? 'border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_18px_-8px_rgba(0,212,255,0.5)]'
                              : 'border-neutral-900 bg-black/40 hover:border-cyan-500/30 hover:bg-cyan-500/5',
                          )}
                        >
                          {/* Active glow accent */}
                          {active && (
                            <span className="pointer-events-none absolute left-0 top-1/2 h-2/3 w-px -translate-y-1/2 bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                          )}
                          <span className="flex flex-col">
                            <span
                              className={cn(
                                'font-orbitron text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors',
                                active
                                  ? 'text-cyan-300 [text-shadow:0_0_10px_rgba(0,212,255,0.6)]'
                                  : 'text-neutral-300 group-hover:text-white',
                              )}
                            >
                              {tab}
                            </span>
                            <span className="font-sans text-[9px] text-neutral-600">
                              {tabSubtitles[tab]}
                            </span>
                          </span>
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 transition-colors',
                              active ? 'text-cyan-400' : 'text-neutral-700 group-hover:text-neutral-400',
                            )}
                          />
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* Drawer footer — profile + logout */}
              <div className="border-t border-neutral-900 px-4 py-4">
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-3 px-2 py-2"
                  onClick={() => setOpen(false)}
                >
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/30 transition-colors group-hover:border-cyan-400/60">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={playerName}
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full border border-neutral-800 object-cover"
                      />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 font-orbitron text-[9px] font-bold text-cyan-300">
                        {playerName[0]?.toUpperCase()}
                      </span>
                    )}
                    <span className="absolute -right-0.5 -top-0.5 flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                    </span>
                  </span>
                  <span className="flex flex-col overflow-hidden">
                    <span className="truncate font-orbitron text-[11px] font-bold tracking-wider text-white">
                      {playerName}
                    </span>
                    <span className="font-orbitron text-[8px] tracking-[0.25em] text-cyan-400/70 uppercase">
                      Hunter
                    </span>
                  </span>
                </Link>

                <form action={logoutAction} className="mt-3">
                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 border border-neutral-800 bg-black/40 px-4 py-2.5 font-orbitron text-[10px] font-bold tracking-[0.2em] text-neutral-400 transition-colors hover:border-red-500/50 hover:text-red-400 hover:shadow-[0_0_16px_-6px_rgba(239,68,68,0.6)] [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]"
                  >
                    <LogOut className="h-3.5 w-3.5 transition-transform group-hover:translate-x-px" />
                    LOGOUT
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

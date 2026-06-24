'use client'

import { LeftColumn } from './LeftColumn'
import { CenterColumn } from './CenterColumn'
import { RightColumn } from './RightColumn'
import { useDashboard } from './DashboardShell'
import { CreditsFooter } from './CreditsFooter'

/**
 * StatusDashboard — the STATUS tab content.
 * Composes the three-column layout that fills the remaining
 * viewport height after the nav bar (handled by DashboardShell).
 * No scrolling — columns flex to fit via flex-1.
 */
export function StatusDashboard() {
  const { playerName, avatarUrl, age, level, rank } = useDashboard()

  return (
    <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col px-4 pt-4 pb-3 sm:px-6">
      {/* Three-column grid — fills available space, no overflow */}
      <div className="grid h-full min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex min-h-0 flex-col gap-3 lg:col-span-3">
          <LeftColumn />
        </div>
        <div className="flex min-h-0 flex-col gap-3 lg:col-span-6">
          <CenterColumn
            playerName={playerName}
            avatarUrl={avatarUrl}
            age={age}
            level={level}
            rank={rank}
          />
        </div>
        <div className="flex min-h-0 flex-col gap-3 lg:col-span-3">
          <RightColumn />
        </div>
      </div>

      {/* Thin HUD footer */}
      <footer className="flex flex-shrink-0 items-center justify-between border-t border-neutral-900 pt-2 mt-2">
        <span className="font-mono text-[8px] tracking-wider text-neutral-800">
          ARISE.SYS // STATUS_MODULE
        </span>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
          <span className="font-orbitron text-[9px] tracking-[0.3em] text-green-500 uppercase">
            System Online
          </span>
        </div>
        <span className="font-mono text-[8px] tracking-wider text-neutral-800">
          VER 1.0.0 // STABLE
        </span>
      </footer>

      {/* Credits row */}
      <CreditsFooter className="flex flex-shrink-0 items-center justify-between border-t border-neutral-900 pt-1.5 mt-1.5" />
    </div>
  )
}

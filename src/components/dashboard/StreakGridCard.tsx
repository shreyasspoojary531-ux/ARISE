'use client'

import { memo } from 'react'
import { Flame } from 'lucide-react'
import {
  STREAK_GRID,
  STREAK_GRID_WEEKS,
  type StreakDay,
  type StreakIntensity,
} from './mock-data'
import { HudPanel, SectionLabel } from './primitives'
import { cn } from '@/lib/utils'

/**
 * StreakGridCard — a Solo Leveling-style daily completion heatmap.
 *
 * Replaces the old "Mental Discipline" card on the STATUS screen. It renders
 * a GitHub-style contribution grid (columns = weeks, rows = days of week)
 * tinted by how many of each day's habits/tasks were completed, plus a hero
 * "current streak" readout and a compact stats footer.
 *
 * The grid is built once from the deterministic `STREAK_GRID` mock (module
 * scope → no hydration mismatch). When real completion data lands, swap the
 * import — the UI only consumes the `StreakGrid` shape.
 */

// ── Intensity → cell styling ───────────────────────────────────────────────
// A 5-step scale from empty neutral to glowing cyan, matching the ARISE
// accent palette. The top tier carries a soft cyan bloom so "perfect" days
// read instantly against the grid.
const INTENSITY_CELL: Record<StreakIntensity, string> = {
  0: 'bg-neutral-900/50 border-neutral-800/40',
  1: 'bg-cyan-500/15 border-cyan-500/25',
  2: 'bg-cyan-500/30 border-cyan-500/40',
  3: 'bg-cyan-500/55 border-cyan-400/60',
  4: 'bg-cyan-400/85 border-cyan-300/80 shadow-[0_0_6px_rgba(0,212,255,0.7)]',
}

// Small clip-path so each day cell keeps the signature chamfered corner.
const CELL_CLIP = 'polygon(0 2px, 2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%)'

// Day-of-week row labels — mirror the grid's 7 rows. Only every other row is
// labelled to avoid clutter (Mon / Wed / Fri), like GitHub's graph.
const ROW_LABELS = ['', 'M', '', 'W', '', 'F', '']

/**
 * Splits the flat `days` array (oldest → newest) into per-week columns.
 * Each column holds exactly 7 days (Sun→Sat). Trailing partial weeks are
 * padded with nulls so every column aligns to the same 7-row height.
 */
function chunkIntoWeeks(days: StreakDay[], weeks: number): (StreakDay | null)[][] {
  const columns: (StreakDay | null)[][] = []
  for (let w = 0; w < weeks; w++) {
    columns.push(days.slice(w * 7, w * 7 + 7))
  }
  return columns
}

export const StreakGridCard = memo(function StreakGridCard({
  grid = STREAK_GRID,
  weeks = STREAK_GRID_WEEKS,
}: {
  grid?: typeof STREAK_GRID
  weeks?: number
}) {
  const totalDays = grid.days.length
  const weekColumns = chunkIntoWeeks(grid.days, weeks)

  return (
    <HudPanel
      header="STREAK GRID"
      glow
      rightHeader={<SectionLabel>{weeks}W · {totalDays}D</SectionLabel>}
    >
      <div className="flex flex-col gap-3">
        {/* ── Current streak hero readout ─────────────────────────────── */}
        <div
          className="relative flex items-center justify-between overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-transparent px-3 py-2.5 clip-hud-8"
        >
          <div className="energy-line pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="flex items-center gap-2">
            <Flame
              className={cn(
                'h-4 w-4 transition-colors',
                grid.currentStreak > 0
                  ? 'text-cyan-400 [filter:drop-shadow(0_0_6px_rgba(0,212,255,0.7))]'
                  : 'text-neutral-600',
              )}
            />
            <div className="flex flex-col">
              <SectionLabel className="text-cyan-400/80">CURRENT STREAK</SectionLabel>
              <span className="font-mono text-[8px] tracking-wider text-neutral-600">
                {grid.currentStreak > 0 ? 'CHAIN ACTIVE' : 'BEGIN TODAY'}
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-orbitron text-3xl font-black text-cyan-400 [text-shadow:0_0_20px_rgba(0,212,255,0.7)] animate-pulse-glow">
              {grid.currentStreak}
            </span>
            <span className="font-orbitron text-[9px] font-bold tracking-wider text-cyan-400/70">
              DAYS
            </span>
          </div>
        </div>

        {/* ── Contribution grid ───────────────────────────────────────── */}
        <div className="flex gap-1.5">
          {/* Day-of-week labels (Mon / Wed / Fri) */}
          <div className="flex flex-col gap-[3px] pt-[1px]">
            {ROW_LABELS.map((label, i) => (
              <span
                key={i}
                className="flex h-[10px] items-center justify-center font-mono text-[7px] tracking-wider text-neutral-700"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Week columns */}
          <div className="grid flex-1 gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
            {weekColumns.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, di) => {
                  const day = week[di]
                  if (!day) {
                    // Out-of-window padding cell — render an invisible spacer
                    // so the column keeps its 7-row height.
                    return <span key={di} className="h-[10px]" aria-hidden />
                  }
                  return (
                    <span
                      key={day.offset}
                      title={`${day.offset} day${day.offset === 1 ? '' : 's'} ago · ${day.intensity > 0 ? `level ${day.intensity}` : 'no activity'}`}
                      className={cn(
                        'h-[10px] w-full border transition-colors duration-200',
                        INTENSITY_CELL[day.intensity],
                      )}
                      style={{ clipPath: CELL_CLIP }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ── Legend + secondary stats ────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-neutral-900 pt-2">
          <div className="flex items-center gap-1.5">
            <SectionLabel>LESS</SectionLabel>
            <div className="flex items-center gap-[3px]">
              {([0, 1, 2, 3, 4] as StreakIntensity[]).map((lvl) => (
                <span
                  key={lvl}
                  className={cn('h-[10px] w-[10px] border', INTENSITY_CELL[lvl])}
                  style={{ clipPath: CELL_CLIP }}
                />
              ))}
            </div>
            <SectionLabel>MORE</SectionLabel>
          </div>
          <div className="flex items-center gap-3 font-mono text-[8px] tracking-wider text-neutral-500">
            <span>
              LONGEST <span className="font-semibold text-white">{grid.longestStreak}D</span>
            </span>
            <span className="h-2.5 w-px bg-neutral-800" />
            <span>
              ACTIVE <span className="font-semibold text-cyan-400">{grid.activeDays}</span>
              <span className="text-neutral-700">/{totalDays}</span>
            </span>
          </div>
        </div>
      </div>
    </HudPanel>
  )
})

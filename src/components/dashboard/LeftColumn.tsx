'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  ATTRIBUTES,
  AVAILABLE_STAT_POINTS,
  PLAYER_STATUS,
} from './mock-data'
import { HudPanel, PanelHeader, ProgressBar, SectionLabel } from './primitives'
import { cn } from '@/lib/utils'

// Staggered entrance for the column's panels.
const PANEL_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

/**
 * LeftColumn — Status Panel, Attributes, Available Stat Points.
 * Inventory has been moved to /dashboard/inventory.
 *
 * Memoized: this column renders only static mock data and has no props, so
 * wrapping it in memo() prevents a wasteful re-render every time the parent
 * StatusDashboard re-renders (e.g. on tab navigation).
 */
export const LeftColumn = memo(function LeftColumn() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* STATUS PANEL */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={PANEL_VARIANTS} className="flex-shrink-0">
        <HudPanel header="STATUS" scanline glow rightHeader={<SectionLabel>SYS.VER // 1.0.0</SectionLabel>}>
          <StatusPanel />
        </HudPanel>
      </motion.div>

      {/* ATTRIBUTES */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={PANEL_VARIANTS} className="flex-1 min-h-0">
        <HudPanel header="ATTRIBUTES" rightHeader={<SectionLabel>8 / 8</SectionLabel>} className="h-full flex flex-col">
          <AttributesPanel />
        </HudPanel>
      </motion.div>

      {/* STAT POINTS */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={PANEL_VARIANTS} className="flex-shrink-0">
        <StatPointsPanel />
      </motion.div>
    </div>
  )
})

function StatusPanel() {
  const { level, xpCurrent, xpMax, rank, title, job } = PLAYER_STATUS
  const xpPct = (xpCurrent / xpMax) * 100
  return (
    <div className="space-y-3">
      {/* Level + rank header */}
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-neutral-900 bg-black/50 px-3 py-1.5 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]">
          <div className="font-orbitron text-[8px] tracking-widest text-neutral-600">LEVEL</div>
          <div className="font-orbitron text-xl font-black text-white">{level}</div>
        </div>
        <div className="border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]">
          <div className="font-orbitron text-[8px] tracking-widest text-cyan-400/70">RANK</div>
          <div className="font-orbitron text-xl font-black text-cyan-400">{rank}</div>
        </div>
      </div>

      {/* XP bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <SectionLabel>EXPERIENCE</SectionLabel>
          <span className="font-mono text-[9px] tracking-wider text-neutral-500">
            <span className="font-semibold text-cyan-400">{xpCurrent.toLocaleString()}</span> / {xpMax.toLocaleString()}
          </span>
        </div>
        <ProgressBar value={xpCurrent} max={xpMax} height="h-1.5" delay="200ms" />
      </div>

      {/* Title + job */}
      <div className="space-y-1 border-t border-neutral-900 pt-2">
        <div className="flex items-center justify-between">
          <SectionLabel>TITLE</SectionLabel>
          <span className="font-orbitron text-[9px] font-bold tracking-widest text-cyan-300">{title}</span>
        </div>
        <div className="flex items-center justify-between">
          <SectionLabel>JOB CLASS</SectionLabel>
          <span className="font-orbitron text-[9px] font-bold tracking-widest text-neutral-300">{job}</span>
        </div>
      </div>

      {/* Next-level hint */}
      <div className="flex items-center justify-between border-t border-neutral-900 pt-2">
        <span className="font-mono text-[8px] tracking-wider text-neutral-700">NEXT LV // {xpMax - xpCurrent} XP</span>
        <span className="font-mono text-[8px] tracking-wider text-neutral-700">{Math.round(xpPct)}%</span>
      </div>
    </div>
  )
}

function AttributesPanel() {
  return (
    <div className="flex flex-col gap-2.5 overflow-hidden">
      {ATTRIBUTES.map((attr, i) => (
        <div key={attr.name} className="space-y-1 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <attr.icon className="h-3 w-3 text-cyan-500/70" />
              <span className="font-orbitron text-[9px] font-semibold tracking-widest text-neutral-300">
                {attr.name}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              {attr.bonus > 0 && (
                <span className="font-orbitron text-[8px] font-bold text-green-500">+{attr.bonus}</span>
              )}
              <span className="font-mono text-[9px] tracking-wider text-neutral-500">
                <span className="font-semibold text-white">{attr.value}</span>
              </span>
            </div>
          </div>
          <ProgressBar value={attr.value} max={attr.max} height="h-1" delay={`${i * 60 + 100}ms`} />
        </div>
      ))}
    </div>
  )
}

function StatPointsPanel() {
  return (
    <div
      className="relative overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-transparent p-3 [clip-path:polygon(0_10px,10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%)]"
    >
      <div className="energy-line pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="flex items-center justify-between">
        <div>
          <SectionLabel className="text-cyan-400/80">AVAILABLE STAT POINTS</SectionLabel>
          <p className="mt-0.5 font-sans text-[9px] text-neutral-500">Allocate to ascend</p>
        </div>
        <span className="font-orbitron text-3xl font-black text-cyan-400 [text-shadow:0_0_18px_rgba(0,212,255,0.6)] animate-pulse-glow">
          {AVAILABLE_STAT_POINTS}
        </span>
      </div>
    </div>
  )
}

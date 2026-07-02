'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { ACTIVE_QUESTS, LONG_TERM_QUESTS } from './mock-data'
import { HudPanel, ProgressBar, SectionLabel } from './primitives'
import { StreakGridCard } from './StreakGridCard'
import { cn } from '@/lib/utils'

const PANEL_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

/**
 * RightColumn — Active Quests + Streak Grid.
 * Skills moved to /dashboard/skills.
 *
 * Memoized: no props, all static mock data — memo prevents re-render on
 * parent state changes (e.g. tab navigation in the nav bar).
 */
export const RightColumn = memo(function RightColumn() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* ACTIVE QUESTS — DAILY + LONG TERM in one panel */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={PANEL_VARIANTS} className="flex-1 min-h-0">
        <HudPanel
          header="ACTIVE QUESTS"
          energyLine
          rightHeader={<SectionLabel>{ACTIVE_QUESTS.length + LONG_TERM_QUESTS.length} ACTIVE</SectionLabel>}
          className="h-full flex flex-col"
        >
          <div className="flex flex-1 flex-col gap-3 overflow-hidden">
            {/* ── DAILY ─────────────────────────────────────────── */}
            <QuestGroup label="DAILY" quests={ACTIVE_QUESTS} />

            {/* ── Separator ─────────────────────────────────────── */}
            <div className="flex items-center gap-2">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
              <span className="font-orbitron text-[7px] tracking-[0.3em] text-neutral-700">◇</span>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
            </div>

            {/* ── LONG TERM ─────────────────────────────────────── */}
            <QuestGroup label="LONG TERM" quests={LONG_TERM_QUESTS} />
          </div>
        </HudPanel>
      </motion.div>

      {/* STREAK GRID */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={PANEL_VARIANTS} className="flex-shrink-0">
        <StreakGridCard />
      </motion.div>
    </div>
  )
})

function QuestGroup({ label, quests }: { label: string; quests: typeof ACTIVE_QUESTS }) {
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel className="text-cyan-400/70">{label}</SectionLabel>
      {quests.map((quest) => {
        const complete = quest.progress >= 100
        return (
          <div
            key={quest.name}
            className="group border border-neutral-900 bg-black/50 p-2.5 transition-colors duration-200 hover:border-cyan-500/30 clip-hud-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <quest.icon
                  className={cn(
                    'h-3.5 w-3.5 transition-colors',
                    complete ? 'text-green-500' : 'text-cyan-500/70 group-hover:text-cyan-400',
                  )}
                />
                <span className="font-orbitron text-[9px] font-semibold tracking-widest text-neutral-200">
                  {quest.name}
                </span>
              </div>
              <span
                className={cn(
                  'font-orbitron text-[9px] font-bold tracking-wider',
                  complete ? 'text-green-500' : 'text-cyan-400',
                )}
              >
                +{quest.xp.toLocaleString()} XP
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <ProgressBar value={quest.progress} height="h-1" barClassName={complete ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : undefined} />
              <span className="w-8 shrink-0 text-right font-mono text-[8px] tracking-wider text-neutral-500">
                {quest.progress}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

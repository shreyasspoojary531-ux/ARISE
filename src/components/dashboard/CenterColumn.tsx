'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { PHYSICAL_FITNESS } from './mock-data'
import { HudPanel, PanelHeader, SectionLabel, StatTile } from './primitives'
import { ProfileFrame } from './ProfileFrame'

const PANEL_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

interface CenterColumnProps {
  playerName: string
  avatarUrl?: string | null
  age: string
  level: number
  rank: string
}

/**
 * CenterColumn — the largest column:
 * ProfileFrame (compact) + Physical Fitness.
 * Life Performance removed per spec.
 *
 * Memoized: props are stable primitives (strings/numbers from server context)
 * so shallow compare correctly skips re-renders on nav tab switches.
 */
export const CenterColumn = memo(function CenterColumn({ playerName, avatarUrl, age, level, rank }: CenterColumnProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* PROFILE */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={PANEL_VARIANTS} className="flex-1 min-h-0">
        <HudPanel glow energyLine className="h-full flex flex-col items-center justify-center">
          <ProfileFrame playerName={playerName} avatarUrl={avatarUrl} age={age} level={level} rank={rank} />
        </HudPanel>
      </motion.div>

      {/* PHYSICAL FITNESS — compact, fixed natural height (untouched) */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={PANEL_VARIANTS} className="flex-shrink-0">
        <HudPanel header="PHYSICAL FITNESS" rightHeader={<SectionLabel>VITAL STATS</SectionLabel>}>
          <div className="grid grid-cols-3 gap-2">
            {PHYSICAL_FITNESS.map((stat) => (
              <StatTile
                key={stat.label}
                label={stat.label}
                value={stat.value}
                unit={stat.unit}
                icon={stat.icon}
                accent
              />
            ))}
          </div>
        </HudPanel>
      </motion.div>
    </div>
  )
})

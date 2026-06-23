'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  ACTIVE_QUESTS,
  KNOWLEDGE_TREE_LEVEL,
  KNOWLEDGE_TREE_MAX,
  MENTAL_DISCIPLINES,
  MENTAL_FORTITUDE_SCORE,
} from './mock-data'
import { HudPanel, PanelHeader, ProgressBar, SectionLabel } from './primitives'
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
 * RightColumn — Active Quests + Mental Discipline.
 * Skills moved to /dashboard/skills.
 *
 * Memoized: no props, all static mock data — memo prevents re-render on
 * parent state changes (e.g. tab navigation in the nav bar).
 */
export const RightColumn = memo(function RightColumn() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* ACTIVE QUESTS */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={PANEL_VARIANTS} className="flex-1 min-h-0">
        <HudPanel header="ACTIVE QUESTS" rightHeader={<SectionLabel>DAILY</SectionLabel>} className="h-full flex flex-col">
          <ActiveQuestPanel />
        </HudPanel>
      </motion.div>

      {/* MENTAL DISCIPLINE */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={PANEL_VARIANTS} className="flex-shrink-0">
        <HudPanel header="MENTAL DISCIPLINE" glow>
          <MentalDisciplinePanel />
        </HudPanel>
      </motion.div>
    </div>
  )
})

function ActiveQuestPanel() {
  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      {ACTIVE_QUESTS.map((quest) => {
        const complete = quest.progress >= 100
        return (
          <div
            key={quest.name}
            className="group border border-neutral-900 bg-black/50 p-2.5 transition-colors duration-200 hover:border-cyan-500/30 flex-shrink-0 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]"
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
                +{quest.xp} XP
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

function MentalDisciplinePanel() {
  return (
    <div className="space-y-3">
      {/* Discipline icon row */}
      <div className="grid grid-cols-4 gap-1.5">
        {MENTAL_DISCIPLINES.map((d) => (
          <div
            key={d.label}
            className="group flex flex-col items-center gap-1 border border-neutral-900 bg-black/50 p-1.5 transition-colors duration-200 hover:border-cyan-500/40 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
          >
            <d.icon className="h-3.5 w-3.5 text-neutral-500 transition-colors group-hover:text-cyan-400" />
            <span className="text-center font-orbitron text-[7px] leading-tight tracking-wider text-neutral-500">
              {d.label}
            </span>
            <span className="font-orbitron text-[8px] font-bold text-cyan-400">{d.level}</span>
          </div>
        ))}
      </div>

      {/* Knowledge tree progress */}
      <div className="border-t border-neutral-900 pt-3">
        <div className="flex items-center justify-between">
          <SectionLabel className="text-cyan-400/80">KNOWLEDGE TREE</SectionLabel>
          <span className="font-orbitron text-[9px] font-bold text-cyan-400">
            LV. {KNOWLEDGE_TREE_LEVEL} / {KNOWLEDGE_TREE_MAX}
          </span>
        </div>
        <div className="mt-1.5">
          <ProgressBar
            value={KNOWLEDGE_TREE_LEVEL}
            max={KNOWLEDGE_TREE_MAX}
            height="h-1.5"
            barClassName="shadow-[0_0_12px_#00d4ff]"
          />
        </div>
      </div>

      {/* Mental fortitude score */}
      <div
        className="relative overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-transparent p-3 text-center [clip-path:polygon(0_8px,8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)]"
      >
        <div className="energy-line pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        <SectionLabel className="text-cyan-400/80">MENTAL FORTITUDE SCORE</SectionLabel>
        <div className="mt-1 font-orbitron text-3xl font-black text-cyan-400 [text-shadow:0_0_20px_rgba(0,212,255,0.7)] animate-pulse-glow">
          {MENTAL_FORTITUDE_SCORE.toLocaleString()}
        </div>
      </div>
    </div>
  )
}

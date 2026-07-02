'use client'

import { motion } from 'framer-motion'
import {
  ACTIVE_QUESTS,
  ATTRIBUTES,
  AVAILABLE_STAT_POINTS,
  LONG_TERM_QUESTS,
  PHYSICAL_FITNESS,
  PLAYER_STATUS,
} from './mock-data'
import { HudPanel, ProgressBar, SectionLabel, StatTile } from './primitives'
import { StreakGridCard } from './StreakGridCard'
import { ProfileFrame } from './ProfileFrame'
import { useDashboard } from './DashboardShell'
import { CreditsFooter } from './CreditsFooter'
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
 * MobileStatusDashboard — the STATUS (Overview) screen, mobile-only (`lg:hidden`).
 *
 * Layout follows the spec:
 *   1. Hero — ProfileFrame (~40vh), full width, glow + scan animations preserved
 *   2. Status strip — XP, title, job
 *   3. Attributes | Active Quests — equal-height 50/50 row
 *   4. Mental Discipline — full width
 *   5. Physical Fitness — full width
 *   6. Stat Points — full-width banner
 *
 * Desktop StatusDashboard is untouched. This composes the *existing* primitives
 * + ProfileFrame so the ARISE aesthetic is preserved verbatim; only mobile
 * spacing/typography is applied here.
 */
export function MobileStatusDashboard() {
  const { playerName, avatarUrl, age, level, rank } = useDashboard()

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-3 px-4 pb-8 pt-4 lg:hidden">
      {/* ── 1. HERO — ProfileFrame ─────────────────────────────────────── */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={PANEL_VARIANTS}>
        <HudPanel
          glow
          scanline
          className="flex items-center justify-center overflow-hidden"
          bodyClassName="p-0"
        >
          {/* ~40vh hero band. ProfileFrame scales via its internal sm: sizes. */}
          <div className="flex min-h-[300px] w-full items-center justify-center py-6">
            <ProfileFrame playerName={playerName} avatarUrl={avatarUrl} age={age} level={level} rank={rank} />
          </div>
        </HudPanel>
      </motion.div>

      {/* ── 2. STATUS STRIP — XP / title / job ─────────────────────────── */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={PANEL_VARIANTS}>
        <MobileStatusStrip />
      </motion.div>

      {/* ── 3. ATTRIBUTES | ACTIVE QUESTS — 50/50 equal-height row ─────── */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={PANEL_VARIANTS}
        className="grid grid-cols-2 items-stretch gap-3"
      >
        <HudPanel header="ATTRIBUTES" rightHeader={<SectionLabel>6/6</SectionLabel>} className="flex flex-col">
          <MobileAttributesPanel />
        </HudPanel>
        <HudPanel header="QUESTS" rightHeader={<SectionLabel>{ACTIVE_QUESTS.length + LONG_TERM_QUESTS.length} ACTIVE</SectionLabel>} className="flex flex-col">
          <MobileQuestPanel />
        </HudPanel>
      </motion.div>

      {/* ── 4. STREAK GRID — full width ────────────────────────────────── */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={PANEL_VARIANTS}>
        <StreakGridCard />
      </motion.div>

      {/* ── 5. PHYSICAL FITNESS — full width ───────────────────────────── */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={PANEL_VARIANTS}>
        <HudPanel header="PHYSICAL FITNESS" rightHeader={<SectionLabel>VITAL STATS</SectionLabel>}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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

      {/* ── 6. STAT POINTS — full-width banner ─────────────────────────── */}
      <motion.div custom={5} initial="hidden" animate="visible" variants={PANEL_VARIANTS}>
        <MobileStatPointsPanel />
      </motion.div>

      {/* Thin HUD footer */}
      <footer className="flex items-center justify-between border-t border-neutral-900 pt-2">
        <span className="font-mono text-[8px] tracking-wider text-neutral-800">
          ARISE.SYS // STATUS_MODULE
        </span>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
          <span className="font-orbitron text-[9px] tracking-[0.3em] text-green-500 uppercase">
            Online
          </span>
        </div>
      </footer>

      {/* Credits row */}
      <CreditsFooter className="flex items-center justify-between border-t border-neutral-900 pt-1.5 mt-1.5" />
    </div>
  )
}

// ── Sub-panels (mobile-tuned spacing/typography) ───────────────────────────

function MobileStatusStrip() {
  const { xpCurrent, xpMax, title, job } = PLAYER_STATUS
  const xpPct = (xpCurrent / xpMax) * 100
  return (
    <HudPanel header="STATUS" scanline rightHeader={<SectionLabel>SYS.VER // 1.0.0</SectionLabel>}>
      <div className="space-y-2.5">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <SectionLabel>EXPERIENCE</SectionLabel>
            <span className="font-mono text-[9px] tracking-wider text-neutral-500">
              <span className="font-semibold text-cyan-400">{xpCurrent.toLocaleString()}</span> / {xpMax.toLocaleString()}
            </span>
          </div>
          <ProgressBar value={xpCurrent} max={xpMax} height="h-1.5" delay="200ms" />
        </div>
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
        <div className="flex items-center justify-between border-t border-neutral-900 pt-2">
          <span className="font-mono text-[8px] tracking-wider text-neutral-700">NEXT LV // {xpMax - xpCurrent} XP</span>
          <span className="font-mono text-[8px] tracking-wider text-neutral-700">{Math.round(xpPct)}%</span>
        </div>
      </div>
    </HudPanel>
  )
}

function MobileAttributesPanel() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      {ATTRIBUTES.map((attr, i) => (
        <div key={attr.name} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <attr.icon className="h-3 w-3 text-cyan-500/70" />
              <span className="font-orbitron text-[8px] font-semibold tracking-wider text-neutral-300">
                {attr.name}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              {attr.bonus > 0 && (
                <span className="font-orbitron text-[7px] font-bold text-green-500">+{attr.bonus}</span>
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

function MobileQuestPanel() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      {/* ── DAILY ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <SectionLabel className="text-cyan-400/70">DAILY</SectionLabel>
        {ACTIVE_QUESTS.slice(0, 4).map((quest) => (
          <MobileQuestItem key={quest.name} quest={quest} />
        ))}
      </div>

      {/* ── Separator ─────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
        <span className="font-orbitron text-[7px] tracking-[0.3em] text-neutral-700">◇</span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </div>

      {/* ── LONG TERM ─────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <SectionLabel className="text-cyan-400/70">LONG TERM</SectionLabel>
        {LONG_TERM_QUESTS.map((quest) => (
          <MobileQuestItem key={quest.name} quest={quest} />
        ))}
      </div>
    </div>
  )
}

function MobileQuestItem({ quest }: { quest: typeof ACTIVE_QUESTS[number] }) {
  const complete = quest.progress >= 100
  return (
    <div
      className="border border-neutral-900 bg-black/50 p-1.5 clip-hud-3"
    >
      <div className="flex items-center justify-between gap-1">
        <div className="flex min-w-0 items-center gap-1">
          <quest.icon
            className={cn(
              'h-3 w-3 shrink-0',
              complete ? 'text-green-500' : 'text-cyan-500/70',
            )}
          />
          <span className="truncate font-orbitron text-[8px] font-semibold tracking-wider text-neutral-200">
            {quest.name}
          </span>
        </div>
        <span
          className={cn(
            'shrink-0 font-orbitron text-[8px] font-bold tracking-wider',
            complete ? 'text-green-500' : 'text-cyan-400',
          )}
        >
          +{quest.xp.toLocaleString()}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-1.5">
        <ProgressBar value={quest.progress} height="h-1" barClassName={complete ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : undefined} />
        <span className="w-7 shrink-0 text-right font-mono text-[7px] tracking-wider text-neutral-500">
          {quest.progress}%
        </span>
      </div>
    </div>
  )
}

function MobileStatPointsPanel() {
  return (
    <div
      className="relative overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-transparent p-3 clip-hud-10"
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

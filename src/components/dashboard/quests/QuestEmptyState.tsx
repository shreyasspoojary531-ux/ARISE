'use client'

import { motion } from 'framer-motion'

/**
 * QuestEmptyState — the "NO ACTIVE QUESTS DETECTED" placeholder shown inside
 * each section panel when there are no quests. Features an animated ARISE-style
 * system icon: concentric pulsing cyan rings, a rotating diamond core, and an
 * orbiting energy node — all pure SVG + Framer Motion, no images.
 */
export function QuestEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-7 sm:gap-4 sm:py-10 text-center">
      {/* ── Animated system icon ────────────────────────────────────────── */}
      <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center">
        {/* Outer ring — slow pulse */}
        <motion.span
          className="absolute inset-0 rounded-full border border-cyan-500/30"
          animate={{ opacity: [0.25, 0.6, 0.25], scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Mid ring — counter pulse */}
        <motion.span
          className="absolute inset-2 rounded-full border border-cyan-500/40"
          animate={{ opacity: [0.5, 0.2, 0.5], scale: [1, 0.94, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Inner glow disc */}
        <span className="absolute inset-5 rounded-full bg-cyan-500/10 blur-[2px]" />

        {/* Rotating diamond core */}
        <motion.span
          className="relative h-5 w-5 rotate-45 border border-cyan-400/80 bg-cyan-500/20 shadow-[0_0_14px_rgba(0,212,255,0.6)]"
          animate={{ rotate: [45, 405] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Orbiting energy node */}
        <motion.span
          className="absolute inset-0"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,212,255,0.9)]" />
        </motion.span>
      </div>

      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className="space-y-1 sm:space-y-1.5">
        <h3 className="font-orbitron text-xs sm:text-sm font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-cyan-400">
          No Active Quests Detected
        </h3>
        <p className="font-sans text-[11px] sm:text-xs text-neutral-500">
          Create your first quest and begin your journey.
        </p>
      </div>

      {/* Faint HUD metadata */}
      <span className="font-mono text-[8px] tracking-wider text-neutral-700">
        SYS // AWAITING QUEST INPUT
      </span>
    </div>
  )
}

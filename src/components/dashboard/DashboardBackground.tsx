'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { DASHBOARD_PARTICLES } from './mock-data'

interface ParticleProps {
  x: number
  duration: number
  delay: number
  size: number
}

// Memoized so each particle renders independently without re-rendering siblings.
const Particle = memo(function Particle({ x, duration, delay, size }: ParticleProps) {
  return (
    <motion.div
      className="absolute rounded-full bg-cyan-400/40 will-change-transform"
      style={{ left: `${x}%`, width: size, height: size, bottom: -4 }}
      animate={{ y: [0, -1000], opacity: [0, 0.6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  )
})

/**
 * DashboardBackground — fixed, non-interactive layered backdrop:
 * masked cyber grid, dual radial glow blooms, faint CRT scanlines,
 * and slowly rising particles.
 */
export function DashboardBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Cyber grid with radial vignette mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_60%,transparent_100%)] opacity-60" />

      {/* Top-center glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.07)_0%,transparent_70%)]" />

      {/* Off-center ambient bloom */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.04)_0%,transparent_70%)]" />

      {/* Faint CRT scanline texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.4) 2px, rgba(0,212,255,0.4) 3px)',
        }}
      />

      {/* Rising particles */}
      {DASHBOARD_PARTICLES.map((p) => (
        <Particle key={p.id} x={p.x} duration={p.duration} delay={p.delay} size={p.size} />
      ))}
    </div>
  )
}

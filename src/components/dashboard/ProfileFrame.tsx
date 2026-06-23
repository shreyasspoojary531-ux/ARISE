'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProfileFrameProps {
  playerName: string
  avatarUrl?: string | null
  age: string
  level: number
  rank: string
}

// The dial renders 60 ticks. Rather than 60 individually-styled <span> DOM
// nodes (each maintained by React), the entire dial is a single static SVG
// computed once. The parent motion.div still rotates the whole group, so the
// visual is byte-for-byte identical — but reconciliation cost drops from
// 60 elements to 1, and the markup ships ~60 fewer nodes to the client.
const TICK_COUNT = 60

/**
 * TickDial — a memoized SVG of 60 radial ticks (majors every 5th in cyan,
 * minors dim). Drawn once; never re-renders since its props never change.
 */
const TickDial = memo(function TickDial() {
  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = (i / TICK_COUNT) * Math.PI * 2
    const isMajor = i % 5 === 0
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const outer = 48 // outer edge of the dial (viewBox 0 0 100 100)
    // Major ticks reach further inward than minor ones — matches the
    // original h-2 vs h-1 length difference.
    const inner = isMajor ? 40 : 44
    return { x1: 50 + cos * inner, y1: 50 + sin * inner, x2: 50 + cos * outer, y2: 50 + sin * outer, isMajor }
  })

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      aria-hidden
    >
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.isMajor ? 'rgba(34,211,238,0.7)' : 'rgba(64,64,64,0.8)'}
          strokeWidth={t.isMajor ? 0.5 : 0.3}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
})

/**
 * ProfileFrame — compact circular holographic frame.
 * Designed to fit within a non-scrollable viewport panel.
 * Rotating energy rings, scanner sweep, tick dial, ping pulse,
 * avatar core, and identity readout below.
 */
export function ProfileFrame({ playerName, avatarUrl, age, level, rank }: ProfileFrameProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.10)_0%,transparent_65%)]" />

      {/* Circular frame — smaller for compact fit */}
      <div
        className="relative flex h-[200px] w-[200px] items-center justify-center sm:h-[240px] sm:w-[240px]"
        style={{ perspective: 1000 }}
      >
        {/* Outermost dashed ring (slow clockwise) */}
        <motion.div
          className="absolute h-full w-full rounded-full border border-dashed border-cyan-500/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        {/* Tick dial (medium counter-clockwise) */}
        <motion.div
          className="absolute h-[92%] w-[92%]"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        >
          <TickDial />
        </motion.div>
        {/* Solid thin ring */}
        <div className="absolute h-[80%] w-[80%] rounded-full border border-cyan-500/30" />
        {/* Segmented inner ring (fast clockwise) */}
        <motion.div
          className="absolute h-[68%] w-[68%] rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(0,212,255,0.0) 10deg, rgba(0,212,255,0.5) 20deg, transparent 30deg, transparent 90deg, rgba(0,212,255,0.3) 100deg, transparent 120deg, transparent 180deg, rgba(0,212,255,0.4) 200deg, transparent 220deg, transparent 300deg, rgba(0,212,255,0.3) 320deg, transparent 340deg)',
            maskImage: 'radial-gradient(transparent 62%, #000 63%, #000 68%, transparent 69%)',
            WebkitMaskImage: 'radial-gradient(transparent 62%, #000 63%, #000 68%, transparent 69%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />

        {/* Rotating scanner sweep */}
        <motion.div
          className="absolute h-[68%] w-[68%] rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(0,212,255,0.35) 0deg, transparent 60deg, transparent 360deg)',
            maskImage: 'radial-gradient(circle, #000 0%, #000 70%, transparent 71%)',
            WebkitMaskImage: 'radial-gradient(circle, #000 0%, #000 70%, transparent 71%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Ping pulse */}
        <div className="absolute h-[60%] w-[60%] rounded-full border border-cyan-400/30 animate-ping" />
        {/* Inner solid border */}
        <div className="absolute h-[58%] w-[58%] rounded-full border border-cyan-500/40 shadow-[0_0_24px_-6px_rgba(0,212,255,0.6)]" />

        {/* Core avatar */}
        <div className="relative z-10 flex h-[40%] w-[40%] items-center justify-center overflow-hidden rounded-full border-2 border-cyan-500/50 bg-gradient-to-b from-cyan-950/40 to-black">
          <motion.div
            className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          {avatarUrl ? (
            <Image src={avatarUrl} alt={playerName} fill className="object-cover" sizes="120px" />
          ) : (
            <span className="font-orbitron text-4xl font-black text-cyan-300/90">
              {playerName[0]?.toUpperCase()}
            </span>
          )}
        </div>

        {/* Corner brackets */}
        <BracketCorners />
      </div>

      {/* Identity readout — compact */}
      <div className="relative mt-4 flex flex-col items-center">
        <span className="font-orbitron text-[8px] tracking-[0.35em] text-cyan-400 uppercase">
          Hunter Profile
        </span>
        <h2 className="mt-1 font-orbitron text-xl font-black tracking-widest text-white uppercase sm:text-2xl">
          {playerName}
        </h2>

        <div className="mt-3 flex items-center gap-3">
          <ReadoutChip label="AGE" value={age} />
          <span className="h-5 w-px bg-neutral-800" />
          <ReadoutChip label="LEVEL" value={String(level)} accent />
          <span className="h-5 w-px bg-neutral-800" />
          <ReadoutChip label="RANK" value={`${rank}-RANK`} accent />
        </div>
      </div>
    </div>
  )
}

function ReadoutChip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-orbitron text-[8px] tracking-widest text-neutral-600 uppercase">{label}</span>
      <span className={cn('font-orbitron text-sm font-bold', accent ? 'text-cyan-400' : 'text-white')}>
        {value}
      </span>
    </div>
  )
}

function BracketCorners() {
  const base = 'absolute h-4 w-4 border-cyan-400/60'
  return (
    <>
      <span className={cn(base, 'left-0 top-0 border-l border-t')} />
      <span className={cn(base, 'right-0 top-0 border-r border-t')} />
      <span className={cn(base, 'bottom-0 left-0 border-b border-l')} />
      <span className={cn(base, 'bottom-0 right-0 border-b border-r')} />
    </>
  )
}

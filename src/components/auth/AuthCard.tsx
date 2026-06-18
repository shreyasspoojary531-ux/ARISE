'use client'

import { motion } from 'framer-motion'

interface AuthCardProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[420px]"
    >
      {/* Outer glow */}
      <div className="absolute -inset-px bg-gradient-to-b from-cyan-500/10 to-transparent rounded-none pointer-events-none [clip-path:polygon(0_12px,12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%)]" />

      {/* Card */}
      <div className="relative border border-neutral-800/80 bg-neutral-950/90 backdrop-blur-xl px-8 py-8 hud-scanline [clip-path:polygon(0_12px,12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%)]">

        {/* Corner accents — top-left cyan */}
        <span className="absolute top-0 left-0 w-5 h-[1px] bg-cyan-500/70" />
        <span className="absolute top-0 left-0 w-[1px] h-5 bg-cyan-500/70" />
        {/* Corner accents — bottom-right cyan */}
        <span className="absolute bottom-0 right-0 w-5 h-[1px] bg-cyan-500/70" />
        <span className="absolute bottom-0 right-0 w-[1px] h-5 bg-cyan-500/70" />
        {/* Corner accents — top-right dim */}
        <span className="absolute top-0 right-0 w-5 h-[1px] bg-neutral-700/50" />
        <span className="absolute top-0 right-0 w-[1px] h-5 bg-neutral-700/50" />
        {/* Corner accents — bottom-left dim */}
        <span className="absolute bottom-0 left-0 w-5 h-[1px] bg-neutral-700/50" />
        <span className="absolute bottom-0 left-0 w-[1px] h-5 bg-neutral-700/50" />

        {/* Card header */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse inline-block" />
            <span className="font-orbitron text-[8px] tracking-[0.3em] text-neutral-600 uppercase">
              ARISE // AUTH SYSTEM
            </span>
          </div>
          <h2 className="font-orbitron text-xl font-bold tracking-widest text-white uppercase leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="font-sans text-sm text-neutral-500 mt-1">{subtitle}</p>
          )}
          <div className="mt-3 h-px w-full bg-gradient-to-r from-cyan-500/20 via-neutral-800 to-transparent" />
        </div>

        {children}
      </div>
    </motion.div>
  )
}

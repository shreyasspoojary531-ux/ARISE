'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Pre-computed to avoid SSR/hydration mismatch
const PARTICLES = [
  { id: 0,  x: 4,  duration: 14, delay: 0,   size: 1.5 },
  { id: 1,  x: 12, duration: 9,  delay: 2,   size: 1 },
  { id: 2,  x: 21, duration: 16, delay: 5,   size: 2 },
  { id: 3,  x: 30, duration: 11, delay: 1,   size: 1 },
  { id: 4,  x: 38, duration: 13, delay: 3.5, size: 1.5 },
  { id: 5,  x: 47, duration: 10, delay: 4,   size: 2 },
  { id: 6,  x: 56, duration: 15, delay: 0.5, size: 1 },
  { id: 7,  x: 64, duration: 12, delay: 2.5, size: 1.5 },
  { id: 8,  x: 73, duration: 8,  delay: 1.5, size: 1 },
  { id: 9,  x: 82, duration: 17, delay: 3,   size: 2 },
  { id: 10, x: 91, duration: 11, delay: 6,   size: 1 },
  { id: 11, x: 8,  duration: 14, delay: 7,   size: 1.5 },
  { id: 12, x: 26, duration: 9,  delay: 8,   size: 2 },
  { id: 13, x: 52, duration: 16, delay: 9,   size: 1 },
  { id: 14, x: 78, duration: 12, delay: 10,  size: 1.5 },
]

const STATS = [
  { label: 'RANK',    value: 'S-CLASS' },
  { label: 'HUNTERS', value: '∞'       },
  { label: 'STATUS',  value: 'ACTIVE'  },
]

export function AuthBackground() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex flex-col items-center justify-center p-12 select-none">

      {/* Cyberpunk grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

      {/* Radial cyan glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/40"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, bottom: -4 }}
          animate={{ y: [0, -900], opacity: [0, 0.7, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Horizontal scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Hunter silhouette */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-[65vh] opacity-[0.06] pointer-events-none">
        <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M400 150 L420 250 L460 260 L440 280 L450 340 L480 390 L490 440 L450 490 L420 600 L380 600 L350 490 L310 440 L320 390 L350 340 L360 280 L340 260 L380 250 Z" fill="url(#auth-bg-gradient)" />
          <path d="M400 130 L415 150 L385 150 Z" fill="url(#auth-bg-gradient)" />
          <defs>
            <linearGradient id="auth-bg-gradient" x1="400" y1="130" x2="400" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00d4ff" />
              <stop offset="1" stopColor="#000000" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Scan-line overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,black 2px,black 4px)' }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center space-y-8 max-w-sm"
      >
        {/* System status badge */}
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse rounded-full inline-block" />
          <span className="font-orbitron text-[9px] tracking-[0.3em] text-neutral-500 uppercase">
            System Online // v1.0.0
          </span>
        </div>

        {/* Logo mark + wordmark */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center"
          >
            <Image src="/images/logo.png" alt="ARISE Logo" width={80} height={80} className="object-contain" priority />
          </motion.div>

          <motion.h1
            className="font-orbitron text-7xl font-black tracking-widest text-white leading-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A<span className="text-cyan-400">R</span>ISE
          </motion.h1>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <p className="font-orbitron text-[10px] tracking-[0.25em] text-neutral-500 uppercase leading-relaxed">
            Become The Strongest<br />Version Of Yourself
          </p>
        </div>

        {/* Quote */}
        <motion.div
          className="border-l-2 border-cyan-500/30 pl-5 text-left"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="font-sans text-sm text-neutral-500 italic leading-relaxed">
            &ldquo;I alone am the exception.&rdquo;
          </p>
          <p className="font-orbitron text-[9px] tracking-widest text-neutral-700 mt-2">
            — Sung Jin-Woo
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          className="grid grid-cols-3 gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {STATS.map(({ label, value }) => (
            <div key={label} className="border border-neutral-900 bg-black/40 py-3 text-center [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]">
              <div className="font-orbitron text-[8px] tracking-widest text-neutral-700">{label}</div>
              <div className="font-orbitron text-[11px] font-bold text-cyan-400 mt-0.5">{value}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* HUD footer */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
        <span className="font-mono text-[8px] text-neutral-800 tracking-wider">ARISE.SYS // AUTH_MODULE</span>
        <span className="font-mono text-[8px] text-neutral-800 tracking-wider">SEC_LEVEL // CLASS-A</span>
      </div>

      {/* Corner accent lines */}
      <span className="absolute top-0 left-0 w-16 h-[1px] bg-gradient-to-r from-cyan-500/30 to-transparent" />
      <span className="absolute top-0 left-0 w-[1px] h-16 bg-gradient-to-b from-cyan-500/30 to-transparent" />
      <span className="absolute bottom-0 right-0 w-16 h-[1px] bg-gradient-to-l from-cyan-500/30 to-transparent" />
      <span className="absolute bottom-0 right-0 w-[1px] h-16 bg-gradient-to-t from-cyan-500/30 to-transparent" />
    </div>
  )
}

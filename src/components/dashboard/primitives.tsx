import * as React from 'react'
import { cn } from '@/lib/utils'

// Clip-path tokens — chamfered (cut-corner) rectangles.
// Convention (per CLAUDE.md §2.3): cut the top-left + bottom-right corners.
const CLIP_PANEL = 'polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)'

/**
 * CornerAccents — the HUD bracket lines at panel corners.
 * Cyan at top-left + bottom-right; dim neutral at the other two.
 */
export function CornerAccents({
  className,
  cyanClass = 'bg-cyan-500/60',
  dimClass = 'bg-neutral-700/50',
  length = 'w-4 h-4',
}: {
  className?: string
  cyanClass?: string
  dimClass?: string
  length?: string
}) {
  // Split "w-4 h-4" into width/height for the span rules.
  const [w, h] = length.split(' ')
  return (
    <span className={cn('pointer-events-none absolute inset-0', className)} aria-hidden>
      {/* top-left cyan */}
      <span className={cn('absolute top-0 left-0', w, 'h-px', cyanClass)} />
      <span className={cn('absolute top-0 left-0 w-px', h, cyanClass)} />
      {/* bottom-right cyan */}
      <span className={cn('absolute bottom-0 right-0', w, 'h-px', cyanClass)} />
      <span className={cn('absolute bottom-0 right-0 w-px', h, cyanClass)} />
      {/* top-right dim */}
      <span className={cn('absolute top-0 right-0', w, 'h-px', dimClass)} />
      <span className={cn('absolute top-0 right-0 w-px', h, dimClass)} />
      {/* bottom-left dim */}
      <span className={cn('absolute bottom-0 left-0', w, 'h-px', dimClass)} />
      <span className={cn('absolute bottom-0 left-0 w-px', h, dimClass)} />
    </span>
  )
}

/**
 * HudPanel — the base glassmorphism panel with clip-path corners,
 * accent brackets, scan-line overlay, and a section header slot.
 */
export function HudPanel({
  children,
  className,
  header,
  rightHeader,
  glow = false,
  scanline = false,
  bodyClassName,
}: {
  children: React.ReactNode
  className?: string
  header?: React.ReactNode
  rightHeader?: React.ReactNode
  glow?: boolean
  scanline?: boolean
  // Override the default panel padding (e.g. for full-bleed children).
  // Optional — every existing caller is unaffected and keeps the default.
  bodyClassName?: string
}) {
  return (
    <section
      className={cn(
        'relative border border-neutral-800/70 bg-neutral-950/50 backdrop-blur-md transition-colors duration-300',
        bodyClassName ?? 'p-4 sm:p-5',
        scanline && 'hud-scanline',
        glow && 'border-cyan-500/25 shadow-[0_0_24px_-8px_rgba(0,212,255,0.35)]',
        className,
      )}
      style={{ clipPath: CLIP_PANEL }}
    >
      <CornerAccents />
      {header && <PanelHeader right={rightHeader}>{header}</PanelHeader>}
      {children}
    </section>
  )
}

/**
 * PanelHeader — the standard panel title row: pulsing dot + Orbitron label.
 */
export function PanelHeader({
  children,
  right,
  className,
}: {
  children: React.ReactNode
  right?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative mb-4 flex items-center justify-between', className)}>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse inline-block" />
        <span className="font-orbitron text-[10px] tracking-[0.25em] text-neutral-300 font-semibold uppercase">
          {children}
        </span>
      </div>
      {right}
    </div>
  )
}

/**
 * ProgressBar — animated thin progress bar with cyan glow.
 */
export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  height = 'h-1.5',
  delay = '0ms',
}: {
  value: number
  max?: number
  className?: string
  barClassName?: string
  height?: string
  delay?: string
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-neutral-900/80',
        height,
        className,
      )}
      style={{ clipPath: 'polygon(0 1px, 100% 0, 100% 100%, 0 100%)' }}
    >
      <div
        className={cn(
          'absolute inset-y-0 left-0 bg-cyan-500 shadow-[0_0_8px_#00d4ff] origin-left animate-progress',
          barClassName,
        )}
        style={{
          width: `${pct}%`,
          animationDelay: delay,
          transform: 'scaleX(0)',
        }}
      />
    </div>
  )
}

/**
 * StatTile — compact futuristic stat card (icon + label + value).
 */
export function StatTile({
  label,
  value,
  unit,
  icon: Icon,
  className,
  accent = false,
}: {
  label: string
  value: string
  unit?: string
  icon?: React.ComponentType<{ className?: string; size?: number }>
  className?: string
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        'group relative border bg-black/40 px-3 py-2.5 transition-colors duration-300',
        accent ? 'border-cyan-500/25 hover:border-cyan-400/50' : 'border-neutral-900 hover:border-neutral-700',
        className,
      )}
      style={{ clipPath: 'polygon(0 4px, 4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%)' }}
    >
      <div className="flex items-center justify-between">
        <span className="font-orbitron text-[8px] tracking-widest text-neutral-600 uppercase">{label}</span>
        {Icon && (
          <Icon className={cn(
            'w-3.5 h-3.5 transition-colors',
            accent ? 'text-cyan-500/70 group-hover:text-cyan-400' : 'text-neutral-700 group-hover:text-neutral-400',
          )} />
        )}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={cn('font-orbitron text-base font-bold', accent ? 'text-cyan-400' : 'text-white')}>
          {value}
        </span>
        {unit && <span className="font-orbitron text-[9px] tracking-wider text-neutral-600">{unit}</span>}
      </div>
    </div>
  )
}

/**
 * SectionLabel — small uppercase Orbitron label used inline within panels.
 */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('font-orbitron text-[8px] tracking-[0.25em] text-neutral-600 uppercase', className)}>
      {children}
    </span>
  )
}

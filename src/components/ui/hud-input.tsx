'use client'

import type { InputHTMLAttributes } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── HUD-styled text input ──────────────────────────────────────────────────
// Consolidated from 4 separate implementations (LoginForm, SignupForm,
// OnboardingInput, quest form-fields). Same visual output, one source.
// ponytail: single component, per-use sizing via className overrides

export interface HudInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  icon?: React.ReactNode
  endAdornment?: React.ReactNode
  error?: string
  autoComplete?: string
  extra?: React.ReactNode
  maxLength?: number
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode']
  /** Override input element classes (e.g. responsive sizing for quest forms) */
  inputClassName?: string
  /** Override label classes (e.g. responsive font size for quest forms) */
  labelClassName?: string
  /** Override icon wrapper position classes */
  iconClassName?: string
}

export function HudInput({
  id, label, type = 'text', value, onChange,
  placeholder, icon, endAdornment, error, autoComplete, extra,
  maxLength, inputMode, inputClassName, labelClassName, iconClassName,
}: HudInputProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className={cn(
          'block font-orbitron text-[9px] tracking-widest text-neutral-500 uppercase',
          labelClassName,
        )}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 text-neutral-700 pointer-events-none',
            iconClassName,
          )}>
            {icon}
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          className={cn(
            'w-full bg-neutral-900/60 border text-white text-sm font-sans placeholder:text-neutral-700',
            'px-4 py-3 outline-none transition-colors duration-200',
            'clip-hud-4',
            icon && 'pl-9',
            endAdornment && 'pr-10',
            error
              ? 'border-red-500/50 focus:border-red-400/70'
              : 'border-neutral-800 focus:border-cyan-500/50',
            inputClassName,
          )}
        />
        {endAdornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {endAdornment}
          </div>
        )}
      </div>
      {extra}
      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 font-sans text-xs text-red-400"
          >
            <AlertCircle size={10} className="shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── HUD-styled checkbox ────────────────────────────────────────────────────

export interface HudCheckboxProps {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  label: React.ReactNode
  /** 'center' = flex items-center (auth), 'start' = flex items-start (signup terms) */
  align?: 'center' | 'start'
}

export function HudCheckbox({
  id, checked, onChange, label, align = 'center',
}: HudCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex gap-2.5 cursor-pointer group',
        align === 'start' ? 'items-start' : 'items-center',
      )}
    >
      <div
        className={cn(
          'relative w-4 h-4 shrink-0 border transition-colors duration-150',
          'clip-hud-2',
          align === 'start' && 'mt-0.5',
          checked ? 'border-cyan-500 bg-cyan-500/20' : 'border-neutral-700 bg-neutral-900 group-hover:border-neutral-600',
        )}
      >
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-cyan-400" />
          </motion.div>
        )}
      </div>
      <span
        className={cn(
          'font-sans text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors',
          align === 'start' && 'leading-relaxed',
        )}
      >
        {label}
      </span>
    </label>
  )
}

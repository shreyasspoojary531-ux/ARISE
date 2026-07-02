'use client'

import * as React from 'react'
import { Clock, Calendar, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUEST_CATEGORIES } from './constants'
import { HudInput } from '@/components/ui/hud-input'
import { cn } from '@/lib/utils'
import type { QuestCategory } from './types'

/**
 * Shared, HUD-styled form fields for the Quest create/edit form.
 * TextField now delegates to the shared HudInput component.
 */

// ── Text input ──────────────────────────────────────────────────────────────

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  icon?: React.ReactNode
  error?: string
  maxLength?: number
  autoComplete?: string
}

export function TextField(props: TextFieldProps) {
  return (
    <HudInput
      {...props}
      // ponytail: quest forms use responsive sizing vs auth's fixed sizing
      inputClassName="text-xs sm:text-sm px-3 py-2.5 sm:px-4 sm:py-3"
      labelClassName="text-[8px] sm:text-[9px]"
      iconClassName="left-2.5 sm:left-3"
    />
  )
}

// ── Category chips ──────────────────────────────────────────────────────────

interface CategoryChipsProps {
  value: QuestCategory
  onChange: (c: QuestCategory) => void
}

export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <div className="space-y-1.5">
      <label className="block font-orbitron text-[8px] sm:text-[9px] tracking-widest text-neutral-500 uppercase">
        Category
      </label>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {QUEST_CATEGORIES.map((c) => {
          const active = c.label === value
          const Icon = c.icon
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => onChange(c.label)}
              className={cn(
                'group relative inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2 font-orbitron text-[8px] sm:text-[9px] font-semibold tracking-widest uppercase transition-colors duration-200 cursor-pointer',
                'clip-hud-3',
                active
                  ? 'border border-cyan-400/70 bg-cyan-500/15 text-cyan-300 shadow-[0_0_14px_-4px_rgba(0,212,255,0.7)]'
                  : 'border border-neutral-800 bg-black/40 text-neutral-500 hover:border-cyan-500/40 hover:text-neutral-200',
              )}
            >
              <Icon className={cn('h-2.5 w-2.5 sm:h-3 sm:w-3', active ? 'text-cyan-400' : 'text-neutral-600')} />
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Range row (shared shell for the two-pair time / date pickers) ────────────

interface RangeProps {
  label: string
  left: React.ReactNode
  right: React.ReactNode
  error?: string
}

export function RangeRow({ label, left, right, error }: RangeProps) {
  return (
    <div className="space-y-1.5">
      <label className="block font-orbitron text-[8px] sm:text-[9px] tracking-widest text-neutral-500 uppercase">
        {label}
      </label>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {left}
        <span className="font-orbitron text-[9px] sm:text-[10px] font-bold tracking-widest text-cyan-400/70">
          →
        </span>
        {right}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 font-sans text-[11px] sm:text-xs text-red-400"
          >
            <AlertCircle size={10} className="shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Time picker (single end of a time range) ────────────────────────────────

interface TimeInputProps {
  id: string
  value: string // "HH:MM" 24h
  onChange: (v: string) => void
}

export function TimeInput({ id, value, onChange }: TimeInputProps) {
  return (
    <div className="relative flex-1">
      <Clock
        size={12}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-700 sm:left-3"
      />
      <input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full bg-neutral-900/60 border border-neutral-800 text-white text-xs sm:text-sm font-sans focus:border-cyan-500/50',
          'px-2 py-2.5 pl-8 sm:px-3 sm:py-3 sm:pl-9 outline-none transition-colors duration-200',
          'clip-hud-4',
          '[color-scheme:dark]',
        )}
      />
    </div>
  )
}

// ── Date picker (single end of a date range) ────────────────────────────────

interface DateInputProps {
  id: string
  value: string // yyyy-mm-dd
  onChange: (v: string) => void
  min?: string
}

export function DateInput({ id, value, onChange, min }: DateInputProps) {
  return (
    <div className="relative flex-1">
      <Calendar
        size={12}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-700 z-10 sm:left-3"
      />
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full bg-neutral-900/60 border border-neutral-800 text-white text-xs sm:text-sm font-sans focus:border-cyan-500/50',
          'px-2 py-2.5 pl-8 sm:px-3 sm:py-3 sm:pl-9 outline-none transition-colors duration-200',
          'clip-hud-4',
          '[color-scheme:dark]',
        )}
      />
    </div>
  )
}

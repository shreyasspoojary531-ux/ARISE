'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Flag, Check } from 'lucide-react'
import { TextField, CategoryChips, RangeRow, TimeInput, DateInput } from './form-fields'
import { cn } from '@/lib/utils'
import type { AnyQuest, QuestCategory, QuestDraft } from './types'

interface QuestFormProps {
  type: 'daily' | 'long-term'
  /** Present when editing; initial field values. */
  initial?: AnyQuest
  onSubmit: (draft: QuestDraft) => void
  onCancel: () => void
}

/** Today as yyyy-mm-dd — used as the default long-term start date. */
function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Today + 30 days as yyyy-mm-dd — default long-term end date. */
function defaultEndIso(): string {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

/**
 * QuestForm — the create/edit form body. Single-select category (required),
 * a quest name, and either a time range (daily) or date range (long-term).
 *
 * Field state is fully local. Validation runs on submit; errors render via
 * the shared field error slots (AnimatePresence mount/unmount, CLAUDE.md §6.3).
 */
export function QuestForm({ type, initial, onSubmit, onCancel }: QuestFormProps) {
  const isDaily = type === 'daily'

  const [name, setName] = useState(initial?.name ?? '')
  const [category, setCategory] = useState<QuestCategory>(
    (initial?.category as QuestCategory) ?? 'Fitness',
  )
  const [startTime, setStartTime] = useState(
    isDaily ? (initial && initial.type === 'daily' ? initial.startTime : '06:00') : '',
  )
  const [endTime, setEndTime] = useState(
    isDaily ? (initial && initial.type === 'daily' ? initial.endTime : '07:00') : '',
  )
  const [startDate, setStartDate] = useState(
    !isDaily ? (initial && initial.type === 'long-term' ? initial.startDate : todayIso()) : '',
  )
  const [endDate, setEndDate] = useState(
    !isDaily ? (initial && initial.type === 'long-term' ? initial.endDate : defaultEndIso()) : '',
  )

  const [errors, setErrors] = useState<{
    name?: string
    range?: string
  }>({})

  // Clear the name error as soon as the user edits the name field.
  const handleNameChange = (v: string) => {
    setName(v)
    if (errors.name) setErrors((e) => ({ ...e, name: undefined }))
  }

  const validate = (): boolean => {
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Quest name is required.'
    if (isDaily) {
      if (!startTime || !endTime) next.range = 'Both start and end times are required.'
      else if (startTime >= endTime) next.range = 'End time must be after start time.'
    } else {
      if (!startDate || !endDate) next.range = 'Both start and end dates are required.'
      else if (startDate > endDate) next.range = 'End date must be on or after start date.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (isDaily) {
      onSubmit({ type: 'daily', name, category, startTime, endTime })
    } else {
      onSubmit({ type: 'long-term', name, category, startDate, endDate })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5 sm:space-y-4">
      {/* Quest name */}
      <TextField
        id="quest-name"
        label="Quest Name"
        value={name}
        onChange={handleNameChange}
        placeholder={isDaily ? 'Morning Workout' : 'Learn React'}
        icon={isDaily ? <Flag size={13} /> : <Target size={13} />}
        error={errors.name}
        maxLength={60}
        autoComplete="off"
      />

      {/* Category chips */}
      <CategoryChips value={category} onChange={setCategory} />

      {/* Range — time (daily) or date (long-term) */}
      {isDaily ? (
        <RangeRow
          label="Time Range"
          left={<TimeInput id="start-time" value={startTime} onChange={setStartTime} />}
          right={<TimeInput id="end-time" value={endTime} onChange={setEndTime} />}
          error={errors.range}
        />
      ) : (
        <RangeRow
          label="Date Range"
          left={<DateInput id="start-date" value={startDate} onChange={setStartDate} />}
          right={<DateInput id="end-date" value={endDate} onChange={setEndDate} min={startDate} />}
          error={errors.range}
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-neutral-800 bg-black/40 py-2.5 sm:py-3 font-orbitron text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-neutral-400 transition-colors hover:border-neutral-700 hover:text-neutral-200 [clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]"
        >
          Cancel
        </button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            'relative flex flex-[1.5] items-center justify-center gap-2 font-orbitron text-[10px] sm:text-[11px] font-bold tracking-widest uppercase py-2.5 sm:py-3 cursor-pointer',
            'before:absolute before:inset-0 before:-z-10 before:[clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)] before:bg-cyan-500/30 hover:before:bg-cyan-400/40 before:transition-colors',
            'after:absolute after:inset-[1px] after:-z-10 after:[clip-path:polygon(0_5px,5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%)] after:bg-cyan-950/30 after:transition-colors',
            'text-cyan-400 hover:text-cyan-300',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key="label"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-2"
            >
              <Check className="h-3.5 w-3.5" />
              {initial ? 'Update Quest' : 'Add Quest'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </form>
  )
}

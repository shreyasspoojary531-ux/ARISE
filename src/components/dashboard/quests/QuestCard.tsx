'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, Clock, Calendar, Check } from 'lucide-react'
import { CATEGORY_ICON } from './constants'
import { ProgressBar } from '../primitives'
import { cn } from '@/lib/utils'
import type { AnyQuest } from './types'

/**
 * Helpers — format stored values for display.
 */

/** "06:00" → "06:00 AM" */
function formatTime(time: string): string {
  const [hStr, m] = time.split(':')
  const h = Number(hStr)
  if (Number.isNaN(h)) return time
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${String(h12).padStart(2, '0')}:${m} ${period}`
}

/** "2026-07-01" → "01 Jul 2026" */
function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

interface QuestCardProps {
  quest: AnyQuest
  onToggle: (id: string) => void
  onEdit: (quest: AnyQuest) => void
  onDelete: (id: string) => void
}

/**
 * QuestCard — a single quest tile. Renders daily (time range + checkbox) or
 * long-term (date range + progress bar) details. Hover intensifies the cyan
 * glow; completed quests get a green accent and strikethrough name.
 *
 * Delete uses an inline two-step confirm (no native confirm()) so the gesture
 * stays within the HUD aesthetic.
 */
export function QuestCard({ quest, onToggle, onEdit, onDelete }: QuestCardProps) {
  const [confirming, setConfirming] = useState(false)
  const Icon = CATEGORY_ICON[quest.category]
  const isDaily = quest.type === 'daily'

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-2.5 sm:gap-3 border bg-black/50 p-3 sm:p-4 transition-all duration-200',
        quest.completed
          ? 'border-green-500/30'
          : 'border-neutral-900 hover:border-cyan-500/50 hover:shadow-[0_0_24px_-10px_rgba(0,212,255,0.6)]',
        '[clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]',
      )}
    >
      {/* ── Top row: completion toggle + name ────────────────────────────── */}
      <div className="flex items-start gap-2.5 sm:gap-3">
        {/* Completion checkbox */}
        <button
          type="button"
          onClick={() => onToggle(quest.id)}
          aria-pressed={quest.completed}
          aria-label={quest.completed ? 'Mark incomplete' : 'Mark complete'}
          className={cn(
            'group/check relative mt-0.5 flex h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 items-center justify-center border transition-colors duration-150 cursor-pointer',
            '[clip-path:polygon(0_2px,2px_0,100%_0,100%_calc(100%-2px),calc(100%-2px)_100%,0_100%)]',
            quest.completed
              ? 'border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/30'
              : 'border-neutral-700 bg-neutral-900 hover:border-cyan-500/60',
          )}
        >
          {quest.completed && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="h-3 w-3 text-cyan-300" strokeWidth={3} />
            </motion.span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
            <h4
              className={cn(
                'font-orbitron text-[11px] sm:text-[12px] font-semibold tracking-wider text-neutral-100 leading-snug',
                quest.completed && 'text-neutral-500 line-through',
              )}
            >
              {quest.name}
            </h4>
            {/* Action buttons */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(quest)}
                aria-label="Edit quest"
                className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center border border-neutral-800 bg-black/40 text-neutral-500 transition-colors hover:border-cyan-500/50 hover:text-cyan-400 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
              >
                <Pencil className="h-3 w-3" />
              </button>
              {/* Delete — swaps to a confirm state */}
              {!confirming ? (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  aria-label="Delete quest"
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center border border-neutral-800 bg-black/40 text-neutral-500 transition-colors hover:border-red-500/50 hover:text-red-400 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    className="flex items-center"
                  >
                    <button
                      type="button"
                      onClick={() => onDelete(quest.id)}
                      className="flex h-6 sm:h-7 items-center gap-1 border border-red-500/50 bg-red-500/10 px-2 font-orbitron text-[8px] font-bold tracking-wider uppercase text-red-300 transition-colors hover:bg-red-500/20 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
                    >
                      Delete?
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(false)}
                      aria-label="Cancel delete"
                      className="ml-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center border border-neutral-800 bg-black/40 text-neutral-500 transition-colors hover:text-neutral-200 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
                    >
                      <span className="text-xs">×</span>
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Category badge */}
          <div className="mt-1.5 inline-flex items-center gap-1.5 border border-neutral-800 bg-neutral-950/60 px-2 py-0.5 [clip-path:polygon(0_2px,2px_0,100%_0,100%_calc(100%-2px),calc(100%-2px)_100%,0_100%)]">
            <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-cyan-500/70" />
            <span className="font-orbitron text-[7px] sm:text-[8px] font-semibold tracking-widest uppercase text-neutral-400">
              {quest.category}
            </span>
          </div>
        </div>
      </div>

      {/* ── Schedule ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-t border-neutral-900 pt-2 sm:pt-3">
        {isDaily ? (
          <>
            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-neutral-600" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-cyan-400/80">
              {formatTime((quest as AnyQuest & { startTime: string }).startTime)} →{' '}
              {formatTime((quest as AnyQuest & { endTime: string }).endTime)}
            </span>
          </>
        ) : (
          <>
            <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-neutral-600" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-cyan-400/80">
              {formatDate((quest as AnyQuest & { startDate: string }).startDate)} →{' '}
              {formatDate((quest as AnyQuest & { endDate: string }).endDate)}
            </span>
          </>
        )}
      </div>

      {/* ── Progress / status (long-term) ────────────────────────────────── */}
      {!isDaily && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[7px] sm:text-[8px] tracking-wider text-neutral-700">
              {quest.completed ? 'COMPLETED' : 'PROGRESS'}
            </span>
            <span className="font-orbitron text-[8px] sm:text-[9px] font-bold text-cyan-400">
              {(quest as AnyQuest & { progress: number }).progress}%
            </span>
          </div>
          <ProgressBar
            value={quest.completed ? 100 : (quest as AnyQuest & { progress: number }).progress}
            height="h-1.5"
          />
        </div>
      )}

      {/* Daily status chip */}
      {isDaily && (
        <div className="flex items-center justify-end">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 font-orbitron text-[7px] sm:text-[8px] font-bold tracking-widest uppercase [clip-path:polygon(0_2px,2px_0,100%_0,100%_calc(100%-2px),calc(100%-2px)_100%,0_100%)]',
              quest.completed
                ? 'border border-green-500/40 bg-green-500/10 text-green-400'
                : 'border border-neutral-800 bg-black/40 text-neutral-500',
            )}
          >
            <span
              className={cn(
                'h-1 w-1 rounded-full',
                quest.completed ? 'bg-green-500' : 'bg-neutral-600 animate-pulse',
              )}
            />
            {quest.completed ? 'Cleared' : 'Active'}
          </span>
        </div>
      )}
    </div>
  )
}

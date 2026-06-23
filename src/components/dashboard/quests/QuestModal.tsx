'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { CornerAccents } from '../primitives'
import { QuestForm } from './QuestForm'
import type { AnyQuest, QuestDraft } from './types'

interface QuestModalProps {
  open: boolean
  type: 'daily' | 'long-term'
  initial?: AnyQuest
  onSubmit: (draft: QuestDraft) => void
  onClose: () => void
}

/**
 * QuestModal — system-style dialog shell. Renders inside the consumer's
 * AnimatePresence; provides the backdrop blur, clip-path HUD card, scanline,
 * `ARISE // QUEST TERMINAL` header, and Esc-to-close. The form body is
 * <QuestForm/>; submit drafts bubble up to the caller for persistence.
 */
export function QuestModal({ open, type, initial, onSubmit, onClose }: QuestModalProps) {
  const title = initial ? 'Update Quest' : 'Create New Quest'
  const headerTag = type === 'daily' ? 'DAILY PROTOCOL' : 'CAMPAIGN OBJECTIVE'

  // Esc closes the modal; prevent body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ──────────────────────────────────────────────────── */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />

          {/* ── Modal card ────────────────────────────────────────────────── */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4">
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="hud-scanline relative w-full max-w-[460px] border border-cyan-500/25 bg-neutral-950/95 p-4 shadow-[0_0_40px_-10px_rgba(0,212,255,0.4)] backdrop-blur-xl sm:p-6 sm:max-h-[92vh] sm:overflow-y-auto"
              style={{
                clipPath:
                  'polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <CornerAccents length="w-5 h-5" />

              {/* ── Header ─────────────────────────────────────────────────── */}
              <div className="relative mb-4 sm:mb-5 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse inline-block" />
                    <span className="font-orbitron text-[8px] sm:text-[9px] tracking-[0.3em] text-cyan-400/80 font-semibold uppercase">
                      {headerTag}
                    </span>
                  </div>
                  <h2 className="font-orbitron text-base sm:text-lg font-bold tracking-wider text-white uppercase">
                    {title}
                  </h2>
                  <p className="font-mono text-[7px] sm:text-[8px] tracking-wider text-neutral-700">
                    ARISE.SYS // QUEST_TERMINAL
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="group flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center border border-neutral-800 bg-black/40 text-neutral-400 transition-colors hover:border-red-500/50 hover:text-red-400 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              {/* ── Form body ─────────────────────────────────────────────── */}
              <QuestForm
                type={type}
                initial={initial}
                onSubmit={onSubmit}
                onCancel={onClose}
              />
            </motion.section>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

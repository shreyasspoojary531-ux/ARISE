'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { STORAGE_KEYS } from './constants'
import type { AnyQuest, DailyQuest, LongTermQuest, QuestDraft } from './types'

/**
 * useQuests — client-side persistence layer for the Quests page.
 *
 * Quests are stored per-browser in localStorage (namespaced `arise.quests.*`).
 * State is seeded empty and hydrated inside `useEffect` so the server-rendered
 * markup matches the first client render (no hydration mismatch — CLAUDE.md §6.3).
 * All storage access is wrapped in try/catch so private-mode / quota failures
 * degrade gracefully to an in-memory session.
 *
 * Returns one CRUD API per quest type. Long-term quest `progress` is recomputed
 * on every load against the current date so the progress bar stays accurate.
 */

function loadQuests<T extends AnyQuest>(key: string, type: T['type']): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw) as T[]
    // Re-derive long-term progress so the bar reflects "today".
    if (type === 'long-term') {
      return (parsed as LongTermQuest[]).map((q) => ({
        ...q,
        progress: computeProgress(q.startDate, q.endDate),
      })) as T[]
    }
    return parsed
  } catch {
    return []
  }
}

function persist<T extends AnyQuest>(key: string, quests: T[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(quests))
  } catch {
    // Quota / private-mode — silently keep in-memory state for this session.
  }
}

/** Fraction (0–100) of the date span elapsed as of today. Clamped to [0,100]. */
export function computeProgress(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = Date.now()
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0
  const clamped = Math.max(start, Math.min(now, end))
  return Math.round(((clamped - start) / (end - start)) * 100)
}

function makeId(): string {
  return `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function useQuests() {
  const [daily, setDaily] = useState<DailyQuest[]>([])
  const [longTerm, setLongTerm] = useState<LongTermQuest[]>([])
  // Hydrated flag lets the UI distinguish "still loading" from "truly empty".
  const [hydrated, setHydrated] = useState(false)

  // Track which storage keys are active so persist runs only after hydration,
  // never overwriting saved data with the initial [] on first effect run.
  const ready = useRef(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- One-shot hydration from localStorage; must run after mount to stay SSR-safe (same pattern as SystemNav/MobileNav)
    setDaily(loadQuests<DailyQuest>(STORAGE_KEYS.daily, 'daily'))
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    setLongTerm(loadQuests<LongTermQuest>(STORAGE_KEYS.longTerm, 'long-term'))
    ready.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    setHydrated(true)
  }, [])

  // Persist whenever quests change — but only after the initial hydration.
  useEffect(() => {
    if (ready.current) persist(STORAGE_KEYS.daily, daily)
  }, [daily])

  useEffect(() => {
    if (ready.current) persist(STORAGE_KEYS.longTerm, longTerm)
  }, [longTerm])

  const addQuest = useCallback(
    (draft: QuestDraft) => {
      const base = {
        id: makeId(),
        name: draft.name.trim(),
        category: draft.category,
        completed: false,
        createdAt: Date.now(),
      }

      if (draft.type === 'daily') {
        const quest: DailyQuest = {
          ...base,
          type: 'daily',
          startTime: draft.startTime,
          endTime: draft.endTime,
        }
        setDaily((prev) => [...prev, quest])
      } else {
        const quest: LongTermQuest = {
          ...base,
          type: 'long-term',
          startDate: draft.startDate,
          endDate: draft.endDate,
          progress: computeProgress(draft.startDate, draft.endDate),
        }
        setLongTerm((prev) => [...prev, quest])
      }
    },
    [],
  )

  const updateQuest = useCallback((id: string, draft: QuestDraft) => {
    if (draft.type === 'daily') {
      setDaily((prev) =>
        prev.map((q) =>
          q.id === id
            ? {
                ...q,
                name: draft.name.trim(),
                category: draft.category,
                startTime: draft.startTime,
                endTime: draft.endTime,
              }
            : q,
        ),
      )
    } else {
      setLongTerm((prev) =>
        prev.map((q) =>
          q.id === id
            ? {
                ...q,
                name: draft.name.trim(),
                category: draft.category,
                startDate: draft.startDate,
                endDate: draft.endDate,
                progress: computeProgress(draft.startDate, draft.endDate),
              }
            : q,
        ),
      )
    }
  }, [])

  const deleteQuest = useCallback(
    (id: string, type: 'daily' | 'long-term') => {
      if (type === 'daily') setDaily((prev) => prev.filter((q) => q.id !== id))
      else setLongTerm((prev) => prev.filter((q) => q.id !== id))
    },
    [],
  )

  const toggleComplete = useCallback(
    (id: string, type: 'daily' | 'long-term') => {
      if (type === 'daily') {
        setDaily((prev) => prev.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q)))
      } else {
        setLongTerm((prev) =>
          prev.map((q) =>
            q.id === id
              ? { ...q, completed: !q.completed, progress: !q.completed ? 100 : q.progress }
              : q,
          ),
        )
      }
    },
    [],
  )

  return {
    daily,
    longTerm,
    hydrated,
    addQuest,
    updateQuest,
    deleteQuest,
    toggleComplete,
  }
}

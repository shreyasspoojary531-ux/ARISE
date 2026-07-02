import {
  Dumbbell,
  BookOpen,
  Code2,
  GraduationCap,
  Library,
  Flower2,
  Briefcase,
  Sprout,
} from 'lucide-react'
import type { CategoryMeta, QuestCategory, QuestType } from './types'

/**
 * Static quest configuration — category metadata, storage keys, and section
 * labels. Hoisted at module scope so SSR and client render identically
 * (no per-render allocation → no hydration mismatch, per CLAUDE.md §6.3).
 */

export const QUEST_CATEGORIES: CategoryMeta[] = [
  { label: 'Fitness', icon: Dumbbell },
  { label: 'Study', icon: BookOpen },
  { label: 'Programming', icon: Code2 },
  { label: 'School', icon: GraduationCap },
  { label: 'Reading', icon: Library },
  { label: 'Meditation', icon: Flower2 },
  { label: 'Career', icon: Briefcase },
  { label: 'Personal Growth', icon: Sprout },
]

/** Fast lookup: category label → icon. */
export const CATEGORY_ICON: Record<QuestCategory, CategoryMeta['icon']> =
  Object.fromEntries(QUEST_CATEGORIES.map((c) => [c.label, c.icon])) as Record<
    QuestCategory,
    CategoryMeta['icon']
  >

/** localStorage keys — namespaced under "arise.*". */
export const STORAGE_KEYS = {
  daily: 'arise.quests.daily',
  longTerm: 'arise.quests.long-term',
} as const

export const SECTION_META: Record<
  QuestType,
  { title: string; subtitle: string; storageKey: string }
> = {
  daily: {
    title: 'DAILY QUESTS',
    subtitle: 'Recurring routines and daily activities.',
    storageKey: STORAGE_KEYS.daily,
  },
  'long-term': {
    title: 'LONG-TERM QUESTS',
    subtitle: 'Larger goals that take days, weeks, or months.',
    storageKey: STORAGE_KEYS.longTerm,
  },
}

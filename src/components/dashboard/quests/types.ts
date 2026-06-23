import type { LucideIcon } from 'lucide-react'

/**
 * Quests domain types.
 *
 * The quest model is intentionally extensible: optional fields (xp, difficulty,
 * streak, aiGenerated) are reserved so future features — XP rewards, quest
 * difficulty, streaks, AI-generated quests, achievement unlocks — can be added
 * without migrating stored data. Only the core fields are populated today.
 */

export type QuestCategory =
  | 'Fitness'
  | 'Study'
  | 'Programming'
  | 'School'
  | 'Reading'
  | 'Meditation'
  | 'Career'
  | 'Personal Growth'

export type QuestType = 'daily' | 'long-term'

/** Reserved for the future "quest difficulty" feature (Solo Leveling ranks). */
export type QuestDifficulty = 'E' | 'D' | 'C' | 'B' | 'A' | 'S'

export interface CategoryMeta {
  label: QuestCategory
  icon: LucideIcon
}

interface BaseQuest {
  id: string
  name: string
  category: QuestCategory
  completed: boolean
  createdAt: number

  // ── Reserved fields (unused now, ready for future features) ──
  xp?: number
  difficulty?: QuestDifficulty
  streak?: number
  aiGenerated?: boolean
}

export interface DailyQuest extends BaseQuest {
  type: 'daily'
  /** 24h "HH:MM" — stored internally, displayed as "06:00 AM". */
  startTime: string
  endTime: string
}

export interface LongTermQuest extends BaseQuest {
  type: 'long-term'
  /** ISO yyyy-mm-dd. */
  startDate: string
  endDate: string
  /** 0–100. Auto-derived from the date span when rendered. */
  progress: number
}

export type AnyQuest = DailyQuest | LongTermQuest

/** Shape of the modal when editing an existing quest (omit type/id). */
export type QuestDraft =
  | {
      type: 'daily'
      name: string
      category: QuestCategory
      startTime: string
      endTime: string
    }
  | {
      type: 'long-term'
      name: string
      category: QuestCategory
      startDate: string
      endDate: string
    }

import type { LucideIcon } from 'lucide-react'
import {
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Brain,
  Lightbulb,
  Target,
  Repeat,
  Flame,
  NotebookText,
  NotebookPen,
  Library,
  GraduationCap,
  Database,
  FileBadge,
  FileText,
  Trophy,
  ListChecks,
  Focus,
  Hourglass,
  Droplets,
  Moon,
  Activity,
  Drumstick,
  Flower2,
  BookOpen,
  Puzzle,
  TreePine,
  Crosshair,
  Clock,
  Wind,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

/**
 * Mock data for the ARISE STATUS screen.
 * Hoisted module-level consts so SSR and client render produce identical
 * output (no per-render allocation, no hydration mismatch).
 *
 * All values represent a brand-new E-Rank hunter beginning their journey.
 * RPG metrics are illustrative only — there is no backend integration.
 */

export interface PlayerStatus {
  level: number
  xpCurrent: number
  xpMax: number
  rank: string
  title: string
  job: string
}

export const PLAYER_STATUS: PlayerStatus = {
  level: 1,
  xpCurrent: 0,
  xpMax: 100,
  rank: 'E',
  title: 'THE NOVICE',
  job: 'THE AWAKENER',
}

export interface Attribute {
  name: string
  value: number
  max: number
  bonus: number
  icon: LucideIcon
}

export const ATTRIBUTES: Attribute[] = [
  { name: 'STRENGTH',     value: 10, max: 100, bonus: 0, icon: Dumbbell },
  { name: 'ENDURANCE',    value: 10, max: 100, bonus: 0, icon: HeartPulse },
  { name: 'DISCIPLINE',   value: 10, max: 100, bonus: 0, icon: ShieldCheck },
  { name: 'INTELLIGENCE', value: 10, max: 100, bonus: 0, icon: Brain },
  { name: 'CREATIVITY',   value: 10, max: 100, bonus: 0, icon: Lightbulb },
  { name: 'FOCUS',        value: 10, max: 100, bonus: 0, icon: Target },
  { name: 'CONSISTENCY', value: 10, max: 100, bonus: 0, icon: Repeat },
  { name: 'CONFIDENCE',   value: 10, max: 100, bonus: 0, icon: Flame },
]

export const AVAILABLE_STAT_POINTS = 0

export interface InventoryItem {
  label: string
  icon: LucideIcon
  count: number
}

export const INVENTORY: InventoryItem[] = [
  { label: 'NOTES',          icon: NotebookText,   count: 0 },
  { label: 'JOURNAL',        icon: NotebookPen,    count: 0 },
  { label: 'GOALS',          icon: Target,         count: 0 },
  { label: 'HABIT TRACKER',  icon: ListChecks,     count: 0 },
  { label: 'BOOKS',          icon: BookOpen,       count: 0 },
  { label: 'COURSES',        icon: GraduationCap,  count: 0 },
  { label: 'RESOURCES',      icon: Database,       count: 0 },
  { label: 'CERTIFICATIONS', icon: FileBadge,      count: 0 },
  { label: 'DOCUMENTS',      icon: FileText,       count: 0 },
  { label: 'ACHIEVEMENTS',   icon: Trophy,         count: 0 },
]

export interface LifeStat {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
  progress: number
}

export const LIFE_PERFORMANCE: LifeStat[] = [
  { label: 'HABIT COMPLETION', value: '0', unit: '%',  icon: ListChecks, progress: 0 },
  { label: 'DAILY CONSISTENCY', value: '0', unit: '%', icon: Repeat,     progress: 0 },
  { label: 'WEEKLY XP',        value: '0', icon: Sparkles,  progress: 0 },
  { label: 'FOCUS SCORE',      value: '0', unit: '/10', icon: Focus,    progress: 0 },
  { label: 'DEEP WORK HRS',    value: '0', unit: 'H', icon: Hourglass, progress: 0 },
  { label: 'GOAL COMPLETION',  value: '0',  unit: '%',  icon: TrendingUp, progress: 0 },
]

export interface FitnessStat {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
}

export const PHYSICAL_FITNESS: FitnessStat[] = [
  { label: 'WORKOUT STREAK',   value: '0',  unit: 'DAYS', icon: Flame },
  { label: 'WEEKLY WORKOUTS',  value: '0',  unit: '/7',   icon: Dumbbell },
  { label: 'CALORIES BURNED',  value: '0',  unit: 'KCAL', icon: Activity },
  { label: 'PROTEIN INTAKE',   value: '0',  unit: 'G',    icon: Drumstick },
  { label: 'WATER INTAKE',     value: '0',  unit: 'L',    icon: Droplets },
  { label: 'SLEEP SCORE',      value: '0',  unit: '/100', icon: Moon },
]

export interface Quest {
  name: string
  progress: number
  xp: number
  icon: LucideIcon
}

/** No active quests — a new hunter starts empty. */
export const ACTIVE_QUESTS: Quest[] = []

export interface SkillCard {
  name: string
  level: number
  progress: number
  icon: LucideIcon
}

export const SKILLS: SkillCard[] = [
  { name: 'DEEP FOCUS',            level: 0, progress: 0,  icon: Focus },
  { name: 'DISCIPLINE MASTERY',    level: 0, progress: 0,  icon: ShieldCheck },
  { name: 'LEARNING SPEED',        level: 0, progress: 0,  icon: Brain },
  { name: 'CONSISTENCY ENGINE',    level: 0, progress: 0,  icon: Repeat },
  { name: 'PHYSICAL CONDITIONING', level: 0, progress: 0,  icon: HeartPulse },
]

export interface MentalDiscipline {
  label: string
  icon: LucideIcon
  level: number
}

export const MENTAL_DISCIPLINES: MentalDiscipline[] = [
  { label: 'LEARNING',       icon: BookOpen, level: 0 },
  { label: 'MEDITATION',     icon: Flower2,  level: 0 },
  { label: 'CREATIVITY',     icon: Lightbulb, level: 0 },
  { label: 'PROBLEM SOLVING', icon: Crosshair, level: 0 },
]

export const KNOWLEDGE_TREE_LEVEL = 0
export const KNOWLEDGE_TREE_MAX = 100
export const MENTAL_FORTITUDE_SCORE = 0

// Pre-computed floating particles for the dashboard background.
// Deterministic values — never randomize at render time.
export const DASHBOARD_PARTICLES = [
  { id: 0, x: 8,  duration: 16, delay: 0,    size: 1.5 },
  { id: 1, x: 22, duration: 19, delay: 4,    size: 1 },
  { id: 2, x: 37, duration: 14, delay: 2,    size: 1.5 },
  { id: 3, x: 51, duration: 22, delay: 7,    size: 1 },
  { id: 4, x: 66, duration: 17, delay: 1,    size: 1.5 },
  { id: 5, x: 79, duration: 20, delay: 5,    size: 1 },
  { id: 6, x: 91, duration: 15, delay: 9,    size: 1.5 },
  { id: 7, x: 15, duration: 21, delay: 3,    size: 1 },
  { id: 8, x: 44, duration: 18, delay: 8,    size: 1 },
  { id: 9, x: 73, duration: 23, delay: 6,    size: 1.5 },
] as const

export const NAV_TABS = ['STATUS', 'SKILLS', 'INVENTORY', 'QUESTS'] as const
export type NavTab = (typeof NAV_TABS)[number]

// Re-export a few icons used directly by the nav/frame so components don't
// need to import from lucide-react separately for these.
export { Wind, Clock, TreePine, Activity, Brain, HeartPulse, Target, Trophy, Sparkles }

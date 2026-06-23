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
  level: 24,
  xpCurrent: 7340,
  xpMax: 10000,
  rank: 'C',
  title: 'THE AWAKENED',
  job: 'THE ASCENDANT',
}

export interface Attribute {
  name: string
  value: number
  max: number
  bonus: number
  icon: LucideIcon
}

export const ATTRIBUTES: Attribute[] = [
  { name: 'STRENGTH',     value: 87, max: 100, bonus: 4, icon: Dumbbell },
  { name: 'ENDURANCE',    value: 74, max: 100, bonus: 2, icon: HeartPulse },
  { name: 'DISCIPLINE',   value: 92, max: 100, bonus: 6, icon: ShieldCheck },
  { name: 'INTELLIGENCE', value: 81, max: 100, bonus: 3, icon: Brain },
  { name: 'CREATIVITY',   value: 68, max: 100, bonus: 1, icon: Lightbulb },
  { name: 'FOCUS',        value: 79, max: 100, bonus: 5, icon: Target },
  { name: 'CONSISTENCY',  value: 95, max: 100, bonus: 8, icon: Repeat },
  { name: 'CONFIDENCE',   value: 72, max: 100, bonus: 2, icon: Flame },
]

export const AVAILABLE_STAT_POINTS = 12

export interface InventoryItem {
  label: string
  icon: LucideIcon
  count: number
}

export const INVENTORY: InventoryItem[] = [
  { label: 'NOTES',          icon: NotebookText,   count: 142 },
  { label: 'JOURNAL',        icon: NotebookPen,    count: 87 },
  { label: 'GOALS',          icon: Target,         count: 12 },
  { label: 'HABIT TRACKER',  icon: ListChecks,     count: 30 },
  { label: 'BOOKS',          icon: BookOpen,       count: 24 },
  { label: 'COURSES',        icon: GraduationCap,  count: 7 },
  { label: 'RESOURCES',      icon: Database,       count: 54 },
  { label: 'CERTIFICATIONS', icon: FileBadge,      count: 5 },
  { label: 'DOCUMENTS',      icon: FileText,       count: 38 },
  { label: 'ACHIEVEMENTS',   icon: Trophy,         count: 19 },
]

export interface LifeStat {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
  progress: number
}

export const LIFE_PERFORMANCE: LifeStat[] = [
  { label: 'HABIT COMPLETION', value: '87', unit: '%',  icon: ListChecks, progress: 87 },
  { label: 'DAILY CONSISTENCY', value: '94', unit: '%', icon: Repeat,     progress: 94 },
  { label: 'WEEKLY XP',        value: '2840', icon: Sparkles,  progress: 71 },
  { label: 'FOCUS SCORE',      value: '8.4', unit: '/10', icon: Focus,    progress: 84 },
  { label: 'DEEP WORK HRS',    value: '32.5', unit: 'H', icon: Hourglass, progress: 65 },
  { label: 'GOAL COMPLETION',  value: '76',  unit: '%',  icon: TrendingUp, progress: 76 },
]

export interface FitnessStat {
  label: string
  value: string
  unit?: string
  icon: LucideIcon
}

export const PHYSICAL_FITNESS: FitnessStat[] = [
  { label: 'WORKOUT STREAK',   value: '48',  unit: 'DAYS', icon: Flame },
  { label: 'WEEKLY WORKOUTS',  value: '6',   unit: '/7',   icon: Dumbbell },
  { label: 'CALORIES BURNED',  value: '4280', unit: 'KCAL', icon: Activity },
  { label: 'PROTEIN INTAKE',   value: '162', unit: 'G',    icon: Drumstick },
  { label: 'WATER INTAKE',     value: '3.2', unit: 'L',    icon: Droplets },
  { label: 'SLEEP SCORE',      value: '88',  unit: '/100', icon: Moon },
]

export interface Quest {
  name: string
  progress: number
  xp: number
  icon: LucideIcon
}

export const ACTIVE_QUESTS: Quest[] = [
  { name: 'MORNING WORKOUT',    progress: 100, xp: 150, icon: Dumbbell },
  { name: 'READ 20 PAGES',      progress: 65,  xp: 80,  icon: BookOpen },
  { name: 'DEEP WORK SESSION',  progress: 40,  xp: 200, icon: Focus },
  { name: 'MEDITATION',         progress: 0,   xp: 60,  icon: Flower2 },
  { name: 'SKILL PRACTICE',     progress: 25,  xp: 120, icon: Puzzle },
]

export interface SkillCard {
  name: string
  level: number
  progress: number
  icon: LucideIcon
}

export const SKILLS: SkillCard[] = [
  { name: 'DEEP FOCUS',            level: 7,  progress: 82, icon: Focus },
  { name: 'DISCIPLINE MASTERY',    level: 9,  progress: 64, icon: ShieldCheck },
  { name: 'LEARNING SPEED',        level: 6,  progress: 71, icon: Brain },
  { name: 'CONSISTENCY ENGINE',    level: 8,  progress: 90, icon: Repeat },
  { name: 'PHYSICAL CONDITIONING', level: 7,  progress: 58, icon: HeartPulse },
]

export interface MentalDiscipline {
  label: string
  icon: LucideIcon
  level: number
}

export const MENTAL_DISCIPLINES: MentalDiscipline[] = [
  { label: 'LEARNING',       icon: BookOpen, level: 72 },
  { label: 'MEDITATION',     icon: Flower2,  level: 58 },
  { label: 'CREATIVITY',     icon: Lightbulb, level: 64 },
  { label: 'PROBLEM SOLVING', icon: Crosshair, level: 81 },
]

export const KNOWLEDGE_TREE_LEVEL = 67
export const KNOWLEDGE_TREE_MAX = 100
export const MENTAL_FORTITUDE_SCORE = 8742

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

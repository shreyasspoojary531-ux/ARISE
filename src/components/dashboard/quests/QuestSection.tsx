'use client'

import { Plus } from 'lucide-react'
import { HudPanel, PanelHeader, SectionLabel } from '../primitives'
import { QuestCard } from './QuestCard'
import { QuestEmptyState } from './QuestEmptyState'
import { SECTION_META } from './constants'
import type { AnyQuest } from './types'

interface QuestSectionProps {
  type: 'daily' | 'long-term'
  quests: AnyQuest[]
  /** True until localStorage has hydrated — lets us avoid a flash of empty state. */
  hydrated: boolean
  onCreate: () => void
  onEdit: (quest: AnyQuest) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * QuestSection — the reusable panel for one quest type. Renders the section
 * header (title + count badge), a "Create New Quest" button, and either the
 * empty state or a responsive 1/2-column grid of quest cards.
 */
export function QuestSection({
  type,
  quests,
  hydrated,
  onCreate,
  onEdit,
  onToggle,
  onDelete,
}: QuestSectionProps) {
  const meta = SECTION_META[type]
  const isEmpty = quests.length === 0
  const completed = quests.filter((q) => q.completed).length

  return (
    <HudPanel
      scanline
      glow
      header={
        <div className="flex flex-col gap-0.5">
          <PanelHeader right={<SectionLabel>{meta.rightHeaderLabel}</SectionLabel>}>
            {meta.title}
          </PanelHeader>
          <span className="-mt-3 font-sans text-[11px] sm:text-xs text-neutral-500">{meta.subtitle}</span>
        </div>
      }
      rightHeader={
        !isEmpty ? (
          <div className="flex flex-col items-end gap-0.5">
            <span className="font-orbitron text-[9px] sm:text-[10px] font-bold text-cyan-400">
              {completed} / {quests.length}
            </span>
            <span className="font-mono text-[7px] tracking-wider text-neutral-700">
              CLEARED
            </span>
          </div>
        ) : undefined
      }
    >
      {/* Create New Quest — full-width on mobile, anchored top-right on desktop */}
      <div className="mb-3 sm:mb-4 flex justify-end">
        <button
          type="button"
          onClick={onCreate}
          className="group relative inline-flex w-full items-center justify-center gap-2 px-3 py-2.5 sm:w-auto sm:px-4 font-orbitron text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-cyan-400 transition-all duration-200 hover:text-cyan-300 cursor-pointer [clip-path:polygon(0_5px,5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%)] before:absolute before:inset-0 before:-z-10 before:[clip-path:polygon(0_5px,5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%)] before:bg-cyan-500/20 hover:before:bg-cyan-500/30 before:transition-colors after:absolute after:inset-[1px] after:-z-10 after:[clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)] after:bg-black/60 after:transition-colors hover:shadow-[0_0_18px_-6px_rgba(0,212,255,0.7)]"
        >
          <Plus className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-90" />
          Create New Quest
        </button>
      </div>

      {/* Grid or empty state. While hydrating, render nothing to avoid the
          empty-state flash before localStorage resolves. */}
      {!hydrated ? (
        <div className="py-10" />
      ) : isEmpty ? (
        <QuestEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {quests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </HudPanel>
  )
}

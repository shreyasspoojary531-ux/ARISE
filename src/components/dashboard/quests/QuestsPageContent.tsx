'use client'

import { useState } from 'react'
import { QuestSection } from './QuestSection'
import { QuestModal } from './QuestModal'
import { useQuests } from './useQuests'
import type { AnyQuest, QuestDraft } from './types'

/** Discriminated modal state: closed, creating, or editing. */
type ModalState =
  | { open: false }
  | { open: true; mode: 'create'; type: 'daily' | 'long-term' }
  | { open: true; mode: 'edit'; type: 'daily' | 'long-term'; quest: AnyQuest }

/**
 * QuestsPageContent — the QUESTS tab. Owns the localStorage-backed quest store
 * (via useQuests) and the single modal's open/create/edit state. Lays out two
 * stacked <QuestSection> panels (Daily, Long-Term) inside the same scrolling
 * container convention used by Skills/Inventory, plus a thin HUD footer.
 */
export function QuestsPageContent() {
  const { daily, longTerm, hydrated, addQuest, updateQuest, deleteQuest, toggleComplete } =
    useQuests()
  const [modal, setModal] = useState<ModalState>({ open: false })

  const openCreate = (type: 'daily' | 'long-term') =>
    setModal({ open: true, mode: 'create', type })

  const openEdit = (quest: AnyQuest) =>
    setModal({ open: true, mode: 'edit', type: quest.type, quest })

  const handleSubmit = (draft: QuestDraft) => {
    if (modal.open && modal.mode === 'edit') {
      updateQuest(modal.quest.id, draft)
    } else {
      addQuest(draft)
    }
    setModal({ open: false })
  }

  return (
    <div className="scrollbar-hidden mx-auto flex w-full max-w-[1100px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:h-full lg:overflow-y-auto">
      {/* Daily Quests */}
      <div className="animate-panel-rise">
        <QuestSection
          type="daily"
          quests={daily}
          hydrated={hydrated}
          onCreate={() => openCreate('daily')}
          onEdit={openEdit}
          onToggle={(id) => toggleComplete(id, 'daily')}
          onDelete={(id) => deleteQuest(id, 'daily')}
        />
      </div>

      {/* Long-Term Quests */}
      <div className="animate-panel-rise" style={{ animationDelay: '80ms' }}>
        <QuestSection
          type="long-term"
          quests={longTerm}
          hydrated={hydrated}
          onCreate={() => openCreate('long-term')}
          onEdit={openEdit}
          onToggle={(id) => toggleComplete(id, 'long-term')}
          onDelete={(id) => deleteQuest(id, 'long-term')}
        />
      </div>

      {/* HUD footer — matches the StatusDashboard footer convention */}
      <footer className="flex flex-shrink-0 items-center justify-between border-t border-neutral-900 pt-2">
        <span className="font-mono text-[8px] tracking-wider text-neutral-800">
          ARISE.SYS // QUEST_MODULE
        </span>
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
          <span className="font-orbitron text-[9px] tracking-[0.3em] text-green-500 uppercase">
            System Online
          </span>
        </div>
        <span className="font-mono text-[8px] tracking-wider text-neutral-800">
          VER 1.0.0 // STABLE
        </span>
      </footer>

      {/* Modal — create or edit */}
      <QuestModal
        open={modal.open}
        type={modal.open ? modal.type : 'daily'}
        initial={modal.open && modal.mode === 'edit' ? modal.quest : undefined}
        onSubmit={handleSubmit}
        onClose={() => setModal({ open: false })}
      />
    </div>
  )
}

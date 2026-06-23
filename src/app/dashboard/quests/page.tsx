import { QuestsPageContent } from '@/components/dashboard/quests/QuestsPageContent'

export const metadata = {
  title: 'Quests // ARISE',
  description: 'Your daily routines and long-term campaigns.',
}

/**
 * QUESTS tab — `/dashboard/quests`.
 * Auth + onboarding gate is handled by the parent layout.tsx (DashboardShell).
 * Renders the interactive QuestsPageContent (client component, localStorage-backed).
 */
export default function QuestsPage() {
  return <QuestsPageContent />
}

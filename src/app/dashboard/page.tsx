import { StatusDashboard } from '@/components/dashboard/StatusDashboard'

export const metadata = {
  title: 'Dashboard // ARISE',
  description: 'Your hunter dashboard.',
}

/**
 * Dashboard STATUS screen — the default /dashboard view.
 * Auth + onboarding gate is handled by the parent layout.tsx.
 * This page just renders the three-column status composition.
 */
export default function DashboardStatusPage() {
  return <StatusDashboard />
}

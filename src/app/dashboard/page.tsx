import { StatusDashboard } from '@/components/dashboard/StatusDashboard'
import { MobileStatusDashboard } from '@/components/dashboard/MobileStatusDashboard'

export const metadata = {
  title: 'Dashboard // ARISE',
  description: 'Your hunter dashboard.',
}

/**
 * Dashboard STATUS screen — the default /dashboard view.
 * Auth + onboarding gate is handled by the parent layout.tsx.
 *
 * Desktop renders the three-column StatusDashboard; mobile renders a
 * dedicated stacked MobileStatusDashboard. Mutually exclusive by breakpoint
 * — desktop's render path is the original StatusDashboard, unchanged.
 */
export default function DashboardStatusPage() {
  return (
    <>
      <div className="hidden lg:block">
        <StatusDashboard />
      </div>
      <div className="lg:hidden">
        <MobileStatusDashboard />
      </div>
    </>
  )
}

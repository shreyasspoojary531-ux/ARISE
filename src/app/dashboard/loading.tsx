import { DashboardBackground } from '@/components/dashboard/DashboardBackground'

/**
 * Dashboard route loading state.
 * Renders instantly while the auth + onboarding gate in layout.tsx resolves,
 * so a slow Supabase response streams a HUD skeleton instead of a blank page.
 * Server Component — zero client JS.
 */
export default function DashboardLoading() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <DashboardBackground />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] flex-col px-4 sm:px-6">
        {/* Skeleton nav rail (matches SystemNav height) */}
        <div className="h-[60px] flex-shrink-0" />

        {/* Skeleton three-column grid */}
        <div className="grid h-full min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="hidden flex-col gap-3 lg:col-span-3 lg:flex">
            <PanelSkeleton className="h-[180px]" />
            <PanelSkeleton className="flex-1" />
            <PanelSkeleton className="h-[100px]" />
          </div>
          <div className="flex min-h-0 flex-col gap-3 lg:col-span-6">
            <PanelSkeleton className="flex-1" />
            <PanelSkeleton className="h-[200px]" />
          </div>
          <div className="hidden flex-col gap-3 lg:col-span-3 lg:flex">
            <PanelSkeleton className="flex-1" />
            <PanelSkeleton className="h-[200px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** A single HUD-shaped skeleton block with a low-amplitude shimmer. */
function PanelSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden border border-neutral-800/70 bg-neutral-950/50 ${className}`}
      style={{
        clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
      }}
      aria-hidden
    >
      {/* Shimmer sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/[0.04] to-transparent skeleton-shimmer" />
    </div>
  )
}

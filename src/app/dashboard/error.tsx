'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/**
 * Dashboard route error boundary.
 * Catches any thrown error from the layout's auth/onboarding gate or from a
 * sub-page's Server Components (e.g. Supabase timeout / network failure), and
 * surfaces a HUD-styled recovery screen instead of a raw 500 page.
 *
 * Must be a Client Component (Next.js requirement for error.tsx).
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Console-only logging — no external telemetry by default.
    console.error('[dashboard] route error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-6">
      <div
        className="relative w-full max-w-[440px] border border-red-500/30 bg-neutral-950/60 p-8 text-center backdrop-blur-md"
        style={{ clipPath: 'polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
      >
        {/* HUD header */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          <span className="font-orbitron text-[10px] font-bold tracking-[0.3em] text-red-400">
            SYSTEM ERROR
          </span>
        </div>

        <h1 className="font-orbitron text-2xl font-black tracking-wider text-white">
          SIGNAL LOST
        </h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-neutral-400">
          The system failed to establish a stable connection. Your data is safe —
          this is a temporary disruption.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-[9px] tracking-wider text-neutral-700">
            ERR.CODE // {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="border border-cyan-500/40 bg-cyan-500/10 px-5 py-2 font-orbitron text-[10px] font-bold tracking-[0.2em] text-cyan-300 transition-colors hover:bg-cyan-500/20 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
          >
            RETRY
          </button>
          <Link
            href="/login"
            className="border border-neutral-800 px-5 py-2 font-orbitron text-[10px] font-bold tracking-[0.2em] text-neutral-400 transition-colors hover:border-neutral-700 hover:text-neutral-200 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
          >
            RE-LOGIN
          </Link>
        </div>
      </div>
    </div>
  )
}

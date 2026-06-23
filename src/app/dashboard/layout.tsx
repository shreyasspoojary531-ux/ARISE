import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getOnboardingState, isOnboardingComplete } from '@/lib/onboarding'
import { logout } from '@/app/auth/actions'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

// ── Route segment config ──────────────────────────────────────────────────
// This route is 100% per-user (auth session + onboarding profile). It must
// NEVER be statically rendered or cached at the CDN/build level — doing so
// would leak one user's identity into another's response. `force-dynamic`
// makes that contract explicit and keeps Next.js from attempting ISR/SSG.
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Dashboard layout — runs auth + onboarding gate once,
 * then wraps all dashboard sub-pages (STATUS, SKILLS, INVENTORY)
 * in the shared DashboardShell (nav, background, context).
 *
 * Auth + onboarding state are fetched in parallel (Promise.all), and
 * getOnboardingState itself parallelizes its two profile queries — so the
 * total wall-time is ~2 DB round-trips, all concurrent. React's cache() in
 * server.ts dedupes the Supabase client within this request.
 *
 * This avoids repeating the auth fetch in every sub-page.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const [authResult, onboardingState] = await Promise.all([
    supabase.auth.getUser(),
    getOnboardingState(supabase),
  ])

  const { user } = authResult.data

  if (!user) {
    redirect('/login')
  }

  if (!isOnboardingComplete(onboardingState)) {
    redirect('/onboarding')
  }

  // ── Derived identity data ────────────────────────────────────────────
  const displayName =
    user.user_metadata?.display_name ??
    user.user_metadata?.full_name ??
    user.email?.split('@')[0] ??
    'Hunter'

  const profile = onboardingState.profile
  const playerName = profile?.name ?? displayName
  const avatarUrl = (user.user_metadata?.avatar_url as string | undefined) ?? null
  const playerAge = profile?.age ? String(profile.age) : '—'

  return (
    <DashboardShell
      playerName={playerName}
      avatarUrl={avatarUrl}
      age={playerAge}
      level={1}
      rank="E"
      logoutAction={logout}
    >
      {children}
    </DashboardShell>
  )
}

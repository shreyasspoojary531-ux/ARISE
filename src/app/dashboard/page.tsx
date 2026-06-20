import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getOnboardingState, isOnboardingComplete } from '@/lib/onboarding'
import { logout } from '@/app/auth/actions'

export const metadata: Metadata = {
  title: 'Dashboard // ARISE',
  description: 'Your hunter dashboard.',
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Gate: redirect to onboarding if not complete
  const onboardingState = await getOnboardingState(supabase)
  if (!isOnboardingComplete(onboardingState)) {
    redirect('/onboarding')
  }

  // Auth user data
  const displayName =
    user?.user_metadata?.display_name ??
    user?.user_metadata?.full_name ??
    user?.email?.split('@')[0] ??
    'Hunter'

  const email = user?.email ?? ''
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const joinedAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  // Player profile data from onboarding
  const profile = onboardingState.profile
  const playerName = profile?.name ?? displayName
  const playerGoal = profile?.goal ?? '—'
  const playerAge = profile?.age ? String(profile.age) : '—'
  const playerHeight = profile?.height ? `${profile.height} cm` : '—'
  const playerWeight = profile?.weight ? `${profile.weight} kg` : '—'

  const FUTURE_MODULES = [
    { label: 'SKILLS', status: 'IN DEVELOPMENT' },
    { label: 'GYM PROGRESSION', status: 'IN DEVELOPMENT' },
    { label: 'QUESTS', status: 'IN DEVELOPMENT' },
    { label: 'DAILY MISSIONS', status: 'IN DEVELOPMENT' },
    { label: 'STATS', status: 'IN DEVELOPMENT' },
    { label: 'CLAN SYSTEM', status: 'IN DEVELOPMENT' },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-neutral-900 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-orbitron text-xl font-black tracking-widest text-white hover:text-cyan-400 transition-colors">
            A<span className="text-cyan-400">R</span>ISE
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-full border border-neutral-800 object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full border border-neutral-800 bg-neutral-900 flex items-center justify-center">
                  <span className="font-orbitron text-[10px] text-neutral-400 font-bold">
                    {playerName[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <span className="font-sans text-sm text-neutral-300 hidden sm:block">{playerName}</span>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="font-orbitron text-[9px] tracking-widest text-neutral-500 hover:text-red-400 uppercase transition-colors border border-neutral-800 hover:border-red-500/30 px-3 py-1.5 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-8">

        {/* Welcome header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse inline-block" />
            <span className="font-orbitron text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
              Hunter System // Dashboard
            </span>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl font-black tracking-widest text-white uppercase">
            Welcome,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
              {playerName}
            </span>
          </h1>
          <p className="font-sans text-sm text-neutral-500">
            Level 1 Player. The system is ready.
          </p>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'RANK',      value: 'E-RANK',  note: 'Keep grinding' },
            { label: 'STATUS',    value: 'ACTIVE',  note: 'System online' },
            { label: 'JOINED',    value: 'HUNTER',  note: joinedAt       },
          ].map(({ label, value, note }) => (
            <div key={label} className="relative border border-neutral-900 bg-neutral-950/60 backdrop-blur-sm p-5 [clip-path:polygon(0_8px,8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%)]">
              <span className="absolute top-0 left-0 w-3 h-[1px] bg-cyan-500/40" />
              <span className="absolute top-0 left-0 w-[1px] h-3 bg-cyan-500/40" />
              <div className="font-orbitron text-[8px] tracking-widest text-neutral-600 mb-1">{label}</div>
              <div className="font-orbitron text-base font-bold text-cyan-400">{value}</div>
              <div className="font-sans text-[11px] text-neutral-600 mt-0.5">{note}</div>
            </div>
          ))}
        </div>

        {/* Profile panel with onboarding data */}
        <div className="relative border border-neutral-900 bg-neutral-950/40 backdrop-blur-sm p-6 [clip-path:polygon(0_12px,12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%)]">
          <span className="absolute top-0 left-0 w-5 h-[1px] bg-cyan-500/50" />
          <span className="absolute top-0 left-0 w-[1px] h-5 bg-cyan-500/50" />
          <span className="absolute bottom-0 right-0 w-5 h-[1px] bg-cyan-500/50" />
          <span className="absolute bottom-0 right-0 w-[1px] h-5 bg-cyan-500/50" />

          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-1 bg-cyan-500 animate-pulse" />
            <span className="font-orbitron text-[9px] tracking-widest text-neutral-600 uppercase">
              Hunter Profile
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="w-16 h-16 rounded-full border-2 border-neutral-800 object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-neutral-800 bg-neutral-900 flex items-center justify-center">
                <span className="font-orbitron text-xl text-neutral-400 font-bold">
                  {playerName[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="space-y-1">
              <p className="font-orbitron text-base font-bold text-white tracking-widest">{playerName}</p>
              <p className="font-sans text-sm text-neutral-500">{email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
                <span className="font-orbitron text-[9px] tracking-widest text-green-500 uppercase">Profile Active</span>
              </div>
            </div>
          </div>

          {/* Onboarding data grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-neutral-900">
            {[
              { label: 'PRIMARY GOAL', value: playerGoal },
              { label: 'AGE', value: playerAge },
              { label: 'HEIGHT', value: playerHeight },
              { label: 'WEIGHT', value: playerWeight },
            ].map(({ label, value }) => (
              <div key={label} className="border border-neutral-900 bg-black/40 py-3 px-3 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]">
                <div className="font-orbitron text-[8px] tracking-widest text-neutral-700">{label}</div>
                <div className="font-orbitron text-xs font-bold text-cyan-400 mt-0.5">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* System status card */}
        <div className="relative border border-cyan-500/20 bg-neutral-950/60 backdrop-blur-sm p-6 [clip-path:polygon(0_12px,12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%)]">
          <span className="absolute top-0 left-0 w-5 h-[1px] bg-cyan-500/50" />
          <span className="absolute top-0 left-0 w-[1px] h-5 bg-cyan-500/50" />
          <span className="absolute bottom-0 right-0 w-5 h-[1px] bg-cyan-500/50" />
          <span className="absolute bottom-0 right-0 w-[1px] h-5 bg-cyan-500/50" />

          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse" />
            <span className="font-orbitron text-[9px] tracking-widest text-neutral-600 uppercase">
              System Status
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2 border border-green-500/20 bg-green-500/5 px-3 py-2.5 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="font-orbitron text-[9px] tracking-widest text-green-400 uppercase">System Status: Active</span>
            </div>
            <div className="flex items-center gap-2 border border-cyan-500/20 bg-cyan-500/5 px-3 py-2.5 [clip-path:polygon(0_3px,3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%)]">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
              <span className="font-orbitron text-[9px] tracking-widest text-cyan-400 uppercase">Player Init: Complete</span>
            </div>
          </div>

          {/* Future modules */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-1 bg-neutral-600" />
              <span className="font-orbitron text-[9px] tracking-widest text-neutral-600 uppercase">
                Future Modules // Coming Soon
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {FUTURE_MODULES.map((mod) => (
                <div key={mod.label} className="border border-neutral-900 bg-black/40 py-3 px-4 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]">
                  <div className="font-orbitron text-[9px] tracking-widest text-neutral-500 uppercase">{mod.label}</div>
                  <div className="font-orbitron text-[8px] tracking-widest text-neutral-800 mt-0.5">{mod.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

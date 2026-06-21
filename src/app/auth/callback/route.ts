import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Handles the code exchange for password reset (and future OAuth).
// Supabase sends a code in the URL; we exchange it for a session cookie.
// After session creation, we check onboarding state to determine the correct
// redirect target — returning users go straight to /dashboard.

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (errorParam) {
    console.error('[Auth Callback] Provider error:', errorParam, errorDescription)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || errorParam)}`)
  }

  if (!code) {
    console.warn('[Auth Callback] No code parameter')
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('No authentication code provided')}`)
  }

  // Collect all cookies that Supabase sets during the code exchange
  const supabaseCookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = []

  let response = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Capture all Supabase cookies so we can replay them on any response
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseCookies.push({ name, value, options })
          })
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
          response = NextResponse.redirect(`${origin}${next}`, {
            headers: response.headers,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[Auth Callback] Code exchange failed:', error.message)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // After successful code exchange, check onboarding state to determine redirect
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Check onboarding state in parallel
    const [{ data: contract }, { data: profile }] = await Promise.all([
      supabase
        .from('onboarding_contracts')
        .select('accepted')
        .eq('user_id', user.id)
        .maybeSingle(),
      supabase
        .from('player_profiles')
        .select('name, goal, height, weight')
        .eq('user_id', user.id)
        .maybeSingle(),
    ])

    const accepted = Boolean(contract?.accepted)
    const hasNameGoal = Boolean(profile?.name && profile?.goal)
    const hasAllMetrics = Boolean(profile?.name && profile?.goal && profile?.height && profile?.weight)

    let target = '/onboarding/system-acceptance'
    if (accepted && hasAllMetrics) {
      target = '/dashboard'
    } else if (accepted && hasNameGoal) {
      target = '/onboarding/body-metrics'
    } else if (accepted) {
      target = '/onboarding/player-registration'
    }

    // Build a new redirect response with the correct target,
    // replaying all Supabase session cookies onto it
    response = NextResponse.redirect(`${origin}${target}`)
    supabaseCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })
  }

  console.log('[Auth Callback] Session created. Redirecting.')
  return response
}

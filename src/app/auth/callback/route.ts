import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log(`[Auth Callback] Received code: ${code ? 'Yes' : 'No'}, Next target: ${next}`)

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('[Auth Callback] Code exchange failed:', error.message)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
      }
      
      console.log('[Auth Callback] Code exchange successful. Redirecting to:', next)
      return NextResponse.redirect(`${origin}${next}`)
    } catch (err: any) {
      console.error('[Auth Callback] Exception during code exchange:', err)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err.message || String(err))}`)
    }
  }

  console.warn('[Auth Callback] No code provided in query parameters.')
  return NextResponse.redirect(`${origin}/login?error=No+authentication+code+provided`)
}

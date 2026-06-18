'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AuthTestPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [connectionError, setConnectionError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Get environment variables
    const vars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Loaded (starts with ' + process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 10) + '...)' : 'MISSING',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? 'Loaded (starts with ' + process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.substring(0, 15) + '...)' : 'MISSING',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'Not set',
    }
    setEnvVars(vars)

    // 2. Initialize client and test connection
    const testConnection = async () => {
      try {
        console.log('Initializing Supabase client for testing...')
        const supabase = createClient()
        
        // Fetch current session and user
        console.log('Fetching session...')
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw new Error('Session fetch error: ' + sessionError.message)
        }
        
        setSession(sessionData.session)
        setUser(sessionData.session?.user ?? null)
        
        // Test basic select or auth info fetch
        console.log('Testing simple select/health check...')
        const { data, error } = await supabase.auth.getUser()
        
        if (error) {
          // If auth fails but we contacted the server, it could just mean unauthenticated
          console.log('getUser error (expected if not logged in):', error.message)
          setConnectionStatus(`Connected to Supabase (Unauthenticated: ${error.message})`)
        } else {
          setConnectionStatus('Connected to Supabase (Authenticated)')
          setUser(data.user)
        }
      } catch (err: any) {
        console.error('Supabase connection test failed:', err)
        setConnectionStatus('Failed')
        setConnectionError(err.message || String(err))
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold border-b border-neutral-800 pb-4 text-cyan-400">
          ARISE AUTHENTICATION AUDIT TERMINAL
        </h1>

        {/* Connection status */}
        <section className="bg-neutral-900 border border-neutral-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2 text-cyan-300">1. Supabase Connection Status</h2>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${
              connectionStatus.includes('Connected') ? 'bg-green-500' :
              connectionStatus === 'Failed' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span>{connectionStatus}</span>
          </div>
          {connectionError && (
            <div className="mt-2 text-red-400 text-sm bg-red-950/30 border border-red-900/50 p-2 rounded">
              Error: {connectionError}
            </div>
          )}
        </section>

        {/* Environment Variables */}
        <section className="bg-neutral-900 border border-neutral-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2 text-cyan-300">2. Environment Variables Check</h2>
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400">
                <th className="py-2">Variable Name</th>
                <th className="py-2">Status / Preview</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(envVars).map(([name, status]) => (
                <tr key={name} className="border-b border-neutral-800/50">
                  <td className="py-2 pr-4">{name}</td>
                  <td className="py-2 font-semibold text-neutral-300">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Session & User details */}
        <section className="bg-neutral-900 border border-neutral-800 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2 text-cyan-300">3. Active Session & User Info</h2>
          {loading ? (
            <p>Loading session details...</p>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="text-neutral-400">Authenticated State: </span>
                <span className={user ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                  {user ? 'LOGGED IN' : 'GUEST'}
                </span>
              </div>

              {user && (
                <div className="space-y-2">
                  <div>
                    <span className="text-neutral-400">User ID: </span>
                    <span>{user.id}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Email: </span>
                    <span>{user.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Role: </span>
                    <span>{user.role}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Provider: </span>
                    <span>{user.app_metadata?.provider}</span>
                  </div>
                </div>
              )}

              <div className="border-t border-neutral-800 pt-4">
                <span className="text-neutral-400 block mb-2">Session JSON:</span>
                <pre className="text-xs bg-neutral-950 p-3 rounded border border-neutral-800 max-h-60 overflow-y-auto">
                  {session ? JSON.stringify(session, null, 2) : 'No active session (null)'}
                </pre>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

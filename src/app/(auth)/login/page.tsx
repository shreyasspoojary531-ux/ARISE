import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { LoginForm } from '@/components/auth/LoginForm'
import { AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Login // ARISE',
  description: 'Sign in to your ARISE hunter account.',
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string; next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams

  return (
    <AuthLayout>
      <AuthCard
        title="Hunter Login"
        subtitle="Access your hunter system"
      >
        {/* URL error (e.g. from callback) */}
        {error && (
          <div className="flex items-start gap-2.5 border border-red-500/30 bg-red-500/10 px-3 py-3 mb-5 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]">
            <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
            <span className="font-sans text-xs text-red-300">{error}</span>
          </div>
        )}

        <LoginForm />

        <p className="text-center font-sans text-xs text-neutral-600 mt-5">
          No account?{' '}
          <Link
            href="/signup"
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Initialize Hunter Profile
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}

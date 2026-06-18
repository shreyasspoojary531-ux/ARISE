import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { SignupForm } from '@/components/auth/SignupForm'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

export const metadata: Metadata = {
  title: 'Create Account // ARISE',
  description: 'Create your ARISE hunter profile and begin your journey.',
}

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Create Profile"
        subtitle="Begin your hunter journey"
      >
        <OAuthButtons mode="signup" />
        <SignupForm />

        <p className="text-center font-sans text-xs text-neutral-600 mt-5">
          Already a hunter?{' '}
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Sign In
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  )
}

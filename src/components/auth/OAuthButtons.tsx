'use client'

import { useTransition } from 'react'
import { motion } from 'framer-motion'
import { signInWithGoogle } from '@/app/auth/actions'

// ── Icons ──────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function Spinner() {
  return (
    <div className="w-3.5 h-3.5 rounded-full border border-neutral-700 border-t-cyan-400 animate-spin" />
  )
}

// ── OAuthButton ──────────────────────────────────────────────────────────────

interface OAuthButtonProps {
  onClick: () => void
  disabled: boolean
  isPending: boolean
  icon: React.ReactNode
  label: string
  pendingLabel: string
}

function OAuthButton({ onClick, disabled, isPending, icon, label, pendingLabel }: OAuthButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.99 }}
      className="w-full flex items-center justify-center gap-3 border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-800/50 text-white transition-all duration-200 px-4 py-3 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
    >
      {isPending ? <Spinner /> : icon}
      <span className="font-orbitron text-[10px] tracking-widest uppercase text-neutral-300">
        {isPending ? pendingLabel : label}
      </span>
    </motion.button>
  )
}

// ── OAuthButtons ─────────────────────────────────────────────────────────────

interface OAuthButtonsProps {
  mode?: 'login' | 'signup'
}

export function OAuthButtons({ mode = 'login' }: OAuthButtonsProps) {
  const [isGooglePending, startGoogle] = useTransition()

  const actionLabel = mode === 'signup' ? 'Sign up' : 'Continue'

  const handleGoogleClick = () => {
    startGoogle(async () => {
      const result = await signInWithGoogle()
      if (result?.error) {
        console.error(result.error)
      } else if (result?.url) {
        window.location.href = result.url
      }
    })
  }

  return (
    <div className="space-y-3 mb-5">
      <OAuthButton
        onClick={handleGoogleClick}
        disabled={isGooglePending}
        isPending={isGooglePending}
        icon={<GoogleIcon />}
        label={`${actionLabel} with Google`}
        pendingLabel="Connecting..."
      />

      {/* Divider */}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex-1 h-px bg-neutral-900" />
        <span className="font-orbitron text-[8px] tracking-widest text-neutral-600 uppercase whitespace-nowrap">
          Or continue with email
        </span>
        <div className="flex-1 h-px bg-neutral-900" />
      </div>
    </div>
  )
}

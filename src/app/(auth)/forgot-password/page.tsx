'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { forgotPassword } from '@/app/auth/actions'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { cn } from '@/lib/utils'

export default function ForgotPasswordPage() {
  const [email, setEmail]          = useState('')
  const [emailError, setEmailError] = useState('')
  const [formError, setFormError]  = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  const validate = () => {
    if (!email.trim()) { setEmailError('Email is required.'); return false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Enter a valid email.'); return false }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSuccessMsg('')
    setEmailError('')
    if (!validate()) return

    startTransition(async () => {
      const fd = new FormData()
      fd.set('email', email)
      const result = await forgotPassword(fd)
      if (result?.error) setFormError(result.error)
      else if (result?.success) setSuccessMsg(result.message ?? 'Check your email.')
    })
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Recover Access"
        subtitle="Reset your hunter credentials"
      >
        {successMsg ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-4 text-center"
          >
            <div className="w-12 h-12 rounded-full border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center">
              <CheckCircle size={22} className="text-cyan-400" />
            </div>
            <div>
              <p className="font-orbitron text-sm tracking-widest text-white uppercase">Link Dispatched</p>
              <p className="font-sans text-xs text-neutral-500 mt-2 leading-relaxed max-w-xs">{successMsg}</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1 h-1 bg-cyan-500 animate-ping rounded-full" />
              <span className="font-orbitron text-[9px] tracking-widest text-neutral-600 uppercase">
                Awaiting your confirmation
              </span>
            </div>
            <Link
              href="/login"
              className="mt-2 font-orbitron text-[9px] tracking-widest text-neutral-600 hover:text-cyan-400 uppercase transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={10} />
              Back to Login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <p className="font-sans text-xs text-neutral-500 leading-relaxed">
              Enter the email address linked to your hunter profile. We&apos;ll send you a secure reset link.
            </p>

            {/* Form-level error */}
            <AnimatePresence>
              {formError && (
                <motion.div
                  key="err"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-start gap-2.5 border border-red-500/30 bg-red-500/10 px-3 py-3 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]"
                >
                  <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
                  <span className="font-sans text-xs text-red-300">{formError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block font-orbitron text-[9px] tracking-widest text-neutral-500 uppercase">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-700 pointer-events-none">
                  <Mail size={13} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                  placeholder="hunter@arise.dev"
                  autoComplete="email"
                  className={cn(
                    'w-full bg-neutral-900/60 border text-white text-sm font-sans placeholder:text-neutral-700',
                    'pl-9 pr-4 py-3 outline-none transition-colors duration-200',
                    '[clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]',
                    emailError ? 'border-red-500/50' : 'border-neutral-800 focus:border-cyan-500/50',
                  )}
                />
              </div>
              {emailError && (
                <p className="flex items-center gap-1.5 font-sans text-xs text-red-400">
                  <AlertCircle size={10} /> {emailError}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={isPending ? {} : { scale: 1.01 }}
              whileTap={isPending ? {} : { scale: 0.99 }}
              className="w-full relative flex items-center justify-center gap-2.5 font-orbitron text-[11px] tracking-widest uppercase font-bold py-3.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer [clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]
                before:absolute before:inset-0 before:-z-10 before:[clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]
                before:bg-cyan-500/30 hover:before:bg-cyan-400/40 before:transition-colors
                after:absolute after:inset-[1px] after:-z-10 after:[clip-path:polygon(0_5px,5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%)]
                after:bg-cyan-950/30 after:transition-colors
                text-cyan-400 hover:text-cyan-300"
            >
              {isPending ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border border-cyan-700 border-t-cyan-400 animate-spin" />
                  Transmitting...
                </>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>

            <p className="text-center font-sans text-xs text-neutral-600">
              Remember your credentials?{' '}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Sign In
              </Link>
            </p>
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  )
}

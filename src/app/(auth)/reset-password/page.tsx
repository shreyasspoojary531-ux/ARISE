'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react'
import { resetPassword } from '@/app/auth/actions'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { cn } from '@/lib/utils'

function getStrength(pwd: string): number {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score
}

const STRENGTH_META: Record<number, { label: string; color: string; text: string }> = {
  0: { label: '',       color: 'bg-neutral-800', text: ''             },
  1: { label: 'WEAK',   color: 'bg-red-500',     text: 'text-red-400' },
  2: { label: 'FAIR',   color: 'bg-orange-400',  text: 'text-orange-400' },
  3: { label: 'GOOD',   color: 'bg-yellow-400',  text: 'text-yellow-400' },
  4: { label: 'STRONG', color: 'bg-cyan-400',    text: 'text-cyan-400'  },
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword]       = useState('')
  const [confirm, setConfirm]         = useState('')
  const [showPassword, setShowPwd]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors]           = useState<{ password?: string; confirm?: string }>({})
  const [formError, setFormError]     = useState('')
  const [isPending, startTransition]  = useTransition()

  const strength = getStrength(password)
  const meta = STRENGTH_META[strength]

  const validate = () => {
    const errs: typeof errors = {}
    if (!password)                      errs.password = 'Password is required.'
    else if (getStrength(password) < 2) errs.password = 'Choose a stronger password.'
    if (!confirm)                       errs.confirm = 'Please confirm your password.'
    else if (password !== confirm)      errs.confirm = 'Passwords do not match.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    startTransition(async () => {
      const fd = new FormData()
      fd.set('password', password)
      const result = await resetPassword(fd)
      if (result?.error) {
        setFormError(result.error)
      } else if (result?.success) {
        router.push('/dashboard')
        router.refresh()
      }
    })
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Reset Password"
        subtitle="Set new hunter credentials"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <p className="font-sans text-xs text-neutral-500 leading-relaxed">
            Choose a strong password to secure your hunter profile.
          </p>

          {/* Form error */}
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

          {/* New password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block font-orbitron text-[9px] tracking-widest text-neutral-500 uppercase">
              New Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-700 pointer-events-none">
                <Lock size={13} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((ev) => ({ ...ev, password: undefined })) }}
                placeholder="••••••••••••"
                autoComplete="new-password"
                className={cn(
                  'w-full bg-neutral-900/60 border text-white text-sm font-sans placeholder:text-neutral-700',
                  'pl-9 pr-10 py-3 outline-none transition-colors duration-200',
                  '[clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]',
                  errors.password ? 'border-red-500/50' : 'border-neutral-800 focus:border-cyan-500/50',
                )}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-neutral-400 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Strength meter */}
            {password && (
              <div className="space-y-1 pt-0.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'h-[2px] flex-1 rounded-full transition-colors duration-300',
                        strength >= level ? meta.color : 'bg-neutral-800',
                      )}
                    />
                  ))}
                </div>
                {strength > 0 && (
                  <span className={cn('font-orbitron text-[8px] tracking-widest', meta.text)}>
                    STRENGTH: {meta.label}
                  </span>
                )}
              </div>
            )}

            {errors.password && (
              <p className="flex items-center gap-1.5 font-sans text-xs text-red-400">
                <AlertCircle size={10} /> {errors.password}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="block font-orbitron text-[9px] tracking-widest text-neutral-500 uppercase">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-700 pointer-events-none">
                <Lock size={13} />
              </div>
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrors((ev) => ({ ...ev, confirm: undefined })) }}
                placeholder="••••••••••••"
                autoComplete="new-password"
                className={cn(
                  'w-full bg-neutral-900/60 border text-white text-sm font-sans placeholder:text-neutral-700',
                  'pl-9 pr-10 py-3 outline-none transition-colors duration-200',
                  '[clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]',
                  errors.confirm ? 'border-red-500/50' : 'border-neutral-800 focus:border-cyan-500/50',
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-neutral-400 transition-colors cursor-pointer"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.confirm && (
              <p className="flex items-center gap-1.5 font-sans text-xs text-red-400">
                <AlertCircle size={10} /> {errors.confirm}
              </p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={isPending}
            whileHover={isPending ? {} : { scale: 1.01 }}
            whileTap={isPending ? {} : { scale: 0.99 }}
            className="w-full relative flex items-center justify-center gap-2.5 font-orbitron text-[11px] tracking-widest uppercase font-bold mt-2 py-3.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer [clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]
              before:absolute before:inset-0 before:-z-10 before:[clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]
              before:bg-cyan-500/30 hover:before:bg-cyan-400/40 before:transition-colors
              after:absolute after:inset-[1px] after:-z-10 after:[clip-path:polygon(0_5px,5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%)]
              after:bg-cyan-950/30 after:transition-colors
              text-cyan-400 hover:text-cyan-300"
          >
            {isPending ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border border-cyan-700 border-t-cyan-400 animate-spin" />
                Updating credentials...
              </>
            ) : (
              'Set New Password'
            )}
          </motion.button>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

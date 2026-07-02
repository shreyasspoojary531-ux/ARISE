'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { signup } from '@/app/auth/actions'
import { useAuthStages } from '@/lib/use-auth-stages'
import { cn } from '@/lib/utils'
import { HudInput, HudCheckbox } from '@/components/ui/hud-input'

// ── Password strength ─────────────────────────────────────────────────────

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

function StrengthMeter({ password }: { password: string }) {
  const strength = getStrength(password)
  const meta = STRENGTH_META[strength]

  if (!password) return null

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <motion.div
            key={level}
            className={cn(
              'h-[2px] flex-1 rounded-full transition-colors duration-300 origin-left',
              strength >= level ? meta.color : 'bg-neutral-800',
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: level * 0.05 }}
          />
        ))}
      </div>
      {strength > 0 && (
        <span className={cn('font-orbitron text-[8px] tracking-widest', meta.text)}>
          STRENGTH: {meta.label}
        </span>
      )}
    </div>
  )
}

// ── SignupForm ────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<'name' | 'email' | 'password' | 'confirmPassword' | 'terms', string>>

export function SignupForm() {
  const [name, setName]                 = useState('')
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [showPassword, setShowPwd]      = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [acceptedTerms, setTerms]       = useState(false)
  const [errors, setErrors]             = useState<FormErrors>({})
  const [formError, setFormError]       = useState('')
  const [isPending, startTransition]    = useTransition()

  // Staged loading messages — "system initializing" feel
  const { label: stageLabel, isFinalStage } = useAuthStages(isPending, [
    { label: 'Initializing Profile...',   ms: 0    },
    { label: 'Scanning attributes...',     ms: 800  },
    { label: 'Preparing system...',         ms: 1800 },
    { label: 'Hunter Registered',           ms: 2800 },
  ])

  const validate = () => {
    const errs: FormErrors = {}
    if (!name.trim())                   errs.name = 'Display name is required.'
    if (!email.trim())                  errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email.'
    if (!password)                      errs.password = 'Password is required.'
    else if (getStrength(password) < 2) errs.password = 'Password is too weak. Add uppercase, numbers, or symbols.'
    if (!confirm)                       errs.confirmPassword = 'Please confirm your password.'
    else if (password !== confirm)      errs.confirmPassword = 'Passwords do not match.'
    if (!acceptedTerms)                 errs.terms = 'You must accept the terms to continue.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    startTransition(async () => {
      const fd = new FormData()
      fd.set('name', name)
      fd.set('email', email)
      fd.set('password', password)
      const result = await signup(fd)
      // signup() now uses redirect() on success — this code only runs on error
      if (result?.error) {
        setFormError(result.error)
      }
      // Success = server-side redirect, no client navigation needed
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Form-level error */}
      <AnimatePresence>
        {formError && (
          <motion.div
            key="form-err"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-2.5 border border-red-500/30 bg-red-500/10 px-3 py-3 clip-hud-4"
          >
            <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
            <span className="font-sans text-xs text-red-300">{formError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Display Name */}
      <HudInput
        id="name"
        label="Display Name"
        value={name}
        onChange={(v) => { setName(v); setErrors((e) => ({ ...e, name: undefined })) }}
        placeholder="Shadow Monarch"
        icon={<User size={13} />}
        error={errors.name}
        autoComplete="name"
      />

      {/* Email */}
      <HudInput
        id="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })) }}
        placeholder="hunter@arise.dev"
        icon={<Mail size={13} />}
        error={errors.email}
        autoComplete="email"
      />

      {/* Password + strength meter */}
      <HudInput
        id="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })) }}
        placeholder="••••••••••••"
        icon={<Lock size={13} />}
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="text-neutral-700 hover:text-neutral-400 transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        }
        error={errors.password}
        autoComplete="new-password"
        extra={<StrengthMeter password={password} />}
      />

      {/* Confirm Password */}
      <HudInput
        id="confirm-password"
        label="Confirm Password"
        type={showConfirm ? 'text' : 'password'}
        value={confirm}
        onChange={(v) => { setConfirm(v); setErrors((e) => ({ ...e, confirmPassword: undefined })) }}
        placeholder="••••••••••••"
        icon={<Lock size={13} />}
        endAdornment={
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            className="text-neutral-700 hover:text-neutral-400 transition-colors cursor-pointer"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        }
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      {/* Terms */}
      <div className="space-y-1">
        <HudCheckbox
          id="terms"
          checked={acceptedTerms}
          onChange={(v) => { setTerms(v); setErrors((e) => ({ ...e, terms: undefined })) }}
          align="start"
          label={
            <>
              I agree to the{' '}
              <a href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2">
                Privacy Policy
              </a>
            </>
          }
        />
        {errors.terms && (
          <p className="flex items-center gap-1.5 font-sans text-xs text-red-400 pl-6">
            <AlertCircle size={10} className="shrink-0" />
            {errors.terms}
          </p>
        )}
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={isPending}
        whileHover={isPending ? {} : { scale: 1.01 }}
        whileTap={isPending ? {} : { scale: 0.99 }}
        className={cn(
          "w-full relative flex items-center justify-center gap-2.5 font-orbitron text-[11px] tracking-widest uppercase font-bold mt-1 py-3.5 transition-all duration-200 disabled:cursor-not-allowed cursor-pointer clip-hud-6",
          "before:absolute before:inset-0 before:-z-10 before:clip-hud-6",
          "before:bg-cyan-500/30 hover:before:bg-cyan-400/40 before:transition-colors",
          "after:absolute after:inset-[1px] after:-z-10 after:clip-hud-5",
          "after:bg-cyan-950/30 after:transition-colors",
          isPending && !isFinalStage ? "opacity-80" : "disabled:opacity-60",
          isFinalStage ? "text-green-400" : "text-cyan-400 hover:text-cyan-300"
        )}
      >
        {isPending ? (
          <>
            {!isFinalStage ? (
              <div className="w-3.5 h-3.5 rounded-full border border-cyan-700 border-t-cyan-400 animate-spin" />
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3.5 h-3.5 bg-green-400 clip-hud-2"
              />
            )}
            <AnimatePresence mode="wait">
              <motion.span
                key={stageLabel}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className={cn(isFinalStage && "text-green-400")}
              >
                {stageLabel}
              </motion.span>
            </AnimatePresence>
          </>
        ) : (
          'Initialize Hunter Profile'
        )}
      </motion.button>
    </form>
  )
}

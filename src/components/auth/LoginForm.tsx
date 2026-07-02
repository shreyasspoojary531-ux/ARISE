'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { login } from '@/app/auth/actions'
import { useAuthStages } from '@/lib/use-auth-stages'
import { cn } from '@/lib/utils'
import { HudInput, HudCheckbox } from '@/components/ui/hud-input'

// ── LoginForm ─────────────────────────────────────────────────────────────

export function LoginForm() {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShow]     = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors]         = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError]   = useState('')
  const [isPending, startTransition] = useTransition()

  // Staged loading messages — creates a "system booting" feel
  const { label: stageLabel, isFinalStage } = useAuthStages(isPending, [
    { label: 'Authenticating...',       ms: 0    },
    { label: 'Verifying credentials...', ms: 800  },
    { label: 'Accessing system...',      ms: 1800 },
    { label: 'Access Granted',          ms: 2800 },
  ])

  const validate = () => {
    const errs: typeof errors = {}
    if (!email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email.'
    if (!password) errs.password = 'Password is required.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    startTransition(async () => {
      const fd = new FormData()
      fd.set('email', email)
      fd.set('password', password)
      const result = await login(fd)
      // login() now uses redirect() on success — this code only runs on error
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

      {/* Password */}
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
            onClick={() => setShow((s) => !s)}
            className="text-neutral-700 hover:text-neutral-400 transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        }
        error={errors.password}
        autoComplete="current-password"
      />

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between pt-0.5">
        <HudCheckbox
          id="remember-me"
          checked={rememberMe}
          onChange={setRememberMe}
          label="Remember me"
        />
        <a
          href="/forgot-password"
          className="font-orbitron text-[9px] tracking-widest text-neutral-600 hover:text-cyan-400 uppercase transition-colors"
        >
          Forgot Password?
        </a>
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={isPending}
        whileHover={isPending ? {} : { scale: 1.01 }}
        whileTap={isPending ? {} : { scale: 0.99 }}
        className={cn(
          "w-full relative flex items-center justify-center gap-2.5 font-orbitron text-[11px] tracking-widest uppercase font-bold mt-2 py-3.5 transition-all duration-200 disabled:cursor-not-allowed cursor-pointer clip-hud-6",
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
          'Initiate Login'
        )}
      </motion.button>
    </form>
  )
}

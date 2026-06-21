'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { login } from '@/app/auth/actions'
import { useAuthStages } from '@/lib/use-auth-stages'
import { cn } from '@/lib/utils'

// ── Shared input wrapper ──────────────────────────────────────────────────

interface InputFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  icon?: React.ReactNode
  endAdornment?: React.ReactNode
  error?: string
  autoComplete?: string
}

function InputField({
  id, label, type = 'text', value, onChange,
  placeholder, icon, endAdornment, error, autoComplete,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-orbitron text-[9px] tracking-widest text-neutral-500 uppercase">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-700 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            'w-full bg-neutral-900/60 border text-white text-sm font-sans placeholder:text-neutral-700',
            'px-4 py-3 outline-none transition-colors duration-200',
            '[clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]',
            icon && 'pl-9',
            endAdornment && 'pr-10',
            error
              ? 'border-red-500/50 focus:border-red-400/70'
              : 'border-neutral-800 focus:border-cyan-500/50',
          )}
        />
        {endAdornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {endAdornment}
          </div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 font-sans text-xs text-red-400"
          >
            <AlertCircle size={10} className="shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── CheckboxField ─────────────────────────────────────────────────────────

function CheckboxField({
  id, checked, onChange, label,
}: { id: string; checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer group">
      <div
        className={cn(
          'relative w-4 h-4 shrink-0 border transition-colors duration-150',
          '[clip-path:polygon(0_2px,2px_0,100%_0,100%_calc(100%-2px),calc(100%-2px)_100%,0_100%)]',
          checked ? 'border-cyan-500 bg-cyan-500/20' : 'border-neutral-700 bg-neutral-900 group-hover:border-neutral-600',
        )}
      >
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-cyan-400" />
          </motion.div>
        )}
      </div>
      <span className="font-sans text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors">
        {label}
      </span>
    </label>
  )
}

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
            className="flex items-start gap-2.5 border border-red-500/30 bg-red-500/10 px-3 py-3 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]"
          >
            <AlertCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
            <span className="font-sans text-xs text-red-300">{formError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email */}
      <InputField
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
      <InputField
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
        <CheckboxField
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
          "w-full relative flex items-center justify-center gap-2.5 font-orbitron text-[11px] tracking-widest uppercase font-bold mt-2 py-3.5 transition-all duration-200 disabled:cursor-not-allowed cursor-pointer [clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]",
          "before:absolute before:inset-0 before:-z-10 before:[clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]",
          "before:bg-cyan-500/30 hover:before:bg-cyan-400/40 before:transition-colors",
          "after:absolute after:inset-[1px] after:-z-10 after:[clip-path:polygon(0_5px,5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%)]",
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
                className="w-3.5 h-3.5 bg-green-400 [clip-path:polygon(0_2px,2px_0,100%_0,100%_calc(100%-2px),calc(100%-2px)_100%,0_100%)]"
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

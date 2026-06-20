import { AuthBackground } from './AuthBackground'
import Image from 'next/image'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-black">

      {/* ── Left panel: branding (desktop only) — 50% ─────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen">
        <AuthBackground />
      </div>

      {/* ── Right panel: form — 50% ────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-10 relative min-h-screen overflow-y-auto">

        {/* Mobile: subtle background elements */}
        <div className="absolute inset-0 lg:hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25" />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.04)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,212,255,0.03)_0%,transparent_70%)]" />
        </div>

        {/* Right-side vertical accent line (desktop) */}
        <div className="hidden lg:block absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-neutral-800 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full flex flex-col items-center gap-0">

          {/* Mobile: logo only — no ARISE text */}
          <div className="lg:hidden mb-8 text-center">
            <Image src="/images/logo.png" alt="ARISE" width={80} height={80} className="object-contain w-20 h-20" />
            <div className="h-px w-20 mx-auto my-2 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
            <p className="font-orbitron text-[9px] tracking-[0.25em] text-neutral-600 uppercase">
              Hunter System Online
            </p>
          </div>

          {children}

          {/* Bottom branding — desktop only to avoid redundant "ARISE" text on mobile */}
          <p className="mt-8 font-orbitron text-[8px] tracking-widest text-neutral-800 uppercase hidden lg:block">
            ARISE // All rights reserved
          </p>
        </div>
      </div>
    </div>
  )
}

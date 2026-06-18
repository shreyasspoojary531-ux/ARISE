'use client'

import * as React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { CoreSystemsSection } from '@/components/landing/CoreSystemsSection'
import { OpenSourceSection } from '@/components/landing/OpenSourceSection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      {/* Decorative vertical lines running across the entire page for military/HUD feel */}
      <div className="fixed inset-y-0 left-6 w-px bg-neutral-950/20 pointer-events-none z-40 hidden md:block" />
      <div className="fixed inset-y-0 right-6 w-px bg-neutral-950/20 pointer-events-none z-40 hidden md:block" />

      {/* Top navbar */}
      <Navbar />

      {/* Hero section containing the hunter and stats panel */}
      <HeroSection />

      {/* Grid of systems: Quests, Gym, Levels, etc. */}
      <CoreSystemsSection />

      {/* Open Source / Built in public specs */}
      <OpenSourceSection />

      {/* Small tech footer */}
      <Footer />
    </div>
  )
}

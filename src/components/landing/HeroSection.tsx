'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Github } from '@/components/icons/Github'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { TextEffect } from '@/components/ui/text-effect'
import { HunterStatusPanel } from './HunterStatusPanel'

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-black">
      {/* Premium subtle glow background from 21st dev template */}
      <div
        aria-hidden
        className="z-0 absolute inset-0 pointer-events-none isolate opacity-40 contain-strict hidden lg:block"
      >
        <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(190,100%,50%,0.03)_0,hsla(0,0%,55%,0.01)_50%,transparent_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(190,100%,50%,0.02)_0,transparent_80%)] [translate:5%_-50%]" />
      </div>

      {/* Cyberpunk Grid Background */}
      <div 
        className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70"
      />

      {/* Stylized Hunter Silhouette (Centered and blended in back) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[70vh] z-0 opacity-10 pointer-events-none select-none">
        <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path 
            d="M400 150 L420 250 L460 260 L440 280 L450 340 L480 390 L490 440 L450 490 L420 600 L380 600 L350 490 L310 440 L320 390 L350 340 L360 280 L340 260 L380 250 Z" 
            fill="url(#hunter-gradient)" 
          />
          <path 
            d="M400 130 L415 150 L385 150 Z" 
            fill="url(#hunter-gradient)" 
          />
          <defs>
            <linearGradient id="hunter-gradient" x1="400" y1="130" x2="400" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00d4ff" />
              <stop offset="1" stopColor="#000000" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10 w-full">
        {/* Main layout: split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <AnimatedGroup preset="blur-slide" className="space-y-6">
              {/* Modern Tech Indicator Tag */}
              <Link
                href="#features"
                className="inline-flex items-center gap-3 bg-neutral-950 border border-neutral-900 px-3 py-1 hover:border-cyan-500/30 transition-all duration-300 group max-w-fit [clip-path:polygon(0_4px,_4px_0,_100%_0,_100%_calc(100%-4px),_calc(100%-4px)_100%,_0_100%)]"
              >
                <span className="font-orbitron text-[9px] tracking-widest text-cyan-400 font-semibold uppercase">
                  SYSTEM INITIALIZED
                </span>
                <span className="h-3 w-px bg-neutral-800" />
                <span className="font-sans text-[10px] tracking-wider text-neutral-400 flex items-center gap-1 group-hover:text-white transition-colors">
                  Explore Features
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>

              {/* Main Headline with Orbitron */}
              <h1 className="font-orbitron text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight uppercase max-w-2xl">
                Become The <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-cyan-400">
                  Strongest Version
                </span> <br />
                Of Yourself
              </h1>

              {/* Subheading text */}
              <p className="font-sans text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl">
                ARISE transforms self-improvement into a journey of quests, habits, learning, fitness, and meaningful progression. Every action counts. Every day matters.
              </p>
            </AnimatedGroup>

            {/* CTA Actions */}
            <AnimatedGroup 
              preset="fade" 
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button variant="cyan" size="lg" asChild>
                <Link href="#">
                  Start Your Journey
                </Link>
              </Button>
              <Button variant="secondary" size="lg" className="gap-2" asChild>
                <Link href="#github">
                  <Github className="w-4 h-4" />
                  Contribute on GitHub
                </Link>
              </Button>
            </AnimatedGroup>
          </div>

          {/* Right Column: Status HUD Panel */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md relative">
              {/* Outer tech border styling around status panel */}
              <div className="absolute -inset-4 border border-cyan-500/5 pointer-events-none [clip-path:polygon(0_12px,_12px_0,_100%_0,_100%_calc(100%-12px),_calc(100%-12px)_100%,_0_100%)]" />
              <HunterStatusPanel />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

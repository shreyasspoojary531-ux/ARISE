'use client'

import * as React from 'react'
import { Target, TrendingUp, GitBranch, Dumbbell, BookOpen, Trophy } from 'lucide-react'
import { SystemCard } from './SystemCard'

const systems = [
  {
    title: 'QUEST SYSTEM',
    description: 'Transform daily habits and tasks into structured quests. Complete dailies, weeklies, and custom epic campaigns to earn rewards and build actual momentum.',
    icon: Target,
    subtext: 'SYS.MOD // QUEST',
  },
  {
    title: 'LEVEL SYSTEM',
    description: 'Gain experience points (XP) for gym sessions, study sessions, and good habits. Level up your real life character status and track overall discipline score.',
    icon: TrendingUp,
    subtext: 'SYS.MOD // PROGRESS',
  },
  {
    title: 'SKILL TREE',
    description: 'Map out your self-improvement paths. Spec into programming, physical strength, communication, languages, or financial discipline with modular skill milestones.',
    icon: GitBranch,
    subtext: 'SYS.MOD // DEV_TREE',
  },
  {
    title: 'GYM SYSTEM',
    description: 'Log workouts, track progressive overload, and sync steps. Watch your strength and stamina stats increase dynamically as you push your limits.',
    icon: Dumbbell,
    subtext: 'SYS.MOD // PHYSICAL',
  },
  {
    title: 'LEARNING SYSTEM',
    description: 'Turn books, tutorials, and certifications into structured research projects. Track hours logged and knowledge retention as actual stat growth.',
    icon: BookOpen,
    subtext: 'SYS.MOD // INTELLECT',
  },
  {
    title: 'ACHIEVEMENTS',
    description: 'Unlock special badges and milestones for breaking personal records, finishing streaks, and committing code consistently. Celebrate meaningful milestones.',
    icon: Trophy,
    subtext: 'SYS.MOD // REWARDS',
  },
]

export function CoreSystemsSection() {
  return (
    <section id="features" className="relative py-24 bg-black border-y border-neutral-900 overflow-hidden">
      {/* Decorative vertical lines on left and right for industrial layout grid */}
      <div className="absolute left-10 top-0 bottom-0 w-px bg-neutral-950 hidden xl:block" />
      <div className="absolute right-10 top-0 bottom-0 w-px bg-neutral-950 hidden xl:block" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-xl mb-16 space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-cyan-500" />
            <span className="font-orbitron text-[10px] tracking-widest text-cyan-400 font-semibold uppercase">
              MODULE DIRECTORY
            </span>
          </div>
          <h2 className="font-orbitron text-2xl md:text-3xl font-bold tracking-wider text-white uppercase">
            CORE PROGRESSION SYSTEMS
          </h2>
          <p className="font-sans text-neutral-500 text-xs md:text-sm leading-relaxed">
            Every module is designed to map real world progress to gamified visual interfaces, giving you clear metrics on your self-development journey.
          </p>
        </div>

        {/* Grid Container with scroll-reveal class */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 scroll-reveal-grid">
          {systems.map((sys, idx) => (
            <SystemCard
              key={idx}
              title={sys.title}
              description={sys.description}
              icon={sys.icon}
              subtext={sys.subtext}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import {
  Activity,
  Database,
  Rocket,
  ShieldCheck,
  Smartphone,
  Users,
} from 'lucide-react'
import { Github } from '@/components/icons/Github'
import { Button } from '@/components/ui/button'
import RadialOrbitalTimeline, {
  type TimelineItem,
} from '@/components/ui/radial-orbital-timeline'

const roadmapSteps: TimelineItem[] = [
  {
    id: 1,
    title: 'Core Progression',
    date: 'Phase 01',
    content:
      'Database schemas for quests, stat updates, and experience level scaling formulas.',
    category: 'Systems',
    icon: Database,
    relatedIds: [2, 4],
    status: 'completed',
    energy: 100,
  },
  {
    id: 2,
    title: 'Mobile Sync',
    date: 'Phase 02',
    content:
      'Developing synchronization gateways for Apple Health, Google Fit, and Garmin API.',
    category: 'Integrations',
    icon: Smartphone,
    relatedIds: [1, 3],
    status: 'in-progress',
    energy: 72,
  },
  {
    id: 3,
    title: 'Guild Raids',
    date: 'Phase 03',
    content:
      'Creating party systems to tackle cooperative real-life challenges with friends.',
    category: 'Social',
    icon: Users,
    relatedIds: [2, 5],
    status: 'pending',
    energy: 46,
  },
  {
    id: 4,
    title: 'Security Layer',
    date: 'Phase 04',
    content:
      'Hardening auth flows, data ownership controls, and contributor review gates.',
    category: 'Security',
    icon: ShieldCheck,
    relatedIds: [1, 5],
    status: 'in-progress',
    energy: 58,
  },
  {
    id: 5,
    title: 'Public Release',
    date: 'Phase 05',
    content:
      'Preparing the public client, documentation, and release pipeline for early adopters.',
    category: 'Launch',
    icon: Rocket,
    relatedIds: [3, 4, 6],
    status: 'pending',
    energy: 32,
  },
  {
    id: 6,
    title: 'Live Ops',
    date: 'Phase 06',
    content:
      'Seasonal quest tuning, contributor analytics, and long-term progression telemetry.',
    category: 'Operations',
    icon: Activity,
    relatedIds: [5],
    status: 'pending',
    energy: 24,
  },
]

export function OpenSourceSection() {
  return (
    <section id="roadmap" className="relative py-16 bg-black overflow-hidden">
      {/* Background design accents */}
      <div className="absolute right-0 top-1/4 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.02)_0,transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Heading and GitHub action */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-cyan-500" />
              <span className="font-orbitron text-[10px] tracking-widest text-cyan-400 font-semibold uppercase">
                COMMUNITY DRIVEN
              </span>
            </div>
            
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold tracking-wider text-white uppercase leading-tight">
              BUILT IN PUBLIC. <br />
              OPEN SOURCE.
            </h2>
            
            <p className="font-sans text-neutral-400 text-xs md:text-sm leading-relaxed max-w-md">
              ARISE is developed openly on GitHub. No closed doors, no proprietary leveling algorithms. Join the community of engineers, designers, and self-improvement enthusiasts designing the ultimate real-life RPG client.
            </p>

            <div className="pt-4">
              <Button variant="cyan" size="default" className="gap-2" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                  VIEW SOURCE ON GITHUB
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column: compact roadmap timeline */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="w-full max-w-[640px] lg:ml-auto">
              <RadialOrbitalTimeline
                timelineData={roadmapSteps}
                className="h-[360px] md:h-[420px] bg-transparent"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

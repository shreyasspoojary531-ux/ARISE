'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface Attribute {
  name: string
  value: number
  max: number
  delay: string
}

const attributes: Attribute[] = [
  { name: 'STRENGTH', value: 100, max: 100, delay: '100ms' },
  { name: 'AGILITY', value: 100, max: 100, delay: '250ms' },
  { name: 'DISCIPLINE', value: 100, max: 100, delay: '400ms' },
  { name: 'INTELLIGENCE', value: 100, max: 100, delay: '550ms' },
  { name: 'STAMINA', value: 100, max: 100, delay: '700ms' },
  { name: 'AURA', value: 100, max: 100, delay: '850ms' },
  { name: 'GYM', value: 100, max: 100, delay: '1000ms' },
]

export function HunterStatusPanel() {
  return (
    <div className="w-full max-w-sm border border-neutral-900 bg-neutral-950/70 backdrop-blur-md p-6 relative hud-scanline select-none">
      {/* Tech corner accents */}
      <span className="absolute top-0 left-0 w-3 h-[1px] bg-cyan-500/50" />
      <span className="absolute top-0 left-0 w-[1px] h-3 bg-cyan-500/50" />
      <span className="absolute bottom-0 right-0 w-3 h-[1px] bg-cyan-500/50" />
      <span className="absolute bottom-0 right-0 w-[1px] h-3 bg-cyan-500/50" />

      {/* Header title */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900 mb-5">
        <span className="font-orbitron text-xs tracking-widest text-neutral-400 font-semibold flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse inline-block" />
          HUNTER STATUS
        </span>
        <span className="font-orbitron text-[9px] tracking-wider text-neutral-600">
          SYS.VER // 1.0.0
        </span>
      </div>

      {/* Top stats grid */}
      <div className="grid grid-cols-3 gap-2 text-center mb-6">
        <div className="border border-neutral-900 bg-black/40 py-2">
          <div className="font-orbitron text-[9px] tracking-wider text-neutral-600">RANK</div>
          <div className="font-orbitron text-xs font-bold text-cyan-400 mt-0.5">S-RANK</div>
        </div>
        <div className="border border-neutral-900 bg-black/40 py-2">
          <div className="font-orbitron text-[9px] tracking-wider text-neutral-600">LEVEL</div>
          <div className="font-orbitron text-xs font-bold text-white mt-0.5">100</div>
        </div>
        <div className="border border-neutral-900 bg-black/40 py-2">
          <div className="font-orbitron text-[9px] tracking-wider text-neutral-600">STATUS</div>
          <div className="font-orbitron text-[10px] font-bold text-green-500 mt-0.5 flex items-center justify-center gap-1">
            <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
            ACTIVE
          </div>
        </div>
      </div>

      {/* Core Attributes */}
      <div className="space-y-4">
        {attributes.map((attr, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-orbitron tracking-widest text-neutral-400 font-medium">
                {attr.name}
              </span>
              <span className="font-mono text-[10px] tracking-wider text-neutral-500">
                <span className="text-white font-semibold">{attr.value}</span> / {attr.max}
              </span>
            </div>
            {/* Progress bar container */}
            <div className="h-[2px] w-full bg-neutral-900 relative overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-cyan-500 origin-left animate-progress shadow-[0_0_8px_#00d4ff]"
                style={{
                  width: `${(attr.value / attr.max) * 100}%`,
                  animationDelay: attr.delay,
                  transform: 'scaleX(0)', // Initial state for clean load
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Decorative footer metrics */}
      <div className="mt-6 pt-4 border-t border-neutral-900 flex justify-between items-center text-[9px] font-mono text-neutral-600">
        <span>BUFF // XP_BOOST +15%</span>
        <span>AURA_POWER_EST // 9,842</span>
      </div>
    </div>
  )
}

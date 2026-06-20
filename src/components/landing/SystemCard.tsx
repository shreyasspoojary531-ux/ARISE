'use client'

import * as React from 'react'
import { LucideIcon } from 'lucide-react'

interface SystemCardProps {
  title: string
  description: string
  icon: LucideIcon
  subtext?: string
}

export function SystemCard({ title, description, icon: Icon, subtext }: SystemCardProps) {
  return (
    <div className="group relative bg-black border border-neutral-900 p-6 flex flex-col justify-between transition-all duration-300 hover:border-neutral-800 min-h-[180px] [clip-path:polygon(0_0,_100%_0,_100%_calc(100%-8px),_calc(100%-8px)_100%,_0_100%)]">
      {/* Subtle top edge glow border on hover */}
      <span className="absolute top-0 inset-x-0 h-[1.5px] bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#00d4ff]" />
      
      <div>
        {/* Icon Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 border border-neutral-900 bg-neutral-950 text-neutral-600 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-colors duration-300 [clip-path:polygon(0_3px,_3px_0,_100%_0,_100%_calc(100%-3px),_calc(100%-3px)_100%,_0_100%)]">
            <Icon className="w-5 h-5" />
          </div>
          {subtext && (
            <span className="font-mono text-[9px] tracking-wider text-neutral-600 group-hover:text-neutral-400 transition-colors">
              {subtext}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-orbitron text-[13px] font-bold tracking-widest text-white uppercase mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="font-sans text-neutral-400 text-xs leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Tech line detail in bottom corner */}
      <div className="mt-4 flex items-center justify-between">
        <span className="h-[1px] flex-1 bg-neutral-900 group-hover:bg-neutral-800 transition-colors" />
        <span className="w-1.5 h-1.5 border border-neutral-800 group-hover:border-cyan-500/30 ml-3 transition-colors" />
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'
import Link from 'next/link'
import { Github } from '@/components/icons/Github'

// Computed at build-time on the server and hydration — safe since
// SSR and client produce the same year
function getYear() {
  return new Date().getFullYear()
}

export function Footer() {
  return (
    <footer id="github" className="border-t border-neutral-900 bg-black py-8">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left Side */}
        <span className="font-orbitron text-[10px] tracking-widest text-neutral-600 uppercase">
          © {getYear()} ARISE // ALL SYSTEMS OPERATIONAL
        </span>

        {/* Center/Right Side */}
        <div className="flex items-center gap-6">
          <Link href="#" className="font-sans text-[10px] tracking-wider text-neutral-600 hover:text-neutral-300 uppercase transition-colors">
            Security
          </Link>
          <Link href="#" className="font-sans text-[10px] tracking-wider text-neutral-600 hover:text-neutral-300 uppercase transition-colors">
            License (MIT)
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

      </div>
    </footer>
  )
}

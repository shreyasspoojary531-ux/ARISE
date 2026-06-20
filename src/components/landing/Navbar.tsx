'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const menuItems = [
  { name: 'Home', href: '#' },
  { name: 'Features', href: '#features' },
  { name: 'Roadmap', href: '#roadmap' },
  { name: 'Documentation', href: '#' },
  { name: 'GitHub', href: '#github' },
]

export function Navbar() {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      <nav
        className={cn(
          "mx-auto max-w-7xl px-6 py-4 transition-all duration-300",
          isScrolled 
            ? "border-b border-neutral-900 bg-black/80 backdrop-blur-md py-3" 
            : "bg-transparent"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/logo.png"
              alt="ARISE Logo Icon"
              width={40}
              height={40}
              className="object-contain"
            />
            
            {/* Geometric Tech Wordmark */}
            <span className="font-orbitron text-xl font-bold tracking-widest text-white group-hover:text-cyan-400 transition-colors">
              ARISE
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="font-orbitron text-[11px] font-medium tracking-widest text-neutral-400 hover:text-white uppercase transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="cyan" size="sm" asChild>
              <Link href="/signup">Start Your Journey</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuState(!menuState)}
            className="md:hidden p-2 text-neutral-400 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuState ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuState && (
          <div className="md:hidden mt-4 p-4 border border-neutral-900 bg-black/95 backdrop-blur-lg flex flex-col gap-4 [clip-path:polygon(0_8px,_8px_0,_100%_0,_100%_calc(100%-8px),_calc(100%-8px)_100%,_0_100%)]">
            <ul className="flex flex-col gap-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuState(false)}
                    className="block font-orbitron text-xs tracking-widest text-neutral-400 hover:text-white uppercase py-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 pt-2 border-t border-neutral-900">
              <Button variant="secondary" className="w-full text-center" asChild>
                <Link href="/login" onClick={() => setMenuState(false)}>Login</Link>
              </Button>
              <Button variant="cyan" className="w-full text-center" asChild>
                <Link href="/signup" onClick={() => setMenuState(false)}>Start Your Journey</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

'use client'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="4" />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
    </svg>
  )
}

const ICON_HOVER = 'h-3 w-3 cursor-pointer text-neutral-600 transition-all duration-300 hover:text-cyan-400 hover:[filter:drop-shadow(0_0_6px_rgba(0,212,255,0.7))]'
const TEXT_HOVER = 'font-mono text-[8px] tracking-wider text-neutral-600 transition-all duration-300 hover:text-white hover:[text-shadow:0_0_8px_rgba(255,255,255,0.5)]'

/**
 * CreditsFooter — "Developed By Shreyas" (left) + "Follow us on" social links (right).
 * Shared across desktop StatusDashboard, MobileStatusDashboard, and MobileNav drawer.
 */
export function CreditsFooter({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* Bottom-left: Instagram + Developed by Shreyas */}
      <div className="flex items-center gap-1.5">
        <InstagramIcon className={ICON_HOVER} />
        <span className={TEXT_HOVER}>Developed By Shreyas</span>
      </div>

      {/* Bottom-right: Follow us on + Instagram / YouTube */}
      <div className="flex items-center gap-1.5">
        <span className={TEXT_HOVER}>Follow us on</span>
        <InstagramIcon className={ICON_HOVER} />
        <YoutubeIcon className={ICON_HOVER} />
      </div>
    </div>
  )
}

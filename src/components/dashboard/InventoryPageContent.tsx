import { INVENTORY } from './mock-data'
import { HudPanel, SectionLabel } from './primitives'

/**
 * InventoryPageContent — Server Component (no client JS).
 * Renders instantly with a single CSS entrance, avoiding the per-item
 * framer-motion stagger that delayed the grid on navigation.
 */
export function InventoryPageContent() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col px-4 py-4 sm:px-6 gap-4 overflow-y-auto">
      <div className="animate-panel-rise">
        <HudPanel header="INVENTORY" rightHeader={<SectionLabel>{INVENTORY.length} ITEMS</SectionLabel>} scanline glow>
          {/* Stats summary */}
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <InventoryStat label="TOTAL ITEMS" value={INVENTORY.reduce((s, i) => s + i.count, 0)} />
            <InventoryStat label="CATEGORIES" value={INVENTORY.length} />
            <InventoryStat label="CAPACITY" value={`${Math.round(INVENTORY.reduce((s, i) => s + i.count, 0) / 500 * 100)}%`} />
            <InventoryStat label="SLOTS USED" value={`${INVENTORY.length} / 20`} />
          </div>

          {/* Full inventory grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {INVENTORY.map((item) => (
              <div
                key={item.label}
                className="group relative flex flex-col items-center gap-2 border border-neutral-900 bg-black/50 p-4 transition-colors duration-200 hover:border-cyan-500/40 hover:bg-cyan-500/5 [clip-path:polygon(0_6px,6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%)]"
              >
                <div className="relative flex h-14 w-14 items-center justify-center border border-neutral-800 bg-neutral-950 transition-all duration-200 group-hover:border-cyan-500/40 group-hover:shadow-[0_0_16px_-6px_rgba(0,212,255,0.5)] [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]">
                  <item.icon className="h-6 w-6 text-neutral-500 transition-colors duration-200 group-hover:text-cyan-400" />
                </div>
                <span className="relative font-orbitron text-[10px] font-semibold tracking-wider text-neutral-300 group-hover:text-white text-center leading-tight">
                  {item.label}
                </span>
                <span className="relative font-mono text-[10px] tracking-wider text-cyan-400/70">
                  x{item.count}
                </span>
              </div>
            ))}
          </div>
        </HudPanel>
      </div>
    </div>
  )
}

function InventoryStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="border border-neutral-900 bg-black/40 px-3 py-2 [clip-path:polygon(0_4px,4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%)]"
    >
      <span className="font-orbitron text-[8px] tracking-widest text-neutral-600">{label}</span>
      <div className="mt-0.5 font-orbitron text-base font-bold text-cyan-400">{value}</div>
    </div>
  )
}

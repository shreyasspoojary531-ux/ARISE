import { SKILLS, MENTAL_DISCIPLINES, KNOWLEDGE_TREE_LEVEL, KNOWLEDGE_TREE_MAX, MENTAL_FORTITUDE_SCORE } from './mock-data'
import { HudPanel, PanelHeader, ProgressBar, SectionLabel } from './primitives'

/**
 * SkillsPageContent — Server Component (no client JS).
 * Renders instantly with a single CSS entrance instead of staggered
 * framer-motion reveals that delayed the page on navigation.
 */
export function SkillsPageContent() {
  return (
    <div className="scrollbar-hidden mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-4 sm:px-6 lg:h-full lg:overflow-y-auto">
      {/* Active Skills Grid */}
      <div className="animate-panel-rise">
        <HudPanel header="ACTIVE SKILLS" rightHeader={<SectionLabel>{SKILLS.length} UNLOCKED</SectionLabel>}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((skill) => (
              <div
                key={skill.name}
                className="group flex items-center gap-3 border border-neutral-900 bg-black/50 p-4 transition-colors duration-200 hover:border-cyan-500/30 clip-hud-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-neutral-800 bg-neutral-950 transition-colors duration-200 group-hover:border-cyan-500/40 clip-hud-4">
                  <skill.icon className="h-6 w-6 text-neutral-500 transition-colors group-hover:text-cyan-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate font-orbitron text-[11px] font-semibold tracking-widest text-neutral-200">
                      {skill.name}
                    </span>
                    <span className="font-orbitron text-sm font-bold text-cyan-400">LV.{skill.level}</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={skill.progress} height="h-1.5" />
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="font-mono text-[8px] tracking-wider text-neutral-700">PROFICIENCY</span>
                    <span className="font-mono text-[8px] tracking-wider text-neutral-500">{skill.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </HudPanel>
      </div>

      {/* Mental Discipline + Mental Fortitude row */}
      <div className="grid animate-panel-rise grid-cols-1 gap-4 lg:grid-cols-2" style={{ animationDelay: '80ms' }}>
        {/* Mental Discipline */}
        <HudPanel header="MENTAL DISCIPLINE" glow>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {MENTAL_DISCIPLINES.map((d) => (
                <div
                  key={d.label}
                  className="group flex flex-col items-center gap-1.5 border border-neutral-900 bg-black/50 p-3 transition-colors duration-200 hover:border-cyan-500/40 clip-hud-3"
                >
                  <d.icon className="h-5 w-5 text-neutral-500 transition-colors group-hover:text-cyan-400" />
                  <span className="text-center font-orbitron text-[8px] leading-tight tracking-wider text-neutral-500">
                    {d.label}
                  </span>
                  <span className="font-orbitron text-sm font-bold text-cyan-400">{d.level}</span>
                </div>
              ))}
            </div>

            {/* Knowledge Tree */}
            <div className="border-t border-neutral-900 pt-4">
              <div className="flex items-center justify-between">
                <SectionLabel className="text-cyan-400/80">KNOWLEDGE TREE</SectionLabel>
                <span className="font-orbitron text-[10px] font-bold text-cyan-400">
                  LV. {KNOWLEDGE_TREE_LEVEL} / {KNOWLEDGE_TREE_MAX}
                </span>
              </div>
              <div className="mt-2">
                <ProgressBar
                  value={KNOWLEDGE_TREE_LEVEL}
                  max={KNOWLEDGE_TREE_MAX}
                  height="h-2"
                  barClassName="shadow-[0_0_12px_#00d4ff]"
                />
              </div>
            </div>
          </div>
        </HudPanel>

        {/* Mental Fortitude — compact, no animation, matches the Discipline panel height */}
        <HudPanel header="MENTAL FORTITUDE" glow>
          <div className="flex h-full flex-col justify-center">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              {/* Score readout */}
              <div className="flex flex-col items-center">
                <span className="font-orbitron text-3xl font-black text-cyan-400 [text-shadow:0_0_18px_rgba(0,212,255,0.5)]">
                  {MENTAL_FORTITUDE_SCORE.toLocaleString()}
                </span>
                <span className="mt-1 font-orbitron text-[8px] tracking-[0.3em] text-neutral-600">
                  FORTITUDE
                </span>
              </div>

              {/* Divider — horizontal on mobile, vertical on desktop */}
              <span className="h-px w-2/3 bg-neutral-800 sm:h-12 sm:w-px" />

              {/* Composite breakdown */}
              <div className="grid w-full grid-cols-2 gap-x-4 gap-y-1.5 sm:flex sm:flex-col">
                {MENTAL_DISCIPLINES.map((d) => (
                  <div key={d.label} className="flex items-center gap-2">
                    <d.icon className="h-3.5 w-3.5 text-cyan-500/60" />
                    <span className="flex-1 font-orbitron text-[8px] tracking-widest text-neutral-500 sm:w-24 sm:flex-none">
                      {d.label}
                    </span>
                    <span className="font-orbitron text-[11px] font-bold text-white">{d.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </HudPanel>
      </div>
    </div>
  )
}

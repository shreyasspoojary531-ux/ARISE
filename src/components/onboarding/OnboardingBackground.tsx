"use client";

import { memo } from "react";
import { motion } from "framer-motion";

// Pre-computed outside component for stable references (avoids SSR mismatch)
// Reduced from 18 to 10 particles — sufficient visual density
const PARTICLES = [
  { id: 0, left: "0%",  delay: 0,  duration: 8,  size: "w-1 h-1" },
  { id: 1, left: "17%", delay: 0.7, duration: 9,  size: "w-0.5 h-0.5" },
  { id: 2, left: "34%", delay: 1.4, duration: 10, size: "w-1 h-1" },
  { id: 3, left: "51%", delay: 2.1, duration: 11, size: "w-0.5 h-0.5" },
  { id: 4, left: "68%", delay: 2.8, duration: 12, size: "w-1 h-1" },
  { id: 5, left: "85%", delay: 3.5, duration: 9,  size: "w-0.5 h-0.5" },
  { id: 6, left: "8%",  delay: 4.2, duration: 11, size: "w-0.5 h-0.5" },
  { id: 7, left: "42%", delay: 4.9, duration: 10, size: "w-1 h-1" },
  { id: 8, left: "76%", delay: 5.6, duration: 8,  size: "w-0.5 h-0.5" },
  { id: 9, left: "25%", delay: 6.3, duration: 12, size: "w-1 h-1" },
] as const;

// Memoized particle component
const ObParticle = memo(function ObParticle({
  left, delay, duration, size,
}: {
  left: string; delay: number; duration: number; size: string;
}) {
  return (
    <motion.span
      className={`absolute ${size} bg-cyan-400/60 shadow-[0_0_12px_rgba(0,212,255,0.7)] will-change-transform`}
      style={{ left, top: "105%" }}
      animate={{ y: [0, -900], opacity: [0, 0.8, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
});

export function OnboardingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_45%,#000_65%,transparent_100%)] opacity-70" />
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.12)_0%,rgba(0,212,255,0.03)_35%,transparent_70%)]" />
      <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/10 bg-cyan-500/5 blur-3xl" />

      {PARTICLES.map((particle) => (
        <ObParticle
          key={particle.id}
          left={particle.left}
          delay={particle.delay}
          duration={particle.duration}
          size={particle.size}
        />
      ))}

      <motion.div
        className="absolute left-1/2 top-1/2 h-px w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent will-change-transform"
        animate={{ opacity: [0.25, 0.8, 0.25], scaleX: [0.75, 1.15, 0.75] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

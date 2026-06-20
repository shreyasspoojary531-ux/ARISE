"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

const cardVariants = {
  initial: { opacity: 0, y: 28, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -20, filter: "blur(10px)" },
};

export function OnboardingCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[520px] border border-cyan-500/20 bg-neutral-950/65 p-5 backdrop-blur-xl shadow-[0_0_60px_rgba(0,212,255,0.08)] sm:p-7 md:p-9 [clip-path:polygon(0_12px,12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%)]"
    >
      <span className="absolute top-0 left-0 h-[1px] w-8 bg-cyan-500/70" />
      <span className="absolute top-0 left-0 h-8 w-[1px] bg-cyan-500/70" />
      <span className="absolute bottom-0 right-0 h-[1px] w-8 bg-cyan-500/70" />
      <span className="absolute bottom-0 right-0 h-8 w-[1px] bg-cyan-500/70" />
      <span className="absolute top-0 right-0 h-[1px] w-6 bg-neutral-700/60" />
      <span className="absolute top-0 right-0 h-6 w-[1px] bg-neutral-700/60" />
      <span className="absolute bottom-0 left-0 h-[1px] w-6 bg-neutral-700/60" />
      <span className="absolute bottom-0 left-0 h-6 w-[1px] bg-neutral-700/60" />

      <div className="hud-scanline pointer-events-none absolute inset-0" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

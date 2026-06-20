"use client";

import type { ReactNode } from "react";
import { OnboardingBackground } from "./OnboardingBackground";
import { OnboardingCard } from "./OnboardingCard";
import { StepProgress } from "./StepProgress";

interface OnboardingLayoutProps {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function OnboardingLayout({ step, title, subtitle, children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-black overflow-hidden p-6 sm:p-10">
      {/* Full-screen background */}
      <OnboardingBackground />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <OnboardingCard>
          {/* Step progress */}
          <StepProgress currentStep={step} />

          {/* Card header */}
          <div className="mb-6">
            <h2 className="font-orbitron text-xl sm:text-2xl font-bold tracking-wider text-white uppercase leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="font-sans text-sm text-neutral-500 mt-1">{subtitle}</p>
            )}
            <div className="mt-3 h-px w-full bg-gradient-to-r from-cyan-500/20 via-neutral-800 to-transparent" />
          </div>

          {children}
        </OnboardingCard>

        {/* HUD footer */}
        <p className="mt-8 font-mono text-[8px] text-neutral-800 tracking-wider uppercase">
          ARISE.SYS // ONBOARDING_MODULE
        </p>
      </div>
    </div>
  );
}

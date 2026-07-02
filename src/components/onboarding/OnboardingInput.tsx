"use client";

// Re-export HudInput as OnboardingInput for backward compatibility.
// The onboarding forms use the exact same HUD input pattern.
// ponytail: re-export instead of duplicate — same visual output
export { HudInput as OnboardingInput } from "@/components/ui/hud-input";

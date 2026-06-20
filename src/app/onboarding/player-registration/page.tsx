"use client";

import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { PlayerRegistrationForm } from "@/components/onboarding/PlayerRegistrationForm";

export default function PlayerRegistrationPage() {
  return (
    <OnboardingLayout
      step={2}
      title="Player Registration"
      subtitle="Initialize your profile."
    >
      <PlayerRegistrationForm />
    </OnboardingLayout>
  );
}

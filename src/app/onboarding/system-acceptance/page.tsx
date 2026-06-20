"use client";

import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { SystemAcceptanceForm } from "@/components/onboarding/SystemAcceptanceForm";

export default function SystemAcceptancePage() {
  return (
    <OnboardingLayout
      step={1}
      title="System Invitation"
      subtitle="The system has chosen you."
    >
      <SystemAcceptanceForm />
    </OnboardingLayout>
  );
}

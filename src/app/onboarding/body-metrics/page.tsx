"use client";

import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { BodyMetricsForm } from "@/components/onboarding/BodyMetricsForm";

export default function BodyMetricsPage() {
  return (
    <OnboardingLayout
      step={3}
      title="Body Analysis"
      subtitle="Complete your initialization."
    >
      <BodyMetricsForm />
    </OnboardingLayout>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getNextOnboardingStep, getOnboardingState, isOnboardingComplete } from "@/lib/onboarding";

export const dynamic = "force-dynamic";

export default async function OnboardingRootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const state = await getOnboardingState(supabase);

  if (isOnboardingComplete(state)) {
    redirect("/dashboard");
  }

  redirect(getNextOnboardingStep(state));
}

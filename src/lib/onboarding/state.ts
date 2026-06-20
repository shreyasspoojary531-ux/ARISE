import type { SupabaseClient } from "@supabase/supabase-js";

export type OnboardingStep =
  | "system-acceptance"
  | "player-registration"
  | "body-metrics";

export type OnboardingState = {
  acceptedSystem: boolean;
  profileComplete: boolean;
  currentStep: OnboardingStep;
  profile: {
    name: string | null;
    age: number | null;
    goal: string | null;
    height: number | null;
    weight: number | null;
  } | null;
};

interface ProfileData {
  name: string | null;
  age: number | null;
  goal: string | null;
  height: number | null;
  weight: number | null;
}

function normalizeProfile(profile: unknown): ProfileData | null {
  if (!profile) return null;

  return {
    name: profile.name ?? null,
    age: profile.age ?? null,
    goal: profile.goal ?? null,
    height: profile.height ?? null,
    weight: profile.weight ?? null,
  };
}

export async function getOnboardingState(
  supabase: SupabaseClient
): Promise<OnboardingState> {
  const [{ data: contract }, { data: profile }] = await Promise.all([
    supabase
      .from("onboarding_contracts")
      .select("accepted")
      .maybeSingle(),
    supabase
      .from("player_profiles")
      .select("name, age, goal, height, weight")
      .maybeSingle(),
  ]);

  const acceptedSystem = Boolean(contract?.accepted);
  const normalizedProfile = normalizeProfile(profile);
  const profileComplete = Boolean(
    normalizedProfile &&
      normalizedProfile.name &&
      normalizedProfile.age &&
      normalizedProfile.goal &&
      normalizedProfile.height &&
      normalizedProfile.weight
  );

  let currentStep: OnboardingStep = "system-acceptance";
  if (acceptedSystem && !profileComplete) {
    currentStep = "player-registration";
  }
  if (acceptedSystem && normalizedProfile?.name && normalizedProfile.goal && !profileComplete) {
    currentStep = "body-metrics";
  }
  if (acceptedSystem && profileComplete) {
    currentStep = "body-metrics";
  }

  return {
    acceptedSystem,
    profileComplete,
    currentStep,
    profile: normalizedProfile,
  };
}

export function getNextOnboardingStep(state: OnboardingState): string {
  if (!state.acceptedSystem) return "/onboarding/system-acceptance";
  if (!state.profileComplete) {
    return state.currentStep === "body-metrics"
      ? "/onboarding/body-metrics"
      : "/onboarding/player-registration";
  }

  return "/dashboard";
}

export function isOnboardingComplete(state: OnboardingState) {
  return state.acceptedSystem && state.profileComplete;
}

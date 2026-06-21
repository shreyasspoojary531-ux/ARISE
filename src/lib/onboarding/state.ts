import type { SupabaseClient } from "@supabase/supabase-js";

export type OnboardingStep =
  | "system-acceptance"
  | "player-registration"
  | "body-metrics"
  | "done";

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
  if (!profile || typeof profile !== "object") return null;
  const p = profile as Record<string, unknown>;

  return {
    name: typeof p.name === "string" ? p.name : null,
    age: typeof p.age === "number" ? p.age : null,
    goal: typeof p.goal === "string" ? p.goal : null,
    height: typeof p.height === "number" ? p.height : null,
    weight: typeof p.weight === "number" ? p.weight : null,
  };
}

export async function getOnboardingState(
  supabase: SupabaseClient
): Promise<OnboardingState> {
  // Parallel queries — both hit the DB concurrently
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

  // Determine current step in sequential order:
  // 1. System acceptance must come first
  // 2. Player registration (name, age, goal)
  // 3. Body metrics (height, weight)
  // 4. Done — all complete
  let currentStep: OnboardingStep = "system-acceptance";
  if (acceptedSystem && profileComplete) {
    currentStep = "done";
  } else if (acceptedSystem && normalizedProfile?.name && normalizedProfile.goal) {
    currentStep = "body-metrics";
  } else if (acceptedSystem) {
    currentStep = "player-registration";
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
  if (state.currentStep === "done" || state.profileComplete) return "/dashboard";
  if (state.currentStep === "body-metrics") return "/onboarding/body-metrics";
  return "/onboarding/player-registration";
}

export function isOnboardingComplete(state: OnboardingState) {
  return state.acceptedSystem && state.profileComplete;
}

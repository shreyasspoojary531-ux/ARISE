"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

// ---------------------------------------------------------------------------
// Onboarding cache cookie — must match proxy.ts
// ---------------------------------------------------------------------------
const ONBOARDING_COOKIE = "arise_ob_state";

async function clearOnboardingCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(ONBOARDING_COOKIE, "", { maxAge: 0, path: "/" });
  } catch {
    // Server action may not have access to cookie store — safe to ignore.
    // The 120s TTL on the cache cookie ensures it refreshes quickly anyway.
  }
}

// ---------------------------------------------------------------------------
// Email + Password Auth
// ---------------------------------------------------------------------------

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // One round-trip only — redirect straight to /dashboard.
  // Middleware (proxy.ts) guards /dashboard and redirects
  // unfinished-onboarders to the correct onboarding step.
  revalidatePath("/onboarding", "page");
  revalidatePath("/dashboard", "page");
  redirect("/dashboard");
}

// ---------------------------------------------------------------------------
// Signup — email confirmation is DISABLED, so signUp returns an active
// session immediately. New users always go to onboarding step 1.
// ---------------------------------------------------------------------------

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, display_name: name },
    },
  });

  if (error) {
    return { error: error.message };
  }

  const user = data.user;
  const session = data.session;

  // Supabase returns user=null when the email already exists (no error thrown)
  if (!user) {
    return { error: "This email is already registered. Try signing in instead." };
  }

  // Empty identities array = duplicate registration attempt
  if (user.identities && user.identities.length === 0) {
    return { error: "This email is already registered. Try signing in instead." };
  }

  // New user → always go to onboarding
  if (session) {
    revalidatePath("/onboarding", "page");
    revalidatePath("/dashboard", "page");
    redirect("/onboarding/system-acceptance");
  }

  // Fallback: if for some reason session isn't returned, try to sign in
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

  if (loginError) {
    return { success: true, redirectTo: "/login", message: "Account created. Please sign in." };
  }

  // Signed in — redirect to /dashboard. Middleware handles onboarding check.
  revalidatePath("/onboarding", "page");
  revalidatePath("/dashboard", "page");
  redirect("/dashboard");
}

// ---------------------------------------------------------------------------
// Onboarding
// ---------------------------------------------------------------------------

export async function acceptSystemContract() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("onboarding_contracts").upsert(
    {
      user_id: user.id,
      accepted: true,
      accepted_at: new Date().toISOString(),
      declined_at: null,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return { error: error.message };
  }

  clearOnboardingCookie();
  revalidatePath("/onboarding", "page");
  redirect("/onboarding/player-registration");
}

export async function declineSystemContract() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("onboarding_contracts").upsert(
      {
        user_id: user.id,
        accepted: false,
        accepted_at: null,
        declined_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  }

  await supabase.auth.signOut();
  clearOnboardingCookie();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function submitPlayerRegistration(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = (formData.get("name") as string)?.trim();
  const age = Number(formData.get("age"));
  const goal = (formData.get("goal") as string)?.trim();

  if (!name || !age || !goal) {
    return { error: "Full name, age, and primary goal are required." };
  }

  if (!Number.isInteger(age) || age < 13 || age > 120) {
    return { error: "Enter a valid age between 13 and 120." };
  }

  const { error } = await supabase.from("player_profiles").upsert(
    {
      user_id: user.id,
      name,
      age,
      goal,
      height: null,
      weight: null,
      completed_at: null,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return { error: error.message };
  }

  clearOnboardingCookie();
  revalidatePath("/onboarding", "page");
  redirect("/onboarding/body-metrics");
}

/**
 * Submit body metrics.
 *
 * Uses an update-only query to avoid the extra SELECT round-trip.
 * Only modifies the height, weight, and completed_at columns,
 * leaving the other columns untouched.
 */
export async function submitBodyMetrics(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const height = Number(formData.get("height"));
  const weight = Number(formData.get("weight"));

  if (!height || !weight) {
    return { error: "Height and weight are required." };
  }

  if (!Number.isFinite(height) || height <= 0 || height > 300) {
    return { error: "Enter a valid height between 1 and 300 cm." };
  }

  if (!Number.isFinite(weight) || weight <= 0 || weight > 500) {
    return { error: "Enter a valid weight between 1 and 500 kg." };
  }

  // Use UPDATE instead of SELECT + UPSERT — avoids an extra DB round-trip.
  const { error, count } = await supabase
    .from("player_profiles")
    .update({
      height,
      weight,
      completed_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  // If no rows were updated, the player hasn't completed registration yet
  if (count === 0) {
    return { error: "Complete player registration before body analysis." };
  }

  clearOnboardingCookie();
  revalidatePath("/onboarding", "page");
  revalidatePath("/dashboard", "page");
  redirect("/dashboard");
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  clearOnboardingCookie();
  revalidatePath("/onboarding", "page");
  revalidatePath("/dashboard", "page");
  redirect("/login");
}

// ---------------------------------------------------------------------------
// Password Reset
// ---------------------------------------------------------------------------

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    return { error: "Email is required." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Password reset link sent. Check your email." };
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Password is required." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/onboarding", "page");
  revalidatePath("/dashboard", "page");
  return { success: true };
}

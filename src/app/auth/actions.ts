"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const REDIRECT_TO = "/onboarding";

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

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[Auth] login failed:", error.message);
    return { error: error.message };
  }

  console.log("[Auth] login successful. User:", data.user?.id);
  revalidatePath("/", "layout");
  return { success: true, redirectTo: REDIRECT_TO };
}

// ---------------------------------------------------------------------------
// Signup — email confirmation is DISABLED, so signUp returns an active
// session immediately. We auto-login and redirect.
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
    console.error("[Auth] signup failed:", error.message);
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

  // Email confirmation disabled — session should be active immediately
  if (session) {
    console.log("[Auth] signup + auto-login. User:", user.id);
    revalidatePath("/", "layout");
    return { success: true, redirectTo: REDIRECT_TO };
  }

  // Fallback: if for some reason session isn't returned, try to sign in
  console.warn("[Auth] signup succeeded but no session — attempting signInWithPassword");
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

  if (loginError) {
    return { success: true, redirectTo: "/login", message: "Account created. Please sign in." };
  }

  console.log("[Auth] signup + manual login. User:", loginData.user?.id);
  revalidatePath("/", "layout");
  return { success: true, redirectTo: REDIRECT_TO };
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
    console.error("[Onboarding] acceptance failed:", error.message);
    return { error: error.message };
  }

  revalidatePath("/onboarding", "page");
  return { success: true };
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
    console.error("[Onboarding] player registration failed:", error.message);
    return { error: error.message };
  }

  revalidatePath("/onboarding", "page");
  return { success: true };
}

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

  const { data: existingProfile } = await supabase
    .from("player_profiles")
    .select("name, age, goal")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    return { error: "Complete player registration before body analysis." };
  }

  const { error } = await supabase.from("player_profiles").upsert(
    {
      user_id: user.id,
      name: existingProfile.name,
      age: existingProfile.age,
      goal: existingProfile.goal,
      height,
      weight,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("[Onboarding] body metrics failed:", error.message);
    return { error: error.message };
  }

  revalidatePath("/onboarding", "page");
  revalidatePath("/dashboard", "page");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
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

  revalidatePath("/", "layout");
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ---------------------------------------------------------------------------
// Email + Password Auth
// ---------------------------------------------------------------------------

export async function login(formData: FormData) {
  console.log("[Auth Action] login: Initiated");
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    console.warn("[Auth Action] login: Missing email or password");
    return { error: "Email and password are required." };
  }

  console.log(`[Auth Action] login: Attempting signInWithPassword for ${email}`);
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[Auth Action] login: signInWithPassword failed:", error.message);
    return { error: error.message };
  }

  console.log("[Auth Action] login: signInWithPassword successful");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(formData: FormData) {
  console.log("[Auth Action] signup: Initiated");
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    console.warn("[Auth Action] signup: Missing fields");
    return { error: "All fields are required." };
  }

  console.log(`[Auth Action] signup: Attempting signUp for ${email} (${name})`);
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, display_name: name },
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("[Auth Action] signup: signUp failed:", error.message);
    return { error: error.message };
  }

  console.log("[Auth Action] signup: signUp successful. Awaiting verification.");
  return {
    success: true,
    message:
      "Account created! Check your email to confirm your hunter profile.",
  };
}

export async function logout() {
  console.log("[Auth Action] logout: Initiated");
  const supabase = await createClient();
  await supabase.auth.signOut();
  console.log("[Auth Action] logout: Signed out from Supabase");
  revalidatePath("/", "layout");
  redirect("/login");
}

// ---------------------------------------------------------------------------
// Password Reset
// ---------------------------------------------------------------------------

export async function forgotPassword(formData: FormData) {
  console.log("[Auth Action] forgotPassword: Initiated");
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();

  if (!email) {
    console.warn("[Auth Action] forgotPassword: Missing email");
    return { error: "Email is required." };
  }

  console.log(`[Auth Action] forgotPassword: Resetting password for ${email}`);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    console.error("[Auth Action] forgotPassword: resetPasswordForEmail failed:", error.message);
    return { error: error.message };
  }

  console.log("[Auth Action] forgotPassword: Reset email successfully sent");
  return {
    success: true,
    message: "Password reset link sent. Check your email.",
  };
}

export async function resetPassword(formData: FormData) {
  console.log("[Auth Action] resetPassword: Initiated");
  const supabase = await createClient();

  const password = formData.get("password") as string;

  if (!password) {
    console.warn("[Auth Action] resetPassword: Missing password");
    return { error: "Password is required." };
  }

  console.log("[Auth Action] resetPassword: Updating user password");
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("[Auth Action] resetPassword: updateUser failed:", error.message);
    return { error: error.message };
  }

  console.log("[Auth Action] resetPassword: Password updated successfully");
  revalidatePath("/", "layout");
  return { success: true };
}

// ---------------------------------------------------------------------------
// OAuth
// ---------------------------------------------------------------------------

export async function signInWithGoogle() {
  console.log("[Auth Action] signInWithGoogle: Initiated");
  const supabase = await createClient();

  console.log("[Auth Action] signInWithGoogle: Creating OAuth session request");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${SITE_URL}/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error) {
    console.error("[Auth Action] signInWithGoogle: signInWithOAuth failed:", error.message);
    return { error: error.message };
  }

  if (data.url) {
    console.log("[Auth Action] signInWithGoogle: OAuth URL generated successfully:", data.url);
    return { success: true, url: data.url };
  }

  console.error("[Auth Action] signInWithGoogle: No redirect URL returned by Supabase");
  return { error: "Could not generate authorization URL." };
}

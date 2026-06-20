import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_ROUTES = ["/dashboard", "/inside-system", "/onboarding"];
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not add any logic between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isOnboardingRoute = pathname === "/onboarding" || pathname.startsWith("/onboarding/");

  // Unauthenticated users → login
  if (!user && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Authenticated users on auth pages → check onboarding state
  if (user && isAuthRoute) {
    // Fetch onboarding state to determine correct redirect
    const { data: contract } = await supabase
      .from("onboarding_contracts")
      .select("accepted")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: profile } = await supabase
      .from("player_profiles")
      .select("name, age, goal, height, weight")
      .eq("user_id", user.id)
      .maybeSingle();

    const acceptedSystem = Boolean(contract?.accepted);
    const profileComplete = Boolean(
      profile &&
        profile.name &&
        profile.age &&
        profile.goal &&
        profile.height &&
        profile.weight
    );

    let redirectTarget: string;

    if (!acceptedSystem) {
      redirectTarget = "/onboarding/system-acceptance";
    } else if (!profileComplete) {
      redirectTarget = profile?.name && profile?.goal
        ? "/onboarding/body-metrics"
        : "/onboarding/player-registration";
    } else {
      redirectTarget = "/dashboard";
    }

    const redirectResponse = NextResponse.redirect(
      new URL(redirectTarget, request.url)
    );
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Authenticated users on onboarding routes → prevent step-skipping
  if (user && isOnboardingRoute) {
    const { data: contract } = await supabase
      .from("onboarding_contracts")
      .select("accepted")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: profile } = await supabase
      .from("player_profiles")
      .select("name, age, goal, height, weight")
      .eq("user_id", user.id)
      .maybeSingle();

    const acceptedSystem = Boolean(contract?.accepted);
    const profileComplete = Boolean(
      profile &&
        profile.name &&
        profile.age &&
        profile.goal &&
        profile.height &&
        profile.weight
    );

    // Onboarding complete → redirect to dashboard
    if (acceptedSystem && profileComplete) {
      const redirectResponse = NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }

    // Prevent skipping steps: if not accepted, only allow step 1
    if (!acceptedSystem && !pathname.endsWith("/system-acceptance")) {
      const redirectResponse = NextResponse.redirect(
        new URL("/onboarding/system-acceptance", request.url)
      );
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }

    // Prevent jumping to body-metrics if registration not complete
    if (
      acceptedSystem &&
      (pathname.endsWith("/body-metrics") || pathname.endsWith("/player-registration")) &&
      pathname.endsWith("/body-metrics")
    ) {
      if (!profile?.name || !profile?.goal) {
        const redirectResponse = NextResponse.redirect(
          new URL("/onboarding/player-registration", request.url)
        );
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie.name, cookie.value);
        });
        return redirectResponse;
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

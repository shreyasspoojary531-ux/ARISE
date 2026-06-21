import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_ROUTES = ["/dashboard", "/inside-system", "/onboarding"];
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

/**
 * Onboarding state cached in a short-lived cookie to avoid hitting
 * the database on every middleware invocation. The cookie stores a
 * JSON snapshot of the user's onboarding progress.
 *
 * Cookie value format: { accepted: boolean, profileStep: "reg"|"body"|"done" }
 * - accepted:false → contract not accepted
 * - accepted:true  + profileStep:"reg"   → need player-registration
 * - accepted:true  + profileStep:"body"  → need body-metrics
 * - accepted:true  + profileStep:"done"  → onboarding complete
 */
const ONBOARDING_COOKIE = "arise_ob_state";
const ONBOARDING_COOKIE_TTL = 120; // seconds — short-lived to stay fresh

interface OnboardingCache {
  accepted: boolean;
  profileStep: "reg" | "body" | "done";
}

function parseCache(raw: string | undefined): OnboardingCache | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingCache;
  } catch {
    return null;
  }
}

function buildRedirect(request: NextRequest, supabaseResponse: NextResponse, target: string) {
  const redirectResponse = NextResponse.redirect(new URL(target, request.url));
  // Forward Supabase session cookies to the redirect response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value);
  });
  return redirectResponse;
}

function setCacheCookie(response: NextResponse, cache: OnboardingCache) {
  response.cookies.set(ONBOARDING_COOKIE, JSON.stringify(cache), {
    maxAge: ONBOARDING_COOKIE_TTL,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
}

function clearCacheCookie(response: NextResponse) {
  response.cookies.set(ONBOARDING_COOKIE, "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
}

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

  // ── Unauthenticated users → login ─────────────────────────────────────
  if (!user && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // ── Fast path: if user is authenticated and hitting a route that
  //    doesn't require onboarding checks, skip DB queries entirely. ────
  if (user && !isAuthRoute && !isOnboardingRoute) {
    return supabaseResponse;
  }

  // ── Authenticated users on auth/onboarding pages ──────────────────────
  // Try cookie cache first to avoid DB roundtrips
  let cache = parseCache(request.cookies.get(ONBOARDING_COOKIE)?.value);

  // Cache miss → fetch onboarding state from DB (parallel queries)
  if (!cache && user) {
    const [{ data: contract }, { data: profile }] = await Promise.all([
      supabase
        .from("onboarding_contracts")
        .select("accepted")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("player_profiles")
        .select("name, goal, height, weight")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    const accepted = Boolean(contract?.accepted);
    const hasNameGoal = Boolean(profile?.name && profile?.goal);
    const hasAllMetrics = Boolean(
      profile?.name && profile?.goal && profile?.height && profile?.weight
    );

    let profileStep: OnboardingCache["profileStep"] = "reg";
    if (hasAllMetrics) profileStep = "done";
    else if (hasNameGoal) profileStep = "body";

    cache = { accepted, profileStep };
  }

  if (!cache) {
    return supabaseResponse;
  }

  // Determine redirect target from cache
  function getRedirectTarget(): string {
    if (!cache!.accepted) return "/onboarding/system-acceptance";
    if (cache!.profileStep === "done") return "/dashboard";
    if (cache!.profileStep === "body") return "/onboarding/body-metrics";
    return "/onboarding/player-registration";
  }

  // ── Authenticated users on auth pages → redirect to correct dest ─────
  if (user && isAuthRoute) {
    const target = getRedirectTarget();
    const response = buildRedirect(request, supabaseResponse, target);
    setCacheCookie(response, cache);
    return response;
  }

  // ── Authenticated users on onboarding routes ─────────────────────────
  if (user && isOnboardingRoute) {
    // Onboarding complete → redirect to dashboard
    if (cache.accepted && cache.profileStep === "done") {
      const response = buildRedirect(request, supabaseResponse, "/dashboard");
      setCacheCookie(response, cache);
      return response;
    }

    // Prevent skipping: not accepted → must be on step 1
    if (!cache.accepted && !pathname.endsWith("/system-acceptance")) {
      const response = buildRedirect(request, supabaseResponse, "/onboarding/system-acceptance");
      setCacheCookie(response, cache);
      return response;
    }

    // Prevent jumping to body-metrics if registration not complete
    if (
      cache.accepted &&
      pathname.endsWith("/body-metrics") &&
      cache.profileStep === "reg"
    ) {
      const response = buildRedirect(request, supabaseResponse, "/onboarding/player-registration");
      setCacheCookie(response, cache);
      return response;
    }

    // Set cache on normal pass-through too for subsequent requests
    setCacheCookie(supabaseResponse, cache);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

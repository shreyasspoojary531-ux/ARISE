import type { NextConfig } from "next";

const supabaseProjectRef =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^https?:\/\//, "").split(".")[0] ?? "";

const nextConfig: NextConfig = {
  // ── Image optimization ──────────────────────────────────────────────────
  // Remote `next/image` hosts are allow-listed explicitly. A wildcard ("**")
  // would let any URL be proxied through the image optimizer — an open
  // resize-DoS vector under load. Only the hosts we actually serve avatars
  // from are permitted: the project's own Supabase Storage bucket + the
  // common OAuth identity-provider avatar CDNs.
  images: {
    remotePatterns: [
      // Supabase Storage (project bucket + legacy *.supabase.co domains)
      ...(supabaseProjectRef
        ? [
            { protocol: "https" as const, hostname: `${supabaseProjectRef}.supabase.co` },
            { protocol: "https" as const, hostname: `${supabaseProjectRef}.supabase.in` },
          ]
        : []),
      // OAuth provider avatars
      { protocol: "https", hostname: "lh3.googleusercontent.com" },   // Google
      { protocol: "https", hostname: "avatars.githubusercontent.com" }, // GitHub
      { protocol: "https", hostname: "graph.facebook.com" },           // Facebook
      { protocol: "https", hostname: "graph.microsoft.com" },          // Microsoft
      { protocol: "https", hostname: "appleid.apple.com" },            // Apple
      { protocol: "https", hostname: "platform-lookaside.fbsbx.com" }, // Facebook legacy
    ],
  },

  // ── Security headers ───────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

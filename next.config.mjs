// Security headers for every response.
//
// The Content-Security-Policy keeps everything on this origin: no third-party script, style,
// font, image or request. 'unsafe-inline' stays for scripts and styles because Next.js writes
// inline bootstrap scripts into statically generated pages (a nonce would force every page to
// render on the server) and the page uses inline style attributes. It is sent in production
// only: the development server needs eval and a websocket.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: csp }] : []),
];

// The 3D model, posters, project pictures and clips rarely change: browsers keep them for 30 days
// instead of asking again on every visit. They are not content-hashed, so a file that changes
// should get a new name. The résumé PDF is left out on purpose: it is replaced often.
const MONTH = 60 * 60 * 24 * 30;
const longCache = [{ key: "Cache-Control", value: `public, max-age=${MONTH}` }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  // Resized pictures from the image optimizer are kept for the same 30 days.
  images: { minimumCacheTTL: MONTH },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/office/:file*", headers: longCache },
      { source: "/clips/:file*", headers: longCache },
      { source: "/projetos/:file(.+\\.webp)", headers: longCache },
    ];
  },
};

export default nextConfig;

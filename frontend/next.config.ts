import type { NextConfig } from "next"

// Where Django runs. In dev that's localhost:8000 (see CLAUDE.md).
const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:8000"

const nextConfig: NextConfig = {
  // `next build` also writes .next/standalone: a small server.js plus only the
  // node_modules files the app really uses. The Docker image ships just that
  // (about a tenth of the full node_modules). `npm run dev` ignores this.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // For pages with [brackets], the dev server starts a helper to work out
    // which addresses exist. By default that helper is a whole new Node
    // process, which fails when the laptop is low on memory ("Jest worker
    // encountered 2 child process exceptions"). A worker THREAD lives inside
    // the existing process and costs far less memory.
    workerThreads: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // The browser only ever talks to Next.js (localhost:3000). Requests to
  // /api/... are forwarded to Django behind the scenes. Because the browser
  // sees ONE origin, session cookies + CSRF just work and we need no CORS.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` }]
  },
}

export default nextConfig

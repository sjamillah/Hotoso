# Hotoso frontend: a production build of the Next.js app in a container.
#
# A "multi-stage" build: three temporary stages do the heavy work, and only
# the last one ("runner") becomes the image you run. Build tools, the full
# node_modules and the source code never reach the final image.
#
#   deps    → install every package (exactly as package-lock.json says)
#   builder → compile the app (npm run build → .next/standalone)
#   runner  → copy in ONLY the compiled output and run it as a normal user
#
# Build and run it with docker compose from the project root (see
# docker-compose.yml), not by hand.

# Same Node version as on this laptop, so "works here" means "works there".
# "slim" = Debian with fewer extras: a smaller image with less to attack.
ARG NODE_VERSION=24.16.0
FROM node:${NODE_VERSION}-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------------------------------------------------------------- 1. deps
FROM base AS deps
# Copy ONLY the package files first. Docker caches each step, so as long as
# these two files don't change, the slow install below is reused next build.
COPY package.json package-lock.json ./
# `npm ci` installs exactly what the lockfile says (never "newer" versions)
# and fails if the lockfile and package.json disagree.
RUN npm ci

# ---------------------------------------------------------------- 2. builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# next.config.ts is read at BUILD time, so these are build arguments.
#   API_ORIGIN: where Next.js forwards /api/... (the Django container, from M0)
#   NEXT_PUBLIC_SITE_URL: the site's own address, used in share previews.
#     NEXT_PUBLIC_ values are baked into the browser code: never put a
#     secret in one. (The Paystack secret key never comes near the frontend.)
ARG API_ORIGIN=http://backend:8000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV API_ORIGIN=${API_ORIGIN} NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
RUN npm run build

# ---------------------------------------------------------------- 3. runner
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# HOSTNAME=0.0.0.0 means "answer on every network inside the container".
# The default (localhost) would only answer from inside the container itself,
# so Docker couldn't pass your browser's requests in.

# The compiled app, owned by the built-in unprivileged "node" user.
# standalone/ has server.js + the few node_modules it needs; static files and
# public/ aren't included by Next.js, so they're copied in next to it.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Never run as root: if someone ever broke into the app, they'd only get the
# powers of this ordinary user, not the whole container.
USER node
EXPOSE 3000

# Docker asks this every 30s; after 3 failures the container is "unhealthy".
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]

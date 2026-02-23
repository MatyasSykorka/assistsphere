# syntax=docker/dockerfile:1

# Multi-stage build pro Next.js + Prisma aplikaci.
# Používá Bun (shodné s lokálním vývojem v projektu).

FROM oven/bun:1.1.38-alpine AS deps
WORKDIR /app

# Nejdřív jen manifest, aby šel využít cache.
COPY package.json ./

# V repu není lockfile – bun vygeneruje bun.lockb při instalaci.
# Prisma padá na preinstall v Bun, proto vypneme scripts a Prisma spustíme přes Node později.
RUN bun install --ignore-scripts


FROM deps AS build
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY next.config.ts ./next.config.ts
COPY tsconfig.json ./tsconfig.json
# COPY next-env.d.ts ./next-env.d.ts
COPY eslint.config.mjs ./eslint.config.mjs
COPY src ./src
COPY public ./public

# Prisma Client
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public" bunx prisma generate

# Build Next.js
RUN bun run build


FROM oven/bun:1.1.38-alpine AS runner
WORKDIR /app


ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Runtime soubory
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Prisma schema + migrace pro `prisma migrate deploy`
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000

# Migrace se typicky spouští v docker-compose command (kvůli DB dostupnosti).
CMD ["bun", "run", "start"]

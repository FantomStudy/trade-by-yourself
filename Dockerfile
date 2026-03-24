FROM oven/bun:1.3 AS base

WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --no-save --frozen-file

FROM base AS builder 
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER bun

EXPOSE 3000

CMD ["bun", "./server.js"]
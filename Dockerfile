# syntax=docker/dockerfile:1
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy manifest files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY artifacts/takeda-corretora/package.json ./artifacts/takeda-corretora/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY lib/ ./lib/
COPY tsconfig*.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application source
COPY artifacts/ ./artifacts/
COPY scripts/ ./scripts/

# Build client and server bundles
RUN pnpm run build

# Stage 2: Production runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install pnpm for runner
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml ./
COPY artifacts/takeda-corretora/package.json ./artifacts/takeda-corretora/
COPY artifacts/api-server/package.json ./artifacts/api-server/

# Copy built artifacts from builder stage
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/takeda-corretora/dist ./artifacts/takeda-corretora/dist

EXPOSE 3000

CMD ["node", "artifacts/api-server/dist/index.mjs"]

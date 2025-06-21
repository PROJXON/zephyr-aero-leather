FROM node:20-alpine AS base
WORKDIR /app

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

FROM base AS deps
COPY package.json package-lock.json ./
# Install all dependencies (including devDependencies) for build
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.local .env.local
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY .env.local .env.local

# Install only production dependencies for runtime
RUN npm ci --only=production --ignore-scripts

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
CMD ["npm", "start"]
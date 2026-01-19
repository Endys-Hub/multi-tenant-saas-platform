# ========================
# Build stage
# ========================
FROM node:20-bullseye AS builder

WORKDIR /app

# Install all dependencies (needed for build + prisma)
COPY package.json ./

# Increase npm reliability inside Docker
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set fetch-timeout 300000 \
 && npm config set registry https://registry.npmjs.org/

RUN npm install --no-audit --no-fund

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build


# ========================
# Runtime stage
# ========================
FROM node:20-bullseye

WORKDIR /app

# Copy only runtime artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "dist/server.js"]





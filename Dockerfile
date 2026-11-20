# Multi-stage production Dockerfile for CyberRakshak 3.0
# Stage 1: Build Frontend Client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Build Backend Server
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Stage 3: Lean Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy server production dependencies and built code
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev

COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/server/uploads ./uploads
COPY --from=client-builder /app/client/dist /app/client/dist

EXPOSE 5000

CMD ["node", "dist/index.js"]

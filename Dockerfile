# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# atau gunakan runtime env saat container jalan
RUN npm run build
RUN npm prune --production

# Stage 2: Production Run
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

# Expose port (default SvelteKit node adapter biasanya 3000)
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

# Jalankan aplikasi
CMD [ "node", "build" ]
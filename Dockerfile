# SnoYC Lead CRM - Production Dockerfile
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY server/ ./server/
COPY src/data/ ./src/data/
RUN mkdir -p /app/data

EXPOSE 5000

# Mount /app/data as persistent volume to keep SQLite database across container restarts
VOLUME ["/app/data"]

CMD ["node", "server/server.js"]

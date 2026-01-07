FROM node:20.18.1-slim AS builder
 
# Skip Chromium download only during build
ENV PUPPETEER_SKIP_DOWNLOAD=true
 
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
 
WORKDIR /app
 
COPY package*.json ./
 
RUN npm install --include=dev --prefer-offline --no-audit --fund=false
 
COPY . .
 
RUN npm run build
 
 
 
################################
# -------- Stage 2: Runtime ----
################################
FROM node:20.18.1-slim
 
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
 
WORKDIR /app
 
COPY package*.json ./
 
RUN npm install --omit=dev --prefer-offline --no-audit --fund=false
 
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/associationList.json ./
 
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
 
RUN chown -R node:node /app
USER node
 
EXPOSE 8000
 
CMD [ "npm", "start" ]

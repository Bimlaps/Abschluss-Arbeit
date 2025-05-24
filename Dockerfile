# Frontend Build Stage
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
COPY frontend/postcss.config.js ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Backend Stage
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production

# Kopiere Backend-Code
COPY backend/ ./

# Kopiere Frontend-Build vom Frontend-Builder
COPY --from=frontend-builder /app/frontend/build ./public

# Ports freigeben
EXPOSE 3000
EXPOSE 3001

# Start-Befehl
CMD ["npm", "start"] 
# ============================================
# Dockerfile — Frontend React/Vite (Eudora)
# Build multi-stage : Node pour build, Nginx pour servir
# ============================================

# --- Stage 1 : Build ---
FROM node:22-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY index.html ./
COPY vite.config.ts tsconfig.json ./
COPY src/ ./src/
COPY public/ ./public/

# Build de production
RUN npm run build


# --- Stage 2 : Servir avec Nginx ---
FROM nginx:alpine

# Copier le build dans Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier le favicon à la racine
COPY --from=build /app/public/favicon.png /usr/share/nginx/html/favicon.png

# Copier les images (y compris le logo)
COPY --from=build /app/dist/images /usr/share/nginx/html/images/

# Copier la config Nginx
COPY nginx/frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

#!/bin/bash
# ============================================
# 🚀 Script de déploiement — Eudora Conseil & Relooking
# ============================================
# Usage :
#   chmod +x deploy.sh
#   sudo ./deploy.sh
# ============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[✅]${NC} $1"; }
info() { echo -e "${BLUE}[ℹ️ ]${NC} $1"; }
warn() { echo -e "${YELLOW}[⚠️ ]${NC} $1"; }
error() { echo -e "${RED}[❌]${NC} $1"; exit 1; }

echo ""
echo "=========================================="
echo "  🚀 Déploiement Eudora Conseil & Relooking"
echo "=========================================="
echo ""

# ============================================
# ÉTAPE 1 : Vérifications préliminaires
# ============================================
info "Vérification de l'environnement..."

if [ "$EUID" -ne 0 ]; then
  error "Ce script doit être exécuté en tant que root (sudo ./deploy.sh)"
fi

# ============================================
# ÉTAPE 2 : Mise à jour du système
# ============================================
info "Mise à jour du système..."
apt update -y && apt upgrade -y
log "Système mis à jour"

# ============================================
# ÉTAPE 3 : Installation de Docker
# ============================================
if ! command -v docker &> /dev/null; then
  info "Installation de Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  log "Docker installé"
else
  log "Docker déjà installé ($(docker --version))"
fi

if ! docker compose version &> /dev/null; then
  info "Installation de Docker Compose plugin..."
  apt install -y docker-compose-plugin
  log "Docker Compose installé"
else
  log "Docker Compose déjà installé"
fi

# ============================================
# ÉTAPE 4 : Installation de Node.js
# ============================================
if ! command -v node &> /dev/null; then
  info "Installation de Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
  log "Node.js installé ($(node --version))"
else
  log "Node.js déjà installé ($(node --version))"
fi

# ============================================
# ÉTAPE 5 : Installation de Git
# ============================================
if ! command -v git &> /dev/null; then
  info "Installation de Git..."
  apt install -y git
  log "Git installé"
else
  log "Git déjà installé"
fi

# ============================================
# ÉTAPE 6 : Pare-feu (UFW)
# ============================================
info "Configuration du pare-feu..."
apt install -y ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
log "Pare-feu configuré (SSH + HTTP + HTTPS)"

# ============================================
# ÉTAPE 7 : Cloner ou mettre à jour le projet
# ============================================
PROJECT_DIR="/home/ecrelooking"

if [ -d "$PROJECT_DIR" ]; then
  info "Mise à jour du projet existant..."
  cd "$PROJECT_DIR"
  git pull origin main
  log "Projet mis à jour"
else
  info "Clonage du projet..."
  git clone https://github.com/Ernest1977/eudor.git "$PROJECT_DIR"
  cd "$PROJECT_DIR"
  log "Projet cloné dans $PROJECT_DIR"
fi

cd "$PROJECT_DIR"

# ============================================
# ÉTAPE 8 : Configuration du .env
# ============================================
if [ ! -f ".env" ]; then
  warn "Fichier .env non trouvé — création à partir du template..."
  cp .env.example .env

  # Générer des clés secrètes automatiquement
  SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
  JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
  DB_PASSWORD=$(python3 -c "import secrets; print(secrets.token_hex(16))")

  sed -i "s|CHANGEZ-MOI-avec-une-cle-aleatoire-de-64-caracteres|$SECRET_KEY|g" .env
  sed -i "s|CHANGEZ-MOI-avec-une-autre-cle-aleatoire|$JWT_SECRET|g" .env
  sed -i "s|CHANGEZ-MOI-mot-de-passe-fort|$DB_PASSWORD|g" .env

  warn "⚠️  IMPORTANT : Éditez le fichier .env pour configurer l'email SMTP !"
  warn "   nano $PROJECT_DIR/.env"
  echo ""
  info "Les clés secrètes et le mot de passe DB ont été générés automatiquement."
  log "Fichier .env créé"
else
  log "Fichier .env existant conservé"
fi

# ============================================
# ÉTAPE 9 : Build du frontend
# ============================================
info "Installation des dépendances frontend..."
npm install --production=false
log "Dépendances installées"

info "Build du frontend (React/Vite)..."
npm run build
log "Frontend buildé avec succès"

# ============================================
# ÉTAPE 10 : Mettre à jour les noms de domaine dans nginx.conf
# ============================================
info "Vérification de la configuration Nginx..."
if grep -q "ecrelooking.com" nginx/nginx.conf; then
  log "Nginx déjà configuré pour ecrelooking.com"
else
  warn "Mise à jour du domaine dans nginx.conf..."
  sed -i 's/eudora-conseil\.fr/ecrelooking.com/g' nginx/nginx.conf
  log "Nginx configuré pour ecrelooking.com"
fi

# ============================================
# ÉTAPE 11 : Lancer Docker Compose
# ============================================
info "Lancement des services Docker..."
docker compose down 2>/dev/null || true
docker compose up -d --build
log "Services Docker lancés"

# Attendre que la base de données soit prête
info "Attente du démarrage de la base de données..."
sleep 10

# Vérifier les services
echo ""
info "État des services :"
docker compose ps
echo ""

# ============================================
# ÉTAPE 12 : Créer l'administrateur
# ============================================
echo ""
echo "=========================================="
echo "  🔐 Création du compte administrateur"
echo "=========================================="
echo ""
read -p "Voulez-vous créer un compte admin maintenant ? (o/N) : " CREATE_ADMIN
if [[ "$CREATE_ADMIN" =~ ^[oOyY]$ ]]; then
  docker compose exec backend flask create-admin
  log "Admin créé"
fi

# ============================================
# ÉTAPE 13 : Insérer les services par défaut
# ============================================
read -p "Voulez-vous insérer les services par défaut ? (o/N) : " SEED_SERVICES
if [[ "$SEED_SERVICES" =~ ^[oOyY]$ ]]; then
  docker compose exec backend flask seed-services
  log "Services insérés"
fi

# ============================================
# ÉTAPE 14 : Test de santé
# ============================================
echo ""
info "Test de l'API..."
sleep 3
HEALTH=$(curl -s http://localhost/api/health 2>/dev/null || echo "ERREUR")
if echo "$HEALTH" | grep -q "ok"; then
  log "API opérationnelle : $HEALTH"
else
  warn "L'API n'est pas encore accessible. Vérifiez les logs : docker compose logs -f"
fi

# ============================================
# RÉSUMÉ
# ============================================
echo ""
echo "=========================================="
echo "  ✅ Déploiement terminé !"
echo "=========================================="
echo ""
echo "  🌐 Site web    : http://ecrelooking.com"
echo "  🔐 Admin       : http://ecrelooking.com/admin"
echo "  📖 Swagger API : http://ecrelooking.com/api/docs"
echo ""
echo "  📋 Prochaine étape : Configurer le SSL (HTTPS)"
echo "     Exécutez : sudo ./ssl-setup.sh"
echo ""
echo "  📝 Commandes utiles :"
echo "     docker compose logs -f          # Voir les logs"
echo "     docker compose restart          # Redémarrer"
echo "     nano $PROJECT_DIR/.env          # Modifier la config"
echo ""

#!/bin/bash
# ============================================
# 🔒 Configuration SSL — Let's Encrypt
# ============================================
# Usage :
#   chmod +x ssl-setup.sh
#   sudo ./ssl-setup.sh
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[✅]${NC} $1"; }
info() { echo -e "${BLUE}[ℹ️ ]${NC} $1"; }
warn() { echo -e "${YELLOW}[⚠️ ]${NC} $1"; }
error() { echo -e "${RED}[❌]${NC} $1"; exit 1; }

DOMAIN="ecrelooking.com"
EMAIL="info@ecrelooking.com"
PROJECT_DIR="/home/ecrelooking"

echo ""
echo "=========================================="
echo "  🔒 Configuration SSL — $DOMAIN"
echo "=========================================="
echo ""

if [ "$EUID" -ne 0 ]; then
  error "Ce script doit être exécuté en tant que root (sudo ./ssl-setup.sh)"
fi

cd "$PROJECT_DIR"

# ============================================
# ÉTAPE 1 : Vérifier que le site HTTP fonctionne
# ============================================
info "Vérification que le site est accessible en HTTP..."
if curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" | grep -q "200\|301\|302"; then
  log "Le site est accessible en HTTP"
else
  warn "Le site n'est pas encore accessible. Vérifiez que :"
  warn "  - Le DNS A record pointe vers l'IP du VPS"
  warn "  - Les services Docker tournent (docker compose ps)"
  warn "  - Le port 80 est ouvert (ufw status)"
  read -p "Continuer quand même ? (o/N) : " CONT
  [[ ! "$CONT" =~ ^[oOyY]$ ]] && exit 0
fi

# ============================================
# ÉTAPE 2 : Obtenir le certificat SSL
# ============================================
info "Demande du certificat SSL via Certbot..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --force-renewal

log "Certificat SSL obtenu !"

# ============================================
# ÉTAPE 3 : Activer SSL dans la configuration Nginx
# ============================================
info "Activation du SSL dans nginx.conf..."

NGINX_CONF="$PROJECT_DIR/nginx/nginx.conf"

# Décommenter la redirection HTTP → HTTPS
sed -i 's|# server {|server {|' "$NGINX_CONF"
sed -i 's|#     listen 80;|    listen 80;|' "$NGINX_CONF"
sed -i "s|#     server_name ecrelooking.com www.ecrelooking.com;|    server_name ecrelooking.com www.ecrelooking.com;|" "$NGINX_CONF"
sed -i 's|#     return 301 https://\$server_name\$request_uri;|    return 301 https://\$server_name\$request_uri;|' "$NGINX_CONF"
sed -i '/^# }$/{ s|# }|}|; }' "$NGINX_CONF"

# Activer SSL dans le bloc serveur principal
sed -i 's|    # listen 443 ssl http2;|    listen 443 ssl http2;|' "$NGINX_CONF"
sed -i "s|    # ssl_certificate /etc/letsencrypt/live/ecrelooking.com/fullchain.pem;|    ssl_certificate /etc/letsencrypt/live/ecrelooking.com/fullchain.pem;|" "$NGINX_CONF"
sed -i "s|    # ssl_certificate_key /etc/letsencrypt/live/ecrelooking.com/privkey.pem;|    ssl_certificate_key /etc/letsencrypt/live/ecrelooking.com/privkey.pem;|" "$NGINX_CONF"
sed -i 's|    # ssl_protocols TLSv1.2 TLSv1.3;|    ssl_protocols TLSv1.2 TLSv1.3;|' "$NGINX_CONF"
sed -i 's|    # ssl_prefer_server_ciphers on;|    ssl_prefer_server_ciphers on;|' "$NGINX_CONF"

log "SSL activé dans nginx.conf"

# ============================================
# ÉTAPE 4 : Redémarrer Nginx
# ============================================
info "Redémarrage de Nginx..."
docker compose restart nginx
sleep 5
log "Nginx redémarré"

# ============================================
# ÉTAPE 5 : Vérification
# ============================================
info "Vérification du SSL..."
sleep 3
HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api/health" 2>/dev/null || echo "ERREUR")
if [ "$HTTPS_STATUS" = "200" ]; then
  log "SSL fonctionne parfaitement !"
else
  warn "Le SSL ne semble pas encore fonctionner (status: $HTTPS_STATUS)"
  warn "Attendez quelques minutes pour la propagation DNS et réessayez."
fi

# ============================================
# RÉSUMÉ
# ============================================
echo ""
echo "=========================================="
echo "  ✅ SSL configuré avec succès !"
echo "=========================================="
echo ""
echo "  🔒 https://www.ecrelooking.com         ← Site vitrine"
echo "  🔐 https://www.ecrelooking.com/admin    ← Dashboard admin"
echo "  📖 https://www.ecrelooking.com/api/docs ← API Swagger"
echo ""
echo "  🔄 Le certificat se renouvelle automatiquement"
echo "     via le service Certbot dans Docker Compose."
echo ""

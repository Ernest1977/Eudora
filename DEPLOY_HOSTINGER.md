# 🚀 Guide de Déploiement — VPS Hostinger (Ubuntu)

## Prérequis
- VPS Hostinger avec Ubuntu 22.04 ou 24.04
- Accès root SSH
- Nom de domaine `ecrelooking.com` pointant vers l'IP du VPS (DNS A record)

---

## Étape 1 : Se connecter au VPS

```bash
ssh root@VOTRE_IP_VPS
```

---

## Étape 2 : Installer Docker

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com | sh

# Installer Docker Compose (inclus dans Docker récent)
docker --version
docker compose version

# (Optionnel) Créer un utilisateur non-root
adduser deploy
usermod -aG docker deploy
```

---

## Étape 3 : Installer Node.js (pour le build frontend)

```bash
# Installer Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
apt-get install -y nodejs
node --version
npm --version
```

---

## Étape 4 : Cloner le projet

```bash
cd /home
git clone https://github.com/Ernest1977/eudor.git ecrelooking
cd ecrelooking
```

---

## Étape 5 : Configurer les variables d'environnement

```bash
cp .env.example .env
nano .env
```

**Remplir TOUTES les valeurs :**

```env
# Générer des clés secrètes uniques :
# python3 -c "import secrets; print(secrets.token_hex(32))"

FLASK_ENV=production
FLASK_DEBUG=false
SECRET_KEY=VOTRE_CLE_SECRETE_64_CARACTERES
JWT_SECRET_KEY=VOTRE_AUTRE_CLE_SECRETE

POSTGRES_USER=eudora
POSTGRES_PASSWORD=MOT_DE_PASSE_FORT_ICI
POSTGRES_DB=eudora_db
DATABASE_URL=postgresql://eudora:MOT_DE_PASSE_FORT_ICI@db:5432/eudora_db

MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-application
MAIL_DEFAULT_SENDER=info@ecrelooking.com

CORS_ORIGINS=https://ecrelooking.com,https://www.ecrelooking.com

DOMAIN=ecrelooking.com
```

---

## Étape 6 : Builder le frontend

```bash
npm install
npm run build
# → Les fichiers sont dans ./dist/
```

---

## Étape 7 : Configurer Nginx pour le domaine

Éditer le fichier Nginx :
```bash
nano nginx/nginx.conf
```

Remplacer `eudora-conseil.fr` par `ecrelooking.com` partout :
```
server_name ecrelooking.com www.ecrelooking.com;
```

---

## Étape 8 : Lancer les services

```bash
docker compose up -d --build
```

Vérifier que tout tourne :
```bash
docker compose ps
docker compose logs -f
```

---

## Étape 9 : Créer l'admin et initialiser la DB

```bash
# Créer le premier admin
docker compose exec backend flask create-admin

# Insérer les services par défaut
docker compose exec backend flask seed-services
```

---

## Étape 10 : Configurer le SSL (HTTPS)

```bash
# Installer certbot et obtenir le certificat
docker compose run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d ecrelooking.com -d www.ecrelooking.com \
  --email info@ecrelooking.com --agree-tos --no-eff-email

# Activer SSL dans Nginx
nano nginx/nginx.conf
```

**Décommenter les lignes SSL dans `nginx/nginx.conf` :**
```nginx
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/ecrelooking.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/ecrelooking.com/privkey.pem;
```

**Et décommenter la redirection HTTP → HTTPS :**
```nginx
server {
    listen 80;
    server_name ecrelooking.com www.ecrelooking.com;
    return 301 https://$server_name$request_uri;
}
```

Puis redémarrer :
```bash
docker compose restart nginx
```

---

## Étape 11 : Vérifier

```bash
# Test santé backend
curl https://www.ecrelooking.com/api/health

# Doit retourner :
# {"status": "ok", "app": "Eudora Conseil & Relooking"}
```

Ouvrir dans le navigateur :
- 🌐 **https://www.ecrelooking.com** — Site vitrine
- 🔐 **https://www.ecrelooking.com/admin** — Dashboard admin (à venir)

---

## 🔄 Mises à jour futures

Pour mettre à jour le site après une modification :

```bash
cd /home/ecrelooking

# Récupérer les dernières modifications
git pull origin main

# Rebuild le frontend
npm install
npm run build

# Rebuild et redémarrer les services
docker compose up -d --build

# Vérifier
docker compose logs -f
```

---

## 🔧 Commandes utiles

```bash
# Voir les logs en temps réel
docker compose logs -f

# Redémarrer un service
docker compose restart backend
docker compose restart nginx

# Accéder au shell du backend
docker compose exec backend bash

# Accéder à PostgreSQL
docker compose exec db psql -U eudora -d eudora_db

# Backup de la base de données
docker compose exec db pg_dump -U eudora eudora_db > backup_$(date +%Y%m%d).sql

# Renouveler le certificat SSL (automatique, mais si besoin)
docker compose run --rm certbot renew
docker compose restart nginx
```

---

## ⚠️ Points importants

1. **DNS** : Assurez-vous que le domaine `ecrelooking.com` et `www.ecrelooking.com` pointent vers l'IP du VPS (records A dans Hostinger)
2. **Pare-feu** : Ouvrir les ports 80 (HTTP) et 443 (HTTPS)
3. **Backup** : Faire des backups réguliers de la base PostgreSQL
4. **SSL** : Le certificat se renouvelle automatiquement via Certbot

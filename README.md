# ✨ Eudora Conseil & Relooking

Site web professionnel pour un cabinet de conseil en image et relooking.  
Frontend React/Vite + Backend Flask + PostgreSQL.

![Stack](https://img.shields.io/badge/React-19-blue) ![Stack](https://img.shields.io/badge/Flask-3.1-green) ![Stack](https://img.shields.io/badge/PostgreSQL-16-blue) ![Stack](https://img.shields.io/badge/Docker-ready-blue)

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Installation locale](#-installation-locale)
- [Déploiement sur VPS](#-déploiement-sur-vps)
- [Variables d'environnement](#-variables-denvironnement)
- [Commandes utiles](#-commandes-utiles)
- [Structure du projet](#-structure-du-projet)

---

## 🎯 Fonctionnalités

### Site vitrine (Frontend)
- 🌐 Multilingue FR / EN / IT
- 📱 Design responsive mobile-first
- 🎨 Design élégant avec palette dorée
- 📧 Formulaire de contact connecté au backend
- 🖼️ Galerie photos avec lightbox
- 💰 Calculateur de prix combo interactif

### Back-office (Backend API)
- 🔐 Authentification JWT (admin)
- 👥 Gestion des clients (CRUD)
- 🧾 Facturation avec numérotation automatique
- 📊 Dashboard financier (revenus, stats)
- 📧 Envoi d'emails (notifications contact)
- 📝 Gestion de contenu dynamique

---

## 🛠 Stack technique

| Composant | Technologie |
|---|---|
| Frontend | React 19, Vite 7, TailwindCSS 4, TypeScript |
| Backend | Flask 3.1, SQLAlchemy, Gunicorn |
| Base de données | PostgreSQL 16 (prod) / SQLite (dev) |
| Serveur web | Nginx (reverse proxy) |
| Conteneurisation | Docker + Docker Compose |
| SSL | Let's Encrypt (Certbot) |
| i18n | react-i18next (FR, EN, IT) |

---

## 🚀 Installation locale

### Prérequis
- Node.js ≥ 20
- Python ≥ 3.11
- (Optionnel) Docker & Docker Compose

### 1. Cloner le projet
```bash
git clone https://github.com/Ernest1977/eudor.git
cd eudor
```

### 2. Frontend
```bash
npm install
npm run dev
# → http://localhost:5173
```

### 3. Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows

pip install -r requirements.txt

# Configurer les variables d'environnement
cp ../.env.example ../.env
# Éditer le .env avec vos valeurs

# Lancer en mode dev
FLASK_ENV=development python run.py
# → http://localhost:5000
```

### 4. Créer l'admin et insérer les services
```bash
cd backend
export FLASK_APP=run.py
export FLASK_ENV=development
flask create-admin
flask seed-services
```

---

## 🐳 Déploiement sur VPS

### 1. Préparer le VPS
```bash
# Se connecter au VPS
ssh user@votre-vps-ip

# Installer Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Cloner le projet
git clone https://github.com/Ernest1977/eudor.git
cd eudor
```

### 2. Configurer l'environnement
```bash
cp .env.example .env
nano .env
# → Remplir TOUTES les valeurs (SECRET_KEY, DB, email, etc.)
```

#### Générer des clés secrètes :
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 3. Builder le frontend
```bash
npm install
npm run build
# → Les fichiers statiques sont dans ./dist/
```

### 4. Lancer avec Docker Compose
```bash
docker compose up -d --build
```

### 5. Créer l'admin
```bash
docker compose exec backend flask create-admin
docker compose exec backend flask seed-services
```

### 6. Configurer le SSL (HTTPS)
```bash
# Première obtention du certificat
docker compose run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d eudora-conseil.fr -d www.eudora-conseil.fr \
  --email votre-email@gmail.com --agree-tos

# Décommenter les lignes SSL dans nginx/nginx.conf
# Puis redémarrer
docker compose restart nginx
```

### 7. Vérifier
```bash
# Santé du backend
curl http://localhost/api/health

# Logs
docker compose logs -f
```

---

## 🔐 Variables d'environnement

| Variable | Description | Obligatoire |
|---|---|---|
| `SECRET_KEY` | Clé secrète Flask (64 chars min) | ✅ |
| `JWT_SECRET_KEY` | Clé secrète JWT | ✅ |
| `DATABASE_URL` | URL PostgreSQL | ✅ |
| `POSTGRES_USER` | Utilisateur PostgreSQL | ✅ |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | ✅ |
| `POSTGRES_DB` | Nom de la base | ✅ |
| `MAIL_SERVER` | Serveur SMTP | ❌ |
| `MAIL_USERNAME` | Email SMTP | ❌ |
| `MAIL_PASSWORD` | Mot de passe SMTP | ❌ |
| `CORS_ORIGINS` | Origines autorisées | ✅ |

---

## 📦 Commandes utiles

### Frontend
```bash
npm run dev        # Serveur de développement
npm run build      # Build de production
npm run preview    # Prévisualiser le build
```

### Backend
```bash
python run.py                  # Lancer en dev
flask create-admin             # Créer un admin
flask seed-services            # Insérer les services
flask db upgrade               # Appliquer les migrations
```

### Docker
```bash
docker compose up -d           # Démarrer
docker compose down            # Arrêter
docker compose logs -f         # Logs en temps réel
docker compose up -d --build   # Reconstruire
docker compose exec backend flask create-admin  # Admin en prod
```

---

## 📂 Structure du projet

```
eudor/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Factory Flask + extensions
│   │   ├── models.py            # Modèles SQLAlchemy
│   │   └── routes/
│   │       ├── auth.py          # Authentification JWT
│   │       ├── clients.py       # CRUD clients
│   │       ├── contact.py       # Formulaire de contact
│   │       ├── content.py       # Contenu dynamique + services
│   │       ├── finance.py       # Dashboard financier
│   │       └── invoices.py      # Facturation
│   ├── config.py                # Configuration Flask
│   ├── requirements.txt         # Dépendances Python
│   ├── run.py                   # Point d'entrée + CLI
│   ├── Dockerfile               # Image Docker backend
│   └── uploads/                 # Fichiers uploadés
├── src/
│   ├── components/              # Composants React
│   ├── i18n/                    # Traductions FR/EN/IT
│   ├── utils/                   # Utilitaires
│   ├── App.tsx                  # Composant racine
│   ├── main.tsx                 # Point d'entrée React
│   └── index.css                # Styles globaux
├── public/images/               # Images statiques
├── nginx/
│   ├── nginx.conf               # Config Nginx (production)
│   └── frontend.conf            # Config Nginx (frontend seul)
├── docker-compose.yml           # Orchestration Docker
├── .env.example                 # Template variables d'env
├── .gitignore                   # Fichiers à ignorer
├── package.json                 # Dépendances Node
├── vite.config.ts               # Config Vite
├── tsconfig.json                # Config TypeScript
└── README.md                    # Ce fichier
```

---

## 📄 Licence

Propriétaire — © 2025 Eudora Conseil & Relooking. Tous droits réservés.

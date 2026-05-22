# 🔍 Audit Complet — Eudora Conseil & Relooking

**Date :** Audit réalisé le jour du scan  
**Stack :** React 19 + Vite 7 + TailwindCSS 4 (Frontend) / Flask + SQLAlchemy (Backend)  
**Cible de déploiement :** VPS  

---

## 📊 Résumé Global

| Catégorie | Statut | Note |
|---|---|---|
| 🏗️ Structure du projet | ⚠️ Partiel | 6/10 |
| 🎨 Frontend (React/Vite) | ✅ Bon | 8/10 |
| 🐍 Backend (Flask) | ❌ Incomplet | 3/10 |
| 🔒 Sécurité | ❌ Critique | 2/10 |
| 🚀 Prêt pour le déploiement | ❌ Non | 2/10 |
| 📝 Documentation | ❌ Absente | 1/10 |

**Verdict : ❌ Le projet N'EST PAS prêt pour le déploiement en production.**

---

## ✅ Ce qui est BIEN fait

### Frontend (8/10)
- ✅ **Build réussi** — `vite build` compile sans erreur (349 KB gzippé à 101 KB)
- ✅ **Internationalisation complète** — FR / EN / IT avec `react-i18next`, bien structurée
- ✅ **Composants bien découpés** — Navbar, Hero, About, Services, Formulas, Combo, Testimonials, Gallery, Contact, Footer
- ✅ **Design cohérent** — Palette de couleurs harmonieuse (#B8963E doré, #4A3728 brun), typographie Cormorant Garamond + Lato
- ✅ **Responsive** — Classes Tailwind avec breakpoints lg/md/sm
- ✅ **Animations** — Framer Motion installé, CSS animations custom (fadeIn, shimmer)
- ✅ **Accessibilité basique** — `alt` sur les images, `aria` implicite via sémantique HTML
- ✅ **Alias @ configuré** — Path mapping `@/` → `src/`
- ✅ **SingleFile plugin** — Génère un seul fichier HTML (pratique pour un site vitrine)

### Architecture
- ✅ **Séparation frontend/backend** — Structure claire avec dossiers distincts
- ✅ **i18n bien organisée** — `src/i18n/locales/` avec fichiers par langue
- ✅ **Utilitaires** — `cn()` avec `clsx` + `tailwind-merge`

---

## ❌ Problèmes CRITIQUES

### 1. 🔒 SÉCURITÉ — Secrets exposés dans le code source (CRITIQUE)

**Fichier :** `backend/config.py`
```python
SECRET_KEY = os.environ.get('SECRET_KEY', 'eudora-conseil-secret-key-change-in-production')
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://user:password@localhost/eudora_db')
```

⚠️ **Les valeurs par défaut sont des mots de passe en clair, commités dans Git !**  
Même si c'est un fallback, quiconque clone le repo a accès à ces clés.

**Fix :**
- Supprimer TOUTES les valeurs par défaut sensibles
- Lever une erreur si la variable d'environnement n'est pas définie
- Utiliser un fichier `.env` (non commité)

---

### 2. 📁 Backend INCOMPLET — Routes manquantes (BLOQUANT)

Le fichier `backend/app/__init__.py` importe 6 blueprints qui **n'existent pas** :

```python
from app.routes.auth import auth_bp        # ❌ FICHIER MANQUANT
from app.routes.clients import clients_bp  # ❌ FICHIER MANQUANT
from app.routes.invoices import invoices_bp # ❌ FICHIER MANQUANT
from app.routes.finance import finance_bp  # ❌ FICHIER MANQUANT
from app.routes.content import content_bp  # ❌ FICHIER MANQUANT
from app.routes.contact import contact_bp  # ❌ FICHIER MANQUANT
```

Le dossier `backend/app/routes/` **n'existe même pas**. Le backend crashera immédiatement au démarrage.

---

### 3. 📦 `requirements.txt` MANQUANT (BLOQUANT)

Aucun fichier de dépendances Python. Le backend utilise :
- Flask
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- Flask-Mail
- python-dotenv
- Werkzeug

Sans `requirements.txt` ou `pyproject.toml`, impossible d'installer les dépendances sur le VPS.

---

### 4. 📄 `.gitignore` MANQUANT (CRITIQUE)

Il n'y a **aucun `.gitignore`**. Risques :
- `node_modules/` pourrait être commité (360+ MB)
- `.env` avec des secrets pourrait être commité
- `dist/` (build) pourrait être commité
- `__pycache__/` Python
- `*.db` fichiers SQLite
- `uploads/` fichiers utilisateurs

---

### 5. 🐳 Aucune config de déploiement (BLOQUANT pour VPS)

Pour un déploiement sur VPS, il manque :
- ❌ `Dockerfile` (ou `Dockerfile.frontend` + `Dockerfile.backend`)
- ❌ `docker-compose.yml`
- ❌ `nginx.conf` (reverse proxy)
- ❌ `gunicorn.conf.py` ou commande de lancement
- ❌ `.env.example` (template de variables d'environnement)
- ❌ Fichier `systemd` ou `supervisor` pour le process management

---

### 6. 📝 README.md MANQUANT

Aucune documentation. Il faut au minimum :
- Description du projet
- Prérequis
- Installation
- Variables d'environnement
- Commandes de dev/build/deploy

---

## ⚠️ Problèmes MODÉRÉS

### 7. Formulaire de contact — Pas de vrai envoi

```typescript
// Contact.tsx — ligne 27
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  // Simulate API call
  await new Promise(r => setTimeout(r, 1500));  // ⚠️ FAUX ENVOI !
  setSent(true);
};
```

Le formulaire simule l'envoi mais ne contacte aucune API. Il faut connecter au backend Flask (`POST /api/contact`).

---

### 8. Textes en dur (non traduits) dans certains composants

Plusieurs textes ne passent pas par i18n :
- `Hero.tsx` : "Clientes", "Ans d'exp.", "Satisfaction" (social proof en dur en français)
- `Services.tsx` : "Détails" (bouton)
- `Combo.tsx` : "Votre Sélection", "Sélectionné", "Total estimé", texte placeholder
- `Contact.tsx` : "Informations de contact", "Suivez-moi", labels sociaux
- `Footer.tsx` : "Newsletter", texte newsletter, "Contact Direct"

---

### 9. Liens sociaux vides

```html
<a href="#">Instagram</a>  <!-- ⚠️ Lien vide -->
```
Les liens Instagram, Facebook, LinkedIn pointent tous vers `#`.

---

### 10. `react-router-dom` installé mais non utilisé

`package.json` inclut `react-router-dom` v7.15 mais aucune route n'est définie. Le site est un SPA à page unique avec scroll. Dépendance inutile (+50KB).

---

### 11. `react-icons` et `swiper` installés mais non utilisés

- `react-icons` — Non importé nulle part (lucide-react est utilisé à la place)
- `swiper` — Non importé nulle part

Ces dépendances alourdissent inutilement le `node_modules`.

---

### 12. Données placeholder

- Numéro de téléphone : `+33 6 XX XX XX XX`
- SIRET : `SIRET: XXX XXX XXX XXXXX`
- Images de galerie potentiellement placeholder

---

### 13. Problème potentiel avec le parsing des prix dans Combo.tsx

```typescript
const price = parseInt(items[idx].price.replace(/[^0-9]/g, ''), 10);
```

Les prix EN sont formatés `€120` et FR `120€`. Le regex fonctionne dans les deux cas, mais c'est fragile. Un changement de format casserait le calcul.

---

### 14. `datetime.utcnow` est déprécié

Dans `models.py`, `datetime.utcnow` est utilisé partout. Depuis Python 3.12, c'est déprécié. Utiliser `datetime.now(datetime.timezone.utc)`.

---

### 15. Backend `config.py` — import path incorrect

`backend/config.py` est dans le dossier `backend/`, mais `__init__.py` fait :
```python
from config import Config
```
Cela ne fonctionnera que si le working directory est `backend/`. La structure d'import doit être clarifiée.

---

## 🛠️ Plan d'Action — Ce qu'il faut faire avant le déploiement

### Priorité 1 — BLOQUANT (à faire immédiatement)

- [ ] **Créer `.gitignore`**
- [ ] **Créer `backend/requirements.txt`**
- [ ] **Créer les routes manquantes** (`backend/app/routes/`)
- [ ] **Créer un fichier `backend/run.py`** (point d'entrée Flask)
- [ ] **Sécuriser les secrets** — supprimer les valeurs par défaut, créer `.env.example`
- [ ] **Créer `.env.example`** avec toutes les variables nécessaires

### Priorité 2 — IMPORTANT (déploiement VPS)

- [ ] **Créer `Dockerfile` (frontend + backend)**
- [ ] **Créer `docker-compose.yml`** (Nginx + Flask + PostgreSQL)
- [ ] **Créer `nginx.conf`** (reverse proxy, SSL, gzip, cache static)
- [ ] **Connecter le formulaire Contact** au backend Flask

### Priorité 3 — RECOMMANDÉ

- [ ] **Supprimer les dépendances inutiles** (`react-router-dom`, `react-icons`, `swiper`)
- [ ] **Traduire les textes en dur** via i18n
- [ ] **Ajouter un README.md** complet
- [ ] **Remplacer les données placeholder** (téléphone, SIRET)
- [ ] **Ajouter les vrais liens sociaux**
- [ ] **Mettre à jour le copyright** 2024 → 2025

---

## 💡 Veux-tu que je t'aide ?

Je peux créer pour toi immédiatement :
1. ✅ `.gitignore` complet
2. ✅ `backend/requirements.txt`
3. ✅ `backend/run.py`
4. ✅ `.env.example`
5. ✅ `Dockerfile` + `docker-compose.yml`
6. ✅ `nginx.conf`
7. ✅ `README.md`
8. ✅ Les routes backend manquantes (squelette)
9. ✅ Connexion du formulaire Contact au backend

**Dis-moi ce que tu veux que je fasse, et je m'en occupe !** 🚀

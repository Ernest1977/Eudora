import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


def require_env(key: str) -> str:
    """Lève une erreur si une variable d'environnement obligatoire est absente."""
    value = os.environ.get(key)
    if not value:
        raise RuntimeError(f"Variable d'environnement manquante : {key}")
    return value


class Config:
    """Configuration de base (production)."""

    # App
    SECRET_KEY = require_env('SECRET_KEY')
    DEBUG = False

    # Database — PostgreSQL en production
    SQLALCHEMY_DATABASE_URI = require_env('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = require_env('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    # Mail
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'contact@eudora-conseil.fr')

    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')

    # Upload
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

    # Infos entreprise
    COMPANY_NAME = 'Eudora Conseil & Relooking'
    COMPANY_ADDRESS = 'Paris, France'
    COMPANY_EMAIL = 'contact@eudora-conseil.fr'
    COMPANY_PHONE = '+33 6 XX XX XX XX'
    COMPANY_SIRET = 'SIRET: XXX XXX XXX XXXXX'
    TVA_RATE = 0.20


class DevelopmentConfig(Config):
    """Configuration de développement — SQLite, debug activé."""

    DEBUG = True
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-only-secret-key-not-for-production')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev-only-jwt-key-not-for-production')
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'sqlite:///' + os.path.join(os.path.dirname(__file__), 'eudora_dev.db')
    )


class ProductionConfig(Config):
    """Configuration de production."""
    pass

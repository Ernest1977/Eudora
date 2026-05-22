import os
from flask import Flask, send_from_directory, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
mail = Mail()
migrate = Migrate()


def create_app(config_class=None):
    """Factory de l'application Flask."""

    app = Flask(__name__, template_folder='../templates')

    # Choix automatique de la config
    if config_class is None:
        env = os.environ.get('FLASK_ENV', 'production')
        if env == 'development':
            from config import DevelopmentConfig
            config_class = DevelopmentConfig
        else:
            from config import ProductionConfig
            config_class = ProductionConfig

    app.config.from_object(config_class)

    # Créer le dossier uploads s'il n'existe pas
    os.makedirs(app.config.get('UPLOAD_FOLDER', 'uploads'), exist_ok=True)

    # Initialiser les extensions
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config.get('CORS_ORIGINS', ['http://localhost:5173']))

    # Enregistrer les blueprints (routes)
    from app.routes.auth import auth_bp
    from app.routes.clients import clients_bp
    from app.routes.invoices import invoices_bp
    from app.routes.finance import finance_bp
    from app.routes.content import content_bp
    from app.routes.contact import contact_bp
    from app.routes.cms import cms_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(clients_bp, url_prefix='/api/clients')
    app.register_blueprint(invoices_bp, url_prefix='/api/invoices')
    app.register_blueprint(finance_bp, url_prefix='/api/finance')
    app.register_blueprint(content_bp, url_prefix='/api/content')
    app.register_blueprint(contact_bp, url_prefix='/api/contact')
    app.register_blueprint(cms_bp, url_prefix='/api/cms')

    # ============================================
    # SWAGGER / API DOCUMENTATION
    # ============================================

    @app.route('/api/docs')
    def swagger_ui():
        """Page Swagger UI interactive."""
        return render_template('swagger.html')

    @app.route('/api/docs/swagger.json')
    def swagger_json():
        """Fichier OpenAPI 3.0 (JSON)."""
        import json
        swagger_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'swagger.json')
        with open(swagger_path, 'r', encoding='utf-8') as f:
            spec = json.load(f)
        return jsonify(spec)

    # ============================================
    # ROUTES UTILITAIRES
    # ============================================

    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        """Servir les fichiers uploadés."""
        return send_from_directory(app.config.get('UPLOAD_FOLDER', 'uploads'), filename)

    @app.route('/api/health')
    def health():
        """Vérification de l'état du serveur."""
        return {'status': 'ok', 'app': 'Eudora Conseil & Relooking'}

    # Créer les tables
    with app.app_context():
        db.create_all()

    return app

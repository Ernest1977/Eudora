"""
Routes CMS — CRUD complet pour toutes les sections du site (protégé par JWT)
Endpoints publics (GET) + admin (POST/PUT/DELETE)
"""
import os
import json
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from app import db
from app.models import (
    SiteSettings, HeroSection, AboutSection,
    Service, Formula, Testimonial, GalleryImage
)

cms_bp = Blueprint('cms', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ============================================
# UPLOAD D'IMAGES
# ============================================

@cms_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_image():
    """Upload d'une image (admin)."""
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier envoyé'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nom de fichier vide'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': f'Type de fichier non autorisé. Types acceptés: {", ".join(ALLOWED_EXTENSIONS)}'}), 400

    filename = secure_filename(file.filename)
    # Ajouter un timestamp pour éviter les conflits
    import time
    name, ext = os.path.splitext(filename)
    filename = f"{name}_{int(time.time())}{ext}"

    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)

    url = f"/uploads/{filename}"
    return jsonify({'url': url, 'filename': filename}), 201


# ============================================
# SITE SETTINGS (Paramètres globaux)
# ============================================

@cms_bp.route('/settings', methods=['GET'])
def get_settings():
    """Récupérer tous les paramètres du site (public)."""
    settings = SiteSettings.query.all()
    return jsonify({s.key: s.value for s in settings}), 200


@cms_bp.route('/settings', methods=['PUT'])
@jwt_required()
def update_settings():
    """Mettre à jour les paramètres du site (admin)."""
    data = request.get_json()
    for key, value in data.items():
        setting = SiteSettings.query.filter_by(key=key).first()
        if setting:
            setting.value = str(value)
        else:
            setting = SiteSettings(key=key, value=str(value))
            db.session.add(setting)
    db.session.commit()
    return jsonify({'message': 'Paramètres mis à jour'}), 200


# ============================================
# HERO SECTION
# ============================================

@cms_bp.route('/hero', methods=['GET'])
def get_hero():
    """Récupérer la section Hero (public)."""
    lang = request.args.get('lang', 'fr')
    hero = HeroSection.query.first()
    if not hero:
        return jsonify({}), 200
    return jsonify(hero.to_dict(lang=lang)), 200


@cms_bp.route('/hero/full', methods=['GET'])
@jwt_required()
def get_hero_full():
    """Récupérer la section Hero complète (admin)."""
    hero = HeroSection.query.first()
    if not hero:
        return jsonify({}), 200
    return jsonify(hero.to_full_dict()), 200


@cms_bp.route('/hero', methods=['PUT'])
@jwt_required()
def update_hero():
    """Mettre à jour la section Hero (admin)."""
    data = request.get_json()
    hero = HeroSection.query.first()
    if not hero:
        hero = HeroSection()
        db.session.add(hero)

    for key, value in data.items():
        if hasattr(hero, key) and key not in ('id', 'updated_at'):
            setattr(hero, key, value)

    db.session.commit()
    return jsonify({'message': 'Section Hero mise à jour', 'data': hero.to_full_dict()}), 200


# ============================================
# ABOUT SECTION
# ============================================

@cms_bp.route('/about', methods=['GET'])
def get_about():
    """Récupérer la section About (public)."""
    lang = request.args.get('lang', 'fr')
    about = AboutSection.query.first()
    if not about:
        return jsonify({}), 200
    return jsonify(about.to_dict(lang=lang)), 200


@cms_bp.route('/about', methods=['PUT'])
@jwt_required()
def update_about():
    """Mettre à jour la section About (admin)."""
    data = request.get_json()
    about = AboutSection.query.first()
    if not about:
        about = AboutSection()
        db.session.add(about)

    for key, value in data.items():
        if hasattr(about, key) and key not in ('id', 'updated_at'):
            setattr(about, key, value)

    db.session.commit()
    return jsonify({'message': 'Section About mise à jour', 'data': about.to_full_dict()}), 200


# ============================================
# SERVICES (CRUD)
# ============================================

@cms_bp.route('/services', methods=['GET'])
def list_services():
    """Lister les services (public — actifs seulement)."""
    lang = request.args.get('lang', 'fr')
    show_all = request.args.get('all', 'false').lower() == 'true'

    query = Service.query.order_by(Service.sort_order)
    if not show_all:
        query = query.filter_by(is_active=True)

    services = query.all()
    return jsonify({'services': [s.to_dict(lang=lang) for s in services]}), 200


@cms_bp.route('/services', methods=['POST'])
@jwt_required()
def create_service():
    """Créer un service (admin)."""
    data = request.get_json()
    if not data.get('name_fr'):
        return jsonify({'error': 'name_fr requis'}), 400

    service = Service()
    for key, value in data.items():
        if hasattr(service, key) and key not in ('id', 'created_at', 'updated_at'):
            setattr(service, key, value)

    db.session.add(service)
    db.session.commit()
    return jsonify({'message': 'Service créé', 'data': service.to_full_dict()}), 201


@cms_bp.route('/services/<int:service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    """Modifier un service (admin)."""
    service = Service.query.get_or_404(service_id)
    data = request.get_json()

    for key, value in data.items():
        if hasattr(service, key) and key not in ('id', 'created_at', 'updated_at'):
            setattr(service, key, value)

    db.session.commit()
    return jsonify({'message': 'Service mis à jour', 'data': service.to_full_dict()}), 200


@cms_bp.route('/services/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    """Supprimer un service (admin)."""
    service = Service.query.get_or_404(service_id)
    db.session.delete(service)
    db.session.commit()
    return jsonify({'message': 'Service supprimé'}), 200


# ============================================
# FORMULES (CRUD)
# ============================================

@cms_bp.route('/formulas', methods=['GET'])
def list_formulas():
    """Lister les formules (public)."""
    lang = request.args.get('lang', 'fr')
    show_all = request.args.get('all', 'false').lower() == 'true'

    query = Formula.query.order_by(Formula.sort_order)
    if not show_all:
        query = query.filter_by(is_active=True)

    formulas = query.all()
    return jsonify({'formulas': [f.to_dict(lang=lang) for f in formulas]}), 200


@cms_bp.route('/formulas', methods=['POST'])
@jwt_required()
def create_formula():
    """Créer une formule (admin)."""
    data = request.get_json()
    if not data.get('name_fr'):
        return jsonify({'error': 'name_fr requis'}), 400

    formula = Formula()
    for key, value in data.items():
        if hasattr(formula, key) and key not in ('id', 'created_at', 'updated_at'):
            setattr(formula, key, value)

    db.session.add(formula)
    db.session.commit()
    return jsonify({'message': 'Formule créée', 'data': formula.to_full_dict()}), 201


@cms_bp.route('/formulas/<int:formula_id>', methods=['PUT'])
@jwt_required()
def update_formula(formula_id):
    """Modifier une formule (admin)."""
    formula = Formula.query.get_or_404(formula_id)
    data = request.get_json()

    for key, value in data.items():
        if hasattr(formula, key) and key not in ('id', 'created_at', 'updated_at'):
            setattr(formula, key, value)

    db.session.commit()
    return jsonify({'message': 'Formule mise à jour', 'data': formula.to_full_dict()}), 200


@cms_bp.route('/formulas/<int:formula_id>', methods=['DELETE'])
@jwt_required()
def delete_formula(formula_id):
    """Supprimer une formule (admin)."""
    formula = Formula.query.get_or_404(formula_id)
    db.session.delete(formula)
    db.session.commit()
    return jsonify({'message': 'Formule supprimée'}), 200


# ============================================
# TÉMOIGNAGES (CRUD)
# ============================================

@cms_bp.route('/testimonials', methods=['GET'])
def list_testimonials():
    """Lister les témoignages (public)."""
    lang = request.args.get('lang', 'fr')
    show_all = request.args.get('all', 'false').lower() == 'true'

    query = Testimonial.query.order_by(Testimonial.sort_order)
    if not show_all:
        query = query.filter_by(is_active=True)

    testimonials = query.all()
    return jsonify({'testimonials': [t.to_dict(lang=lang) for t in testimonials]}), 200


@cms_bp.route('/testimonials', methods=['POST'])
@jwt_required()
def create_testimonial():
    """Créer un témoignage (admin)."""
    data = request.get_json()
    if not data.get('name'):
        return jsonify({'error': 'name requis'}), 400

    testimonial = Testimonial()
    for key, value in data.items():
        if hasattr(testimonial, key) and key not in ('id', 'created_at', 'updated_at'):
            setattr(testimonial, key, value)

    db.session.add(testimonial)
    db.session.commit()
    return jsonify({'message': 'Témoignage créé', 'data': testimonial.to_full_dict()}), 201


@cms_bp.route('/testimonials/<int:testimonial_id>', methods=['PUT'])
@jwt_required()
def update_testimonial(testimonial_id):
    """Modifier un témoignage (admin)."""
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    data = request.get_json()

    for key, value in data.items():
        if hasattr(testimonial, key) and key not in ('id', 'created_at', 'updated_at'):
            setattr(testimonial, key, value)

    db.session.commit()
    return jsonify({'message': 'Témoignage mis à jour', 'data': testimonial.to_full_dict()}), 200


@cms_bp.route('/testimonials/<int:testimonial_id>', methods=['DELETE'])
@jwt_required()
def delete_testimonial(testimonial_id):
    """Supprimer un témoignage (admin)."""
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    db.session.delete(testimonial)
    db.session.commit()
    return jsonify({'message': 'Témoignage supprimé'}), 200


# ============================================
# GALERIE (CRUD)
# ============================================

@cms_bp.route('/gallery', methods=['GET'])
def list_gallery():
    """Lister les images de la galerie (public)."""
    lang = request.args.get('lang', 'fr')
    show_all = request.args.get('all', 'false').lower() == 'true'

    query = GalleryImage.query.order_by(GalleryImage.sort_order)
    if not show_all:
        query = query.filter_by(is_active=True)

    images = query.all()
    return jsonify({'images': [img.to_dict(lang=lang) for img in images]}), 200


@cms_bp.route('/gallery', methods=['POST'])
@jwt_required()
def create_gallery_image():
    """Ajouter une image à la galerie (admin)."""
    data = request.get_json()
    if not data.get('src'):
        return jsonify({'error': 'src requis'}), 400

    image = GalleryImage()
    for key, value in data.items():
        if hasattr(image, key) and key not in ('id', 'created_at'):
            setattr(image, key, value)

    db.session.add(image)
    db.session.commit()
    return jsonify({'message': 'Image ajoutée', 'data': image.to_full_dict()}), 201


@cms_bp.route('/gallery/<int:image_id>', methods=['PUT'])
@jwt_required()
def update_gallery_image(image_id):
    """Modifier une image de la galerie (admin)."""
    image = GalleryImage.query.get_or_404(image_id)
    data = request.get_json()

    for key, value in data.items():
        if hasattr(image, key) and key not in ('id', 'created_at'):
            setattr(image, key, value)

    db.session.commit()
    return jsonify({'message': 'Image mise à jour', 'data': image.to_full_dict()}), 200


@cms_bp.route('/gallery/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_gallery_image(image_id):
    """Supprimer une image de la galerie (admin)."""
    image = GalleryImage.query.get_or_404(image_id)
    db.session.delete(image)
    db.session.commit()
    return jsonify({'message': 'Image supprimée'}), 200

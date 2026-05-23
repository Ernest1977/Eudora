"""
Routes Content — Routes legacy, redirigent vers le CMS.
Conservé pour la rétrocompatibilité.
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Service

content_bp = Blueprint('content', __name__)


# ==========================================
# SERVICES / PRESTATIONS (public + admin)
# ==========================================

@content_bp.route('/services', methods=['GET'])
def list_services():
    """Lister les services actifs (public)."""
    lang = request.args.get('lang', 'fr')
    services = Service.query.filter_by(is_active=True).order_by(Service.sort_order).all()
    return jsonify({
        'services': [s.to_dict(lang=lang) for s in services],
    }), 200


@content_bp.route('/services', methods=['POST'])
@jwt_required()
def create_service():
    """Créer un nouveau service (admin)."""
    data = request.get_json()

    if not data.get('name_fr') or not data.get('price'):
        return jsonify({'error': 'name_fr et price requis'}), 400

    service = Service(
        name_fr=data['name_fr'],
        name_en=data.get('name_en', ''),
        name_it=data.get('name_it', ''),
        description_fr=data.get('description_fr', ''),
        description_en=data.get('description_en', ''),
        description_it=data.get('description_it', ''),
        duration=data.get('duration', ''),
        price=float(data['price']),
        category=data.get('category', 'standalone'),
        icon=data.get('icon', ''),
    )

    db.session.add(service)
    db.session.commit()

    return jsonify({'message': 'Service créé', 'service': service.to_dict()}), 201


@content_bp.route('/services/<int:service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    """Modifier un service (admin)."""
    service = Service.query.get_or_404(service_id)
    data = request.get_json()

    updatable = [
        'name_fr', 'name_en', 'name_it',
        'description_fr', 'description_en', 'description_it',
        'duration', 'price', 'category', 'is_active', 'icon'
    ]

    for field in updatable:
        if field in data:
            setattr(service, field, data[field])

    db.session.commit()

    return jsonify({'message': 'Service mis à jour', 'service': service.to_dict()}), 200


@content_bp.route('/services/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    """Supprimer un service (admin)."""
    service = Service.query.get_or_404(service_id)
    db.session.delete(service)
    db.session.commit()
    return jsonify({'message': 'Service supprimé'}), 200

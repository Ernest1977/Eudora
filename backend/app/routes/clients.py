"""
Routes Clients — CRUD complet (protégé par JWT)
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Client

clients_bp = Blueprint('clients', __name__)


@clients_bp.route('/', methods=['GET'])
@jwt_required()
def list_clients():
    """Lister tous les clients avec pagination et recherche."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '').strip()
    status = request.args.get('status', '')

    query = Client.query.order_by(Client.created_at.desc())

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            db.or_(
                Client.first_name.ilike(search_filter),
                Client.last_name.ilike(search_filter),
                Client.email.ilike(search_filter),
                Client.phone.ilike(search_filter),
            )
        )

    if status:
        query = query.filter_by(status=status)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'clients': [c.to_dict() for c in pagination.items],
        'total': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages,
    }), 200


@clients_bp.route('/<int:client_id>', methods=['GET'])
@jwt_required()
def get_client(client_id):
    """Voir un client en détail."""
    client = Client.query.get_or_404(client_id)
    return jsonify({'client': client.to_dict()}), 200


@clients_bp.route('/', methods=['POST'])
@jwt_required()
def create_client():
    """Créer un nouveau client."""
    data = request.get_json()

    required = ['first_name', 'last_name', 'email']
    for field in required:
        if not data.get(field, '').strip():
            return jsonify({'error': f'Champ "{field}" requis'}), 400

    if Client.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Un client avec cet email existe déjà'}), 409

    client = Client(
        first_name=data['first_name'].strip(),
        last_name=data['last_name'].strip(),
        email=data['email'].strip(),
        phone=data.get('phone', '').strip(),
        address=data.get('address', '').strip(),
        city=data.get('city', '').strip(),
        country=data.get('country', 'France').strip(),
        notes=data.get('notes', '').strip(),
        status=data.get('status', 'active'),
        preferred_language=data.get('preferred_language', 'fr'),
    )

    db.session.add(client)
    db.session.commit()

    return jsonify({'message': 'Client créé', 'client': client.to_dict()}), 201


@clients_bp.route('/<int:client_id>', methods=['PUT'])
@jwt_required()
def update_client(client_id):
    """Modifier un client."""
    client = Client.query.get_or_404(client_id)
    data = request.get_json()

    updatable = [
        'first_name', 'last_name', 'email', 'phone',
        'address', 'city', 'country', 'notes', 'status', 'preferred_language'
    ]

    for field in updatable:
        if field in data:
            setattr(client, field, data[field])

    db.session.commit()

    return jsonify({'message': 'Client mis à jour', 'client': client.to_dict()}), 200


@clients_bp.route('/<int:client_id>', methods=['DELETE'])
@jwt_required()
def delete_client(client_id):
    """Supprimer un client."""
    client = Client.query.get_or_404(client_id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({'message': 'Client supprimé'}), 200

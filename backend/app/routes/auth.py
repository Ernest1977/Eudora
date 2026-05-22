"""
Routes d'authentification — Login, Register, Refresh Token
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from app import db
from app.models import User
from datetime import datetime, timezone

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    """Connexion admin — retourne un JWT."""
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Nom d\'utilisateur et mot de passe requis'}), 400

    user = User.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Identifiants incorrects'}), 401

    if not user.is_active:
        return jsonify({'error': 'Compte désactivé'}), 403

    # Mise à jour du dernier login
    user.last_login = datetime.now(timezone.utc)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict(),
    }), 200


@auth_bp.route('/register', methods=['POST'])
@jwt_required()
def register():
    """Créer un nouvel utilisateur admin (protégé par JWT)."""
    data = request.get_json()

    required = ['username', 'email', 'password']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'Champ "{field}" requis'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Ce nom d\'utilisateur existe déjà'}), 409

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Cet email existe déjà'}), 409

    user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'staff'),
    )
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Utilisateur créé', 'user': user.to_dict()}), 201


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Rafraîchir le token d'accès."""
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify({'access_token': access_token}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Retourne le profil de l'utilisateur connecté."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'error': 'Utilisateur introuvable'}), 404
    return jsonify({'user': user.to_dict()}), 200

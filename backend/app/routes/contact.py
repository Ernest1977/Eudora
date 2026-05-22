"""
Routes Contact — Formulaire de contact public + gestion admin
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from flask_mail import Message
from app import db, mail
from app.models import ContactMessage

contact_bp = Blueprint('contact', __name__)


@contact_bp.route('/', methods=['POST'])
def send_message():
    """Recevoir un message du formulaire de contact (public)."""
    data = request.get_json()

    # Validation
    required = ['name', 'email', 'message']
    for field in required:
        if not data.get(field, '').strip():
            return jsonify({'error': f'Le champ "{field}" est requis'}), 400

    # Validation basique de l'email
    email = data['email'].strip()
    if '@' not in email or '.' not in email:
        return jsonify({'error': 'Email invalide'}), 400

    # Sauvegarder en base
    contact = ContactMessage(
        name=data['name'].strip(),
        email=email,
        phone=data.get('phone', '').strip(),
        service=data.get('service', '').strip(),
        message=data['message'].strip(),
    )
    db.session.add(contact)
    db.session.commit()

    # Envoyer un email de notification à l'admin
    try:
        msg = Message(
            subject=f"[Eudora] Nouveau message de {contact.name}",
            recipients=[current_app.config['MAIL_DEFAULT_SENDER']],
            body=f"""Nouveau message reçu sur le site Eudora Conseil & Relooking

Nom : {contact.name}
Email : {contact.email}
Téléphone : {contact.phone or 'Non renseigné'}
Prestation souhaitée : {contact.service or 'Non précisée'}

Message :
{contact.message}

---
Reçu le {contact.created_at.strftime('%d/%m/%Y à %H:%M')}
""",
        )
        mail.send(msg)
    except Exception as e:
        # On log l'erreur mais on ne bloque pas la réponse
        current_app.logger.error(f"Erreur envoi email: {e}")

    return jsonify({
        'message': 'Message envoyé avec succès',
        'id': contact.id,
    }), 201


@contact_bp.route('/', methods=['GET'])
@jwt_required()
def list_messages():
    """Lister tous les messages de contact (admin)."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    unread_only = request.args.get('unread', 'false').lower() == 'true'

    query = ContactMessage.query.order_by(ContactMessage.created_at.desc())

    if unread_only:
        query = query.filter_by(is_read=False)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'messages': [m.to_dict() for m in pagination.items],
        'total': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages,
        'unread_count': ContactMessage.query.filter_by(is_read=False).count(),
    }), 200


@contact_bp.route('/<int:message_id>', methods=['GET'])
@jwt_required()
def get_message(message_id):
    """Voir un message en détail (admin)."""
    msg = ContactMessage.query.get_or_404(message_id)
    # Marquer comme lu
    if not msg.is_read:
        msg.is_read = True
        db.session.commit()
    return jsonify({'message': msg.to_dict()}), 200


@contact_bp.route('/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    """Supprimer un message (admin)."""
    msg = ContactMessage.query.get_or_404(message_id)
    db.session.delete(msg)
    db.session.commit()
    return jsonify({'message': 'Message supprimé'}), 200

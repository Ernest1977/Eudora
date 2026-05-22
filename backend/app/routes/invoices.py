"""
Routes Factures — CRUD + gestion des statuts (protégé par JWT)
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Invoice, InvoiceItem, Client
from datetime import datetime, timezone, timedelta

invoices_bp = Blueprint('invoices', __name__)


def generate_invoice_number():
    """Génère un numéro de facture unique : EUD-YYYYMM-XXXX."""
    now = datetime.now(timezone.utc)
    prefix = f"EUD-{now.strftime('%Y%m')}"
    last = Invoice.query.filter(
        Invoice.invoice_number.like(f"{prefix}%")
    ).order_by(Invoice.id.desc()).first()

    if last:
        last_num = int(last.invoice_number.split('-')[-1])
        new_num = last_num + 1
    else:
        new_num = 1

    return f"{prefix}-{new_num:04d}"


@invoices_bp.route('/', methods=['GET'])
@jwt_required()
def list_invoices():
    """Lister les factures avec filtres."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status', '')
    client_id = request.args.get('client_id', type=int)

    query = Invoice.query.order_by(Invoice.created_at.desc())

    if status:
        query = query.filter_by(status=status)
    if client_id:
        query = query.filter_by(client_id=client_id)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'invoices': [inv.to_dict() for inv in pagination.items],
        'total': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages,
    }), 200


@invoices_bp.route('/<int:invoice_id>', methods=['GET'])
@jwt_required()
def get_invoice(invoice_id):
    """Voir une facture en détail."""
    invoice = Invoice.query.get_or_404(invoice_id)
    return jsonify({'invoice': invoice.to_dict()}), 200


@invoices_bp.route('/', methods=['POST'])
@jwt_required()
def create_invoice():
    """Créer une nouvelle facture."""
    data = request.get_json()

    if not data.get('client_id'):
        return jsonify({'error': 'client_id requis'}), 400

    client = Client.query.get(data['client_id'])
    if not client:
        return jsonify({'error': 'Client introuvable'}), 404

    invoice = Invoice(
        invoice_number=generate_invoice_number(),
        client_id=data['client_id'],
        due_date=(datetime.now(timezone.utc) + timedelta(days=30)).date(),
        notes=data.get('notes', ''),
        tva_rate=data.get('tva_rate', 0.20),
    )

    # Ajouter les lignes de facture
    items_data = data.get('items', [])
    for item_data in items_data:
        quantity = float(item_data.get('quantity', 1))
        unit_price = float(item_data['unit_price'])
        item = InvoiceItem(
            description=item_data['description'],
            quantity=quantity,
            unit_price=unit_price,
            total=quantity * unit_price,
        )
        invoice.items.append(item)

    invoice.calculate_totals()

    db.session.add(invoice)
    db.session.commit()

    return jsonify({'message': 'Facture créée', 'invoice': invoice.to_dict()}), 201


@invoices_bp.route('/<int:invoice_id>', methods=['PUT'])
@jwt_required()
def update_invoice(invoice_id):
    """Modifier une facture (statut, notes, paiement)."""
    invoice = Invoice.query.get_or_404(invoice_id)
    data = request.get_json()

    if 'status' in data:
        invoice.status = data['status']
        if data['status'] == 'paid':
            invoice.payment_date = datetime.now(timezone.utc).date()
            invoice.payment_method = data.get('payment_method', 'virement')

    if 'notes' in data:
        invoice.notes = data['notes']

    db.session.commit()

    return jsonify({'message': 'Facture mise à jour', 'invoice': invoice.to_dict()}), 200


@invoices_bp.route('/<int:invoice_id>', methods=['DELETE'])
@jwt_required()
def delete_invoice(invoice_id):
    """Supprimer une facture (uniquement si brouillon)."""
    invoice = Invoice.query.get_or_404(invoice_id)
    if invoice.status not in ('draft',):
        return jsonify({'error': 'Seules les factures en brouillon peuvent être supprimées'}), 400
    db.session.delete(invoice)
    db.session.commit()
    return jsonify({'message': 'Facture supprimée'}), 200

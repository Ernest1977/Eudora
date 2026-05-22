"""
Routes Finance — Dashboard financier, stats, rapports (protégé par JWT)
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Invoice, Client
from datetime import datetime, timezone, timedelta
from sqlalchemy import func, extract

finance_bp = Blueprint('finance', __name__)


@finance_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    """Tableau de bord financier — chiffres clés."""
    now = datetime.now(timezone.utc)
    current_month = now.month
    current_year = now.year

    # Revenus totaux
    total_revenue = db.session.query(
        func.coalesce(func.sum(Invoice.total_amount), 0)
    ).filter(Invoice.status == 'paid').scalar()

    # Revenus du mois
    monthly_revenue = db.session.query(
        func.coalesce(func.sum(Invoice.total_amount), 0)
    ).filter(
        Invoice.status == 'paid',
        extract('month', Invoice.payment_date) == current_month,
        extract('year', Invoice.payment_date) == current_year,
    ).scalar()

    # Factures en attente
    pending_amount = db.session.query(
        func.coalesce(func.sum(Invoice.total_amount), 0)
    ).filter(Invoice.status.in_(['sent', 'overdue'])).scalar()

    # Compteurs
    total_clients = Client.query.count()
    total_invoices = Invoice.query.count()
    paid_invoices = Invoice.query.filter_by(status='paid').count()
    overdue_invoices = Invoice.query.filter_by(status='overdue').count()

    return jsonify({
        'total_revenue': round(float(total_revenue), 2),
        'monthly_revenue': round(float(monthly_revenue), 2),
        'pending_amount': round(float(pending_amount), 2),
        'total_clients': total_clients,
        'total_invoices': total_invoices,
        'paid_invoices': paid_invoices,
        'overdue_invoices': overdue_invoices,
    }), 200


@finance_bp.route('/monthly', methods=['GET'])
@jwt_required()
def monthly_stats():
    """Revenus mensuels des 12 derniers mois."""
    now = datetime.now(timezone.utc)
    months = []

    for i in range(11, -1, -1):
        date = now - timedelta(days=i * 30)
        month = date.month
        year = date.year

        revenue = db.session.query(
            func.coalesce(func.sum(Invoice.total_amount), 0)
        ).filter(
            Invoice.status == 'paid',
            extract('month', Invoice.payment_date) == month,
            extract('year', Invoice.payment_date) == year,
        ).scalar()

        months.append({
            'month': f"{year}-{month:02d}",
            'revenue': round(float(revenue), 2),
        })

    return jsonify({'months': months}), 200


@finance_bp.route('/top-clients', methods=['GET'])
@jwt_required()
def top_clients():
    """Top 10 des meilleurs clients par chiffre d'affaires."""
    limit = request.args.get('limit', 10, type=int)

    results = db.session.query(
        Client.id,
        Client.first_name,
        Client.last_name,
        Client.email,
        func.coalesce(func.sum(Invoice.total_amount), 0).label('total')
    ).join(Invoice, Client.id == Invoice.client_id) \
     .filter(Invoice.status == 'paid') \
     .group_by(Client.id) \
     .order_by(func.sum(Invoice.total_amount).desc()) \
     .limit(limit) \
     .all()

    clients = [{
        'id': r.id,
        'name': f"{r.first_name} {r.last_name}",
        'email': r.email,
        'total_spent': round(float(r.total), 2),
    } for r in results]

    return jsonify({'top_clients': clients}), 200

from app import db
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
import uuid


def utcnow():
    """Retourne l'heure UTC actuelle (compatible Python 3.12+)."""
    return datetime.now(timezone.utc)


# ============================================
# MODÈLE UTILISATEUR (Admin)
# ============================================

class User(db.Model):
    """Modèle Admin / Staff."""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='admin')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utcnow)
    last_login = db.Column(db.DateTime)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'uuid': self.uuid,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ============================================
# MODÈLES CMS (Contenu dynamique du site)
# ============================================

class SiteSettings(db.Model):
    """Paramètres globaux du site (nom, téléphone, email, réseaux sociaux, etc.)."""
    __tablename__ = 'site_settings'

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text, nullable=False, default='')
    description = db.Column(db.String(255))
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'key': self.key,
            'value': self.value,
            'description': self.description,
        }


class HeroSection(db.Model):
    """Section Hero — contenu dynamique multilingue."""
    __tablename__ = 'hero_section'

    id = db.Column(db.Integer, primary_key=True)
    tagline_fr = db.Column(db.String(200), default='')
    tagline_en = db.Column(db.String(200), default='')
    tagline_it = db.Column(db.String(200), default='')
    title_fr = db.Column(db.String(300), default='')
    title_en = db.Column(db.String(300), default='')
    title_it = db.Column(db.String(300), default='')
    subtitle_fr = db.Column(db.Text, default='')
    subtitle_en = db.Column(db.Text, default='')
    subtitle_it = db.Column(db.Text, default='')
    cta_primary_fr = db.Column(db.String(100), default='')
    cta_primary_en = db.Column(db.String(100), default='')
    cta_primary_it = db.Column(db.String(100), default='')
    cta_secondary_fr = db.Column(db.String(100), default='')
    cta_secondary_en = db.Column(db.String(100), default='')
    cta_secondary_it = db.Column(db.String(100), default='')
    background_image = db.Column(db.String(500), default='/images/hero-bg.jpg')
    stat1_value = db.Column(db.String(20), default='200+')
    stat1_label_fr = db.Column(db.String(100), default='Clientes')
    stat1_label_en = db.Column(db.String(100), default='Clients')
    stat1_label_it = db.Column(db.String(100), default='Clienti')
    stat2_value = db.Column(db.String(20), default='10')
    stat2_label_fr = db.Column(db.String(100), default="Ans d'exp.")
    stat2_label_en = db.Column(db.String(100), default='Years exp.')
    stat2_label_it = db.Column(db.String(100), default='Anni esp.')
    stat3_value = db.Column(db.String(20), default='98%')
    stat3_label_fr = db.Column(db.String(100), default='Satisfaction')
    stat3_label_en = db.Column(db.String(100), default='Satisfaction')
    stat3_label_it = db.Column(db.String(100), default='Soddisfazione')
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    def to_dict(self, lang='fr'):
        return {
            'id': self.id,
            'tagline': getattr(self, f'tagline_{lang}', self.tagline_fr),
            'title': getattr(self, f'title_{lang}', self.title_fr),
            'subtitle': getattr(self, f'subtitle_{lang}', self.subtitle_fr),
            'cta_primary': getattr(self, f'cta_primary_{lang}', self.cta_primary_fr),
            'cta_secondary': getattr(self, f'cta_secondary_{lang}', self.cta_secondary_fr),
            'background_image': self.background_image,
            'stats': [
                {'value': self.stat1_value, 'label': getattr(self, f'stat1_label_{lang}', self.stat1_label_fr)},
                {'value': self.stat2_value, 'label': getattr(self, f'stat2_label_{lang}', self.stat2_label_fr)},
                {'value': self.stat3_value, 'label': getattr(self, f'stat3_label_{lang}', self.stat3_label_fr)},
            ],
        }

    def to_full_dict(self):
        """Retourne toutes les langues (pour l'admin)."""
        d = {}
        for col in self.__table__.columns:
            d[col.name] = getattr(self, col.name)
            if isinstance(d[col.name], datetime):
                d[col.name] = d[col.name].isoformat()
        return d


class AboutSection(db.Model):
    """Section À propos — contenu dynamique multilingue."""
    __tablename__ = 'about_section'

    id = db.Column(db.Integer, primary_key=True)
    label_fr = db.Column(db.String(100), default='')
    label_en = db.Column(db.String(100), default='')
    label_it = db.Column(db.String(100), default='')
    title_fr = db.Column(db.String(300), default='')
    title_en = db.Column(db.String(300), default='')
    title_it = db.Column(db.String(300), default='')
    subtitle_fr = db.Column(db.String(300), default='')
    subtitle_en = db.Column(db.String(300), default='')
    subtitle_it = db.Column(db.String(300), default='')
    paragraph1_fr = db.Column(db.Text, default='')
    paragraph1_en = db.Column(db.Text, default='')
    paragraph1_it = db.Column(db.Text, default='')
    paragraph2_fr = db.Column(db.Text, default='')
    paragraph2_en = db.Column(db.Text, default='')
    paragraph2_it = db.Column(db.Text, default='')
    paragraph3_fr = db.Column(db.Text, default='')
    paragraph3_en = db.Column(db.Text, default='')
    paragraph3_it = db.Column(db.Text, default='')
    portrait_image = db.Column(db.String(500), default='/images/about-portrait.jpg')
    cta_fr = db.Column(db.String(100), default='')
    cta_en = db.Column(db.String(100), default='')
    cta_it = db.Column(db.String(100), default='')
    stat1_value = db.Column(db.String(20), default='200+')
    stat1_label_fr = db.Column(db.String(100), default='')
    stat1_label_en = db.Column(db.String(100), default='')
    stat1_label_it = db.Column(db.String(100), default='')
    stat2_value = db.Column(db.String(20), default='10+')
    stat2_label_fr = db.Column(db.String(100), default='')
    stat2_label_en = db.Column(db.String(100), default='')
    stat2_label_it = db.Column(db.String(100), default='')
    stat3_value = db.Column(db.String(20), default='98%')
    stat3_label_fr = db.Column(db.String(100), default='')
    stat3_label_en = db.Column(db.String(100), default='')
    stat3_label_it = db.Column(db.String(100), default='')
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    def to_dict(self, lang='fr'):
        return {
            'id': self.id,
            'label': getattr(self, f'label_{lang}', self.label_fr),
            'title': getattr(self, f'title_{lang}', self.title_fr),
            'subtitle': getattr(self, f'subtitle_{lang}', self.subtitle_fr),
            'p1': getattr(self, f'paragraph1_{lang}', self.paragraph1_fr),
            'p2': getattr(self, f'paragraph2_{lang}', self.paragraph2_fr),
            'p3': getattr(self, f'paragraph3_{lang}', self.paragraph3_fr),
            'portrait_image': self.portrait_image,
            'cta': getattr(self, f'cta_{lang}', self.cta_fr),
            'stats': {
                'clients': {'value': self.stat1_value, 'label': getattr(self, f'stat1_label_{lang}', self.stat1_label_fr)},
                'years': {'value': self.stat2_value, 'label': getattr(self, f'stat2_label_{lang}', self.stat2_label_fr)},
                'satisfaction': {'value': self.stat3_value, 'label': getattr(self, f'stat3_label_{lang}', self.stat3_label_fr)},
            },
        }

    def to_full_dict(self):
        d = {}
        for col in self.__table__.columns:
            d[col.name] = getattr(self, col.name)
            if isinstance(d[col.name], datetime):
                d[col.name] = d[col.name].isoformat()
        return d


class Service(db.Model):
    """Modèle Service / Prestation — affiché dans la section Services et Combo."""
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    sort_order = db.Column(db.Integer, default=0)
    icon = db.Column(db.String(10), default='✨')
    name_fr = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), default='')
    name_it = db.Column(db.String(100), default='')
    description_fr = db.Column(db.Text, default='')
    description_en = db.Column(db.Text, default='')
    description_it = db.Column(db.Text, default='')
    details_fr = db.Column(db.Text, default='')  # JSON array de strings
    details_en = db.Column(db.Text, default='')
    details_it = db.Column(db.Text, default='')
    duration = db.Column(db.String(20), default='')
    price = db.Column(db.Float, nullable=False, default=0)
    category = db.Column(db.String(50), default='standalone')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utcnow)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    def to_dict(self, lang='fr'):
        import json
        details_raw = getattr(self, f'details_{lang}', self.details_fr) or '[]'
        try:
            details = json.loads(details_raw)
        except (json.JSONDecodeError, TypeError):
            details = []

        return {
            'id': self.id,
            'sort_order': self.sort_order,
            'icon': self.icon,
            'name': getattr(self, f'name_{lang}', self.name_fr),
            'description': getattr(self, f'description_{lang}', self.description_fr),
            'details': details,
            'duration': self.duration,
            'price': self.price,
            'category': self.category,
            'is_active': self.is_active,
        }

    def to_full_dict(self):
        d = {}
        for col in self.__table__.columns:
            d[col.name] = getattr(self, col.name)
            if isinstance(d[col.name], datetime):
                d[col.name] = d[col.name].isoformat()
        return d


class Formula(db.Model):
    """Modèle Formule — packages affichés dans la section Formules."""
    __tablename__ = 'formulas'

    id = db.Column(db.Integer, primary_key=True)
    sort_order = db.Column(db.Integer, default=0)
    name_fr = db.Column(db.String(100), nullable=False)
    name_en = db.Column(db.String(100), default='')
    name_it = db.Column(db.String(100), default='')
    duration_fr = db.Column(db.String(100), default='')
    duration_en = db.Column(db.String(100), default='')
    duration_it = db.Column(db.String(100), default='')
    price = db.Column(db.Float, nullable=True)  # null = sur devis
    features_fr = db.Column(db.Text, default='[]')  # JSON array
    features_en = db.Column(db.Text, default='[]')
    features_it = db.Column(db.Text, default='[]')
    is_popular = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utcnow)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    def to_dict(self, lang='fr'):
        import json
        features_raw = getattr(self, f'features_{lang}', self.features_fr) or '[]'
        try:
            features = json.loads(features_raw)
        except (json.JSONDecodeError, TypeError):
            features = []

        return {
            'id': self.id,
            'sort_order': self.sort_order,
            'name': getattr(self, f'name_{lang}', self.name_fr),
            'duration': getattr(self, f'duration_{lang}', self.duration_fr),
            'price': str(int(self.price)) if self.price else None,
            'features': features,
            'popular': self.is_popular,
            'is_active': self.is_active,
        }

    def to_full_dict(self):
        d = {}
        for col in self.__table__.columns:
            d[col.name] = getattr(self, col.name)
            if isinstance(d[col.name], datetime):
                d[col.name] = d[col.name].isoformat()
        return d


class Testimonial(db.Model):
    """Modèle Témoignage."""
    __tablename__ = 'testimonials'

    id = db.Column(db.Integer, primary_key=True)
    sort_order = db.Column(db.Integer, default=0)
    name = db.Column(db.String(100), nullable=False)
    role_fr = db.Column(db.String(100), default='')
    role_en = db.Column(db.String(100), default='')
    role_it = db.Column(db.String(100), default='')
    text_fr = db.Column(db.Text, default='')
    text_en = db.Column(db.Text, default='')
    text_it = db.Column(db.Text, default='')
    rating = db.Column(db.Integer, default=5)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utcnow)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    def to_dict(self, lang='fr'):
        return {
            'id': self.id,
            'name': self.name,
            'role': getattr(self, f'role_{lang}', self.role_fr),
            'text': getattr(self, f'text_{lang}', self.text_fr),
            'rating': self.rating,
        }

    def to_full_dict(self):
        d = {}
        for col in self.__table__.columns:
            d[col.name] = getattr(self, col.name)
            if isinstance(d[col.name], datetime):
                d[col.name] = d[col.name].isoformat()
        return d


class GalleryImage(db.Model):
    """Image de la galerie."""
    __tablename__ = 'gallery_images'

    id = db.Column(db.Integer, primary_key=True)
    sort_order = db.Column(db.Integer, default=0)
    src = db.Column(db.String(500), nullable=False)
    title_fr = db.Column(db.String(200), default='')
    title_en = db.Column(db.String(200), default='')
    title_it = db.Column(db.String(200), default='')
    category_fr = db.Column(db.String(100), default='')
    category_en = db.Column(db.String(100), default='')
    category_it = db.Column(db.String(100), default='')
    is_tall = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=utcnow)

    def to_dict(self, lang='fr'):
        return {
            'id': self.id,
            'src': self.src,
            'title': getattr(self, f'title_{lang}', self.title_fr),
            'category': getattr(self, f'category_{lang}', self.category_fr),
            'is_tall': self.is_tall,
        }

    def to_full_dict(self):
        d = {}
        for col in self.__table__.columns:
            d[col.name] = getattr(self, col.name)
            if isinstance(d[col.name], datetime):
                d[col.name] = d[col.name].isoformat()
        return d


# ============================================
# MODÈLES MÉTIER (Clients, Factures, Contact)
# ============================================

class Client(db.Model):
    """Modèle Client."""
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    city = db.Column(db.String(80))
    country = db.Column(db.String(80), default='France')
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')
    preferred_language = db.Column(db.String(5), default='fr')
    created_at = db.Column(db.DateTime, default=utcnow)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    invoices = db.relationship('Invoice', backref='client', lazy='dynamic')

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def total_spent(self):
        return sum(inv.total_amount for inv in self.invoices if inv.status == 'paid')

    def to_dict(self):
        return {
            'id': self.id,
            'uuid': self.uuid,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'country': self.country,
            'notes': self.notes,
            'status': self.status,
            'preferred_language': self.preferred_language,
            'total_spent': self.total_spent,
            'invoices_count': self.invoices.count(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Invoice(db.Model):
    """Modèle Facture."""
    __tablename__ = 'invoices'

    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(20), unique=True, nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)
    issue_date = db.Column(db.Date, default=lambda: utcnow().date())
    due_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='draft')
    subtotal = db.Column(db.Float, default=0.0)
    tva_rate = db.Column(db.Float, default=0.20)
    tva_amount = db.Column(db.Float, default=0.0)
    total_amount = db.Column(db.Float, default=0.0)
    payment_method = db.Column(db.String(50))
    payment_date = db.Column(db.Date)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=utcnow)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    items = db.relationship('InvoiceItem', backref='invoice', cascade='all, delete-orphan')

    def calculate_totals(self):
        self.subtotal = sum(item.total for item in self.items)
        self.tva_amount = self.subtotal * self.tva_rate
        self.total_amount = self.subtotal + self.tva_amount

    def to_dict(self):
        return {
            'id': self.id,
            'invoice_number': self.invoice_number,
            'client_id': self.client_id,
            'client_name': self.client.full_name if self.client else None,
            'issue_date': self.issue_date.isoformat() if self.issue_date else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status,
            'subtotal': self.subtotal,
            'tva_rate': self.tva_rate,
            'tva_amount': self.tva_amount,
            'total_amount': self.total_amount,
            'payment_method': self.payment_method,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'notes': self.notes,
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class InvoiceItem(db.Model):
    """Ligne de facture."""
    __tablename__ = 'invoice_items'

    id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoices.id'), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Float, default=1.0)
    unit_price = db.Column(db.Float, nullable=False)
    total = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'total': self.total,
        }


class ContactMessage(db.Model):
    """Messages du formulaire de contact."""
    __tablename__ = 'contact_messages'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    service = db.Column(db.String(100))
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'service': self.service,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

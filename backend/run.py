"""
Point d'entrée de l'application Flask.

Usage:
  Développement : python run.py
  Production    : gunicorn --bind 0.0.0.0:5000 run:app
"""
import os
import sys

# Ajouter le dossier backend au path
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app, db
from app.models import User

app = create_app()


@app.cli.command('create-admin')
def create_admin():
    """Créer le premier utilisateur admin.
    Usage: flask create-admin
    """
    import getpass

    username = input("Nom d'utilisateur admin : ").strip()
    email = input("Email admin : ").strip()
    password = getpass.getpass("Mot de passe : ")
    confirm = getpass.getpass("Confirmer le mot de passe : ")

    if password != confirm:
        print("❌ Les mots de passe ne correspondent pas.")
        return

    if User.query.filter_by(username=username).first():
        print(f"❌ L'utilisateur '{username}' existe déjà.")
        return

    user = User(username=username, email=email, role='admin')
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    print(f"✅ Admin '{username}' créé avec succès !")


@app.cli.command('seed-services')
def seed_services():
    """Insérer les services par défaut en base.
    Usage: flask seed-services
    """
    from app.models import Service

    services_data = [
        {'name_fr': 'Colorimétrie', 'name_en': 'Color Analysis', 'name_it': 'Colorimetria', 'price': 120, 'duration': '1h30', 'icon': '🎨', 'category': 'standalone'},
        {'name_fr': 'Visagisme', 'name_en': 'Face Shape Analysis', 'name_it': 'Visagismo', 'price': 80, 'duration': '1h00', 'icon': '✨', 'category': 'standalone'},
        {'name_fr': 'Auto-Maquillage', 'name_en': 'Self-Makeup', 'name_it': 'Auto-Trucco', 'price': 120, 'duration': '1h30', 'icon': '💄', 'category': 'standalone'},
        {'name_fr': 'Morphologie & Style', 'name_en': 'Morphology & Style', 'name_it': 'Morfologia & Stile', 'price': 120, 'duration': '1h30', 'icon': '👗', 'category': 'standalone'},
        {'name_fr': 'Tri du Dressing', 'name_en': 'Wardrobe Edit', 'name_it': 'Riordino Guardaroba', 'price': 200, 'duration': '3h00', 'icon': '👔', 'category': 'standalone'},
        {'name_fr': 'Shopping Accompagné', 'name_en': 'Personal Shopping', 'name_it': 'Shopping Assistito', 'price': 200, 'duration': '3h00', 'icon': '🛍️', 'category': 'standalone'},
    ]

    count = 0
    for data in services_data:
        if not Service.query.filter_by(name_fr=data['name_fr']).first():
            service = Service(**data)
            db.session.add(service)
            count += 1

    db.session.commit()
    print(f"✅ {count} services insérés en base.")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

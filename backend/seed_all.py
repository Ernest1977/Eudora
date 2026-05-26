"""
Script de seed — Insère tout le contenu du site dans la base de données.
Usage :
  cd backend
  FLASK_APP=run.py flask seed-all

  Ou depuis Docker :
  docker compose exec backend flask seed-all
"""
import json


def register_seed_command(app):
    """Enregistre la commande CLI 'seed-all' dans l'application Flask."""
    from app import db
    from app.models import (
        SiteSettings, HeroSection, AboutSection,
        Service, Formula, Testimonial, GalleryImage
    )

    @app.cli.command('seed-all')
    def seed_all():
        """Insérer tout le contenu du site dans la base de données."""
        print("🌱 Seed de la base de données...")

        # ==========================================
        # SITE SETTINGS
        # ==========================================
        settings = {
            'site_name': 'Eudora Conseil & Relooking',
            'email': 'info@ecrelooking.com',
            'phone': '+39 327 225 0364',
            'location': 'Turin, Italie — Europe',
            'hours': 'Lun–Ven : 9h–19h',
            'facebook_url': 'https://www.facebook.com/share/18bhjh6RqL/?mibextid=wwXIfr',
            'instagram_url': 'https://www.instagram.com/eudoraconsulting?igsh=MXFhMWJhenZ6ZHZ3dw%3D%3D&utm_source=qr',
            'linkedin_url': 'https://www.linkedin.com/in/eudoxie-mahude-gbebioho-9127b0b8?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
            'tiktok_url': 'https://www.tiktok.com/@eudoxiemao?_r=1&_t=ZS-96ONFaQw360',
            'company_siret': '',
            'tva_rate': '22',
        }
        for key, value in settings.items():
            if not SiteSettings.query.filter_by(key=key).first():
                db.session.add(SiteSettings(key=key, value=value))
        db.session.commit()
        print("  ✅ Settings insérés")

        # ==========================================
        # HERO SECTION
        # ==========================================
        if not HeroSection.query.first():
            hero = HeroSection(
                tagline_fr="Conseil en Image & Relooking",
                tagline_en="Image Consulting & Makeover",
                tagline_it="Consulenza d'Immagine & Restyling",
                title_fr="Révélez votre\nStyle Signature",
                title_en="Reveal Your\nSignature Style",
                title_it="Rivela il Tuo\nStile Firma",
                subtitle_fr="Des accompagnements sur mesure pour sublimer votre image, renforcer votre confiance et révéler votre singularité.",
                subtitle_en="Bespoke accompaniment to elevate your image, boost your confidence and reveal your singularity.",
                subtitle_it="Accompagnamenti su misura per valorizzare la tua immagine, rafforzare la tua fiducia e rivelare la tua singolarità.",
                cta_primary_fr="Découvrir mes offres", cta_primary_en="Explore my offers", cta_primary_it="Scopri le mie offerte",
                cta_secondary_fr="En savoir plus", cta_secondary_en="Learn more", cta_secondary_it="Saperne di più",
                background_image="/images/hero-bg.jpg",
                stat1_value="200+", stat1_label_fr="Clientes", stat1_label_en="Clients", stat1_label_it="Clienti",
                stat2_value="10", stat2_label_fr="Ans d'exp.", stat2_label_en="Years exp.", stat2_label_it="Anni esp.",
                stat3_value="98%", stat3_label_fr="Satisfaction", stat3_label_en="Satisfaction", stat3_label_it="Soddisfazione",
            )
            db.session.add(hero)
            db.session.commit()
            print("  ✅ Hero inséré")

        # ==========================================
        # ABOUT SECTION
        # ==========================================
        if not AboutSection.query.first():
            about = AboutSection(
                label_fr="À Propos", label_en="About", label_it="Chi Sono",
                title_fr="Eudora Conseil & Relooking", title_en="Eudora Conseil & Relooking", title_it="Eudora Conseil & Relooking",
                subtitle_fr="Votre experte en image personnelle", subtitle_en="Your personal image expert", subtitle_it="La tua esperta in immagine personale",
                paragraph1_fr="Conseillère en image certifiée, je suis passionnée par le pouvoir transformateur du style et de l'apparence. Mon approche holistique combine colorimétrie, morphologie et analyse de personnalité pour créer votre image authentique.",
                paragraph1_en="As a certified image consultant, I am passionate about the transformative power of style and appearance. My holistic approach combines colorimetry, morphology and personality analysis to create your authentic image.",
                paragraph1_it="Consulente d'immagine certificata, sono appassionata del potere trasformatore dello stile e dell'apparenza. Il mio approccio olistico combina colorimetria, morfologia e analisi della personalità per creare la tua immagine autentica.",
                paragraph2_fr="Avec plus de 10 ans d'expérience dans le conseil en image et la mode, j'accompagne femmes et hommes dans la révélation de leur style signature — celui qui leur ressemble vraiment.",
                paragraph2_en="With over 10 years of experience in image consulting and fashion, I support women and men in revealing their signature style — one that truly reflects who they are.",
                paragraph2_it="Con oltre 10 anni di esperienza nella consulenza d'immagine e nella moda, accompagno donne e uomini nella rivelazione del loro stile firma — quello che li rappresenta davvero.",
                paragraph3_fr="Basée à Turin et disponible partout en Italie et en Europe, je vous offre un accompagnement personnalisé, bienveillant et professionnel.",
                paragraph3_en="Based in Turin and available throughout Italy and Europe, I offer you personalized, caring and professional support.",
                paragraph3_it="Basata a Torino e disponibile in tutta l'Italia e in Europa, offro un accompagnamento personalizzato, premuroso e professionale.",
                portrait_image="/images/about-portrait.jpg",
                cta_fr="Découvrir mon histoire", cta_en="Discover my story", cta_it="Scopri la mia storia",
                stat1_value="200+", stat1_label_fr="Clients accompagnés", stat1_label_en="Clients accompanied", stat1_label_it="Clienti accompagnati",
                stat2_value="10+", stat2_label_fr="Années d'expérience", stat2_label_en="Years of experience", stat2_label_it="Anni di esperienza",
                stat3_value="98%", stat3_label_fr="Satisfaction client", stat3_label_en="Client satisfaction", stat3_label_it="Soddisfazione clienti",
            )
            db.session.add(about)
            db.session.commit()
            print("  ✅ About inséré")

        # ==========================================
        # SERVICES
        # ==========================================
        if not Service.query.first():
            services_data = [
                {
                    'sort_order': 1, 'icon': '🎨', 'duration': '1h30', 'price': 120,
                    'name_fr': 'Colorimétrie', 'name_en': 'Color Analysis', 'name_it': 'Colorimetria',
                    'description_fr': 'Découvrez les couleurs qui vous valorisent le plus. Palette personnalisée incluse.',
                    'description_en': 'Discover the colors that enhance you most. Personalized palette included.',
                    'description_it': 'Scopri i colori che ti valorizzano di più. Palette personalizzata inclusa.',
                    'details_fr': json.dumps(["Analyse colorimétrique complète", "Palette de couleurs personnalisée", "Conseils maquillage et accessoires", "Book personnalisé remis en fin de séance"]),
                    'details_en': json.dumps(["Complete color analysis", "Personalized color palette", "Makeup and accessories advice", "Personalized book provided"]),
                    'details_it': json.dumps(["Analisi colorimetrica completa", "Palette di colori personalizzata", "Consigli trucco e accessori", "Book personalizzato consegnato"]),
                },
                {
                    'sort_order': 2, 'icon': '✨', 'duration': '1h00', 'price': 80,
                    'name_fr': 'Visagisme', 'name_en': 'Face Shape Analysis', 'name_it': 'Visagismo',
                    'description_fr': 'Coupe et coloration idéales selon la morphologie de votre visage.',
                    'description_en': 'Ideal cut and color according to the morphology of your face.',
                    'description_it': 'Taglio e colore ideali secondo la morfologia del tuo viso.',
                    'details_fr': json.dumps(["Diagnostic complet des cheveux", "Analyse morphologique du visage", "Coupes et colorations recommandées", "Routine capillaire personnalisée"]),
                    'details_en': json.dumps(["Complete hair diagnosis", "Face morphological analysis", "Recommended cuts and colors", "Personalized hair routine"]),
                    'details_it': json.dumps(["Diagnosi completa dei capelli", "Analisi morfologica del viso", "Tagli e colori raccomandati", "Routine capillare personalizzata"]),
                },
                {
                    'sort_order': 3, 'icon': '💄', 'duration': '1h30', 'price': 120,
                    'name_fr': 'Auto-Maquillage', 'name_en': 'Self-Makeup', 'name_it': 'Auto-Trucco',
                    'description_fr': "Apprenez à vous mettre en valeur au quotidien avec un maquillage adapté.",
                    'description_en': 'Learn to enhance yourself daily with adapted makeup.',
                    'description_it': 'Impara a valorizzarti quotidianamente con un trucco adatto.',
                    'details_fr': json.dumps(["Diagnostic de type de peau", "Teintes adaptées à votre colorimétrie", "Techniques de maquillage personnalisées", "Tri de la trousse à maquillage"]),
                    'details_en': json.dumps(["Skin type diagnosis", "Shades adapted to your colorimetry", "Personalized makeup techniques", "Makeup bag sorting"]),
                    'details_it': json.dumps(["Diagnosi del tipo di pelle", "Tonalità adatte alla tua colorimetria", "Tecniche di trucco personalizzate", "Riordino del kit trucchi"]),
                },
                {
                    'sort_order': 4, 'icon': '👗', 'duration': '1h30', 'price': 120,
                    'name_fr': 'Morphologie & Style', 'name_en': 'Morphology & Style', 'name_it': 'Morfologia & Stile',
                    'description_fr': "Découvrez vos atouts et votre univers de style pour un dressing cohérent.",
                    'description_en': 'Discover your assets and style universe for a coherent wardrobe.',
                    'description_it': 'Scopri i tuoi punti di forza e il tuo universo di stile.',
                    'details_fr': json.dumps(["Analyse de votre morphologie", "Découverte de votre univers de style", "Coupes et matières à privilégier", "Conseils shopping responsable"]),
                    'details_en': json.dumps(["Body morphology analysis", "Style universe discovery", "Cuts and fabrics to prioritize", "Responsible shopping advice"]),
                    'details_it': json.dumps(["Analisi della morfologia corporea", "Scoperta del tuo universo di stile", "Tagli e tessuti da privilegiare", "Consigli shopping responsabile"]),
                },
                {
                    'sort_order': 5, 'icon': '👔', 'duration': '3h00', 'price': 200,
                    'name_fr': 'Tri du Dressing', 'name_en': 'Wardrobe Edit', 'name_it': 'Riordino Guardaroba',
                    'description_fr': "Optimisez votre garde-robe et créez des looks avec vos pièces existantes.",
                    'description_en': 'Optimize your wardrobe and create looks with your existing pieces.',
                    'description_it': 'Ottimizza il tuo guardaroba e crea look con i capi esistenti.',
                    'details_fr': json.dumps(["Tri selon morphologie et colorimétrie", "Optimisation de l'espace dressing", "Création de nouveaux looks", "Identification des basiques manquants"]),
                    'details_en': json.dumps(["Sort by morphology and colorimetry", "Wardrobe space optimization", "Creating new looks", "Identifying missing basics"]),
                    'details_it': json.dumps(["Selezione per morfologia e colorimetria", "Ottimizzazione spazio guardaroba", "Creazione di nuovi look", "Identificazione dei basic mancanti"]),
                },
                {
                    'sort_order': 6, 'icon': '🛍️', 'duration': '3h00', 'price': 200,
                    'name_fr': 'Shopping Accompagné', 'name_en': 'Personal Shopping', 'name_it': 'Shopping Assistito',
                    'description_fr': "Je vous accompagne en boutique pour trouver les pièces parfaites.",
                    'description_en': 'I accompany you in stores to find the perfect pieces.',
                    'description_it': 'Ti accompagno in boutique per trovare i capi perfetti.',
                    'details_fr': json.dumps(["Bilan image préalable", "Sélection de pièces adaptées", "Découverte de nouvelles enseignes", "Book de conseils remis en fin de séance"]),
                    'details_en': json.dumps(["Prior image assessment", "Selection of adapted pieces", "Discovery of new brands", "Advice book provided"]),
                    'details_it': json.dumps(["Valutazione immagine preliminare", "Selezione di capi adatti", "Scoperta di nuovi brand", "Book di consigli consegnato"]),
                },
            ]
            for data in services_data:
                db.session.add(Service(**data))
            db.session.commit()
            print("  ✅ 6 Services insérés")

        # ==========================================
        # FORMULES
        # ==========================================
        if not Formula.query.first():
            formulas_data = [
                {
                    'sort_order': 1, 'price': 730, 'is_popular': False,
                    'name_fr': 'MORPHOLOGIE', 'name_en': 'MORPHOLOGY', 'name_it': 'MORFOLOGIA',
                    'duration_fr': '8h00 / 3 séances', 'duration_en': '8h / 3 sessions', 'duration_it': '8h / 3 sessioni',
                    'features_fr': json.dumps(["Bilan image complet", "Test de colorimétrie", "Analyse de la morphologie", "Découverte de l'univers de style", "Conseils personnalisés silhouette", "Tri du dressing", "Accompagnement shopping", "Books personnalisés remis"]),
                    'features_en': json.dumps(["Complete image assessment", "Color analysis test", "Morphology analysis", "Style universe discovery", "Personalized silhouette advice", "Wardrobe edit", "Personal shopping", "Personalized books provided"]),
                    'features_it': json.dumps(["Valutazione immagine completa", "Test di colorimetria", "Analisi della morfologia", "Scoperta universo di stile", "Consigli personalizzati silhouette", "Riordino guardaroba", "Shopping assistito", "Book personalizzati consegnati"]),
                },
                {
                    'sort_order': 2, 'price': 420, 'is_popular': False,
                    'name_fr': 'VISAGISME', 'name_en': 'FACE SHAPE', 'name_it': 'VISAGISMO',
                    'duration_fr': '6h00 / 3 séances', 'duration_en': '6h / 3 sessions', 'duration_it': '6h / 3 sessioni',
                    'features_fr': json.dumps(["Bilan image", "Test de colorimétrie", "Recommandation soins de peau", "Cours d'auto-maquillage", "Analyse morphologie du visage", "Conseils coupe / coloration", "Routine cheveux + soins adaptés", "RDV chez coiffeur partenaire"]),
                    'features_en': json.dumps(["Image assessment", "Color analysis test", "Skin care recommendations", "Self-makeup course", "Face morphology analysis", "Cut / color advice", "Hair + care routine", "Appointment at partner hairdresser"]),
                    'features_it': json.dumps(["Valutazione immagine", "Test di colorimetria", "Raccomandazioni skincare", "Corso di auto-trucco", "Analisi morfologia viso", "Consigli taglio / colore", "Routine capelli + cura adatta", "Appuntamento da parrucchiere partner"]),
                },
                {
                    'sort_order': 3, 'price': 980, 'is_popular': True,
                    'name_fr': 'COMPLET', 'name_en': 'COMPLETE', 'name_it': 'COMPLETO',
                    'duration_fr': '10h00 / 5 séances', 'duration_en': '10h / 5 sessions', 'duration_it': '10h / 5 sessioni',
                    'features_fr': json.dumps(["Bilan image complet", "Test de colorimétrie", "Cours d'auto-maquillage", "Analyse morphologie visage et corps", "Conseils coupe / coloration", "Routine cheveux + soins", "RDV chez coiffeur partenaire", "Tri du dressing", "Accompagnement shopping", "Books personnalisés complets"]),
                    'features_en': json.dumps(["Complete image assessment", "Color analysis test", "Self-makeup course", "Face and body morphology analysis", "Cut / color advice", "Hair + care routine", "Appointment at partner hairdresser", "Wardrobe edit", "Personal shopping", "Complete personalized books"]),
                    'features_it': json.dumps(["Valutazione immagine completa", "Test di colorimetria", "Corso di auto-trucco", "Analisi morfologia viso e corpo", "Consigli taglio / colore", "Routine capelli + cura", "Appuntamento da parrucchiere partner", "Riordino guardaroba", "Shopping assistito", "Book personalizzati completi"]),
                },
                {
                    'sort_order': 4, 'price': None, 'is_popular': False,
                    'name_fr': 'SUR MESURE', 'name_en': 'BESPOKE', 'name_it': 'SU MISURA',
                    'duration_fr': 'Durée à définir', 'duration_en': 'Duration to define', 'duration_it': 'Durata da definire',
                    'features_fr': json.dumps(["Formule 100% personnalisée", "Prestations selon vos besoins", "Flexibilité totale", "Accompagnement adapté", "Prix sur devis"]),
                    'features_en': json.dumps(["100% personalized package", "Services tailored to your needs", "Total flexibility", "Adapted support", "Price on quote"]),
                    'features_it': json.dumps(["Formula 100% personalizzata", "Servizi adatti alle tue esigenze", "Flessibilità totale", "Accompagnamento adattato", "Prezzo su preventivo"]),
                },
            ]
            for data in formulas_data:
                db.session.add(Formula(**data))
            db.session.commit()
            print("  ✅ 4 Formules insérées")

        # ==========================================
        # TESTIMONIALS
        # ==========================================
        if not Testimonial.query.first():
            testimonials_data = [
                {
                    'sort_order': 1, 'name': 'Sophie M.', 'rating': 5,
                    'role_fr': 'Directrice Marketing', 'role_en': 'Marketing Director', 'role_it': 'Direttrice Marketing',
                    'text_fr': "Eudora a totalement transformé mon rapport à ma garde-robe. Je me sens enfin alignée entre qui je suis et ce que je projette. Un accompagnement d'une rare qualité !",
                    'text_en': "Eudora completely transformed my relationship with my wardrobe. I finally feel aligned between who I am and what I project. An accompaniment of rare quality!",
                    'text_it': "Eudora ha completamente trasformato il mio rapporto con il guardaroba. Mi sento finalmente allineata tra chi sono e ciò che proietto. Un accompagnamento di rara qualità!",
                },
                {
                    'sort_order': 2, 'name': 'Laure D.', 'rating': 5,
                    'role_fr': 'Avocate', 'role_en': 'Lawyer', 'role_it': 'Avvocatessa',
                    'text_fr': "La séance de colorimétrie a été une révélation. Je ne portais que des couleurs qui ne me mettaient pas en valeur. Aujourd'hui, chaque matin est un plaisir.",
                    'text_en': "The color analysis session was a revelation. I was only wearing colors that didn't enhance me. Today, every morning is a pleasure.",
                    'text_it': "La sessione di colorimetria è stata una rivelazione. Indossavo solo colori che non mi valorizzavano. Oggi, ogni mattina è un piacere.",
                },
                {
                    'sort_order': 3, 'name': 'Amina K.', 'rating': 5,
                    'role_fr': 'Entrepreneur', 'role_en': 'Entrepreneur', 'role_it': 'Imprenditrice',
                    'text_fr': "Le programme complet a changé ma vie professionnelle. Mon image est maintenant cohérente avec mon ambition. Merci Eudora pour cette transformation !",
                    'text_en': "The complete program changed my professional life. My image is now consistent with my ambition. Thank you Eudora for this transformation!",
                    'text_it': "Il programma completo ha cambiato la mia vita professionale. La mia immagine è ora coerente con la mia ambizione. Grazie Eudora per questa trasformazione!",
                },
                {
                    'sort_order': 4, 'name': 'Céline R.', 'rating': 5,
                    'role_fr': 'Professeure', 'role_en': 'Teacher', 'role_it': 'Insegnante',
                    'text_fr': "J'avais peur de ne pas me reconnaître après le relooking. Mais Eudora a su respecter ma personnalité tout en la sublimant. Je me sens vraiment moi-même.",
                    'text_en': "I was afraid of not recognizing myself after the makeover. But Eudora knew how to respect my personality while enhancing it. I really feel like myself.",
                    'text_it': "Avevo paura di non riconoscermi dopo il restyling. Ma Eudora ha saputo rispettare la mia personalità valorizzandola. Mi sento davvero me stessa.",
                },
            ]
            for data in testimonials_data:
                db.session.add(Testimonial(**data))
            db.session.commit()
            print("  ✅ 4 Témoignages insérés")

        # ==========================================
        # GALLERY
        # ==========================================
        if not GalleryImage.query.first():
            gallery_data = [
                {'sort_order': 1, 'src': '/images/gallery-1.jpg', 'title_fr': 'Tri du Dressing', 'title_en': 'Wardrobe Edit', 'title_it': 'Riordino Guardaroba', 'category_fr': 'Dressing', 'category_en': 'Dressing', 'category_it': 'Guardaroba', 'is_tall': True},
                {'sort_order': 2, 'src': '/images/gallery-2.jpg', 'title_fr': 'Consultation Style', 'title_en': 'Style Consultation', 'title_it': 'Consulenza Stile', 'category_fr': 'Styling', 'category_en': 'Styling', 'category_it': 'Styling', 'is_tall': False},
                {'sort_order': 3, 'src': '/images/gallery-3.jpg', 'title_fr': 'Séance Maquillage', 'title_en': 'Makeup Session', 'title_it': 'Sessione Trucco', 'category_fr': 'Beauté', 'category_en': 'Beauty', 'category_it': 'Bellezza', 'is_tall': False},
                {'sort_order': 4, 'src': '/images/gallery-4.jpg', 'title_fr': 'Shopping Accompagné', 'title_en': 'Personal Shopping', 'title_it': 'Shopping Assistito', 'category_fr': 'Shopping', 'category_en': 'Shopping', 'category_it': 'Shopping', 'is_tall': False},
                {'sort_order': 5, 'src': '/images/hero-bg.jpg', 'title_fr': 'Studio Conseil', 'title_en': 'Consulting Studio', 'title_it': 'Studio Consulenza', 'category_fr': 'Studio', 'category_en': 'Studio', 'category_it': 'Studio', 'is_tall': True},
                {'sort_order': 6, 'src': '/images/about-portrait.jpg', 'title_fr': 'Portrait Conseillère', 'title_en': 'Consultant Portrait', 'title_it': 'Ritratto Consulente', 'category_fr': 'Portrait', 'category_en': 'Portrait', 'category_it': 'Ritratto', 'is_tall': False},
            ]
            for data in gallery_data:
                db.session.add(GalleryImage(**data))
            db.session.commit()
            print("  ✅ 6 Images de galerie insérées")

        print("")
        print("🎉 Base de données peuplée avec succès !")
        print("   → Settings, Hero, About, Services, Formules, Témoignages, Galerie")

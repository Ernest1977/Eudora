import { useTranslation } from 'react-i18next';

// Social icons as SVG components
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const TiktokIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
  </svg>
);

const SOCIAL_LINKS = [
  { name: 'Facebook', url: 'https://www.facebook.com/share/18bhjh6RqL/?mibextid=wwXIfr', icon: <FacebookIcon /> },
  { name: 'Instagram', url: 'https://www.instagram.com/eudoraconsulting?igsh=MXFhMWJhenZ6ZHZ3dw%3D%3D&utm_source=qr', icon: <InstagramIcon /> },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/eudoxie-mahude-gbebioho-9127b0b8?utm_source=share_via&utm_content=profile&utm_medium=member_ios', icon: <LinkedinIcon /> },
  { name: 'TikTok', url: 'https://www.tiktok.com/@eudoxiemao?_r=1&_t=ZS-96ONFaQw360', icon: <TiktokIcon /> },
];

const navLinks = [
  { key: 'home', id: 'hero' },
  { key: 'about', id: 'about' },
  { key: 'services', id: 'services' },
  { key: 'formulas', id: 'formulas' },
  { key: 'combo', id: 'combo' },
  { key: 'testimonials', id: 'testimonials' },
  { key: 'gallery', id: 'gallery' },
  { key: 'contact', id: 'contact' },
];

export default function Footer() {
  const { t } = useTranslation();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2C1810] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div>
            <button onClick={() => scrollTo('hero')} className="flex items-center gap-3 mb-5 cursor-pointer">
              <img
                src="/images/eud-or.png"
                alt="Eudora Conseil & Relooking"
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </button>
            <div className="w-8 h-px bg-[#B8963E] mb-5" />
            <p className="font-['Cormorant_Garamond'] text-lg italic text-white/60 leading-relaxed">
              {t('footer.tagline')}
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 border border-white/20 hover:border-[#B8963E] hover:text-[#D4B483] flex items-center justify-center text-white/50 transition-all duration-300 rounded-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-['Lato'] text-[10px] tracking-[0.4em] uppercase text-[#B8963E] mb-6">
              {t('footer.links')}
            </h4>
            <ul className="space-y-3">
              {navLinks.map(link => (
                <li key={link.key}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="font-['Lato'] text-sm text-white/50 hover:text-[#D4B483] transition-colors cursor-pointer tracking-wide"
                  >
                    {t(`nav.${link.key}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact CTA */}
          <div>
            <h4 className="font-['Lato'] text-[10px] tracking-[0.4em] uppercase text-[#B8963E] mb-6">
              Newsletter
            </h4>
            <p className="font-['Lato'] text-sm text-white/50 leading-relaxed mb-5">
              Recevez mes conseils style exclusifs et les actualités de l'atelier.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 bg-white/10 border border-white/20 focus:border-[#B8963E] px-4 py-2.5 font-['Lato'] text-xs text-white placeholder-white/30 outline-none transition-colors rounded-sm"
              />
              <button className="bg-[#B8963E] hover:bg-[#9A7A2E] text-white px-4 py-2.5 font-['Lato'] text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer rounded-sm">
                OK
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="font-['Lato'] text-[10px] tracking-[0.15em] uppercase text-[#B8963E] mb-3">Contact Direct</p>
              <p className="font-['Lato'] text-sm text-white/50">info@ecrelooking.com</p>
              <p className="font-['Lato'] text-sm text-white/50">+39 327 225 0364</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-['Lato'] text-[10px] text-white/30 tracking-wider">
            {t('footer.legal')}
          </p>
          <div className="flex gap-4">
            <a href="#" className="font-['Lato'] text-[10px] text-white/30 hover:text-white/60 transition-colors tracking-wider">
              Mentions légales
            </a>
            <a href="#" className="font-['Lato'] text-[10px] text-white/30 hover:text-white/60 transition-colors tracking-wider">
              CGV
            </a>
            <a href="#" className="font-['Lato'] text-[10px] text-white/30 hover:text-white/60 transition-colors tracking-wider">
              Politique de confidentialité
            </a>
          </div>
          <p className="font-['Lato'] text-[10px] text-white/20">{t('footer.made')}</p>
        </div>
      </div>
    </footer>
  );
}

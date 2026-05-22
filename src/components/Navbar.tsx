import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';

const languages = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'it', label: 'IT', flag: '🇮🇹' },
];

const navKeys = ['home', 'about', 'services', 'formulas', 'combo', 'testimonials', 'gallery', 'contact'] as const;
const sectionIds = ['hero', 'about', 'services', 'formulas', 'combo', 'testimonials', 'gallery', 'contact'];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = sectionIds.map(id => document.getElementById(id));
      const scrollPos = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-3 cursor-pointer">
            <img
              src="/images/eud-or.png"
              alt="Eudora Conseil & Relooking"
              className="h-10 w-auto object-contain"
            />
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navKeys.map((key, i) => (
              <button
                key={key}
                onClick={() => scrollTo(sectionIds[i])}
                className={`font-['Lato'] text-xs tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                  activeSection === sectionIds[i]
                    ? 'text-[#B8963E]'
                    : 'text-[#4A3728] hover:text-[#B8963E]'
                }`}
              >
                {t(`nav.${key}`)}
              </button>
            ))}
          </div>

          {/* Right side: Lang + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-[#4A3728] hover:text-[#B8963E] transition-colors cursor-pointer"
              >
                <Globe size={14} />
                <span className="font-['Lato'] text-xs tracking-wider uppercase">{i18n.language.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-8 bg-white shadow-lg border border-[#E8DDD0] rounded-sm py-1 min-w-[80px]">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLang(lang.code)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-['Lato'] tracking-wider hover:bg-[#FAF7F2] transition-colors cursor-pointer ${
                        i18n.language === lang.code ? 'text-[#B8963E]' : 'text-[#4A3728]'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => scrollTo('contact')}
              className="bg-[#B8963E] text-white font-['Lato'] text-xs tracking-[0.2em] uppercase px-6 py-2.5 hover:bg-[#9A7A2E] transition-all duration-300 cursor-pointer"
            >
              {t('nav.book')}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="text-[#4A3728] cursor-pointer">
                <Globe size={18} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-8 bg-white shadow-lg border border-[#E8DDD0] rounded-sm py-1">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLang(lang.code)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-['Lato'] text-[#4A3728] hover:bg-[#FAF7F2] cursor-pointer"
                    >
                      <span>{lang.flag}</span><span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#4A3728] cursor-pointer">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-t border-[#E8DDD0] px-6 py-6">
          <div className="flex flex-col gap-4">
            {navKeys.map((key, i) => (
              <button
                key={key}
                onClick={() => scrollTo(sectionIds[i])}
                className="font-['Lato'] text-sm tracking-[0.15em] uppercase text-[#4A3728] hover:text-[#B8963E] text-left transition-colors cursor-pointer py-1"
              >
                {t(`nav.${key}`)}
              </button>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="mt-2 bg-[#B8963E] text-white font-['Lato'] text-xs tracking-[0.2em] uppercase px-6 py-3 cursor-pointer"
            >
              {t('nav.book')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const { t } = useTranslation();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Eudora Conseil & Relooking"
          className="w-full h-full object-cover"
        />
        {/* Sophisticated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C1810]/75 via-[#2C1810]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/50 via-transparent to-transparent" />
      </div>

      {/* Decorative golden line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#B8963E] to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-20">
        <div className="max-w-2xl">
          {/* Tagline */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-[#B8963E]" />
            <span className="font-['Lato'] text-xs tracking-[0.4em] uppercase text-[#D4B483]">
              {t('hero.tagline')}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-['Cormorant_Garamond'] text-6xl lg:text-8xl font-light text-white leading-tight mb-8">
            {t('hero.title').split('\n').map((line: string, i: number) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <em className="italic text-[#D4B483]">{line}</em>
                ) : line}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="font-['Lato'] text-base lg:text-lg text-white/80 leading-relaxed mb-12 max-w-xl font-light">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo('formulas')}
              className="group bg-[#B8963E] hover:bg-[#9A7A2E] text-white font-['Lato'] text-xs tracking-[0.25em] uppercase px-8 py-4 transition-all duration-300 cursor-pointer flex items-center gap-3"
            >
              {t('hero.cta_primary')}
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="border border-white/50 hover:border-[#B8963E] text-white hover:text-[#D4B483] font-['Lato'] text-xs tracking-[0.25em] uppercase px-8 py-4 transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              {t('hero.cta_secondary')}
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-8 mt-16 pt-8 border-t border-white/20">
            <div className="text-center">
              <p className="font-['Cormorant_Garamond'] text-3xl text-[#D4B483] font-light">200+</p>
              <p className="font-['Lato'] text-[10px] tracking-[0.2em] text-white/60 uppercase mt-1">Clientes</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="font-['Cormorant_Garamond'] text-3xl text-[#D4B483] font-light">10</p>
              <p className="font-['Lato'] text-[10px] tracking-[0.2em] text-white/60 uppercase mt-1">Ans d'exp.</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="font-['Cormorant_Garamond'] text-3xl text-[#D4B483] font-light">98%</p>
              <p className="font-['Lato'] text-[10px] tracking-[0.2em] text-white/60 uppercase mt-1">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-[#D4B483] transition-colors animate-bounce cursor-pointer"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}

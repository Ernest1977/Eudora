import { useTranslation } from 'react-i18next';
import { Check, Star } from 'lucide-react';

export default function Formulas() {
  const { t } = useTranslation();

  const formulas = t('formulas.items', { returnObjects: true }) as Array<{
    name: string;
    duration: string;
    price: string | null;
    features: string[];
    popular: boolean;
  }>;

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="formulas" className="py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#B8963E]" />
            <span className="font-['Lato'] text-xs tracking-[0.4em] uppercase text-[#B8963E]">
              {t('formulas.label')}
            </span>
            <div className="w-8 h-px bg-[#B8963E]" />
          </div>
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#4A3728] leading-tight mb-6">
            {t('formulas.title').split('\n').map((line: string, i: number) => (
              <span key={i} className="block">{i === 1 ? <em className="italic">{line}</em> : line}</span>
            ))}
          </h2>
          <p className="font-['Lato'] text-sm text-[#8B7355] max-w-xl mx-auto leading-relaxed font-light">
            {t('formulas.subtitle')}
          </p>
        </div>

        {/* Formulas Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {formulas.map((formula, index) => (
            <div
              key={index}
              className={`relative flex flex-col rounded-sm overflow-hidden transition-all duration-300 ${
                formula.popular
                  ? 'shadow-2xl scale-105 border-2 border-[#B8963E] z-10'
                  : 'shadow-md border border-[#E8DDD0] hover:shadow-xl hover:-translate-y-1'
              } bg-white`}
              style={{ boxShadow: formula.popular ? '0 20px 60px rgba(184,150,62,0.20)' : '0 4px 20px rgba(74,55,40,0.06)' }}
            >
              {/* Popular Badge */}
              {formula.popular && (
                <div className="bg-[#B8963E] text-white text-center py-2.5">
                  <div className="flex items-center justify-center gap-2">
                    <Star size={12} fill="white" />
                    <span className="font-['Lato'] text-[10px] tracking-[0.3em] uppercase">
                      {t('formulas.popular')}
                    </span>
                    <Star size={12} fill="white" />
                  </div>
                </div>
              )}

              {/* Header */}
              <div className={`px-6 pt-8 pb-6 ${formula.popular ? 'bg-[#FAF7F2]' : 'bg-white'}`}>
                {/* Duration */}
                <p className="font-['Lato'] text-[10px] tracking-[0.3em] uppercase text-[#B8963E] mb-3">
                  {formula.duration}
                </p>

                {/* Name */}
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#4A3728] mb-4 tracking-wide">
                  {formula.name}
                </h3>

                {/* Price */}
                <div className="border-t border-[#E8DDD0] pt-5">
                  {formula.price ? (
                    <div className="flex items-end gap-1">
                      <span className="font-['Cormorant_Garamond'] text-5xl font-light text-[#4A3728]">
                        {formula.price}
                      </span>
                      <span className="font-['Cormorant_Garamond'] text-2xl text-[#B8963E] mb-1">€</span>
                    </div>
                  ) : (
                    <div>
                      <p className="font-['Cormorant_Garamond'] text-2xl font-light text-[#4A3728] italic">
                        Sur devis
                      </p>
                      <p className="font-['Lato'] text-[10px] text-[#8B7355] tracking-wider uppercase mt-1">
                        Personnalisé
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="px-6 pb-6 flex-1">
                <p className="font-['Lato'] text-[10px] tracking-[0.2em] uppercase text-[#8B7355] mb-4">
                  {t('formulas.included')}
                </p>
                <ul className="space-y-3">
                  {formula.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        formula.popular ? 'bg-[#B8963E]' : 'bg-[#E8DDD0]'
                      }`}>
                        <Check size={10} className={formula.popular ? 'text-white' : 'text-[#8B7355]'} />
                      </div>
                      <span className="font-['Lato'] text-xs text-[#6B5744] leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="px-6 pb-8">
                <button
                  onClick={scrollToContact}
                  className={`w-full py-3.5 font-['Lato'] text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                    formula.popular
                      ? 'bg-[#B8963E] hover:bg-[#9A7A2E] text-white'
                      : formula.price
                      ? 'border border-[#4A3728] text-[#4A3728] hover:bg-[#4A3728] hover:text-white'
                      : 'border border-[#B8963E] text-[#B8963E] hover:bg-[#B8963E] hover:text-white'
                  }`}
                >
                  {formula.price ? t('formulas.book') : t('formulas.contact_custom')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

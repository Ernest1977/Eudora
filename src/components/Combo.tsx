import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function Combo() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number[]>([]);

  const items = t('combo.items', { returnObjects: true }) as Array<{
    service: string;
    price: string;
    duration: string;
  }>;

  const toggleItem = (index: number) => {
    setSelected(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const totalPrice = selected.reduce((sum, idx) => {
    const price = parseInt(items[idx].price.replace(/[^0-9]/g, ''), 10);
    return sum + price;
  }, 0);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="combo" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#B8963E]" />
            <span className="font-['Lato'] text-xs tracking-[0.4em] uppercase text-[#B8963E]">
              {t('combo.label')}
            </span>
            <div className="w-8 h-px bg-[#B8963E]" />
          </div>
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#4A3728] leading-tight mb-6">
            {t('combo.title').split('\n').map((line: string, i: number) => (
              <span key={i} className="block">{i === 1 ? <em className="italic">{line}</em> : line}</span>
            ))}
          </h2>
          <p className="font-['Lato'] text-sm text-[#8B7355] max-w-xl mx-auto leading-relaxed font-light">
            {t('combo.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Services List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              const isSelected = selected.includes(index);
              return (
                <div
                  key={index}
                  onClick={() => toggleItem(index)}
                  className={`flex items-center justify-between p-6 rounded-sm border transition-all duration-300 cursor-pointer group ${
                    isSelected
                      ? 'border-[#B8963E] bg-[#FFF8EE] shadow-md'
                      : 'border-[#E8DDD0] bg-[#FAF7F2] hover:border-[#B8963E]/50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    {/* Toggle Icon */}
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      isSelected
                        ? 'border-[#B8963E] bg-[#B8963E]'
                        : 'border-[#E8DDD0] group-hover:border-[#B8963E]'
                    }`}>
                      {isSelected ? (
                        <Minus size={14} className="text-white" />
                      ) : (
                        <Plus size={14} className="text-[#8B7355] group-hover:text-[#B8963E]" />
                      )}
                    </div>

                    <div>
                      <h4 className={`font-['Cormorant_Garamond'] text-xl font-semibold transition-colors ${
                        isSelected ? 'text-[#B8963E]' : 'text-[#4A3728]'
                      }`}>
                        {item.service}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={11} className="text-[#8B7355]" />
                        <span className="font-['Lato'] text-[10px] tracking-[0.15em] uppercase text-[#8B7355]">
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-['Cormorant_Garamond'] text-2xl font-light text-[#4A3728]">
                      {item.price}
                    </span>
                    {isSelected && (
                      <p className="font-['Lato'] text-[10px] tracking-wider text-[#B8963E] uppercase mt-0.5">
                        Sélectionné
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1 sticky top-24">
            <div
              className="bg-[#4A3728] text-white p-8 rounded-sm"
              style={{ boxShadow: '0 20px 50px rgba(74,55,40,0.15)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag size={18} className="text-[#D4B483]" />
                <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold">Votre Sélection</h3>
              </div>

              {selected.length === 0 ? (
                <p className="font-['Lato'] text-xs text-white/50 italic leading-relaxed">
                  Sélectionnez les prestations souhaitées pour composer votre combo personnalisé.
                </p>
              ) : (
                <div className="space-y-3 mb-6">
                  {selected.map(idx => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="font-['Lato'] text-xs text-white/80">{items[idx].service}</span>
                      <span className="font-['Lato'] text-xs text-[#D4B483]">{items[idx].price}</span>
                    </div>
                  ))}
                </div>
              )}

              {selected.length > 0 && (
                <>
                  <div className="flex justify-between items-center py-4 border-t border-white/20 mb-6">
                    <span className="font-['Lato'] text-xs tracking-[0.2em] uppercase text-white/60">Total estimé</span>
                    <span className="font-['Cormorant_Garamond'] text-3xl text-[#D4B483]">{totalPrice}€</span>
                  </div>
                  <p className="font-['Lato'] text-[10px] text-white/40 italic mb-4 leading-relaxed">
                    * Prix indicatif. Un devis personnalisé vous sera remis.
                  </p>
                </>
              )}

              <button
                onClick={scrollToContact}
                className="w-full py-4 bg-[#B8963E] hover:bg-[#9A7A2E] text-white font-['Lato'] text-xs tracking-[0.25em] uppercase transition-all duration-300 cursor-pointer mt-2"
              >
                {t('combo.cta')}
              </button>

              <p className="font-['Lato'] text-[10px] text-white/40 text-center mt-4 leading-relaxed">
                {t('combo.note')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

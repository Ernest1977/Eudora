import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  const testimonials = t('testimonials.items', { returnObjects: true }) as Array<{
    name: string;
    role: string;
    text: string;
    rating: number;
  }>;

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(c => (c + 1) % testimonials.length);

  return (
    <section id="testimonials" className="py-28 bg-[#4A3728] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 border border-[#B8963E] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 border border-[#B8963E] rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-128 h-128 border border-[#B8963E] rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#B8963E]" />
            <span className="font-['Lato'] text-xs tracking-[0.4em] uppercase text-[#B8963E]">
              {t('testimonials.label')}
            </span>
            <div className="w-8 h-px bg-[#B8963E]" />
          </div>
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-white leading-tight mb-4">
            {t('testimonials.title').split('\n').map((line: string, i: number) => (
              <span key={i} className="block">{i === 1 ? <em className="italic text-[#D4B483]">{line}</em> : line}</span>
            ))}
          </h2>
          <p className="font-['Lato'] text-sm text-white/50 max-w-md mx-auto leading-relaxed">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Carousel + Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((item, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`relative p-8 rounded-sm border transition-all duration-500 cursor-pointer ${
                current === index
                  ? 'border-[#B8963E] bg-[#3A2A1C] shadow-2xl'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
              style={current === index ? { boxShadow: '0 0 40px rgba(184,150,62,0.15)' } : {}}
            >
              {/* Quote Icon */}
              <Quote
                size={32}
                className={`mb-5 transition-colors ${current === index ? 'text-[#B8963E]' : 'text-white/20'}`}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={12} className="text-[#B8963E]" fill="#B8963E" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-['Cormorant_Garamond'] text-lg lg:text-xl text-white/90 leading-relaxed italic mb-6">
                "{item.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#B8963E]/30 flex items-center justify-center">
                  <span className="font-['Cormorant_Garamond'] text-[#D4B483] font-semibold">
                    {item.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-['Cormorant_Garamond'] text-base font-semibold text-white">{item.name}</p>
                  <p className="font-['Lato'] text-[10px] tracking-[0.15em] uppercase text-[#B8963E]">{item.role}</p>
                </div>
              </div>

              {/* Active indicator */}
              {current === index && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#B8963E] to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full border border-white/20 hover:border-[#B8963E] text-white hover:text-[#D4B483] flex items-center justify-center transition-all duration-300 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === current ? 'w-8 h-2 bg-[#B8963E]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-12 h-12 rounded-full border border-white/20 hover:border-[#B8963E] text-white hover:text-[#D4B483] flex items-center justify-center transition-all duration-300 cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

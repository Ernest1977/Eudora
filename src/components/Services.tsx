import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, ChevronDown } from 'lucide-react';

export default function Services() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(null);

  const services = t('services.items', { returnObjects: true }) as Array<{
    icon: string;
    title: string;
    duration: string;
    desc: string;
    details: string[];
  }>;

  return (
    <section id="services" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#B8963E]" />
            <span className="font-['Lato'] text-xs tracking-[0.4em] uppercase text-[#B8963E]">
              {t('services.label')}
            </span>
            <div className="w-8 h-px bg-[#B8963E]" />
          </div>
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#4A3728] leading-tight mb-6">
            {t('services.title').split('\n').map((line: string, i: number) => (
              <span key={i} className="block">{i === 1 ? <em className="italic">{line}</em> : line}</span>
            ))}
          </h2>
          <p className="font-['Lato'] text-sm text-[#8B7355] max-w-xl mx-auto leading-relaxed font-light">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-[#FAF7F2] hover:bg-white border border-[#E8DDD0] hover:border-[#B8963E]/30 rounded-sm p-8 transition-all duration-300 hover:shadow-xl cursor-pointer"
              style={{ boxShadow: '0 2px 15px rgba(74,55,40,0.04)' }}
              onClick={() => setExpanded(expanded === index ? null : index)}
            >
              {/* Icon */}
              <div className="text-4xl mb-5 block">{service.icon}</div>

              {/* Duration badge */}
              <div className="flex items-center gap-2 mb-4">
                <Clock size={12} className="text-[#B8963E]" />
                <span className="font-['Lato'] text-[10px] tracking-[0.2em] uppercase text-[#B8963E]">
                  {service.duration}
                </span>
              </div>

              <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#4A3728] mb-3">
                {service.title}
              </h3>
              <p className="font-['Lato'] text-sm text-[#8B7355] leading-relaxed font-light mb-4">
                {service.desc}
              </p>

              {/* Expand toggle */}
              <button className="flex items-center gap-2 text-[#B8963E] font-['Lato'] text-xs tracking-wider uppercase cursor-pointer mt-2">
                <span>Détails</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${expanded === index ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Expandable details */}
              {expanded === index && (
                <div className="mt-5 pt-5 border-t border-[#E8DDD0]">
                  <ul className="space-y-2">
                    {service.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-[#B8963E] mt-0.5">✓</span>
                        <span className="font-['Lato'] text-xs text-[#6B5744] leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bottom golden line on hover */}
              <div className="mt-6 h-px bg-gradient-to-r from-[#B8963E] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

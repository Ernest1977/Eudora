import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { value: '200+', key: 'clients' },
    { value: '10+', key: 'years' },
    { value: '98%', key: 'satisfaction' },
  ];

  return (
    <section id="about" className="py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            {/* Decorative background block */}
            <div className="absolute -top-6 -left-6 w-48 h-64 bg-[#E8DDD0] -z-0 rounded-sm" />
            <div className="absolute -bottom-6 -right-6 w-48 h-64 border border-[#B8963E]/30 -z-0 rounded-sm" />

            <div className="relative z-10 overflow-hidden rounded-sm">
              <img
                src="/images/about-portrait.jpg"
                alt="Eudora - Conseillère en Image"
                className="w-full h-[580px] object-cover object-top"
              />
              {/* Gold accent overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A3728]/30 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute bottom-8 -right-4 lg:-right-8 bg-white shadow-xl px-6 py-4 rounded-sm border-l-4 border-[#B8963E]">
              <p className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#4A3728]">10+</p>
              <p className="font-['Lato'] text-[10px] tracking-[0.2em] text-[#8B7355] uppercase">Ans d'excellence</p>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            {/* Section Label */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-[#B8963E]" />
              <span className="font-['Lato'] text-xs tracking-[0.4em] uppercase text-[#B8963E]">
                {t('about.label')}
              </span>
            </div>

            <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#4A3728] leading-tight mb-3">
              {t('about.title')}
            </h2>
            <p className="font-['Cormorant_Garamond'] text-xl italic text-[#8B7355] mb-8">
              {t('about.subtitle')}
            </p>

            <div className="space-y-4 mb-10">
              <p className="font-['Lato'] text-[#6B5744] leading-relaxed font-light text-sm">
                {t('about.p1')}
              </p>
              <p className="font-['Lato'] text-[#6B5744] leading-relaxed font-light text-sm">
                {t('about.p2')}
              </p>
              <p className="font-['Lato'] text-[#6B5744] leading-relaxed font-light text-sm">
                {t('about.p3')}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-10 py-8 border-y border-[#E8DDD0]">
              {stats.map((stat) => (
                <div key={stat.key} className="text-center">
                  <p className="font-['Cormorant_Garamond'] text-4xl font-light text-[#B8963E]">{stat.value}</p>
                  <p className="font-['Lato'] text-[10px] tracking-[0.15em] text-[#8B7355] uppercase mt-1">
                    {t(`about.stats.${stat.key}`)}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-3 bg-[#4A3728] hover:bg-[#B8963E] text-white font-['Lato'] text-xs tracking-[0.25em] uppercase px-8 py-4 transition-all duration-300 cursor-pointer"
            >
              {t('about.cta')}
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

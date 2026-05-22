import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ZoomIn } from 'lucide-react';

const galleryImages = [
  { src: '/images/gallery-1.jpg', title: 'Tri du Dressing', category: 'Dressing' },
  { src: '/images/gallery-2.jpg', title: 'Consultation Style', category: 'Styling' },
  { src: '/images/gallery-3.jpg', title: 'Séance Maquillage', category: 'Beauté' },
  { src: '/images/gallery-4.jpg', title: 'Shopping Accompagné', category: 'Shopping' },
  { src: '/images/hero-bg.jpg', title: 'Studio Conseil', category: 'Studio' },
  { src: '/images/about-portrait.jpg', title: 'Portrait Conseillère', category: 'Portrait' },
];

export default function Gallery() {
  const { t } = useTranslation();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);

  const prevImage = () => {
    if (lightbox !== null) {
      setLightbox((lightbox - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const nextImage = () => {
    if (lightbox !== null) {
      setLightbox((lightbox + 1) % galleryImages.length);
    }
  };

  return (
    <section id="gallery" className="py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#B8963E]" />
            <span className="font-['Lato'] text-xs tracking-[0.4em] uppercase text-[#B8963E]">
              {t('gallery.label')}
            </span>
            <div className="w-8 h-px bg-[#B8963E]" />
          </div>
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#4A3728] leading-tight mb-6">
            {t('gallery.title').split('\n').map((line: string, i: number) => (
              <span key={i} className="block">{i === 1 ? <em className="italic">{line}</em> : line}</span>
            ))}
          </h2>
          <p className="font-['Lato'] text-sm text-[#8B7355] max-w-md mx-auto leading-relaxed font-light">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Masonry-style Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-sm cursor-pointer ${
                index === 0 || index === 4 ? 'md:row-span-2' : ''
              }`}
              style={{ boxShadow: '0 4px 20px rgba(74,55,40,0.10)' }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={img.src}
                alt={img.title}
                className={`w-full object-cover transition-all duration-700 group-hover:scale-110 ${
                  index === 0 || index === 4 ? 'h-80 md:h-full' : 'h-48 md:h-64'
                }`}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-['Cormorant_Garamond'] text-lg font-semibold text-white">{img.title}</p>
                  <p className="font-['Lato'] text-[10px] tracking-[0.2em] uppercase text-[#D4B483]">{img.category}</p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <ZoomIn size={32} className="text-white/80" />
                </div>
              </div>

              {/* Category Tag */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-['Lato'] text-[9px] tracking-[0.2em] uppercase text-[#4A3728]">{img.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 text-white/70 hover:text-white transition-colors cursor-pointer text-3xl"
          >
            ‹
          </button>

          <div onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-[85vh] relative">
            <img
              src={galleryImages[lightbox].src}
              alt={galleryImages[lightbox].title}
              className="max-w-full max-h-[85vh] object-contain rounded-sm"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-sm">
              <p className="font-['Cormorant_Garamond'] text-xl font-semibold text-white">
                {galleryImages[lightbox].title}
              </p>
              <p className="font-['Lato'] text-[10px] tracking-[0.2em] uppercase text-[#D4B483]">
                {galleryImages[lightbox].category}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 text-white/70 hover:text-white transition-colors cursor-pointer text-3xl"
          >
            ›
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  i === lightbox ? 'bg-[#B8963E] w-6' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

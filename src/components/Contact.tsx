import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

const SOCIAL_LINKS = [
  { name: 'Facebook', url: 'https://www.facebook.com/share/18bhjh6RqL/?mibextid=wwXIfr' },
  { name: 'Instagram', url: 'https://www.instagram.com/eudoraconsulting?igsh=MXFhMWJhenZ6ZHZ3dw%3D%3D&utm_source=qr' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/eudoxie-mahude-gbebioho-9127b0b8?utm_source=share_via&utm_content=profile&utm_medium=member_ios' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@eudoxiemao?_r=1&_t=ZS-96ONFaQw360' },
];

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const services = [
    t('services.items.0.title', { defaultValue: 'Colorimétrie' }),
    t('services.items.1.title', { defaultValue: 'Visagisme' }),
    t('services.items.2.title', { defaultValue: 'Auto-Maquillage' }),
    t('services.items.3.title', { defaultValue: 'Morphologie & Style' }),
    t('services.items.4.title', { defaultValue: 'Tri du Dressing' }),
    t('services.items.5.title', { defaultValue: 'Shopping Accompagné' }),
    'Formule Morphologie', 'Formule Visagisme', 'Formule Complète', 'Formule Sur Mesure',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setSent(true);
    } catch (err) {
      console.error('Erreur envoi formulaire:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const infoItems = [
    { icon: <MapPin size={16} />, label: 'Location', value: t('contact.info.location') },
    { icon: <Mail size={16} />, label: 'Email', value: t('contact.info.email') },
    { icon: <Phone size={16} />, label: 'Phone', value: t('contact.info.phone') },
    { icon: <Clock size={16} />, label: 'Hours', value: t('contact.info.hours') },
  ];

  return (
    <section id="contact" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#B8963E]" />
            <span className="font-['Lato'] text-xs tracking-[0.4em] uppercase text-[#B8963E]">
              {t('contact.label')}
            </span>
            <div className="w-8 h-px bg-[#B8963E]" />
          </div>
          <h2 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl font-light text-[#4A3728] leading-tight mb-6">
            {t('contact.title').split('\n').map((line: string, i: number) => (
              <span key={i} className="block">{i === 1 ? <em className="italic">{line}</em> : line}</span>
            ))}
          </h2>
          <p className="font-['Lato'] text-sm text-[#8B7355] max-w-md mx-auto leading-relaxed font-light">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Info Panel */}
          <div className="lg:col-span-2">
            <div className="bg-[#FAF7F2] p-8 rounded-sm h-full" style={{ boxShadow: '0 4px 20px rgba(74,55,40,0.06)' }}>
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#4A3728] mb-8">
                Informations de contact
              </h3>

              <div className="space-y-6">
                {infoItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#B8963E]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#B8963E]">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-['Lato'] text-[10px] tracking-[0.2em] uppercase text-[#8B7355] mb-1">{item.label}</p>
                      <p className="font-['Lato'] text-sm text-[#4A3728]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="mt-10 pt-8 border-t border-[#E8DDD0]">
                <p className="font-['Lato'] text-[10px] tracking-[0.2em] uppercase text-[#8B7355] mb-4">Suivez-moi</p>
                <div className="flex flex-wrap gap-3">
                  {SOCIAL_LINKS.map(social => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 border border-[#E8DDD0] hover:border-[#B8963E] hover:text-[#B8963E] font-['Lato'] text-[9px] tracking-[0.2em] uppercase text-[#8B7355] transition-all duration-300 rounded-sm"
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Decorative Quote */}
              <div className="mt-8 pt-6 border-t border-[#E8DDD0]">
                <p className="font-['Cormorant_Garamond'] text-lg italic text-[#8B7355] leading-relaxed">
                  "Le style, c'est la façon de dire qui vous êtes sans avoir à parler."
                </p>
                <p className="font-['Lato'] text-[10px] tracking-wider text-[#B8963E] uppercase mt-2">— Rachel Zoe</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <CheckCircle size={56} className="text-[#B8963E] mb-6" />
                <h3 className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#4A3728] mb-4">
                  Message envoyé !
                </h3>
                <p className="font-['Lato'] text-sm text-[#8B7355] max-w-sm leading-relaxed">
                  {t('contact.form.success')}
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }); }}
                  className="mt-8 font-['Lato'] text-xs tracking-[0.2em] uppercase text-[#B8963E] hover:text-[#4A3728] transition-colors cursor-pointer underline underline-offset-4"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error message */}
                {error && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm">
                    <AlertCircle size={16} />
                    <span className="font-['Lato'] text-sm">{error}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-['Lato'] text-[10px] tracking-[0.2em] uppercase text-[#8B7355] block mb-2">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#FAF7F2] border border-[#E8DDD0] focus:border-[#B8963E] rounded-sm px-4 py-3.5 font-['Lato'] text-sm text-[#4A3728] outline-none transition-colors"
                      placeholder="Marie Dupont"
                    />
                  </div>
                  <div>
                    <label className="font-['Lato'] text-[10px] tracking-[0.2em] uppercase text-[#8B7355] block mb-2">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#FAF7F2] border border-[#E8DDD0] focus:border-[#B8963E] rounded-sm px-4 py-3.5 font-['Lato'] text-sm text-[#4A3728] outline-none transition-colors"
                      placeholder="marie@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-['Lato'] text-[10px] tracking-[0.2em] uppercase text-[#8B7355] block mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-[#E8DDD0] focus:border-[#B8963E] rounded-sm px-4 py-3.5 font-['Lato'] text-sm text-[#4A3728] outline-none transition-colors"
                      placeholder="+39 327 225 0364"
                    />
                  </div>
                  <div>
                    <label className="font-['Lato'] text-[10px] tracking-[0.2em] uppercase text-[#8B7355] block mb-2">
                      {t('contact.form.service')}
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className="w-full bg-[#FAF7F2] border border-[#E8DDD0] focus:border-[#B8963E] rounded-sm px-4 py-3.5 font-['Lato'] text-sm text-[#4A3728] outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">{t('contact.form.select_service')}</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-['Lato'] text-[10px] tracking-[0.2em] uppercase text-[#8B7355] block mb-2">
                    {t('contact.form.message')} *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-[#FAF7F2] border border-[#E8DDD0] focus:border-[#B8963E] rounded-sm px-4 py-3.5 font-['Lato'] text-sm text-[#4A3728] outline-none transition-colors resize-none"
                    placeholder="Décrivez votre projet et vos attentes..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-3 bg-[#B8963E] hover:bg-[#9A7A2E] disabled:opacity-70 text-white font-['Lato'] text-xs tracking-[0.25em] uppercase py-4 transition-all duration-300 cursor-pointer rounded-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    <>
                      {t('contact.form.send')}
                      <Send size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>

                <p className="font-['Lato'] text-[10px] text-[#8B7355] text-center leading-relaxed">
                  En soumettant ce formulaire, vous acceptez notre politique de confidentialité. Vos données ne seront jamais partagées.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

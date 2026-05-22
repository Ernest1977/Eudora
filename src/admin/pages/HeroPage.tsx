import { useState, useEffect } from 'react';
import { cms } from '../api';
import { PageTitle, Card, Field, Input, TextArea, SaveButton, SuccessMessage, ErrorMessage, LangTabs } from '../components/FormField';

export default function HeroPage() {
  const [data, setData] = useState<any>({});
  const [lang, setLang] = useState('fr');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { cms.getHero().then(setData).catch(() => {}); }, []);

  const set = (key: string, value: string) => setData((d: any) => ({ ...d, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      const res = await cms.updateHero(data);
      setData(res.data || data);
      setSuccess('Section Hero sauvegardée !');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageTitle title="🏠 Section Hero" subtitle="Image de fond, titre, sous-titre, statistiques" />
      <SuccessMessage message={success} />
      <ErrorMessage message={error} />

      <form onSubmit={save} className="space-y-6">
        <LangTabs lang={lang} onChange={setLang} />

        <Card title="Textes">
          <div className="space-y-4">
            <Field label={`Tagline (${lang.toUpperCase()})`}>
              <Input value={data[`tagline_${lang}`] || ''} onChange={e => set(`tagline_${lang}`, e.target.value)} placeholder="Conseil en Image & Relooking" />
            </Field>
            <Field label={`Titre (${lang.toUpperCase()})`} hint="Utilisez \n pour un saut de ligne">
              <TextArea rows={2} value={data[`title_${lang}`] || ''} onChange={e => set(`title_${lang}`, e.target.value)} placeholder="Révélez votre\nStyle Signature" />
            </Field>
            <Field label={`Sous-titre (${lang.toUpperCase()})`}>
              <TextArea rows={3} value={data[`subtitle_${lang}`] || ''} onChange={e => set(`subtitle_${lang}`, e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label={`Bouton principal (${lang.toUpperCase()})`}>
                <Input value={data[`cta_primary_${lang}`] || ''} onChange={e => set(`cta_primary_${lang}`, e.target.value)} />
              </Field>
              <Field label={`Bouton secondaire (${lang.toUpperCase()})`}>
                <Input value={data[`cta_secondary_${lang}`] || ''} onChange={e => set(`cta_secondary_${lang}`, e.target.value)} />
              </Field>
            </div>
          </div>
        </Card>

        <Card title="Image de fond">
          <Field label="URL de l'image">
            <Input value={data.background_image || ''} onChange={e => set('background_image', e.target.value)} placeholder="/images/hero-bg.jpg" />
          </Field>
          {data.background_image && (
            <img src={data.background_image} alt="Preview" className="mt-3 h-32 w-full object-cover rounded-lg opacity-70" />
          )}
        </Card>

        <Card title="Statistiques">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="space-y-3">
                <Field label={`Stat ${n} — Valeur`}>
                  <Input value={data[`stat${n}_value`] || ''} onChange={e => set(`stat${n}_value`, e.target.value)} placeholder="200+" />
                </Field>
                <Field label={`Stat ${n} — Label (${lang.toUpperCase()})`}>
                  <Input value={data[`stat${n}_label_${lang}`] || ''} onChange={e => set(`stat${n}_label_${lang}`, e.target.value)} placeholder="Clientes" />
                </Field>
              </div>
            ))}
          </div>
        </Card>

        <SaveButton loading={loading} />
      </form>
    </div>
  );
}

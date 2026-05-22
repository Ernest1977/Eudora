import { useState, useEffect } from 'react';
import { cms } from '../api';
import { PageTitle, Card, Field, Input, TextArea, SaveButton, SuccessMessage, ErrorMessage, LangTabs } from '../components/FormField';

export default function AboutPage() {
  const [data, setData] = useState<any>({});
  const [lang, setLang] = useState('fr');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { cms.getAbout().then(setData).catch(() => {}); }, []);

  const set = (key: string, value: string) => setData((d: any) => ({ ...d, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      const res = await cms.updateAbout(data);
      setData(res.data || data);
      setSuccess('Section About sauvegardée !');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageTitle title="👤 Section About" subtitle="Photo, textes, paragraphes, statistiques" />
      <SuccessMessage message={success} />
      <ErrorMessage message={error} />

      <form onSubmit={save} className="space-y-6">
        <LangTabs lang={lang} onChange={setLang} />

        <Card title="En-tête">
          <div className="space-y-4">
            <Field label={`Label (${lang.toUpperCase()})`}><Input value={data[`label_${lang}`] || ''} onChange={e => set(`label_${lang}`, e.target.value)} /></Field>
            <Field label={`Titre (${lang.toUpperCase()})`}><Input value={data[`title_${lang}`] || ''} onChange={e => set(`title_${lang}`, e.target.value)} /></Field>
            <Field label={`Sous-titre (${lang.toUpperCase()})`}><Input value={data[`subtitle_${lang}`] || ''} onChange={e => set(`subtitle_${lang}`, e.target.value)} /></Field>
          </div>
        </Card>

        <Card title="Paragraphes">
          <div className="space-y-4">
            <Field label={`Paragraphe 1 (${lang.toUpperCase()})`}><TextArea rows={3} value={data[`paragraph1_${lang}`] || ''} onChange={e => set(`paragraph1_${lang}`, e.target.value)} /></Field>
            <Field label={`Paragraphe 2 (${lang.toUpperCase()})`}><TextArea rows={3} value={data[`paragraph2_${lang}`] || ''} onChange={e => set(`paragraph2_${lang}`, e.target.value)} /></Field>
            <Field label={`Paragraphe 3 (${lang.toUpperCase()})`}><TextArea rows={3} value={data[`paragraph3_${lang}`] || ''} onChange={e => set(`paragraph3_${lang}`, e.target.value)} /></Field>
          </div>
        </Card>

        <Card title="Image portrait">
          <Field label="URL de l'image"><Input value={data.portrait_image || ''} onChange={e => set('portrait_image', e.target.value)} placeholder="/images/about-portrait.jpg" /></Field>
          {data.portrait_image && <img src={data.portrait_image} alt="Preview" className="mt-3 h-40 object-cover rounded-lg" />}
        </Card>

        <Card title="Bouton CTA">
          <Field label={`Texte du bouton (${lang.toUpperCase()})`}><Input value={data[`cta_${lang}`] || ''} onChange={e => set(`cta_${lang}`, e.target.value)} /></Field>
        </Card>

        <Card title="Statistiques">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="space-y-3">
                <Field label={`Stat ${n} — Valeur`}><Input value={data[`stat${n}_value`] || ''} onChange={e => set(`stat${n}_value`, e.target.value)} /></Field>
                <Field label={`Stat ${n} — Label (${lang.toUpperCase()})`}><Input value={data[`stat${n}_label_${lang}`] || ''} onChange={e => set(`stat${n}_label_${lang}`, e.target.value)} /></Field>
              </div>
            ))}
          </div>
        </Card>

        <SaveButton loading={loading} />
      </form>
    </div>
  );
}

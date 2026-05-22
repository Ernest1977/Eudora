import { useState, useEffect } from 'react';
import { cms } from '../api';
import { PageTitle, Card, Field, Input, TextArea, SaveButton, SuccessMessage, ErrorMessage, LangTabs } from '../components/FormField';

const EMPTY = { name: '', role_fr: '', role_en: '', role_it: '', text_fr: '', text_en: '', text_it: '', rating: 5, is_active: true, sort_order: 0 };

export default function TestimonialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [lang, setLang] = useState('fr');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = () => cms.getTestimonials().then(d => setItems(d.testimonials || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const set = (key: string, value: any) => setEditing((d: any) => ({ ...d, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setSuccess(''); setError('');
    try {
      if (editing.id) await cms.updateTestimonial(editing.id, editing);
      else await cms.createTestimonial(editing);
      setSuccess('Témoignage sauvegardé !'); setEditing(null); load();
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer ?')) return;
    try { await cms.deleteTestimonial(id); load(); setSuccess('Supprimé'); } catch (err: any) { setError(err.message); }
  };

  if (editing) {
    return (
      <div>
        <PageTitle title={editing.id ? '✏️ Modifier' : '➕ Nouveau témoignage'} />
        <SuccessMessage message={success} /><ErrorMessage message={error} />
        <form onSubmit={save} className="space-y-6">
          <LangTabs lang={lang} onChange={setLang} />
          <Card title="Informations">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nom"><Input value={editing.name || ''} onChange={e => set('name', e.target.value)} required placeholder="Sophie M." /></Field>
                <Field label={`Rôle (${lang.toUpperCase()})`}><Input value={editing[`role_${lang}`] || ''} onChange={e => set(`role_${lang}`, e.target.value)} placeholder="Directrice Marketing" /></Field>
              </div>
              <Field label={`Texte du témoignage (${lang.toUpperCase()})`}><TextArea rows={4} value={editing[`text_${lang}`] || ''} onChange={e => set(`text_${lang}`, e.target.value)} /></Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Note (1-5)"><Input type="number" min={1} max={5} value={editing.rating || 5} onChange={e => set('rating', parseInt(e.target.value))} /></Field>
                <Field label="Ordre"><Input type="number" value={editing.sort_order || 0} onChange={e => set('sort_order', parseInt(e.target.value))} /></Field>
                <Field label="Actif"><label className="flex items-center gap-2 mt-1 cursor-pointer"><input type="checkbox" checked={editing.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 accent-[#B8963E]" /><span className="text-sm text-white/70">Visible</span></label></Field>
              </div>
            </div>
          </Card>
          <div className="flex gap-3"><SaveButton loading={loading} /><button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 bg-white/5 text-white/50 text-sm rounded-lg hover:bg-white/10">Annuler</button></div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="⭐ Témoignages" subtitle="Avis clients affichés sur le site" />
      <SuccessMessage message={success} /><ErrorMessage message={error} />
      <button onClick={() => setEditing({ ...EMPTY })} className="mb-6 px-5 py-2.5 bg-[#B8963E] text-white text-sm font-medium rounded-lg hover:bg-[#9A7A2E]">➕ Ajouter</button>
      <div className="space-y-3">
        {items.map(t => (
          <div key={t.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B8963E]/20 flex items-center justify-center text-sm font-bold text-[#B8963E]">{t.name?.charAt(0)}</div>
              <div><p className="text-sm font-medium text-white">{t.name}</p><p className="text-xs text-white/40">{t.role} — {'⭐'.repeat(t.rating)}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(t)} className="px-3 py-1.5 bg-white/5 text-white/60 text-xs rounded-lg hover:bg-white/10">✏️</button>
              <button onClick={() => remove(t.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg hover:bg-red-500/20">🗑️</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/30 text-sm text-center py-8">Aucun témoignage.</p>}
      </div>
    </div>
  );
}

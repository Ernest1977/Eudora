import { useState, useEffect } from 'react';
import { cms } from '../api';
import { PageTitle, Card, Field, Input, TextArea, SaveButton, SuccessMessage, ErrorMessage, LangTabs } from '../components/FormField';

const EMPTY = { name_fr: '', name_en: '', name_it: '', duration_fr: '', duration_en: '', duration_it: '', price: null, features_fr: '[]', features_en: '[]', features_it: '[]', is_popular: false, is_active: true, sort_order: 0 };

export default function FormulasPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [lang, setLang] = useState('fr');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = () => cms.getFormulas().then(d => setItems(d.formulas || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const set = (key: string, value: any) => setEditing((d: any) => ({ ...d, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      if (editing.id) await cms.updateFormula(editing.id, editing);
      else await cms.createFormula(editing);
      setSuccess('Formule sauvegardée !'); setEditing(null); load();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer cette formule ?')) return;
    try { await cms.deleteFormula(id); load(); setSuccess('Formule supprimée'); } catch (err: any) { setError(err.message); }
  };

  if (editing) {
    return (
      <div>
        <PageTitle title={editing.id ? '✏️ Modifier la formule' : '➕ Nouvelle formule'} />
        <SuccessMessage message={success} /><ErrorMessage message={error} />
        <form onSubmit={save} className="space-y-6">
          <LangTabs lang={lang} onChange={setLang} />
          <Card title="Informations">
            <div className="space-y-4">
              <Field label={`Nom (${lang.toUpperCase()})`}><Input value={editing[`name_${lang}`] || ''} onChange={e => set(`name_${lang}`, e.target.value)} required /></Field>
              <Field label={`Durée (${lang.toUpperCase()})`}><Input value={editing[`duration_${lang}`] || ''} onChange={e => set(`duration_${lang}`, e.target.value)} placeholder="10h00 / 5 séances" /></Field>
              <Field label="Prix (€)" hint="Laissez vide pour 'Sur devis'"><Input type="number" value={editing.price ?? ''} onChange={e => set('price', e.target.value ? parseFloat(e.target.value) : null)} /></Field>
              <Field label={`Features (${lang.toUpperCase()}) — JSON array`} hint='Ex: ["Bilan image", "Colorimétrie"]'>
                <TextArea rows={6} value={editing[`features_${lang}`] || '[]'} onChange={e => set(`features_${lang}`, e.target.value)} />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Ordre"><Input type="number" value={editing.sort_order || 0} onChange={e => set('sort_order', parseInt(e.target.value))} /></Field>
                <Field label="Populaire">
                  <label className="flex items-center gap-2 cursor-pointer mt-1"><input type="checkbox" checked={editing.is_popular} onChange={e => set('is_popular', e.target.checked)} className="w-4 h-4 accent-[#B8963E]" /><span className="text-sm text-white/70">⭐</span></label>
                </Field>
                <Field label="Actif">
                  <label className="flex items-center gap-2 cursor-pointer mt-1"><input type="checkbox" checked={editing.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 accent-[#B8963E]" /><span className="text-sm text-white/70">Visible</span></label>
                </Field>
              </div>
            </div>
          </Card>
          <div className="flex gap-3">
            <SaveButton loading={loading} />
            <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 bg-white/5 text-white/50 text-sm rounded-lg hover:bg-white/10">Annuler</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="📦 Formules" subtitle="Gérez les packages et leurs prix" />
      <SuccessMessage message={success} /><ErrorMessage message={error} />
      <button onClick={() => setEditing({ ...EMPTY })} className="mb-6 px-5 py-2.5 bg-[#B8963E] text-white text-sm font-medium rounded-lg hover:bg-[#9A7A2E]">➕ Ajouter une formule</button>
      <div className="space-y-3">
        {items.map(f => (
          <div key={f.id} className={`flex items-center justify-between p-4 rounded-xl border ${f.popular ? 'bg-[#B8963E]/5 border-[#B8963E]/20' : 'bg-white/5 border-white/10'} ${!f.is_active ? 'opacity-50' : ''}`}>
            <div>
              <p className="text-sm font-medium text-white">{f.name} {f.popular && '⭐'}</p>
              <p className="text-xs text-white/40">{f.duration} — {f.price ? `${f.price}€` : 'Sur devis'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(f)} className="px-3 py-1.5 bg-white/5 text-white/60 text-xs rounded-lg hover:bg-white/10">✏️</button>
              <button onClick={() => remove(f.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg hover:bg-red-500/20">🗑️</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/30 text-sm text-center py-8">Aucune formule.</p>}
      </div>
    </div>
  );
}

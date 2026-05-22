import { useState, useEffect } from 'react';
import { cms } from '../api';
import { PageTitle, Card, Field, Input, TextArea, SaveButton, DeleteButton, SuccessMessage, ErrorMessage, LangTabs } from '../components/FormField';

const EMPTY_SERVICE = { icon: '✨', name_fr: '', name_en: '', name_it: '', description_fr: '', description_en: '', description_it: '', details_fr: '[]', details_en: '[]', details_it: '[]', duration: '', price: 0, sort_order: 0, is_active: true };

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [lang, setLang] = useState('fr');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = () => cms.getServices().then(d => setServices(d.services || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const set = (key: string, value: any) => setEditing((d: any) => ({ ...d, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      if (editing.id) { await cms.updateService(editing.id, editing); }
      else { await cms.createService(editing); }
      setSuccess('Service sauvegardé !');
      setEditing(null);
      load();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer ce service ?')) return;
    try { await cms.deleteService(id); load(); setSuccess('Service supprimé'); } catch (err: any) { setError(err.message); }
  };

  if (editing) {
    return (
      <div>
        <PageTitle title={editing.id ? '✏️ Modifier le service' : '➕ Nouveau service'} />
        <SuccessMessage message={success} /><ErrorMessage message={error} />
        <form onSubmit={save} className="space-y-6">
          <LangTabs lang={lang} onChange={setLang} />
          <Card title="Informations">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Field label="Icône (emoji)"><Input value={editing.icon || ''} onChange={e => set('icon', e.target.value)} /></Field>
                <Field label="Durée"><Input value={editing.duration || ''} onChange={e => set('duration', e.target.value)} placeholder="1h30" /></Field>
                <Field label="Prix (€)"><Input type="number" value={editing.price || 0} onChange={e => set('price', parseFloat(e.target.value))} /></Field>
              </div>
              <Field label={`Nom (${lang.toUpperCase()})`}><Input value={editing[`name_${lang}`] || ''} onChange={e => set(`name_${lang}`, e.target.value)} required /></Field>
              <Field label={`Description (${lang.toUpperCase()})`}><TextArea rows={3} value={editing[`description_${lang}`] || ''} onChange={e => set(`description_${lang}`, e.target.value)} /></Field>
              <Field label={`Détails (${lang.toUpperCase()}) — JSON array`} hint='Ex: ["Analyse complète", "Palette personnalisée"]'>
                <TextArea rows={4} value={editing[`details_${lang}`] || '[]'} onChange={e => set(`details_${lang}`, e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ordre d'affichage"><Input type="number" value={editing.sort_order || 0} onChange={e => set('sort_order', parseInt(e.target.value))} /></Field>
                <Field label="Actif">
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input type="checkbox" checked={editing.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 accent-[#B8963E]" />
                    <span className="text-sm text-white/70">{editing.is_active ? 'Visible sur le site' : 'Masqué'}</span>
                  </label>
                </Field>
              </div>
            </div>
          </Card>
          <div className="flex gap-3">
            <SaveButton loading={loading} />
            <button type="button" onClick={() => setEditing(null)} className="px-6 py-2.5 bg-white/5 text-white/50 text-sm rounded-lg hover:bg-white/10 transition-all">Annuler</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <PageTitle title="💼 Services" subtitle="Gérez les prestations affichées sur le site" />
      <SuccessMessage message={success} /><ErrorMessage message={error} />
      <button onClick={() => setEditing({ ...EMPTY_SERVICE })} className="mb-6 px-5 py-2.5 bg-[#B8963E] text-white text-sm font-medium rounded-lg hover:bg-[#9A7A2E] transition-all">
        ➕ Ajouter un service
      </button>
      <div className="space-y-3">
        {services.map(s => (
          <div key={s.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${s.is_active ? 'bg-white/5 border-white/10' : 'bg-white/[0.02] border-white/5 opacity-50'}`}>
            <div className="flex items-center gap-4">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-sm font-medium text-white">{s.name}</p>
                <p className="text-xs text-white/40">{s.duration} — {s.price}€</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { load(); cms.getServices().then(d => { const found = (d.services || []).find((x: any) => x.id === s.id); if (found) setEditing(found); }); }} className="px-3 py-1.5 bg-white/5 text-white/60 text-xs rounded-lg hover:bg-white/10">✏️ Modifier</button>
              <button onClick={() => remove(s.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg hover:bg-red-500/20">🗑️</button>
            </div>
          </div>
        ))}
        {services.length === 0 && <p className="text-white/30 text-sm text-center py-8">Aucun service. Cliquez sur "Ajouter" pour commencer.</p>}
      </div>
    </div>
  );
}

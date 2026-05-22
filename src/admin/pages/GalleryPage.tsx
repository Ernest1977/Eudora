import { useState, useEffect } from 'react';
import { cms } from '../api';
import { PageTitle, Card, Field, Input, SaveButton, SuccessMessage, ErrorMessage, LangTabs } from '../components/FormField';

const EMPTY = { src: '', title_fr: '', title_en: '', title_it: '', category_fr: '', category_en: '', category_it: '', is_tall: false, is_active: true, sort_order: 0 };

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [lang, setLang] = useState('fr');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = () => cms.getGallery().then(d => setItems(d.images || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const set = (key: string, value: any) => setEditing((d: any) => ({ ...d, [key]: value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await cms.uploadImage(file);
      set('src', res.url);
      setSuccess('Image uploadée !');
    } catch (err: any) { setError(err.message); }
    finally { setUploading(false); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setSuccess(''); setError('');
    try {
      if (editing.id) await cms.updateGalleryImage(editing.id, editing);
      else await cms.createGalleryImage(editing);
      setSuccess('Image sauvegardée !'); setEditing(null); load();
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer cette image ?')) return;
    try { await cms.deleteGalleryImage(id); load(); setSuccess('Image supprimée'); } catch (err: any) { setError(err.message); }
  };

  if (editing) {
    return (
      <div>
        <PageTitle title={editing.id ? '✏️ Modifier l\'image' : '➕ Nouvelle image'} />
        <SuccessMessage message={success} /><ErrorMessage message={error} />
        <form onSubmit={save} className="space-y-6">
          <LangTabs lang={lang} onChange={setLang} />
          <Card title="Image">
            <div className="space-y-4">
              <Field label="Upload une image">
                <input type="file" accept="image/*" onChange={handleUpload} className="text-sm text-white/50" />
                {uploading && <p className="text-xs text-[#B8963E]">Upload en cours...</p>}
              </Field>
              <Field label="URL de l'image"><Input value={editing.src || ''} onChange={e => set('src', e.target.value)} required placeholder="/images/gallery-1.jpg" /></Field>
              {editing.src && <img src={editing.src} alt="Preview" className="h-40 object-cover rounded-lg" />}
            </div>
          </Card>
          <Card title="Métadonnées">
            <div className="space-y-4">
              <Field label={`Titre (${lang.toUpperCase()})`}><Input value={editing[`title_${lang}`] || ''} onChange={e => set(`title_${lang}`, e.target.value)} /></Field>
              <Field label={`Catégorie (${lang.toUpperCase()})`}><Input value={editing[`category_${lang}`] || ''} onChange={e => set(`category_${lang}`, e.target.value)} /></Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Ordre"><Input type="number" value={editing.sort_order || 0} onChange={e => set('sort_order', parseInt(e.target.value))} /></Field>
                <Field label="Grande image"><label className="flex items-center gap-2 mt-1 cursor-pointer"><input type="checkbox" checked={editing.is_tall} onChange={e => set('is_tall', e.target.checked)} className="w-4 h-4 accent-[#B8963E]" /><span className="text-sm text-white/70">2 lignes</span></label></Field>
                <Field label="Active"><label className="flex items-center gap-2 mt-1 cursor-pointer"><input type="checkbox" checked={editing.is_active} onChange={e => set('is_active', e.target.checked)} className="w-4 h-4 accent-[#B8963E]" /><span className="text-sm text-white/70">Visible</span></label></Field>
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
      <PageTitle title="🖼️ Galerie" subtitle="Gérez les images de la galerie" />
      <SuccessMessage message={success} /><ErrorMessage message={error} />
      <button onClick={() => setEditing({ ...EMPTY })} className="mb-6 px-5 py-2.5 bg-[#B8963E] text-white text-sm font-medium rounded-lg hover:bg-[#9A7A2E]">➕ Ajouter une image</button>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(img => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/10">
            <img src={img.src} alt={img.title} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
              <button onClick={() => setEditing(img)} className="px-3 py-1.5 bg-white/20 text-white text-xs rounded-lg">✏️</button>
              <button onClick={() => remove(img.id)} className="px-3 py-1.5 bg-red-500/30 text-white text-xs rounded-lg">🗑️</button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50">
              <p className="text-xs text-white truncate">{img.title}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/30 text-sm col-span-full text-center py-8">Aucune image.</p>}
      </div>
    </div>
  );
}

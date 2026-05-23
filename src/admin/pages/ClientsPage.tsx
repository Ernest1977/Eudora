import { useState, useEffect } from 'react';
import { PageTitle, Card, Field, Input, TextArea, SaveButton, SuccessMessage, ErrorMessage } from '../components/FormField';
import { auth } from '../api';

const API = import.meta.env.VITE_API_URL || '';

async function apiRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('admin_token');
  const headers: Record<string, string> = { ...(options.headers as Record<string, string> || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (res.status === 401) { auth.logout(); window.location.href = '/admin/login'; throw new Error('Session expirée'); }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
  return data;
}

const EMPTY_CLIENT = { first_name: '', last_name: '', email: '', phone: '', address: '', city: '', country: 'Italie', notes: '', status: 'active', preferred_language: 'fr' };

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = (p = 1, q = search) => {
    apiRequest(`/api/clients/?page=${p}&per_page=15&search=${encodeURIComponent(q)}`)
      .then(d => { setClients(d.clients || []); setTotalPages(d.pages || 1); setTotal(d.total || 0); setPage(p); })
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const set = (key: string, value: any) => setEditing((d: any) => ({ ...d, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setSuccess(''); setError('');
    try {
      if (editing.id) await apiRequest(`/api/clients/${editing.id}`, { method: 'PUT', body: JSON.stringify(editing) });
      else await apiRequest('/api/clients/', { method: 'POST', body: JSON.stringify(editing) });
      setSuccess(editing.id ? 'Client mis à jour !' : 'Client créé !'); setEditing(null); load(page);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer ce client et toutes ses données ?')) return;
    try { await apiRequest(`/api/clients/${id}`, { method: 'DELETE' }); load(page); setSuccess('Client supprimé'); } catch (err: any) { setError(err.message); }
  };

  // === FORMULAIRE D'ÉDITION ===
  if (editing) {
    return (
      <div>
        <PageTitle title={editing.id ? `✏️ Modifier — ${editing.first_name} ${editing.last_name}` : '➕ Nouveau client'} />
        <SuccessMessage message={success} /><ErrorMessage message={error} />
        <form onSubmit={save} className="space-y-6">
          <Card title="Informations personnelles">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Prénom *"><Input value={editing.first_name || ''} onChange={e => set('first_name', e.target.value)} required placeholder="Marie" /></Field>
                <Field label="Nom *"><Input value={editing.last_name || ''} onChange={e => set('last_name', e.target.value)} required placeholder="Dupont" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email *"><Input type="email" value={editing.email || ''} onChange={e => set('email', e.target.value)} required placeholder="marie@email.com" /></Field>
                <Field label="Téléphone"><Input value={editing.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+39 327 000 0000" /></Field>
              </div>
              <Field label="Adresse"><Input value={editing.address || ''} onChange={e => set('address', e.target.value)} placeholder="123 Via Roma" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ville"><Input value={editing.city || ''} onChange={e => set('city', e.target.value)} placeholder="Turin" /></Field>
                <Field label="Pays"><Input value={editing.country || ''} onChange={e => set('country', e.target.value)} placeholder="Italie" /></Field>
              </div>
            </div>
          </Card>

          <Card title="Paramètres">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Statut">
                  <select value={editing.status || 'active'} onChange={e => set('status', e.target.value)} className="w-full bg-white/5 border border-white/10 focus:border-[#B8963E] rounded-lg px-4 py-2.5 text-sm text-white outline-none">
                    <option value="active" className="bg-[#1a1a2e]">Actif</option>
                    <option value="prospect" className="bg-[#1a1a2e]">Prospect</option>
                    <option value="inactive" className="bg-[#1a1a2e]">Inactif</option>
                  </select>
                </Field>
                <Field label="Langue préférée">
                  <select value={editing.preferred_language || 'fr'} onChange={e => set('preferred_language', e.target.value)} className="w-full bg-white/5 border border-white/10 focus:border-[#B8963E] rounded-lg px-4 py-2.5 text-sm text-white outline-none">
                    <option value="fr" className="bg-[#1a1a2e]">🇫🇷 Français</option>
                    <option value="en" className="bg-[#1a1a2e]">🇬🇧 English</option>
                    <option value="it" className="bg-[#1a1a2e]">🇮🇹 Italiano</option>
                  </select>
                </Field>
              </div>
              <Field label="Notes internes"><TextArea rows={3} value={editing.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Notes sur le client..." /></Field>
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

  // === LISTE DES CLIENTS ===
  return (
    <div>
      <PageTitle title="👥 Clients" subtitle={`${total} client(s) au total`} />
      <SuccessMessage message={success} /><ErrorMessage message={error} />

      {/* Barre d'actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button onClick={() => setEditing({ ...EMPTY_CLIENT })} className="px-5 py-2.5 bg-[#B8963E] text-white text-sm font-medium rounded-lg hover:bg-[#9A7A2E] transition-all flex-shrink-0">
          ➕ Nouveau client
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load(1)}
            placeholder="🔍 Rechercher par nom, email, téléphone..."
            className="w-full bg-white/5 border border-white/10 focus:border-[#B8963E] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none"
          />
        </div>
        <button onClick={() => load(1)} className="px-4 py-2.5 bg-white/5 text-white/60 text-sm rounded-lg hover:bg-white/10">Rechercher</button>
      </div>

      {/* Table des clients */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Client</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden lg:table-cell">Téléphone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden lg:table-cell">Ville</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider hidden md:table-cell">Dépensé</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#B8963E]/20 flex items-center justify-center text-sm font-bold text-[#B8963E] flex-shrink-0">
                        {c.first_name?.charAt(0)}{c.last_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{c.full_name}</p>
                        <p className="text-xs text-white/30 md:hidden">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/60 hidden md:table-cell">{c.email}</td>
                  <td className="px-4 py-3 text-sm text-white/60 hidden lg:table-cell">{c.phone || '—'}</td>
                  <td className="px-4 py-3 text-sm text-white/60 hidden lg:table-cell">{c.city || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                      c.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      c.status === 'prospect' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#B8963E] font-medium hidden md:table-cell">{c.total_spent || 0}€</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setEditing(c)} className="px-2.5 py-1.5 bg-white/5 text-white/60 text-xs rounded-lg hover:bg-white/10">✏️</button>
                      <button onClick={() => remove(c.id)} className="px-2.5 py-1.5 bg-red-500/10 text-red-400 text-xs rounded-lg hover:bg-red-500/20">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-white/30 text-sm">Aucun client trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => load(page - 1)} disabled={page <= 1} className="px-3 py-1.5 bg-white/5 text-white/40 text-sm rounded-lg hover:bg-white/10 disabled:opacity-30">← Préc.</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
            <button key={p} onClick={() => load(p)} className={`w-8 h-8 rounded-lg text-xs ${p === page ? 'bg-[#B8963E] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>{p}</button>
          ))}
          <button onClick={() => load(page + 1)} disabled={page >= totalPages} className="px-3 py-1.5 bg-white/5 text-white/40 text-sm rounded-lg hover:bg-white/10 disabled:opacity-30">Suiv. →</button>
        </div>
      )}
    </div>
  );
}

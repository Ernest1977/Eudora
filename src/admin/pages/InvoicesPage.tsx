import { useState, useEffect } from 'react';
import { PageTitle, Card, Field, Input, TextArea, SaveButton, SuccessMessage, ErrorMessage } from '../components/FormField';
import { auth } from '../api';
import { FileText, Plus, Trash2 } from 'lucide-react';

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

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'bg-gray-500/20 text-gray-400' },
  sent: { label: 'Envoyée', color: 'bg-blue-500/20 text-blue-400' },
  paid: { label: 'Payée', color: 'bg-green-500/20 text-green-400' },
  overdue: { label: 'En retard', color: 'bg-red-500/20 text-red-400' },
  cancelled: { label: 'Annulée', color: 'bg-orange-500/20 text-orange-400' },
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [viewing, setViewing] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [newInvoice, setNewInvoice] = useState<any>({ client_id: '', notes: '', tva_rate: 0.22, items: [{ description: '', quantity: 1, unit_price: 0 }] });
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = (p = 1) => {
    const statusFilter = filter ? `&status=${filter}` : '';
    apiRequest(`/api/invoices/?page=${p}&per_page=15${statusFilter}`)
      .then(d => { setInvoices(d.invoices || []); setTotalPages(d.pages || 1); setTotal(d.total || 0); setPage(p); })
      .catch(() => {});
  };

  const loadClients = () => {
    apiRequest('/api/clients/?per_page=200').then(d => setClients(d.clients || [])).catch(() => {});
  };

  useEffect(() => { load(); loadClients(); }, []);

  // === Créer une facture ===
  const addItem = () => setNewInvoice((d: any) => ({ ...d, items: [...d.items, { description: '', quantity: 1, unit_price: 0 }] }));
  const removeItem = (idx: number) => setNewInvoice((d: any) => ({ ...d, items: d.items.filter((_: any, i: number) => i !== idx) }));
  const updateItem = (idx: number, key: string, value: any) => {
    setNewInvoice((d: any) => ({
      ...d,
      items: d.items.map((item: any, i: number) => i === idx ? { ...item, [key]: value } : item)
    }));
  };

  const calcTotal = () => {
    const subtotal = newInvoice.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0);
    const tva = subtotal * (newInvoice.tva_rate || 0);
    return { subtotal, tva, total: subtotal + tva };
  };

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setSuccess(''); setError('');
    try {
      if (!newInvoice.client_id) throw new Error('Sélectionnez un client');
      if (!newInvoice.items.length || !newInvoice.items[0].description) throw new Error('Ajoutez au moins une ligne');
      await apiRequest('/api/invoices/', {
        method: 'POST',
        body: JSON.stringify({
          ...newInvoice,
          client_id: parseInt(newInvoice.client_id),
          items: newInvoice.items.map((item: any) => ({
            ...item,
            quantity: parseFloat(item.quantity) || 1,
            unit_price: parseFloat(item.unit_price) || 0,
          })),
        }),
      });
      setSuccess('Facture créée !'); setCreating(false);
      setNewInvoice({ client_id: '', notes: '', tva_rate: 0.22, items: [{ description: '', quantity: 1, unit_price: 0 }] });
      load(page);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  // === Changer le statut ===
  const updateStatus = async (id: number, status: string, payment_method?: string) => {
    try {
      await apiRequest(`/api/invoices/${id}`, { method: 'PUT', body: JSON.stringify({ status, payment_method }) });
      setSuccess('Statut mis à jour'); load(page);
      if (viewing?.id === id) {
        const updated = await apiRequest(`/api/invoices/${id}`);
        setViewing(updated.invoice);
      }
    } catch (err: any) { setError(err.message); }
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer cette facture ?')) return;
    try { await apiRequest(`/api/invoices/${id}`, { method: 'DELETE' }); load(page); setViewing(null); setSuccess('Facture supprimée'); }
    catch (err: any) { setError(err.message); }
  };

  // === VUE DÉTAILLÉE D'UNE FACTURE ===
  if (viewing) {
    const inv = viewing;
    const st = STATUS_LABELS[inv.status] || STATUS_LABELS.draft;
    return (
      <div>
        <PageTitle title={`🧾 Facture ${inv.invoice_number}`} subtitle={`Client : ${inv.client_name}`} />
        <SuccessMessage message={success} /><ErrorMessage message={error} />
        <button onClick={() => setViewing(null)} className="mb-6 text-sm text-[#B8963E] hover:underline">← Retour à la liste</button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Détails">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-white/40">Numéro :</span> <span className="text-white font-medium ml-2">{inv.invoice_number}</span></div>
                <div><span className="text-white/40">Statut :</span> <span className={`ml-2 inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${st.color}`}>{st.label}</span></div>
                <div><span className="text-white/40">Date :</span> <span className="text-white ml-2">{inv.issue_date}</span></div>
                <div><span className="text-white/40">Échéance :</span> <span className="text-white ml-2">{inv.due_date}</span></div>
                {inv.payment_date && <div><span className="text-white/40">Payée le :</span> <span className="text-white ml-2">{inv.payment_date}</span></div>}
                {inv.payment_method && <div><span className="text-white/40">Moyen :</span> <span className="text-white ml-2">{inv.payment_method}</span></div>}
              </div>
              {inv.notes && <p className="text-sm text-white/40 mt-4 pt-4 border-t border-white/10">📝 {inv.notes}</p>}
            </Card>

            <Card title="Lignes de facture">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10">
                  <th className="text-left py-2 text-white/40">Description</th>
                  <th className="text-right py-2 text-white/40">Qté</th>
                  <th className="text-right py-2 text-white/40">P.U.</th>
                  <th className="text-right py-2 text-white/40">Total</th>
                </tr></thead>
                <tbody>
                  {inv.items?.map((item: any) => (
                    <tr key={item.id} className="border-b border-white/5">
                      <td className="py-2 text-white">{item.description}</td>
                      <td className="py-2 text-right text-white/60">{item.quantity}</td>
                      <td className="py-2 text-right text-white/60">{item.unit_price}€</td>
                      <td className="py-2 text-right text-white font-medium">{item.total}€</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 pt-4 border-t border-white/10 space-y-1 text-sm text-right">
                <div className="text-white/40">Sous-total : <span className="text-white ml-2">{inv.subtotal}€</span></div>
                <div className="text-white/40">TVA ({(inv.tva_rate * 100).toFixed(0)}%) : <span className="text-white ml-2">{inv.tva_amount?.toFixed(2)}€</span></div>
                <div className="text-lg font-bold text-[#B8963E] pt-2">Total : {inv.total_amount?.toFixed(2)}€</div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="Actions">
              <div className="space-y-2">
                {inv.status === 'draft' && <button onClick={() => updateStatus(inv.id, 'sent')} className="w-full py-2.5 bg-blue-500/20 text-blue-400 text-sm rounded-lg hover:bg-blue-500/30">📤 Marquer comme envoyée</button>}
                {(inv.status === 'sent' || inv.status === 'overdue') && (
                  <button onClick={() => { const method = prompt('Moyen de paiement (virement, carte, espèces) :'); if (method) updateStatus(inv.id, 'paid', method); }}
                    className="w-full py-2.5 bg-green-500/20 text-green-400 text-sm rounded-lg hover:bg-green-500/30">✅ Marquer comme payée</button>
                )}
                {inv.status === 'sent' && <button onClick={() => updateStatus(inv.id, 'overdue')} className="w-full py-2.5 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30">⏰ Marquer en retard</button>}
                {inv.status !== 'cancelled' && inv.status !== 'paid' && <button onClick={() => updateStatus(inv.id, 'cancelled')} className="w-full py-2.5 bg-orange-500/20 text-orange-400 text-sm rounded-lg hover:bg-orange-500/30">❌ Annuler</button>}
                {inv.status === 'draft' && <button onClick={() => remove(inv.id)} className="w-full py-2.5 bg-red-500/10 text-red-400 text-sm rounded-lg hover:bg-red-500/20 mt-4">🗑️ Supprimer</button>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // === FORMULAIRE DE CRÉATION ===
  if (creating) {
    const totals = calcTotal();
    return (
      <div>
        <PageTitle title="➕ Nouvelle facture" />
        <SuccessMessage message={success} /><ErrorMessage message={error} />
        <form onSubmit={createInvoice} className="space-y-6">
          <Card title="Client">
            <Field label="Client *">
              <select value={newInvoice.client_id} onChange={e => setNewInvoice((d: any) => ({ ...d, client_id: e.target.value }))} required
                className="w-full bg-white/5 border border-white/10 focus:border-[#B8963E] rounded-lg px-4 py-2.5 text-sm text-white outline-none">
                <option value="" className="bg-[#1a1a2e]">Sélectionner un client...</option>
                {clients.map(c => <option key={c.id} value={c.id} className="bg-[#1a1a2e]">{c.full_name} — {c.email}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Field label="Taux TVA (%)"><Input type="number" step="0.01" value={(newInvoice.tva_rate * 100)} onChange={e => setNewInvoice((d: any) => ({ ...d, tva_rate: parseFloat(e.target.value) / 100 }))} /></Field>
              <Field label="Notes"><Input value={newInvoice.notes} onChange={e => setNewInvoice((d: any) => ({ ...d, notes: e.target.value }))} placeholder="Formule Complète" /></Field>
            </div>
          </Card>

          <Card title="Lignes de facture" actions={
            <button type="button" onClick={addItem} className="flex items-center gap-1 px-3 py-1.5 bg-[#B8963E]/20 text-[#B8963E] text-xs rounded-lg hover:bg-[#B8963E]/30">
              <Plus size={14} /> Ajouter
            </button>
          }>
            <div className="space-y-3">
              {newInvoice.items.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-3 items-end">
                  <div className="flex-1"><Field label={idx === 0 ? 'Description' : ''}><Input value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Colorimétrie" required /></Field></div>
                  <div className="w-20"><Field label={idx === 0 ? 'Qté' : ''}><Input type="number" min={1} value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} /></Field></div>
                  <div className="w-28"><Field label={idx === 0 ? 'Prix €' : ''}><Input type="number" step="0.01" value={item.unit_price} onChange={e => updateItem(idx, 'unit_price', e.target.value)} required /></Field></div>
                  <div className="w-24 text-right text-sm text-white/60 pb-2">{((item.quantity || 0) * (item.unit_price || 0)).toFixed(2)}€</div>
                  {newInvoice.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)} className="pb-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-right text-sm space-y-1">
              <div className="text-white/40">Sous-total : <span className="text-white font-medium ml-2">{totals.subtotal.toFixed(2)}€</span></div>
              <div className="text-white/40">TVA ({(newInvoice.tva_rate * 100).toFixed(0)}%) : <span className="text-white ml-2">{totals.tva.toFixed(2)}€</span></div>
              <div className="text-lg font-bold text-[#B8963E] pt-2">Total : {totals.total.toFixed(2)}€</div>
            </div>
          </Card>

          <div className="flex gap-3">
            <SaveButton loading={loading} />
            <button type="button" onClick={() => setCreating(false)} className="px-6 py-2.5 bg-white/5 text-white/50 text-sm rounded-lg hover:bg-white/10">Annuler</button>
          </div>
        </form>
      </div>
    );
  }

  // === LISTE DES FACTURES ===
  return (
    <div>
      <PageTitle title="🧾 Factures" subtitle={`${total} facture(s) au total`} />
      <SuccessMessage message={success} /><ErrorMessage message={error} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button onClick={() => { setCreating(true); loadClients(); }} className="px-5 py-2.5 bg-[#B8963E] text-white text-sm font-medium rounded-lg hover:bg-[#9A7A2E] flex-shrink-0">
          ➕ Nouvelle facture
        </button>
        <select value={filter} onChange={e => { setFilter(e.target.value); setTimeout(() => load(1), 100); }}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none">
          <option value="" className="bg-[#1a1a2e]">Tous les statuts</option>
          <option value="draft" className="bg-[#1a1a2e]">Brouillons</option>
          <option value="sent" className="bg-[#1a1a2e]">Envoyées</option>
          <option value="paid" className="bg-[#1a1a2e]">Payées</option>
          <option value="overdue" className="bg-[#1a1a2e]">En retard</option>
        </select>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/10">
              <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase">N° Facture</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase hidden md:table-cell">Client</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase hidden lg:table-cell">Date</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase">Statut</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-white/40 uppercase">Montant</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-white/40 uppercase">Actions</th>
            </tr></thead>
            <tbody>
              {invoices.map(inv => {
                const st = STATUS_LABELS[inv.status] || STATUS_LABELS.draft;
                return (
                  <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer" onClick={() => setViewing(inv)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#B8963E]" />
                        <span className="text-sm font-medium text-white">{inv.invoice_number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/60 hidden md:table-cell">{inv.client_name}</td>
                    <td className="px-4 py-3 text-sm text-white/40 hidden lg:table-cell">{inv.issue_date}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${st.color}`}>{st.label}</span></td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-[#B8963E]">{inv.total_amount?.toFixed(2)}€</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={e => { e.stopPropagation(); setViewing(inv); }} className="px-2.5 py-1.5 bg-white/5 text-white/60 text-xs rounded-lg hover:bg-white/10">👁️</button>
                    </td>
                  </tr>
                );
              })}
              {invoices.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-white/30 text-sm">Aucune facture</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => load(p)} className={`w-8 h-8 rounded-lg text-xs ${p === page ? 'bg-[#B8963E] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}

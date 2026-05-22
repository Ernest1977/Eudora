import { useState, useEffect } from 'react';
import { messages as messagesApi } from '../api';
import { PageTitle, SuccessMessage, ErrorMessage } from '../components/FormField';
import { Mail, MailOpen, Trash2 } from 'lucide-react';

export default function MessagesPage() {
  const [msgs, setMsgs] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [unread, setUnread] = useState(0);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = (p = 1) => {
    messagesApi.list(p).then(d => {
      setMsgs(d.messages || []);
      setTotal(d.total || 0);
      setPages(d.pages || 1);
      setUnread(d.unread_count || 0);
      setPage(p);
    }).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const open = async (id: number) => {
    try {
      const data = await messagesApi.get(id);
      setSelected(data.message);
      load(page); // refresh pour marquer comme lu
    } catch (err: any) { setError(err.message); }
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      await messagesApi.delete(id);
      setSelected(null);
      setSuccess('Message supprimé');
      load(page);
    } catch (err: any) { setError(err.message); }
  };

  return (
    <div>
      <PageTitle title="📧 Messages" subtitle={`${total} message(s) — ${unread} non lu(s)`} />
      <SuccessMessage message={success} /><ErrorMessage message={error} />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Liste */}
        <div className="lg:col-span-2 space-y-2">
          {msgs.map(m => (
            <button
              key={m.id}
              onClick={() => open(m.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected?.id === m.id ? 'bg-[#B8963E]/10 border-[#B8963E]/30' :
                m.is_read ? 'bg-white/[0.02] border-white/5 hover:bg-white/5' :
                'bg-white/5 border-white/10 hover:bg-white/[0.07]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{m.is_read ? <MailOpen size={16} className="text-white/30" /> : <Mail size={16} className="text-[#B8963E]" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-baseline">
                    <p className={`text-sm truncate ${m.is_read ? 'text-white/60' : 'text-white font-medium'}`}>{m.name}</p>
                    <span className="text-[10px] text-white/30 flex-shrink-0 ml-2">{new Date(m.created_at).toLocaleDateString('fr')}</span>
                  </div>
                  <p className="text-xs text-white/30 truncate">{m.service || 'Pas de prestation'}</p>
                  <p className="text-xs text-white/20 truncate mt-0.5">{m.message}</p>
                </div>
              </div>
            </button>
          ))}

          {msgs.length === 0 && <p className="text-white/30 text-sm text-center py-8">Aucun message.</p>}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => load(p)} className={`w-8 h-8 rounded-lg text-xs ${p === page ? 'bg-[#B8963E] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>

        {/* Détail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                  <p className="text-sm text-[#B8963E]">{selected.email}</p>
                  {selected.phone && <p className="text-sm text-white/40">{selected.phone}</p>}
                  {selected.service && <p className="text-xs text-white/30 mt-1">Prestation : {selected.service}</p>}
                  <p className="text-xs text-white/20 mt-1">{new Date(selected.created_at).toLocaleString('fr')}</p>
                </div>
                <button onClick={() => remove(selected.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={16} /></button>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <a href={`mailto:${selected.email}?subject=Re: Votre demande — Eudora Conseil`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8963E] text-white text-sm rounded-lg hover:bg-[#9A7A2E] transition-all">
                  ✉️ Répondre par email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
              <Mail size={48} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-sm">Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

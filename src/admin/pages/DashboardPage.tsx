import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle } from '../components/FormField';
import { messages, finance } from '../api';
import { Home, Briefcase, Package, Star, Images, Mail, Settings, User } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [msgs, setMsgs] = useState<any>(null);

  useEffect(() => {
    finance.dashboard().then(setStats).catch(() => {});
    messages.list(1).then(setMsgs).catch(() => {});
  }, []);

  const quickLinks = [
    { to: '/admin/hero', icon: Home, label: 'Hero', color: 'bg-blue-500/20 text-blue-400' },
    { to: '/admin/about', icon: User, label: 'About', color: 'bg-purple-500/20 text-purple-400' },
    { to: '/admin/services', icon: Briefcase, label: 'Services', color: 'bg-green-500/20 text-green-400' },
    { to: '/admin/formulas', icon: Package, label: 'Formules', color: 'bg-yellow-500/20 text-yellow-400' },
    { to: '/admin/testimonials', icon: Star, label: 'Témoignages', color: 'bg-orange-500/20 text-orange-400' },
    { to: '/admin/gallery', icon: Images, label: 'Galerie', color: 'bg-pink-500/20 text-pink-400' },
    { to: '/admin/messages', icon: Mail, label: 'Messages', color: 'bg-cyan-500/20 text-cyan-400' },
    { to: '/admin/settings', icon: Settings, label: 'Paramètres', color: 'bg-gray-500/20 text-gray-400' },
  ];

  return (
    <div>
      <PageTitle title="Dashboard" subtitle="Vue d'ensemble de votre site Eudora Conseil & Relooking" />

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Clients', value: stats.total_clients || 0, color: 'text-blue-400' },
            { label: 'Factures', value: stats.total_invoices || 0, color: 'text-green-400' },
            { label: 'Messages non lus', value: msgs?.unread_count || 0, color: 'text-orange-400' },
            { label: 'Revenu total', value: `${stats.total_revenue || 0}€`, color: 'text-[#B8963E]' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <h2 className="text-lg font-semibold text-white mb-4">Gestion du contenu</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {quickLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#B8963E]/30 hover:bg-white/[0.07] transition-all group"
          >
            <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center mb-3`}>
              <link.icon size={20} />
            </div>
            <p className="text-sm font-medium text-white group-hover:text-[#B8963E] transition-colors">
              {link.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Messages */}
      {msgs && msgs.messages?.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Messages récents</h2>
            <Link to="/admin/messages" className="text-sm text-[#B8963E] hover:underline">Voir tout →</Link>
          </div>
          <div className="space-y-3">
            {msgs.messages.slice(0, 5).map((m: any) => (
              <div key={m.id} className={`flex items-start gap-3 p-3 rounded-lg ${m.is_read ? 'bg-white/[0.02]' : 'bg-[#B8963E]/5 border border-[#B8963E]/10'}`}>
                <div className="w-8 h-8 rounded-full bg-[#B8963E]/20 flex items-center justify-center text-xs font-bold text-[#B8963E] flex-shrink-0">
                  {m.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{m.name}</p>
                  <p className="text-xs text-white/40 truncate">{m.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

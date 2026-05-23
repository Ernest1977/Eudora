import { NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  LayoutDashboard, Home, User, Briefcase, Package,
  Star, Images, Mail, Settings, LogOut, ExternalLink,
  Users, FileText, X
} from 'lucide-react';

const cmsLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/hero', icon: Home, label: 'Section Hero' },
  { to: '/admin/about', icon: User, label: 'Section About' },
  { to: '/admin/services', icon: Briefcase, label: 'Services' },
  { to: '/admin/formulas', icon: Package, label: 'Formules' },
  { to: '/admin/testimonials', icon: Star, label: 'Témoignages' },
  { to: '/admin/gallery', icon: Images, label: 'Galerie' },
];

const businessLinks = [
  { to: '/admin/clients', icon: Users, label: 'Clients' },
  { to: '/admin/invoices', icon: FileText, label: 'Factures' },
  { to: '/admin/messages', icon: Mail, label: 'Messages' },
  { to: '/admin/settings', icon: Settings, label: 'Paramètres' },
];

export default function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
      isActive
        ? 'bg-[#B8963E] text-white font-medium'
        : 'text-white/60 hover:text-white hover:bg-white/5'
    }`;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1a1a2e] text-white transition-transform duration-300 lg:translate-x-0 flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <img src="/images/eud-or.png" alt="Logo" className="h-8 w-auto brightness-0 invert" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#B8963E]">Admin</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white"><X size={20} /></button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* CMS */}
          <p className="px-3 mb-2 text-[10px] font-medium text-white/30 uppercase tracking-widest">Contenu du site</p>
          <div className="space-y-1 mb-6">
            {cmsLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.end} onClick={onClose} className={linkClass}>
                <link.icon size={18} />{link.label}
              </NavLink>
            ))}
          </div>

          {/* Business */}
          <p className="px-3 mb-2 text-[10px] font-medium text-white/30 uppercase tracking-widest">Gestion</p>
          <div className="space-y-1">
            {businessLinks.map(link => (
              <NavLink key={link.to} to={link.to} onClick={onClose} className={linkClass}>
                <link.icon size={18} />{link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div className="flex-shrink-0 border-t border-white/10 p-4 space-y-3">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 transition-all">
            <ExternalLink size={14} /> Voir le site
          </a>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B8963E]/30 flex items-center justify-center text-sm font-bold text-[#B8963E]">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-[10px] text-white/40">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}

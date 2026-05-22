import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  children: ReactNode;
  hint?: string;
}

export function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-white/70 uppercase tracking-wider">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-white/30">{hint}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={`w-full bg-white/5 border border-white/10 focus:border-[#B8963E] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-colors ${props.className || ''}`}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea(props: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={`w-full bg-white/5 border border-white/10 focus:border-[#B8963E] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-colors resize-none ${props.className || ''}`}
    />
  );
}

export function SaveButton({ loading, onClick }: { loading: boolean; onClick?: () => void }) {
  return (
    <button
      type="submit"
      disabled={loading}
      onClick={onClick}
      className="px-6 py-2.5 bg-[#B8963E] hover:bg-[#9A7A2E] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all"
    >
      {loading ? 'Enregistrement...' : '💾 Enregistrer'}
    </button>
  );
}

export function DeleteButton({ onClick, loading }: { onClick: () => void; loading?: boolean }) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-all"
    >
      🗑️ Supprimer
    </button>
  );
}

export function Card({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
    </div>
  );
}

export function SuccessMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">
      ✅ {message}
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
      ❌ {message}
    </div>
  );
}

/** Onglets de langue pour les formulaires multilingues */
export function LangTabs({ lang, onChange }: { lang: string; onChange: (l: string) => void }) {
  const langs = [
    { code: 'fr', label: '🇫🇷 Français' },
    { code: 'en', label: '🇬🇧 English' },
    { code: 'it', label: '🇮🇹 Italiano' },
  ];
  return (
    <div className="flex gap-2 mb-6">
      {langs.map(l => (
        <button
          key={l.code}
          type="button"
          onClick={() => onChange(l.code)}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            lang === l.code
              ? 'bg-[#B8963E] text-white font-medium'
              : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

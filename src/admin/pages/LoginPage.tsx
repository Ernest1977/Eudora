import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/images/eud-or.png" alt="Logo" className="h-16 mx-auto mb-4 brightness-0 invert" />
          <h1 className="text-white text-xl font-semibold">Administration</h1>
          <p className="text-white/40 text-sm mt-1">Connectez-vous pour gérer votre site</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 focus:border-[#B8963E] rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-colors"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-white/70 mb-1.5 uppercase tracking-wider">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 focus:border-[#B8963E] rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#B8963E] hover:bg-[#9A7A2E] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Eudora Conseil & Relooking — Panel Admin
        </p>
      </div>
    </div>
  );
}

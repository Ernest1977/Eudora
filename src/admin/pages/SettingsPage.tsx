import { useState, useEffect } from 'react';
import { cms } from '../api';
import { PageTitle, Card, Field, Input, SaveButton, SuccessMessage, ErrorMessage } from '../components/FormField';

const SETTING_FIELDS = [
  { key: 'site_name', label: 'Nom du site', placeholder: 'Eudora Conseil & Relooking' },
  { key: 'email', label: 'Email de contact', placeholder: 'info@ecrelooking.com' },
  { key: 'phone', label: 'Téléphone', placeholder: '+39 327 225 0364' },
  { key: 'location', label: 'Localisation', placeholder: 'Turin, Italie — Europe' },
  { key: 'hours', label: 'Horaires', placeholder: 'Lun–Ven : 9h–19h' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://www.facebook.com/...' },
  { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://www.instagram.com/...' },
  { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://www.linkedin.com/...' },
  { key: 'tiktok_url', label: 'TikTok URL', placeholder: 'https://www.tiktok.com/...' },
  { key: 'company_siret', label: 'SIRET / P.IVA', placeholder: 'IT12345678901' },
  { key: 'tva_rate', label: 'Taux TVA (%)', placeholder: '22' },
];

export default function SettingsPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cms.getSettings().then(setData).catch(() => {});
  }, []);

  const set = (key: string, value: string) => setData(d => ({ ...d, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      await cms.updateSettings(data);
      setSuccess('Paramètres sauvegardés !');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageTitle title="⚙️ Paramètres" subtitle="Informations de contact, réseaux sociaux, paramètres globaux" />
      <SuccessMessage message={success} />
      <ErrorMessage message={error} />

      <form onSubmit={save} className="space-y-6">
        <Card title="Informations de contact">
          <div className="space-y-4">
            {SETTING_FIELDS.slice(0, 5).map(f => (
              <Field key={f.key} label={f.label}>
                <Input value={data[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
              </Field>
            ))}
          </div>
        </Card>

        <Card title="Réseaux sociaux">
          <div className="space-y-4">
            {SETTING_FIELDS.slice(5, 9).map(f => (
              <Field key={f.key} label={f.label}>
                <Input value={data[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
              </Field>
            ))}
          </div>
        </Card>

        <Card title="Entreprise">
          <div className="space-y-4">
            {SETTING_FIELDS.slice(9).map(f => (
              <Field key={f.key} label={f.label}>
                <Input value={data[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
              </Field>
            ))}
          </div>
        </Card>

        <SaveButton loading={loading} />
      </form>
    </div>
  );
}

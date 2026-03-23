import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function LoginForm() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.username, form.password);
    } catch {
      toast.error(t('admin.login_error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('admin.username')}
        type="text"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
        autoComplete="username"
      />
      <Input
        label={t('admin.password')}
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        autoComplete="current-password"
      />
      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? t('common.loading') : t('admin.login')}
      </Button>
    </form>
  );
}

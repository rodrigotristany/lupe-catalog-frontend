import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { updateSettings } from '../../api/admin';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';

export function SettingsForm({ settings }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    store_name: '',
    whatsapp_number: '',
    default_language: 'es',
    ...settings,
  });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => toast.success(t('admin.saved')),
    onError: () => toast.error(t('common.error')),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }} className="space-y-6 max-w-lg">
      <Input
        label={t('admin.store_name')}
        value={form.store_name}
        onChange={(e) => setForm({ ...form, store_name: e.target.value })}
      />
      <Input
        label={t('admin.whatsapp_number')}
        value={form.whatsapp_number}
        onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
        placeholder="+1234567890"
      />
      <Select
        label={t('admin.default_language')}
        value={form.default_language}
        onChange={(e) => setForm({ ...form, default_language: e.target.value })}
      >
        <option value="es">Español</option>
        <option value="en">English</option>
      </Select>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? t('common.loading') : t('common.save')}
      </Button>
    </form>
  );
}

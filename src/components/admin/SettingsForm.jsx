import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
import { updateSettings } from '../../api/admin';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';

export function SettingsForm({ settings }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    store_name: '',
    whatsapp_number: '',
    default_language: 'es',
    payment_methods: [],
    ...settings,
  });

  useEffect(() => {
    if (settings) setForm({ payment_methods: [], ...settings });
  }, [settings]);

  const paymentMethodErrors = (form.payment_methods ?? []).map((method, idx) => {
    if (!method.trim()) return t('admin.payment_method_invalid');
    if (form.payment_methods.some((m, i) => i !== idx && m === method)) {
      return t('admin.payment_method_invalid');
    }
    return null;
  });
  const hasPaymentMethodErrors = paymentMethodErrors.some(Boolean);

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
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 block">{t('admin.payment_methods')}</label>
        {(form.payment_methods ?? []).map((method, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="flex-1 flex flex-col gap-1">
              <input
                type="text"
                value={method}
                onChange={(e) => {
                  const updated = [...form.payment_methods];
                  updated[idx] = e.target.value;
                  setForm({ ...form, payment_methods: updated });
                }}
                placeholder="Ej: Efectivo"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lupe-400 focus:border-transparent ${
                  paymentMethodErrors[idx] ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {paymentMethodErrors[idx] && (
                <p className="text-xs text-red-600">{paymentMethodErrors[idx]}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, payment_methods: form.payment_methods.filter((_, i) => i !== idx) })
              }
              className="mt-0.5 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setForm({ ...form, payment_methods: [...(form.payment_methods ?? []), ''] })}
          className="flex items-center gap-1.5 text-sm text-lupe-blue hover:underline"
        >
          <Plus size={14} />
          {t('admin.add_payment_method')}
        </button>
      </div>

      <Button type="submit" disabled={mutation.isPending || hasPaymentMethodErrors}>
        {mutation.isPending ? t('common.loading') : t('common.save')}
      </Button>
    </form>
  );
}

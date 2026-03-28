import { MessageCircle, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatPrice';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { useCart } from '../../hooks/useCart';
import { useSettings } from '../../hooks/useSettings';
import { Button } from '../ui/Button';

export function CartSummary() {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useCart();
  const { data: settings } = useSettings();

  const total = state.items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  function handlePurchase() {
    if (!settings) return;
    const { url, message } = buildWhatsAppUrl(state.items, settings, i18n.language);
    window.open(url, '_blank');
    toast.success(t('cart.order_sent'));
  }

  function handleCopy() {
    if (!settings) return;
    const { message } = buildWhatsAppUrl(state.items, settings, i18n.language);
    navigator.clipboard.writeText(message).then(() => {
      toast.success(t('cart.copied'));
    });
  }

  return (
    <div className="pt-4 border-t border-lupe-blue space-y-3">
      <div className="flex justify-between font-semibold text-lg">
        <span>{t('cart.total')}</span>
        <span className="text-lupe-blue">{formatPrice(total)}</span>
      </div>

      <Button onClick={handlePurchase} size="lg" className="w-full">
        <MessageCircle size={18} />
        {t('cart.purchase')}
      </Button>

      <Button onClick={handleCopy} variant="outline" size="md" className="w-full border-lupe-blue text-lupe-blue hover:bg-white">
        <Copy size={15} />
        {t('cart.copy_order')}
      </Button>

      <Button
        onClick={() => dispatch({ type: 'CLEAR_CART' })}
        variant="ghost"
        size="sm"
        className="w-full text-red-500 hover:bg-red-50"
      >
        {t('cart.clear')}
      </Button>
    </div>
  );
}

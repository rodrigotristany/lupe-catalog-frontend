import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../hooks/useCart';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { Button } from '../ui/Button';

export function CartDrawer({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { state } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-lupe-blue">
          <h2 className="font-semibold text-gray-800 text-lg">{t('cart.title')}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label={t('common.close')}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-lupe-light-blue" />
              <p className="text-gray-500">{t('cart.empty')}</p>
              <Button variant="secondary" onClick={onClose} as={Link} to="/">
                {t('cart.empty_cta')}
              </Button>
            </div>
          ) : (
            state.items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))
          )}
        </div>

        {state.items.length > 0 && (
          <div className="p-4 border-t border-lupe-blue">
            <CartSummary />
          </div>
        )}
      </div>
    </>
  );
}

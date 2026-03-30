import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export function CartPage() {
  const { t } = useTranslation();
  const { state } = useCart();

  return (
    <>
      <Helmet><title>{t('cart.title')} | LUPE</title></Helmet>

      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-lupe-600 hover:text-lupe-800">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-colab text-2xl font-bold text-lupe-800">{t('cart.title')}</h1>
        </div>

        {state.items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={t('cart.empty')}
            action={
              <Button as={Link} to="/" variant="secondary">
                {t('cart.empty_cta')}
              </Button>
            }
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-2">
            {state.items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
            <div className="pt-4">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

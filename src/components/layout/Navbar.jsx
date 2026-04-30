import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../hooks/useCart';
import { CartDrawer } from '../cart/CartDrawer';
import { useSettings } from '../../hooks/useSettings';
import lupeLogo from '../../assets/lupe_pink.svg';

export function Navbar() {
  const { t } = useTranslation();
  const { state } = useCart();
  const { data: settings } = useSettings();
  const [cartOpen, setCartOpen] = useState(false);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const storeName = settings?.store_name || 'LUPE';

  return (
    <>
      <header className="sticky top-0 z-40 bg-lupe-blue shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center py-3 md:py-4 lg:py-5">
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 sm:relative sm:left-auto sm:translate-x-0">
              <img src={lupeLogo} alt="LUPE" className="h-10 md:h-[75px] lg:h-[120px] w-auto" />
            </Link>

            <nav className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-lupe-light-pink"
                aria-label={t('nav.cart')}
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">{t('nav.cart')}</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-lupe-blue text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

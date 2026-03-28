import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { imageUrl } from '../../utils/imageUrl';
import { localizedField } from '../../utils/i18nField';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';
import { Button } from '../ui/Button';

export function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useCart();

  const name = localizedField(product, 'name', i18n.language);
  const cartItem = state.items.find((i) => i.productId === product.id);

  function handleAddToCart(e) {
    e.preventDefault();
    dispatch({ type: 'ADD_ITEM', payload: { product } });
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
    >
      <div className="aspect-square overflow-hidden bg-lupe-light-blue">
        <img
          src={imageUrl(product.primary_image)}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 line-clamp-2 leading-snug">{name}</h3>
          <p className="text-lupe-blue font-semibold mt-1">{formatPrice(product.price)}</p>
        </div>

        {/* Mobile: icon-only button */}
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddToCart}
          className="w-full sm:hidden"
          aria-label={cartItem ? t('catalog.in_cart', { count: cartItem.quantity }) : t('catalog.add_to_cart')}
        >
          {cartItem ? <Check size={16} /> : <><ShoppingCart size={16} /></>}
        </Button>

        {/* Desktop: full label button */}
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddToCart}
          className="w-full hidden sm:flex"
        >
          {cartItem ? (
            <>
              <Check size={14} />
              {t('catalog.in_cart', { count: cartItem.quantity })}
            </>
          ) : (
            <>
              <ShoppingCart size={14} />
              {t('catalog.add_to_cart')}
            </>
          )}
        </Button>
      </div>
    </Link>
  );
}

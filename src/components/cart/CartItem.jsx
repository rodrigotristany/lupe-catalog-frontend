import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { imageUrl } from '../../utils/imageUrl';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';

export function CartItem({ item }) {
  const { t, i18n } = useTranslation();
  const { dispatch } = useCart();
  const name = (i18n.language === 'en' ? item.nameEn : item.nameEs) || item.nameEs || item.nameEn || '';

  return (
    <div className="flex gap-3 py-3 border-b border-gray-200 last:border-0">
      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-lupe-light-blue">
        <img
          src={imageUrl(item.primaryImage)}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
        <p className="text-sm text-lupe-blue font-semibold mt-0.5">{formatPrice(item.price)}</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.productId, quantity: item.quantity - 1 } })}
            className="w-6 h-6 rounded-full bg-lupe-light-blue hover:bg-lupe-blue hover:text-white flex items-center justify-center text-lupe-blue"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
          <button
            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.productId, quantity: item.quantity + 1 } })}
            className="w-6 h-6 rounded-full bg-lupe-light-blue hover:bg-lupe-blue hover:text-white flex items-center justify-center text-lupe-blue"
          >
            <Plus size={12} />
          </button>

          <button
            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { productId: item.productId } })}
            className="ml-auto text-red-400 hover:text-red-600"
            aria-label={t('cart.remove')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

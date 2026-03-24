import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { imageUrl } from '../../utils/imageUrl';
import { localizedField } from '../../utils/i18nField';
import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../hooks/useCart';
import { Button } from '../ui/Button';

export function ProductDetail({ product }) {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useCart();
  const [activeIdx, setActiveIdx] = useState(0);

  const name = localizedField(product, 'name', i18n.language);
  const description = localizedField(product, 'description', i18n.language);
  const cartItem = state.items.find((i) => i.productId === product.id);
  const images = product.images?.length ? product.images : [{ image_url: product.primary_image }];

  function prev() {
    setActiveIdx((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setActiveIdx((i) => (i + 1) % images.length);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-lupe-600 hover:text-lupe-800 mb-6"
      >
        <ArrowLeft size={16} />
        {t('product.back')}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-lupe-100">
            <img
              src={imageUrl(images[activeIdx]?.image_url)}
              alt={name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    idx === activeIdx ? 'border-lupe-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={imageUrl(img.image_url)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-800">{name}</h1>
            <p className="text-2xl font-semibold text-lupe-600 mt-2">{formatPrice(product.price)}</p>
          </div>

          {description && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {t('product.description')}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
            </div>
          )}

          {product.category && (
            <p className="text-sm text-gray-500">
              <span className="font-medium">{t('product.category')}: </span>
              {localizedField(product.category, 'name', i18n.language)}
            </p>
          )}

          <Button
            variant={cartItem ? 'secondary' : 'primary'}
            size="lg"
            onClick={() => dispatch({ type: 'ADD_ITEM', payload: { product } })}
            className="mt-auto"
          >
            {cartItem ? (
              <>
                <Check size={18} />
                {t('product.in_cart', { count: cartItem.quantity })}
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                {t('product.add_to_cart')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

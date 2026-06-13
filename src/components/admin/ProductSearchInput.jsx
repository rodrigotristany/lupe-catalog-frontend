import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { getAdminProducts } from '../../api/admin';
import { formatPrice } from '../../utils/formatPrice';
import { useDebounce } from '../../hooks/useDebounce';

export function ProductSearchInput({ value, onSelect, excludeIds = [] }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(value?.name_es ?? '');
  const [isTyping, setIsTyping] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const debouncedQuery = useDebounce(inputValue, 300);

  useEffect(() => {
    if (!value) {
      if (!isTyping) setInputValue('');
    } else {
      setInputValue(value.name_es);
      setIsTyping(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.id]);

  const { data: resultsData } = useQuery({
    queryKey: ['admin', 'products', 'search', debouncedQuery],
    queryFn: () => getAdminProducts({ search: debouncedQuery, per_page: 20 }),
    enabled: isTyping && debouncedQuery.length > 0,
    staleTime: 10_000,
  });

  const allProducts = Array.isArray(resultsData) ? resultsData : (resultsData?.items ?? []);
  const products = allProducts.filter(p => !excludeIds.includes(p.id));

  function handleInputChange(e) {
    setInputValue(e.target.value);
    setIsTyping(true);
    if (value) onSelect(null);
    setOpen(true);
    setHighlighted(0);
  }

  function handleFocus() {
    if (isTyping && inputValue) setOpen(true);
  }

  function handleBlur() {
    setOpen(false);
    if (value) {
      setInputValue(value.name_es);
      setIsTyping(false);
    } else {
      setInputValue('');
      setIsTyping(false);
    }
  }

  function handleSelect(product) {
    setInputValue(product.name_es);
    setIsTyping(false);
    setOpen(false);
    onSelect(product);
  }

  function handleKeyDown(e) {
    if (!open || products.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, products.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (products[highlighted]) handleSelect(products[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      if (value) setInputValue(value.name_es);
      else { setInputValue(''); setIsTyping(false); }
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={t('admin.search_product')}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-lupe-400 focus:border-transparent"
        />
      </div>
      {open && products.length > 0 && (
        <div
          onMouseDown={e => e.preventDefault()}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-48 overflow-y-auto"
        >
          {products.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`px-3 py-2 cursor-pointer flex items-center justify-between ${
                idx === highlighted ? 'bg-lupe-50' : 'hover:bg-gray-50'
              }`}
            >
              <span className="font-medium text-gray-800 text-sm truncate pr-2">{p.name_es}</span>
              <span className="text-xs text-gray-500 flex-shrink-0">{formatPrice(p.price)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

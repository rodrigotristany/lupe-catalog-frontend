import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { getAdminProducts } from '../../api/admin';
import { formatPrice } from '../../utils/formatPrice';
import { useDebounce } from '../../hooks/useDebounce';

export function ProductSearchInput({ value, onSelect, excludeIds = [] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);

  function openDropdown() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlighted(0);
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleOutside(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  // Close on scroll so the fixed dropdown doesn't drift away from the trigger,
  // but ignore scrolls that happen inside the dropdown itself.
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    function handleScroll(e) {
      if (dropdownRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [open]);

  const { data: resultsData } = useQuery({
    queryKey: ['admin', 'products', 'selector', debouncedQuery],
    queryFn: () => getAdminProducts({ ...(debouncedQuery ? { search: debouncedQuery } : {}), per_page: 50 }),
    enabled: open,
    staleTime: 30_000,
  });

  const allProducts = Array.isArray(resultsData) ? resultsData : (resultsData?.items ?? []);
  const products = allProducts.filter(p => !excludeIds.includes(p.id));

  function handleSelect(product) {
    onSelect(product);
    setOpen(false);
  }

  function handleKeyDown(e) {
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
    }
  }

  return (
    <div ref={containerRef}>
      {/* Trigger button — height never changes */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => open ? setOpen(false) : openDropdown()}
        className="w-full flex items-center justify-between rounded-lg border border-gray-300 px-3 py-2 text-sm text-left hover:border-lupe-400 focus:outline-none focus:ring-2 focus:ring-lupe-400 focus:border-transparent transition-colors"
      >
        <span className={`truncate ${value ? 'font-medium text-gray-800' : 'text-gray-400'}`}>
          {value ? value.name_es : t('admin.search_product')}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 flex-shrink-0 ml-2 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Fixed dropdown — overlays everything, unaffected by ancestor overflow */}
      {open && (
        <div
          ref={dropdownRef}
          className="fixed z-50 bg-white rounded-lg border border-gray-200 shadow-lg"
          style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
        >
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
              onKeyDown={handleKeyDown}
              placeholder={t('admin.search_product')}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-lupe-400 focus:border-lupe-400"
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {products.length === 0 ? (
              <p className="px-3 py-3 text-sm text-gray-400 text-center">Sin resultados</p>
            ) : (
              products.map((p, idx) => (
                <div
                  key={p.id}
                  onMouseDown={() => handleSelect(p)}
                  className={`px-3 py-2 cursor-pointer flex items-center justify-between gap-2 ${
                    idx === highlighted ? 'bg-lupe-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium text-gray-800 text-sm truncate">{p.name_es}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">{formatPrice(p.price)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

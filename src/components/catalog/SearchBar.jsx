import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SearchBar({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('catalog.search_placeholder')}
        className="w-full pl-9 pr-9 py-2 rounded-xl border border-lupe-blue bg-white text-sm focus:outline-none focus:ring-2 focus:ring-lupe-blue focus:border-transparent"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

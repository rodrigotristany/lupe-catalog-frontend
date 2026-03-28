import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, X } from 'lucide-react';
import { localizedField } from '../../utils/i18nField';

export function CategoryFilter({ categories = [], selected, onSelect }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const selectedLabel = selected
    ? localizedField(categories.find((c) => c.slug === selected), 'name', i18n.language)
    : t('catalog.all_categories');

  const pills = (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => { onSelect(null); setOpen(false); }}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !selected ? 'bg-lupe-blue text-white' : 'bg-lupe-light-blue text-lupe-blue hover:bg-lupe-blue hover:text-white'
        }`}
      >
        {t('catalog.all_categories')}
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => { onSelect(cat.slug); setOpen(false); }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === cat.slug
              ? 'bg-lupe-blue text-white'
              : 'bg-lupe-light-blue text-lupe-blue hover:bg-lupe-blue hover:text-white'
          }`}
        >
          {localizedField(cat, 'name', i18n.language)}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile: toggle button */}
      <div className="sm:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-lupe-200 text-sm font-medium text-lupe-700 bg-white hover:bg-lupe-50 transition-colors"
        >
          {open ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
          {t('catalog.filter_by', 'Filter')}: {selectedLabel}
        </button>

        {open && <div className="mt-2">{pills}</div>}
      </div>

      {/* Desktop: always visible */}
      <div className="hidden sm:block">{pills}</div>
    </>
  );
}

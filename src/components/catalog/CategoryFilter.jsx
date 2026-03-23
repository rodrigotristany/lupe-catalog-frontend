import { useTranslation } from 'react-i18next';
import { localizedField } from '../../utils/i18nField';

export function CategoryFilter({ categories = [], selected, onSelect }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !selected
            ? 'bg-lupe-500 text-white'
            : 'bg-lupe-100 text-lupe-700 hover:bg-lupe-200'
        }`}
      >
        {t('catalog.all_categories')}
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected === cat.id
              ? 'bg-lupe-500 text-white'
              : 'bg-lupe-100 text-lupe-700 hover:bg-lupe-200'
          }`}
        >
          {localizedField(cat, 'name', i18n.language)}
        </button>
      ))}
    </div>
  );
}

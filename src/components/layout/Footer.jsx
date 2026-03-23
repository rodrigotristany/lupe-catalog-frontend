import { useTranslation } from 'react-i18next';
import { useSettings } from '../../hooks/useSettings';

export function Footer() {
  const { t } = useTranslation();
  const { data: settings } = useSettings();
  const storeName = settings?.store_name || 'LUPE';

  return (
    <footer className="bg-lupe-900 text-lupe-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="font-display text-xl font-semibold text-lupe-100 mb-1">{storeName}</p>
          <p className="text-sm text-lupe-400">
            &copy; {new Date().getFullYear()} {storeName}. Artesanías hechas a mano con amor.
          </p>
        </div>
      </div>
    </footer>
  );
}

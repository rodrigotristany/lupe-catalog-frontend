import { useTranslation } from 'react-i18next';
import { useSettings } from '../../hooks/useSettings';
import lupeLogo from '../../assets/lupe_pink.svg';

export function Footer() {
  const { t } = useTranslation();
  const { data: settings } = useSettings();
  const storeName = settings?.store_name || 'LUPE';

  return (
    <footer className="bg-lupe-blue text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <img src={lupeLogo} alt="LUPE" className="h-10 w-auto mx-auto mb-3" />
          <p className="text-sm text-lupe-light-pink">
            &copy; {new Date().getFullYear()} {storeName}. Belleza en lo cotidiano.
          </p>
        </div>
      </div>
    </footer>
  );
}

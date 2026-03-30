import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-64 gap-6 text-center">
      <p className="font-colab text-6xl font-bold text-lupe-300">404</p>
      <p className="text-gray-500 text-lg">{t('common.error')}</p>
      <Button as={Link} to="/">{t('nav.home')}</Button>
    </div>
  );
}

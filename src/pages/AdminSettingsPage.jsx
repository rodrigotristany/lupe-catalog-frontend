import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../hooks/useSettings';
import { SettingsForm } from '../components/admin/SettingsForm';
import { FullPageSpinner } from '../components/ui/Spinner';

export function AdminSettingsPage() {
  const { t } = useTranslation();
  const { data: settings, isLoading } = useSettings();

  return (
    <>
      <Helmet>
        <title>{t('admin.settings')} | LUPE Admin</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="font-colab text-2xl font-bold text-gray-800 mb-6">{t('admin.settings')}</h1>

      {isLoading ? <FullPageSpinner /> : <SettingsForm settings={settings} />}
    </>
  );
}

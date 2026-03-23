import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useProduct } from '../hooks/useProducts';
import { ProductDetail } from '../components/catalog/ProductDetail';
import { FullPageSpinner } from '../components/ui/Spinner';
import { localizedField } from '../utils/i18nField';
import { imageUrl } from '../utils/imageUrl';

export function ProductPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { data: product, isLoading } = useProduct(id);

  if (isLoading) return <FullPageSpinner />;
  if (!product) return <p className="text-center py-16 text-gray-400">{t('common.error')}</p>;

  const name = localizedField(product, 'name', i18n.language);
  const description = localizedField(product, 'description', i18n.language);

  return (
    <>
      <Helmet>
        <title>{name} | LUPE</title>
        <meta name="description" content={description?.slice(0, 160)} />
        <meta property="og:image" content={imageUrl(product.primary_image)} />
      </Helmet>
      <ProductDetail product={product} />
    </>
  );
}

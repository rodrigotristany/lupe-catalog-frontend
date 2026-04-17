import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useProduct } from '../hooks/useProducts';
import { ProductForm } from '../components/admin/ProductForm';
import { ImageUploader } from '../components/admin/ImageUploader';
import { ProductHistory } from '../components/admin/ProductHistory';
import { FullPageSpinner } from '../components/ui/Spinner';

export function AdminProductEditPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const isNew = !id;
  const { data: product, isLoading } = useProduct(id);
  const [coverImageId, setCoverImageId] = useState(null);

  useEffect(() => {
    if (product) setCoverImageId(product.cover_image_id ?? null);
  }, [product?.cover_image_id]);

  const title = isNew ? t('admin.new_product') : t('admin.edit_product');

  if (!isNew && isLoading) return <FullPageSpinner />;

  return (
    <>
      <Helmet>
        <title>{title} | LUPE Admin</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="font-colab text-2xl font-bold text-gray-800 mb-6">{title}</h1>

      <div className="space-y-10">
        <ProductForm product={isNew ? null : product} coverImageId={coverImageId} />

        {!isNew && product && (
          <>
            <section>
              <h2 className="font-semibold text-gray-700 text-lg mb-4">{t('admin.images')}</h2>
              <ImageUploader
                productId={id}
                existingImages={product.images || []}
                coverImageId={coverImageId}
                onCoverChange={setCoverImageId}
              />
            </section>

            <section>
              <h2 className="font-semibold text-gray-700 text-lg mb-4">{t('admin.history')}</h2>
              <ProductHistory productId={id} />
            </section>
          </>
        )}
      </div>
    </>
  );
}

import { useState, useRef } from 'react';
import { UploadCloud, X, Trash2, Star } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { uploadImages, deleteImage } from '../../api/admin';
import { imageUrl } from '../../utils/imageUrl';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

const MAX_IMAGES = 10;
const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function ImageUploader({ productId, existingImages = [], coverImageId = null, onCoverChange }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const inputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [dragging, setDragging] = useState(false);

  const totalCount = existingImages.length + previews.length;

  function addFiles(files) {
    const valid = Array.from(files).filter((f) => ACCEPTED.includes(f.type));
    if (totalCount + valid.length > MAX_IMAGES) {
      toast.error(t('admin.max_images'));
      return;
    }
    const newPreviews = valid.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews((p) => [...p, ...newPreviews]);
  }

  function removePreview(idx) {
    setPreviews((p) => p.filter((_, i) => i !== idx));
  }

  const uploadMutation = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      previews.forEach((p) => formData.append('images', p.file));
      return uploadImages(productId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setPreviews([]);
      toast.success(t('admin.saved'));
    },
    onError: () => toast.error(t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => {
      if (deleteId === coverImageId && onCoverChange) onCoverChange(null);
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast.success(t('admin.deleted'));
      setDeleteId(null);
    },
    onError: () => toast.error(t('common.error')),
  });

  return (
    <div className="space-y-4">
      {/* Existing images */}
      {existingImages.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {existingImages.map((img) => {
            const isCover = img.id === coverImageId;
            return (
              <div key={img.id} className={`relative group w-24 h-24 rounded-lg overflow-hidden border-2 ${isCover ? 'border-lupe-blue' : 'border-gray-200'}`}>
                <img src={imageUrl(img.image_url || img.image_path)} alt="" className="w-full h-full object-cover [image-orientation:from-image]" />

                {isCover && (
                  <span className="absolute top-1 left-1 bg-lupe-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded leading-none pointer-events-none">
                    {t('admin.cover_label')}
                  </span>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                  {!isCover && onCoverChange && (
                    <button
                      onClick={() => onCoverChange(img.id)}
                      className="flex items-center gap-1 text-xs text-white font-medium hover:text-yellow-300 transition-colors"
                      title={t('admin.set_cover')}
                    >
                      <Star size={12} />
                      <span>{t('admin.set_cover')}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteId(img.id)}
                    className="flex items-center justify-center text-white hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging ? 'border-lupe-400 bg-lupe-50' : 'border-lupe-200 hover:border-lupe-400'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
      >
        <UploadCloud size={32} className="mx-auto text-lupe-400 mb-2" />
        <p className="text-sm text-gray-500">{t('admin.drop_images')}</p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max {MAX_IMAGES}</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((p, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-lupe-200">
              <img src={p.url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePreview(idx)}
                className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow text-gray-600 hover:text-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <Button onClick={() => uploadMutation.mutate()} disabled={uploadMutation.isPending}>
          {uploadMutation.isPending ? t('common.loading') : t('common.save')}
        </Button>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title={t('common.delete')}>
        <p className="text-gray-600 mb-6">{t('admin.confirm_delete')}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteId(null)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
            {t('common.delete')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

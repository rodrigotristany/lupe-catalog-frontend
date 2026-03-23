export function imageUrl(path) {
  if (!path) return '/placeholder.jpg';
  return `${import.meta.env.VITE_MEDIA_BASE_URL}/${path}`;
}

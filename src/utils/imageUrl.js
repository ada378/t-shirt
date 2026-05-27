const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || '';

export function getImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/') && API_BASE) return `${API_BASE}${url}`;
  if (url.startsWith('/api/images/') && API_BASE) return `${API_BASE}${url}`;
  if (!url.includes('://') && API_BASE) return `${API_BASE}/uploads/${url.replace(/^uploads\//, '')}`;
  return url;
}

export function getProductImage(product, index = 0) {
  const url = product?.images?.[index]?.url || product?.images?.[0]?.url || product?.image || '';
  return getImageUrl(url);
}

export function getCartItemImage(item) {
  if (item?.image) return getImageUrl(item.image);
  if (item?.product?.images?.[0]?.url) return getImageUrl(item.product.images[0].url);
  return '';
}

export const FALLBACK_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect width="400" height="500" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".1em" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
